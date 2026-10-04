import { Ionicons } from '@expo/vector-icons';
import { Modal, Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { useI18n } from '@/src/i18n/I18nProvider';
import { fonts } from '@/src/theme/ThemeProvider';
import { radius, spacing } from '@/src/theme/tokens';
import { useAppTheme } from '@/src/theme/ThemeProvider';

export type PinAnchor = {
  x: number;
  y: number;
};

type PinActionOverlayProps = {
  visible: boolean;
  anchor: PinAnchor | null;
  isPinned: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
};

const BUTTON_HEIGHT = 36;

export function PinActionOverlay({
  visible,
  anchor,
  isPinned,
  onConfirm,
  onDismiss,
}: PinActionOverlayProps) {
  const { colors } = useAppTheme();
  const { t } = useI18n();
  const { width: screenWidth } = useWindowDimensions();

  if (!visible || !anchor) return null;

  const buttonWidth = isPinned ? 132 : 88;
  const left = Math.min(
    Math.max(spacing.sm, anchor.x - buttonWidth / 2),
    screenWidth - buttonWidth - spacing.sm,
  );
  const top = Math.max(spacing.sm, anchor.y - BUTTON_HEIGHT - spacing.sm);

  return (
    <Modal
      transparent
      visible
      animationType="fade"
      onRequestClose={onDismiss}
      statusBarTranslucent>
      <View style={styles.root} pointerEvents="box-none">
        <Pressable style={styles.backdrop} onPress={onDismiss} accessibilityLabel={t('close')} />
        <View
          pointerEvents="box-none"
          style={[
            styles.popover,
            {
              top,
              left,
              width: buttonWidth,
            },
          ]}>
          <Pressable
            onPress={onConfirm}
            style={({ pressed }) => [
              styles.button,
              {
                backgroundColor: colors.text,
                opacity: pressed ? 0.9 : 1,
              },
            ]}>
            <Ionicons
              name="pin"
              size={14}
              color={colors.background}
              style={isPinned ? styles.pinIconActive : undefined}
            />
            <Text style={[styles.label, { color: colors.background }]}>
              {isPinned ? t('unpin') : t('pin')}
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
  backdrop: {
    ...StyleSheet.absoluteFill,
  },
  popover: {
    position: 'absolute',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: BUTTON_HEIGHT,
    paddingHorizontal: spacing.md,
    borderRadius: radius.full,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  pinIconActive: {
    transform: [{ rotate: '45deg' }],
  },
  label: {
    fontFamily: fonts.bodySemiBold,
    fontSize: 14,
  },
});
