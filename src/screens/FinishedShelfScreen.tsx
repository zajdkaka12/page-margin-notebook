import React, { useCallback, useMemo } from 'react';
import {
  Animated,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Library } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import StatRow, { StatItem } from '../components/StatRow';
import EmptyState from '../components/EmptyState';
import theme from '../constants/theme';
import {
  SHELF_CARD_W,
  SHELF_GAP,
  SHELF_GRID_W,
  SHELF_PAD,
} from '../constants/config';
import { SEED_YEAR } from '../constants/seed';
import { Book } from '../game/types';
import { useStagger } from '../hooks/useStagger';
import { formatDate, groupNumber } from '../utils/format';

type Props = {
  books: Book[];
  noteCount: number;
  onBack: () => void;
};

function ShelfCard({ book, index }: { book: Book; index: number }) {
  const entry = useStagger(index);
  return (
    <Animated.View pointerEvents="box-none" style={[styles.cardSlot, entry]}>
      <View style={[styles.card, theme.shadows.card]}>
        <View style={styles.spine} />
        <View style={styles.cardBody}>
          <Text numberOfLines={2} style={styles.cardTitle}>
            {book.title}
          </Text>
          <Text numberOfLines={1} style={styles.cardAuthor}>
            {book.author}
          </Text>
          <Text numberOfLines={1} style={styles.cardDate}>
            {'FINISHED ' + formatDate(book.finishedAt || Date.now())}
          </Text>
          <Text numberOfLines={3} style={styles.cardVerdict}>
            {book.verdict || 'No verdict written yet.'}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
}

function FinishedShelfScreen({ books, noteCount, onBack }: Props) {
  const renderCard = useCallback(
    ({ item, index }: { item: Book; index: number }) => (
      <ShelfCard book={item} index={index} />
    ),
    [],
  );

  const keyExtractor = useCallback((item: Book) => item.id, []);

  const stats = useMemo<StatItem[]>(
    () => [
      {
        key: 'books',
        value: String(SEED_YEAR.books + books.length),
        label: 'books',
        valueColor: theme.colors.accent.burgundy,
      },
      {
        key: 'pages',
        value: groupNumber(SEED_YEAR.pages),
        label: 'pages',
        valueColor: theme.colors.accent.gilt,
      },
      {
        key: 'notes',
        value: String(SEED_YEAR.notes + noteCount),
        label: 'notes',
        valueColor: theme.colors.accent.sage,
      },
    ],
    [books.length, noteCount],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        Icon={Library}
        title="The shelf is still empty"
        hint="Finish a book and it moves here with the one line you remember it by."
      />
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="paper">
        <ScreenHeader
          title="FINISHED SHELF"
          subtitle={books.length + ' read'}
          onBack={onBack}
          rightSlot={
            <View style={styles.mark}>
              <Library
                size={24}
                color={theme.colors.accent.gilt}
                strokeWidth={1.8}
              />
            </View>
          }
        />

        <View style={styles.listArea}>
          <FlatList
            data={books}
            renderItem={renderCard}
            keyExtractor={keyExtractor}
            numColumns={2}
            ListEmptyComponent={empty}
            columnWrapperStyle={books.length > 0 ? styles.column : undefined}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            removeClippedSubviews={false}
            style={styles.list}
            contentContainerStyle={styles.listContent}
          />
        </View>

        <View style={styles.yearBlock}>
          <Text style={styles.yearLabel}>YEAR SUMMARY</Text>
          <StatRow items={stats} />
        </View>
      </AppShell>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
  mark: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listArea: {
    flex: 1,
  },
  list: {
    width: SHELF_GRID_W,
    alignSelf: 'center',
  },
  listContent: {
    paddingHorizontal: SHELF_PAD,
    paddingTop: 14,
    paddingBottom: 16,
  },
  column: {
    gap: SHELF_GAP,
    marginBottom: SHELF_GAP,
  },
  cardSlot: {
    width: SHELF_CARD_W,
  },
  card: {
    width: SHELF_CARD_W,
    minHeight: 150,
    borderRadius: 10,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  spine: {
    width: 4,
    backgroundColor: theme.colors.accent.burgundy,
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 11,
    paddingVertical: 12,
  },
  cardTitle: {
    fontFamily: theme.font.serif,
    fontSize: 15,
    lineHeight: 19,
    fontWeight: '700',
    color: theme.colors.text.primary,
  },
  cardAuthor: {
    marginTop: 2,
    fontSize: 11,
    color: theme.colors.text.muted,
  },
  cardDate: {
    marginTop: 8,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: theme.colors.accent.gilt,
  },
  cardVerdict: {
    marginTop: 7,
    fontFamily: theme.font.serif,
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 17,
    color: theme.colors.text.secondary,
  },
  yearBlock: {
    paddingHorizontal: 16,
    paddingBottom: 26,
    paddingTop: 6,
  },
  yearLabel: {
    marginBottom: 8,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2.4,
    color: theme.colors.text.muted,
  },
});

export default FinishedShelfScreen;
