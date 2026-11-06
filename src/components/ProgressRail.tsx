import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';
import { RAIL_MS } from '../constants/config';

type Props = {
  value: number;
  total: number;
  height?: number;
  track?: string;
};

/**
 * Width is animated, so useNativeDriver stays false here by necessity —
 * that is the ONLY place in the app where it is off.
 */
function ProgressRail({ value, total, height = 6, track }: Props) {
  const pct = total > 0 ? Math.max(0, Math.min(1, value / total)) : 0;
  const anim = useRef(new Animated.Value(pct)).current;

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: pct,
      duration: RAIL_MS,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    });
    a.start();
    return () => a.stop();
  }, [anim, pct]);

  const width = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View
      style={[
        styles.track,
        { height, borderRadius: height / 2, backgroundColor: track || theme.colors.surface.rail },
      ]}>
      <Animated.View style={{ width, height, borderRadius: height / 2, overflow: 'hidden' }}>
        <LinearGradient
          colors={theme.gradients.gilt}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
});

export default React.memo(ProgressRail);
