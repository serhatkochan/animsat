import { FlashList } from '@shopify/flash-list';
import { useFocusEffect } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useCallback, useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { APP_NAME } from '@/src/constants/branding';
import { EmptyState } from '@/src/components/EmptyState';
import { EventCard } from '@/src/components/EventCard';
import { HomeHeader } from '@/src/components/HomeHeader';
import { HeroCountdown } from '@/src/components/HeroCountdown';
import { PinActionOverlay, type PinAnchor } from '@/src/components/PinActionOverlay';
import { useEvents } from '@/src/hooks/useEvents';
import { useSettings } from '@/src/hooks/useSettings';
import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts } from '@/src/theme/ThemeProvider';
import { spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';
import type { EventWithMeta } from '@/src/types';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { settings, setPinnedEventId } = useSettings();
  const { t } = useI18n();
  const { events, ready, removeEvent, tickDayCounts } = useEvents();
  const [pinMenuEventId, setPinMenuEventId] = useState<string | null>(null);
  const [pinAnchor, setPinAnchor] = useState<PinAnchor | null>(null);
  const [allEventsInList, setAllEventsInList] = useState(false);

  useFocusEffect(
    useCallback(() => {
      tickDayCounts();
    }, [tickDayCounts]),
  );

  const { hero, rest, isPinnedHero, showHero } = useMemo(() => {
    const pinnedId = settings.pinnedEventId;
    const pinned = pinnedId ? events.find((event) => event.id === pinnedId) : undefined;

    if (pinned) {
      return {
        hero: pinned,
        rest: events.filter((event) => event.id !== pinned.id),
        isPinnedHero: true,
        showHero: true,
      };
    }

    if (allEventsInList) {
      return {
        hero: undefined,
        rest: events,
        isPinnedHero: false,
        showHero: false,
      };
    }

    const nearest = events[0];
    return {
      hero: nearest,
      rest: events.slice(1),
      isPinnedHero: false,
      showHero: Boolean(nearest),
    };
  }, [allEventsInList, events, settings.pinnedEventId]);

  const handlePin = useCallback(
    (id: string | null) => {
      void setPinnedEventId(id);
    },
    [setPinnedEventId],
  );

  const openPinMenu = useCallback((id: string, anchor: PinAnchor) => {
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setPinMenuEventId(id);
    setPinAnchor(anchor);
  }, []);

  const closePinMenu = useCallback(() => {
    setPinMenuEventId(null);
    setPinAnchor(null);
  }, []);

  const confirmPinMenu = useCallback(() => {
    if (!pinMenuEventId) return;

    if (pinMenuEventId === settings.pinnedEventId) {
      handlePin(null);
      setAllEventsInList(events[0]?.id === pinMenuEventId);
    } else {
      handlePin(pinMenuEventId);
      setAllEventsInList(false);
    }
    setPinMenuEventId(null);
    setPinAnchor(null);
  }, [events, handlePin, pinMenuEventId, settings.pinnedEventId]);

  const pinMenuIsPinned = pinMenuEventId === settings.pinnedEventId;

  if (!ready) {
    return (
      <View style={[styles.loader, { backgroundColor: colors.background }]}>
        <ActivityIndicator color={colors.text} />
      </View>
    );
  }

  if (events.length === 0) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + spacing.md,
            paddingHorizontal: spacing.lg,
          },
        ]}>
        <HomeHeader title={APP_NAME} />
        <EmptyState />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlashList
        data={rest}
        keyExtractor={(item) => item.id}
        onScrollBeginDrag={closePinMenu}
        contentContainerStyle={{
          paddingTop: insets.top + spacing.md,
          paddingHorizontal: spacing.lg,
          paddingBottom: insets.bottom + 100,
        }}
        ListHeaderComponent={
          <View>
            <HomeHeader title={APP_NAME} />
            {showHero && hero ? (
              <HeroCountdown event={hero} onPinLongPress={openPinMenu} />
            ) : null}
            {rest.length > 0 ? (
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                {isPinnedHero ? t('otherDates') : t('dates')}
              </Text>
            ) : null}
          </View>
        }
        renderItem={({ item }: { item: EventWithMeta }) => (
          <EventCard
            event={item}
            onDelete={removeEvent}
            onPinLongPress={openPinMenu}
          />
        )}
      />
      <PinActionOverlay
        visible={pinMenuEventId !== null}
        anchor={pinAnchor}
        isPinned={pinMenuIsPinned}
        onConfirm={confirmPinMenu}
        onDismiss={closePinMenu}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
    marginBottom: spacing.sm,
    marginTop: spacing.xs,
  },
});
