import { Pressable, StyleSheet, Text, View } from 'react-native';

import { accentPresets } from '@/src/theme/tokens';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

type ColorPickerProps = {
  value: string;
  onChange: (color: string) => void;
};

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const { colors } = useAppTheme();

  return (
    <View style={styles.row}>
      {accentPresets.map((color) => {
        const selected = value === color;
        return (
          <Pressable
            key={color}
            onPress={() => onChange(color)}
            style={[
              styles.swatch,
              { backgroundColor: color },
              selected && { borderColor: colors.text, borderWidth: 2 },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  swatch: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
  },
});
