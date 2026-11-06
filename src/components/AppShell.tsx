import React from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import theme from '../constants/theme';

export type ShellVariant = 'paper' | 'page' | 'compose' | 'dark' | 'summary';

type Props = {
  variant?: ShellVariant;
  children: React.ReactNode;
};

const GRADIENTS: Record<ShellVariant, string[]> = {
  paper: theme.gradients.paper,
  page: theme.gradients.page,
  compose: theme.gradients.compose,
  dark: theme.gradients.dark,
  summary: theme.gradients.summary,
};

const TEXTURE_OPACITY: Record<ShellVariant, number> = {
  paper: 0.1,
  page: 0.07,
  compose: 0.08,
  dark: 0.18,
  summary: 0.14,
};

/**
 * Three depth layers on every screen: gradient ground -> tint wash ->
 * decor blobs -> content. Loader/Summary additionally get a heavy overlay so
 * they never read as the Menu.
 */
function AppShell({ variant = 'paper', children }: Props) {
  const isDark = variant === 'dark' || variant === 'summary';

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={GRADIENTS[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.3, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: isDark
              ? theme.colors.accent.gilt
              : theme.colors.accent.burgundy,
            opacity: TEXTURE_OPACITY[variant],
          },
        ]}
      />

      {isDark ? (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor:
                variant === 'dark'
                  ? theme.colors.ui.loaderOverlay
                  : theme.colors.ui.overlay,
            },
          ]}
        />
      ) : null}

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <View
          style={[
            styles.blob,
            styles.blobTop,
            {
              backgroundColor: theme.colors.accent.burgundy,
              opacity: isDark ? 0.1 : 0.05,
            },
          ]}
        />
        <View
          style={[
            styles.blob,
            styles.blobBottom,
            {
              backgroundColor: theme.colors.accent.gilt,
              opacity: isDark ? 0.08 : 0.05,
            },
          ]}
        />
      </View>

      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  content: {
    flex: 1,
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  blobTop: {
    width: 320,
    height: 320,
    top: -110,
    right: -100,
  },
  blobBottom: {
    width: 260,
    height: 260,
    bottom: -70,
    left: -60,
  },
});

export default React.memo(AppShell);
