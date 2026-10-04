export type EventType = 'countdown' | 'countup';

export type BackgroundType = 'solid' | 'gradient' | 'photo';

export type BackgroundImageCrop = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** @deprecated Eski focal/scale kayıtları için. */
export type BackgroundImageTransform = {
  scale: number;
  focalX: number;
  focalY: number;
};

export type BackgroundImageAdjust = BackgroundImageCrop | BackgroundImageTransform;

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface CountdownEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  repeatYearly: boolean;
  categoryId: string;
  color: string;
  colorSecondary?: string;
  gradientColors?: string[];
  backgroundType: BackgroundType;
  backgroundImageUri?: string;
  backgroundImageTransform?: BackgroundImageAdjust;
  /** Ana ekran widget'ı için ayrı fotoğraf kırpması (329×155 oranı). @deprecated widgetBackgroundImageTransforms kullan */
  widgetBackgroundImageTransform?: BackgroundImageAdjust;
  /** Boyut başına widget fotoğraf kırpması (2×2, 4×2, 4×4). */
  widgetBackgroundImageTransforms?: WidgetBackgroundImageTransforms;
  /** Widget metin boyutu (ana ekran + kilit ekranı) — yalnızca pinli tarihlerde. */
  widgetTextScale?: WidgetTextScale;
  /** @deprecated widgetTextScale kullan */
  homeScreenWidgetScale?: WidgetTextScale;
  /** @deprecated widgetTextScale kullan */
  lockScreenWidgetScale?: LockScreenWidgetScale;
  emoji?: string;
  notes?: string;
  remindersEnabled: boolean;
  reminderDays: number[];
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventWithMeta extends CountdownEvent {
  dayCount: number;
  effectiveDate: Date;
  category?: Category;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export type CardTextPlacement =
  | 'center'
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'center-left'
  | 'center-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export type CardTextAlign = 'left' | 'center' | 'right';

export type WidgetTextScale = 85 | 100 | 115 | 130;

/** @deprecated WidgetTextScale kullan */
export type LockScreenWidgetScale = WidgetTextScale;

/** @deprecated WidgetTextScale kullan */
export type HomeScreenWidgetScale = WidgetTextScale;

/** Ana ekran widget boyutları: küçük (2×2), orta (4×2), büyük (4×4). */
export type WidgetPhotoSizeKey = 'small' | 'medium' | 'large';

export type WidgetBackgroundImageTransforms = Partial<
  Record<WidgetPhotoSizeKey, BackgroundImageAdjust>
>;

export interface AppSettings {
  themeMode: ThemeMode;
  reminderHour: number;
  reminderMinute: number;
  pinnedEventId?: string | null;
  cardTextPlacement: CardTextPlacement;
  cardTextAlign: CardTextAlign;
  /** Boş/null ise kart ayarları kullanılır. */
  widgetTextPlacement?: CardTextPlacement | null;
  widgetTextAlign?: CardTextAlign | null;
  locale?: string | null;
  hasCompletedOnboarding?: boolean;
  isPro?: boolean;
  appOpenCount?: number;
  proPromptCount?: number;
  lastProPromptAt?: string | null;
}

export interface EventFormData {
  title: string;
  date: Date;
  gradientColors: string[];
  backgroundType: BackgroundType;
  backgroundImageUri?: string;
  backgroundImageTransform?: BackgroundImageAdjust;
  widgetBackgroundImageTransforms?: WidgetBackgroundImageTransforms;
  widgetTextScale?: WidgetTextScale;
  remindersEnabled: boolean;
  location?: string;
  /** Yeni etkinlik oluştururken fotoğraf kalıcılığı için önceden atanmış kimlik */
  id?: string;
}
