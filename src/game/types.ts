export type Tag = 'idea' | 'question' | 'disagreement';

export type Book = {
  id: string;
  title: string;
  author: string;
  totalPages: number;
  currentPage: number;
  startedAt: number;
  finishedAt?: number;
  verdict?: string;
};

export type Note = {
  id: string;
  bookId: string;
  page: number;
  tag: Tag;
  text: string;
  createdAt: number;
};

export type Session = {
  id: string;
  bookId: string;
  startPage: number;
  endPage: number;
  minutes: number;
  at: number;
};

export type SessionResult = {
  pages: number;
  minutes: number;
  notesAdded: number;
  bookId: string;
  finished: boolean;
};

export const TAGS: Tag[] = ['idea', 'question', 'disagreement'];
