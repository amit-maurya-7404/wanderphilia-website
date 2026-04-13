export interface Trip {
  id: string
  title: string
  slug: string
  image: string
  destination: string
  description: string
  duration: number
  price: number
  rating: number
  difficulty: 'Easy' | 'Moderate' | 'Hard'
  groupSize: number
  region?: string
  category: string
  tripType: 'India' | 'International'
  highlights: string[]
  itinerary: {
    day: number
    title: string
    description: string
  }[]
  included: string[]
  notIncluded: string[]
  dates: {
    startDate: string
    endDate: string
    spots: number
  }[]
}

export interface Destination {
  title: string
  slug: string
  image: string
  description: string
  tripCount: number
}

export interface Testimonial {
  quote: string
  author: string
  role: string
  image: string
  rating: number
  trip: string
}

export interface Blog {
  id: string
  title: string
  slug: string
  image: string
  excerpt: string
  author: string
  date: string
  category: string
  content: string
  readTime: number
}

export interface InstagramPost {
  id: string
  image: string
  type: 'post' | 'reel'
  caption: string
  likes: number
  comments: number
}

export interface Review {
  id: string
  author: string
  platform: 'google' | 'facebook' | 'justdial'
  rating: number
  comment: string
  date: string
  avatar: string
  trip: string
}

export interface GalleryImage {
  id: string
  image: string
  title: string
  category: 'mountains' | 'stays' | 'trips'
  alt: string
}

export interface VideoTestimonial {
  id: string
  title: string
  thumbnail: string
  videoUrl: string
  author: string
  role: string
  trip: string
}

