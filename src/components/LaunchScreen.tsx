import { Image, StyleSheet, Text, View } from 'react-native';

import { BrandAtmosphere } from '@/src/components/BrandAtmosphere';
import { APP_NAME } from '@/src/constants/branding';
import { fonts } from '@/src/theme/ThemeProvider';

const LOGO = require('@/assets/images/android-icon-foreground.png');

export function LaunchScreen() {
  return (
    <View style={styles.root}>
      <BrandAtmosphere idPrefix="launch" />
      <View style={styles.center}>
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>{APP_NAME}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#000',
    zIndex: 2000,
    elevation: 2000,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 48,
  },
  logo: {
    width: 168,
    height: 168,
  },
  title: {
    marginTop: 20,
    fontFamily: fonts.display,
    fontSize: 40,
    lineHeight: 46,
    color: '#FAF8F5',
  },
});
