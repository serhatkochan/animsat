import { HStack, Image, Rectangle, Spacer, Text, VStack, ZStack } from '@expo/ui/swift-ui';
import {
  aspectRatio,
  clipShape,
  containerBackground,
  containerRelativeFrame,
  font,
  foregroundStyle,
  frame,
  lineLimit,
  minimumScaleFactor,
  monospacedDigit,
  multilineTextAlignment,
  padding,
  resizable,
  shadow,
} from '@expo/ui/swift-ui/modifiers';
import { createWidget, type WidgetEnvironment } from 'expo-widgets';

import type { CardTextAlign, CardTextPlacement } from '@/src/types';

export type CountdownWidgetProps = {
  isEmpty: boolean;
  title: string;
  dayCount: number;
  dateLabel: string;
  location: string;
  emptyHint: string;
  backgroundType: 'gradient' | 'photo';
  gradientColors: string[];
  photoSmallUri: string;
  photoMediumUri: string;
  photoLargeUri: string;
  textPlacement: CardTextPlacement;
  textAlign: CardTextAlign;
  widgetTextScale: number;
  refSmallWidth: number;
  refSmallHeight: number;
  refMediumWidth: number;
  refMediumHeight: number;
  refLargeWidth: number;
  refLargeHeight: number;
  refLockWidth: number;
  refLockHeight: number;
  accentColor: string;
  accentColorSecondary: string;
};

