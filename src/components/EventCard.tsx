import { router } from 'expo-router';
import { useCallback, useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, Swipeable } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

import { EventCountdownContent } from '@/src/components/EventCountdownContent';
import type { PinAnchor } from '@/src/components/PinActionOverlay';
import { useSettings } from '@/src/hooks/useSettings';
import { useI18n } from '@/src/i18n/I18nProvider';
import { EventBackground } from '@/src/lib/eventStyle';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import type { EventWithMeta } from '@/src/types';

export const LIST_CARD_HEIGHT = 168;

type EventCardProps = {
  event: EventWithMeta;
  onDelete?: (id: string) => void;
  onPinLongPress?: (id: string, anchor: PinAnchor) => void;
};

function CardContent({ event }: { event: EventWithMeta }) {
  const { settings } = useSettings();

  return (
    <EventBackground
      event={event}
      style={styles.cardBackground}
      overlayColor="rgba(0,0,0,0.14)">
      <EventCountdownContent
        event={event}
        variant="compact"
        placement={settings.cardTextPlacement}
        align={settings.cardTextAlign}
        padding={spacing.md}
      />
    </EventBackground>
  );
}

function CardPressable({
  event,
  onPinLongPress,
  onDelete,
}: {
  event: EventWithMeta;
  onPinLongPress?: (id: string, anchor: PinAnchor) => void;
  onDelete?: (id: string) => void;
}) {
  const { t } = useI18n();
  const confirmDelete = () => {
    Alert.alert(t('deleteConfirmTitle'), t('deleteConfirmMessage', { title: event.title }), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('delete'), style: 'destructive', onPress: () => onDelete?.(event.id) },
    ]);
  };

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

  const card = (
    <GestureDetector gesture={gesture}>
      <View style={styles.cardShell}>
        <CardContent event={event} />
      </View>
    </GestureDetector>
  );

  if (!onDelete) return card;

  return (
    <Swipeable
      overshootRight={false}
      renderRightActions={() => (
        <Pressable onPress={confirmDelete} style={styles.deleteAction}>
          <Text style={styles.deleteText}>{t('delete')}</Text>
        </Pressable>
      )}>
      {card}
    </Swipeable>
  );
}

export function EventCard({ event, onDelete, onPinLongPress }: EventCardProps) {
  return <CardPressable event={event} onPinLongPress={onPinLongPress} onDelete={onDelete} />;
}

const styles = StyleSheet.create({
  cardShell: {
    borderRadius: radius.lg,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  cardBackground: {
    width: '100%',
    height: LIST_CARD_HEIGHT,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  deleteAction: {
    backgroundColor: '#C45C4A',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    marginLeft: spacing.sm,
  },
  deleteText: {
    color: '#fff',
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
