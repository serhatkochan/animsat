import { Dimensions } from 'react-native';

import { radius, spacing } from '@/src/theme/tokens';

import type { WidgetPhotoSizeKey } from '@/src/types';

/**
 * Apple HIG widget spesifikasyonları (iOS, portrait pt).
 * @see https://developer.apple.com/design/human-interface-guidelines/widgets
 */
const HIG_IOS_WIDGET_SPECS: {
  screenWidth: number;
  screenHeight: number;
  label: string;
  small: { width: number; height: number };
  medium: { width: number; height: number };
  large: { width: number; height: number };
  lockRectangular: { width: number; height: number };
}[] = [
  { screenWidth: 430, screenHeight: 932, label: '6.9" Pro Max', small: { width: 170, height: 170 }, medium: { width: 364, height: 170 }, large: { width: 364, height: 382 }, lockRectangular: { width: 172, height: 76 } },
  { screenWidth: 428, screenHeight: 926, label: '6.7" Pro Max', small: { width: 170, height: 170 }, medium: { width: 364, height: 170 }, large: { width: 364, height: 382 }, lockRectangular: { width: 172, height: 76 } },
  { screenWidth: 414, screenHeight: 896, label: '6.5" Plus', small: { width: 169, height: 169 }, medium: { width: 360, height: 169 }, large: { width: 360, height: 379 }, lockRectangular: { width: 160, height: 72 } },
  { screenWidth: 414, screenHeight: 736, label: '5.5" Plus', small: { width: 159, height: 159 }, medium: { width: 348, height: 157 }, large: { width: 348, height: 351 }, lockRectangular: { width: 170, height: 76 } },
  { screenWidth: 393, screenHeight: 852, label: '6.3" Pro', small: { width: 158, height: 158 }, medium: { width: 338, height: 158 }, large: { width: 338, height: 354 }, lockRectangular: { width: 160, height: 72 } },
  { screenWidth: 390, screenHeight: 844, label: '6.1" standart', small: { width: 158, height: 158 }, medium: { width: 338, height: 158 }, large: { width: 338, height: 354 }, lockRectangular: { width: 160, height: 72 } },
  { screenWidth: 375, screenHeight: 812, label: '5.8" / mini', small: { width: 155, height: 155 }, medium: { width: 329, height: 155 }, large: { width: 329, height: 345 }, lockRectangular: { width: 157, height: 72 } },
  { screenWidth: 375, screenHeight: 667, label: '4.7" SE', small: { width: 148, height: 148 }, medium: { width: 321, height: 148 }, large: { width: 321, height: 324 }, lockRectangular: { width: 153, height: 68 } },
  { screenWidth: 360, screenHeight: 780, label: '5.4" mini', small: { width: 155, height: 155 }, medium: { width: 329, height: 155 }, large: { width: 329, height: 345 }, lockRectangular: { width: 157, height: 72 } },
  { screenWidth: 320, screenHeight: 568, label: '4" SE', small: { width: 141, height: 141 }, medium: { width: 292, height: 141 }, large: { width: 292, height: 311 }, lockRectangular: { width: 141, height: 64 } },
];

/** HIG: Ana ekran widget'ları için standart kenar boşluğu (pt). */
export const WIDGET_STANDARD_MARGIN = 16;

/** HIG: Sıkı gruplamalar için alternatif kenar boşluğu (pt). */
export const WIDGET_TIGHT_MARGIN = 11;

/** HIG: Widget metinlerinde tercih edilen minimum punto. */
export const WIDGET_MIN_FONT_SIZE = 11;

export type WidgetDeviceProfile = 'compact' | 'standard' | 'large';

export type IosWidgetDimensions = {
  screenWidth: number;
  screenHeight: number;
  profileLabel: string;
  profile: WidgetDeviceProfile;
  small: { width: number; height: number };
  medium: { width: number; height: number };
  large: { width: number; height: number };
  lockRectangular: { width: number; height: number };
};