const CountdownWidget = (props: CountdownWidgetProps, environment: WidgetEnvironment) => {
  'widget';

  const PHOTO_FRAME_HEIGHT = 280;
  const OVERLAY_COLOR = 'rgba(0,0,0,0.12)';
  const TEXT_SHADOW = { radius: 6, x: 0, y: 1, color: 'rgba(0,0,0,0.35)' };
  const WIDGET_STANDARD_MARGIN = 16;
  const WIDGET_TIGHT_MARGIN = 11;
  const WIDGET_MIN_FONT = 11;

  function clampFont(size: number) {
    return Math.max(WIDGET_MIN_FONT, size);
  }

function sizeOr(width: number, height: number, fallbackW: number, fallbackH: number) {
    const w = width > 0 ? width : fallbackW;
    const h = height > 0 ? height : fallbackH;
    return { width: w, height: h, aspect: w / h };
  }

  function normalizeFamily(family: string) {
    const value = (family || '').toLowerCase();
    if (value.includes('small') && !value.includes('extra')) return 'systemSmall';
    if (value.includes('medium')) return 'systemMedium';
    if (value.includes('extralarge') || value.includes('extra-large')) return 'systemExtraLarge';
    if (value.includes('large')) return 'systemLarge';
    if (value.includes('rect')) return 'accessoryRectangular';
    if (value.includes('circular')) return 'accessoryCircular';
    if (value.includes('inline')) return 'accessoryInline';
    return family;
  }

  function getContainerSize(family: string) {
    const normalized = normalizeFamily(family);
    switch (normalized) {
      case 'systemSmall':
        return sizeOr(props.refSmallWidth, props.refSmallHeight, 158, 158);
      case 'systemMedium':
        return sizeOr(props.refMediumWidth, props.refMediumHeight, 338, 158);
      case 'systemLarge':
        return sizeOr(props.refLargeWidth, props.refLargeHeight, 338, 354);
      case 'accessoryRectangular':
        return sizeOr(props.refLockWidth, props.refLockHeight, 160, 72);
      default:
        return sizeOr(props.refMediumWidth, props.refMediumHeight, 338, 158);
    }
  }

  function isSmallHomeWidget(family: string) {
    return normalizeFamily(family) === 'systemSmall';
  }

  function isLockScreenFamily(family: string) {
    return normalizeFamily(family) === 'accessoryRectangular';
  }

  function getSwiftUITextAlign(align: CardTextAlign): 'leading' | 'center' | 'trailing' {
    if (align === 'left') return 'leading';
    if (align === 'right') return 'trailing';
    return 'center';
  }

  function getSwiftUIOverlayPlacement(placement: CardTextPlacement) {
    switch (placement) {
      case 'top-left':
        return { showTopSpacer: false, showBottomSpacer: true, showLeadingSpacer: false, showTrailingSpacer: true };
      case 'top-center':
        return { showTopSpacer: false, showBottomSpacer: true, showLeadingSpacer: true, showTrailingSpacer: true };
      case 'top-right':
        return { showTopSpacer: false, showBottomSpacer: true, showLeadingSpacer: true, showTrailingSpacer: false };
      case 'center-left':
        return { showTopSpacer: true, showBottomSpacer: true, showLeadingSpacer: false, showTrailingSpacer: true };
      case 'center':
        return { showTopSpacer: true, showBottomSpacer: true, showLeadingSpacer: true, showTrailingSpacer: true };
      case 'center-right':
        return { showTopSpacer: true, showBottomSpacer: true, showLeadingSpacer: true, showTrailingSpacer: false };
      case 'bottom-left':
        return { showTopSpacer: true, showBottomSpacer: false, showLeadingSpacer: false, showTrailingSpacer: true };
      case 'bottom-center':
        return { showTopSpacer: true, showBottomSpacer: false, showLeadingSpacer: true, showTrailingSpacer: true };
      case 'bottom-right':
        return { showTopSpacer: true, showBottomSpacer: false, showLeadingSpacer: true, showTrailingSpacer: false };
    }
  }

  function isNonFullColorMode(renderingMode: string | null | undefined) {
    return renderingMode === 'accented' || renderingMode === 'vibrant';
  }

  function isTintedLockScreen(renderingMode: string | null | undefined) {
    return isNonFullColorMode(renderingMode);
  }

  function lockScreenTextStyle(size: number, weight: 'bold' | 'semibold' | 'regular', tinted: boolean, opacity = 1) {
    const base = [font({ weight, size }), lineLimit(1), minimumScaleFactor(0.75)];
    if (tinted) return base;
    return [
      ...base,
      foregroundStyle(opacity >= 1 ? '#FFFFFF' : `rgba(255,255,255,${opacity})`),
      shadow(TEXT_SHADOW),
    ];
  }

  function getTypography(family: string, widgetTextScale: number) {
    if (isLockScreenFamily(family)) {
      const scale = widgetTextScale / 100;

      return {
        scale,
        padding: Math.max(WIDGET_TIGHT_MARGIN, Math.round(WIDGET_TIGHT_MARGIN * scale)),
        countSize: clampFont(32 * scale),
        titleSize: clampFont(14 * scale),
        dateSize: clampFont(12 * scale),
        locationSize: WIDGET_MIN_FONT,
        iconSize: WIDGET_MIN_FONT,
        countBottomGap: 0,
        lineGap: 1,
        compact: true,
        isSmall: true,
      };
    }

    const { height } = getContainerSize(family);
    const textScale = widgetTextScale / 100;
    const sizeScale = height / PHOTO_FRAME_HEIGHT;
    const scale = sizeScale * textScale;
    const isSmall = isSmallHomeWidget(family);

    return {
      scale,
      padding: Math.max(WIDGET_STANDARD_MARGIN, Math.round(WIDGET_STANDARD_MARGIN * sizeScale)),
      countSize: (isSmall ? 52 : 72) * scale,
      titleSize: clampFont((isSmall ? 15 : 28) * scale),
      dateSize: clampFont((isSmall ? 11 : 15) * scale),
      locationSize: clampFont((isSmall ? 11 : 14) * scale),
      iconSize: clampFont((isSmall ? 11 : 15) * scale),
      countBottomGap: isSmall ? 2 * scale : 8 * scale,
      lineGap: isSmall ? WIDGET_TIGHT_MARGIN / 4 : WIDGET_TIGHT_MARGIN / 2,
      compact: isSmall,
      isSmall,
    };
  }

  function textModifiers(size: number, align: CardTextAlign) {
    return [
      font({ weight: 'bold', size }),
      foregroundStyle('#FFFFFF'),
      shadow(TEXT_SHADOW),
      multilineTextAlignment(getSwiftUITextAlign(align)),
    ];
  }

  function bodyTextModifiers(size: number, align: CardTextAlign, opacity = 1) {
    return [
      font({ size }),
      foregroundStyle(`rgba(255,255,255,${opacity})`),
      shadow(TEXT_SHADOW),
      multilineTextAlignment(getSwiftUITextAlign(align)),
    ];
  }

  function photoUriForFamily(family: string) {
    const normalized = normalizeFamily(family);
    if (normalized === 'systemSmall') {
      return props.photoSmallUri || props.photoMediumUri || props.photoLargeUri;
    }
    if (normalized === 'systemLarge') {
      return props.photoLargeUri || props.photoMediumUri || props.photoSmallUri;
    }
    return props.photoMediumUri || props.photoLargeUri || props.photoSmallUri;
  }

  function renderPhotoBackground(family: string) {
    const uri = photoUriForFamily(family);
    if (!uri) return null;

    return (
      <>
        <Image
          uiImage={uri}
          modifiers={[
            resizable(),
            aspectRatio({ contentMode: 'fill' }),
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            clipShape('rectangle'),
          ]}
        />
        <Rectangle
          modifiers={[
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            foregroundStyle(OVERLAY_COLOR),
          ]}
        />
      </>
    );
  }

  function renderBackground(
    showBackground: boolean,
    usePhoto: boolean,
    colors: string[],
    family: string,
  ) {
    if (!showBackground) return null;

    if (usePhoto) {
      return renderPhotoBackground(family);
    }

    return (
      <Rectangle
        modifiers={[
          frame({ maxWidth: Infinity, maxHeight: Infinity }),
          foregroundStyle({
            type: 'linearGradient',
            colors,
            startPoint: { x: 0, y: 0 },
            endPoint: { x: 1, y: 1 },
          }),
        ]}
      />
    );
  }

  const isLockScreen = isLockScreenFamily(environment.widgetFamily);
  const renderingMode = environment.widgetRenderingMode;
  const isFullColor = renderingMode == null || renderingMode === 'fullColor';
  const isAccentedOrVibrant = isNonFullColorMode(renderingMode);
  const showPhotoBackground =
    isFullColor &&
    !isLockScreen &&
    !isAccentedOrVibrant &&
    props.backgroundType === 'photo' &&
    Boolean(photoUriForFamily(environment.widgetFamily));
  const showGradientBackground = isFullColor && !isAccentedOrVibrant;
  const typography = getTypography(
    environment.widgetFamily,
    props.widgetTextScale || 100,
  );

  const colors =
    props.gradientColors.length >= 2
      ? props.gradientColors
      : [props.accentColor, props.accentColorSecondary];

  const widgetContainerBackground = showPhotoBackground
    ? 'clear'
    : showGradientBackground
      ? props.accentColor
      : 'clear';

  if (props.isEmpty) {
    return (
      <ZStack
        alignment="topLeading"
        modifiers={[
          containerBackground(widgetContainerBackground, 'widget'),
        ]}>
        {showGradientBackground ? (
          <Rectangle
            modifiers={[
              frame({ maxWidth: Infinity, maxHeight: Infinity }),
              foregroundStyle({
                type: 'linearGradient',
                colors: [props.accentColor, props.accentColorSecondary],
                startPoint: { x: 0, y: 0 },
                endPoint: { x: 1, y: 1 },
              }),
            ]}
          />
        ) : null}
        {isLockScreen ? (
          <HStack
            modifiers={[
              frame({ maxWidth: Infinity, maxHeight: Infinity }),
              padding({ horizontal: WIDGET_TIGHT_MARGIN, vertical: typography.padding }),
            ]}
            alignment="center"
            spacing={8}>
            <Text modifiers={[font({ weight: 'semibold', size: typography.titleSize }), lineLimit(1)]}>
              Anımsat
            </Text>
            <Spacer />
            <Text modifiers={[font({ size: typography.dateSize }), lineLimit(1)]}>{props.emptyHint}</Text>
          </HStack>
        ) : (
          <VStack
            modifiers={[
              frame({ maxWidth: Infinity, maxHeight: Infinity }),
              padding({ all: typography.padding }),
            ]}>
            <Text modifiers={textModifiers(typography.titleSize, 'left')}>Anımsat</Text>
            <Spacer />
            <Text modifiers={bodyTextModifiers(typography.dateSize, 'left', 0.9)}>
              {props.emptyHint}
            </Text>
          </VStack>
        )}
      </ZStack>
    );
  }

  if (isLockScreen) {
    const tinted = isTintedLockScreen(renderingMode);
    const lockBackground = isFullColor && !tinted;

    return (
      <ZStack
        alignment="leading"
        modifiers={[
          clipShape('rectangle'),
          containerBackground(lockBackground ? props.accentColor : 'clear', 'widget'),
        ]}>
        {lockBackground ? renderBackground(true, false, colors, environment.widgetFamily) : null}
        <HStack
          modifiers={[
            containerRelativeFrame({ axes: 'both', span: 1, count: 1 }),
            padding({ horizontal: WIDGET_TIGHT_MARGIN, vertical: typography.padding }),
          ]}
          alignment="center"
          spacing={8}>
          <Text
            modifiers={[
              ...lockScreenTextStyle(typography.countSize, 'bold', tinted),
              monospacedDigit(),
            ]}>
            {String(props.dayCount)}
          </Text>
          <VStack
            alignment="leading"
            spacing={typography.lineGap}
            modifiers={[frame({ maxWidth: Infinity })]}>
            <Text modifiers={lockScreenTextStyle(typography.titleSize, 'semibold', tinted)}>
              {props.title}
            </Text>
            {props.dateLabel ? (
              <Text modifiers={lockScreenTextStyle(typography.dateSize, 'regular', tinted, 0.85)}>
                {props.dateLabel}
              </Text>
            ) : null}
          </VStack>
        </HStack>
      </ZStack>
    );
  }

  const placement = getSwiftUIOverlayPlacement(props.textPlacement);
  const align = props.textAlign;
  const stackAlign = getSwiftUITextAlign(align);

  const locationRow = props.location ? (
    <HStack spacing={6 * typography.scale} alignment="center">
      <Image
        systemName="mappin.and.ellipse"
        modifiers={[
          font({ size: typography.iconSize }),
          foregroundStyle('rgba(255,255,255,0.92)'),
          shadow(TEXT_SHADOW),
        ]}
      />
      <Text
        modifiers={[
          ...bodyTextModifiers(typography.locationSize, align, 0.85),
          lineLimit(1),
          minimumScaleFactor(0.8),
        ]}>
        {props.location}
      </Text>
    </HStack>
  ) : null;

  return (
    <ZStack
      alignment="topLeading"
      modifiers={[
        clipShape('rectangle'),
        containerBackground(widgetContainerBackground, 'widget'),
      ]}>
      {showPhotoBackground ? (
        <Rectangle
          modifiers={[
            frame({ maxWidth: Infinity, maxHeight: Infinity }),
            foregroundStyle('#000000'),
          ]}
        />
      ) : null}
      {renderBackground(
        showPhotoBackground || showGradientBackground,
        showPhotoBackground,
        colors,
        environment.widgetFamily,
      )}

      {typography.isSmall ? (
        <VStack
          modifiers={[
            containerRelativeFrame({ axes: 'both', span: 1, count: 1 }),
            padding({ all: typography.padding }),
          ]}
          alignment={stackAlign}
          spacing={typography.lineGap}>
          <Text
            modifiers={[
              ...textModifiers(typography.countSize, align),
              lineLimit(1),
              minimumScaleFactor(0.7),
            ]}>
            {String(props.dayCount)}
          </Text>
          <Text
            modifiers={[
              ...textModifiers(typography.titleSize, align),
              lineLimit(2),
              minimumScaleFactor(0.75),
            ]}>
            {props.title}
          </Text>
          {props.dateLabel ? (
            <Text
              modifiers={[
                ...bodyTextModifiers(typography.dateSize, align, 0.9),
                lineLimit(1),
                minimumScaleFactor(0.75),
              ]}>
              {props.dateLabel}
            </Text>
          ) : null}
        </VStack>
      ) : (
      <VStack
        modifiers={[
          frame({ maxWidth: Infinity, maxHeight: Infinity }),
          padding({ all: typography.padding }),
        ]}>
        {placement.showTopSpacer ? <Spacer /> : null}
        <HStack modifiers={[frame({ maxWidth: Infinity })]} alignment="center">
          {placement.showLeadingSpacer ? <Spacer /> : null}
          <VStack alignment={stackAlign} spacing={typography.lineGap}>
            <Text
              modifiers={[
                ...textModifiers(typography.countSize, align),
                padding({ bottom: typography.countBottomGap }),
              ]}>
              {String(props.dayCount)}
            </Text>

            <Text
              modifiers={[
                ...textModifiers(typography.titleSize, align),
                lineLimit(2),
                minimumScaleFactor(0.75),
              ]}>
              {props.title}
            </Text>

            {props.dateLabel ? (
              <Text
                modifiers={[
                  ...bodyTextModifiers(typography.dateSize, align, 0.92),
                  lineLimit(1),
                  minimumScaleFactor(0.75),
                ]}>
                {props.dateLabel}
              </Text>
            ) : null}

            {locationRow && align === 'center' ? (
              <HStack modifiers={[frame({ maxWidth: Infinity })]} alignment="center">
                <Spacer />
                {locationRow}
                <Spacer />
              </HStack>
            ) : locationRow && align === 'right' ? (
              <HStack modifiers={[frame({ maxWidth: Infinity })]} alignment="center">
                <Spacer />
                {locationRow}
              </HStack>
            ) : (
              locationRow
            )}
          </VStack>
          {placement.showTrailingSpacer ? <Spacer /> : null}
        </HStack>
        {placement.showBottomSpacer ? <Spacer /> : null}
      </VStack>
      )}
    </ZStack>
  );
};

export const CountdownHomeWidget = createWidget('CountdownWidget', CountdownWidget);
export const CountdownLockWidget = createWidget('CountdownLockWidget', CountdownWidget);
export default CountdownHomeWidget;
