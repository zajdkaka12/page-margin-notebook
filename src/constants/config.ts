import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

export const SCREEN_WIDTH = SCREEN_W;
export const SCREEN_HEIGHT = SCREEN_H;

/* ---------------------------------------------------------------- timings */
/** Splash duration. MUST stay 8000 — shorter races the UI-test screenshot. */
export const LOADER_DURATION_MS = 8000;
export const LOADER_FADE_MS = 320;
export const LOADER_BAR_MS = 7400;
export const PAGE_TURN_MS = 320;
export const RESURFACE_FADE_MS = 500;
export const STAGGER_MS = 70;
export const UNDERLINE_MS = 300;
export const FADE_MS = 240;
export const RAIL_MS = 450;

export const PRESS_SPRING = { tension: 300, friction: 12 };
export const POP_SPRING = { tension: 220, friction: 11 };
export const PLATE_SPRING = { tension: 42, friction: 8 };
export const HERO_SPRING = { tension: 50, friction: 7 };
export const SNAPBACK_SPRING = { tension: 180, friction: 14 };

/* ------------------------------------------------------------ swipe model */
export const SWIPE_THRESHOLD = 96;
export const SWIPE_RESISTANCE = 0.55;
export const SWIPE_FREE = 64;
export const SWIPE_HAPTIC_MS = 10;

/* --------------------------------------------------------------- geometry */
export const CONTENT_MAX_W = Math.min(SCREEN_W - 32, 380);

export const SHELF_PAD = 12;
export const SHELF_BORDER = 1;
export const SHELF_FRAME = SHELF_PAD + SHELF_BORDER; // 13
export const SHELF_COLS = 2;
export const SHELF_GAP = 10;
export const SHELF_CARD_W = Math.floor(
  (CONTENT_MAX_W - 2 * SHELF_FRAME - SHELF_GAP) / SHELF_COLS,
);
export const SHELF_GRID_W = SHELF_CARD_W * SHELF_COLS + SHELF_GAP + 2 * SHELF_FRAME;

export const HEADER_H = 72;
export const HEADER_PAD_TOP = 44;
export const FLOATING_BAR_H = 64;
export const FLOATING_BAR_BOTTOM = 24;
export const LIST_BOTTOM_PAD = FLOATING_BAR_H + FLOATING_BAR_BOTTOM + 20; // 108

export const MARGIN_RULE_LEFT = 26;
export const BOOK_SPINE_W = 132;
export const BOOK_SPINE_H = 96;

/* ------------------------------------------------------------- behaviour */
export const RESURFACE_MIN_AGE_DAYS = 14;
export const MINUTE_PRESETS = [15, 30, 45, 60, 90];
export const MAX_NOTE_LEN = 400;

/** Small-screen guard (360x640 emulators) — tightens type and spacing. */
export const COMPACT = SCREEN_H < 720;
