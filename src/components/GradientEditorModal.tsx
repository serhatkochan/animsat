import { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import ColorPicker, { BrightnessSlider, Panel3 } from 'reanimated-color-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/src/i18n/I18nProvider';
import {
  addGradientStop,
  clampGradientColors,
  getGradientLocations,
  hexToHsv,
  MAX_GRADIENT_STOPS,
  MIN_GRADIENT_STOPS,
  removeGradientStop,
} from '@/src/lib/gradientUtils';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

type GradientEditorModalProps = {
  visible: boolean;
  initialColors: string[];
  onClose: () => void;
  onConfirm: (colors: string[]) => void;
};

const WHEEL_DOT_SIZE = 18;
const WHEEL_DOT_HIT = 28;

function normalizePickerColor(color: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(color)) return color;
  if (/^#[0-9A-Fa-f]{8}$/.test(color)) return color.slice(0, 7);
  return '#C45C4A';
}

/** Panel3 (rotate=0, boundedThumb=false) ile aynı hue/saturation geometrisi. */
function panel3Point(hex: string, wheelSize: number) {
  const { h, s } = hexToHsv(hex);
  const center = wheelSize / 2;
  const distance = (s / 100) * center;
  const angle = (h * Math.PI) / 180;
  return {
    x: center - Math.cos(angle) * distance,
    y: center - Math.sin(angle) * distance,
  };
}

export function GradientEditorModal({
  visible,
  initialColors,
  onClose,
  onConfirm,
}: GradientEditorModalProps) {
  const insets = useSafeAreaInsets();
  const { width, height } = useWindowDimensions();
  const { colors: themeColors, isDark } = useAppTheme();
  const { t } = useI18n();
  const [stops, setStops] = useState<string[]>(() => clampGradientColors(initialColors));
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!visible) return;
    const nextStops = clampGradientColors(initialColors);
    setStops(nextStops);
    setActiveIndex(0);
  }, [visible, initialColors]);

  const activeColor = stops[activeIndex] ?? stops[0];
  const locations = useMemo(() => getGradientLocations(stops), [stops]);

  const wheelSize = Math.min(width - spacing.lg * 2, height * 0.34, 300);
  const sliderWidth = Math.min(width - spacing.lg * 2, 320);

  const updateActiveColor = (color: string) => {
    const normalized = normalizePickerColor(color);
    setStops((current) =>
      current.map((stop, index) => (index === activeIndex ? normalized : stop)),
    );
  };

  const handleAddStop = () => {
    setStops((current) => addGradientStop(current, activeIndex));
    setActiveIndex((index) => Math.min(index + 1, MAX_GRADIENT_STOPS - 1));
  };

  const handleRemoveStop = () => {
    setStops((current) => {
      const next = removeGradientStop(current, activeIndex);
      const nextIndex = Math.min(activeIndex, next.length - 1);
      setActiveIndex(nextIndex);
      return next;
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.root}>
        <View
          style={[
            styles.container,
            {
              backgroundColor: isDark ? '#121212' : themeColors.background,
              paddingTop: insets.top + spacing.sm,
              paddingBottom: insets.bottom + spacing.sm,
            },
          ]}>
          <View style={styles.header}>
            <Pressable onPress={onClose} hitSlop={12} style={styles.closeButton}>
              <Text style={[styles.closeText, { color: themeColors.textMuted }]}>✕</Text>
            </Pressable>
            <Text style={[styles.headerTitle, { color: themeColors.text }]}>
              {activeColor.toUpperCase()}
            </Text>
            <View style={styles.closeButton} />
          </View>

          <View style={styles.topSection}>
            <View style={styles.stopTrackWrap}>
              <LinearGradient
                colors={stops as [string, string, ...string[]]}
                locations={locations}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.stopTrack}
              />
              {stops.map((stopColor, index) => {
                const active = index === activeIndex;
                const leftPercent = stops.length === 1 ? 0 : (index / (stops.length - 1)) * 100;
                return (
                  <Pressable
                    key={`${index}-${stopColor}`}
                    onPress={() => setActiveIndex(index)}
                    style={[
                      styles.stopMarker,
                      {
                        left: `${leftPercent}%`,
                        marginLeft: -15,
                      },
                    ]}>
                    <View
                      style={[
                        styles.stopDot,
                        { backgroundColor: stopColor },
                        active && styles.stopDotActive,
                      ]}
                    />
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.stopMetaRow}>
              <Text style={[styles.stopMeta, { color: themeColors.textMuted }]}>
                {activeIndex + 1}/{stops.length}
              </Text>
              <View style={styles.stopActions}>
                {stops.length > MIN_GRADIENT_STOPS ? (
                  <Pressable onPress={handleRemoveStop} hitSlop={8}>
                    <Text style={[styles.stopActionText, { color: themeColors.textMuted }]}>
                      {t('styleRemoveStop')}
                    </Text>
                  </Pressable>
                ) : null}
                {stops.length < MAX_GRADIENT_STOPS ? (
                  <Pressable onPress={handleAddStop} hitSlop={8}>
                    <Text style={[styles.stopActionText, { color: themeColors.text }]}>
                      {t('styleAddStop')}
                    </Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>

          <View style={styles.middleSection}>
            <ColorPicker
              key={`stop-${activeIndex}`}
              value={activeColor}
              onChangeJS={(color) => updateActiveColor(color.hex)}
              onCompleteJS={(color) => updateActiveColor(color.hex)}
              thumbSize={34}
              sliderThickness={22}
              boundedThumb={false}
              style={styles.colorPicker}>
              <View style={{ width: wheelSize, height: wheelSize }}>
                <Panel3
                  style={{ width: wheelSize, height: wheelSize }}
                  thumbShape="ring"
                  boundedThumb={false}
                />
                <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
                  {stops.map((stopColor, index) => {
                    if (index === activeIndex) return null;
                    const point = panel3Point(stopColor, wheelSize);
                    return (
                      <Pressable
                        key={`wheel-${index}-${stopColor}`}
                        accessibilityRole="button"
                        onPress={() => setActiveIndex(index)}
                        hitSlop={6}
                        style={[
                          styles.wheelDotHit,
                          {
                            left: point.x - WHEEL_DOT_HIT / 2,
                            top: point.y - WHEEL_DOT_HIT / 2,
                          },
                        ]}>
                        <View
                          style={[styles.wheelDot, { backgroundColor: stopColor }]}
                        />
                      </Pressable>
                    );
                  })}
                </View>
              </View>
              <BrightnessSlider
                style={{ width: sliderWidth, height: 28, marginTop: spacing.md }}
                boundedThumb={false}
              />
            </ColorPicker>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.actions}>
              <Pressable
                onPress={onClose}
                style={[styles.secondaryButton, { borderColor: themeColors.border }]}>
                <Text style={[styles.secondaryText, { color: themeColors.textMuted }]}>{t('cancel')}</Text>
              </Pressable>
              <Pressable
                onPress={() => onConfirm(clampGradientColors(stops))}
                style={[styles.primaryButton, { backgroundColor: activeColor }]}>
                <Text style={styles.primaryText}>{t('done')}</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 22,
    lineHeight: 24,
  },
  headerTitle: {
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
    letterSpacing: 0.8,
  },
  topSection: {
    gap: spacing.xs,
  },
  stopTrackWrap: {
    height: 44,
    justifyContent: 'center',
  },
  stopTrack: {
    height: 14,
    borderRadius: radius.full,
  },
  stopMarker: {
    position: 'absolute',
    top: 7,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopDot: {
    width: 26,
    height: 26,
    borderRadius: radius.full,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  stopDotActive: {
    borderWidth: 3,
    borderColor: '#FFFFFF',
    transform: [{ scale: 1.1 }],
  },
  stopMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stopMeta: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
  },
  stopActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  stopActionText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
  },
  colorPicker: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  wheelDotHit: {
    position: 'absolute',
    width: WHEEL_DOT_HIT,
    height: WHEEL_DOT_HIT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  wheelDot: {
    width: WHEEL_DOT_SIZE,
    height: WHEEL_DOT_SIZE,
    borderRadius: WHEEL_DOT_SIZE / 2,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  bottomSection: {
    gap: spacing.sm,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
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
    color: '#fff',
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
});
