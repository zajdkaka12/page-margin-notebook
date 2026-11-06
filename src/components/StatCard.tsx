import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';

type Props = {
  value: string;
  label: string;
  valueColor: string;
  dark?: boolean;
};

/**
 * The ONE stat pill used on every screen. No raster icon: an 8x8 accent dot
 * carries the colour semantics, so every pill in a row is geometrically
 * identical. Never rendered with an empty value (see StatRow).
 */
function StatCard({ value, label, valueColor, dark = false }: Props) {
  return (
    <View
      style={[
        styles.card,
        dark ? styles.cardDark : styles.cardLight,
        { borderColor: valueColor + (dark ? '73' : '44') },
      ]}>
      <View style={[styles.accentDot, { backgroundColor: valueColor }]} />
      <Text numberOfLines={1} style={[styles.value, { color: valueColor }]}>
        {value}
      </Text>
      <Text numberOfLines={1} style={[styles.label, dark ? styles.labelDark : null]}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    // width:100% (never flex:1 inside a flex:1 slot) so the card keeps its
    // intrinsic content height instead of collapsing.
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLight: {
    backgroundColor: theme.colors.surface.card,
  },
  cardDark: {
    backgroundColor: theme.colors.surface.darkCard,
  },
  accentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 7,
  },
  value: {
    fontFamily: theme.font.serif,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  label: {
    marginTop: 3,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: theme.colors.text.muted,
  },
  labelDark: {
    color: theme.colors.text.onDarkMuted,
  },
});

export default React.memo(StatCard);
