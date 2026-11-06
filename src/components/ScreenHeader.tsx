import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ChevronLeft } from 'lucide-react-native';
import theme from '../constants/theme';
import { HEADER_PAD_TOP } from '../constants/config';

type Props = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  dark?: boolean;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The ONE header used by every screen (Menu, Book Page, composer, Summary,
 * Tags, Shelf). Variation happens through leftSlot / title / rightSlot only,
 * so the styling cannot drift between screens.
 */
function ScreenHeader({
  title,
  subtitle,
  onBack,
  leftSlot,
  rightSlot,
  dark = false,
}: Props) {
  const titleColor = dark ? theme.colors.text.onDark : theme.colors.text.primary;
  const subColor = dark ? theme.colors.text.onDarkMuted : theme.colors.text.muted;

  return (
    <View
      style={[
        styles.root,
        dark
          ? { backgroundColor: 'rgba(250,245,233,0.05)', borderBottomColor: 'rgba(184,134,47,0.28)' }
          : null,
      ]}>
      <View style={styles.side}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            hitSlop={HIT}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            style={({ pressed }) => [
              styles.backBtn,
              dark ? styles.backBtnDark : null,
              pressed ? styles.backBtnPressed : null,
            ]}>
            <ChevronLeft
              size={22}
              color={dark ? theme.colors.text.onDark : theme.colors.accent.burgundy}
              strokeWidth={2}
            />
          </Pressable>
        ) : (
          leftSlot
        )}
      </View>

      <View style={styles.center}>
        <Text numberOfLines={1} style={[styles.title, { color: titleColor }]}>
          {title}
        </Text>
        {subtitle ? (
          <Text numberOfLines={1} style={[styles.subtitle, { color: subColor }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View style={[styles.side, styles.sideRight]}>{rightSlot}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    minHeight: 72 + HEADER_PAD_TOP,
    paddingTop: HEADER_PAD_TOP,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(42,28,26,0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107,45,62,0.14)',
  },
  side: {
    minWidth: 48,
    justifyContent: 'center',
  },
  sideRight: {
    alignItems: 'flex-end',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  title: {
    fontFamily: theme.font.serif,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.2,
  },
  subtitle: {
    fontSize: 11,
    letterSpacing: 0.6,
    marginTop: 2,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(107,45,62,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(107,45,62,0.16)',
  },
  backBtnDark: {
    backgroundColor: 'rgba(250,245,233,0.09)',
    borderColor: 'rgba(184,134,47,0.35)',
  },
  backBtnPressed: {
    opacity: 0.72,
  },
});

export default React.memo(ScreenHeader);
