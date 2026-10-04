import { FlashList } from '@shopify/flash-list';
import { useCallback } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/src/i18n/I18nProvider';
import { APP_LOCALES, type AppLocale } from '@/src/i18n/locales';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

type LanguagePickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (locale: AppLocale) => void;
};

export function LanguagePickerModal({ visible, onClose, onSelect }: LanguagePickerModalProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t, locale } = useI18n();

  const handleSelect = useCallback(
    (id: AppLocale) => {
      onSelect(id);
      onClose();
    },
    [onClose, onSelect],
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={[styles.root, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
          <View style={[styles.dragHandle, { backgroundColor: colors.textSoft }]} />
          <Text style={[styles.title, { color: colors.text }]}>{t('settingsLanguage')}</Text>
        </View>

        <FlashList
          data={APP_LOCALES}
          extraData={locale}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: spacing.md,
          }}
          renderItem={({ item }) => {
            const active = item.id === locale;
            return (
              <Pressable
                onPress={() => handleSelect(item.id)}
                style={[
                  styles.row,
                  {
                    backgroundColor: active ? colors.text : colors.surface,
                    borderColor: colors.border,
                  },
                ]}>
                <Text style={[styles.rowLabel, { color: active ? colors.background : colors.text }]}>
                  {item.nativeName}
                </Text>
              </Pressable>
            );
          }}
        />

        <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.md }]}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.closeButton,
              { backgroundColor: colors.text, opacity: pressed ? 0.9 : 1 },
            ]}>
            <Text style={[styles.closeText, { color: colors.background }]}>{t('close')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
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
    fontSize: 28,
    textAlign: 'center',
  },
  row: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  rowLabel: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    textAlign: 'center',
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  closeButton: {
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  closeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
});
