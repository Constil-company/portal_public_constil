/**
 * Design tokens — Binance-inspired layout, CONSTIL primary (#448AFF).
 */
export const colors = {
  primary: '#448AFF',
  primaryActive: '#3d7ef7',
  primaryDisabled: '#1a2a4a',
  onPrimary: '#ffffff',

  canvasDark: '#0b0e11',
  surfaceCardDark: '#1e2329',
  surfaceElevatedDark: '#2b3139',

  canvasLight: '#ffffff',
  surfaceSoftLight: '#fafafa',
  surfaceStrongLight: '#f5f5f5',

  hairlineOnLight: '#eaecef',
  hairlineOnDark: '#2b3139',
  borderStrong: '#cdd1d6',

  ink: '#181a20',
  body: '#eaecef',
  bodyOnLight: '#181a20',
  muted: '#707a8a',
  mutedStrong: '#929aa5',
  onDark: '#ffffff',

  tradingUp: '#0ecb81',
  tradingDown: '#f6465d',
  info: '#3b82f6',
} as const;

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  section: 80,
} as const;

export const rounded = {
  xs: 2,
  sm: 4,
  md: 6,
  lg: 8,
  xl: 12,
  pill: 9999,
} as const;

export const typography = {
  heroDisplay: { size: 64, weight: 700, lineHeight: 1.1 },
  displayLg: { size: 48, weight: 700, lineHeight: 1.1 },
  displaySm: { size: 32, weight: 600, lineHeight: 1.2 },
  titleLg: { size: 24, weight: 600, lineHeight: 1.3 },
  titleMd: { size: 20, weight: 600, lineHeight: 1.35 },
  numberDisplay: { size: 40, weight: 700, lineHeight: 1.1 },
  numberMd: { size: 16, weight: 500, lineHeight: 1.4 },
  bodyMd: { size: 14, weight: 400, lineHeight: 1.5 },
  bodySm: { size: 13, weight: 400, lineHeight: 1.5 },
  caption: { size: 12, weight: 500, lineHeight: 1.4 },
  button: { size: 14, weight: 600, lineHeight: 1 },
} as const;
