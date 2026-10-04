import DateTimePicker, { type DateTimePickerChangeEvent } from '@react-native-community/datetimepicker';
import { startOfDay } from 'date-fns';
import { useEffect, useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { InlineWheelPicker } from './InlineWheelPicker';
import { useI18n } from '@/src/i18n/I18nProvider';
import { getPickerLocale } from '@/src/i18n/pickerLocale';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

type DateTimePickerModalProps = {
  visible: boolean;
  mode: 'date' | 'time';
  value: Date;
  title: string;
  onClose: () => void;
  onConfirm: (value: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function DateTimePickerModal({
  visible,
  mode,
  value,
  title,
  onClose,
  onConfirm,
  minimumDate,
  maximumDate,
}: DateTimePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { t, locale } = useI18n();
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    if (visible) setDraft(value);
  }, [visible, value]);

  const handleValueChange = (_event: DateTimePickerChangeEvent, selected: Date) => {
    setDraft(mode === 'date' ? startOfDay(selected) : selected);
  };

  const handleConfirm = () => {
    onConfirm(draft);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={[styles.dragHandle, { backgroundColor: colors.textSoft }]} />
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        </View>

        <View style={styles.pickerWrap}>
          <View style={styles.pickerInner}>
            {Platform.OS === 'ios' ? (
              <DateTimePicker
                value={draft}
                mode={mode}
                display="spinner"
                onValueChange={handleValueChange}
                locale={getPickerLocale(locale)}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
                themeVariant={isDark ? 'dark' : 'light'}
                style={styles.picker}
              />
            ) : (
              <InlineWheelPicker
                mode={mode}
                value={draft}
                onChange={setDraft}
                locale={getPickerLocale(locale)}
                minimumDate={minimumDate}
                maximumDate={maximumDate}
              />
            )}
          </View>
        </View>

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.lg }]}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.secondaryButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.surface,
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <Text style={[styles.secondaryText, { color: colors.text }]}>{t('cancel')}</Text>
          </Pressable>
          <Pressable
            onPress={handleConfirm}
            style={({ pressed }) => [
              styles.primaryButton,
              {
                backgroundColor: colors.text,
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Text style={[styles.primaryText, { color: colors.background }]}>{t('save')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

type DatePickerModalProps = {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function DatePickerModal(props: DatePickerModalProps) {
  const { t } = useI18n();
  return (
    <DateTimePickerModal
      {...props}
      mode="date"
      title={t('pickDate')}
    />
  );
}

type TimePickerModalProps = {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
};

export function TimePickerModal(props: TimePickerModalProps) {
  const { t } = useI18n();
  return (
    <DateTimePickerModal
      {...props}
      mode="time"
      title={t('pickTime')}
    />
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  dragHandle: {
    width: 42,
    height: 5,
    borderRadius: radius.full,
    opacity: 0.45,
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    textAlign: 'center',
  },
  pickerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  pickerInner: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
  },
  picker: {
    width: '100%',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  secondaryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  primaryButton: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
});
