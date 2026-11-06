import { useEffect, useRef } from 'react';
import { Animated, Easing } from 'react-native';
import { FADE_MS, STAGGER_MS } from '../constants/config';

/**
 * Fade + rise entry with a per-index stagger. Transform/opacity only, so the
 * native driver is safe here.
 */
export function useStagger(index: number, rise: number = 12, duration: number = FADE_MS) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay: index * STAGGER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, index, duration]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [rise, 0],
  });

  return { opacity: progress, transform: [{ translateY }] };
}

/** Horizontal variant used by the book-spine strip. */
export function useStaggerX(index: number, shift: number = 16, duration: number = 260) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(progress, {
      toValue: 1,
      duration,
      delay: index * STAGGER_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    anim.start();
    return () => anim.stop();
  }, [progress, index, duration]);

  const translateX = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [shift, 0],
  });

  return { opacity: progress, transform: [{ translateX }] };
}

/** Pop-in used by the tag chips. */
export function usePop(index: number) {
  const scale = useRef(new Animated.Value(0.8)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        tension: 220,
        friction: 11,
        delay: index * STAGGER_MS,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        delay: index * STAGGER_MS,
        useNativeDriver: true,
      }),
    ]);
    anim.start();
    return () => anim.stop();
  }, [scale, opacity, index]);

  return { opacity, transform: [{ scale }] };
}
