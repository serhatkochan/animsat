import type { ReactNode } from 'react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import {
  cropFromEditorOffset,
  editorStateFromCrop,
  resolveImageSize,
} from '@/src/lib/photoTransform';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius } from '@/src/theme/tokens';
import type { BackgroundImageAdjust, BackgroundImageCrop } from '@/src/types';

const MIN_SCALE = 1;
const MAX_SCALE = 4;

export type PhotoCropEditorHandle = {
  getCrop: () => BackgroundImageCrop | null;
  isReady: () => boolean;
};

type PhotoCropEditorProps = {
  uri: string;
  frameAspectRatio: number;
  initialTransform?: BackgroundImageAdjust | null;
  overlay?: ReactNode;
};

function clampOffset(
  containerW: number,
  containerH: number,
  imageW: number,
  imageH: number,
  scale: number,
  translateX: number,
  translateY: number,
) {
  'worklet';

  const coverScale = Math.max(containerW / imageW, containerH / imageH);
  const width = imageW * coverScale * scale;
  const height = imageH * coverScale * scale;
  const minTranslateX = (containerW - width) / 2;
  const maxTranslateX = (width - containerW) / 2;
  const minTranslateY = (containerH - height) / 2;
  const maxTranslateY = (height - containerH) / 2;

  return {
    translateX: Math.min(maxTranslateX, Math.max(minTranslateX, translateX)),
    translateY: Math.min(maxTranslateY, Math.max(minTranslateY, translateY)),
  };
}

export const PhotoCropEditor = forwardRef<PhotoCropEditorHandle, PhotoCropEditorProps>(
  function PhotoCropEditor({ uri, frameAspectRatio, initialTransform, overlay }, ref) {
    const { colors } = useAppTheme();

    const containerW = useSharedValue(0);
    const containerH = useSharedValue(280);
    const imageW = useSharedValue(0);
    const imageH = useSharedValue(0);

    const scale = useSharedValue(1);
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const startScale = useSharedValue(1);
    const startTranslateX = useSharedValue(0);
    const startTranslateY = useSharedValue(0);

    const [layout, setLayout] = useState({ width: 0, height: 0 });
    const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
    const [loadError, setLoadError] = useState(false);

    const isReady = layout.width > 0 && layout.height > 0 && imageSize.width > 0 && imageSize.height > 0;

    useImperativeHandle(ref, () => ({
      getCrop: () => {
        if (!isReady) return null;
        return cropFromEditorOffset(
          layout.width,
          layout.height,
          imageSize.width,
          imageSize.height,
          scale.value,
          translateX.value,
          translateY.value,
        );
      },
      isReady: () => isReady,
    }));

    useEffect(() => {
      setImageSize({ width: 0, height: 0 });
      setLoadError(false);

      if (!uri) return;

      let cancelled = false;

      resolveImageSize(uri)
        .then((size) => {
          if (cancelled) return;
          setImageSize(size);
        })
        .catch(() => {
          if (cancelled) return;
          setLoadError(true);
        });

      return () => {
        cancelled = true;
      };
    }, [uri]);

    useEffect(() => {
      if (!isReady) return;

      containerW.value = layout.width;
      containerH.value = layout.height;
      imageW.value = imageSize.width;
      imageH.value = imageSize.height;

      const offset = editorStateFromCrop(
        layout.width,
        layout.height,
        imageSize.width,
        imageSize.height,
        initialTransform,
      );

      scale.value = offset.scale;
      translateX.value = offset.translateX;
      translateY.value = offset.translateY;
      startScale.value = offset.scale;
      startTranslateX.value = offset.translateX;
      startTranslateY.value = offset.translateY;
    }, [
      isReady,
      layout.width,
      layout.height,
      imageSize.width,
      imageSize.height,
      initialTransform,
      containerH,
      containerW,
      imageH,
      imageW,
      scale,
      startScale,
      startTranslateX,
      startTranslateY,
      translateX,
      translateY,
    ]);

    const animatedImageStyle = useAnimatedStyle(() => {
      if (containerW.value <= 0 || containerH.value <= 0 || imageW.value <= 0 || imageH.value <= 0) {
        return { width: 0, height: 0, opacity: 0 };
      }

      const coverScale = Math.max(containerW.value / imageW.value, containerH.value / imageH.value);
      const width = imageW.value * coverScale * scale.value;
      const height = imageH.value * coverScale * scale.value;

      return {
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        opacity: 1,
        transform: [
          { translateX: (containerW.value - width) / 2 + translateX.value },
          { translateY: (containerH.value - height) / 2 + translateY.value },
        ],
      };
    });

    const pinchGesture = Gesture.Pinch()
      .onBegin(() => {
        startScale.value = scale.value;
        startTranslateX.value = translateX.value;
        startTranslateY.value = translateY.value;
      })
      .onUpdate((event) => {
        const nextScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale.value * event.scale));
        scale.value = nextScale;

        const clamped = clampOffset(
          containerW.value,
          containerH.value,
          imageW.value,
          imageH.value,
          nextScale,
          startTranslateX.value,
          startTranslateY.value,
        );
        translateX.value = clamped.translateX;
        translateY.value = clamped.translateY;
      })
      .onEnd(() => {
        startScale.value = scale.value;
        startTranslateX.value = translateX.value;
        startTranslateY.value = translateY.value;
      });

    const panGesture = Gesture.Pan()
      .onBegin(() => {
        startTranslateX.value = translateX.value;
        startTranslateY.value = translateY.value;
      })
      .onUpdate((event) => {
        const clamped = clampOffset(
          containerW.value,
          containerH.value,
          imageW.value,
          imageH.value,
          scale.value,
          startTranslateX.value + event.translationX,
          startTranslateY.value + event.translationY,
        );
        translateX.value = clamped.translateX;
        translateY.value = clamped.translateY;
      })
      .onEnd(() => {
        startTranslateX.value = translateX.value;
        startTranslateY.value = translateY.value;
      });

    const gesture = Gesture.Simultaneous(pinchGesture, panGesture);

    return (
      <View
        style={[styles.previewFrame, { borderColor: colors.border, aspectRatio: frameAspectRatio }]}>
        <GestureDetector gesture={gesture}>
          <View
            style={[
              styles.previewCanvas,
              { backgroundColor: colors.surface, aspectRatio: frameAspectRatio },
            ]}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (width > 0 && height > 0) {
                setLayout({ width, height });
              }
            }}>
            {!isReady && !loadError ? (
              <View style={styles.loadingWrap}>
                <ActivityIndicator color={colors.text} />
              </View>
            ) : null}
            {loadError ? (
              <View style={styles.loadingWrap}>
                <Text style={[styles.errorText, { color: colors.textMuted }]}>
                  Fotoğraf yüklenemedi
                </Text>
              </View>
            ) : null}
            {isReady ? (
              <Animated.View style={animatedImageStyle}>
                <Image source={{ uri }} style={styles.previewImage} resizeMode="cover" />
              </Animated.View>
            ) : null}
            {overlay}
          </View>
        </GestureDetector>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  previewFrame: {
    width: '100%',
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
  },
  previewCanvas: {
    width: '100%',
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  loadingWrap: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 14,
    textAlign: 'center',
  },
});
