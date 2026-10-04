import { getLocales } from 'expo-localization';
import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { I18nManager } from 'react-native';

import { useSettings } from '@/src/hooks/useSettings';
import {
  DEFAULT_LOCALE,
  coerceLocale,
  localeFromDeviceTag,
  type AppLocale,
} from '@/src/i18n/locales';
import type { MessageKey } from '@/src/i18n/messages';
import {
  getDateFnsLocale,
  isRtlLocale,
  setActiveLocale,
  translate,
  type TranslateVars,
} from '@/src/i18n/translate';

type I18nContextValue = {
  locale: AppLocale;
  isRTL: boolean;
  t: (key: MessageKey, vars?: TranslateVars) => string;
  setLocale: (locale: AppLocale) => Promise<void>;
  dateFnsLocale: ReturnType<typeof getDateFnsLocale>;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function resolvePreferredLocale(stored?: string | null): AppLocale {
  const saved = coerceLocale(stored);
  if (saved) return saved;
  const deviceTag = getLocales()[0]?.languageTag;
  return localeFromDeviceTag(deviceTag) || DEFAULT_LOCALE;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const { settings, setLocalePreference } = useSettings();
  const locale = resolvePreferredLocale(settings.locale);
  const isRTL = isRtlLocale(locale);

  useEffect(() => {
    setActiveLocale(locale);
    if (I18nManager.isRTL !== isRTL) {
      I18nManager.allowRTL(true);
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL, locale]);

  const t = useCallback(
    (key: MessageKey, vars?: TranslateVars) => translate(key, vars, locale),
    [locale],
  );

  const setLocale = useCallback(
    async (next: AppLocale) => {
      await setLocalePreference(next);
    },
    [setLocalePreference],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      isRTL,
      t,
      setLocale,
      dateFnsLocale: getDateFnsLocale(locale),
    }),
    [isRTL, locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}
