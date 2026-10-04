import { StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

type HomeHeaderProps = {
  title: string;
};

export function HomeHeader({ title }: HomeHeaderProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 40,
  },
});
