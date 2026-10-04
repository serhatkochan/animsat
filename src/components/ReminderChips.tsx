import { Pressable, StyleSheet, Text, View } from 'react-native';

import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

type ChipOption = {
  label: string;
  value: number;
};

type ReminderChipsProps = {
  selected: number[];
  onChange: (values: number[]) => void;
};

const options: ChipOption[] = [
  { label: 'Aynı gün', value: 0 },
  { label: '1 gün önce', value: 1 },
  { label: '1 hafta önce', value: 7 },
];

export function ReminderChips({ selected, onChange }: ReminderChipsProps) {
  const { colors } = useAppTheme();

  const toggle = (value: number) => {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
      return;
    }
    onChange([...selected, value].sort((a, b) => a - b));
  };

  return (
    <View style={styles.row}>
      {options.map((option) => {
        const active = selected.includes(option.value);
        return (
          <Pressable
            key={option.value}
            onPress={() => toggle(option.value)}
            style={[
              styles.chip,
              {
                backgroundColor: active ? colors.text : colors.surface,
                borderColor: colors.border,
              },
            ]}>
            <Text
              style={[
                styles.chipText,
                { color: active ? colors.background : colors.textMuted },
              ]}>
              {option.label}
            </Text>
          </Pressable>
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
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  chipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
});
