import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { EventCountdownContent } from '@/src/components/EventCountdownContent';
import type { PinAnchor } from '@/src/components/PinActionOverlay';
import { photoFrameContainerStyle } from '@/src/constants/photoFrame';
import { useSettings } from '@/src/hooks/useSettings';
import { EventBackground } from '@/src/lib/eventStyle';
import { radius, spacing } from '@/src/theme/tokens';
import type { EventWithMeta } from '@/src/types';

type HeroCountdownProps = {
  event: EventWithMeta;
  onPinLongPress?: (id: string, anchor: PinAnchor) => void;
};

export function HeroCountdown({ event, onPinLongPress }: HeroCountdownProps) {
  const { settings } = useSettings();

  const triggerPin = useCallback(
    (x: number, y: number) => {
      onPinLongPress?.(event.id, { x, y });
    },
    [event.id, onPinLongPress],
  );

  const openEvent = useCallback(() => {
    router.push({ pathname: '/event/new', params: { id: event.id } });
  }, [event.id]);

  const gesture = useMemo(() => {
    const longPress = Gesture.LongPress()
      .minDuration(450)
      .onStart((e) => {
        runOnJS(triggerPin)(e.absoluteX, e.absoluteY);
      });

    const tap = Gesture.Tap().onEnd(() => {
      runOnJS(openEvent)();
    });

    return Gesture.Exclusive(longPress, tap);
  }, [openEvent, triggerPin]);

  return (
    <GestureDetector gesture={gesture}>
      <View collapsable={false} style={styles.wrap}>
        <EventBackground
          event={event}
          style={[photoFrameContainerStyle(radius.xl), styles.hero]}
          overlayColor="rgba(0,0,0,0.12)">
          <EventCountdownContent
            event={event}
            variant="hero"
            placement={settings.cardTextPlacement}
            align={settings.cardTextAlign}
          />
        </EventBackground>
      </View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  hero: {
    justifyContent: 'center',
  },
});
