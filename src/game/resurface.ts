import { Note } from './types';
import { RESURFACE_MIN_AGE_DAYS } from '../constants/config';

const DAY_MS = 86400000;

/**
 * Stable per-day pick: the same forgotten note all day, a new one at midnight.
 * Returns null when there is nothing old enough to be worth resurfacing.
 */
export function pickResurfaced(notes: Note[], now: number = Date.now()): Note | null {
  const cutoff = now - RESURFACE_MIN_AGE_DAYS * DAY_MS;
  const pool = notes.filter(n => n.createdAt < cutoff);
  if (pool.length < 2) {
    return null;
  }
  const sorted = pool.slice().sort((a, b) => a.createdAt - b.createdAt);
  const dayIndex = Math.floor(now / DAY_MS);
  return sorted[dayIndex % sorted.length];
}
