import {
  arSA,
  bn,
  ca,
  cs,
  da,
  de,
  el,
  enAU,
  enCA,
  enGB,
  enUS,
  es,
  fi,
  fr,
  frCA,
  gu,
  he,
  hi,
  hr,
  hu,
  id,
  it,
  ja,
  kn,
  ko,
  ms,
  nb,
  nl,
  pl,
  pt,
  ptBR,
  ro,
  ru,
  sk,
  sl,
  sv,
  ta,
  te,
  th,
  tr,
  uk,
  vi,
  zhCN,
  zhTW,
} from 'date-fns/locale';
import type { Locale as DateFnsLocale } from 'date-fns';

const dmy = { full: 'd MMMM yyyy', short: 'd MMM', time: 'HH:mm' } as const;
const dmyDot = { full: 'd. MMMM yyyy', short: 'd. MMM', time: 'HH:mm' } as const;
const mdy = { full: 'MMM d, yyyy', short: 'MMM d', time: 'h:mm a' } as const;
const dmy12 = { full: 'd MMMM yyyy', short: 'd MMM', time: 'h:mm a' } as const;
const ymdJa = { full: 'yyyy年M月d日', short: 'M月d日', time: 'HH:mm' } as const;
const ymdKo = { full: 'yyyy년 M월 d일', short: 'M월 d일', time: 'HH:mm' } as const;
const ymdHu = { full: 'yyyy. MMMM d.', short: 'MMM d.', time: 'HH:mm' } as const;

export const APP_LOCALES = [
  { id: 'tr', nativeName: 'Türkçe', picker: 'tr-TR', date: dmy },
  { id: 'ar-SA', nativeName: 'العربية', picker: 'ar-SA', date: dmy, rtl: true },
  { id: 'bn', nativeName: 'বাংলা', picker: 'bn-BD', date: dmy },
  { id: 'ca', nativeName: 'Català', picker: 'ca-ES', date: dmy },
  { id: 'zh-Hans', nativeName: '简体中文', picker: 'zh-CN', date: ymdJa },
  { id: 'zh-Hant', nativeName: '繁體中文', picker: 'zh-TW', date: ymdJa },
  { id: 'hr', nativeName: 'Hrvatski', picker: 'hr-HR', date: dmyDot },
  { id: 'cs', nativeName: 'Čeština', picker: 'cs-CZ', date: dmyDot },
  { id: 'da', nativeName: 'Dansk', picker: 'da-DK', date: dmyDot },
  { id: 'nl-NL', nativeName: 'Nederlands', picker: 'nl-NL', date: dmy },
  { id: 'en-AU', nativeName: 'English (Australia)', picker: 'en-AU', date: dmy12 },
  { id: 'en-CA', nativeName: 'English (Canada)', picker: 'en-CA', date: mdy },
  { id: 'en-GB', nativeName: 'English (U.K.)', picker: 'en-GB', date: dmy },
  { id: 'en-US', nativeName: 'English (U.S.)', picker: 'en-US', date: mdy },
  { id: 'fi', nativeName: 'Suomi', picker: 'fi-FI', date: dmyDot },
  { id: 'fr-FR', nativeName: 'Français', picker: 'fr-FR', date: dmy },
  { id: 'fr-CA', nativeName: 'Français (Canada)', picker: 'fr-CA', date: dmy },
  { id: 'de-DE', nativeName: 'Deutsch', picker: 'de-DE', date: dmyDot },
  { id: 'el', nativeName: 'Ελληνικά', picker: 'el-GR', date: dmy },
  { id: 'gu', nativeName: 'ગુજરાતી', picker: 'gu-IN', date: dmy },
  { id: 'he', nativeName: 'עברית', picker: 'he-IL', date: dmy, rtl: true },
  { id: 'hi', nativeName: 'हिन्दी', picker: 'hi-IN', date: dmy },
  { id: 'hu', nativeName: 'Magyar', picker: 'hu-HU', date: ymdHu },
  { id: 'id', nativeName: 'Bahasa Indonesia', picker: 'id-ID', date: dmy },
  { id: 'it', nativeName: 'Italiano', picker: 'it-IT', date: dmy },
  { id: 'ja', nativeName: '日本語', picker: 'ja-JP', date: ymdJa },
  { id: 'kn', nativeName: 'ಕನ್ನಡ', picker: 'kn-IN', date: dmy },
  { id: 'ko', nativeName: '한국어', picker: 'ko-KR', date: ymdKo },
  { id: 'ms', nativeName: 'Bahasa Melayu', picker: 'ms-MY', date: dmy },
  { id: 'ml', nativeName: 'മലയാളം', picker: 'ml-IN', date: dmy },
  { id: 'mr', nativeName: 'मराठी', picker: 'mr-IN', date: dmy },
  { id: 'no', nativeName: 'Norsk', picker: 'nb-NO', date: dmyDot },
  { id: 'or', nativeName: 'ଓଡ଼ିଆ', picker: 'or-IN', date: dmy },
  { id: 'pl', nativeName: 'Polski', picker: 'pl-PL', date: dmy },
  { id: 'pt-BR', nativeName: 'Português (Brasil)', picker: 'pt-BR', date: dmy },
  { id: 'pt-PT', nativeName: 'Português (Portugal)', picker: 'pt-PT', date: dmy },
  { id: 'pa', nativeName: 'ਪੰਜਾਬੀ', picker: 'pa-IN', date: dmy },
  { id: 'ro', nativeName: 'Română', picker: 'ro-RO', date: dmy },
  { id: 'ru', nativeName: 'Русский', picker: 'ru-RU', date: dmy },
  { id: 'sk', nativeName: 'Slovenčina', picker: 'sk-SK', date: dmyDot },
  { id: 'sl', nativeName: 'Slovenščina', picker: 'sl-SI', date: dmyDot },
  { id: 'es-MX', nativeName: 'Español (México)', picker: 'es-MX', date: dmy },
  { id: 'es-ES', nativeName: 'Español (España)', picker: 'es-ES', date: dmy },
  { id: 'sv', nativeName: 'Svenska', picker: 'sv-SE', date: dmy },
  { id: 'ta', nativeName: 'தமிழ்', picker: 'ta-IN', date: dmy },
  { id: 'te', nativeName: 'తెలుగు', picker: 'te-IN', date: dmy },
  { id: 'th', nativeName: 'ไทย', picker: 'th-TH', date: dmy },
  { id: 'uk', nativeName: 'Українська', picker: 'uk-UA', date: dmy },
  { id: 'ur', nativeName: 'اردو', picker: 'ur-PK', date: dmy, rtl: true },
  { id: 'vi', nativeName: 'Tiếng Việt', picker: 'vi-VN', date: dmy },
] as const;