export const trips: Trip[] = [
  {
    id: '1',
    title: 'Everest Base Camp Trek',
    slug: 'everest-base-camp',
    image: '/images/everest.jpg',
    destination: 'Nepal',
    category: 'Nepal',
    description: 'Trek to the base camp of the world\'s highest mountain through stunning Himalayan landscapes.',
    duration: 14,
    price: 99900,
    rating: 4.9,
    difficulty: 'Hard',
    groupSize: 12,
    tripType: 'International',
    highlights: [
      'Stunning mountain vistas',
      'Traditional Sherpa villages',
      'Namche Bazaar market',
      'Close proximity to Everest'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Kathmandu', description: 'Welcome to Nepal! Meet your guides and prepare for the adventure.' },
      { day: 2, title: 'Kathmandu Exploration', description: 'Visit ancient temples and markets in Kathmandu.' },
      { day: 3, title: 'Flight to Lukla', description: 'Scenic flight to Lukla, gateway to Everest region.' },
      { day: 4, title: 'Lukla to Namche', description: 'Trek through pine forests to Namche Bazaar.' },
      { day: 5, title: 'Acclimatization Day', description: 'Explore Namche Bazaar and nearby trails.' },
    ],
    included: ['All meals', 'Local guides', 'Accommodation', 'Trek permits'],
    notIncluded: ['International flights', 'Personal insurance', 'Tips'],
    dates: [
      { startDate: '2024-05-01', endDate: '2024-05-14', spots: 5 },
      { startDate: '2024-09-15', endDate: '2024-09-28', spots: 8 },
    ]
  },
  {
    id: '2',
    title: 'Bali Culture & Beaches',
    slug: 'bali-culture',
    image: '/images/bali.jpg',
    destination: 'Indonesia',
    category: 'Indonesia',
    description: 'Experience the mystical temples, lush rice terraces, and pristine beaches of Bali.',
    duration: 8,
    price: 69900,
    rating: 4.8,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'International',
    highlights: [
      'Ancient temples',
      'Rice terraces',
      'Pristine beaches',
      'Traditional ceremonies'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Denpasar', description: 'Welcome to Bali. Transfer to your resort.' },
      { day: 2, title: 'Temple Tour', description: 'Visit Tanah Lot and Besakih temples.' },
      { day: 3, title: 'Rice Terraces', description: 'Trek through iconic Tegallalang rice terraces.' },
    ],
    included: ['Accommodation', 'Daily breakfast', 'Airport transfers', 'Tour guide'],
    notIncluded: ['International flights', 'Activities', 'Meals'],
    dates: [
      { startDate: '2024-06-01', endDate: '2024-06-08', spots: 12 },
    ]
  },
  {
    id: '3',
    title: 'Swiss Alpine Adventure',
    slug: 'swiss-alpine',
    image: '/images/swiss.jpg',
    destination: 'Switzerland',
    category: 'Switzerland',
    description: 'Hike through the majestic Swiss Alps with breathtaking views and charming mountain villages.',
    duration: 10,
    price: 129900,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 14,
    tripType: 'International',
    highlights: [
      'Mountain peaks',
      'Alpine villages',
      'Crystal clear lakes',
      'Cable car rides'
    ],
    itinerary: [
      { day: 1, title: 'Zurich Arrival', description: 'Meet in Zurich and travel to Interlaken.' },
      { day: 2, title: 'Jungfrau Expedition', description: 'Train to Jungfrau, Europe\'s highest railway station.' },
    ],
    included: ['All accommodations', 'Meals', 'Transport passes', 'Guide'],
    notIncluded: ['International flights'],
    dates: [
      { startDate: '2024-07-15', endDate: '2024-07-24', spots: 6 },
    ]
  },
  {
    id: '4',
    title: 'Amazon Rainforest Expedition',
    slug: 'amazon-expedition',
    image: '/images/amazon.jpg',
    destination: 'Peru',
    category: 'Peru',
    description: 'Discover the world\'s largest rainforest and encounter exotic wildlife in their natural habitat.',
    duration: 7,
    price: 94900,
    rating: 4.7,
    difficulty: 'Moderate',
    groupSize: 10,
    tripType: 'International',
    highlights: [
      'Wildlife spotting',
      'River cruises',
      'Indigenous cultures',
      'Jungle lodges'
    ],
    itinerary: [
      { day: 1, title: 'Lima to Iquitos', description: 'Fly to the gateway of the Amazon.' },
    ],
    included: ['Lodge accommodation', 'All meals', 'Boat tours', 'Naturalist guide'],
    notIncluded: ['Flights to Iquitos', 'Travel insurance'],
    dates: [
      { startDate: '2024-08-01', endDate: '2024-08-07', spots: 4 },
    ]
  },
  {
    id: '5',
    title: 'Iceland Northern Lights',
    slug: 'iceland-lights',
    image: '/images/iceland.jpg',
    destination: 'Iceland',
    category: 'Iceland',
    description: 'Chase the magical Aurora Borealis under the Arctic skies of Iceland.',
    duration: 9,
    price: 114900,
    rating: 4.8,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    highlights: [
      'Northern Lights',
      'Hot springs',
      'Waterfalls',
      'Glacier hiking'
    ],
    itinerary: [
      { day: 1, title: 'Reykjavik Arrival', description: 'Welcome to Iceland\'s vibrant capital.' },
    ],
    included: ['Accommodation', 'Breakfast', 'Tours', 'Guide'],
    notIncluded: ['Flights', 'Dinner'],
    dates: [
      { startDate: '2024-10-15', endDate: '2024-10-23', spots: 10 },
    ]
  },
  {
    id: '6',
    title: 'Japan Cultural Journey',
    slug: 'japan-cultural',
    image: '/images/japan.jpg',
    destination: 'Japan',
    category: 'Japan',
    description: 'Journey through ancient temples, modern cities, and serene gardens of Japan.',
    duration: 12,
    price: 154900,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 20,
    tripType: 'International',
    highlights: [
      'Tokyo bustling streets',
      'Kyoto temples',
      'Mount Fuji views',
      'Traditional tea ceremonies'
    ],
    itinerary: [
      { day: 1, title: 'Tokyo Arrival', description: 'Welcome to the Land of the Rising Sun.' },
    ],
    included: ['Hotel stays', 'Breakfast', 'Tours', 'Train pass'],
    notIncluded: ['International flights', 'Most meals'],
    dates: [
      { startDate: '2024-11-01', endDate: '2024-11-12', spots: 15 },
    ]
  },
  {
    id: '7',
    title: 'Leh Ladakh Adventure',
    slug: 'leh-ladakh',
    image: '/images/leh-ladakh.jpg',
    destination: 'Leh Ladakh',
    region: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: 'Experience the mystical mountains of Ladakh with stunning views and adventure activities.',
    duration: 6,
    price: 15800,
    rating: 4.9,
    difficulty: 'Hard',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Nubra Valley',
      'Pangong Lake',
      'Khardung La Pass',
      'Buddhist monasteries'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Leh', description: 'Arrive in Leh and acclimatize.' },
      { day: 2, title: 'Nubra Valley', description: 'Visit Nubra Valley and enjoy camel safari.' },
      { day: 3, title: 'Pangong Lake', description: 'Drive to the stunning Pangong Lake.' },
    ],
    included: ['All meals', 'Accommodation', 'Transport', 'Guide'],
    notIncluded: ['Flight', 'Personal expenses'],
    dates: [
      { startDate: '2024-05-01', endDate: '2024-05-06', spots: 8 },
      { startDate: '2024-08-01', endDate: '2024-08-06', spots: 10 },
    ]
  },
  {
    id: '8',
    title: 'Spiti Valley Trek',
    slug: 'spiti-valley',
    image: '/images/spiti-valley.jpg',
    destination: 'Spiti Valley',
    region: 'Spiti',
    category: 'Spiti',
    description: 'Trek through the high desert valleys of Spiti with ancient monasteries.',
    duration: 7,
    price: 24499,
    rating: 4.8,
    difficulty: 'Hard',
    groupSize: 12,
    tripType: 'India',
    highlights: [
      'Key Monastery',
      'Tabo Monastery',
      'Kaza village',
      'High altitude trekking'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Shimla', description: 'Start your Spiti adventure from Shimla.' },
      { day: 2, title: 'Journey to Spiti', description: 'Drive through beautiful landscapes to Spiti.' },
    ],
    included: ['Accommodation', 'All meals', 'Guide', 'Transport'],
    notIncluded: ['Flight', 'Insurance'],
    dates: [
      { startDate: '2024-06-15', endDate: '2024-06-21', spots: 6 },
      { startDate: '2024-09-01', endDate: '2024-09-07', spots: 8 },
    ]
  },
  {
    id: '9',
    title: 'Kashmir Heaven Trek',
    slug: 'kashmir-trek',
    image: '/images/kashmir.jpg',
    destination: 'Kashmir',
    region: 'Kashmir',
    category: 'Kashmir',
    description: 'Explore the paradise of Kashmir with lush valleys and stunning alpine meadows.',
    duration: 5,
    price: 24499,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 16,
    tripType: 'India',
    highlights: [
      'Dal Lake',
      'Gulmarg',
      'Pahalgam',
      'Alpine meadows'
    ],
    itinerary: [
      { day: 1, title: 'Srinagar Arrival', description: 'Welcome to Kashmir, the land of natural beauty.' },
      { day: 2, title: 'Dal Lake tour', description: 'Enjoy houseboat experience on Dal Lake.' },
    ],
    included: ['Houseboat stay', 'All meals', 'Shikara rides', 'Guide'],
    notIncluded: ['Flight', 'Activities'],
    dates: [
      { startDate: '2024-04-01', endDate: '2024-04-05', spots: 10 },
      { startDate: '2024-09-15', endDate: '2024-09-19', spots: 12 },
    ]
  },
  {
    id: '10',
    title: 'Meghalaya Waterfalls Tour',
    slug: 'meghalaya-tour',
    image: '/images/meghalaya.jpg',
    destination: 'Meghalaya',
    region: 'Meghalaya',
    category: 'Meghalaya',
    description: 'Discover the wettest state with stunning waterfalls and living root bridges.',
    duration: 4,
    price: 21499,
    rating: 4.7,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'India',
    highlights: [
      'Living Root Bridges',
      'Nohkalikai Falls',
      'Cherrapunji',
      'Mawlynnong village'
    ],
    itinerary: [
      { day: 1, title: 'Shillong Arrival', description: 'Arrive in the hill station of Shillong.' },
      { day: 2, title: 'Cherrapunji tour', description: 'Visit the wettest place on earth.' },
    ],
    included: ['Hotel', 'All meals', 'Transport', 'Guide'],
    notIncluded: ['Flight', 'Activities'],
    dates: [
      { startDate: '2024-07-01', endDate: '2024-07-04', spots: 12 },
      { startDate: '2024-10-01', endDate: '2024-10-04', spots: 14 },
    ]
  },
  {
    id: '11',
    title: 'Himachal Adventure',
    slug: 'himachal-adventure',
    image: '/images/himachal.jpg',
    destination: 'Himachal Pradesh',
    region: 'Himachal',
    category: 'Himachal',
    description: 'Adventure through the Himalayas with trekking, paragliding, and scenic beauty.',
    duration: 5,
    price: 6999,
    rating: 4.8,
    difficulty: 'Moderate',
    groupSize: 14,
    tripType: 'India',
    highlights: [
      'Bir Billing',
      'Kufri trek',
      'Rohtang Pass',
      'Adventure sports'
    ],
    itinerary: [
      { day: 1, title: 'Shimla arrival', description: 'Arrive in the queen of hills.' },
      { day: 2, title: 'Adventure activities', description: 'Try paragliding and trekking.' },
    ],
    included: ['Accommodation', 'Meals', 'Activities', 'Guide'],
    notIncluded: ['Flight', 'Insurance'],
    dates: [
      { startDate: '2024-05-15', endDate: '2024-05-19', spots: 8 },
      { startDate: '2024-10-15', endDate: '2024-10-19', spots: 10 },
    ]
  },
];

