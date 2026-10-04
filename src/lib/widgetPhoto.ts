import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system/legacy';
import { widgetsDirectory } from 'expo-widgets';
import { Platform } from 'react-native';

import { resolveIosWidgetDimensions } from '@/src/constants/widgetFrame';
import {
  getPersistedEventPhotoUri,
  persistEventPhoto,
} from '@/src/lib/eventPhotoStorage';
import {
  coverCropToAspect,
  cropToPixelRect,
  resolveBackgroundImageCrop,
  resolveImageSize,
} from '@/src/lib/photoTransform';
import type { CountdownEvent, WidgetPhotoSizeKey } from '@/src/types';

export type WidgetPhotoPayload = {
  photoSmallUri: string;
  photoMediumUri: string;
  photoLargeUri: string;
};

const EMPTY_PHOTO: WidgetPhotoPayload = {
  photoSmallUri: '',
  photoMediumUri: '',
  photoLargeUri: '',
};

const RETINA_SCALE = 3;

function normalizeFileUri(uri: string): string {
  return uri.startsWith('file://') ? uri : `file://${uri}`;
}

function widgetDirBase(): string {
  const base = widgetsDirectory?.replace(/\/+$/, '');
  if (!base) {
    throw new Error('Widget dizini bulunamadı');
  }
  return base;
}

function widgetPhotoUri(eventId: string, size: WidgetPhotoSizeKey, stamp: number): string {
  return `${widgetDirBase()}/widget-${eventId}-${size}-${stamp}.jpg`;
}

async function removeStaleWidgetPhotos(eventId: string, size: WidgetPhotoSizeKey) {
  try {
    const base = widgetDirBase();
    const entries = await FileSystem.readDirectoryAsync(`${base}/`);
    const prefix = `widget-${eventId}-${size}`;
    await Promise.all(
      entries
        .filter((name) => name.startsWith(prefix))
        .map((name) => FileSystem.deleteAsync(`${base}/${name}`, { idempotent: true })),
    );
  } catch {
    // Eski dosya yoksa sorun değil.
  }
}

async function copyToWidget(sourceUri: string, destination: string): Promise<string> {
  const normalizedSource = normalizeFileUri(sourceUri);
  const normalizedDestination = normalizeFileUri(destination);

  const widgetDir = widgetsDirectory?.replace(/\/+$/, '');
  if (widgetDir) {
    await FileSystem.makeDirectoryAsync(`${widgetDir}/`, { intermediates: true });
  }

  try {
    await FileSystem.copyAsync({ from: normalizedSource, to: normalizedDestination });
  } catch {
    const base64 = await FileSystem.readAsStringAsync(normalizedSource, {
      encoding: FileSystem.EncodingType.Base64,
    });
    await FileSystem.writeAsStringAsync(normalizedDestination, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }

  const copied = await FileSystem.getInfoAsync(normalizedDestination);
  if (!copied.exists) {
    throw new Error('Widget fotoğrafı kopyalanamadı');
  }

  return normalizedDestination;
}

async function renderWidgetPhoto(params: {
  sourceUri: string;
  eventId: string;
  size: WidgetPhotoSizeKey;
  imageWidth: number;
  imageHeight: number;
  crop: ReturnType<typeof resolveBackgroundImageCrop>;
  widgetWidth: number;
  widgetHeight: number;
  stamp: number;
}): Promise<string> {
  const covered = coverCropToAspect(
    params.crop,
    params.imageWidth,
    params.imageHeight,
    params.widgetWidth / params.widgetHeight,
  );
  const rect = cropToPixelRect(covered, params.imageWidth, params.imageHeight);
  const result = await manipulateAsync(
    params.sourceUri,
    [
      { crop: rect },
      {
        resize: {
          width: Math.round(params.widgetWidth * RETINA_SCALE),
          height: Math.round(params.widgetHeight * RETINA_SCALE),
        },
      },
    ],
    { compress: 0.88, format: SaveFormat.JPEG },
  );

  await removeStaleWidgetPhotos(params.eventId, params.size);
  return copyToWidget(result.uri, widgetPhotoUri(params.eventId, params.size, params.stamp));
}

export async function prepareWidgetPhoto(
  event: Pick<
    CountdownEvent,
    | 'id'
    | 'backgroundType'
    | 'backgroundImageUri'
    | 'backgroundImageTransform'
    | 'widgetBackgroundImageTransforms'
    | 'widgetBackgroundImageTransform'
  >,
): Promise<WidgetPhotoPayload> {
  if (Platform.OS !== 'ios') return EMPTY_PHOTO;
  if (event.backgroundType !== 'photo') return EMPTY_PHOTO;

  try {
    let sourceUri = event.backgroundImageUri?.split('?')[0];
    if (sourceUri) {
      sourceUri = sourceUri.startsWith('file://') ? sourceUri : `file://${sourceUri}`;
    }

    const sourceInfo = sourceUri
      ? await FileSystem.getInfoAsync(sourceUri)
      : { exists: false };
    if (!sourceInfo.exists) {
      sourceUri = (await getPersistedEventPhotoUri(event.id)) ?? undefined;
    }

    if (!sourceUri && event.backgroundImageUri) {
      sourceUri = await persistEventPhoto(event.id, event.backgroundImageUri);
    }

    if (!sourceUri) return EMPTY_PHOTO;

    const { width, height } = await resolveImageSize(sourceUri);
    const sizes = resolveIosWidgetDimensions();
    const adjust =
      event.backgroundImageTransform ??
      event.widgetBackgroundImageTransforms?.medium ??
      event.widgetBackgroundImageTransforms?.small ??
      event.widgetBackgroundImageTransform;
    const crop = resolveBackgroundImageCrop(
      adjust,
      sizes.medium.width,
      sizes.medium.height,
      width,
      height,
    );
    const stamp = Date.now();

    const [photoSmallUri, photoMediumUri, photoLargeUri] = await Promise.all([
      renderWidgetPhoto({
        sourceUri,
        eventId: event.id,
        size: 'small',
        imageWidth: width,
        imageHeight: height,
        crop,
        widgetWidth: sizes.small.width,
        widgetHeight: sizes.small.height,
        stamp,
      }),
      renderWidgetPhoto({
        sourceUri,
        eventId: event.id,
        size: 'medium',
        imageWidth: width,
        imageHeight: height,
        crop,
        widgetWidth: sizes.medium.width,
        widgetHeight: sizes.medium.height,
        stamp,
      }),
      renderWidgetPhoto({
        sourceUri,
        eventId: event.id,
        size: 'large',
        imageWidth: width,
        imageHeight: height,
        crop,
        widgetWidth: sizes.large.width,
        widgetHeight: sizes.large.height,
        stamp,
      }),
    ]);

    return { photoSmallUri, photoMediumUri, photoLargeUri };
  } catch (error) {
    console.warn('Widget fotoğrafı hazırlanamadı:', error);
    return EMPTY_PHOTO;
  }
}
