import { Link } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 64;

export function Fab() {
  const { colors } = useAppTheme();

  return (
    <Link href="/event/new" asChild>
      <Pressable
        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
        style={({ pressed }) => [
          styles.fab,
          {
            bottom: TAB_BAR_HEIGHT + spacing.sm,
            backgroundColor: colors.text,
            opacity: pressed ? 0.88 : 1,
            shadowColor: colors.text,
          },
        ]}>
        <Text style={[styles.icon, { color: colors.background }]}>+</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: spacing.lg,
    width: 58,
    height: 58,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
  },
  icon: {
    fontFamily: fonts.body,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -2,
  },
});
