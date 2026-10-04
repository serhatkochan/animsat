import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useRef } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';

const ITEM_HEIGHT = 46;
const VISIBLE_ITEMS = 5;
const CONTAINER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;
const PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

type WheelItem = {
  label: string;
  value: number;
};

type WheelColumnProps = {
  items: WheelItem[];
  selectedIndex: number;
  onSelect: (value: number) => void;
  flex?: number;
};

function WheelColumn({ items, selectedIndex, onSelect, flex = 1 }: WheelColumnProps) {
  const { colors } = useAppTheme();
  const scrollRef = useRef<ScrollView>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // Only scroll programmatically when not actively dragging
    if (!isScrollingRef.current) {
      scrollRef.current?.scrollTo({
        y: Math.max(0, selectedIndex * ITEM_HEIGHT),
        animated: false,
      });
    }
  }, [selectedIndex]);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.max(0, Math.min(items.length - 1, Math.round(y / ITEM_HEIGHT)));
    isScrollingRef.current = false;
    const targetItem = items[index];
    if (targetItem && targetItem.value !== items[selectedIndex]?.value) {
      onSelect(targetItem.value);
      void Haptics.selectionAsync();
    }
  };

  return (
    <View style={[styles.column, { flex }]}>
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        nestedScrollEnabled
        contentContainerStyle={{ paddingVertical: PADDING }}
        onScrollBeginDrag={() => {
          isScrollingRef.current = true;
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={(e) => {
          // If no momentum follows, trigger snap immediately
          if (e.nativeEvent.velocity?.y === 0) {
            handleScrollEnd(e);
          }
        }}>
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;
          const distance = Math.abs(index - selectedIndex);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.45 : 0.2;

          return (
            <Pressable
              key={item.value}
              onPress={() => {
                scrollRef.current?.scrollTo({
                  y: index * ITEM_HEIGHT,
                  animated: true,
                });
                if (item.value !== items[selectedIndex]?.value) {
                  onSelect(item.value);
                  void Haptics.selectionAsync();
                }
              }}
              style={styles.item}>
              <Text
                style={[
                  styles.itemText,
                  {
                    color: colors.text,
                    opacity,
                    fontFamily: isSelected ? fonts.bodySemiBold : fonts.body,
                    fontSize: isSelected ? 19 : 16,
                  },
                ]}
                numberOfLines={1}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

type InlineWheelPickerProps = {
  mode: 'date' | 'time';
  value: Date;
  onChange: (date: Date) => void;
  locale?: string;
  minimumDate?: Date;
  maximumDate?: Date;
};

export function InlineWheelPicker({
  mode,
  value,
  onChange,
  locale = 'tr-TR',
  minimumDate,
  maximumDate,
}: InlineWheelPickerProps) {
  const { colors, isDark } = useAppTheme();

  // Date mode calculations
  const year = value.getFullYear();
  const month = value.getMonth();
  const day = value.getDate();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const years: WheelItem[] = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const start = minimumDate ? minimumDate.getFullYear() : currentYear - 100;
    const end = maximumDate ? maximumDate.getFullYear() : currentYear + 50;
    const list: WheelItem[] = [];
    for (let y = start; y <= end; y++) {
      list.push({ label: String(y), value: y });
    }
    return list;
  }, [minimumDate, maximumDate]);

  const months: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(2026, m, 1);
      let label = 'Ay ' + (m + 1);
      try {
        const raw = new Intl.DateTimeFormat(locale, { month: 'long' }).format(d);
        label = raw.charAt(0).toLocaleUpperCase(locale) + raw.slice(1);
      } catch {
        label = d.toLocaleString('default', { month: 'long' });
      }
      list.push({ label, value: m });
    }
    return list;
  }, [locale]);

  const days: WheelItem[] = useMemo(() => {
    const list: WheelItem[] = [];
    for (let d = 1; d <= daysInMonth; d++) {
      list.push({ label: String(d), value: d });
    }
    return list;
  }, [daysInMonth]);

  // Time mode calculations
  const hours = value.getHours();
  const minutes = value.getMinutes();

  const hourItems: WheelItem[] = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      label: String(i).padStart(2, '0'),
      value: i,
    }));
  }, []);

  const minuteItems: WheelItem[] = useMemo(() => {
    return Array.from({ length: 60 }, (_, i) => ({
      label: String(i).padStart(2, '0'),
      value: i,
    }));
  }, []);

  const handleYearChange = (newYear: number) => {
    const maxDays = new Date(newYear, month + 1, 0).getDate();
    const clampedDay = Math.min(day, maxDays);
    const updated = new Date(value);
    updated.setFullYear(newYear);
    updated.setDate(clampedDay);
    onChange(updated);
  };

  const handleMonthChange = (newMonth: number) => {
    const maxDays = new Date(year, newMonth + 1, 0).getDate();
    const clampedDay = Math.min(day, maxDays);
    const updated = new Date(value);
    updated.setMonth(newMonth);
    updated.setDate(clampedDay);
    onChange(updated);
  };

  const handleDayChange = (newDay: number) => {
    const updated = new Date(value);
    updated.setDate(newDay);
    onChange(updated);
  };

  const handleHourChange = (newHour: number) => {
    const updated = new Date(value);
    updated.setHours(newHour);
    onChange(updated);
  };

  const handleMinuteChange = (newMinute: number) => {
    const updated = new Date(value);
    updated.setMinutes(newMinute);
    onChange(updated);
  };

  const yearIndex = useMemo(() => {
    const idx = years.findIndex((y) => y.value === year);
    return idx >= 0 ? idx : 0;
  }, [years, year]);

  const dayIndex = useMemo(() => {
    const idx = days.findIndex((d) => d.value === day);
    return idx >= 0 ? idx : 0;
  }, [days, day]);

  return (
    <View style={styles.container}>
      {/* Central active row highlight indicator */}
      <View
        pointerEvents="none"
        style={[
          styles.selectionIndicator,
          {
            top: PADDING,
            height: ITEM_HEIGHT,
            backgroundColor: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)',
            borderColor: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
          },
        ]}
      />

      {/* Wheel Columns */}
      <View style={styles.columnsRow}>
        {mode === 'date' ? (
          <>
            <WheelColumn items={days} selectedIndex={dayIndex} onSelect={handleDayChange} flex={1} />
            <WheelColumn items={months} selectedIndex={month} onSelect={handleMonthChange} flex={1.8} />
            <WheelColumn items={years} selectedIndex={yearIndex} onSelect={handleYearChange} flex={1.2} />
          </>
        ) : (
          <>
            <WheelColumn items={hourItems} selectedIndex={hours} onSelect={handleHourChange} flex={1} />
            <View style={styles.timeSeparator}>
              <Text style={[styles.timeSeparatorText, { color: colors.text }]}>:</Text>
            </View>
            <WheelColumn items={minuteItems} selectedIndex={minutes} onSelect={handleMinuteChange} flex={1} />
          </>
        )}
      </View>

      {/* Gradient Fades for depth effect */}
      <LinearGradient
        pointerEvents="none"
        colors={[colors.background, 'transparent']}
        style={styles.topFade}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['transparent', colors.background]}
        style={styles.bottomFade}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: CONTAINER_HEIGHT,
    width: '100%',
    maxWidth: 360,
    position: 'relative',
    overflow: 'hidden',
  },
  columnsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    height: CONTAINER_HEIGHT,
  },
  item: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  itemText: {
    textAlign: 'center',
  },
  selectionIndicator: {
    position: 'absolute',
    left: 8,
    right: 8,
    borderRadius: 14,
    borderWidth: 1,
    zIndex: 1,
  },
  timeSeparator: {
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: ITEM_HEIGHT,
  },
  timeSeparatorText: {
    fontSize: 22,
    fontWeight: '700',
  },
  topFade: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: PADDING * 0.9,
    zIndex: 2,
  },
  bottomFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: PADDING * 0.9,
    zIndex: 2,
  },
});
