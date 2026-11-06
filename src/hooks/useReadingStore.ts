import { useCallback, useMemo, useState } from 'react';
import { Book, Note, Session, SessionResult, Tag } from '../game/types';
import { SEED_BOOKS, SEED_NOTES, SEED_SESSIONS } from '../constants/seed';
import {
  applySession,
  createNote,
  createSession,
  finishBook,
} from '../game/notebook';

/**
 * Single in-memory store for the whole notebook. Screens pull the individual
 * slices they need rather than the whole object graph.
 */
export function useReadingStore() {
  const [books, setBooks] = useState<Book[]>(SEED_BOOKS);
  const [notes, setNotes] = useState<Note[]>(SEED_NOTES);
  const [sessions, setSessions] = useState<Session[]>(SEED_SESSIONS);
  const [activeBookId, setActiveBookId] = useState<string>(SEED_BOOKS[0].id);
  const [lastResult, setLastResult] = useState<SessionResult | null>(null);

  const activeBook = useMemo(() => {
    const found = books.find(b => b.id === activeBookId);
    return found || books[0];
  }, [books, activeBookId]);

  const currentBooks = useMemo(
    () => books.filter(b => !b.finishedAt),
    [books],
  );

  const finishedBooks = useMemo(
    () =>
      books
        .filter(b => !!b.finishedAt)
        .sort((a, b) => (b.finishedAt || 0) - (a.finishedAt || 0)),
    [books],
  );

  const sortedNotes = useMemo(
    () => notes.slice().sort((a, b) => b.createdAt - a.createdAt),
    [notes],
  );

  const activeNotes = useMemo(
    () => sortedNotes.filter(n => n.bookId === activeBook.id),
    [sortedNotes, activeBook.id],
  );

  const openBook = useCallback((id: string) => {
    setActiveBookId(id);
  }, []);

  const addNote = useCallback(
    (page: number, tag: Tag, text: string) => {
      setNotes(prev => [createNote(activeBookId, page, tag, text), ...prev]);
    },
    [activeBookId],
  );

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  }, []);

  const bumpNotePage = useCallback((id: string, delta: number) => {
    setNotes(prev =>
      prev.map(n =>
        n.id === id ? { ...n, page: Math.max(1, n.page + delta) } : n,
      ),
    );
  }, []);

  const logSession = useCallback(
    (startPage: number, endPage: number, minutes: number): SessionResult => {
      const book = books.find(b => b.id === activeBookId) || books[0];
      const session = createSession(book.id, startPage, endPage, minutes);
      const updated = applySession(book, session);
      setSessions(prev => [session, ...prev]);
      setBooks(prev => prev.map(b => (b.id === book.id ? updated : b)));
      const sinceStart = notes.filter(
        n => n.bookId === book.id && n.page >= startPage && n.page <= endPage,
      ).length;
      const result: SessionResult = {
        pages: endPage - startPage,
        minutes,
        notesAdded: sinceStart,
        bookId: book.id,
        finished: updated.currentPage >= updated.totalPages,
      };
      setLastResult(result);
      return result;
    },
    [books, activeBookId, notes],
  );

  const saveVerdict = useCallback(
    (verdict: string) => {
      setBooks(prev =>
        prev.map(b => (b.id === activeBookId ? finishBook(b, verdict) : b)),
      );
    },
    [activeBookId],
  );

  return {
    books,
    notes: sortedNotes,
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
  };
}

export type ReadingStore = ReturnType<typeof useReadingStore>;
