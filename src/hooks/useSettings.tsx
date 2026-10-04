import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { getSettings, updateSetting } from '@/src/lib/database';
import type { AppSettings, CardTextAlign, CardTextPlacement, ThemeMode } from '@/src/types';
import type { AppLocale } from '@/src/i18n/locales';

type SettingsContextValue = {
  settings: AppSettings;
  ready: boolean;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
  setReminderTime: (hour: number, minute: number) => Promise<void>;
  setPinnedEventId: (id: string | null) => Promise<void>;
  setCardTextPlacement: (placement: CardTextPlacement) => Promise<void>;
  setCardTextAlign: (align: CardTextAlign) => Promise<void>;
  setWidgetTextPlacement: (placement: CardTextPlacement | null) => Promise<void>;
  setWidgetTextAlign: (align: CardTextAlign | null) => Promise<void>;
  setLocalePreference: (locale: AppLocale) => Promise<void>;
  setHasCompletedOnboarding: (value: boolean) => Promise<void>;
  setIsPro: (value: boolean) => Promise<void>;
  bumpAppOpenCount: () => Promise<number>;
  markProPromptShown: () => Promise<void>;
  refreshSettings: () => Promise<void>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

const defaultSettings: AppSettings = {
  themeMode: 'dark',
  reminderHour: 9,
  reminderMinute: 0,
  pinnedEventId: null,
  cardTextPlacement: 'center',
  cardTextAlign: 'center',
  widgetTextPlacement: null,
  widgetTextAlign: null,
  locale: 'system',
  hasCompletedOnboarding: false,
  isPro: true,
  appOpenCount: 0,
  proPromptCount: 0,
  lastProPromptAt: null,
};

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [ready, setReady] = useState(false);

  const refreshSettings = useCallback(async () => {
    const next = await getSettings();
    setSettings(next);
  }, []);

  useEffect(() => {
    refreshSettings().finally(() => setReady(true));
  }, [refreshSettings]);

  const setThemeMode = useCallback(
    async (mode: ThemeMode) => {
      await updateSetting('themeMode', mode);
      setSettings((prev) => ({ ...prev, themeMode: mode }));
    },
    [],
  );

  const setReminderTime = useCallback(async (hour: number, minute: number) => {
    await updateSetting('reminderHour', hour);
    await updateSetting('reminderMinute', minute);
    setSettings((prev) => ({ ...prev, reminderHour: hour, reminderMinute: minute }));
  }, []);

  const setPinnedEventId = useCallback(async (id: string | null) => {
    await updateSetting('pinnedEventId', id ?? '');
    setSettings((prev) => ({ ...prev, pinnedEventId: id }));
  }, []);

  const setCardTextPlacement = useCallback(async (placement: CardTextPlacement) => {
    await updateSetting('cardTextPlacement', placement);
    setSettings((prev) => ({ ...prev, cardTextPlacement: placement }));
  }, []);

  const setCardTextAlign = useCallback(async (align: CardTextAlign) => {
    await updateSetting('cardTextAlign', align);
    setSettings((prev) => ({ ...prev, cardTextAlign: align }));
  }, []);

  const setWidgetTextPlacement = useCallback(async (placement: CardTextPlacement | null) => {
    await updateSetting('widgetTextPlacement', placement);
    setSettings((prev) => ({ ...prev, widgetTextPlacement: placement }));
  }, []);

  const setWidgetTextAlign = useCallback(async (align: CardTextAlign | null) => {
    await updateSetting('widgetTextAlign', align);
    setSettings((prev) => ({ ...prev, widgetTextAlign: align }));
  }, []);

  const setLocalePreference = useCallback(async (locale: AppLocale) => {
    await updateSetting('locale', locale);
    setSettings((prev) => ({ ...prev, locale }));
  }, []);

  const setHasCompletedOnboarding = useCallback(async (value: boolean) => {
    await updateSetting('hasCompletedOnboarding', value);
    setSettings((prev) => ({ ...prev, hasCompletedOnboarding: value }));
  }, []);

  const setIsPro = useCallback(async (value: boolean) => {
    await updateSetting('isPro', value);
    setSettings((prev) => ({ ...prev, isPro: value }));
  }, []);

  const bumpAppOpenCount = useCallback(async () => {
    const current = await getSettings();
    const next = (current.appOpenCount ?? 0) + 1;
    await updateSetting('appOpenCount', next);
    setSettings((prev) => ({ ...prev, appOpenCount: next }));
    return next;
  }, []);

  const markProPromptShown = useCallback(async () => {
    const nextCount = (await getSettings()).proPromptCount ?? 0;
    const proPromptCount = nextCount + 1;
    const lastProPromptAt = new Date().toISOString();
    await updateSetting('proPromptCount', proPromptCount);
    await updateSetting('lastProPromptAt', lastProPromptAt);
    setSettings((prev) => ({ ...prev, proPromptCount, lastProPromptAt }));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      ready,
      setThemeMode,
      setReminderTime,
      setPinnedEventId,
      setCardTextPlacement,
      setCardTextAlign,
      setWidgetTextPlacement,
      setWidgetTextAlign,
      setLocalePreference,
      setHasCompletedOnboarding,
      setIsPro,
      bumpAppOpenCount,
      markProPromptShown,
      refreshSettings,
    }),
    [
      settings,
      ready,
      setThemeMode,
      setReminderTime,
      setPinnedEventId,
      setCardTextPlacement,
      setCardTextAlign,
      setWidgetTextPlacement,
      setWidgetTextAlign,
      setLocalePreference,
      setHasCompletedOnboarding,
      setIsPro,
      bumpAppOpenCount,
      markProPromptShown,
      refreshSettings,
    ],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

const unsetSettings: SettingsContextValue = {
  settings: defaultSettings,
  ready: false,
  setThemeMode: async () => {},
  setReminderTime: async () => {},
  setPinnedEventId: async () => {},
  setCardTextPlacement: async () => {},
  setCardTextAlign: async () => {},
  setWidgetTextPlacement: async () => {},
  setWidgetTextAlign: async () => {},
  setLocalePreference: async () => {},
  setHasCompletedOnboarding: async () => {},
  setIsPro: async () => {},
  bumpAppOpenCount: async () => 0,
  markProPromptShown: async () => {},
  refreshSettings: async () => {},
};

export function useSettings() {
  return useContext(SettingsContext) ?? unsetSettings;
}
