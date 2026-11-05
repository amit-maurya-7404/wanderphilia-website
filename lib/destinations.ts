export interface DestinationSectionConfig {
  available: boolean;
  group?: boolean;
  family: boolean;
  honeymoon?: boolean;
  custom: boolean;
  related: boolean;
  durationFilter: boolean;
  reviews: boolean;
  gallery: boolean;
  faqs: boolean;
}

export interface DestinationSectionTitles {
  availableTitle?: string;
  availableSubtitle?: string;
  groupTitle?: string;
  groupSubtitle?: string;
  familyTitle?: string;
  familySubtitle?: string;
  honeymoonTitle?: string;
  honeymoonSubtitle?: string;
  customTitle?: string;
  customSubtitle?: string;
  relatedTitle?: string;
  relatedSubtitle?: string;
}

export interface DestinationFaqItem {
  question: string;
  answer: string;
}

export interface DestinationGalleryImage {
  image: string;
  alt?: string;
}

export interface DestinationPageItem {
  _id?: string;
  slug: string; // e.g. "kerala", "andaman", "dubai"
  name: string; // e.g. "Kerala Tour Packages 2026"
  destination: string; // e.g. "Kerala"
  region: 'Domestic' | 'International';
  tagline?: string;
  description: string;
  startingPrice?: number;
  heroImages: string[];
  sections: DestinationSectionConfig;
  sectionTitles?: DestinationSectionTitles;
  customPackageIds?: {
    available?: string[];
    group?: string[];
    family?: string[];
    honeymoon?: string[];
    custom?: string[];
    related?: string[];
  };
  faqs?: DestinationFaqItem[];
  galleryImages?: DestinationGalleryImage[];
  isActive: boolean;
  isCustom?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_DESTINATION_SECTIONS: DestinationSectionConfig = {
  available: true,
  group: true,
  family: true,
  honeymoon: true,
  custom: true,
  related: true,
  durationFilter: true,
  reviews: true,
  gallery: true,
  faqs: true,
};

export const DEFAULT_SECTION_TITLES: DestinationSectionTitles = {
  availableTitle: 'Available Tour Packages',
  availableSubtitle: 'Curated Experiences',
  groupTitle: 'Group Tour Packages',
  groupSubtitle: 'Explore Together',
  familyTitle: 'Family Special Packages',
  familySubtitle: 'Memorable Journeys',
  honeymoonTitle: 'Romantic & Honeymoon Specials',
  honeymoonSubtitle: 'Dreamy Escapes',
  customTitle: 'Customized Tour Packages',
  customSubtitle: 'Tailored For You',
  relatedTitle: 'Trending India Tour Packages',
  relatedSubtitle: 'Explore More',
};

// All built-in destinations across the website
export const BUILTIN_DESTINATIONS: DestinationPageItem[] = [
  // 1. MEGHALAYA
  {
    slug: 'meghalaya',
    name: 'Meghalaya Tour Packages 2026',
    destination: 'Meghalaya',
    region: 'Domestic',
    tagline: 'Abode of the Clouds - Living Root Bridges, Pristine Waterfalls & Dawki River',
    description: 'All inclusive curated Best Meghalaya Group & Customized Tour Packages 2026 covering Shillong, Cherrapunji (Sohra), Dawki crystal clear Umngot River, Mawlynnong Cleanest Village, Double Decker Living Root Bridge, Krang Shuri Falls, Nohkalikai Falls, and Laitlum Canyons.',
    startingPrice: 24999,
    heroImages: [
      '/images/meghalaya.jpg',
      'https://images.unsplash.com/photo-1565716665452-2a4e3445b378?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1654788111018-9096236d54ac?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1521437620269-f477f5437820?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1698429358246-807d8972da9a?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: false,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    sectionTitles: {
      availableTitle: 'Available Tour Packages',
      availableSubtitle: 'Curated Experiences',
      familyTitle: 'Family Special Packages',
      familySubtitle: 'Memorable Journeys',
      customTitle: 'Customized Tour Packages',
      customSubtitle: 'Tailored For You',
      relatedTitle: 'Trending India Tour Packages',
      relatedSubtitle: 'Explore More',
    },
    isActive: true,
    isCustom: false,
  },

  // 2. LEH LADAKH
  {
    slug: 'leh-ladakh',
    name: 'Leh Ladakh Tour Packages 2026',
    destination: 'Ladakh',
    region: 'Domestic',
    tagline: 'Roof of the World - Pangong Tso, Nubra Valley & Khardung La',
    description: 'Embark on an epic Himalayan road adventure across high mountain passes, ancient monasteries, double-humped camel rides in Hunder, and camp under millions of stars at Pangong Lake.',
    startingPrice: 27999,
    heroImages: [
      '/images/leh-ladakh.jpg',
      'https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 3. SPITI VALLEY
  {
    slug: 'spiti',
    name: 'Spiti Valley Tour Packages 2026',
    destination: 'Spiti',
    region: 'Domestic',
    tagline: 'Middle Land - Key Monastery, Chandratal Lake & High Altitude Passes',
    description: 'Explore the rugged, untamed beauty of Spiti Valley. Experience ancient gompas, highest post office in Hikkim, fossil village Langza, and the mystical turquoise waters of Chandratal.',
    startingPrice: 18999,
    heroImages: [
      '/images/spiti-valley.jpg',
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 4. RAJASTHAN
  {
    slug: 'rajasthan',
    name: 'Rajasthan Tour Packages 2026',
    destination: 'Rajasthan',
    region: 'Domestic',
    tagline: 'Land of Kings - Majestic Forts, Palaces & Desert Safaris',
    description: 'Experience royalty with handpicked Rajasthan Tour Packages covering Jaipur Pink City, Udaipur City of Lakes, Jodhpur Blue City, and Jaisalmer Golden Sand Dunes with desert camps and cultural shows.',
    startingPrice: 22999,
    heroImages: [
      '/images/Rajasthan/rajasthan1.jpeg',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 5. KASHMIR
  {
    slug: 'kashmir',
    name: 'Kashmir Tour Packages 2026',
    destination: 'Kashmir',
    region: 'Domestic',
    tagline: 'Paradise on Earth - Dal Lake Shikaras, Gulmarg Gondola & Pahalgam Valleys',
    description: 'Explore the breathtaking heaven of Kashmir with curated packages across Srinagar, Gulmarg, Sonamarg, and Pahalgam with premium stays and scenic Shikara rides.',
    startingPrice: 19999,
    heroImages: [
      '/images/kashmir.jpg',
      'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 6. HIMACHAL
  {
    slug: 'himachal',
    name: 'Himachal Tour Packages 2026',
    destination: 'Himachal',
    region: 'Domestic',
    tagline: 'Himalayan Escapes - Manali Snow Peaks, Kasol Cafe Trails & Jibhi Waterfalls',
    description: 'Experience magical Himachal Pradesh across Shimla, Manali, Solang Valley, Kasol, Tosh, and pristine Tirthan Valley with riverside stays and cafe hopping.',
    startingPrice: 11999,
    heroImages: [
      '/images/himachal.jpg',
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 7. SIKKIM
  {
    slug: 'sikkim',
    name: 'Sikkim & Darjeeling Tour Packages 2026',
    destination: 'Sikkim',
    region: 'Domestic',
    tagline: 'Mystical Eastern Himalayas - Gangtok, Tsomgo Lake, Lachen & Gurudongmar',
    description: 'Discover the mystical beauty of Sikkim with scenic drives to Tsomgo Lake, Nathula Pass, Yumthang Valley of Flowers, and sacred Gurudongmar Lake.',
    startingPrice: 21999,
    heroImages: [
      '/images/sikkim.png',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 8. BALI
  {
    slug: 'bali',
    name: 'Bali Tour Packages 2026',
    destination: 'Bali',
    region: 'International',
    tagline: 'Island of the Gods - Ubud Waterfalls, Nusa Penida Cliffs & Beach Clubs',
    description: 'Immerse yourself in tropical Bali paradise with luxury private pool villas, Nusa Penida island tours, Uluwatu sunset fire dance, and thrilling water sports.',
    startingPrice: 34999,
    heroImages: [
      '/images/bali.jpg',
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 9. VIETNAM
  {
    slug: 'vietnam',
    name: 'Vietnam Tour Packages 2026',
    destination: 'Vietnam',
    region: 'International',
    tagline: 'Timeless Charm - Ha Long Bay Cruise, Da Nang Golden Bridge & Hanoi Old Quarter',
    description: 'Discover vibrant Vietnam from the limestone karsts of Ha Long Bay to lantern-lit Hoi An ancient town and modern skyline of Ho Chi Minh City.',
    startingPrice: 32999,
    heroImages: [
      '/images/vietnam.png',
      'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 10. THAILAND
  {
    slug: 'thailand',
    name: 'Thailand Tour Packages 2026',
    destination: 'Thailand',
    region: 'International',
    tagline: 'Land of Smiles - Phuket Island Hopping, Krabi Beaches & Bangkok Temples',
    description: 'Experience Thailand with world-class beach resorts, Phi Phi islands speedboats, Bangkok shopping street markets, and famous nightlife.',
    startingPrice: 26999,
    heroImages: [
      '/images/thailand.jpg',
      'https://images.unsplash.com/photo-1506665531195-3566af2b4dfa?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 11. BHUTAN
  {
    slug: 'bhutan',
    name: 'Bhutan Tour Packages 2026',
    destination: 'Bhutan',
    region: 'International',
    tagline: 'Land of the Thunder Dragon - Tiger\'s Nest, Thimphu & Punakha Dzong',
    description: 'Travel to the happiest kingdom in the world. Hike to Taktsang (Tiger\'s Nest Monastery), admire Himalayan fortress dzongs, and witness vibrant Buddhist culture.',
    startingPrice: 29999,
    heroImages: [
      '/images/Bhutan_cat.jpg',
      'https://images.unsplash.com/photo-1578637387939-43c525550085?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 12. SINGAPORE
  {
    slug: 'singapore',
    name: 'Singapore Tour Packages 2026',
    destination: 'Singapore',
    region: 'International',
    tagline: 'Lion City - Marina Bay Sands, Universal Studios & Gardens by the Bay',
    description: 'Experience the futuristic city of Singapore with Sentosa Island adventures, Cloud Forest domes, night safaris, and luxury shopping on Orchard Road.',
    startingPrice: 38999,
    heroImages: [
      '/images/singapore.png',
      'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 13. SWITZERLAND
  {
    slug: 'switzerland',
    name: 'Switzerland Tour Packages 2026',
    destination: 'Switzerland',
    region: 'International',
    tagline: 'Alpine Wonder - Jungfraujoch, Interlaken Lakes & Zermatt Matterhorn',
    description: 'Explore scenic Switzerland with panoramic cogwheel train rides, snow-capped Swiss Alps, pristine lakes of Lucerne and Interlaken, and Swiss chocolate tastings.',
    startingPrice: 89999,
    heroImages: [
      '/images/switzerland-dest.jpg',
      'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 14. NEPAL
  {
    slug: 'nepal',
    name: 'Nepal Tour Packages 2026',
    destination: 'Nepal',
    region: 'International',
    tagline: 'Himalayan Gateway - Kathmandu Durbar, Pokhara Phewa Lake & Annapurna Peaks',
    description: 'Discover Nepal\'s heritage temples, sacred stupas, serene boat rides on Phewa Lake in Pokhara, and sunrise views over the Annapurna mountain range.',
    startingPrice: 18999,
    heroImages: [
      '/images/nepal-dest.jpg',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 15. INDONESIA
  {
    slug: 'indonesia',
    name: 'Indonesia Tour Packages 2026',
    destination: 'Indonesia',
    region: 'International',
    tagline: 'Emerald Archipelago - Komodo Dragons, Mount Bromo & Gili Islands',
    description: 'Embark on island hopping across Indonesia from the volcanic sunrises of Mount Bromo to pristine beaches of Gili and ancient temples of Yogyakarta.',
    startingPrice: 36999,
    heroImages: [
      '/images/indonesia-dest.jpg',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 16. JAPAN
  {
    slug: 'japan',
    name: 'Japan Tour Packages 2026',
    destination: 'Japan',
    region: 'International',
    tagline: 'Land of the Rising Sun - Tokyo Shinjuku, Mount Fuji & Kyoto Bamboo Groves',
    description: 'Experience futuristic Tokyo, sacred shrines of Kyoto, majestic Mount Fuji viewpoints, and bullet train rides across historic and modern Japan.',
    startingPrice: 94999,
    heroImages: [
      '/images/japan.jpg',
      'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 17. ICELAND
  {
    slug: 'iceland',
    name: 'Iceland Tour Packages 2026',
    destination: 'Iceland',
    region: 'International',
    tagline: 'Land of Fire and Ice - Northern Lights, Blue Lagoon & Black Sand Beaches',
    description: 'Witness the dancing Aurora Borealis (Northern Lights), steaming geothermal lagoons, thunderous Skogafoss waterfall, and volcanic Reynisfjara black sand beaches.',
    startingPrice: 119999,
    heroImages: [
      '/images/iceland.jpg',
      'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 18. PERU
  {
    slug: 'peru',
    name: 'Peru Tour Packages 2026',
    destination: 'Peru',
    region: 'International',
    tagline: 'Inca Wonders - Machu Picchu Citadel, Cusco Sacred Valley & Rainbow Mountain',
    description: 'Journey to the lost citadel of the Incas at Machu Picchu, explore colonial Cusco, and hike to the surreal vibrant ridges of Vinicunca Rainbow Mountain.',
    startingPrice: 124999,
    heroImages: [
      '/images/peru-dest.jpg',
      'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=1200&q=80'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    isActive: true,
    isCustom: false,
  },

  // 19. SRI LANKA
  {
    slug: 'sri-lanka',
    name: 'Sri Lanka Tour Packages 2026',
    destination: 'Sri Lanka',
    region: 'International',
    tagline: 'Pearl of the Indian Ocean - Sigiriya Fortress, Ella Tea Hills, Mirissa & Bentota Beaches',
    description: 'Explore the tropical paradise of Sri Lanka with ancient UNESCO Sigiriya Lion Rock, scenic Ella train journeys through misty tea plantations, wildlife safaris in Yala National Park, cultural Kandy Temple of the Sacred Tooth Relic, and golden sandy beaches of Bentota and Mirissa.',
    startingPrice: 34999,
    heroImages: [
      '/images/srilanka/hero.jpg',
      '/images/srilanka/sigiriya-rock.jpg',
      '/images/srilanka/nine-arches-bridge.jpg',
      '/images/srilanka/mirissa-beach.jpg',
      '/images/srilanka/nuwara-eliya.jpg',
      '/images/srilanka/bentota-beach.jpg'
    ],
    sections: {
      available: true,
      family: true,
      custom: true,
      related: true,
      durationFilter: true,
      reviews: true,
      gallery: true,
      faqs: true,
    },
    faqs: [
      {
        question: 'What is the best time to visit Sri Lanka?',
        answer: 'Sri Lanka is a year-round travel destination. The west and south coasts (Bentota, Galle, Mirissa) and central highlands (Nuwara Eliya, Ella) are ideal from November to April, while the eastern coast is great from May to September.'
      },
      {
        question: 'Do Indian passport holders need a visa for Sri Lanka?',
        answer: 'Yes, Indian tourists can easily apply for an Electronic Travel Authorization (ETA) online before arrival or receive visa on arrival at Bandaranaike International Airport in Colombo.'
      },
      {
        question: 'What are the top highlights included in Sri Lanka tours?',
        answer: 'Must-visit highlights include the ancient Sigiriya Lion Rock Fortress, Kandy Tooth Relic Temple, scenic Ella Nine Arches Bridge train journey, Nuwara Eliya tea estates, Yala National Park wildlife safaris, and coastal water activities in Bentota and Mirissa.'
      },
      {
        question: 'Is Sri Lanka suitable for family vacations and couple getaways?',
        answer: 'Absolutely! Sri Lanka is known for its warm hospitality, pristine beaches, luxury beachside resorts, scenic hill stations, and rich cultural heritage, making it perfect for both families and couples.'
      }
    ],
    isActive: true,
    isCustom: false,
  }
];
