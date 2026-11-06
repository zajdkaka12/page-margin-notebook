import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Search, Tag as TagIcon } from 'lucide-react-native';
import AppShell from '../components/AppShell';
import ScreenHeader from '../components/ScreenHeader';
import MarginRule from '../components/MarginRule';
import MarginNoteCard from '../components/MarginNoteCard';
import TagChip from '../components/TagChip';
import EmptyState from '../components/EmptyState';
import SecondaryButton from '../components/SecondaryButton';
import theme from '../constants/theme';
import { Book, Note, Tag, TAGS } from '../game/types';
import { searchNotes } from '../game/notebook';

type Props = {
  notes: Note[];
  books: Book[];
  onBack: () => void;
  onDeleteNote: (id: string) => void;
  onEditNote: (id: string) => void;
};

type Mode = 'tag' | 'author';

function TagBrowserScreen({ notes, books, onBack, onDeleteNote, onEditNote }: Props) {
  const [query, setQuery] = useState<string>('');
  const [tag, setTag] = useState<Tag | 'all'>('all');
  const [mode, setMode] = useState<Mode>('tag');

  const bookById = useMemo(() => {
    const map: Record<string, Book> = {};
    for (let i = 0; i < books.length; i++) {
      map[books[i].id] = books[i];
    }
    return map;
  }, [books]);

  const results = useMemo(() => {
    const found = searchNotes(notes, books, query, tag);
    if (mode === 'author') {
      return found.slice().sort((a, b) => {
        const aa = bookById[a.bookId];
        const bb = bookById[b.bookId];
        const an = aa ? aa.author : '';
        const bn = bb ? bb.author : '';
        if (an === bn) {
          return b.createdAt - a.createdAt;
        }
        return an < bn ? -1 : 1;
      });
    }
    return found;
  }, [notes, books, query, tag, mode, bookById]);

  const renderNote = useCallback(
    ({ item, index }: { item: Note; index: number }) => {
      const b = bookById[item.bookId];
      return (
        <MarginNoteCard
          note={item}
          index={Math.min(index, 6)}
          bookLabel={b ? b.title : undefined}
          onEdit={onEditNote}
          onDelete={onDeleteNote}
        />
      );
    },
    [bookById, onEditNote, onDeleteNote],
  );

  const keyExtractor = useCallback((item: Note) => item.id, []);

  const toggleMode = useCallback(() => {
    setMode(m => (m === 'tag' ? 'author' : 'tag'));
  }, []);

  const handleTag = useCallback((next: Tag | 'all') => {
    setTag(next);
  }, []);

  const countFor = useCallback(
    (t: Tag | 'all') =>
      t === 'all'
        ? String(notes.length)
        : String(notes.filter(n => n.tag === t).length),
    [notes],
  );

  const empty = useMemo(
    () => (
      <EmptyState
        Icon={Search}
        title="Nothing matches yet"
        hint="Try another word, or clear the tag filter to see every margin note."
      />
    ),
    [],
  );

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      <AppShell variant="page">
        <MarginRule top={190} bottom={0} left={10} />

        <ScreenHeader
          title="ACROSS ALL BOOKS"
          subtitle={results.length + ' notes'}
          onBack={onBack}
          rightSlot={
            <View style={styles.mark}>
              <TagIcon
                size={24}
                color={theme.colors.accent.gilt}
                strokeWidth={1.8}
              />
            </View>
          }
        />

        <View style={styles.searchRow}>
          <Search size={20} color={theme.colors.text.muted} strokeWidth={2} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search your margins"
            placeholderTextColor={theme.colors.text.placeholder}
            accessibilityLabel="Search notes"
            style={styles.searchInput}
          />
        </View>

        <View style={styles.filterRow}>
          <View style={styles.chips}>
            <TagChip
              tag="all"
              label="all"
              index={0}
              selected={tag === 'all'}
              onPress={handleTag}
              countLabel={countFor('all')}
            />
            {TAGS.map((t, i) => (
              <TagChip
                key={t}
                tag={t}
                index={i + 1}
                selected={tag === t}
                onPress={handleTag}
                countLabel={countFor(t)}
              />
            ))}
          </View>
        </View>

        <View style={styles.modeRow}>
          <SecondaryButton
            label={mode === 'tag' ? 'BY TAG' : 'BY AUTHOR'}
            onPress={toggleMode}
            height={46}
            tone="gilt"
          />
        </View>

        <View style={styles.listArea}>
          <FlatList
            data={results}
            renderItem={renderNote}
            keyExtractor={keyExtractor}
            ListEmptyComponent={empty}
            showsVerticalScrollIndicator={false}
            initialNumToRender={6}
            windowSize={7}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.listContent}
          />
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
  searchRow: {
    marginTop: 14,
    marginHorizontal: 16,
    height: 48,
    borderRadius: 10,
    backgroundColor: theme.colors.surface.card,
    borderWidth: 1,
    borderColor: theme.colors.ui.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 14,
    paddingRight: 12,
  },
  searchInput: {
    flex: 1,
    fontFamily: theme.font.serif,
    fontSize: 15,
    color: theme.colors.text.primary,
    padding: 0,
  },
  filterRow: {
    paddingHorizontal: 16,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  listArea: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 28,
  },
});

export default TagBrowserScreen;
