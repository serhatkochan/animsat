import Constants from 'expo-constants';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { TimePickerModal } from '@/src/components/DatePickerModal';
import { LanguagePickerModal } from '@/src/components/LanguagePickerModal';
import { PrivacyPolicyModal } from '@/src/components/PrivacyPolicyModal';
import { APP_NAME } from '@/src/constants/branding';
import { useSettings } from '@/src/hooks/useSettings';
import { useI18n } from '@/src/i18n/I18nProvider';
import { formatTime } from '@/src/lib/dateUtils';
import { getLocaleDef } from '@/src/i18n/locales';
import {
  ALIGN_MESSAGE_KEYS,
  CARD_TEXT_ALIGNS,
  CARD_TEXT_PLACEMENTS,
  PLACEMENT_MESSAGE_KEYS,
} from '@/src/lib/cardLayout';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';
import type { MessageKey } from '@/src/i18n/messages';
import type { ThemeMode } from '@/src/types';

const themeOptions: { key: MessageKey; value: ThemeMode }[] = [
  { key: 'themeLight', value: 'light' },
  { key: 'themeDark', value: 'dark' },
  { key: 'themeSystem', value: 'system' },
];

function reminderDate(hour: number, minute: number): Date {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t, locale, setLocale } = useI18n();
  const {
    settings,
    setThemeMode,
    setReminderTime,
    setCardTextPlacement,
    setCardTextAlign,
    setHasCompletedOnboarding,
  } = useSettings();
  const [timePickerOpen, setTimePickerOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const timeValue = useMemo(
    () => reminderDate(settings.reminderHour, settings.reminderMinute),
    [settings.reminderHour, settings.reminderMinute],
  );

  const formattedTime = formatTime(timeValue);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{
        paddingTop: insets.top + spacing.lg,
        paddingHorizontal: spacing.lg,
        paddingBottom: insets.bottom + spacing.xl,
      }}>
      <Text style={[styles.title, { color: colors.text }]}>{t('settingsTitle')}</Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsLanguage')}</Text>
        <Pressable
          onPress={() => setLanguageOpen(true)}
          style={[
            styles.timeButton,
            { borderColor: colors.border, backgroundColor: colors.background },
          ]}>
          <Text style={[styles.langValue, { color: colors.text }]}>{getLocaleDef(locale).nativeName}</Text>
          <Text style={[styles.timeHint, { color: colors.textSoft }]}>{t('tapToChange')}</Text>
        </Pressable>
        <Text style={[styles.hint, { color: colors.textSoft }]}>{t('settingsLanguageHint')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsAppearance')}</Text>
        <View style={styles.row}>
          {themeOptions.map((option) => {
            const active = settings.themeMode === option.value;
            return (
              <Pressable
                key={option.value}
                onPress={() => setThemeMode(option.value)}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? colors.text : colors.background,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? colors.background : colors.textMuted },
                  ]}>
                  {t(option.key)}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsCardText')}</Text>
        <Text style={[styles.subsectionLabel, { color: colors.textSoft }]}>{t('settingsPlacement')}</Text>
        <View style={styles.placementGrid}>
          {CARD_TEXT_PLACEMENTS.map((option) => {
            const active = settings.cardTextPlacement === option;
            return (
              <Pressable
                key={option}
                onPress={() => setCardTextPlacement(option)}
                style={[
                  styles.placementChip,
                  {
                    backgroundColor: active ? colors.text : colors.background,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.placementChipText,
                    { color: active ? colors.background : colors.textMuted },
                  ]}>
                  {t(PLACEMENT_MESSAGE_KEYS[option])}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.subsectionLabel, { color: colors.textSoft, marginTop: spacing.md }]}>
          {t('settingsAlign')}
        </Text>
        <View style={styles.row}>
          {CARD_TEXT_ALIGNS.map((option) => {
            const active = settings.cardTextAlign === option;
            return (
              <Pressable
                key={option}
                onPress={() => setCardTextAlign(option)}
                style={[
                  styles.option,
                  {
                    backgroundColor: active ? colors.text : colors.background,
                    borderColor: colors.border,
                  },
                ]}>
                <Text
                  style={[
                    styles.optionText,
                    { color: active ? colors.background : colors.textMuted },
                  ]}>
                  {t(ALIGN_MESSAGE_KEYS[option])}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={[styles.hint, { color: colors.textSoft }]}>{t('settingsAlignHint')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsReminderTime')}</Text>
        <Pressable
          onPress={() => setTimePickerOpen(true)}
          style={[
            styles.timeButton,
            { borderColor: colors.border, backgroundColor: colors.background },
          ]}>
          <Text style={[styles.value, { color: colors.text, marginBottom: 0 }]}>{formattedTime}</Text>
          <Text style={[styles.timeHint, { color: colors.textSoft }]}>{t('tapToChange')}</Text>
        </Pressable>
        <TimePickerModal
          visible={timePickerOpen}
          value={timeValue}
          onClose={() => setTimePickerOpen(false)}
          onConfirm={(date) => {
            void setReminderTime(date.getHours(), date.getMinutes());
          }}
        />
        <Text style={[styles.hint, { color: colors.textSoft }]}>{t('settingsReminderHint')}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsWidget')}</Text>
        <Text style={[styles.hint, { color: colors.textSoft, marginTop: 0 }]}>
          {t('settingsWidgetHint')}
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>{t('settingsPrivacy')}</Text>
        <Text style={[styles.hint, { color: colors.textSoft, marginTop: 0 }]}>
          {t('settingsPrivacyHook')}
        </Text>
        <Pressable onPress={() => setPrivacyOpen(true)} hitSlop={8}>
          <Text style={[styles.privacyRead, { color: colors.textMuted }]}>{t('settingsPrivacyRead')}</Text>
        </Pressable>
      </View>

      <Pressable
        onPress={() => {
          Alert.alert(t('settingsReplayOnboarding'), t('settingsReplayOnboardingConfirm'), [
            { text: t('cancel'), style: 'cancel' },
            {
              text: t('settingsReplayOnboarding'),
              onPress: () => {
                void setHasCompletedOnboarding(false);
              },
            },
          ]);
        }}>
        <Text style={[styles.replayLink, { color: colors.textMuted }]}>
          {t('settingsReplayOnboarding')}
        </Text>
      </Pressable>

      <LanguagePickerModal
        visible={languageOpen}
        onClose={() => setLanguageOpen(false)}
        onSelect={(next) => {
          void setLocale(next);
        }}
      />
      <PrivacyPolicyModal visible={privacyOpen} onClose={() => setPrivacyOpen(false)} />

      <Text style={[styles.version, { color: colors.textSoft }]}>
        {APP_NAME} · v{Constants.expoConfig?.version ?? '1.0.0'}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    marginBottom: spacing.lg,
  },
  card: {
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    marginBottom: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  subsectionLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 12,
    marginBottom: spacing.sm,
  },
  placementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  placementChip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    minWidth: '30%',
    flexGrow: 1,
    alignItems: 'center',
  },
  placementChipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  option: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    alignItems: 'center',
  },
  optionText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  timeButton: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },
  timeHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  value: {
    fontFamily: fonts.display,
    fontSize: 36,
    marginBottom: spacing.xs,
  },
  langValue: {
    fontFamily: fonts.display,
    fontSize: 26,
  },
  hint: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
    marginTop: spacing.sm,
  },
  proBenefits: {
    gap: 6,
  },
  privacyRead: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    marginTop: spacing.md,
  },
  version: {
    fontFamily: fonts.body,
    fontSize: 13,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  replayLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  proButton: {
    marginTop: spacing.md,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  proButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
