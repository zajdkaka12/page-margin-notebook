/**
 * WARM_EARTHY preset (name kept verbatim from preset.ts) with the brief's
 * burgundy-ink + gilt accents layered on top. One source of truth for colour,
 * type, radius, spacing and the paper-lift shadows.
 */
export const theme = {
  name: 'warm-earthy',

  colors: {
    bg: {
      primary: '#FAF5E9',
      secondary: '#F2EAD8',
      tertiary: '#E9DFC8',
      accent: '#D8C9A8',
      dark: '#2A1C1A',
      darkAlt: '#3A2420',
    },
    surface: {
      card: '#FFFDF7',
      rail: '#E9DFC8',
      sunken: '#F2EAD8',
      darkCard: 'rgba(255,253,247,0.08)',
    },
    accent: {
      burgundy: '#6B2D3E',
      burgundyLight: '#8A3B50',
      gilt: '#B8862F',
      sage: '#7FA46B',
      terracotta: '#A8502F',
    },
    tag: {
      idea: '#B8862F',
      question: '#6B2D3E',
      disagreement: '#A8502F',
    },
    text: {
      primary: '#2A1C1A',
      secondary: '#5C4A3F',
      muted: '#8A7566',
      placeholder: '#A8907E',
      onDark: '#FAF5E9',
      onDarkMuted: 'rgba(233,223,200,0.62)',
    },
    ui: {
      border: 'rgba(42,28,26,0.08)',
      giltBorder: 'rgba(184,134,47,0.30)',
      inkBorder: 'rgba(107,45,62,0.18)',
      inkTint: 'rgba(107,45,62,0.07)',
      giltTint: 'rgba(184,134,47,0.14)',
      divider: '#E9DFC8',
      marginRule: 'rgba(184,134,47,0.28)',
      overlay: 'rgba(42,28,26,0.72)',
      loaderOverlay: 'rgba(42,28,26,0.88)',
    },
  },

  gradients: {
    paper: ['#FAF5E9', '#F3EAD6', '#E9DFC8'],
    page: ['#FDF9F0', '#F5ECDA'],
    compose: ['#FDF9F0', '#F2EAD8'],
    dark: ['#2A1C1A', '#3A2420', '#1E1413'],
    summary: ['#3A2420', '#2A1C1A'],
    burgundy: ['#6B2D3E', '#8A3B50'],
    gilt: ['#6B2D3E', '#B8862F'],
    header: ['#F2EAD8', '#FAF5E9'],
  },

  font: {
    serif: 'serif',
  },

  typography: {
    hero: { fontSize: 44, fontWeight: '700' as const, letterSpacing: -0.5, lineHeight: 46 },
    brand: { fontSize: 34, fontWeight: '700' as const, letterSpacing: 3 },
    title: { fontSize: 24, fontWeight: '700' as const, letterSpacing: 0.5 },
    section: { fontSize: 16, fontWeight: '600' as const, letterSpacing: 1.5 },
    body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 23 },
    secondary: { fontSize: 13, fontWeight: '400' as const, lineHeight: 19 },
    statValue: { fontSize: 20, fontWeight: '700' as const, letterSpacing: 0.2 },
    caption: { fontSize: 10, fontWeight: '600' as const, letterSpacing: 2 },
    button: { fontSize: 15, fontWeight: '700' as const, letterSpacing: 1.5, lineHeight: 24 },
  },

  radius: { xs: 4, sm: 6, md: 10, lg: 14, xl: 20, full: 999 },

  spacing: { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32 },

  shadows: {
    card: {
      shadowColor: '#2A1C1A',
      shadowOpacity: 0.07,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    lifted: {
      shadowColor: '#2A1C1A',
      shadowOpacity: 0.1,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 3,
    },
    floating: {
      shadowColor: '#2A1C1A',
      shadowOpacity: 0.16,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 9,
    },
    cta: {
      shadowColor: '#6B2D3E',
      shadowOpacity: 0.32,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 7,
    },
  },
};

export type Theme = typeof theme;
export default theme;
