import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  Easing,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Bookmark, PenLine, Timer } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import MarginRule from '../components/MarginRule';
import MarginNoteCard from '../components/MarginNoteCard';
import ProgressRail from '../components/ProgressRail';
import StatRow, { StatItem } from '../components/StatRow';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import EmptyState from '../components/EmptyState';
import theme from '../constants/theme';
import {
  FLOATING_BAR_BOTTOM,
  FLOATING_BAR_H,
  LIST_BOTTOM_PAD,
  PAGE_TURN_MS,
  SCREEN_WIDTH,
} from '../constants/config';
import { Book, Note } from '../game/types';
import { tagCount } from '../game/notebook';
import { percent } from '../utils/format';

type Props = {
  book: Book;
  notes: Note[];
  sessionCount: number;
  onBack: () => void;
  onNewNote: () => void;
  onSession: () => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string) => void;
};

function GameScreen({
  book,
  notes,
  sessionCount,
  onBack,
  onNewNote,
  onSession,
  onDeleteNote,
  onEditNote,
}: Props) {
  const slide = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const a = Animated.timing(slide, {
      toValue: 0,
      duration: PAGE_TURN_MS,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    });
    a.start();
    return () => a.stop();
  }, [slide]);

  const translateX = slide.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SCREEN_WIDTH],
  });

  const read = percent(book.currentPage, book.totalPages);
  const left = Math.max(0, book.totalPages - book.currentPage);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        key: 'notes',
        value: String(notes.length),
        label: 'notes',
        valueColor: theme.colors.accent.burgundy,
      },
      {
        key: 'sessions',
        value: String(sessionCount),
        label: 'sessions',
        valueColor: theme.colors.accent.gilt,
      },
      {
        key: 'tags',
        value: String(tagCount(notes)),
        label: 'tags',
        valueColor: theme.colors.accent.sage,
      },
    ],
    [notes, sessionCount],
  );

  const renderNote = useCallback(
    ({ item, index }: { item: Note; index: number }) => (
      <MarginNoteCard
        note={item}
        index={Math.min(index, 6)}
        onEdit={onEditNote}
        onDelete={onDeleteNote}
      />
    ),
    [onEditNote, onDeleteNote],
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  const pageBadge = useMemo(
    () => (
      <View style={styles.pageBadge}>
        <View style={styles.badgeMark}>
          <Bookmark
            size={16}
            color={theme.colors.accent.gilt}
            strokeWidth={2}
          />
        </View>
        <Text style={styles.pageBadgeText}>{'p. ' + book.currentPage}</Text>
      </View>
    ),
    [book.currentPage],
  );

  const emptyList = useMemo(
    () => (
      <EmptyState
        Icon={PenLine}
        title="No margin notes yet"
        hint="Tap NEW NOTE to write the first thing this book made you think."
      />
    ),
    [],
  );

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.root, { transform: [{ translateX }] }]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="page">
        <ScreenHeader
          title={book.title}
          subtitle={book.author}
          onBack={onBack}
          rightSlot={pageBadge}
        />

        <View style={styles.progressStrip}>
          <View style={styles.progressRow}>
            <Text style={styles.progressRead}>{read + '% READ'}</Text>
            <Text style={styles.progressLeft}>{left + ' PAGES LEFT'}</Text>
          </View>
          <ProgressRail value={book.currentPage} total={book.totalPages} height={6} />
        </View>

        <StatRow items={stats} style={styles.stats} />

        <View style={styles.listArea}>
          <MarginRule top={6} bottom={0} left={10} />
          <FlatList
            data={notes}
            renderItem={renderNote}
            keyExtractor={keyExtractor}
            ListEmptyComponent={emptyList}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            removeClippedSubviews={false}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={styles.floatingBar} pointerEvents="box-none">
          <View style={styles.floatingInner}>
            <View style={styles.primarySlot}>
              <PrimaryButton
                label="NEW NOTE"
                onPress={onNewNote}
                Icon={PenLine}
                height={48}
              />
            </View>
            <View style={styles.secondarySlot}>
              <SecondaryButton
                label="SESSION"
                onPress={onSession}
                Icon={Timer}
                height={48}
                tone="gilt"
              />
            </View>
          </View>
        </View>
      </AppShell>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  progressStrip: {
    height: 58,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 7,
  },
  progressRead: {
    fontFamily: theme.font.serif,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: theme.colors.text.secondary,
  },
  progressLeft: {
    fontSize: 11,
    letterSpacing: 0.6,
    color: theme.colors.text.muted,
  },
  stats: {
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: LIST_BOTTOM_PAD,
  },
  floatingBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: FLOATING_BAR_BOTTOM,
    height: FLOATING_BAR_H,
    borderRadius: 14,
    backgroundColor: 'rgba(255,253,247,0.96)',
    borderWidth: 1,
    borderColor: 'rgba(184,134,47,0.35)',
    justifyContent: 'center',
    shadowColor: '#2A1C1A',
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 9,
  },
  floatingInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 10,
  },
  primarySlot: {
    flex: 1.4,
  },
  secondarySlot: {
    flex: 1,
    flexDirection: 'row',
  },
  pageBadge: {
    height: 32,
    paddingHorizontal: 10,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(184,134,47,0.14)',
  },
  badgeMark: {
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageBadgeText: {
    fontFamily: theme.font.serif,
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.accent.burgundy,
  },
});

export default GameScreen;
