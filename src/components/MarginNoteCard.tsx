import React, { useCallback } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import theme from '../constants/theme';
import { Note } from '../game/types';
import { useStagger } from '../hooks/useStagger';
import { useSwipeReveal } from '../hooks/useSwipeReveal';
import { formatDate } from '../utils/format';
import TagChip, { tagColor } from './TagChip';

type Props = {
  note: Note;
  index: number;
  bookLabel?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

const HIT = { top: 8, bottom: 8, left: 8, right: 8 };

/**
 * The signature card: an offset left rule in the tag colour, serif body,
 * and PanResponder swipe-to-reveal for EDIT / DELETE.
 */
function MarginNoteCard({ note, index, bookLabel, onEdit, onDelete }: Props) {
  const entry = useStagger(index);
  const { translateX, panHandlers, close } = useSwipeReveal();
  const color = tagColor(note.tag);

  const handleEdit = useCallback(() => {
    close();
    onEdit(note.id);
  }, [close, onEdit, note.id]);

  const handleDelete = useCallback(() => {
    close();
    onDelete(note.id);
  }, [close, onDelete, note.id]);

  return (
    <Animated.View pointerEvents="box-none" style={[styles.outer, entry]}>
      <View style={styles.actions} pointerEvents="box-none">
        <Pressable
          onPress={handleEdit}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Edit note"
          style={[styles.action, { backgroundColor: theme.colors.accent.gilt }]}>
          <Text style={styles.actionText}>EDIT</Text>
        </Pressable>
        <Pressable
          onPress={handleDelete}
          hitSlop={HIT}
          accessibilityRole="button"
          accessibilityLabel="Delete note"
          style={[styles.action, { backgroundColor: theme.colors.accent.terracotta }]}>
          <Text style={styles.actionText}>DEL</Text>
        </Pressable>
      </View>

      <Animated.View
        {...panHandlers}
        pointerEvents="box-none"
        style={[styles.card, theme.shadows.card, { transform: [{ translateX }] }]}>
        <View style={[styles.rule, { backgroundColor: color + '8C' }]} />

        <View style={styles.topRow}>
          <Text style={styles.page}>{'p. ' + note.page}</Text>
          <TagChip tag={note.tag} index={0} />
        </View>

        <Text numberOfLines={4} style={styles.body}>
          {note.text}
        </Text>

        <View style={styles.footer}>
          <Text numberOfLines={1} style={styles.date}>
            {formatDate(note.createdAt)}
          </Text>
          {bookLabel ? (
            <Text numberOfLines={1} style={styles.book}>
              {bookLabel}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: 10,
  },
  actions: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingRight: 2,
  },
  action: {
    width: 44,
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    lineHeight: 14,
    color: '#FFFDF7',
  },
  card: {
    backgroundColor: theme.colors.surface.card,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    paddingVertical: 12,
    paddingLeft: 20,
    paddingRight: 14,
  },
  rule: {
    position: 'absolute',
    left: 9,
    top: 12,
    bottom: 12,
    width: 2,
    borderRadius: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  page: {
    fontFamily: theme.font.serif,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
    color: theme.colors.accent.burgundy,
  },
  body: {
    marginTop: 4,
    fontFamily: theme.font.serif,
    fontSize: 15,
    lineHeight: 23,
    color: theme.colors.text.primary,
  },
  footer: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  date: {
    fontSize: 10,
    letterSpacing: 1,
    color: theme.colors.text.muted,
  },
  book: {
    flex: 1,
    textAlign: 'right',
    fontFamily: theme.font.serif,
    fontSize: 11,
    fontStyle: 'italic',
    color: theme.colors.text.muted,
  },
});

export default React.memo(MarginNoteCard);
