import { Book, Note, Session } from '../game/types';
import { daysAgo } from '../utils/format';

export const SEED_BOOKS: Book[] = [
  {
    id: 'b1',
    title: 'Dune',
    author: 'Frank Herbert',
    totalPages: 620,
    currentPage: 214,
    startedAt: daysAgo(48),
  },
  {
    id: 'b2',
    title: 'The Glass Bead Game',
    author: 'Hermann Hesse',
    totalPages: 558,
    currentPage: 96,
    startedAt: daysAgo(21),
  },
  {
    id: 'b3',
    title: 'A Pattern Language',
    author: 'Christopher Alexander',
    totalPages: 1171,
    currentPage: 340,
    startedAt: daysAgo(130),
  },
  {
    id: 'b4',
    title: 'The Left Hand of Darkness',
    author: 'Ursula K. Le Guin',
    totalPages: 304,
    currentPage: 304,
    startedAt: daysAgo(410),
    finishedAt: daysAgo(276),
    verdict: 'A thaw told in two voices. The ice crossing is the whole argument.',
  },
  {
    id: 'b5',
    title: 'Invisible Cities',
    author: 'Italo Calvino',
    totalPages: 165,
    currentPage: 165,
    startedAt: daysAgo(520),
    finishedAt: daysAgo(488),
    verdict: 'Every city is a list of the things it refuses to say out loud.',
  },
];

export const SEED_NOTES: Note[] = [
  { id: 'n1', bookId: 'b1', page: 214, tag: 'disagreement', text: 'Herbert wants ecology to be destiny, but Paul keeps choosing. The desert does not actually force the jihad — the prophecy does.', createdAt: daysAgo(3) },
  { id: 'n2', bookId: 'b1', page: 201, tag: 'idea', text: 'Water discipline as a whole moral system. Debt measured in moisture you owe the tribe.', createdAt: daysAgo(6) },
  { id: 'n3', bookId: 'b1', page: 188, tag: 'question', text: 'Does the Bene Gesserit breeding programme ever admit it failed? Or is failure folded into the plan too?', createdAt: daysAgo(11) },
  { id: 'n4', bookId: 'b1', page: 160, tag: 'idea', text: 'Prescience as a trap: seeing the future narrows it. The gift is a cage with a view.', createdAt: daysAgo(19) },
  { id: 'n5', bookId: 'b1', page: 142, tag: 'question', text: 'Why does nobody simply leave Arrakis? The spice answers it, but the book never says it plainly.', createdAt: daysAgo(26) },
  { id: 'n6', bookId: 'b1', page: 97, tag: 'idea', text: 'The litany against fear is a breathing exercise dressed as scripture. That is why it works.', createdAt: daysAgo(34) },
  { id: 'n7', bookId: 'b1', page: 58, tag: 'disagreement', text: 'The Harkonnens are too neatly monstrous. Evil with no interior is just scenery.', createdAt: daysAgo(41) },

  { id: 'n8', bookId: 'b2', page: 96, tag: 'idea', text: 'The Game is a language for saying that two unrelated things rhyme. We do this all day and call it taste.', createdAt: daysAgo(4) },
  { id: 'n9', bookId: 'b2', page: 74, tag: 'question', text: 'Is Castalia a monastery or a quarantine? Hesse will not say, and that is the point.', createdAt: daysAgo(9) },
  { id: 'n10', bookId: 'b2', page: 52, tag: 'disagreement', text: 'A culture that only curates never composes. Knecht senses this three hundred pages before he admits it.', createdAt: daysAgo(17) },
  { id: 'n11', bookId: 'b2', page: 31, tag: 'idea', text: 'Serving an order is easier than serving a person. The novel keeps testing which one costs more.', createdAt: daysAgo(23) },

  { id: 'n12', bookId: 'b3', page: 340, tag: 'idea', text: 'Pattern 106: positive outdoor space. A courtyard works because the void has a shape, not because the walls do.', createdAt: daysAgo(8) },
  { id: 'n13', bookId: 'b3', page: 298, tag: 'question', text: 'How many of these 253 patterns survive a lift shaft and a fire code?', createdAt: daysAgo(15) },
  { id: 'n14', bookId: 'b3', page: 244, tag: 'idea', text: 'Light on two sides of every room. The cheapest rule in the book and the one most often broken.', createdAt: daysAgo(29) },
  { id: 'n15', bookId: 'b3', page: 180, tag: 'disagreement', text: 'The language claims to be timeless, then quietly assumes a town of 7000 and a car. Not timeless. Dated kindly.', createdAt: daysAgo(44) },
  { id: 'n16', bookId: 'b3', page: 121, tag: 'idea', text: 'Alcoves. Every good room needs somewhere to be half-absent from the room.', createdAt: daysAgo(61) },

  { id: 'n17', bookId: 'b4', page: 221, tag: 'idea', text: 'The ice crossing is the only place the two of them share one grammar. Everything before is translation.', createdAt: daysAgo(290) },
  { id: 'n18', bookId: 'b5', page: 44, tag: 'question', text: 'If every city is Venice, is the frame a confession or a joke?', createdAt: daysAgo(500) },
];

export const SEED_SESSIONS: Session[] = [
  { id: 's1', bookId: 'b1', startPage: 182, endPage: 214, minutes: 45, at: daysAgo(2) },
  { id: 's2', bookId: 'b1', startPage: 150, endPage: 182, minutes: 30, at: daysAgo(5) },
  { id: 's3', bookId: 'b2', startPage: 68, endPage: 96, minutes: 30, at: daysAgo(4) },
  { id: 's4', bookId: 'b3', startPage: 312, endPage: 340, minutes: 60, at: daysAgo(8) },
  { id: 's5', bookId: 'b1', startPage: 112, endPage: 150, minutes: 60, at: daysAgo(12) },
  { id: 's6', bookId: 'b2', startPage: 40, endPage: 68, minutes: 45, at: daysAgo(16) },
  { id: 's7', bookId: 'b3', startPage: 270, endPage: 312, minutes: 90, at: daysAgo(22) },
];

export const SEED_YEAR = {
  books: 11,
  pages: 3420,
  notes: 196,
};
