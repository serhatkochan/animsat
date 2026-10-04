import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { Image, StyleSheet, View, type ImageStyle, type StyleProp, type ViewStyle } from 'react-native';

import { computePhotoLayout, computePhotoLayoutCover, resolveImageSize } from '@/src/lib/photoTransform';
import type { BackgroundImageAdjust } from '@/src/types';

export type PhotoFitMode = 'fill' | 'cover';

type PhotoBackgroundProps = {
  uri: string;
  transform?: BackgroundImageAdjust | null;
  fitMode?: PhotoFitMode;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  overlayColor?: string;
  children?: ReactNode;
};

export function PhotoBackground({
  uri,
  transform,
  fitMode = 'fill',
  style,
  imageStyle,
  overlayColor,
  children,
}: PhotoBackgroundProps) {
  const [container, setContainer] = useState({ width: 0, height: 0 });
  const [image, setImage] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setImage({ width: 0, height: 0 });
    if (!uri) return;

    resolveImageSize(uri)
      .then((size) => setImage(size))
      .catch(() => {});
  }, [uri]);

  const layout = useMemo(() => {
    if (!container.width || !container.height || !image.width || !image.height) {
      return null;
    }

    const compute = fitMode === 'cover' ? computePhotoLayoutCover : computePhotoLayout;
    return compute(
      container.width,
      container.height,
      image.width,
      image.height,
      transform,
    );
  }, [container, image, transform, fitMode]);

  return (
    <View
      style={[styles.container, style]}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        if (width > 0 && height > 0) {
          setContainer({ width, height });
        }
      }}>
      <Image
        key={uri}
        source={{ uri }}
        style={
          layout
            ? [
                styles.image,
                {
                  width: layout.width,
                  height: layout.height,
                  left: layout.left,
                  top: layout.top,
                },
                imageStyle,
              ]
            : [StyleSheet.absoluteFill, styles.fallbackImage, imageStyle, { opacity: image.width ? 1 : 0 }]
        }
        resizeMode="cover"
        onLoad={(event) => {
          const { width, height } = event.nativeEvent.source;
          if (width && height) {
            setImage({ width, height });
          }
        }}
      />
      {overlayColor ? <View style={[styles.overlay, { backgroundColor: overlayColor }]} pointerEvents="none" /> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
  },
  fallbackImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
  },
});
