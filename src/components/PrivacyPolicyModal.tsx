import * as WebBrowser from 'expo-web-browser';
import { Linking, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/src/i18n/I18nProvider';
import { getPrivacyDoc } from '@/src/i18n/privacy';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

type PrivacyPolicySheetProps = {
  onClose: () => void;
  showHandle?: boolean;
};

export function PrivacyPolicySheet({ onClose, showHandle = true }: PrivacyPolicySheetProps) {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t, locale } = useI18n();
  const doc = getPrivacyDoc(locale);

  const openLink = (url: string) => {
    if (url.startsWith('mailto:')) {
      void Linking.openURL(url);
      return;
    }
    void WebBrowser.openBrowserAsync(url);
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        {showHandle ? <View style={[styles.dragHandle, { backgroundColor: colors.textSoft }]} /> : null}
        <Text style={[styles.title, { color: colors.text }]}>{doc.title}</Text>
        <Text style={[styles.updated, { color: colors.textMuted }]}>{doc.updated}</Text>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
        }}>
        <Text style={[styles.intro, { color: colors.text }]}>{doc.intro}</Text>
        {doc.sections.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.title}</Text>
            <Text style={[styles.body, { color: colors.textMuted }]}>{section.body}</Text>
            {section.linkUrl && section.linkLabel ? (
              <Pressable onPress={() => openLink(section.linkUrl!)} hitSlop={8}>
                <Text style={[styles.link, { color: colors.text }]}>{section.linkLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        ))}
      </ScrollView>

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
  );
}

type PrivacyPolicyModalProps = {
  visible: boolean;
  onClose: () => void;
};

export function PrivacyPolicyModal({ visible, onClose }: PrivacyPolicyModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <PrivacyPolicySheet onClose={onClose} />
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
  updated: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: spacing.xs,
  },
  intro: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: spacing.lg,
  },
  section: {
    marginBottom: spacing.lg,
    gap: spacing.sm,
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 23,
  },
  link: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    textDecorationLine: 'underline',
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
