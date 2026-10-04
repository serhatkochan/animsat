import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ImageSourcePropType,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useI18n } from '@/src/i18n/I18nProvider';
import type { MessageKey } from '@/src/i18n/messages';
import { fonts, useAppTheme } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';

type OnboardingProps = {
  visible: boolean;
  onComplete: () => void;
};

const SLIDES: {
  image: ImageSourcePropType;
  title: MessageKey;
  body: MessageKey;
}[] = [
  {
    image: require('@/assets/images/onboarding-home.jpg'),
    title: 'onboardingDatesTitle',
    body: 'onboardingDatesBody',
  },
  {
    image: require('@/assets/images/onboarding-widget.jpg'),
    title: 'onboardingWidgetTitle',
    body: 'onboardingWidgetBody',
  },
  {
    image: require('@/assets/images/onboarding-add-photo.jpg'),
    title: 'onboardingPinTitle',
    body: 'onboardingPinBody',
  },
  {
    image: require('@/assets/images/onboarding-add.jpg'),
    title: 'onboardingPinColorTitle',
    body: 'onboardingPinColorBody',
  },
];

export function Onboarding({ visible, onComplete }: OnboardingProps) {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useAppTheme();
  const { t } = useI18n();
  const pagerRef = useRef<ScrollView>(null);
  const completingRef = useRef(false);
  const [step, setStep] = useState(0);
  const [pageWidth, setPageWidth] = useState(() => Dimensions.get('window').width);
  const lastIndex = SLIDES.length - 1;
  const last = step === lastIndex;

  useEffect(() => {
    if (!visible) {
      completingRef.current = false;
      setStep(0);
      pagerRef.current?.scrollTo({ x: 0, animated: false });
    }
  }, [visible]);

  const finishToCreate = () => {
    if (completingRef.current) return;
    completingRef.current = true;
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onComplete();
    setTimeout(() => {
      router.push('/event/new');
    }, 80);
  };

  const goTo = (index: number) => {
    const next = Math.max(0, Math.min(index, lastIndex));
    setStep(next);
    pagerRef.current?.scrollTo({ x: next * pageWidth, animated: true });
  };

  const goNext = () => {
    if (last) {
      finishToCreate();
      return;
    }
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    goTo(step + 1);
  };

  const maybeFinishFromOffset = (offsetX: number) => {
    if (pageWidth <= 0 || completingRef.current) return;
    const lastStart = lastIndex * pageWidth;
    if (offsetX >= lastStart + pageWidth * 0.28) {
      finishToCreate();
    }
  };

  const onPagerScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    maybeFinishFromOffset(event.nativeEvent.contentOffset.x);
  };

  const onPagerEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (pageWidth <= 0) return;
    const offsetX = event.nativeEvent.contentOffset.x;
    maybeFinishFromOffset(offsetX);
    if (completingRef.current) return;
    const next = Math.round(offsetX / pageWidth);
    if (next !== step) setStep(Math.min(next, lastIndex));
  };

  if (!visible) return null;

  return (
    <Modal
      visible
      animationType="fade"
      transparent={Platform.OS === 'android'}
      presentationStyle={Platform.OS === 'ios' ? 'fullScreen' : 'overFullScreen'}
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={onComplete}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View
        style={[
          styles.root,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + spacing.sm,
            paddingBottom: insets.bottom + spacing.sm,
          },
        ]}>
        <Pressable
          onPress={onComplete}
          hitSlop={12}
          style={styles.skip}
          accessibilityRole="button"
          accessibilityLabel={t('skip')}>
          <Text style={[styles.skipText, { color: colors.textMuted }]}>{t('skip')}</Text>
        </Pressable>

        <ScrollView
          ref={pagerRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onLayout={(event) => setPageWidth(event.nativeEvent.layout.width)}
          onScroll={onPagerScroll}
          scrollEventThrottle={16}
          onMomentumScrollEnd={onPagerEnd}
          style={styles.pager}
          contentContainerStyle={styles.pagerContent}>
          {SLIDES.map((slide, index) => (
            <View key={`${slide.title}-${index}`} style={[styles.page, { width: pageWidth }]}>
              <View style={styles.stage}>
                <View style={[styles.shot, { borderColor: colors.border, backgroundColor: colors.surface }]}>
                  {Math.abs(index - step) <= 1 ? (
                    <Image
                      source={slide.image}
                      style={styles.shotImage}
                      resizeMode="cover"
                      fadeDuration={0}
                      resizeMethod="resize"
                    />
                  ) : null}
                </View>
              </View>
              <View style={styles.copy}>
                <Text style={[styles.title, { color: colors.text }]}>{t(slide.title)}</Text>
                <Text style={[styles.body, { color: colors.textMuted }]}>{t(slide.body)}</Text>
              </View>
            </View>
          ))}
          <View style={[styles.page, { width: pageWidth }]} pointerEvents="none" />
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.dots}>
            {SLIDES.map((slide, index) => (
              <Pressable
                key={`${slide.title}-${index}`}
                onPress={() => goTo(index)}
                hitSlop={8}
                accessibilityRole="button">
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: index === step ? colors.text : colors.border },
                  ]}
                />
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={goNext}
            style={({ pressed }) => [
              styles.primary,
              { backgroundColor: colors.text, opacity: pressed ? 0.9 : 1 },
            ]}>
            <Text style={[styles.primaryText, { color: colors.background }]}>
              {last ? t('onboardingCreateCta') : t('next')}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  skip: {
    alignSelf: 'flex-end',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.lg,
    minHeight: 44,
    justifyContent: 'center',
  },
  skipText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 16,
  },
  pager: {
    flex: 1,
  },
  pagerContent: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  stage: {
    flex: 1,
    minHeight: 220,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shot: {
    height: '100%',
    aspectRatio: 946 / 2048,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
  },
  shotImage: {
    width: '100%',
    height: '100%',
  },
  copy: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    gap: spacing.sm,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 34,
  },
  body: {
    fontFamily: fonts.body,
    fontSize: 16,
    lineHeight: 22,
  },
  footer: {
    gap: spacing.md,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 99,
  },
  primary: {
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: 'center',
    minHeight: 52,
    justifyContent: 'center',
  },
  primaryText: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 16,
  },
});
