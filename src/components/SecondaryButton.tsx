import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';
import type { IconType } from './PrimaryButton';

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  height?: number;
  tone?: 'ink' | 'gilt' | 'onDark';
  style?: any;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

const TONES = {
  ink: {
    bg: 'rgba(107,45,62,0.07)',
    border: 'rgba(107,45,62,0.18)',
    fg: theme.colors.accent.burgundy,
  },
  gilt: {
    bg: 'rgba(184,134,47,0.14)',
    border: 'rgba(184,134,47,0.40)',
    fg: theme.colors.accent.burgundy,
  },
  onDark: {
    bg: 'rgba(250,245,233,0.09)',
    border: 'rgba(184,134,47,0.35)',
    fg: theme.colors.text.onDark,
  },
};

/** Same icon contract as PrimaryButton: 24x24, lineHeight 24, gap 10. */
function SecondaryButton({
  label,
  onPress,
  Icon,
  height = 48,
  tone = 'ink',
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const t = TONES[tone];

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anim,
          {
            height,
            backgroundColor: t.bg,
            borderColor: t.border,
            transform: [{ scale }],
          },
        ]}>
        <View style={styles.row}>
          {Icon ? <Icon size={ICON} color={t.fg} strokeWidth={2} /> : null}
          <Text numberOfLines={1} style={[styles.label, { color: t.fg }]}>
            {label}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    flex: 1,
  },
  anim: {
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  label: {
    fontFamily: theme.font.serif,
    fontSize: 13,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.2,
  },
});

export default React.memo(SecondaryButton);
