export type BackgroundImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** @deprecated Eski kayıtlar için; yeni kayıtlar BackgroundImageCrop kullanır. */
export type BackgroundImageTransform = {
  scale: number;
  focalX: number;
  focalY: number;
};

export type BackgroundImageAdjust = BackgroundImageCrop | BackgroundImageTransform;

export const DEFAULT_BACKGROUND_IMAGE_CROP: BackgroundImageCrop = {
  x: 0,
  y: 0,
  width: 1,
  height: 1,
};

export type PhotoLayout = {
  width: number;
  height: number;
  left: number;
  top: number;
};

import { Image } from 'react-native';

import {
  PHOTO_FRAME_HEIGHT,
  PHOTO_FRAME_REFERENCE_WIDTH,
} from '@/src/constants/photoFrame';

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function isLegacyTransform(value: BackgroundImageAdjust): value is BackgroundImageTransform {
  return 'scale' in value && 'focalX' in value && !('width' in value);
}

export function isBackgroundImageCrop(value: BackgroundImageAdjust): value is BackgroundImageCrop {
  return 'width' in value && 'height' in value && 'x' in value && 'y' in value;
}

export function normalizeBackgroundImageCrop(
  value?: Partial<BackgroundImageCrop> | null,
): BackgroundImageCrop {
  if (!value) return { ...DEFAULT_BACKGROUND_IMAGE_CROP };

  const width = clamp(value.width ?? 1, 0.05, 1);
  const height = clamp(value.height ?? 1, 0.05, 1);
  const x = clamp(value.x ?? 0, 0, 1 - width);
  const y = clamp(value.y ?? 0, 0, 1 - height);

  return { x, y, width, height };
}

export function parseBackgroundImageAdjust(
  raw: string | null | undefined,
): BackgroundImageAdjust | undefined {
  if (!raw) return undefined;

  try {
    const parsed = JSON.parse(raw) as BackgroundImageAdjust;
    if (isBackgroundImageCrop(parsed)) {
      return normalizeBackgroundImageCrop(parsed);
    }
    if (isLegacyTransform(parsed)) {
      return {
        scale: clamp(parsed.scale ?? 1, 1, 4),
        focalX: clamp(parsed.focalX ?? 0.5, 0, 1),
        focalY: clamp(parsed.focalY ?? 0.5, 0, 1),
      };
    }
    return undefined;
  } catch {
    return undefined;
  }
}

export function resolveBackgroundImageCrop(
  adjust: BackgroundImageAdjust | null | undefined,
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
): BackgroundImageCrop {
  if (!adjust) {
    return defaultCropForCover(containerW, containerH, imageW, imageH);
  }

  if (isBackgroundImageCrop(adjust)) {
    return normalizeBackgroundImageCrop(adjust);
  }

  return legacyTransformToCrop(imageW, imageH, adjust);
}

export function defaultCropForCover(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
): BackgroundImageCrop {
  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const displayW = imageW * coverScale;
  const displayH = imageH * coverScale;
  const left = (containerW - displayW) / 2;
  const top = (containerH - displayH) / 2;

  return cropFromEditorState(containerW, containerH, imageW, imageH, 1, left, top);
}

/**
 * Kullanıcının kırptığı zoom'u korur; hedef en-boy oranına sığdırmak için
 * kenarlardan keser (cover). Widget, uygulama içi kartla aynı yakınlıkta kalır.
 */
export function coverCropToAspect(
  crop: BackgroundImageCrop,
  imageW: number,
  imageH: number,
  targetAspect: number,
): BackgroundImageCrop {
  if (imageW <= 0 || imageH <= 0 || targetAspect <= 0) {
    return normalizeBackgroundImageCrop(crop);
  }

  const source = normalizeBackgroundImageCrop(crop);
  let widthPx = source.width * imageW;
  let heightPx = source.height * imageH;
  const centerX = (source.x + source.width / 2) * imageW;
  const centerY = (source.y + source.height / 2) * imageH;
  const cropAspect = widthPx / heightPx;

  if (targetAspect > cropAspect) {
    heightPx = widthPx / targetAspect;
  } else {
    widthPx = heightPx * targetAspect;
  }

  const xPx = clamp(centerX - widthPx / 2, 0, Math.max(0, imageW - widthPx));
  const yPx = clamp(centerY - heightPx / 2, 0, Math.max(0, imageH - heightPx));

  return normalizeBackgroundImageCrop({
    x: xPx / imageW,
    y: yPx / imageH,
    width: widthPx / imageW,
    height: heightPx / imageH,
  });
}

export function cropToPixelRect(
  crop: BackgroundImageCrop,
  imageW: number,
  imageH: number,
): { originX: number; originY: number; width: number; height: number } {
  const source = normalizeBackgroundImageCrop(crop);
  const originX = clamp(Math.round(source.x * imageW), 0, Math.max(0, imageW - 1));
  const originY = clamp(Math.round(source.y * imageH), 0, Math.max(0, imageH - 1));
  const width = clamp(Math.round(source.width * imageW), 1, imageW - originX);
  const height = clamp(Math.round(source.height * imageH), 1, imageH - originY);
  return { originX, originY, width, height };
}

