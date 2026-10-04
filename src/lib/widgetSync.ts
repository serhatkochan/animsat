import { addDays, startOfDay } from 'date-fns';
import { Platform } from 'react-native';

import { resolveIosWidgetDimensions } from '@/src/constants/widgetFrame';
import { formatEventDate, calculateDayCount } from '@/src/lib/dateUtils';
import { getGradientColors } from '@/src/lib/eventStyle';
import { translate } from '@/src/i18n/translate';
import { prepareWidgetPhoto, type WidgetPhotoPayload } from '@/src/lib/widgetPhoto';
import type { AppSettings, EventWithMeta } from '@/src/types';
import type { CountdownWidgetProps } from '@/widgets/CountdownWidget';

const iosDims = resolveIosWidgetDimensions();

const EMPTY_WIDGET: CountdownWidgetProps = {
  isEmpty: true,
  title: 'Anımsat',
  dayCount: 0,
    dateLabel: '',
    emptyHint: translate('widgetEmptyHint'),
    location: '',
  backgroundType: 'gradient',
  gradientColors: ['#C45C4A', '#8B4A3A'],
  photoSmallUri: '',
  photoMediumUri: '',
  photoLargeUri: '',
  textPlacement: 'bottom-left',
  textAlign: 'left',
  widgetTextScale: 100,
  refSmallWidth: iosDims.small.width,
  refSmallHeight: iosDims.small.height,
  refMediumWidth: iosDims.medium.width,
  refMediumHeight: iosDims.medium.height,
  refLargeWidth: iosDims.large.width,
  refLargeHeight: iosDims.large.height,
  refLockWidth: iosDims.lockRectangular.width,
  refLockHeight: iosDims.lockRectangular.height,
  accentColor: '#C45C4A',
  accentColorSecondary: '#8B4A3A',
};

type WidgetSettings = Pick<
  AppSettings,
  'pinnedEventId' | 'cardTextPlacement' | 'cardTextAlign' | 'widgetTextPlacement' | 'widgetTextAlign'
>;

function resolveWidgetTextSettings(settings: WidgetSettings) {
  return {
    textPlacement: settings.widgetTextPlacement ?? settings.cardTextPlacement,
    textAlign: settings.widgetTextAlign ?? settings.cardTextAlign,
  };
}

function propsForEvent(
  event: EventWithMeta,
  settings: WidgetSettings,
  photo: WidgetPhotoPayload,
  at = startOfDay(new Date()),
): CountdownWidgetProps {
  const { dayCount, effectiveDate } = calculateDayCount(
    event.type,
    event.date,
    event.repeatYearly,
    at,
  );
  const gradientColors = getGradientColors(event);
  const hasPhoto = Boolean(photo.photoSmallUri || photo.photoMediumUri || photo.photoLargeUri);
  const widgetText = resolveWidgetTextSettings(settings);
  const sizes = resolveIosWidgetDimensions();

  const widgetTextScale =
    event.widgetTextScale ?? event.homeScreenWidgetScale ?? event.lockScreenWidgetScale ?? 100;

  return {
    isEmpty: false,
    title: event.title,
    dayCount,
    dateLabel: formatEventDate(effectiveDate),
    emptyHint: translate('widgetEmptyHint'),
    location: event.location ?? '',
    backgroundType: hasPhoto ? 'photo' : 'gradient',
    gradientColors,
    photoSmallUri: photo.photoSmallUri,
    photoMediumUri: photo.photoMediumUri,
    photoLargeUri: photo.photoLargeUri,
    textPlacement: widgetText.textPlacement,
    textAlign: widgetText.textAlign,
    widgetTextScale,
    refSmallWidth: sizes.small.width,
    refSmallHeight: sizes.small.height,
    refMediumWidth: sizes.medium.width,
    refMediumHeight: sizes.medium.height,
    refLargeWidth: sizes.large.width,
    refLargeHeight: sizes.large.height,
    refLockWidth: sizes.lockRectangular.width,
    refLockHeight: sizes.lockRectangular.height,
    accentColor: gradientColors[0],
    accentColorSecondary: gradientColors[gradientColors.length - 1] ?? gradientColors[0],
  };
}

/** Yalnızca pinli etkinlik widget'ta gösterilir. */
export function pickWidgetEvent(
  events: EventWithMeta[],
  pinnedEventId?: string | null,
): EventWithMeta | undefined {
  if (!pinnedEventId) return undefined;
  return events.find((event) => event.id === pinnedEventId);
}

export async function syncCountdownWidget(
  events: EventWithMeta[],
  settings: WidgetSettings,
): Promise<void> {
  if (Platform.OS !== 'ios') return;

  try {
    const widgetModule = await import('@/widgets/CountdownWidget');
    const event = pickWidgetEvent(events, settings.pinnedEventId);
    const now = startOfDay(new Date());
    const photo = event ? await prepareWidgetPhoto(event) : { photoSmallUri: '', photoMediumUri: '', photoLargeUri: '' };
    const snapshot = event ? propsForEvent(event, settings, photo, now) : EMPTY_WIDGET;
    const timeline = event
      ? Array.from({ length: 8 }, (_, index) => {
          const date = index === 0 ? new Date() : addDays(now, index);
          return {
            date,
            props: propsForEvent(event, settings, photo, startOfDay(date)),
          };
        })
      : null;

    widgetModule.CountdownHomeWidget.updateSnapshot(snapshot);
    widgetModule.CountdownLockWidget.updateSnapshot(snapshot);

    if (!timeline) return;

    widgetModule.CountdownHomeWidget.updateTimeline(timeline);
    widgetModule.CountdownLockWidget.updateTimeline(timeline);
  } catch (error) {
    console.warn('Widget güncellenemedi:', error);
  }
}
