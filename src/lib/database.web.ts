import { DEFAULT_CATEGORIES } from '@/src/constants/categories';
import type { AppSettings, BackgroundType, Category, CountdownEvent } from '@/src/types';

const STORAGE_KEY = 'kac_gun_kaldi_v1';

type WebStore = {
  events: CountdownEvent[];
  categories: Category[];
  settings: Record<string, string>;
};

function normalizeEvent(event: CountdownEvent): CountdownEvent {
  return {
    ...event,
    backgroundType: event.backgroundType ?? 'gradient',
    remindersEnabled: event.remindersEnabled ?? true,
    reminderDays: event.reminderDays ?? [],
    gradientColors: event.gradientColors,
    homeScreenWidgetScale: event.homeScreenWidgetScale ?? 100,
    lockScreenWidgetScale: event.lockScreenWidgetScale ?? 100,
    widgetTextScale: event.widgetTextScale ?? event.homeScreenWidgetScale ?? event.lockScreenWidgetScale ?? 100,
  };
}

function defaultStore(): WebStore {
  return {
    events: [],
    categories: [...DEFAULT_CATEGORIES],
    settings: {
      themeMode: 'dark',
      reminderHour: '9',
      reminderMinute: '0',
      pinnedEventId: '',
      cardTextPlacement: 'center',
      cardTextAlign: 'center',
    },
  };
}

function readStore(): WebStore {
  if (typeof localStorage === 'undefined') {
    return defaultStore();
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return defaultStore();

  try {
    const parsed = JSON.parse(raw) as WebStore;
    return {
      events: (parsed.events ?? []).map(normalizeEvent),
      categories: parsed.categories?.length ? parsed.categories : [...DEFAULT_CATEGORIES],
      settings: { ...defaultStore().settings, ...parsed.settings },
    };
  } catch {
    return defaultStore();
  }
}

function writeStore(store: WebStore): void {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export async function initDatabase(): Promise<void> {
  readStore();
}

export async function getAllEvents(): Promise<CountdownEvent[]> {
  const store = readStore();
  return [...store.events].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function getEventById(id: string): Promise<CountdownEvent | null> {
  const store = readStore();
  return store.events.find((event) => event.id === id) ?? null;
}

export async function insertEvent(event: CountdownEvent): Promise<void> {
  const store = readStore();
  store.events.push(normalizeEvent(event));
  writeStore(store);
}

export async function updateEvent(event: CountdownEvent): Promise<void> {
  const store = readStore();
  store.events = store.events.map((item) =>
    item.id === event.id ? normalizeEvent(event) : item,
  );
  writeStore(store);
}

export async function deleteEvent(id: string): Promise<void> {
  const store = readStore();
  store.events = store.events.filter((event) => event.id !== id);
  writeStore(store);
}

export async function getAllCategories(): Promise<Category[]> {
  const store = readStore();
  return [...store.categories].sort((a, b) => a.name.localeCompare(b.name, 'tr'));
}

export async function getSettings(): Promise<AppSettings> {
  const store = readStore();
  return {
    themeMode: (store.settings.themeMode as AppSettings['themeMode']) ?? 'dark',
    reminderHour: Number(store.settings.reminderHour ?? 9),
    reminderMinute: Number(store.settings.reminderMinute ?? 0),
    pinnedEventId: store.settings.pinnedEventId ? store.settings.pinnedEventId : null,
    cardTextPlacement:
      (store.settings.cardTextPlacement as AppSettings['cardTextPlacement']) ?? 'center',
    cardTextAlign: (store.settings.cardTextAlign as AppSettings['cardTextAlign']) ?? 'center',
    widgetTextPlacement: store.settings.widgetTextPlacement
      ? (store.settings.widgetTextPlacement as AppSettings['widgetTextPlacement'])
      : null,
    widgetTextAlign: store.settings.widgetTextAlign
      ? (store.settings.widgetTextAlign as AppSettings['widgetTextAlign'])
      : null,
    locale: store.settings.locale ?? 'system',
    hasCompletedOnboarding: store.settings.hasCompletedOnboarding === 'true',
    isPro: true,
    appOpenCount: Number(store.settings.appOpenCount ?? 0),
    proPromptCount: Number(store.settings.proPromptCount ?? 0),
    lastProPromptAt: store.settings.lastProPromptAt || null,
  };
}

export async function updateSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K],
): Promise<void> {
  const store = readStore();
  store.settings[key] = String(value);
  writeStore(store);
}
