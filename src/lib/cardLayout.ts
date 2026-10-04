import type { ViewStyle } from 'react-native';

import type { CardTextAlign, CardTextPlacement } from '@/src/types';
import type { MessageKey } from '@/src/i18n/messages';

function parsePlacement(placement: CardTextPlacement): [
  ViewStyle['justifyContent'],
  ViewStyle['alignItems'],
] {
  switch (placement) {
    case 'top-left':
      return ['flex-start', 'flex-start'];
    case 'top-center':
      return ['flex-start', 'center'];
    case 'top-right':
      return ['flex-start', 'flex-end'];
    case 'center-left':
      return ['center', 'flex-start'];
    case 'center':
      return ['center', 'center'];
    case 'center-right':
      return ['center', 'flex-end'];
    case 'bottom-left':
      return ['flex-end', 'flex-start'];
    case 'bottom-center':
      return ['flex-end', 'center'];
    case 'bottom-right':
      return ['flex-end', 'flex-end'];
  }
}

export function getOverlayContainerStyle(
  placement: CardTextPlacement,
  padding: number,
): ViewStyle {
  const [justifyContent, alignItems] = parsePlacement(placement);

  return {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding,
    justifyContent,
    alignItems,
  };
}

export function getContentBlockStyle(align: CardTextAlign): ViewStyle {
  return {
    alignItems:
      align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    maxWidth: '100%',
  };
}

export function getMetaRowStyle(align: CardTextAlign): ViewStyle {
  return {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    justifyContent:
      align === 'left' ? 'flex-start' : align === 'right' ? 'flex-end' : 'center',
    maxWidth: '100%',
  };
}

export function getSwiftUITextAlign(
  align: CardTextAlign,
): 'leading' | 'center' | 'trailing' {
  if (align === 'left') return 'leading';
  if (align === 'right') return 'trailing';
  return 'center';
}

export function getSwiftUIOverlayPlacement(placement: CardTextPlacement): {
  showTopSpacer: boolean;
  showBottomSpacer: boolean;
  showLeadingSpacer: boolean;
  showTrailingSpacer: boolean;
} {
  const [justifyContent, alignItems] = parsePlacement(placement);

  return {
    showTopSpacer: justifyContent !== 'flex-start',
    showBottomSpacer: justifyContent !== 'flex-end',
    showLeadingSpacer: alignItems !== 'flex-start',
    showTrailingSpacer: alignItems !== 'flex-end',
  };
}

export const CARD_TEXT_PLACEMENTS: CardTextPlacement[] = [
  'top-left',
  'top-center',
  'top-right',
  'center-left',
  'center',
  'center-right',
  'bottom-left',
  'bottom-center',
  'bottom-right',
];

export const CARD_TEXT_ALIGNS: CardTextAlign[] = ['left', 'center', 'right'];

export const PLACEMENT_MESSAGE_KEYS: Record<CardTextPlacement, MessageKey> = {
  'top-left': 'placeTopLeft',
  'top-center': 'placeTopCenter',
  'top-right': 'placeTopRight',
  'center-left': 'placeCenterLeft',
  center: 'placeCenter',
  'center-right': 'placeCenterRight',
  'bottom-left': 'placeBottomLeft',
  'bottom-center': 'placeBottomCenter',
  'bottom-right': 'placeBottomRight',
};

export const ALIGN_MESSAGE_KEYS: Record<CardTextAlign, MessageKey> = {
  center: 'alignCenter',
  left: 'alignLeft',
  right: 'alignRight',
};