export const destinations: Destination[] = [
  {
    title: 'Nepal',
    slug: 'nepal',
    image: '/images/nepal-dest.jpg',
    description: 'Land of the Himalayas, mystical temples, and warm-hearted people.',
    tripCount: 4,
  },
  {
    title: 'Indonesia',
    slug: 'indonesia',
    image: '/images/indonesia-dest.jpg',
    description: 'Tropical paradise with stunning beaches and rich cultural heritage.',
    tripCount: 3,
  },
  {
    title: 'Switzerland',
    slug: 'switzerland',
    image: '/images/switzerland-dest.jpg',
    description: 'Alpine beauty, precision engineering, and world-class hiking.',
    tripCount: 2,
  },
  {
    title: 'Peru',
    slug: 'peru',
    image: '/images/peru-dest.jpg',
    description: 'Ancient Incan heritage, rainforests, and mountain wonders.',
    tripCount: 3,
  },
];

export const testimonials: Testimonial[] = [
  {
    quote: 'The Everest trek was the most life-changing experience of my life. Every moment was magical!',
    author: 'Sarah Johnson',
    role: 'Adventure Enthusiast',
    image: '/images/user1.jpg',
    rating: 5,
    trip: 'Everest Base Camp Trek',
  },
  {
    quote: 'Wanderphilia made our Bali trip unforgettable. The organization and guides were exceptional.',
    author: 'Michael Chen',
    role: 'Travel Blogger',
    image: '/images/user2.jpg',
    rating: 5,
    trip: 'Bali Culture & Beaches',
  },
  {
    quote: 'Perfect balance of adventure and comfort. The Swiss Alps trek exceeded all expectations!',
    author: 'Emma Williams',
    role: 'Corporate Executive',
    image: '/images/user3.jpg',
    rating: 5,
    trip: 'Swiss Alpine Adventure',
  },
  {
    quote: 'Saw the Northern Lights on the first night! Iceland was pure magic thanks to Wanderphilia.',
    author: 'James Patterson',
    role: 'Photographer',
    image: '/images/user4.jpg',
    rating: 5,
    trip: 'Iceland Northern Lights',
  },
];

