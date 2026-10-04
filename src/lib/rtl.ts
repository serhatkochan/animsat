import type { TextStyle, ViewStyle } from 'react-native';

import type { CardTextAlign } from '@/src/types';

export function physicalTextAlign(
  align: CardTextAlign,
  isRTL: boolean,
): NonNullable<TextStyle['textAlign']> {
  if (align === 'center' || !isRTL) return align;
  return align === 'left' ? 'right' : 'left';
}

export function startEndAlignItems(
  align: CardTextAlign,
  isRTL: boolean,
): ViewStyle['alignItems'] {
  if (align === 'center') return 'center';
  const start = align === 'left';
  if (!isRTL) return start ? 'flex-start' : 'flex-end';
  return start ? 'flex-end' : 'flex-start';
}

export function startEndJustify(
  align: CardTextAlign,
  isRTL: boolean,
): ViewStyle['justifyContent'] {
  if (align === 'center') return 'center';
  const start = align === 'left';
  if (!isRTL) return start ? 'flex-start' : 'flex-end';
  return start ? 'flex-end' : 'flex-start';
}
