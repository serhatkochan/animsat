import {
  differenceInCalendarDays,
  format,
  isBefore,
  parseISO,
  setYear,
  startOfDay,
} from 'date-fns';

import { getActiveLocale, getDateFnsLocale, translate } from '@/src/i18n/translate';
import { getLocaleDef } from '@/src/i18n/locales';
import { translateDayAgo, translateDayLeft } from '@/src/lib/plural';
import type { CountdownEvent, EventType } from '@/src/types';

export function startOfToday(): Date {
  return startOfDay(new Date());
}

export function resolveEffectiveDate(
  event: Pick<CountdownEvent, 'date' | 'repeatYearly'>,
  today = startOfToday(),
): Date {
  const target = startOfDay(parseISO(event.date));

  if (!event.repeatYearly) {
    return target;
  }

  const thisYear = setYear(target, today.getFullYear());
  if (isBefore(thisYear, today)) {
    return setYear(target, today.getFullYear() + 1);
  }

  return thisYear;
}

export function calculateDayCount(
  type: EventType,
  date: string,
  repeatYearly: boolean,
  today = startOfToday(),
): { dayCount: number; effectiveDate: Date } {
  const eventDate = startOfDay(parseISO(date));

  if (type === 'countup') {
    return {
      dayCount: Math.max(0, differenceInCalendarDays(today, eventDate)),
      effectiveDate: eventDate,
    };
  }

  const effectiveDate = resolveEffectiveDate({ date, repeatYearly }, today);
  return {
    dayCount: Math.max(0, differenceInCalendarDays(effectiveDate, today)),
    effectiveDate,
  };
}

export function formatEventDate(date: Date): string {
  const locale = getActiveLocale();
  const pattern = getLocaleDef(locale).date;
  return format(date, pattern.full, { locale: getDateFnsLocale(locale) });
}


export function formatShortDate(date: Date): string {
  const locale = getActiveLocale();
  const pattern = getLocaleDef(locale).date;
  return format(date, pattern.short, { locale: getDateFnsLocale(locale) });
}

export function formatTime(date: Date): string {
  const locale = getActiveLocale();
  const pattern = getLocaleDef(locale).date;
  return format(date, pattern.time, { locale: getDateFnsLocale(locale) });
}

export function getDayLabel(type: EventType, dayCount: number): string {
  if (type === 'countup') {
    if (dayCount === 0) return translate('dayStartedToday');
    return translateDayAgo(dayCount);
  }

  if (dayCount === 0) return translate('dayToday');
  if (dayCount === 1) return translate('dayTomorrow');
  return translateDayLeft(dayCount);
}

export function toIsoDate(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}
