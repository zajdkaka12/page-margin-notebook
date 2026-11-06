import React, { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import theme from '../constants/theme';
import { UNDERLINE_MS } from '../constants/config';

type Props = {
  active: boolean;
  width: number;
};

/** The 300ms gilt save-confirmation stroke. Width animation => JS driver. */
function UnderlineStroke({ active, width }: Props) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const a = Animated.timing(anim, {
      toValue: active ? 1 : 0,
      duration: UNDERLINE_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    a.start();
    return () => a.stop();
  }, [anim, active]);

  const w = anim.interpolate({ inputRange: [0, 1], outputRange: [0, width] });

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        height: 2,
        width: w,
        borderRadius: 2,
        alignSelf: 'center',
        backgroundColor: theme.colors.accent.gilt,
      }}
    />
  );
}

export default React.memo(UnderlineStroke);
