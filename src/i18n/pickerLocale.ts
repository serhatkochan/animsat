import { getLocaleDef, type AppLocale } from '@/src/i18n/locales';

export function getPickerLocale(locale: AppLocale): string {
  return getLocaleDef(locale).picker;
}