export const blogs: Blog[] = [
  {
    id: '1',
    title: 'Top 10 Hidden Gems in Ladakh You Must Visit',
    slug: 'hidden-gems-ladakh',
    image: '/images/blog1.jpg',
    excerpt: 'Discover the most breathtaking and lesser-known locations in Ladakh that will take your breath away.',
    author: 'Sarah Anderson',
    date: '2024-04-05',
    category: 'Destinations',
    content: 'Ladakh is more than just Pangong Lake and Nubra Valley. Explore secret spots that few travelers know about...',
    readTime: 8,
  },
  {
    id: '2',
    title: 'Budget Travel Guide: Japan on ₹2000/day',
    slug: 'japan-budget-guide',
    image: '/images/blog2.jpg',
    excerpt: 'Explore Japan without breaking the bank. Here\'s how to travel like a local and save money.',
    author: 'Mike Johnson',
    date: '2024-04-03',
    category: 'Budget Travel',
    content: 'Japan can be expensive, but with the right tips and tricks, you can experience it affordably...',
    readTime: 12,
  },
  {
    id: '3',
    title: 'Best Time to Trek in the Himalayas',
    slug: 'himalayan-trekking-season',
    image: '/images/blog3.jpg',
    excerpt: 'Planning a Himalayan trek? Learn about the best seasons, weather, and what to expect.',
    author: 'Alex Turner',
    date: '2024-04-01',
    category: 'Travel Tips',
    content: 'Different regions of the Himalayas have different seasons. Plan your trek accordingly...',
    readTime: 10,
  },
];

