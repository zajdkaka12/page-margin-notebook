import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { usePressScale } from '../hooks/usePressScale';

export type IconType = React.ComponentType<{
  size?: number;
  color?: string;
  strokeWidth?: number;
}>;

type Props = {
  label: string;
  onPress: () => void;
  Icon?: IconType;
  disabled?: boolean;
  height?: number;
  colors?: string[];
  style?: any;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };
const ICON = 24;

/**
 * Pressable is the PARENT, the Animated.View is the CHILD — the only press
 * pattern that keeps onPress alive in an Android release build.
 * Icon is a fixed 24x24 SVG, the label's lineHeight matches it, gap is 10.
 */
function PrimaryButton({
  label,
  onPress,
  Icon,
  disabled = false,
  height = 58,
  colors,
  style,
}: Props) {
  const { scale, onPressIn, onPressOut } = usePressScale(0.96);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
      hitSlop={HIT}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={[styles.press, { height }, style]}>
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.anim,
          theme.shadows.cta,
          { height, transform: [{ scale }], opacity: disabled ? 0.45 : 1 },
        ]}>
        <LinearGradient
          colors={colors || theme.gradients.burgundy}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.fill, { height }]}>
          <View style={styles.row}>
            {Icon ? <Icon size={ICON} color={theme.colors.text.onDark} strokeWidth={2} /> : null}
            <Text numberOfLines={1} style={styles.label}>
              {label}
            </Text>
          </View>
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  press: {
    width: '100%',
  },
  anim: {
    width: '100%',
    borderRadius: 10,
  },
  fill: {
    width: '100%',
    borderRadius: 10,
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
    fontSize: 16,
    lineHeight: ICON,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: theme.colors.text.onDark,
  },
});

export default React.memo(PrimaryButton);
