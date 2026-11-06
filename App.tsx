/**
 * Page Margin Notebook — state machine only. No navigation library:
 * a single Screen union with conditional rendering.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';

import LoaderScreen from './src/screens/LoaderScreen';
import MenuScreen from './src/screens/MenuScreen';
import GameScreen from './src/screens/GameScreen';
import NewMarginNoteScreen from './src/screens/NewMarginNoteScreen';
import SessionEntryScreen from './src/screens/SessionEntryScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import TagBrowserScreen from './src/screens/TagBrowserScreen';
import FinishedShelfScreen from './src/screens/FinishedShelfScreen';

import { useReadingStore } from './src/hooks/useReadingStore';
import { pickResurfaced } from './src/game/resurface';
import theme from './src/constants/theme';
import { Tag } from './src/game/types';

type Screen =
  | 'loader'
  | 'menu'
  | 'game'
  | 'note'
  | 'session'
  | 'gameover'
  | 'tags'
  | 'shelf';

function App(): React.JSX.Element {
  const [screen, setScreen] = useState<Screen>('loader');
  const store = useReadingStore();

  const {
    books,
    notes,
    sessions,
    activeBook,
    activeNotes,
    currentBooks,
    finishedBooks,
    lastResult,
    openBook,
    addNote,
    deleteNote,
    bumpNotePage,
    logSession,
    saveVerdict,
  } = store;

  const resurfaced = useMemo(() => pickResurfaced(notes), [notes]);

  const resurfacedBookLabel = useMemo(() => {
    if (!resurfaced) {
      return '';
    }
    const b = books.find(x => x.id === resurfaced.bookId);
    return b ? b.title : 'Your shelf';
  }, [resurfaced, books]);

  const sessionCount = useMemo(
    () => sessions.filter(s => s.bookId === activeBook.id).length,
    [sessions, activeBook.id],
  );

  /* ------------------------------------------------------------ routing */
  const goMenu = useCallback(() => setScreen('menu'), []);
  const goGame = useCallback(() => setScreen('game'), []);
  const goNote = useCallback(() => setScreen('note'), []);
  const goSession = useCallback(() => setScreen('session'), []);
  const goTags = useCallback(() => setScreen('tags'), []);
  const goShelf = useCallback(() => setScreen('shelf'), []);
  const onLoaderDone = useCallback(() => setScreen('menu'), []);

  const handleOpenBook = useCallback(
    (id: string) => {
      openBook(id);
      setScreen('game');
    },
    [openBook],
  );

  const handleSaveNote = useCallback(
    (page: number, tag: Tag, text: string) => {
      addNote(page, tag, text);
      setScreen('game');
    },
    [addNote],
  );

  const handleLogSession = useCallback(
    (startPage: number, endPage: number, minutes: number) => {
      logSession(startPage, endPage, minutes);
      setScreen('gameover');
    },
    [logSession],
  );

  const handleEditNote = useCallback(
    (id: string) => {
      bumpNotePage(id, 1);
    },
    [bumpNotePage],
  );

  /* Android hardware back follows the same state machine. */
  React.useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      if (screen === 'loader' || screen === 'menu') {
        return false;
      }
      if (screen === 'game' || screen === 'tags' || screen === 'shelf') {
        setScreen('menu');
        return true;
      }
      if (screen === 'gameover') {
        setScreen('menu');
        return true;
      }
      setScreen('game');
      return true;
    });
    return () => sub.remove();
  }, [screen]);

  /* ------------------------------------------------------------- render */
  return (
    <View style={styles.root}>
      {screen === 'loader' ? <LoaderScreen onDone={onLoaderDone} /> : null}

      {screen === 'menu' ? (
        <MenuScreen
          books={currentBooks}
          resurfaced={resurfaced}
          resurfacedBookLabel={resurfacedBookLabel}
          onStart={goGame}
          onOpenBook={handleOpenBook}
          onTags={goTags}
          onShelf={goShelf}
        />
      ) : null}

      {screen === 'game' ? (
        <GameScreen
          book={activeBook}
          notes={activeNotes}
          sessionCount={sessionCount}
          onBack={goMenu}
          onNewNote={goNote}
          onSession={goSession}
          onDeleteNote={deleteNote}
          onEditNote={handleEditNote}
        />
      ) : null}

      {screen === 'note' ? (
        <NewMarginNoteScreen
          book={activeBook}
          onBack={goGame}
          onSave={handleSaveNote}
        />
      ) : null}

      {screen === 'session' ? (
        <SessionEntryScreen
          book={activeBook}
          onBack={goGame}
          onLog={handleLogSession}
        />
      ) : null}

      {screen === 'gameover' ? (
        <GameOverScreen
          result={lastResult}
          book={activeBook}
          onReadAgain={goGame}
          onMenu={goMenu}
          onSaveVerdict={saveVerdict}
        />
      ) : null}

      {screen === 'tags' ? (
        <TagBrowserScreen
          notes={notes}
          books={books}
          onBack={goMenu}
          onDeleteNote={deleteNote}
          onEditNote={handleEditNote}
        />
      ) : null}

      {screen === 'shelf' ? (
        <FinishedShelfScreen
          books={finishedBooks}
          noteCount={notes.length}
          onBack={goMenu}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bg.primary,
  },
});

export default App;
