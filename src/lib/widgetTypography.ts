import {
  WIDGET_MIN_FONT_SIZE,
  WIDGET_STANDARD_MARGIN,
  WIDGET_TIGHT_MARGIN,
  WIDGET_TYPOGRAPHY_REFERENCE_HEIGHT,
} from '@/src/constants/widgetFrame';
import type { WidgetPhotoSizeKey, WidgetTextScale } from '@/src/types';

export type WidgetTypography = {
  scale: number;
  padding: number;
  countSize: number;
  titleSize: number;
  dateSize: number;
  locationSize: number;
  iconSize: number;
  countBottomGap: number;
  lineGap: number;
  isSmall: boolean;
};

function clampMinFont(size: number): number {
  return Math.max(WIDGET_MIN_FONT_SIZE, size);
}

export function getHomeWidgetTypography(
  sizeKey: WidgetPhotoSizeKey,
  widgetHeight: number,
  widgetTextScale: WidgetTextScale,
): WidgetTypography {
  const textScale = widgetTextScale / 100;
  const sizeScale = widgetHeight / WIDGET_TYPOGRAPHY_REFERENCE_HEIGHT;
  const scale = sizeScale * textScale;
  const isSmall = sizeKey === 'small';

  return {
    scale,
    padding: Math.max(WIDGET_STANDARD_MARGIN, Math.round(WIDGET_STANDARD_MARGIN * sizeScale)),
    countSize: (isSmall ? 52 : 72) * scale,
    titleSize: clampMinFont((isSmall ? 15 : 28) * scale),
    dateSize: clampMinFont((isSmall ? 11 : 15) * scale),
    locationSize: clampMinFont((isSmall ? 11 : 14) * scale),
    iconSize: clampMinFont((isSmall ? 11 : 15) * scale),
    countBottomGap: isSmall ? 2 * scale : 8 * scale,
    lineGap: isSmall ? WIDGET_TIGHT_MARGIN / 4 : WIDGET_TIGHT_MARGIN / 2,
    isSmall,
  };
}

export function getLockWidgetTypography(widgetTextScale: WidgetTextScale): WidgetTypography {
  const scale = widgetTextScale / 100;

  return {
    scale,
    padding: Math.max(WIDGET_TIGHT_MARGIN, Math.round(WIDGET_TIGHT_MARGIN * scale)),
    countSize: clampMinFont(32 * scale),
    titleSize: clampMinFont(14 * scale),
    dateSize: clampMinFont(12 * scale),
    locationSize: WIDGET_MIN_FONT_SIZE,
    iconSize: WIDGET_MIN_FONT_SIZE,
    countBottomGap: 0,
    lineGap: 1,
    isSmall: true,
  };
}
