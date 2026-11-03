import localFont from 'next/font/local';

// Self-hosted brand typefaces (SIL Open Font License, see src/assets/fonts/OFL-*.txt).
// next/font preloads the files, adds size-adjusted fallbacks to avoid layout shift
// and exposes each family as a CSS variable consumed by src/styles/theme.css.

/** Display face: headlines, brand mark and ticker. */
export const barlowCondensed = localFont({
  src: [
    { path: '../assets/fonts/barlow-condensed-700.woff2', weight: '700', style: 'normal' },
    { path: '../assets/fonts/barlow-condensed-800.woff2', weight: '800', style: 'normal' },
  ],
  variable: '--font-barlow-condensed',
  display: 'swap',
});

/**
 * Body copy and form inputs. Only the weights the design renders are declared,
 * because next/font preloads every file listed here.
 */
export const dmSans = localFont({
  src: [
    { path: '../assets/fonts/dm-sans-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/dm-sans-500.woff2', weight: '500', style: 'normal' },
  ],
  variable: '--font-dm-sans',
  display: 'swap',
});

/** Technical labels, navigation and buttons. */
export const jetbrainsMono = localFont({
  src: [
    { path: '../assets/fonts/jetbrains-mono-400.woff2', weight: '400', style: 'normal' },
    { path: '../assets/fonts/jetbrains-mono-500.woff2', weight: '500', style: 'normal' },
    { path: '../assets/fonts/jetbrains-mono-600.woff2', weight: '600', style: 'normal' },
    { path: '../assets/fonts/jetbrains-mono-700.woff2', weight: '700', style: 'normal' },
  ],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

/** Class names that define the font CSS variables; apply them to <html>. */
export const fontVariables = [
  barlowCondensed.variable,
  dmSans.variable,
  jetbrainsMono.variable,
].join(' ');
