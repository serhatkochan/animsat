import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { EventCountdownContent } from '@/src/components/EventCountdownContent';
import { GradientEditorModal } from '@/src/components/GradientEditorModal';
import { LIST_CARD_HEIGHT } from '@/src/components/EventCard';
import { PhotoBackground } from '@/src/components/PhotoBackground';
import { PhotoCropEditorModal } from '@/src/components/PhotoCropEditorModal';
import { useSettings } from '@/src/hooks/useSettings';
import {
  clampGradientColors,
  DEFAULT_GRADIENT_COLORS,
  getGradientLocations,
  resolveGradientColors,
} from '@/src/lib/gradientUtils';
import { calculateDayCount, toIsoDate } from '@/src/lib/dateUtils';
import { useI18n } from '@/src/i18n/I18nProvider';
import { persistEventPhoto } from '@/src/lib/eventPhotoStorage';
import {
  PHOTO_FRAME_HEIGHT,
  photoFrameContainerStyle,
} from '@/src/constants/photoFrame';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';
import type { BackgroundImageAdjust, BackgroundType, CountdownEvent } from '@/src/types';

export type EventStyleValue = {
  backgroundType: BackgroundType;
  gradientColors: string[];
  backgroundImageUri?: string;
  backgroundImageTransform?: BackgroundImageAdjust;
};

export type EventStylePreview = {
  title: string;
  date: Date;
  location?: string;
};

type EventStylePickerProps = {
  value: EventStyleValue;
  onChange: (value: EventStyleValue) => void;
  onPhotoCropSaved?: () => void;
  eventId?: string;
  preview?: EventStylePreview;
};

const PHOTO_SCRIM = 'rgba(0,0,0,0.14)';

function LiveStyleOverlay({
  preview,
  variant,
}: {
  preview: EventStylePreview;
  variant: 'hero' | 'compact';
}) {
  const { settings } = useSettings();
  const { dayCount, effectiveDate } = calculateDayCount(
    'countdown',
    toIsoDate(preview.date),
    false,
  );
  const location = preview.location?.trim();

  return (
    <EventCountdownContent
      event={{
        title: preview.title,
        location: location ? location : undefined,
        dayCount,
        effectiveDate,
      }}
      variant={variant}
      placement={settings.cardTextPlacement}
      align={settings.cardTextAlign}
      padding={variant === 'hero' ? spacing.lg : spacing.md}
    />
  );
}

type StyleMode = 'gradient' | 'photo';

export function normalizeEventStyleValue(
  value: Partial<EventStyleValue> & Pick<EventStyleValue, 'backgroundType'>,
): EventStyleValue {
  if (value.backgroundType === 'photo') {
    return {
      backgroundType: 'photo',
      gradientColors: clampGradientColors(value.gradientColors ?? DEFAULT_GRADIENT_COLORS),
      backgroundImageUri: value.backgroundImageUri,
      backgroundImageTransform: value.backgroundImageTransform,
    };
  }

  return {
    backgroundType: 'gradient',
    gradientColors: clampGradientColors(value.gradientColors ?? DEFAULT_GRADIENT_COLORS),
    backgroundImageUri: value.backgroundImageUri,
    backgroundImageTransform: value.backgroundImageTransform,
  };
}

export function createDefaultEventStyle(): EventStyleValue {
  return {
    backgroundType: 'gradient',
    gradientColors: [...DEFAULT_GRADIENT_COLORS],
  };
}

export function eventToStyleValue(
  event: Pick<
    CountdownEvent,
    | 'backgroundType'
    | 'gradientColors'
    | 'color'
    | 'colorSecondary'
    | 'backgroundImageUri'
    | 'backgroundImageTransform'
  >,
): EventStyleValue {
  if (event.backgroundType === 'photo') {
    return {
      backgroundType: 'photo',
      gradientColors: resolveGradientColors(event),
      backgroundImageUri: event.backgroundImageUri,
      backgroundImageTransform: event.backgroundImageTransform,
    };
  }

  return {
    backgroundType: 'gradient',
    gradientColors: resolveGradientColors(event),
  };
}

