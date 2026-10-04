import type { Category } from '@/src/types';

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'birthday', name: 'Doğum Günü', color: '#C47A9E', icon: '🎂' },
  { id: 'anniversary', name: 'Yıldönümü', color: '#C45C4A', icon: '💕' },
  { id: 'work', name: 'İş', color: '#4A7FB5', icon: '💼' },
  { id: 'health', name: 'Sağlık', color: '#5B8C5A', icon: '🏥' },
  { id: 'other', name: 'Diğer', color: '#7B6BA8', icon: '📅' },
];

export const DEFAULT_CATEGORY_ID = 'other';
