import type { Messages } from '@/src/i18n/messages';

export function overlay(en: Messages, patch: Partial<Messages>): Messages {
  return { ...en, ...patch };
}
