import { Book, Note, Session, Tag } from './types';

let counter = 0;
export function makeId(prefix: string): string {
  counter += 1;
  return prefix + '_' + Date.now().toString(36) + '_' + counter;
}

export function createNote(
  bookId: string,
  page: number,
  tag: Tag,
  text: string,
): Note {
  return {
    id: makeId('n'),
    bookId,
    page,
    tag,
    text: text.trim(),
    createdAt: Date.now(),
  };
}

export function createSession(
  bookId: string,
  startPage: number,
  endPage: number,
  minutes: number,
): Session {
  return {
    id: makeId('s'),
    bookId,
    startPage,
    endPage,
    minutes,
    at: Date.now(),
  };
}

export function validateSession(
  startPage: number,
  endPage: number,
  minutes: number,
  totalPages: number,
): string | null {
  if (!Number.isFinite(startPage) || startPage < 0) {
    return 'Start page must be a number.';
  }
  if (!Number.isFinite(endPage) || endPage <= startPage) {
    return 'End page must be greater than the start page.';
  }
  if (endPage > totalPages) {
    return 'This book only has ' + totalPages + ' pages.';
  }
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return 'Add how many minutes you read.';
  }
  return null;
}

export function applySession(book: Book, session: Session): Book {
  const nextPage = Math.max(book.currentPage, session.endPage);
  const reachedEnd = nextPage >= book.totalPages;
  return {
    ...book,
    currentPage: Math.min(nextPage, book.totalPages),
    finishedAt: reachedEnd ? book.finishedAt || Date.now() : book.finishedAt,
  };
}

export function finishBook(book: Book, verdict: string): Book {
  return {
    ...book,
    currentPage: book.totalPages,
    finishedAt: book.finishedAt || Date.now(),
    verdict: verdict.trim(),
  };
}

export function notesForBook(notes: Note[], bookId: string): Note[] {
  return notes.filter(n => n.bookId === bookId);
}

export function tagCount(notes: Note[]): number {
  const seen: Record<string, boolean> = {};
  let n = 0;
  for (let i = 0; i < notes.length; i++) {
    if (!seen[notes[i].tag]) {
      seen[notes[i].tag] = true;
      n += 1;
    }
  }
  return n;
}

export function searchNotes(
  notes: Note[],
  books: Book[],
  query: string,
  tag: Tag | 'all',
): Note[] {
  const q = query.trim().toLowerCase();
  const byId: Record<string, Book> = {};
  for (let i = 0; i < books.length; i++) {
    byId[books[i].id] = books[i];
  }
  return notes.filter(n => {
    if (tag !== 'all' && n.tag !== tag) {
      return false;
    }
    if (q.length === 0) {
      return true;
    }
    const b = byId[n.bookId];
    const hay = (
      n.text + ' ' + (b ? b.title + ' ' + b.author : '')
    ).toLowerCase();
    return hay.indexOf(q) !== -1;
  });
}