export function computePhotoLayoutFill(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  crop: BackgroundImageCrop,
): PhotoLayout {
  const srcW = crop.width * imageW;
  const srcH = crop.height * imageH;
  const scale = Math.max(containerW / srcW, containerH / srcH);
  const width = imageW * scale;
  const height = imageH * scale;

  return {
    width,
    height,
    left: -crop.x * imageW * scale,
    top: -crop.y * imageH * scale,
  };
}

export function computePhotoLayout(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  adjust?: BackgroundImageAdjust | null,
): PhotoLayout {
  const crop = resolveBackgroundImageCrop(adjust, containerW, containerH, imageW, imageH);
  return computePhotoLayoutFill(containerW, containerH, imageW, imageH, crop);
}

/** Oran koruyarak kapla; odak noktası kullanıcının kırpma merkezinden gelir. */
export function computePhotoLayoutCover(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  adjust?: BackgroundImageAdjust | null,
): PhotoLayout {
  const crop = resolveBackgroundImageCrop(adjust, containerW, containerH, imageW, imageH);
  const scale = Math.max(containerW / imageW, containerH / imageH);
  const width = imageW * scale;
  const height = imageH * scale;
  const focalX = (crop.x + crop.width / 2) * width;
  const focalY = (crop.y + crop.height / 2) * height;

  return {
    width,
    height,
    left: containerW / 2 - focalX,
    top: containerH / 2 - focalY,
  };
}

export function cropFromEditorState(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number,
  imageLeft: number,
  imageTop: number,
): BackgroundImageCrop {
  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const displayW = imageW * coverScale * scale;
  const displayH = imageH * coverScale * scale;

  const visLeft = clamp(-imageLeft, 0, displayW);
  const visTop = clamp(-imageTop, 0, displayH);
  const visRight = clamp(containerW - imageLeft, 0, displayW);
  const visBottom = clamp(containerH - imageTop, 0, displayH);

  return normalizeBackgroundImageCrop({
    x: visLeft / displayW,
    y: visTop / displayH,
    width: (visRight - visLeft) / displayW,
    height: (visBottom - visTop) / displayH,
  });
}

export function cropFromEditorOffset(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number,
  translateX: number,
  translateY: number,
): BackgroundImageCrop {
  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const displayW = imageW * coverScale * scale;
  const displayH = imageH * coverScale * scale;
  const imageLeft = (containerW - displayW) / 2 + translateX;
  const imageTop = (containerH - displayH) / 2 + translateY;

  return cropFromEditorState(containerW, containerH, imageW, imageH, scale, imageLeft, imageTop);
}

export function editorStateFromCrop(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  adjust?: BackgroundImageAdjust | null,
): { scale: number; translateX: number; translateY: number } {
  const crop = resolveBackgroundImageCrop(adjust, containerW, containerH, imageW, imageH);
  const fillScale = Math.max(
    containerW / (crop.width * imageW),
    containerH / (crop.height * imageH),
  );
  const displayW = imageW * fillScale;
  const displayH = imageH * fillScale;
  const imageLeft = -crop.x * imageW * fillScale;
  const imageTop = -crop.y * imageH * fillScale;

  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const scale = fillScale / coverScale;
  const centeredLeft = (containerW - imageW * coverScale * scale) / 2;
  const centeredTop = (containerH - imageH * coverScale * scale) / 2;

  return {
    scale,
    translateX: imageLeft - centeredLeft,
    translateY: imageTop - centeredTop,
  };
}

function legacyTransformToCrop(
  imageW: number,
  imageH: number,
  transform: BackgroundImageTransform,
): BackgroundImageCrop {
  const editorW = PHOTO_FRAME_REFERENCE_WIDTH;
  const editorH = PHOTO_FRAME_HEIGHT;
  const coverScale = Math.max(editorW / imageW, editorH / imageH);
  const scale = clamp(transform.scale ?? 1, 1, 4);
  const displayW = imageW * coverScale * scale;
  const displayH = imageH * coverScale * scale;
  const left = clamp(editorW / 2 - transform.focalX * displayW, editorW - displayW, 0);
  const top = clamp(editorH / 2 - transform.focalY * displayH, editorH - displayH, 0);

  return cropFromEditorState(editorW, editorH, imageW, imageH, scale, left, top);
}

export function clampEditorOffset(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number,
  translateX: number,
  translateY: number,
): { translateX: number; translateY: number } {
  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const width = imageW * coverScale * scale;
  const height = imageH * coverScale * scale;
  const minTranslateX = (containerW - width) / 2;
  const maxTranslateX = (width - containerW) / 2;
  const minTranslateY = (containerH - height) / 2;
  const maxTranslateY = (height - containerH) / 2;

  return {
    translateX: clamp(translateX, minTranslateX, maxTranslateX),
    translateY: clamp(translateY, minTranslateY, maxTranslateY),
  };
}

export function resolveImageSize(uri: string): Promise<{ width: number; height: number }> {
  const candidates = uri.startsWith('file://')
    ? [uri, uri.replace('file://', '')]
    : [uri, `file://${uri}`];

  return new Promise((resolve, reject) => {
    const tryNext = (index: number) => {
      if (index >= candidates.length) {
        reject(new Error(`Görsel boyutu okunamadı: ${uri}`));
        return;
      }

      Image.getSize(
        candidates[index]!,
        (width, height) => {
          if (width > 0 && height > 0) {
            resolve({ width, height });
            return;
          }
          tryNext(index + 1);
        },
        () => tryNext(index + 1),
      );
    };

    tryNext(0);
  });
}
