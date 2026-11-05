// Standardized font classes that do not depend on next/font/google internal CSS modules
// to avoid Next.js 16 / Turbopack Vercel build-time module resolution failures.

export const playfair = {
  className: 'font-serif-playfair',
  style: { fontFamily: "'Playfair Display', Georgia, serif" }
};

export const sansBody = {
  className: 'font-sans-jakarta',
  style: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }
};

export const cursiveFont = {
  className: 'font-cursive-dancing',
  style: { fontFamily: "'Dancing Script', cursive" }
};
