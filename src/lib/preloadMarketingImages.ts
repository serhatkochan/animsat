import { Asset } from 'expo-asset';

export const MARKETING_IMAGE_MODULES = [
  require('@/assets/images/onboarding-home.jpg'),
  require('@/assets/images/onboarding-widget.jpg'),
  require('@/assets/images/onboarding-add-photo.jpg'),
  require('@/assets/images/onboarding-add.jpg'),
  require('@/assets/images/paywall-hero.jpg'),
] as const;

export function preloadMarketingImages() {
  void Asset.loadAsync([...MARKETING_IMAGE_MODULES]);
}
