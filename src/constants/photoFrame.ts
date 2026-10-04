import { radius, spacing } from '@/src/theme/tokens';

/** Düzenleyici önizlemesi ile birebir aynı fotoğraf çerçevesi. */
export const PHOTO_FRAME_HEIGHT = 280;

export const photoFrameContainerStyle = (borderRadius: number = radius.lg) => ({
  width: '100%' as const,
  height: PHOTO_FRAME_HEIGHT,
  borderRadius,
  overflow: 'hidden' as const,
});

/** Crop editörü ve legacy dönüşüm için referans genişlik (padding hariç). */
export const PHOTO_FRAME_REFERENCE_WIDTH = 327;

export const PHOTO_FRAME_ASPECT_RATIO = PHOTO_FRAME_REFERENCE_WIDTH / PHOTO_FRAME_HEIGHT;

/** Liste / form yatay boşluğu ile editör margin'i aynı. */
export const PHOTO_FRAME_HORIZONTAL_INSET = spacing.lg;
