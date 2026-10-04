import {
  differenceInCalendarMonths,
  setHours,
  setMinutes,
  setSeconds,
  subDays,
  subHours,
  subMonths,
} from 'date-fns';

import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { translate } from '@/src/i18n/translate';
import { resolveEffectiveDate } from '@/src/lib/dateUtils';
import type { CountdownEvent } from '@/src/types';

type NotificationsModule = typeof import('expo-notifications');

type ReminderPlan = {
  id: string;
  date: Date;
  title: string;
  body: string;
};

let notificationsModule: NotificationsModule | null = null;
let handlerConfigured = false;

function notificationsSupported(): boolean {
  return Platform.OS !== 'web' && !isRunningInExpoGo();
}

async function getNotifications(): Promise<NotificationsModule | null> {
  if (!notificationsSupported()) return null;

  if (!notificationsModule) {
    notificationsModule = await import('expo-notifications');
  }

  if (!handlerConfigured) {
    notificationsModule.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }

  return notificationsModule;
}

export function notificationsAvailable(): boolean {
  return notificationsSupported();
}

export async function requestNotificationPermissions(): Promise<boolean> {
  const Notifications = await getNotifications();
  if (!Notifications) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

function atReminderTime(date: Date, reminderHour: number, reminderMinute: number): Date {
  return setSeconds(setMinutes(setHours(date, reminderHour), reminderMinute), 0);
}

function buildReminderPlans(
  event: CountdownEvent,
  reminderHour: number,
  reminderMinute: number,
): ReminderPlan[] {
  const effectiveDate = resolveEffectiveDate(event);
  const eventMoment = atReminderTime(effectiveDate, reminderHour, reminderMinute);
  const now = new Date();
  const plans: ReminderPlan[] = [];
  const seen = new Set<number>();

  const addPlan = (id: string, date: Date, title: string, body: string) => {
    if (date <= now) return;
    const key = date.getTime();
    if (seen.has(key)) return;
    seen.add(key);
    plans.push({ id, date, title, body });
  };

  const monthsUntil = differenceInCalendarMonths(effectiveDate, now);
  if (monthsUntil >= 2) {
    for (let monthOffset = monthsUntil; monthOffset >= 1; monthOffset -= 1) {
      const triggerDate = atReminderTime(
        subMonths(effectiveDate, monthOffset),
        reminderHour,
        reminderMinute,
      );
      addPlan(
        `m${monthOffset}`,
        triggerDate,
        translate('notifApproaching', { title: event.title }),
        monthOffset === 1
          ? translate('notifOneMonth')
          : translate('notifMonthsLeft', { count: monthOffset }),
      );
    }
  } else if (monthsUntil === 1) {
    const triggerDate = atReminderTime(subMonths(effectiveDate, 1), reminderHour, reminderMinute);
    addPlan('m1', triggerDate, translate('notifApproaching', { title: event.title }), translate('notifOneMonth'));
  }

  addPlan(
    'w1',
    atReminderTime(subDays(effectiveDate, 7), reminderHour, reminderMinute),
    translate('notifApproaching', { title: event.title }),
    translate('notifOneWeek'),
  );
  addPlan(
    'd1',
    atReminderTime(subDays(effectiveDate, 1), reminderHour, reminderMinute),
    translate('notifApproaching', { title: event.title }),
    translate('notifOneDay'),
  );
  addPlan('h1', subHours(eventMoment, 1), translate('notifApproaching', { title: event.title }), translate('notifOneHour'));
  addPlan('d0', eventMoment, translate('notifTodayTitle', { title: event.title }), translate('notifTodayBody'));

  return plans;
}

function notificationId(eventId: string, suffix: string): string {
  return `event-${eventId}-${suffix}`;
}

export async function cancelEventNotifications(eventId: string): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  const prefix = `event-${eventId}-`;
  const ids = scheduled
    .map((item) => item.identifier)
    .filter((identifier): identifier is string => Boolean(identifier?.startsWith(prefix)));

  await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
}

export async function scheduleEventNotifications(
  event: CountdownEvent,
  reminderHour: number,
  reminderMinute: number,
): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;
  if (event.type !== 'countdown' || !event.remindersEnabled) return;

  const granted = await requestNotificationPermissions();
  if (!granted) return;

  await cancelEventNotifications(event.id);

  const plans = buildReminderPlans(event, reminderHour, reminderMinute);

  for (const plan of plans) {
    await Notifications.scheduleNotificationAsync({
      identifier: notificationId(event.id, plan.id),
      content: {
        title: plan.title,
        body: plan.body,
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: plan.date,
      },
    });
  }
}

export async function syncAllNotifications(
  events: CountdownEvent[],
  reminderHour: number,
  reminderMinute: number,
): Promise<void> {
  const Notifications = await getNotifications();
  if (!Notifications) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  for (const event of events) {
    await scheduleEventNotifications(event, reminderHour, reminderMinute);
  }
}

export function getAutomaticReminderSummary(): string[] {
  return [
    translate('reminderAuto'),
    translate('reminderMonthly'),
    translate('reminderNear'),
    translate('reminderDay'),
  ];
}