function profileFromSmallWidth(smallWidth: number): WidgetDeviceProfile {
  if (smallWidth >= 169) return 'large';
  if (smallWidth <= 155) return 'compact';
  return 'standard';
}

export function resolveIosWidgetDimensions(
  screenWidth = Dimensions.get('window').width,
  screenHeight = Dimensions.get('window').height,
): IosWidgetDimensions {
  const portraitW = Math.round(Math.min(screenWidth, screenHeight));
  const portraitH = Math.round(Math.max(screenWidth, screenHeight));

  const exact = HIG_IOS_WIDGET_SPECS.find(
    (spec) => spec.screenWidth === portraitW && spec.screenHeight === portraitH,
  );
  if (exact) {
    return {
      screenWidth: portraitW,
      screenHeight: portraitH,
      profileLabel: exact.label,
      profile: profileFromSmallWidth(exact.small.width),
      small: exact.small,
      medium: exact.medium,
      large: exact.large,
      lockRectangular: exact.lockRectangular,
    };
  }

  const closest = HIG_IOS_WIDGET_SPECS.reduce((best, spec) => {
    const bestDelta = Math.abs(best.screenWidth - portraitW);
    const specDelta = Math.abs(spec.screenWidth - portraitW);
    return specDelta < bestDelta ? spec : best;
  });

  return {
    screenWidth: portraitW,
    screenHeight: portraitH,
    profileLabel: `${closest.label} (yaklaşık)`,
    profile: profileFromSmallWidth(closest.small.width),
    small: closest.small,
    medium: closest.medium,
    large: closest.large,
    lockRectangular: closest.lockRectangular,
  };
}

export function getWidgetDeviceProfile(screenWidth = Dimensions.get('window').width): WidgetDeviceProfile {
  return resolveIosWidgetDimensions(screenWidth).profile;
}

export function getWidgetProfileSizes() {
  const dims = resolveIosWidgetDimensions();
  return {
    small: dims.small,
    medium: dims.medium,
    large: dims.large,
    lockRectangular: dims.lockRectangular,
  };
}

export type WidgetSizeSpec = {
  key: WidgetPhotoSizeKey;
  label: string;
  shortLabel: string;
  gridHint: string;
  width: number;
  height: number;
  aspect: number;
  profile: WidgetDeviceProfile;
  profileLabel: string;
};

export function widgetSpec(
  key: WidgetPhotoSizeKey,
  dims: IosWidgetDimensions = resolveIosWidgetDimensions(),
): WidgetSizeSpec {
  const size = key === 'small' ? dims.small : key === 'large' ? dims.large : dims.medium;
  const labels =
    key === 'small'
      ? { label: 'Küçük widget', shortLabel: 'Küçük', gridHint: '2×2' }
      : key === 'large'
        ? { label: 'Büyük widget', shortLabel: 'Büyük', gridHint: '4×4' }
        : { label: 'Orta widget', shortLabel: 'Orta', gridHint: '4×2' };

  return {
    key,
    ...labels,
    width: size.width,
    height: size.height,
    aspect: size.width / size.height,
    profile: dims.profile,
    profileLabel: dims.profileLabel,
  };
}

export function widgetSizeSpecs(dims: IosWidgetDimensions = resolveIosWidgetDimensions()): WidgetSizeSpec[] {
  return (['small', 'medium', 'large'] as WidgetPhotoSizeKey[]).map((key) => widgetSpec(key, dims));
}

export function widgetFrameContainerStyle(
  aspect: number,
  borderRadius: number = radius.lg,
) {
  return {
    width: '100%' as const,
    aspectRatio: aspect,
    borderRadius,
    overflow: 'hidden' as const,
  };
}

export const WIDGET_FRAME_HORIZONTAL_INSET = spacing.lg;

export const WIDGET_PREVIEW_CARD_WIDTH = 132;

export const WIDGET_TYPOGRAPHY_REFERENCE_HEIGHT = 280;