export const instagramPosts: InstagramPost[] = [
  {
    id: '1',
    image: '/images/insta1.jpg',
    type: 'reel',
    caption: 'Golden hour at Pangong Lake 🌅 The colors are simply magical!',
    likes: 2543,
    comments: 185,
  },
  {
    id: '2',
    image: '/images/insta2.jpg',
    type: 'post',
    caption: 'Sunrise from Nubra Valley ✨ Words cannot describe this beauty',
    likes: 3201,
    comments: 221,
  },
  {
    id: '3',
    image: '/images/insta3.jpg',
    type: 'reel',
    caption: 'The ultimate bucket list moment - EBC trek 🏔️',
    likes: 4102,
    comments: 312,
  },
  {
    id: '4',
    image: '/images/insta4.jpg',
    type: 'post',
    caption: 'Lost in the rice terraces of Bali 🌾 Paradise found!',
    likes: 2876,
    comments: 198,
  },
  {
    id: '5',
    image: '/images/insta5.jpg',
    type: 'reel',
    caption: 'Ice formations in Ladakh are absolutely otherworldly ❄️',
    likes: 3654,
    comments: 267,
  },
  {
    id: '6',
    image: '/images/insta6.jpg',
    type: 'post',
    caption: 'Swiss Alps in all their glory 🏔️ Hiking heaven!',
    likes: 2987,
    comments: 203,
  },
  {
    id: '7',
    image: '/images/insta7.jpg',
    type: 'reel',
    caption: 'Northern Lights dancing in Iceland 🌌 A dream come true',
    likes: 5234,
    comments: 389,
  },
  {
    id: '8',
    image: '/images/insta8.jpg',
    type: 'post',
    caption: 'Temple hopping in Kyoto, Japan 🏯 Culture overload!',
    likes: 3421,
    comments: 245,
  },
  {
    id: '9',
    image: '/images/insta9.jpg',
    type: 'reel',
    caption: 'Amazon rainforest adventure 🌿 Wildlife at its finest',
    likes: 2765,
    comments: 176,
  },
];

