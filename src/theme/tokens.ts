export const palette = {
  cream: '#FAF8F5',
  creamDark: '#F0EBE3',
  charcoal: '#121212',
  charcoalLight: '#1E1E1E',
  ink: '#1A1A1A',
  inkMuted: '#6B6560',
  inkSoft: '#9A948D',
  white: '#FFFFFF',
  border: '#E8E2DA',
  borderDark: '#2A2A2A',
} as const;

export const accentPresets = [
  '#C45C4A',
  '#D4845A',
  '#C9A227',
  '#5B8C5A',
  '#4A7FB5',
  '#7B6BA8',
  '#C47A9E',
  '#4A9090',
] as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
} as const;

export type ThemeColors = {
  background: string;
  surface: string;
  surfaceElevated: string;
  text: string;
  textMuted: string;
  textSoft: string;
  border: string;
  tabBar: string;
  heroOverlay: string;
};

export const lightTheme: ThemeColors = {
  background: palette.cream,
  surface: palette.white,
  surfaceElevated: palette.white,
  text: palette.ink,
  textMuted: palette.inkMuted,
  textSoft: palette.inkSoft,
  border: palette.border,
  tabBar: palette.cream,
  heroOverlay: 'rgba(250, 248, 245, 0.85)',
};

export const darkTheme: ThemeColors = {
  background: palette.charcoal,
  surface: palette.charcoalLight,
  surfaceElevated: '#282828',
  text: palette.cream,
  textMuted: '#A8A29E',
  textSoft: '#78716C',
  border: palette.borderDark,
  tabBar: palette.charcoal,
  heroOverlay: 'rgba(18, 18, 18, 0.9)',
};
