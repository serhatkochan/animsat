import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { formatEventDate } from '@/src/lib/dateUtils';
import {
  getContentBlockStyle,
  getMetaRowStyle,
  getOverlayContainerStyle,
} from '@/src/lib/cardLayout';
import { physicalTextAlign } from '@/src/lib/rtl';
import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import type { CardTextAlign, CardTextPlacement, EventWithMeta } from '@/src/types';

type EventCountdownContentProps = {
  event: Pick<EventWithMeta, 'title' | 'location' | 'dayCount' | 'effectiveDate'>;
  variant: 'hero' | 'compact';
  placement: CardTextPlacement;
  align: CardTextAlign;
  padding?: number;
  /** Widget metin boyutu önizlemesi için (1 = varsayılan). */
  textScale?: number;
  /** Gün sayısını gizler, alttaki yazının yeri değişmez. */
  hideCount?: boolean;
  /** Tarih satırı yerine gösterilecek metin (ör. paywall’da ∞). */
  dateLabel?: string;
};

const textShadow = {
  textShadowColor: 'rgba(0,0,0,0.35)',
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 6,
};

export function EventCountdownContent({
  event,
  variant,
  placement,
  align,
  padding = spacing.lg,
  textScale = 1,
  hideCount = false,
  dateLabel,
}: EventCountdownContentProps) {
  const isHero = variant === 'hero';
  const scale = (value: number) => Math.round(value * textScale);
  const { isRTL } = useI18n();
  const textAlign = physicalTextAlign(align, isRTL);
  const writingDirection = isRTL ? 'rtl' : 'ltr';

  return (
    <View style={getOverlayContainerStyle(placement, padding)} pointerEvents="none">
      <View style={getContentBlockStyle(align)}>
        <Text
          style={[
            isHero ? styles.heroCount : styles.compactCount,
            textShadow,
            {
              textAlign,
              writingDirection,
              fontSize: scale(isHero ? 72 : 44),
              lineHeight: scale(isHero ? 78 : 48),
              opacity: hideCount ? 0 : 1,
            },
          ]}>
          {event.dayCount}
        </Text>

        {event.title.trim() ? (
          <Text
            style={[
              isHero ? styles.heroTitle : styles.compactTitle,
              textShadow,
              styles.lineSpacing,
              {
                textAlign,
                writingDirection,
                fontSize: scale(isHero ? 28 : 17),
                lineHeight: scale(isHero ? 34 : 22),
              },
            ]}
            numberOfLines={isHero ? 2 : 1}>
            {event.title}
          </Text>
        ) : null}

        <Text
          style={[
            isHero ? styles.heroDate : styles.compactDate,
            textShadow,
            styles.lineSpacing,
            {
              textAlign,
              writingDirection,
              fontSize: scale(isHero ? 15 : 13),
            },
          ]}>
          {dateLabel ?? formatEventDate(event.effectiveDate)}

        </Text>

        {event.location ? (
          <View style={[getMetaRowStyle(align), styles.lineSpacing]}>
            <Ionicons
              name="location-outline"
              size={scale(isHero ? 15 : 13)}
              color="rgba(255,255,255,0.92)"
            />
            <Text
              style={[
                isHero ? styles.heroLocation : styles.compactLocation,
                textShadow,
                {
                  textAlign,
                  writingDirection,
                  fontSize: scale(isHero ? 14 : 13),
                },
              ]}
              numberOfLines={1}>
              {event.location}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCount: {
    fontFamily: fonts.display,
    fontSize: 72,
    lineHeight: 78,
    color: '#fff',
    marginBottom: spacing.sm,
  },
  compactCount: {
    fontFamily: fonts.display,
    fontSize: 44,
    lineHeight: 48,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  lineSpacing: {
    marginTop: spacing.xs,
  },
  heroTitle: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
    color: '#fff',
    flexShrink: 1,
    maxWidth: '100%',
  },
  compactTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 17,
    lineHeight: 22,
    color: '#fff',
    flexShrink: 1,
    maxWidth: '100%',
  },
  heroDate: {
    fontFamily: fonts.body,
    fontSize: 15,
    color: 'rgba(255,255,255,0.92)',
  },
  compactDate: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.92)',
  },
  heroLocation: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    flexShrink: 1,
    maxWidth: '100%',
  },
  compactLocation: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    flexShrink: 1,
    maxWidth: '100%',
  },
});
