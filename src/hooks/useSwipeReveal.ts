import { useMemo, useRef } from 'react';
import { Animated, PanResponder, Vibration } from 'react-native';
import {
  SNAPBACK_SPRING,
  SWIPE_FREE,
  SWIPE_HAPTIC_MS,
  SWIPE_RESISTANCE,
  SWIPE_THRESHOLD,
} from '../constants/config';

/**
 * Horizontal swipe-to-reveal built on PanResponder + Animated only.
 * No extra native gesture dependency is used on this stack.
 */
export function useSwipeReveal(onOpen?: () => void) {
  const translateX = useRef(new Animated.Value(0)).current;
  const openRef = useRef(false);
  const hapticRef = useRef(false);

  const responder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => false,
        onMoveShouldSetPanResponder: (_evt, g) =>
          Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy) * 1.6,
        onPanResponderGrant: () => {
          hapticRef.current = false;
        },
        onPanResponderMove: (_evt, g) => {
          const raw = openRef.current ? g.dx - SWIPE_THRESHOLD : g.dx;
          let next = Math.min(0, raw);
          if (next < -SWIPE_FREE) {
            next = -SWIPE_FREE + (next + SWIPE_FREE) * SWIPE_RESISTANCE;
          }
          if (!hapticRef.current && Math.abs(g.dx) >= SWIPE_THRESHOLD) {
            hapticRef.current = true;
            Vibration.vibrate(SWIPE_HAPTIC_MS);
          }
          translateX.setValue(next);
        },
        onPanResponderRelease: (_evt, g) => {
          const shouldOpen = !openRef.current && g.dx <= -SWIPE_THRESHOLD * 0.6;
          openRef.current = shouldOpen;
          if (shouldOpen && onOpen) {
            onOpen();
          }
          Animated.spring(translateX, {
            toValue: shouldOpen ? -SWIPE_THRESHOLD : 0,
            tension: SNAPBACK_SPRING.tension,
            friction: SNAPBACK_SPRING.friction,
            useNativeDriver: true,
          }).start();
        },
        onPanResponderTerminate: () => {
          openRef.current = false;
          Animated.spring(translateX, {
            toValue: 0,
            tension: SNAPBACK_SPRING.tension,
            friction: SNAPBACK_SPRING.friction,
            useNativeDriver: true,
          }).start();
        },
      }),
    [translateX, onOpen],
  );

  const close = useMemo(
    () => () => {
      openRef.current = false;
      Animated.spring(translateX, {
        toValue: 0,
        tension: SNAPBACK_SPRING.tension,
        friction: SNAPBACK_SPRING.friction,
        useNativeDriver: true,
      }).start();
    },
    [translateX],
  );

  return { translateX, panHandlers: responder.panHandlers, close };
}
