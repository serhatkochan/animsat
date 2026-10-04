import { router, useLocalSearchParams } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { parseISO } from 'date-fns';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  createDefaultEventStyle,
  eventToStyleValue,
  EventStylePicker,
  normalizeEventStyleValue,
  type EventStyleValue,
} from '@/src/components/EventStylePicker';
import { DatePickerModal } from '@/src/components/DatePickerModal';
import { useEvents } from '@/src/hooks/useEvents';
import { useSettings } from '@/src/hooks/useSettings';
import { formatEventDate } from '@/src/lib/dateUtils';
import { createId } from '@/src/lib/id';
import { getAutomaticReminderSummary, notificationsAvailable, requestNotificationPermissions } from '@/src/lib/notifications';
import { getAccentColor } from '@/src/lib/eventStyle';
import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import type { EventFormData } from '@/src/types';

export default function EventFormScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { ready, getEvent, addEvent, updateEvent, removeEvent, events } = useEvents();
  const { settings } = useSettings();

  const existing = id ? getEvent(id) : undefined;
  const isEditing = Boolean(existing);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [location, setLocation] = useState('');
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [style, setStyle] = useState<EventStyleValue>(createDefaultEventStyle());
  const [remindersEnabled, setRemindersEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const draftEventId = useRef(createId()).current;
  const photoEventId = id ?? draftEventId;

  const scrollToActions = useCallback(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 350);
  }, []);

  useEffect(() => {
    if (!existing) {
      setRemindersEnabled(false);
      return;
    }
    setTitle(existing.title);
    setDate(parseISO(existing.date));
    setLocation(existing.location ?? '');
    setStyle(eventToStyleValue(existing));
    setRemindersEnabled(existing.remindersEnabled ?? true);
    setDatePickerOpen(false);
  }, [existing]);

  const onDelete = () => {
    if (!isEditing || !id) return;

    Alert.alert(t('deleteConfirmTitle'), t('deleteConfirmMessage', { title: title.trim() || existing?.title || '' }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await removeEvent(id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.back();
          } catch (error) {
            console.error('Silme hatası:', error);
            Alert.alert(t('error'), t('deleteFailed'));
          }
        },
      },
    ]);
  };

  const onSave = async () => {
    if (!title.trim()) {
      Alert.alert(t('missingInfo'), t('missingTitle'));
      return;
    }

    if (style.backgroundType === 'photo' && !style.backgroundImageUri) {
      Alert.alert(t('missingInfo'), t('missingPhoto'));
      return;
    }

    const normalizedStyle = normalizeEventStyleValue(style);

    const form: EventFormData = {
      title,
      date,
      gradientColors: normalizedStyle.gradientColors,
      backgroundType: normalizedStyle.backgroundType,
      backgroundImageUri: normalizedStyle.backgroundImageUri,
      backgroundImageTransform: normalizedStyle.backgroundImageTransform,
      remindersEnabled,
      location,
      id: isEditing ? undefined : draftEventId,
    };

    try {
      setSaving(true);
      if (isEditing && id) {
        await updateEvent(id, form);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.back();
        return;
      }

      await addEvent(form);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error) {
      console.error('Kaydetme hatası:', error);
      const message =
        error instanceof Error ? error.message : t('saveFailed');
      Alert.alert(t('error'), message);
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  const accentColor = getAccentColor({
    gradientColors: style.gradientColors,
    color: style.gradientColors[0],
    backgroundType: style.backgroundType,
    backgroundImageUri: style.backgroundImageUri,
  });


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + spacing.xl,
        }}>
        <View style={styles.header}>
          <View style={styles.dragHandleWrap}>
            <View style={[styles.dragHandle, { backgroundColor: colors.textSoft }]} />
          </View>
          <Text style={[styles.screenTitle, { color: colors.text }]}>
            {isEditing ? t('eventEdit') : t('eventNew')}
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.textMuted }]}>{t('eventTitle')}</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder={t('eventTitlePlaceholder')}
          placeholderTextColor={colors.textSoft}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>{t('eventDate')}</Text>
        <Pressable
          onPress={() => setDatePickerOpen(true)}
          style={[
            styles.dateButton,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}>
          <Text style={[styles.dateButtonText, { color: colors.text }]}>
            {formatEventDate(date)}
          </Text>
          <Text style={[styles.dateButtonHint, { color: colors.textSoft }]}>
            {t('tapToChange')}
          </Text>
        </Pressable>

        <DatePickerModal
          visible={datePickerOpen}
          value={date}
          onClose={() => setDatePickerOpen(false)}
          onConfirm={setDate}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>{t('eventLocation')}</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder={t('eventLocationPlaceholder')}
          placeholderTextColor={colors.textSoft}
          style={[
            styles.input,
            {
              color: colors.text,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        />

        <Text style={[styles.label, { color: colors.textMuted }]}>{t('eventAppearance')}</Text>
        <EventStylePicker
          value={style}
          onChange={setStyle}
          onPhotoCropSaved={scrollToActions}
          eventId={photoEventId}
          preview={{ title, date, location }}
        />

        <View style={[styles.reminderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={[styles.switchTitle, { color: colors.text }]}>{t('eventReminders')}</Text>
              <Text style={[styles.switchHint, { color: colors.textSoft }]}>
                {t('eventRemindersHint')}
              </Text>
            </View>
            <Switch
              value={remindersEnabled}
              onValueChange={(value) => {
                void (async () => {
                  if (!value) {
                    setRemindersEnabled(false);
                    return;
                  }
                  if (!notificationsAvailable()) {
                    setRemindersEnabled(true);
                    return;
                  }
                  const granted = await requestNotificationPermissions();
                  setRemindersEnabled(granted);
                })();
              }}
              trackColor={{ true: accentColor, false: colors.border }}
            />
          </View>
          {remindersEnabled ? (
            <View style={styles.reminderList}>
              {getAutomaticReminderSummary().map((item) => (
                <Text key={item} style={[styles.reminderItem, { color: colors.textMuted }]}>
                  • {item}
                </Text>
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.actions}>
          <Pressable
            disabled={saving}
            onPress={onSave}
            style={({ pressed }) => [
              styles.saveButton,
              {
                backgroundColor: accentColor,
                opacity: pressed || saving ? 0.85 : 1,
              },
            ]}>
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveText}>{isEditing ? t('update') : t('save')}</Text>
            )}
          </Pressable>

          {isEditing ? (
            <Pressable
              disabled={saving}
              onPress={onDelete}
              style={({ pressed }) => [
                styles.deleteButton,
                {
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}>
              <Text style={[styles.deleteText, { color: colors.text }]}>{t('delete')}</Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  dragHandle: {
    width: 42,
    height: 5,
    borderRadius: radius.full,
    opacity: 0.45,
  },
  screenTitle: { fontFamily: fonts.display, fontSize: 24, textAlign: 'center' },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
    marginBottom: spacing.sm,
    marginTop: spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontFamily: fonts.body,
    fontSize: 16,
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  dateButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  dateButtonHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: 4,
  },
  reminderCard: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  switchCopy: {
    flex: 1,
  },
  switchTitle: { fontFamily: fonts.bodySemiBold, fontSize: 16 },
  switchHint: { fontFamily: fonts.body, fontSize: 13, marginTop: 2 },
  reminderList: {
    gap: 4,
    paddingTop: spacing.xs,
  },
  reminderItem: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 18,
  },
  saveButton: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xl,
  },
  deleteButton: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  deleteText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
});
