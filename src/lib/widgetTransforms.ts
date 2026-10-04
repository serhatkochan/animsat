import { widgetSpec } from '@/src/constants/widgetFrame';
import { resolveBackgroundImageCrop } from '@/src/lib/photoTransform';
import type {
  BackgroundImageAdjust,
  BackgroundImageCrop,
  CountdownEvent,
  WidgetBackgroundImageTransforms,
  WidgetPhotoSizeKey,
} from '@/src/types';

export function emptyWidgetCrop(): BackgroundImageCrop {
  return { x: 0, y: 0, width: 1, height: 1 };
}

export function parseWidgetBackgroundImageTransforms(
  raw: string | null | undefined,
  legacySingle?: BackgroundImageAdjust | null,
): WidgetBackgroundImageTransforms | undefined {
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as WidgetBackgroundImageTransforms;
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    } catch {
      // fall through
    }
  }

  if (legacySingle) {
    return { medium: legacySingle };
  }

  return undefined;
}

export function resolveWidgetCropForSize(
  event: Pick<
    CountdownEvent,
    'backgroundImageTransform' | 'widgetBackgroundImageTransforms' | 'widgetBackgroundImageTransform'
  >,
  size: WidgetPhotoSizeKey,
  imageWidth: number,
  imageHeight: number,
): BackgroundImageCrop {
  const transforms =
    event.widgetBackgroundImageTransforms ??
    parseWidgetBackgroundImageTransforms(undefined, event.widgetBackgroundImageTransform);

  const adjust: BackgroundImageAdjust | undefined =
    transforms?.[size] ??
    (size === 'medium' ? event.widgetBackgroundImageTransform : undefined) ??
    event.backgroundImageTransform;

  const spec = widgetSpec(size);
  const crop = resolveBackgroundImageCrop(
    adjust,
    spec.width,
    spec.height,
    imageWidth,
    imageHeight,
  );

  return {
    x: crop.x,
    y: crop.y,
    width: crop.width,
    height: crop.height,
  };
}

export function withWidgetCropForSize(
  transforms: WidgetBackgroundImageTransforms | undefined,
  size: WidgetPhotoSizeKey,
  crop: BackgroundImageCrop,
): WidgetBackgroundImageTransforms {
  return {
    ...transforms,
    [size]: crop,
  };
}
