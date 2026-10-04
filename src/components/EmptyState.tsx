import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

export function EmptyState() {
  const { colors } = useAppTheme();
  const { t } = useI18n();

  const handleCreate = () => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push('/event/new');
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>{t('emptyTitle')}</Text>
      <Text style={[styles.subtitle, { color: colors.textMuted }]}>{t('emptySubtitle')}</Text>
      <Pressable
        onPress={handleCreate}
        style={({ pressed }) => [
          styles.button,
          { backgroundColor: colors.text, opacity: pressed ? 0.85 : 1 },
        ]}>
        <Text style={[styles.buttonText, { color: colors.background }]}>{t('emptyCta')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  button: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.full,
  },
  buttonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 15,
  },
});
