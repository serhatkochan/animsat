import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { photoFrameContainerStyle } from '@/src/constants/photoFrame';
import { useEvents } from '@/src/hooks/useEvents';
import { formatEventDate, getDayLabel } from '@/src/lib/dateUtils';
import { EventBackground, getGradientColors } from '@/src/lib/eventStyle';
import { getGradientLocations } from '@/src/lib/gradientUtils';
import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 900;

export default function EventDetailScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getEvent, removeEvent, tickDayCounts } = useEvents();
  const event = getEvent(id);
  const translateY = useSharedValue(0);

  useFocusEffect(
    useCallback(() => {
      tickDayCounts();
    }, [tickDayCounts]),
  );

  const closeScreen = useCallback(() => {
    router.back();
  }, []);

  const panGesture = Gesture.Pan()
    .activeOffsetY(8)
    .failOffsetX([-24, 24])
    .onUpdate((gesture) => {
      if (gesture.translationY > 0) {
        translateY.value = gesture.translationY;
      }
    })
    .onEnd((gesture) => {
      if (gesture.translationY > DISMISS_DISTANCE || gesture.velocityY > DISMISS_VELOCITY) {
        runOnJS(closeScreen)();
        return;
      }
      translateY.value = withSpring(0, { damping: 20, stiffness: 220 });
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: 1 - Math.min(translateY.value / 320, 0.35),
  }));

  if (!event) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.missing, { color: colors.textMuted }]}>Etkinlik bulunamadı</Text>
      </View>
    );
  }

  const isPhoto = event.backgroundType === 'photo' && Boolean(event.backgroundImageUri);
  const gradientColors = getGradientColors(event);
  const gradientLocations = getGradientLocations(gradientColors);

  const onDelete = () => {
    Alert.alert(t('deleteConfirmTitle'), t('deleteConfirmMessage', { title: event.title }), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('delete'),
        style: 'destructive',
        onPress: async () => {
          await removeEvent(event.id);
          router.replace('/');
        },
      },
    ]);
  };

  const heroContent = (
    <View style={isPhoto ? styles.photoHeroContent : styles.gradientHeroContent}>
      <Text style={styles.count}>{event.dayCount}</Text>
      <Text style={styles.label}>{getDayLabel(event.type, event.dayCount)}</Text>
      <Text style={styles.title}>{event.title}</Text>
      <Text style={styles.date}>{formatEventDate(event.effectiveDate)}</Text>
      {event.location ? (
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.92)" />
          <Text style={styles.location}>{event.location}</Text>
        </View>
      ) : null}
    </View>
  );

  const actions = (
    <View style={styles.actions}>
      <Pressable
        onPress={() => router.push({ pathname: '/event/new', params: { id: event.id } })}
        style={[
          styles.primaryButton,
          isPhoto
            ? { backgroundColor: colors.text, borderColor: colors.text }
            : styles.primaryButtonOnGradient,
        ]}>
        <Text style={[styles.primaryText, isPhoto ? { color: colors.background } : undefined]}>
          {t('edit')}
        </Text>
      </Pressable>
      <Pressable
        onPress={onDelete}
        style={[
          styles.dangerButton,
          isPhoto
            ? {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              }
            : styles.dangerButtonOnGradient,
        ]}>
        <Text style={[styles.dangerText, isPhoto ? { color: colors.text } : undefined]}>{t('delete')}</Text>
      </Pressable>
    </View>
  );

  const wrapped = (
    <Animated.View
      style={[styles.sheet, { backgroundColor: colors.background }, animatedStyle]}>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + spacing.md,
            paddingBottom: insets.bottom + spacing.lg,
          },
        ]}>
        <View style={styles.dragHandleWrap}>
          <View
            style={[
              styles.dragHandle,
              { backgroundColor: isPhoto ? colors.textSoft : 'rgba(255,255,255,0.45)' },
            ]}
          />
        </View>

        {isPhoto ? (
          <EventBackground
            event={event}
            style={photoFrameContainerStyle(radius.lg)}
            overlayColor="rgba(0,0,0,0.28)">
            {heroContent}
          </EventBackground>
        ) : (
          <LinearGradient
            colors={gradientColors as [string, string, ...string[]]}
            locations={gradientLocations}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientHero}>
            {heroContent}
          </LinearGradient>
        )}

        {actions}
      </View>
    </Animated.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <GestureDetector gesture={panGesture}>{wrapped}</GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sheet: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  dragHandleWrap: {
    alignItems: 'center',
    paddingBottom: spacing.md,
  },
  dragHandle: {
    width: 42,
    height: 5,
    borderRadius: radius.full,
    opacity: 0.45,
  },
  gradientHero: {
    flex: 1,
    borderRadius: radius.xl,
    overflow: 'hidden',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  gradientHeroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  photoHeroContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  count: {
    fontFamily: fonts.display,
    fontSize: 72,
    lineHeight: 78,
    color: '#fff',
  },
  label: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
    marginBottom: spacing.xs,
    color: 'rgba(255,255,255,0.9)',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 24,
    textAlign: 'center',
    marginBottom: spacing.xs,
    color: '#fff',
  },
  date: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  location: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
  },
  actions: {
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  primaryButton: {
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButtonOnGradient: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  primaryText: {
    color: '#fff',
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
  dangerButton: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  dangerButtonOnGradient: {
    borderColor: 'rgba(255,255,255,0.35)',
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  dangerText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
    color: '#fff',
  },
  missing: {
    fontFamily: fonts.body,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 80,
  },
});
