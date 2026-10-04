import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { format } from 'date-fns';

import { DEFAULT_CATEGORY_ID } from '@/src/constants/categories';
import {
  deleteEvent as deleteEventDb,
  getAllCategories,
  getAllEvents,
  getEventById,
  initDatabase,
  insertEvent,
  updateEvent as updateEventDb,
} from '@/src/lib/database';
import { syncGradientLegacyFields } from '@/src/lib/gradientUtils';
import { calculateDayCount, toIsoDate } from '@/src/lib/dateUtils';
import { createId } from '@/src/lib/id';
import {
  getPersistedEventPhotoUri,
  persistEventPhoto,
} from '@/src/lib/eventPhotoStorage';
import * as FileSystem from 'expo-file-system/legacy';
import {
  cancelEventNotifications,
  scheduleEventNotifications,
  syncAllNotifications,
} from '@/src/lib/notifications';
import { syncCountdownWidget } from '@/src/lib/widgetSync';
import { useSettings } from '@/src/hooks/useSettings';
import type {
  Category,
  CountdownEvent,
  EventFormData,
  EventWithMeta,
} from '@/src/types';

type EventsContextValue = {
  events: EventWithMeta[];
  categories: Category[];
  ready: boolean;
  addEvent: (form: EventFormData) => Promise<CountdownEvent>;
  updateEvent: (id: string, form: EventFormData) => Promise<CountdownEvent>;
  removeEvent: (id: string) => Promise<void>;
  getEvent: (id: string) => EventWithMeta | undefined;
  refreshEvents: () => Promise<void>;
  tickDayCounts: () => void;
};

const EventsContext = createContext<EventsContextValue | null>(null);

function enrichEvents(events: CountdownEvent[], categories: Category[]): EventWithMeta[] {
  const categoryMap = Object.fromEntries(categories.map((c) => [c.id, c]));

  return events
    .map((event) => {
      const { dayCount, effectiveDate } = calculateDayCount(
        event.type,
        event.date,
        event.repeatYearly,
      );
      return {
        ...event,
        dayCount,
        effectiveDate,
        category: categoryMap[event.categoryId],
      };
    })
    .sort((a, b) => a.dayCount - b.dayCount);
}

async function withPersistedPhoto(event: CountdownEvent): Promise<CountdownEvent> {
  if (event.backgroundType !== 'photo' || !event.backgroundImageUri) {
    return event;
  }

  const currentUri = event.backgroundImageUri.startsWith('file://')
    ? event.backgroundImageUri.split('?')[0]
    : `file://${event.backgroundImageUri.split('?')[0]}`;
  const sourceInfo = await FileSystem.getInfoAsync(currentUri);

  if (sourceInfo.exists) {
    if (currentUri.includes('/event-backgrounds/')) {
      return { ...event, backgroundImageUri: currentUri };
    }

    try {
      const backgroundImageUri = await persistEventPhoto(
        event.id,
        currentUri,
        event.backgroundImageUri,
      );
      return { ...event, backgroundImageUri };
    } catch (error) {
      console.warn('Fotoğraf kalıcı hale getirilemedi:', error);
      return { ...event, backgroundImageUri: currentUri };
    }
  }

  const persisted = await getPersistedEventPhotoUri(event.id);
  if (persisted) {
    return { ...event, backgroundImageUri: persisted };
  }

  throw new Error('Fotoğraf bulunamadı. Lütfen yeniden seçin.');
}

