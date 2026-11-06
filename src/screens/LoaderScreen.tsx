import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StatusBar, StyleSheet, Text, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bookmark } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import theme from '../constants/theme';
import {
  LOADER_BAR_MS,
  LOADER_DURATION_MS,
  LOADER_FADE_MS,
  PLATE_SPRING,
} from '../constants/config';

type Props = {
  onDone: () => void;
};

const BAR_W = 190;

function LoaderScreen({ onDone }: Props) {
  const plateScale = useRef(new Animated.Value(0.86)).current;
  const plateOpacity = useRef(new Animated.Value(0)).current;
  const titleProgress = useRef(new Animated.Value(0)).current;
  const ruleScale = useRef(new Animated.Value(0)).current;
  const barWidth = useRef(new Animated.Value(0)).current;
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const doneRef = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(plateScale, {
        toValue: 1,
        tension: PLATE_SPRING.tension,
        friction: PLATE_SPRING.friction,
        useNativeDriver: true,
      }),
      Animated.timing(plateOpacity, {
        toValue: 1,
        duration: 420,
        useNativeDriver: true,
      }),
      Animated.timing(titleProgress, {
        toValue: 1,
        duration: 500,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(ruleScale, {
        toValue: 1,
        duration: 600,
        delay: 700,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // width animation -> JS driver by necessity
    Animated.timing(barWidth, {
      toValue: 1,
      duration: LOADER_BAR_MS,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: LOADER_FADE_MS,
        useNativeDriver: true,
      }).start(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onDone();
        }
      });
    }, LOADER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [plateScale, plateOpacity, titleProgress, ruleScale, barWidth, screenOpacity, onDone]);

  const titleRise = titleProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [14, 0],
  });

  const barFill = barWidth.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_W],
  });

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <AppShell variant="dark">
        <View style={styles.center}>
          <Animated.View
            pointerEvents="none"
            style={[
              styles.plate,
              { opacity: plateOpacity, transform: [{ scale: plateScale }] },
            ]}>
            <View style={styles.plateInner} />
            <View style={styles.logo}>
              <Bookmark
                size={88}
                color={theme.colors.accent.gilt}
                strokeWidth={1.2}
              />
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={{ opacity: titleProgress, transform: [{ translateY: titleRise }] }}>
            <Text style={styles.brand}>PAGE MARGIN</Text>
            <Text style={styles.brandSub}>NOTEBOOK</Text>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[styles.giltRule, { transform: [{ scaleX: ruleScale }] }]}
          />

          <Text style={styles.tagline}>WHAT YOU THOUGHT WHILE READING</Text>

          <View style={styles.barTrack}>
            <Animated.View style={[styles.barFill, { width: barFill }]}>
              <LinearGradient
                colors={theme.gradients.gilt}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.barGradient}
              />
            </Animated.View>
          </View>
          <Text style={styles.loading}>LOADING...</Text>
        </View>
      </AppShell>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.dark,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  plate: {
    width: 180,
    height: 180,
    borderRadius: 10,
    backgroundColor: 'rgba(250,245,233,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(184,134,47,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  plateInner: {
    position: 'absolute',
    left: 8,
    right: 8,
    top: 8,
    bottom: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(250,245,233,0.10)',
  },
  logo: {
    width: 132,
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    fontFamily: theme.font.serif,
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 3,
    textAlign: 'center',
    color: theme.colors.text.onDark,
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowRadius: 8,
    textShadowOffset: { width: 0, height: 2 },
  },
  brandSub: {
    marginTop: 6,
    fontFamily: theme.font.serif,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 7,
    textAlign: 'center',
    color: theme.colors.accent.gilt,
  },
  giltRule: {
    width: 120,
    height: 1,
    marginVertical: 18,
    backgroundColor: 'rgba(184,134,47,0.70)',
  },
  tagline: {
    fontSize: 11,
    letterSpacing: 2,
    textAlign: 'center',
    color: theme.colors.text.onDarkMuted,
  },
  barTrack: {
    marginTop: 34,
    width: BAR_W,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'rgba(233,223,200,0.16)',
    overflow: 'hidden',
  },
  barFill: {
    height: 3,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barGradient: {
    flex: 1,
  },
  loading: {
    marginTop: 12,
    fontSize: 10,
    letterSpacing: 3,
    color: 'rgba(233,223,200,0.45)',
  },
});

export default LoaderScreen;
