import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { RESURFACE_FADE_MS } from '../constants/config';
import { Note } from '../game/types';
import { ageLabel } from '../utils/format';
import TagChip, { tagColor } from './TagChip';

type Props = {
  note: Note | null;
  bookLabel: string;
};

/**
 * The Desk's signature element: one forgotten note, lifted off the paper over
 * 500ms (opacity + rise; the shadow deepens with the same progress).
 */
function ResurfacedCard({ note, bookLabel }: Props) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    const a = Animated.timing(progress, {
      toValue: 1,
      duration: RESURFACE_FADE_MS,
      delay: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [progress, note]);

  const translateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 0],
  });

  if (!note) {
    return (
      <Animated.View
        pointerEvents="box-none"
        style={[
          styles.card,
          styles.cardQuiet,
          { opacity: progress, transform: [{ translateY }] },
        ]}>
        <View style={[styles.rule, { backgroundColor: 'rgba(107,45,62,0.35)' }]} />
        <Text style={styles.label}>FROM YOUR MARGINS</Text>
        <Text style={styles.quiet}>
          Keep writing. Notes older than two weeks come back to you here.
        </Text>
      </Animated.View>
    );
  }

  const color = tagColor(note.tag);

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.card,
        theme.shadows.lifted,
        { opacity: progress, transform: [{ translateY }] },
      ]}>
      <View style={[styles.rule, { backgroundColor: color + '8C' }]} />

      <Text numberOfLines={1} style={styles.label}>
        {'FROM YOUR MARGINS  ·  ' + ageLabel(note.createdAt)}
      </Text>

      <Text numberOfLines={3} style={styles.body}>
        {note.text}
      </Text>

      <View style={styles.footer}>
        <Text numberOfLines={1} style={styles.source}>
          {bookLabel + '  ·  p. ' + note.page}
        </Text>
        <TagChip tag={note.tag} index={0} />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.ui.giltBorder,
    paddingVertical: 12,
    paddingLeft: 18,
    paddingRight: 14,
  },
  cardQuiet: {
    paddingVertical: 18,
  },
  rule: {
    position: 'absolute',
    left: 8,
    top: 10,
    bottom: 10,
    width: 2,
    borderRadius: 1,
  },
  label: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.6,
    color: theme.colors.accent.gilt,
  },
  body: {
    marginTop: 7,
    fontFamily: theme.font.serif,
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 22,
    color: theme.colors.text.primary,
  },
  quiet: {
    marginTop: 7,
    fontFamily: theme.font.serif,
    fontSize: 14,
    lineHeight: 21,
    color: theme.colors.text.secondary,
  },
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  source: {
    flex: 1,
    fontFamily: theme.font.serif,
    fontSize: 11,
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
  },
});

export default React.memo(ResurfacedCard);
