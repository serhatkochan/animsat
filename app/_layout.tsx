import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { EventsProvider } from '@/src/hooks/useEvents';
import { SettingsProvider, useSettings } from '@/src/hooks/useSettings';
import { I18nProvider, useI18n } from '@/src/i18n/I18nProvider';
import { Onboarding } from '@/src/components/Onboarding';
import { preloadMarketingImages } from '@/src/lib/preloadMarketingImages';
import {
  AppThemeProvider,
  fontAssets,
  useAppTheme,
} from '@/src/theme/ThemeProvider';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();

function SplashController() {
  const { ready } = useSettings();

  useEffect(() => {
    if (!ready) return;
    if (typeof requestIdleCallback !== 'undefined') {
      const id = requestIdleCallback(() => {
        void SplashScreen.hideAsync();
      });
      return () => cancelIdleCallback(id);
    }
    const raf = requestAnimationFrame(() => {
      void SplashScreen.hideAsync();
    });
    return () => cancelAnimationFrame(raf);
  }, [ready]);

  return null;
}

function NavigationShell() {
  const { colors, isDark } = useAppTheme();
  const { settings, ready, setHasCompletedOnboarding } = useSettings();
  const { isRTL } = useI18n();

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
        direction: isRTL ? 'rtl' : 'ltr',
        overflow: 'hidden',
      }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background, flex: 1 },
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="event/new"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="event/[id]"
          options={{
            presentation: 'modal',
            animation: 'slide_from_bottom',
            gestureEnabled: true,
          }}
        />
      </Stack>
      {ready ? (
        <Onboarding
          visible={!settings.hasCompletedOnboarding}
          onComplete={() => {
            void setHasCompletedOnboarding(true);
          }}
        />
      ) : null}
    </View>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts(fontAssets);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) preloadMarketingImages();
  }, [loaded]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: '#121212' }}>
      <SettingsProvider>
        <I18nProvider>
          <AppThemeProvider>
            <EventsProvider>
              <SplashController />
              <NavigationShell />
            </EventsProvider>
          </AppThemeProvider>
        </I18nProvider>
      </SettingsProvider>
    </GestureHandlerRootView>
  );
}
