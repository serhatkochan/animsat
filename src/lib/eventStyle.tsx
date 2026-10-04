import type { ReactNode } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

import { PhotoBackground } from '@/src/components/PhotoBackground';
import { getGradientLocations, resolveGradientColors } from '@/src/lib/gradientUtils';
import type { CountdownEvent } from '@/src/types';

type EventStyleSource = Pick<
  CountdownEvent,
  | 'color'
  | 'colorSecondary'
  | 'gradientColors'
  | 'backgroundType'
  | 'backgroundImageUri'
  | 'backgroundImageTransform'
>;

export function getGradientColors(event: EventStyleSource): string[] {
  return resolveGradientColors(event);
}

export function getAccentColor(event: EventStyleSource): string {
  return getGradientColors(event)[0];
}

export function EventBackground({
  event,
  style,
  children,
  imageOpacity = 1,
  overlayColor,
  photoFitMode = 'fill',
}: {
  event: EventStyleSource;
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
  imageOpacity?: number;
  overlayColor?: string;
  photoFitMode?: 'fill' | 'cover';
}) {
  if (event.backgroundType === 'photo' && event.backgroundImageUri) {
    return (
      <PhotoBackground
        uri={event.backgroundImageUri}
        transform={event.backgroundImageTransform}
        fitMode={photoFitMode}
        style={[styles.fill, style]}
        imageStyle={{ opacity: imageOpacity }}
        overlayColor={overlayColor}>
        {children}
      </PhotoBackground>
    );
  }

  const gradientColors = getGradientColors(event);
  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      locations={getGradientLocations(gradientColors)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.fill, style]}>
      {children}
    </LinearGradient>
  );
}

export function EventStylePreview({
  event,
  size = 48,
}: {
  event: EventStyleSource;
  size?: number;
}) {
  const previewStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
    overflow: 'hidden' as const,
  };

  if (event.backgroundType === 'photo' && event.backgroundImageUri) {
    return (
      <PhotoBackground
        uri={event.backgroundImageUri}
        transform={event.backgroundImageTransform}
        style={previewStyle}
      />
    );
  }

  const gradientColors = getGradientColors(event);
  return (
    <LinearGradient
      colors={gradientColors as [string, string, ...string[]]}
      locations={getGradientLocations(gradientColors)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={previewStyle}
    />
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
