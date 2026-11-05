import { Playfair_Display, Plus_Jakarta_Sans, Dancing_Script } from 'next/font/google';

export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

export const sansBody = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const cursiveFont = Dancing_Script({
  subsets: ['latin'],
  weight: ['600', '700'],
  display: 'swap',
});

