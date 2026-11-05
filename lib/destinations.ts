export interface DestinationSectionConfig {
  available: boolean;
  family: boolean;
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
  familyTitle?: string;
  familySubtitle?: string;
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
    family?: string[];
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
  family: true,
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
  familyTitle: 'Family Special Packages',
  familySubtitle: 'Memorable Journeys',
  customTitle: 'Customized Tour Packages',
  customSubtitle: 'Tailored For You',
  relatedTitle: 'Trending India Tour Packages',
  relatedSubtitle: 'Explore More',
};

// Built-in starter templates for destinations
export const BUILTIN_DESTINATIONS: DestinationPageItem[] = [
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
  }
];
