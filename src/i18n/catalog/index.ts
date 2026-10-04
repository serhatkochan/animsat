import type { AppLocale } from '@/src/i18n/locales';
import type { Messages } from '@/src/i18n/messages';
import { createAsiaDictionaries } from '@/src/i18n/catalog/asia';
import { createEuropeDictionaries } from '@/src/i18n/catalog/europe';
import { createEuropeRestDictionaries } from '@/src/i18n/catalog/europeRest';
import { createIndicDictionaries } from '@/src/i18n/catalog/indic';
import { createVariantDictionaries } from '@/src/i18n/catalog/variants';

export function createExtras(en: Messages): Partial<Record<AppLocale, Messages>> {
  return {
    ...createVariantDictionaries(en),
    ...createEuropeDictionaries(en),
    ...createEuropeRestDictionaries(en),
    ...createAsiaDictionaries(en),
    ...createIndicDictionaries(en),
  };
}
