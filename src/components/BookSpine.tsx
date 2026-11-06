import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { BOOK_SPINE_H, BOOK_SPINE_W } from '../constants/config';
import { Book } from '../game/types';
import { usePressScale } from '../hooks/usePressScale';
import { useStaggerX } from '../hooks/useStagger';
import { percent } from '../utils/format';

type Props = {
  book: Book;
  index: number;
  onPress: (id: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

function BookSpine({ book, index, onPress }: Props) {
  const entry = useStaggerX(index);
  const { scale, onPressIn, onPressOut } = usePressScale(0.95);
  const handlePress = useCallback(() => onPress(book.id), [onPress, book.id]);
  const pct = percent(book.currentPage, book.totalPages);

  return (
    <Animated.View pointerEvents="box-none" style={entry}>
      <Pressable
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        hitSlop={HIT}
        accessibilityRole="button"
        accessibilityLabel={book.title + ', page ' + book.currentPage}
        style={styles.press}>
        <Animated.View
          pointerEvents="box-none"
          style={[styles.card, theme.shadows.card, { transform: [{ scale }] }]}>
          <View style={styles.spine} />
          <View style={styles.body}>
            <Text numberOfLines={2} style={styles.title}>
              {book.title}
            </Text>
            <Text numberOfLines={1} style={styles.pages}>
              {'p. ' + book.currentPage + ' / ' + book.totalPages}
            </Text>
            <View style={styles.rail}>
              <View style={[styles.railFill, { width: (pct + '%') as any }]} />
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  press: {
    width: BOOK_SPINE_W,
    height: BOOK_SPINE_H,
  },
  card: {
    width: BOOK_SPINE_W,
    height: BOOK_SPINE_H,
    borderRadius: 8,
    backgroundColor: theme.colors.bg.secondary,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  spine: {
    width: 4,
    height: '100%',
    backgroundColor: theme.colors.accent.burgundy,
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: theme.font.serif,
    fontSize: 13,
    lineHeight: 17,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  pages: {
    fontSize: 10,
    letterSpacing: 0.4,
    color: theme.colors.text.muted,
  },
  rail: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.surface.rail,
    overflow: 'hidden',
  },
  railFill: {
    height: 3,
    borderRadius: 2,
    backgroundColor: theme.colors.accent.gilt,
  },
});

export default React.memo(BookSpine);
