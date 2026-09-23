/**
 * Curated high-resolution luxury imagery for destinations
 */
export const availableDummyImages: string[] = [
  '/images/about_hero4.jpg',
  '/images/about_hero5.jpg',
  '/images/about_hero3.jpg',
  '/images/himachal.jpg',
  '/images/himachal1.jpg',
  '/images/kashmir.jpg',
  '/images/bali.jpg',
  '/images/bhutan1.jpg',
  '/images/bhutan2.jpg',
  '/images/spiti1.JPG',
  '/images/spiti2.JPG',
  '/images/singapore1.jpg',
  '/images/thailand.jpg',
  '/images/vietnam.png',
  '/images/gallery1.jpeg',
  '/images/gallery4.jpg',
  '/images/gallery11.jpg',
  '/images/gallery15.JPG',
  '/images/gallery26.JPG'
];

export const destinationLuxuryImages: Record<string, string[]> = {
  rajasthan: [
    '/images/about_hero4.jpg',
    '/images/about_hero5.jpg',
    '/images/about_hero3.jpg',
    '/images/gallery1.jpeg',
    '/images/gallery4.jpg',
    '/images/gallery11.jpg'
  ],
  jodhpur: [
    '/images/about_hero4.jpg',
    '/images/about_hero5.jpg',
    '/images/gallery1.jpeg',
    '/images/gallery11.jpg'
  ],
  jaipur: [
    '/images/about_hero3.jpg',
    '/images/about_hero4.jpg',
    '/images/gallery4.jpg',
    '/images/gallery15.JPG'
  ],
  jaisalmer: [
    '/images/about_hero4.jpg',
    '/images/about_hero5.jpg',
    '/images/gallery1.jpeg'
  ],
  bhutan: [
    '/images/bhutan1.jpg',
    '/images/bhutan2.jpg',
    '/images/bhutan3.jpg',
    '/images/bhutan-cover1.jpg',
    '/images/bhutan-cover2.jpg'
  ],
  kashmir: [
    '/images/kashmir.jpg',
    '/images/gallery1.jpeg',
    '/images/about_hero4.jpg'
  ],
  'leh ladakh': [
    '/images/leh-ladakh.jpg',
    '/images/spiti1.JPG',
    '/images/spiti2.JPG'
  ],
  spiti: [
    '/images/spiti1.JPG',
    '/images/spiti2.JPG',
    '/images/spiti3.jpg'
  ],
  himachal: [
    '/images/himachal.jpg',
    '/images/himachal1.jpg',
    '/images/himachal2.jpg'
  ],
  bali: [
    '/images/bali.jpg',
    '/images/bali-group-trip.png',
    '/images/romantic-bali-getaway.png'
  ],
  vietnam: [
    '/images/vietnam.png',
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png'
  ],
  thailand: [
    '/images/thailand.jpg',
    '/images/thailand-couple-leisure.png'
  ],
  singapore: [
    '/images/singapore1.jpg',
    '/images/singapore2.jpg',
    '/images/singapore3.jpg'
  ],
  meghalaya: [
    '/images/meghalaya.jpg',
    '/images/about_hero4.jpg'
  ]
};

export function getLuxuryImagesForDestination(destinationName: string = ''): { hero: string; gallery: string[] } {
  const clean = destinationName.toLowerCase().trim();

  let matchedKey = Object.keys(destinationLuxuryImages).find(k => clean.includes(k) || k.includes(clean));

  const defaultHero = '/images/about_hero4.jpg';
  const defaultGallery = availableDummyImages;

  if (!matchedKey || !destinationLuxuryImages[matchedKey]) {
    return { hero: defaultHero, gallery: defaultGallery };
  }

  const images = destinationLuxuryImages[matchedKey];
  return {
    hero: images[0] || defaultHero,
    gallery: images.length >= 6 ? images : [...images, ...availableDummyImages].slice(0, 10)
  };
}