export const reviews: Review[] = [
  {
    id: '1',
    author: 'Priya Sharma',
    platform: 'google',
    rating: 5,
    comment: 'Absolutely fantastic experience! The guides were knowledgeable and the itinerary was perfectly planned.',
    date: '2024-04-02',
    avatar: '/images/user1.jpg',
    trip: 'Everest Base Camp Trek',
  },
  {
    id: '2',
    author: 'Rajesh Kumar',
    platform: 'facebook',
    rating: 5,
    comment: 'Best trip of my life! Wanderphilia made everything so easy and smoothly executed.',
    date: '2024-03-28',
    avatar: '/images/user2.jpg',
    trip: 'Leh Ladakh Adventure',
  },
  {
    id: '3',
    author: 'Anita Gupta',
    platform: 'justdial',
    rating: 4,
    comment: 'Great experience overall. Well organized and professional team. Would recommend to friends.',
    date: '2024-03-25',
    avatar: '/images/user3.jpg',
    trip: 'Bali Culture & Beaches',
  },
  {
    id: '4',
    author: 'Vikram Patel',
    platform: 'google',
    rating: 5,
    comment: 'Exceeded expectations in every way. Outstanding service and unforgettable memories!',
    date: '2024-03-20',
    avatar: '/images/user4.jpg',
    trip: 'Swiss Alpine Adventure',
  },
  {
    id: '5',
    author: 'Sneha Verma',
    platform: 'facebook',
    rating: 5,
    comment: 'Amazing trip! The attention to detail and customer care was exceptional.',
    date: '2024-03-18',
    avatar: '/images/user5.jpg',
    trip: 'Iceland Northern Lights',
  },
  {
    id: '6',
    author: 'Arjun Singh',
    platform: 'justdial',
    rating: 4,
    comment: 'Very good experience. Professional guides and comfortable accommodations throughout.',
    date: '2024-03-15',
    avatar: '/images/user6.jpg',
    trip: 'Japan Cultural Journey',
  },
];

export const galleryImages: GalleryImage[] = [
  {
    id: '1',
    image: '/images/gallery1.jpg',
    title: 'Everest Summit View',
    category: 'mountains',
    alt: 'View of Mount Everest from base camp',
  },
  {
    id: '2',
    image: '/images/gallery2.jpg',
    title: 'Pangong Lake Sunrise',
    category: 'mountains',
    alt: 'Beautiful sunrise at Pangong Lake',
  },
  {
    id: '3',
    image: '/images/gallery3.jpg',
    title: 'Luxury Lake Villa',
    category: 'stays',
    alt: 'Luxury villa overlooking the lake',
  },
  {
    id: '4',
    image: '/images/gallery4.jpg',
    title: 'Mountain Resort',
    category: 'stays',
    alt: 'Cozy mountain resort at sunset',
  },
  {
    id: '5',
    image: '/images/gallery5.jpg',
    title: 'Group Trek Moments',
    category: 'trips',
    alt: 'Travel group enjoying the mountains',
  },
  {
    id: '6',
    image: '/images/gallery6.jpg',
    title: 'Adventure Activities',
    category: 'trips',
    alt: 'Rock climbing adventure activity',
  },
  {
    id: '7',
    image: '/images/gallery7.jpg',
    title: 'Alpine Meadows',
    category: 'mountains',
    alt: 'Colorful flowers in alpine meadows',
  },
  {
    id: '8',
    image: '/images/gallery8.jpg',
    title: 'Beachfront Paradise',
    category: 'stays',
    alt: 'Beachfront luxury resort',
  },
  {
    id: '9',
    image: '/images/gallery9.jpg',
    title: 'Group Celebration',
    category: 'trips',
    alt: 'Travelers celebrating at summit',
  },
];

export const videoTestimonials: VideoTestimonial[] = [
  {
    id: '1',
    title: 'My Everest Journey - Life Changing',
    thumbnail: '/images/video1.jpg',
    videoUrl: 'https://www.youtube.com/embed/dY_Lf2jXK4s',
    author: 'Sarah Johnson',
    role: 'Adventure Enthusiast',
    trip: 'Everest Base Camp Trek',
  },
  {
    id: '2',
    title: 'Bali Paradise Experience',
    thumbnail: '/images/video2.jpg',
    videoUrl: 'https://www.youtube.com/embed/dY_Lf2jXK4s',
    author: 'Michael Chen',
    role: 'Travel Vlogger',
    trip: 'Bali Culture & Beaches',
  },
  {
    id: '3',
    title: 'Swiss Alps Hiking Adventure',
    thumbnail: '/images/video3.jpg',
    videoUrl: 'https://www.youtube.com/embed/dY_Lf2jXK4s',
    author: 'Emma Williams',
    role: 'Content Creator',
    trip: 'Swiss Alpine Adventure',
  },
];
