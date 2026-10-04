import { getActiveLocale, translate } from '@/src/i18n/translate';
import type { AppLocale } from '@/src/i18n/locales';
import type { MessageKey } from '@/src/i18n/messages';

type PluralCategory = 'one' | 'two' | 'few' | 'other';

function lang(locale: AppLocale): string {
  return locale.split('-')[0] ?? locale;
}

function arabicCategory(count: number): PluralCategory {
  const n = Math.abs(count);
  if (n === 1) return 'one';
  if (n === 2) return 'two';
  const mod100 = n % 100;
  if (mod100 >= 3 && mod100 <= 10) return 'few';
  return 'other';
}

function russianCategory(count: number): PluralCategory {
  const n = Math.abs(count);
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'one';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'few';
  return 'other';
}

function czechCategory(count: number): PluralCategory {
  const n = Math.abs(count);
  if (n === 1) return 'one';
  if (n >= 2 && n <= 4) return 'few';
  return 'other';
}

function slovenianCategory(count: number): PluralCategory {
  const n = Math.abs(count) % 100;
  if (n === 1) return 'one';
  if (n === 2) return 'two';
  if (n === 3 || n === 4) return 'few';
  return 'other';
}

export function pluralCategory(locale: AppLocale, count: number): PluralCategory {
  const code = lang(locale);
  if (code === 'ar') return arabicCategory(count);
  if (code === 'he') return count === 1 ? 'one' : count === 2 ? 'two' : 'other';
  if (code === 'ru' || code === 'uk' || code === 'hr' || code === 'pl') return russianCategory(count);
  if (code === 'cs' || code === 'sk') return czechCategory(count);
  if (code === 'sl') return slovenianCategory(count);
  return count === 1 ? 'one' : 'other';
}

const DAY_LEFT_KEYS: Record<PluralCategory, MessageKey> = {
  one: 'dayLeftOne',
  two: 'dayLeftTwo',
  few: 'dayLeftFew',
  other: 'dayLeft',
};

const DAY_AGO_KEYS: Record<PluralCategory, MessageKey> = {
  one: 'dayAgoOne',
  two: 'dayAgoTwo',
  few: 'dayAgoFew',
  other: 'dayAgo',
};

export function translateDayLeft(count: number, locale: AppLocale = getActiveLocale()): string {
  const category = pluralCategory(locale, count);
  return translate(DAY_LEFT_KEYS[category], { count }, locale);
}

export function translateDayAgo(count: number, locale: AppLocale = getActiveLocale()): string {
  const category = pluralCategory(locale, count);
  return translate(DAY_AGO_KEYS[category], { count }, locale);
}