function formToEvent(form: EventFormData, existing?: CountdownEvent): CountdownEvent {
  const now = new Date().toISOString();
  const isPhoto = form.backgroundType === 'photo' && Boolean(form.backgroundImageUri);
  const gradient = isPhoto ? null : syncGradientLegacyFields(form.gradientColors);

  return {
    id: existing?.id ?? form.id ?? createId(),
    title: form.title.trim(),
    date: toIsoDate(form.date),
    type: 'countdown',
    repeatYearly: false,
    categoryId: existing?.categoryId ?? DEFAULT_CATEGORY_ID,
    color: gradient?.color ?? form.gradientColors[0],
    colorSecondary: gradient?.colorSecondary,
    gradientColors: gradient?.gradientColors,
    backgroundType: isPhoto ? 'photo' : 'gradient',
    backgroundImageUri: isPhoto ? form.backgroundImageUri : undefined,
    backgroundImageTransform: isPhoto ? form.backgroundImageTransform : undefined,
    widgetTextScale: isPhoto
      ? existing?.widgetTextScale ?? existing?.homeScreenWidgetScale ?? existing?.lockScreenWidgetScale ?? 100
      : undefined,
    remindersEnabled: form.remindersEnabled,
    reminderDays: [],
    location: form.location?.trim() || undefined,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

async function syncEventNotifications(
  event: CountdownEvent,
  reminderHour: number,
  reminderMinute: number,
): Promise<void> {
  try {
    await scheduleEventNotifications(event, reminderHour, reminderMinute);
  } catch (error) {
    console.warn('Bildirimler planlanamadı:', error);
  }
}

export function EventsProvider({ children }: { children: React.ReactNode }) {
  const { settings, ready: settingsReady, setPinnedEventId } = useSettings();
  const [events, setEvents] = useState<CountdownEvent[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ready, setReady] = useState(false);
  const [dayVersion, setDayVersion] = useState(0);
  const lastTickDayRef = useRef('');

  const tickDayCounts = useCallback(() => {
    const todayKey = format(new Date(), 'yyyy-MM-dd');
    if (lastTickDayRef.current === todayKey) return;
    lastTickDayRef.current = todayKey;
    setDayVersion((version) => version + 1);
  }, []);

  const refreshEvents = useCallback(async () => {
    const [nextEvents, nextCategories] = await Promise.all([
      getAllEvents(),
      getAllCategories(),
    ]);
    setEvents(nextEvents);
    setCategories(nextCategories);
  }, []);

  useEffect(() => {
    initDatabase()
      .then(refreshEvents)
      .finally(() => setReady(true));
  }, [refreshEvents]);

  useEffect(() => {
    if (!ready || !settingsReady) return;
    syncAllNotifications(events, settings.reminderHour, settings.reminderMinute).catch((error) => {
      console.warn('Bildirimler senkronize edilemedi:', error);
    });
  }, [events, ready, settingsReady, settings.reminderHour, settings.reminderMinute]);

  const enrichedEvents = useMemo(
    () => enrichEvents(events, categories),
    [events, categories, dayVersion],
  );

  useEffect(() => {
    if (!ready || !settingsReady) return;
    void syncCountdownWidget(enrichedEvents, {
      pinnedEventId: settings.pinnedEventId,
      cardTextPlacement: settings.cardTextPlacement,
      cardTextAlign: settings.cardTextAlign,
      widgetTextPlacement: settings.widgetTextPlacement,
      widgetTextAlign: settings.widgetTextAlign,
    });
  }, [
    enrichedEvents,
    ready,
    settingsReady,
    settings.pinnedEventId,
    settings.cardTextPlacement,
    settings.cardTextAlign,
    settings.widgetTextPlacement,
    settings.widgetTextAlign,
  ]);

  const addEvent = useCallback(
    async (form: EventFormData) => {
      const event = await withPersistedPhoto(formToEvent(form));
      await insertEvent(event);
      await syncEventNotifications(event, settings.reminderHour, settings.reminderMinute);
      await refreshEvents();
      return event;
    },
    [refreshEvents, settings.reminderHour, settings.reminderMinute],
  );

  const updateEvent = useCallback(
    async (id: string, form: EventFormData) => {
      const existing = await getEventById(id);
      if (!existing) throw new Error('Etkinlik bulunamadı');

      const event = await withPersistedPhoto(formToEvent(form, existing));

      await cancelEventNotifications(id);
      await updateEventDb(event);
      await syncEventNotifications(event, settings.reminderHour, settings.reminderMinute);
      await refreshEvents();
      return event;
    },
    [refreshEvents, settings.reminderHour, settings.reminderMinute],
  );

  const removeEvent = useCallback(
    async (id: string) => {
      await cancelEventNotifications(id);
      await deleteEventDb(id);
      if (settings.pinnedEventId === id) {
        await setPinnedEventId(null);
      }
      await refreshEvents();
    },
    [refreshEvents, settings.pinnedEventId, setPinnedEventId],
  );

  const getEvent = useCallback(
    (id: string) => enrichedEvents.find((event) => event.id === id),
    [enrichedEvents],
  );

  const value = useMemo(
    () => ({
      events: enrichedEvents,
      categories,
      ready,
      addEvent,
      updateEvent,
      removeEvent,
      getEvent,
      refreshEvents,
      tickDayCounts,
    }),
    [
      enrichedEvents,
      categories,
      ready,
      addEvent,
      updateEvent,
      removeEvent,
      getEvent,
      refreshEvents,
      tickDayCounts,
    ],
  );

  return <EventsContext.Provider value={value}>{children}</EventsContext.Provider>;
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error('useEvents must be used within EventsProvider');
  }
  return context;
}
