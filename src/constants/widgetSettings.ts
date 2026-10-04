import type { WidgetTextScale } from '@/src/types';

export const WIDGET_TEXT_SCALES: {
  value: WidgetTextScale;
  label: string;
}[] = [
  { value: 85, label: 'Küçük' },
  { value: 100, label: 'Normal' },
  { value: 115, label: 'Büyük' },
  { value: 130, label: 'Çok büyük' },
];