export type AppLocale = (typeof APP_LOCALES)[number]['id'];

export const DEFAULT_LOCALE: AppLocale = 'tr';

export const RTL_LOCALES: AppLocale[] = APP_LOCALES.filter((item) => 'rtl' in item && item.rtl).map(
  (item) => item.id,
);

const LEGACY_LOCALES: Record<string, AppLocale> = {
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  es: 'es-ES',
  nl: 'nl-NL',
  zhHans: 'zh-Hans',
  zhHant: 'zh-Hant',
  ar: 'ar-SA',
  ptBR: 'pt-BR',
};

export const DATE_FNS_LOCALES: Record<AppLocale, DateFnsLocale> = {
  tr,
  'ar-SA': arSA,
  bn,
  ca,
  'zh-Hans': zhCN,
  'zh-Hant': zhTW,
  hr,
  cs,
  da,
  'nl-NL': nl,
  'en-AU': enAU,
  'en-CA': enCA,
  'en-GB': enGB,
  'en-US': enUS,
  fi,
  'fr-FR': fr,
  'fr-CA': frCA,
  'de-DE': de,
  el,
  gu,
  he,
  hi,
  hu,
  id,
  it,
  ja,
  kn,
  ko,
  ms,
  ml: hi,
  mr: hi,
  no: nb,
  or: hi,
  pl,
  'pt-BR': ptBR,
  'pt-PT': pt,
  pa: hi,
  ro,
  ru,
  sk,
  sl,
  'es-MX': es,
  'es-ES': es,
  sv,
  ta,
  te,
  th,
  uk,
  ur: arSA,
  vi,
};

const LOCALE_BY_ID = new Map(APP_LOCALES.map((item) => [item.id, item]));

export function getLocaleDef(locale: AppLocale) {
  return LOCALE_BY_ID.get(locale) ?? APP_LOCALES[0];
}

export function isAppLocale(value: string | null | undefined): value is AppLocale {
  return APP_LOCALES.some((item) => item.id === value);
}

export function coerceLocale(value: string | null | undefined): AppLocale | null {
  if (!value || value === 'system') return null;
  if (isAppLocale(value)) return value;
  return LEGACY_LOCALES[value] ?? null;
}

export function localeFromDeviceTag(tag?: string | null): AppLocale {
  const normalized = (tag ?? '').toLowerCase().replaceAll('_', '-');
  if (!normalized) return DEFAULT_LOCALE;

  const exact = APP_LOCALES.find((item) => item.id.toLowerCase() === normalized);
  if (exact) return exact.id;

  if (
    normalized.startsWith('zh-hant') ||
    normalized.startsWith('zh-tw') ||
    normalized.startsWith('zh-hk') ||
    normalized.startsWith('zh-mo')
  ) {
    return 'zh-Hant';
  }
  if (normalized.startsWith('zh')) return 'zh-Hans';
  if (normalized.startsWith('en-au')) return 'en-AU';
  if (normalized.startsWith('en-ca')) return 'en-CA';
  if (normalized.startsWith('en-gb') || normalized.startsWith('en-uk')) return 'en-GB';
  if (normalized.startsWith('en')) return 'en-US';
  if (normalized.startsWith('fr-ca')) return 'fr-CA';
  if (normalized.startsWith('fr')) return 'fr-FR';
  if (normalized.startsWith('es-mx') || normalized.startsWith('es-419') || normalized.startsWith('es-us')) {
    return 'es-MX';
  }
  if (normalized.startsWith('es')) return 'es-ES';
  if (normalized.startsWith('pt-pt')) return 'pt-PT';
  if (normalized.startsWith('pt')) return 'pt-BR';
  if (normalized.startsWith('nl')) return 'nl-NL';
  if (normalized.startsWith('de')) return 'de-DE';
  if (normalized.startsWith('ar')) return 'ar-SA';
  if (normalized.startsWith('nb') || normalized.startsWith('nn') || normalized.startsWith('no')) return 'no';
  if (normalized.startsWith('iw') || normalized.startsWith('he')) return 'he';
  if (normalized === 'in' || normalized.startsWith('id')) return 'id';

  const short = normalized.slice(0, 2);
  const match = APP_LOCALES.find((item) => item.id === short || item.id.toLowerCase().startsWith(`${short}-`));
  return match?.id ?? DEFAULT_LOCALE;
}
