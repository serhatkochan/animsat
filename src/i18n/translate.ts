import { dictionaries } from '@/src/i18n/dictionaries';
import {
  DATE_FNS_LOCALES,
  DEFAULT_LOCALE,
  RTL_LOCALES,
  type AppLocale,
} from '@/src/i18n/locales';
import { trMessages, type MessageKey } from '@/src/i18n/messages';

export type TranslateVars = Record<string, string | number>;

let activeLocale: AppLocale = DEFAULT_LOCALE;

export function getActiveLocale(): AppLocale {
  return activeLocale;
}

export function setActiveLocale(locale: AppLocale): void {
  activeLocale = locale;
}

export function isRtlLocale(locale: AppLocale = activeLocale): boolean {
  return RTL_LOCALES.includes(locale);
}

export function getDateFnsLocale(locale: AppLocale = activeLocale) {
  return DATE_FNS_LOCALES[locale];
}

export function translate(
  key: MessageKey,
  vars?: TranslateVars,
  locale: AppLocale = activeLocale,
): string {
  const table = dictionaries[locale] ?? trMessages;
  let text = table[key] ?? trMessages[key] ?? key;
  if (vars) {
    for (const [name, value] of Object.entries(vars)) {
      text = text.replaceAll(`{${name}}`, String(value));
    }
  }
  return text;
}