export function EventStylePicker({
  value,
  onChange,
  onPhotoCropSaved,
  eventId,
  preview,
}: EventStylePickerProps) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const normalized = normalizeEventStyleValue(value);
  const mode: StyleMode = normalized.backgroundType === 'photo' ? 'photo' : 'gradient';
  const [editorOpen, setEditorOpen] = useState(false);
  const [cropEditorOpen, setCropEditorOpen] = useState(false);
  const gradientColors = normalized.gradientColors;
  const gradientLocations = getGradientLocations(gradientColors);

  const setMode = (nextMode: StyleMode) => {
    onChange({
      ...normalized,
      backgroundType: nextMode === 'photo' ? 'photo' : 'gradient',
    });
  };

  const pickPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(t('stylePhotoPermissionTitle'), t('stylePhotoPermissionBody'));
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.9,
    });

    if (result.canceled || !result.assets[0]?.uri) return;

    let backgroundImageUri = result.assets[0].uri;
    if (eventId) {
      try {
        backgroundImageUri = await persistEventPhoto(
          eventId,
          backgroundImageUri,
          normalized.backgroundImageUri,
        );
      } catch (error) {
        console.warn('Fotoğraf kaydedilemedi:', error);
        Alert.alert(t('stylePhoto'), t('stylePhotoSaveFailed'));
        return;
      }
    }

    onChange({
      ...normalized,
      backgroundType: 'photo',
      backgroundImageUri,
      backgroundImageTransform: undefined,
    });
    setCropEditorOpen(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.modeRow}>
        {(
          [
            { key: 'gradient' as const, label: t('styleColor') },
            { key: 'photo' as const, label: t('stylePhoto') },
          ] as const
        ).map((option) => {
          const active = mode === option.key;
          return (
            <Pressable
              key={option.key}
              onPress={() => setMode(option.key)}
              style={[
                styles.modeChip,
                {
                  backgroundColor: active ? colors.text : colors.surface,
                  borderColor: active ? colors.text : colors.border,
                },
              ]}>
              <Text
                style={[
                  styles.modeText,
                  { color: active ? colors.background : colors.textMuted },
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {mode === 'gradient' ? (
        <Pressable
          onPress={() => setEditorOpen(true)}
          style={({ pressed }) => [{ opacity: pressed ? 0.94 : 1 }]}>
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            locations={gradientLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.preview}>
            {preview ? <LiveStyleOverlay preview={preview} variant="compact" /> : null}
          </LinearGradient>
        </Pressable>
      ) : (
        <View style={styles.photoSection}>
          {normalized.backgroundImageUri ? (
            <Pressable onPress={() => setCropEditorOpen(true)}>
              <PhotoBackground
                key={normalized.backgroundImageUri}
                uri={normalized.backgroundImageUri}
                transform={normalized.backgroundImageTransform}
                style={photoFrameContainerStyle(radius.lg)}
                overlayColor={preview ? PHOTO_SCRIM : undefined}>
                {preview ? <LiveStyleOverlay preview={preview} variant="hero" /> : null}
              </PhotoBackground>
              <Text style={[styles.photoEditHint, { color: colors.textSoft }]}>
                {t('styleCropHint')}
              </Text>
            </Pressable>
          ) : (
            <View style={[styles.photoPlaceholder, { borderColor: colors.border }]}>
              {preview ? (
                <>
                  <View style={styles.placeholderScrim} pointerEvents="none" />
                  <LiveStyleOverlay preview={preview} variant="hero" />
                </>
              ) : (
                <Text style={[styles.photoPlaceholderText, { color: colors.textSoft }]}>
                  {t('styleNoPhoto')}
                </Text>
              )}
            </View>
          )}
          <Pressable
            onPress={pickPhoto}
            style={[styles.photoButton, { backgroundColor: colors.text }]}>
            <Text style={[styles.photoButtonText, { color: colors.background }]}>
              {normalized.backgroundImageUri ? t('styleChangePhoto') : t('stylePickPhoto')}
            </Text>
          </Pressable>
        </View>
      )}

      <GradientEditorModal
        visible={editorOpen}
        initialColors={gradientColors}
        onClose={() => setEditorOpen(false)}
        onConfirm={(nextColors) => {
          onChange({
            ...normalized,
            backgroundType: 'gradient',
            gradientColors: nextColors,
          });
          setEditorOpen(false);
        }}
      />

      {normalized.backgroundImageUri ? (
        <PhotoCropEditorModal
          key={normalized.backgroundImageUri}
          visible={cropEditorOpen}
          uri={normalized.backgroundImageUri}
          initialTransform={normalized.backgroundImageTransform}
          title={t('styleCropTitle')}
          onClose={() => setCropEditorOpen(false)}
          onConfirm={(backgroundImageTransform) => {
            onChange({
              ...normalized,
              backgroundType: 'photo',
              backgroundImageTransform,
            });
            setCropEditorOpen(false);
            onPhotoCropSaved?.();
          }}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  modeChip: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  modeText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 13,
  },
  preview: {
    height: LIST_CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  photoSection: {
    gap: spacing.sm,
  },
  photoEditHint: {
    fontFamily: fonts.body,
    fontSize: 13,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  photoPlaceholder: {
    width: '100%',
    height: PHOTO_FRAME_HEIGHT,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  placeholderScrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.38)',
  },
  photoPlaceholderText: {
    fontFamily: fonts.body,
    fontSize: 14,
  },
  photoButton: {
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  photoButtonText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
