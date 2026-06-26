export interface TripMediaItem {
  type: 'image' | 'video'
  src: string
  alt: string
  poster?: string
}

// Helper function to create heroMedia array
export function createHeroMedia(items: Array<{
  src: string
  alt: string
  type?: 'image' | 'video'
  poster?: string
}>): TripMediaItem[] {
  return items.map(item => ({
    type: item.type || 'image',
    src: item.src,
    alt: item.alt,
    poster: item.poster
  }))
}

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
  heroMedia?: TripMediaItem[]
  itinerary: {
    day: number
    title: string
    description: string | string[]
    image?: string
  }[]
  included: string[]
  notIncluded: string[]
  optionalActivities?: string[]
  importantInformation?: string[]
  paymentTerms?: string[]
  nights?: number
  overviewPoints?: string[]
  stays?: string[]
  note?: string | string[]
  paymentPolicy?: string[]
  cancellationPolicy?: string[]
  thingsToCarry?: string[]
  travelEssentials?: {
    title: string
    items: string[]
  }[]
  costingDetails?: {
    label: string
    value: string
  }[]
  batchDates?: {
    month: string
    ranges: string[]
  }[]
  dates: {
    startDate: string
    endDate: string
    spots: number
  }[]
  showGetQuoteOnly?: boolean
}

export function getLowestPriceForTrip(trip: Trip): number {
  if (!trip) return 0;
  if (!trip.costingDetails || trip.costingDetails.length === 0) {
    return trip.price || 0;
  }
  const prices = trip.costingDetails
    .map(item => {
      const match = item.value.match(/[\d,]+/);
      return match ? parseInt(match[0].replace(/,/g, ''), 10) : 0;
    })
    .filter(price => price > 0);
  return prices.length > 0 ? Math.min(...prices) : trip.price || 0;
}

export function getLowestPriceForTrips(tripsList: Trip[]): number {
  if (!tripsList || tripsList.length === 0) return 0;
  const prices = tripsList.map(getLowestPriceForTrip).filter(p => p > 0);
  return prices.length > 0 ? Math.min(...prices) : 0;
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
    title: '6 Days Leh - Leh Bike Group Trip with Nubra Valley & Pangong Lake',
    slug: 'leh-ladakh',
    image: '/images/leh-ladakh.jpg',
    destination: 'Leh Ladakh',
    region: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: 'Are you ready for an unforgettable adventure in the breathtaking landscapes of Ladakh? This Ladakh tour package takes you on an exciting 6-day journey through some of the most stunning places in the Himalayas. From the moment you land in Leh, you will experience mesmerizing views, peaceful monasteries, thrilling high-altitude passes, and crystal-clear lakes.',
    duration: 6,
    price: 15800,
    rating: 4.9,
    difficulty: 'Moderate',
    nights: 5,
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Khardung La',
      'Pangong Lake',
      'Chang La',
      'Nubra Valley',
      'Magnetic Hill',
      'Shanti Stupa',
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh',
        description: 'Take a flight from Mumbai and arrive at Leh airport after a scenic Himalayan flight. Meet our representative for transfers to the hotel, complete check-in, and rest. Spend the rest of the day at leisure and take a short walk around the hotel to acclimatize. Later, the trip captain will brief you about the journey. Overnight stay in Leh.',
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing',
        description: 'Explore Leh after breakfast with visits to Shanti Stupa, Gurudwara Pathar Sahib, Magnetic Hill, Sangam Point, and the Hall of Fame. Spend the evening exploring the local market and cafes. Return to the hotel for dinner and overnight stay in Leh.',
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung-La',
        description: 'Depart Leh for Nubra Valley via Khardung La, one of the highest motorable roads. Visit Diskit Monastery and see the 106-foot Maitreya Buddha statue. Cross the Shyok River and arrive in Nubra Valley, where you can enjoy a double-humped camel safari or ATV ride if time permits. Overnight stay in Nubra Valley.',
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake',
        description: 'Travel from Nubra Valley to Pangong Lake via the scenic Shyok route. Pass through Agam and Shyok villages before reaching the stunning blue waters of Pangong Tso. Spend time at the lake and capture photos at the famous 3 Idiots filming location. Check in to your campsite and enjoy dinner. Overnight stay near Pangong Lake.',
      },
      {
        day: 5,
        title: 'Pangong to Leh via Chang-La',
        description: 'Witness sunrise at the lake, enjoy breakfast, and return to Leh via Chang La. Pass through Karu, Thikshey, and Shey before arriving in Leh in the evening. Spend the evening shopping and cafe hopping in Leh market. Overnight stay in Leh.',
      },
      {
        day: 6,
        title: 'Departure',
        description: 'Have breakfast, pack your bags, and transfer to Leh airport for your onward journey. Take back adventurous memories to cherish for a lifetime.',
      },
    ],
    included: [
      'Stay for 5 nights – 3 nights in Leh hotel, 1 night in Nubra Valley hotel, 1 night in Pangong camp on triple/quad sharing basis',
      'Breakfast & Dinner (Breakfast except Day 1 & Dinner Day 6)',
      'Bike rent for 4 days for biking option from Day 2 to Day 5',
      'Fuel for the bike (Leh to Leh) from Day 2 to Day 5',
      'Riding gear – helmet, riding gloves, riding jacket, knee pads',
      'Mechanical backup and bike support',
      'Entire travel from Leh to Leh by tempo traveler/cab for tempo option',
      'Driver night charges, toll tax, parking charges, and permits',
      'Team captain throughout the trip',
      'Oxygen cylinder available 24x7 in the vehicle for emergencies',
      'Airport pick-up and drop in shared group taxi slots based on flight timings',
      'All inner line permits and environmental fees as applicable',
    ],
    notIncluded: [
      'GST (5%) applicable extra',
      'Any food or beverage not included in the package, including alcoholic drinks, mineral water, meals on the highway, and refreshments',
      'Personal expenses such as tips, monastery/monument entry fees, camera/video charges, camel safari, river rafting, laundry, telephone bills, and other incidentals',
      'Costs arising from natural calamities such as landslides, roadblocks, or weather-related delays',
      'Anything not specifically mentioned under inclusions',
      'Any damage to the bike except engine damage must be borne by the client',
      'INR 5,000/- security deposit for the bike',
    ],
    overviewPoints: [
      'Route: Leh → Nubra Valley → Pangong → Chang La → Leh',
      'Duration: 5 Nights / 6 Days',
      'Trip Start: Leh',
      'Bike Ride Starts From: Leh',
      'Trip End: Leh',
      'Highest Point: Khardung La (18,380 ft)',
      'Difficulty Level: Easy to Moderate',
      'Best Time to Visit: May to September',
      'Major Highlights: Khardung La, Pangong Lake, Chang La',
    ],
    stays: [
      'Leh: The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra Valley: Hideout Camps / Similar',
      'Pangong: Snow Pine Cottages',
    ],
    note: 'INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited',
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited',
    ],
    thingsToCarry: [
      'Authentic government ID card',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets, down jacket, and toiletries',
      'Sunscreen & lip balm, UV protection sunglasses',
      'Personal medicines and altitude sickness medication',
      'Power banks (no electricity at Pangong Tso)',
      'Post-paid phone numbers, since most areas have no network',
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: ['Rucksack bag and day pack', '3-litre water bladder or water bottle'],
      },
      {
        title: 'Clothes',
        items: ['Sun cap and woolen cap', 'UV protected sunglasses', 'Cotton long sleeves and 2 short sleeve t-shirts', 'Fleece jacket', 'Heavy jacket/down jacket', 'Gloves', 'At least 2 long pants', '4 sets of undergarments', '2 pairs of socks', 'Small towel', 'Rain jacket or poncho'],
      },
      {
        title: 'Footwear',
        items: ['Above-the-ankle waterproof hiking boots with good grip', 'Flip flops or sandals'],
      },
      {
        title: 'Medication',
        items: ['Diamox', 'Glucose powder', 'Headache and altitude sickness medicines', 'Diarrhea medicine', 'Dettol', 'Bandages', 'Cotton'],
      },
      {
        title: 'Personal accessories',
        items: ['Toothpaste and toothbrush', 'Paper soap or sanitizer', 'Sunscreen SPF 40+', 'Lip balm', 'Cold cream', 'Body spray', 'LED torch light'],
      },
    ],
    costingDetails: [
      { label: 'Tempo Traveller', value: 'Double Sharing & Triple Sharing' },
      { label: 'Himalayan 411cc Bike Solo', value: 'Double Sharing & Triple Sharing' },
      { label: 'Himalayan 411cc Bike Dual', value: 'Double Sharing & Triple Sharing' },
    ],
    batchDates: [
      { month: 'May', ranges: ['16th May - 21st May', '23rd May - 28th May (Eid Holiday)'] },
      { month: 'June', ranges: ['6th June - 11th June', '20th June - 25th June'] },
      { month: 'July', ranges: ['4th July - 9th July', '18th July - 23rd July'] },
      { month: 'Aug', ranges: ['1st Aug - 6th Aug', '15th Aug - 20th Aug', '29th Aug - 3rd Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 17th Sept (Ganesh Chaturthi Holiday)', '26th Sept - 1st Oct'] },
    ],
    dates: [
      { startDate: '2024-05-16', endDate: '2024-05-21', spots: 8 },
      { startDate: '2024-05-23', endDate: '2024-05-28', spots: 8 },
    ],
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
  {
    id: '12',
    title: 'Bhutan Road Trip Package',
    slug: 'bhutan-road-trip',
    image: '/images/Bhutan_cat.jpg',
    destination: 'Bhutan',
    region: 'Bhutan',
    category: 'Bhutan',
    description: 'Bhutan, nestled in the Eastern Himalayas, is a peaceful kingdom known for its stunning landscapes, rich Buddhist culture, and focus on happiness through Gross National Happiness. This 6 Nights / 7 Days journey covers Thimphu, Punakha, and Paro, featuring scenic valleys, monasteries like Tiger\'s Nest, and highlights such as Dochula Pass and Punakha Dzong—offering a perfect blend of culture, nature, and adventure. ✨',
    duration: 7,
    price: 33000,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 11,
    tripType: 'International',
    highlights: [
      'Tiger\'s Nest Monastery Hike',
      'Dochula Pass',
      'Punakha Dzong',
      'Traditional Bhutanese Hot Stone Bath',
      'River Rafting in Punakha',
      'Buddhist monasteries',
      'Scenic valleys and mountain landscapes',
      'Gross National Happiness culture'
    ],
    itinerary: [
      { day: 1, title: 'Arrival in Bagdogra', description: 'Arrival in Bagdogra. Transfer to Phuentsholing, the gateway to Bhutan.' },
      { day: 2, title: 'Travel to Thimphu', description: 'Travel to the capital city of Bhutan, Thimphu. Settle in and prepare for your journey.' },
      { day: 3, title: 'Excursion to Punakha and Dochula Pass', description: 'Excursion to Punakha. Visit the beautiful Dochula Pass with scenic mountain views and traditional chortens.' },
      { day: 4, title: 'Thimphu Local Sightseeing', description: 'Overnight stay in Thimphu. Thimphu local sightseeing including key attractions. Transfer from Thimphu to Paro.' },
      { day: 5, title: 'Paro Local Sightseeing and Tiger\'s Nest Hike', description: 'Overnight stay in Paro. Paro local sightseeing. Embark on a scenic hike to the iconic Tiger\'s Nest monastery.' },
      { day: 6, title: 'Scenic Road Journey to Pheuntsholing', description: 'Paro to Pheuntsholing. Embark on a scenic road journey enjoying the stunning Bhutanese landscapes.' },
      { day: 7, title: 'Departure', description: 'Departure. Pheuntsholing to Bagdogra Airport for your onward journey.' },
    ],
    included: [
      '6 Nights accommodation on double sharing basis',
      'Daily breakfast (except Day 1) & dinner (except Day 7)',
      'River rafting experience in Punakha',
      'Traditional Bhutanese Hot Stone Bath in Paro',
      'Comfortable 11 Seater Tata Winger for 6 days',
      'Professional English speaking Bhutanese guide',
      'Sustainable Development Fee (SDF) included',
      'All tolls, parking and driver night charges'
    ],
    notIncluded: [
      'GST (5%) applicable extra',
      'Food or beverages not in package (alcoholic drinks, mineral water, highway meals)',
      'Personal expenses (tips, camera/video charges, laundry, phone bills)',
      'Costs due to natural calamities (landslides, roadblocks)',
      'Costs from changes in tourism policy between Bhutan and India',
      'Costs from flight timing changes or delays',
      'Entry tickets to monuments or attractions',
      'Return transfer from Siliguri Hotel to Airport',
      'Self-arranged conveyance based on flight timings'
    ],
    importantInformation: [
      'Phuntsholing stay: Lakhi Hotel or Similar',
      'Thimphu stay: Hotel White Tara or Similar',
      'Paro stay: Rema Resort or Similar',
      'Siliguri stay: Hotel Cinderella or Similar'
    ],
    dates: [
      { startDate: '2026-04-25', endDate: '2026-05-01', spots: 12 },
      { startDate: '2026-05-02', endDate: '2026-05-08', spots: 14 },
      { startDate: '2026-05-16', endDate: '2026-05-22', spots: 12 },
      { startDate: '2026-05-30', endDate: '2026-06-05', spots: 15 },
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 13 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 14 },
    ]
  },
  {
    id: '13',
    title: '6 Days Leh - Leh Bike Group Trip with Nubra Valley & Pangong Lake',
    slug: 'leh-leh-bike-group-trip',
    image: '/images/LL2.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: 'Are you ready for an unforgettable adventure in the breathtaking landscapes of Ladakh? This Ladakh tour package takes you on an exciting 6-day journey through some of the most stunning places in the Himalayas. From the moment you land in Leh, you\'ll experience mesmerizing views, peaceful monasteries, thrilling high-altitude passes, and crystal-clear lakes. Your adventure starts with a day to relax and acclimate to the high altitude in Leh. Then, you\'ll explore local gems like Shanti Stupa, Magnetic Hill, and the famous Gurudwara Pathar Sahib. Next, get ready for an epic road trip to Nubra Valley via the mighty Khardung La Pass. Enjoy the beauty of Diskit Monastery, ride a double-humped camel in Hunder, and soak in the desert magic of Nubra Valley. From there, you\'ll travel to the magical Pangong Lake, where the blue waters will leave you speechless. Spend a peaceful night by the lake before heading back to Leh through the stunning Chang La. The trip ends with a final evening in Leh, where you can explore the local market and carry home memories that last a lifetime.',
    duration: 6,
    nights: 5,
    price: 0,
    rating: 4.8,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',
    overviewPoints: [
      'Route: Leh → Nubra Valley → Pangong → Chang La → Leh',
      'Duration: 5 Nights / 6 Days',
      'Trip Start: Leh',
      'Bike Ride Starts From: Leh',
      'Trip End: Leh',
      'Highest Point: Khardung La (18,380 ft)',
      'Difficulty Level: Easy to Moderate',
      'Best Time to Visit: May to September',
      'Major Highlights: Khardung La, Pangong Lake, Chang La'
    ],
    highlights: [
      'Khardung La',
      'Pangong Lake',
      'Chang La',
      'Shanti Stupa & Magnetic Hill',
      'Nubra Valley camel safari'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Take A Flight From Mumbai Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Flight from Mumbai Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'After coming back from the hotel our trip captain will provide you with a brief of the journey.',
          'Overnight stay in Leh'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'After having breakfast, get ready for local sightseeing.',
          'Our first stop will be the iconic Shanti Stupa for a mesmerizing view of Leh and its surroundings.',
          'Moving forward, we will stop at Gurudwara Pathar Sahib, a sacred place that is believed to have imprints of Sikh Guru Nanak Dev ji.',
          'Next, we will also witness the rare phenomenon at the Magnetic Hill where the natural surroundings create an optical illusion that makes it look like vehicles are rolling uphill.',
          'Further, we will stop at the Sangam Point where the Zanskar and Indus rivers confluence.',
          'Next, we can explore the Hall of Fame, which honors the Indian soldiers who died in the wars and battles fought in Ladakh.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'After a day of exploration and adventure, we will return to our hotel.',
          'Enjoy a delicious dinner, and then get some well-deserved rest.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La (130 kms Approx 5-6 Hrs Drive) - one of the highest motorable roads.',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get ready for the exciting journey on one of the highest motorable roads.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at a height of 5359 meters.',
          'Next, we will stop at the Diskit Monastery, the biggest monastery of Nubra Valley which is famous as the home of 106 feet of Maitreya Buddha statue.',
          'Further, we will pass over from Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'If time permits, you can also take part in some adventure like a double-humped Bactrian camel safari or an ATV ride on the deserted land of Hunder Sand dunes.',
          'We will then check into the hotel rooms and have a hearty dinner.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Nubra to Pangong Via Shyok ( 180 kms 5-6 hrs ) Explore colour-changing Lake.',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While driving, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 5,
        title: 'Transfers from Pangong to Leh via Chang-La at an altitude of 5360 meters ( 140 kms 5-6 hrs )',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise from your camp.',
          'We will then enjoy a delicious breakfast near the lake, before making our way back to Leh.',
          'En route, we will stop at Chang-La, one of the highest motorable roads in the world at a staggering altitude of 5360 meters.',
          'Further, we will pass the popular towns of Karu, Thikshey and Shey until we reach Leh.',
          'Reach Leh by evening and check-in at the hotel.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, and try local delicacies.',
          'After a day of exploration and adventure, we will return to our hotel.',
          'Enjoy a delicious dinner, and then get some rest in your comfortable bed.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of adventurous memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 5 nights – 3 nights in a hotel at Leh, 1 night in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 6)',
      'Bike Rent for 4 days (For Biking Option) from Day 2 to Day 5.',
      'Fuel for the bike(Leh to Leh) from day 2 to day 5',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. ( Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Change to- Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    importantInformation: [
      'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
      'Stays: Leh: The Kaal Hotel / Hotel Zanang / Similar, Nubra: Hideout Camps / Similar, Pangong: Snow Pine Cottages.',
      'Authentic Government ID Card',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any) & few medicines for altitude sickness (a must)',
      'Power Banks (No Electricity at Pangong Tso)',
      'Only post-paid numbers will work in Leh City & apart from that most of the area is no network zone.',
      'Travel Essentials: a rucksack bag and a day pack, 3-litre water bladder or water bottle, Clothes: a sun cap and a woolen cap, One cotton long sleeves and 2 short sleeve t-shirt, 1 fleece jacket, 1 heavy Thick jacket/down jacket, 1 pair of gloves, At least 2 long pants (trek pants and cargo pants are favourable), 4 sets of undergarments, 2 pair of socks, a small towel, A rain jacket or a poncho, Footwear: Above-the-ankle waterproof and breathable hiking boots with good grip, Flip flops/sandals',
      'Medication: One strip of Diamox, Glucose powder, Medicines for headaches, diarrhoea, motion and altitude sickness, Dettol, Bandages, Cotton',
      'Personal accessories: toothpaste, toothbrush, Paper soap, or sanitizer, Sunscreen minimum of spf40 , lip balm, cold creams, Body spray, LED torch light'
    ],
    paymentTerms: [
      'Short-Haul Packages: At booking: 25% booking advance is non-refundable, Within 45 days: Minimum 50% deduction, Within 30 days: Minimum 75% deduction, 20 days or less: 100% forfeited'
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    stays: [
      'Leh: The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra: Hideout Camps / Similar',
      'Pangong: Snow Pine Cottages'
    ],
    batchDates: [
      {
        month: 'May',
        ranges: ['16 May - 21 May', '23 May - 28 May']
      },
      {
        month: 'June',
        ranges: ['6 June - 11 June', '20 June - 25 June']
      },
      {
        month: 'July',
        ranges: ['4 July - 9 July', '18 July - 23 July']
      },
      {
        month: 'August',
        ranges: ['1 Aug - 6 Aug', '15 Aug - 20 Aug', '29 Aug - 3 Sept']
      },
      {
        month: 'September',
        ranges: ['12 Sept - 17 Sept', '26 Sept - 1 Oct']
      }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹24,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹21,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹26,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹23,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹30,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹27,499' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-21', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-28', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-11', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-25', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-09', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-23', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-06', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-20', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-03', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-17', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-01', spots: 10 }
    ]
  },
  {
    id: '14',
    title: '7 Days Leh - Leh Group Trip with Turtuk',
    slug: '7-days-leh-leh-group-trip-with-turtuk',
    image: '/images/LL1.PNG',
    destination: 'Leh Ladakh',
    region: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: 'Embark on a 7-day Leh - Leh group trip with Turtuk that begins and ends in Leh. This incredible bike journey starts with acclimatization and local sightseeing in Leh before heading over Khardung La to Nubra Valley, exploring the remote village of Turtuk, and continuing to the crystal-clear waters of Pangong Lake. The trip returns to Leh via Chang-La, offering breathtaking high-altitude scenery and unforgettable memories.',
    duration: 7,
    nights: 6,
    price: 15800,
    rating: 4.8,
    difficulty: 'Moderate',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Turtuk',
      'Pangong Lake',
      'Magnetic Hill',
      'Shanti Stupa'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          "Rise and shine! It's time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.",
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          "As the day comes to an end, you come back to the Nubra Valley in your hotel room.",
          "Enjoy a delicious dinner, and sleep peacefully, knowing that you've experienced a truly unforgettable day.",
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso Via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours]',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 6,
        title: 'Transfers from Pangong to Leh via Chang-La at an altitude of 5360 meters ( 140 kms 5-6 hrs )',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise from your camp.',
          'We will then enjoy a delicious breakfast near the lake, before making our way back to Leh.',
          'En route, we will stop at Chang-La, one of the highest motorable roads in the world at a staggering altitude of 5360 meters.',
          'Further, we will pass the popular towns of Karu, Thikshey and Shey until we reach Leh.',
          'Reach Leh by evening and check-in at the hotel.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, and try local delicacies.',
          'After a day of exploration and adventure, we will return to our hotel.',
          'Enjoy a delicious dinner, and then get some rest in your comfortable bed.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of adventurous memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.'
        ]
      }
    ],

    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹25,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹22,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹27,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹24,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹35,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹32,499' }
    ],
    overviewPoints: [
      'Route: Leh → Khardung La → Nubra Valley → Turtuk → Pangong → Leh',
      'Duration: 6 Nights / 7 Days',
      'Trip Start: Leh',
      'Bike Ride Starts From: Leh',
      'Trip End: Leh',
      'Highest Point: Khardung La (18,380 ft)',
      'Difficulty Level: Easy to Moderate',
      'Best Time to Visit: May to September',
      'Major Highlights: Khardung La, Nubra Valley, Turtuk, Pangong Lake'
    ],
    stays: [
      'Leh: The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra Valley: Hideout Camps / Similar',
      'Pangong: Snow Pine Cottages / Similar'
    ],
    paymentTerms: [
      'Short-Haul Packages: At booking: 25% booking advance is non-refundable, Within 45 days: Minimum 50% deduction, Within 30 days: Minimum 75% deduction, 20 days or less: 100% forfeited'
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    batchDates: [
      { month: 'May', ranges: ['16th May - 22nd May', '23rd May - 29th May (Eid Holiday)'] },
      { month: 'June', ranges: ['6th June - 12th June', '20th June - 26th June'] },
      { month: 'July', ranges: ['4th July - 10th July', '18th July - 24th July'] },
      { month: 'Aug', ranges: ['1st Aug - 7th Aug', '15th Aug - 21st Aug', '29th Aug - 4th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 18th Sept (Ganesh Chaturthi Holiday)', '26th Sept - 2nd Oct'] }
    ],
    included: [
      'Stay for 6 nights – 3 nights in a hotel at Leh, 2 nights in a hotel at Nubra Valley, 1 night in camps at Pangong Tso on a triple/quad sharing basis.',
      'Breakfast & Dinner (Breakfast except for Day 1 & Dinner Day 7)',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for 5 days (For Biking Option).',
      'Fuel for the bike (Leh to Leh)',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-22', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-29', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-02', spots: 10 }
    ]
  },
  {
    id: '15',
    title: '7 Days Leh - Leh Bike Group Trip with Nubra Valley Pangong Lake & Hanle',
    slug: 'leh-leh-bike-group-trip-hanle',
    image: '/images/LL3.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: "Are you ready for an unforgettable adventure in the breathtaking landscapes of Ladakh? This Ladakh tour package takes you on an exciting 7-day journey through some of the most stunning places in the Himalayas. From the moment you land in Leh, you'll experience mesmerizing views, peaceful monasteries, thrilling high-altitude passes, and crystal-clear lakes. Your adventure starts with a day to relax and acclimate to the high altitude in Leh. Then, you'll explore local gems like Shanti Stupa, Magnetic Hill, and the famous Gurudwara Pathar Sahib. Next, get ready for an epic road trip to Nubra Valley via the mighty Khardung La Pass. Enjoy the beauty of Diskit Monastery, ride a double-humped camel in Hunder. From Nubra, you’ll travel to the magical Pangong Lake, where the blue waters will leave you speechless. From Pangong Lake to travel to Hanle Spend a peaceful night by the lake. Located deep in the remote Changthang region, Hanle is where Ladakh feels untouched.No crowds. No noise. Just vast open landscapes and a sky filled with millions of stars.Home to one of the world’s highest observatories, Hanle offers a stargazing experience that feels almost unreal — a moment where you truly disconnect from everything. Heading back to Leh through the stunning Chang-La. Your trip ends with a final evening in Leh, where you can explore the local market and soak in the last moments of this incredible journey. As you fly back home, you’ll carry a heart full of memories and the spirit of Ladakh with you. Are you ready to explore this paradise?",
    duration: 7,
    nights: 6,
    price: 0,
    rating: 4.8,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',

    overviewPoints: [
      'Route: Leh → Nubra Valley → Pangong → Hanle → Demchok → Leh',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Khardung La (18,380 ft).',
      'Difficulty Level: Easy to Moderate .',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Pangong Lake, Hanle.'
    ],

    highlights: [
      'Khardung La',
      'Pangong Lake',
      'Hanle',
      'Shanti Stupa & Magnetic Hill',
      'Nubra Valley camel safari'
    ],

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'After coming back from the hotel our trip captain will provide you with a brief of the journey.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'After having breakfast, get ready for local sightseeing.',
          'Our first stop will be the iconic Shanti Stupa for a mesmerizing view of Leh and its surroundings.',
          'Moving forward, we will stop at Gurudwara Pathar Sahib, a sacred place that is believed to have imprints of Sikh Guru Nanak Dev ji.',
          'Next, we will also witness the rare phenomenon at the Magnetic Hill where the natural surroundings create an optical illusion that makes it look like vehicles are rolling uphill.',
          'Further, we will stop at the Sangam Point where the Zanskar and Indus rivers confluence.',
          'Next, we can explore the Hall of Fame, which honors the Indian soldiers who died in the wars and battles fought in Ladakh.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'After a day of exploration and adventure, we will return to our hotel.',
          'Enjoy a delicious dinner, and then get some well-deserved rest.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La (130 kms Approx 5-6 Hrs Drive) - one of the highest motorable roads.',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get ready for the exciting journey on one of the highest motorable roads.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at a height of 5359 meters.',
          'Next, we will stop at the Diskit Monastery, the biggest monastery of Nubra Valley which is famous as the home of 106 feet of Maitreya Buddha statue.',
          'Further, we will pass over from Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'If time permits, you can also take part in some adventure like a double-humped Bactrian camel safari or an ATV ride on the deserted land of Hunder Sand dunes.',
          'We will then check into the hotel rooms and have a hearty dinner.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Nubra to Pangong Via Shyok ( 180 kms 5-6 hrs ) Explore colour-changing Lake.',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While driving, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 5,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Leh via Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of adventurous memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],

    included: [
      'Stay for 6 nights – 3 nights in a hotel at Leh, 1 night in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 1 Night in Hanle Homestay on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 7 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  5 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh)',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Change to- Environmental fees as applicable.'
    ],

    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],

    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar'
    ],

    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-22', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-29', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-02', spots: 10 }
    ],
    paymentTerms: [
      'Short-Haul Packages: At booking: 25% booking advance is non-refundable, Within 45 days: Minimum 50% deduction, Within 30 days: Minimum 75% deduction, 20 days or less: 100% forfeited'
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹25,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹22,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹27,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹24,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹35,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹32,499' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],

    batchDates: [
      { month: 'May', ranges: ['16nd May - 22th May', '23rd May - 29th May ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 12th June', '20th June - 26th June'] },
      { month: 'July', ranges: ['4th July - 10th July', '18th July - 24th July'] },
      { month: 'Aug', ranges: ['1st Aug - 7th Aug', '15th Aug - 21st Aug', '29th Aug - 4th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 18th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 2nd Oct'] }
    ]
  },
  {
    id: '16',
    title: '8 Days Leh - Leh Bike Group Trip with Hanle , Umingla & Tso Moriri ( Excursion )',
    slug: 'leh-leh-bike-group-trip-hanle-umlingla-tso-moriri',
    image: '/images/LL4.PNG',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `

This 7 Nights - 8 Days Leh to Leh Umling La adventure is one of the most exciting ways to explore Ladakh’s famous high roads, valleys and wide open skies.
Starting and ending in Leh, you will ride through Sham Valley, cross Khardung La - one of the highest motorable passes in the world and reach the beautiful Nubra Valley with its cold desert and sand dunes.
The trip takes you next to the stunning Pangong Tso Lake, where the water changes colour as the sun moves across the sky.
After Pangong, you continue towards Hanle, a quiet village surrounded by mountains and clear night skies.
Then comes the most exciting part - a full-day ride to Umling La, the highest motorable pass on Earth with huge views that feel like the world is right under your feet.
Feel the adrenaline as you pass the iconic Rezang La War Memorial and camp under the starry skies at Hanle, home to India’s highest space observatory.
But the crown jewel? Reaching Umling-La — the world’s highest motorable pass at 5640 meters!
Throughout these 7 days, you will travel on thrilling roads, stay in simple and comfortable places, share stories around a bonfire, and see landscapes that change from green valleys to rocky mountains and blue lakes.
This tour gives you the real feel of Ladakh’s nature and open roads, without extra frills - just great routes, great views and great memories.`,
    duration: 8,
    nights: 7,
    price: 0,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',
    overviewPoints: [
      'Route: Leh → Sham Valley → Khardung la → Nubra Valley →  Pangong → Hanle  → Umingla → Demchok  →   Leh',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Umlingla La (19,024 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Nubra Valley, Pangong Lake, Hanle, Umingla, Tso Moriri.'
    ],
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Tso Moriri',
      'Shanti Stupa',
      'Magnetic Hill',
      'Rezang La War Memorial'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          'Rise and shine! It\'s time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.',
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 5,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 6,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Leh via Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 8,
        title: 'Departure. Take back a lot of adventurous memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 7 nights – 3 nights in a hotel at Leh, 1 night in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 2 Night in Hanle Homestay on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 8 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  6 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh)',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Change to- Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar'
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-23', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-30', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-13', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-27', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-11', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-25', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-08', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-22', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-05', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-19', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-03', spots: 10 }
    ],
    paymentTerms: [
      'Short-Haul Packages: At booking: 25% booking advance is non-refundable, Within 45 days: Minimum 50% deduction, Within 30 days: Minimum 75% deduction, 20 days or less: 100% forfeited'
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹27,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹24,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹29,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹26,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹41,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹38,499' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    batchDates: [
      { month: 'May', ranges: ['16nd May - 23th May', '23rd May - 30th May ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 13th June', '20th June - 27th June'] },
      { month: 'July', ranges: ['4th July - 11th July', '18th July - 25th July'] },
      { month: 'Aug', ranges: ['1st Aug - 8th Aug', '15th Aug - 22st Aug', '29th Aug - 5th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 19th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 3rd Oct'] }
    ]
  },
  {
    id: '17',
    title: '8 Days Leh - Leh Bike Group Trip with Turtuk & Tso Moriri',
    slug: 'leh-leh-bike-group-trip-turtuk-tso-moriri',
    image: '/images/LL5.PNG',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `The Leh bike tour package is an incredible journey that takes you through the breathtaking landscapes of Ladakh.
Starting in Leh, you’ll spend your first day acclimatizing to the high altitude and relaxing at your hotel.
The next day is perfect for exploring Leh’s local attractions, like Shanti Stupa, the Hall of Fame, and the bustling Leh market.
The adventure begins as you ride to Nubra Valley via Khardung La, one of the world’s highest motorable passes.
You’ll visit the scenic Nubra Valley and even take a trip to the unique Turtuk Village, famous for its apricots, walnuts, and stunning views.
From Nubra, the journey continues to the mesmerizing Pangong Lake, known for its crystal-clear waters and serene beauty.
After enjoying the lake, you’ll ride to Tso Moriri, another stunning high-altitude lake, surrounded by mountains and raw wilderness.
The final leg of the journey takes you back to Leh through awe-inspiring routes like the Gata Loops, Moore Plains, and Tanglang-La.
Each day is filled with adventure, scenic beauty, and unforgettable memories.
As the trip concludes, you’ll fly back home with a heart full of happiness and stories to tell from this amazing biking adventure in Ladakh.`,
    duration: 8,
    nights: 7,
    price: 0,
    rating: 4.8,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',
    overviewPoints: [
      'Route: Leh → Khardung La →  Nubra Valley → Turtuk →  Pangong → Tso Moriri → Leh',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Khardung La (18,380 ft).',
      'Difficulty Level: Easy to Moderate .',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Nubra Valley , Turtuk , Pangong Lake, Tso Moriri.'
    ],
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Turtuk',
      'Pangong Lake',
      'Tso Moriri',
      'Shanti Stupa',
      'Magnetic Hill',
      'Hall of Fame',
      'Gata Loops'
    ],
    itinerary: [
      {
        day: 18,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          'Rise and shine! It\'s time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.',
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          'As the day comes to an end, you come back to the Nubra Valley in your hotel room.',
          'Enjoy a delicious dinner, and sleep peacefully, knowing that you\'ve experienced a truly unforgettable day.',
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso Via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours]',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Tso Moriri via Kaksang La, Kyagar Tso & Yaya Tso. [Distance: 175km, Duration: 8-9 Hours]',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'We will then enjoy a delicious breakfast at the campsite near the lake, before making our way to Tso Moriri.',
          'On the way, we will first cross Chusul which is one of the major towns in the area.',
          'After we will conquer the numerous hairpin bends to reach Mirpal Tso.',
          'Once we cross these bends, we will reach Mirpal Tso - a scenic high-altitude lake.',
          'Next, it\'s time to conquer the Kaksang La, a challenging pass at an altitude of 17851 feet surrounded by rugged terrain.',
          'Further, we will pass Yaya Tso, and Kyagar Tso.',
          'We will then reach the magnificent Tso Moriri - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'Upon reaching, check-in to your stay and get some well-deserved rest.',
          'Overnight stay near Tso Moriri.'
        ]
      },
      {
        day: 7,
        title: 'Tso Moriri to Leh via Puga Valley and Chumathang [Distance: 154 km, Duration: 7-8 Hours]',
        description: [
          'Wake up to a pleasant morning in Tso Moriri and have your breakfast.',
          'Later, we will get ready to board our transfers to Leh.',
          'We will visit Puga Valley to experience its extensive geothermal activity, including natural hot springs, sulphur deposits, and bubbling mud pools.',
          'On the way to Leh, we will stop in Chumathang to witness the unique sulphur hot-springs.',
          'Continue the road journey and pass some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 8,
        title: 'Fly Back To Home. Depart with a lot of happy memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 7 nights – 3 nights in a hotel at Leh, 2 nights in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 1 Night in Tso Moriri on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 8 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  6 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh)',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Change to- Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',

    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Tso Moriri : Lake View Stay / Similar'
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-23', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-30', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-13', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-27', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-11', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-25', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-08', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-22', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-05', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-19', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-03', spots: 10 }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹27,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹24,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹29,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹26,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹41,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹38,499' }
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    batchDates: [
      { month: 'May', ranges: ['16nd May - 23th May', '23rd May - 30th May ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 13th June', '20th June - 27th June'] },
      { month: 'July', ranges: ['4th July - 11th July', '18th July - 25th July'] },
      { month: 'Aug', ranges: ['1st Aug - 8th Aug', '15th Aug - 22st Aug', '29th Aug - 5th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 19th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 3rd Oct'] }
    ]
  },
  {
    id: '18',
    title: '9 Days Leh - Leh Bike Group Trip with Hanle , Umling La  & Tso Moriri.',
    slug: 'leh-leh-bike-group-trip-hanle-umling-la-tso-moriri',
    image: '/images/LL6.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `This 8 Nights - 9 Days Leh to Leh Umling La adventure is one of the most exciting ways to explore Ladakh's famous high roads, valleys and wide open skies. Starting and ending in Leh, you will ride through Sham Valley, cross Khardung La - one of the highest motorable passes in the world and reach the beautiful Nubra Valley with its cold desert and sand dunes.
The trip takes you next to the stunning Pangong Tso Lake, where the water changes colour as the sun moves across the sky. After Pangong, you continue towards Hanle, a quiet village surrounded by mountains and clear night skies. Then comes the most exciting part - a full-day ride to Umling La, the highest motorable pass on Earth with huge views that feel like the world is right under your feet. Feel the adrenaline as you pass the iconic Rezang La War Memorial and camp under the starry skies at Hanle, home to India's highest space observatory. But the crown jewel? Reaching Umling-La — the world's highest motorable pass at 5640 meters! 
Throughout these 7 days, you will travel on thrilling roads, stay in simple and comfortable places, share stories around a bonfire, and see landscapes that change from green valleys to rocky mountains and blue lakes. This tour gives you the real feel of Ladakh's nature and open roads, without extra frills - just great routes, great views and great memories.`,

    duration: 9,
    nights: 8,
    price: 0,
    rating: 4.9,
    difficulty: 'Hard',
    groupSize: 12,
    tripType: 'India',
    overviewPoints: [
      'Route: Leh → Sham Valley → Khardung la → Nubra Valley →  Pangong → Hanle  → Umingla → Demchok  → Tso Moriri -  Leh',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Umling La (19,038 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Nubra Valley , Pangong Lake, Hanle , Uming la , Tso Moriri.'
    ],
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Tso Moriri',
      'Rezang La War Memorial',
      'Demchok',
      'Shanti Stupa',
      'Magnetic Hill',
      'Hall of Fame'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          'Rise and shine! It\'s time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.',
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 5,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 6,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Overnight Stay in Tso Moriri.'
        ]
      },
      {
        day: 8,
        title: 'Tso Moriri to Leh via Puga Valley and Chumathang [Distance: 154 km, Duration: 7-8 Hours]',
        description: [
          'Wake up to a pleasant morning in Tso Moriri and have your breakfast.',
          'Later, we will get ready to board our transfers to Leh.',
          'We will visit Puga Valley to experience its extensive geothermal activity, including natural hot springs, sulphur deposits, and bubbling mud pools.',
          'On the way to Leh, we will stop in Chumathang to witness the unique sulphur hot-springs.',
          'Continue the road journey and pass some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 9,
        title: 'Fly Back To Home. Depart with a lot of happy memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 8 nights – 3 nights in a hotel at Leh, 1 nights in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 2 Nights in Hanle Homestay , 1 Night in Tso Moriri on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 9 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  7 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh)',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Change to- Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar.',
      'Tso Moriri : Lake View Stay / Similar.'
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-24', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-31', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-14', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-28', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-12', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-26', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-09', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-23', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-06', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-20', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-04', spots: 10 }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹29,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹26,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹30,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹28,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹44,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹41,499' }
    ],
    batchDates: [
      { month: 'May', ranges: ['16nd May - 24th May', '23rd May - 31st May ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 14th June', '20th June - 28th June'] },
      { month: 'July', ranges: ['4th July - 12th July', '18th July - 26th July'] },
      { month: 'Aug', ranges: ['1st Aug - 9th Aug', '15th Aug - 23rd Aug', '29th Aug - 6th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 20th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 4th Oct'] }
    ]
  },
  {
    id: '19',
    title: '12 Days Delhi - Leh - Delhi Group Trip with Hanle , Turtuk , Umling La  & Tso Moriri.',
    slug: 'delhi-leh-delhi-group-trip-hanle-turtuk-umling-la-tso-moriri',
    image: '/images/LL7.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',

    description: `Get ready for the ultimate adventure with this Ladakh Bike Trip or Leh Ladakh Road Trip, where you will ride through some of the highest motorable roads in the world! Whether you choose to conquer the rugged terrains on a bike or travel in a comfortable vehicle, this journey will take you through breathtaking landscapes, high mountain passes, and serene valleys.

Starting from the lush green hills of Manali, you will travel through the legendary Atal Tunnel, crossing into the remote and stunning lands of Lahaul Valley. Witness the beauty of Sarchu, Pangong Lake, Nubra Valley, and Tso Moriri, each offering unique landscapes, from cold deserts to crystal-clear lakes. Ride through the famous Khardung La, one of the highest motorable roads in the world, and reach the ultimate challenge—Umling La (5,640m), the highest motorable road on Earth!

Along the way, experience thrilling river crossings, witness Buddhist monasteries, spot rare Himalayan wildlife, and relax in traditional homestays. You can even ride camels in the sand dunes of Hunder and camp under the starry skies of Pangong.

This journey is not just about the road—it's about the adventure, the stories, and the unforgettable memories that come with it. If you crave excitement, this Leh Ladakh Trip Package is the experience of a lifetime!`,

    duration: 12,
    nights: 11,
    price: 38000,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',

    overviewPoints: [
      'Route: Delhi → Manali → Sarchu - Leh → Nubra Valley → Pangong Tso → Hanle → Umingla → Demchok → Tso Moriri - Leh - Jispa - Manali - Delhi',
      'Duration: 11 Nights / 12 Days.',
      'Trip Start: Delhi',
      'Bike Ride Starts From: Manali',
      'Trip End: Delhi',
      'Highest Point: Umling La (19,038 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Manali , Sarchu , Khardung La , Leh , Nubra Valley , Pangong Lake, Hanle , Uming la , Demchok , Tso Moriri , Jispa.'
    ],

    highlights: [
      'Manali',
      'Sarchu',
      'Khardung La',
      'Leh',
      'Nubra Valley',
      'Turtuk',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Tso Moriri',
      'Jispa'
    ],

    itinerary: [
      {
        day: 0,
        title: 'Departure From Delhi/Chandigarh to Manali. Overnight Journey to Manali.',
        description: [
          'Arrive at Delhi airport or railway station.',
          'Head to the pick-up point to board your transfers to Manali.',
          'Overnight journey to Manali.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali: Self-Exploration of Manali',
        description: [
          'Reach Manali - the “Valley of Gods” in the morning and head to your hotel.',
          'Check-in to your cozy hotel rooms and recharge yourself for the adventurous trip.',
          'You can then rest for some time and have a delicious breakfast at your hotel.',
          'As soon as you finish your breakfast, gear up for a fun-filled day exploring Manali\'s charming attractions on your own.',
          'You can start your sightseeing by visiting the famous Hidimba Temple, dedicated to the wife of Bheem.',
          'Next, you can take a short hike to the Jogni Waterfall - one of the most beautiful spots in Manali.',
          'Further, you can relax in the natural hot springs of Vashisht Temple which is dedicated to sage Vashisht, teacher of Lord Ram.',
          'After exploring various attractions, you can shop and eat around the famous Mall Road.',
          'Head back to your hotel, once you are done for the day.',
          'End your day with a briefing of the upcoming itinerary, and get ready to sleep in your comfortable hotel bed.',
          'Overnight stay in Manali.'
        ]
      },

      {
        day: 2,
        title: 'Manali To Sarchu Via Atal Tunnel [Distance: 175km, Duration: 7-8 Hours]',
        description: [
          'Wake up and get ready for an exciting journey from Manali in shared transfers to explore the majestic snow-capped peaks of the western Himalayas.',
          'Today, we will cover around 175 km on the Leh-Manali Highway, which will give you a glimpse of breathtaking scenery.',
          'While riding on the highway, we will enter the Atal Tunnel to reach Lahaul Valley.',
          'In the Lahaul Valley, get mesmerized by the stunning Chandra River and the towering peaks that surround it.',
          'Continue the journey to Keylong, the district headquarters of Lahaul & Spiti.',
          'We will continue our journey through Darcha, Patsio, and Zingzing Bar along the way.',
          'Later, we will spend some time admiring the stunning Suraj Tal Lake which is the source of the Bhaga River.',
          'We will then make a quick stop at Baralacha-La at an altitude of 4,892 meters before we continue our journey.',
          'Resume your journey to reach the Sarchu to spend your night in your camp along with a delicious dinner.',
          'Overnight stay in Sarchu.'
        ]
      },
      {
        day: 3,
        title: 'Journey from Sarchu to Leh via Moore Plains [Distance: 260 Kms, Duration: 7-8 Hours]',
        description: [
          'Wake up and get ready in your camps for an adventurous journey from Sarchu to Leh after a fulfilling breakfast.',
          'Collect your bike and get ready to begin the journey to Leh.',
          'On this journey, we will experience the thrill of conquering the famous Gata Loops that feature 21 hairpin bends at an elevation of 4669m.',
          'Next, we cross Nakee-La which is at an altitude of 4738 m.',
          'Following this you will cross Lachung-La at an altitude of 5065 m, surrounded by the beautiful landscape.',
          'We will then make a quick stop for lunch at Pang.',
          'Continue the journey through the Moore Plains, a straight and flattened road stretching over 50 km.',
          'Here, we can spot tiny colonies of Marmots and the wild herds of Kyung-Yak.',
          'As we cross the highest motorable road on the Leh-Manali Highway, Tanglang-La (5328m), our journey will take us through Upshi and Karu.',
          'After crossing these places we will reach your final destination - Leh.',
          'Upon reaching, we will check in to your hotel for relaxation and a delicious dinner.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 4,
        title: 'Leh To Nubra Valley Via Khardung La. [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up to a pleasant morning in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Before that, we will stop at the iconic Shanti Stupa for a mesmerizing view of Leh and its surroundings.',
          'Continue the journey further to the iconic Khardung-La - one of the world’s highest motorable pass in the world at a height of 5359 meters.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          'As the day comes to an end, you come back to the Nubra Valley in your hotel room.',
          'Enjoy a delicious dinner, and sleep peacefully, knowing that you\'ve experienced a truly unforgettable day.',
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 6,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 7,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 8,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 10,
        title: 'Leh to Jispa via Tanglang La | Moore Plains | Sarchu [Distance: 260km, Duration: 8-9 Hours]',
        description: [
          'After having your breakfast in the morning at Leh, get ready for the day.',
          'Board your transfers and prepare yourself for an adventurous journey to Jispa.',
          'On this journey, we will pass some major high-altitude passes like the Tanglang-La (5328m), followed by Lachung-La (5065 m) and Nakee-La (4738 m).',
          'On the way, soak in the stunning landscape at the famous Moore Plains, a straight and flattened road stretching over 50 km.',
          'Before reaching Sarchu, we will also pass the treacherous Gata Loops that feature 21 hairpin bends at an elevation of 4669m.',
          'On the way, we will take a quick stop at the iconic Baralacha La located at an altitude of 4850m.',
          'Then, we will pass the scenic Suraj Taal and Deepak Taal Lakes.',
          'Further, we will pass the picturesque towns of Darcha.',
          'Overnight stay in Jispa.'
        ]
      },
      {
        day: 11,
        title: 'Jispa To Manali Via Atal Tunnel. [Distance: 135 kms, Duration: 4-5 Hours]',
        description: [
          'Post breakfast in the morning, get ready for the day.',
          'Today, we will board our transfers to Manali via Atal Tunnel.',
          'Further, we will pass the picturesque towns of Keylong and Sissu until we reach the Atal Tunnel.',
          'After crossing the Atal Tunnel, pass through the Solang Valley - a hub for adventure activities to reach Manali.',
          'Upon reaching Manali, head to the Manali bus stop to board your bus to Delhi.',
          'Overnight bus journey to Delhi.'
        ]
      },
      {
        day: 12,
        title: 'Reach Delhi by Morning. Take back a lot of adventurous memories.',
        description: [
          'After an overnight journey, reach Delhi in the morning.',
          'Your amazing Ladakh trip concludes, leaving you with a lot of adventurous memories.'
        ]
      }
    ],

    included: [
      'Volvo transfer from Delhi to Manali & back.',
      'Bike Rent for Sarchu to Sarchu (For Biking Option).',
      'Fuel for the bike as per the itinerary.',
      'Entire travel from Manali to Manali by tempo traveler/cab (For Tempo Traveler Option)',
      'Stay for 10 nights – 1 night in a hotel at Manali, 2 night in camps at Sarchu, 2 night in a hotel at Leh, 2 night in a hotel at Nubra Valley, 1 night in cottages at Pangong Tso, & 2 Nights in Hanle in Cottage/Homestay on triple sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 2 & Dinner Day 11 )',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Elbow Guards, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Team Captain throughout the trip.',
      'Mechanical Backup. Daily bike check up.',
      'Spare wheels will be carried in case of puncture so that you don\'t have to wait.',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Medical Kit & An Oxygen Cylinder 24X7 in the car in case of emergency.'
    ],

    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],

    stays: [
      'Manali : Hotel Conifer / Similar',
      'Sarchu : Deluxe Camp Stay',
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar',
      'Hanle : Aurora Cabins / Similar'
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹36,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹33,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹38,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹35,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹49,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹46,499' }
    ],

    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-27', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-17', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-15', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-12', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-23', spots: 10 }
    ],

    batchDates: [
      { month: 'May', ranges: ['16 May - 27 May', '23 May - 3 June'] },
      { month: 'June', ranges: ['6 June - 17 June', '20 June - 1 July'] },
      { month: 'July', ranges: ['4 July - 15 July', '18 July - 29 July'] },
      { month: 'Aug', ranges: ['1 Aug - 12 Aug', '15 Aug - 26 Aug', '29 Aug - 9 Sept'] },
      { month: 'Sept', ranges: ['12 Sept - 23 Sept', '26 Sept - 7 Oct'] }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',

  },
  {
    id: '20',
    title: '12 Days Delhi - Leh - Srinagar Group Trip with Turtuk, Hanle, Umling La & Tso Moriri.',
    slug: 'delhi-leh-srinagar-group-trip-turtuk-hanle-umling-la-tso-moriri',
    image: '/images/LL10.PNG',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `This value-edition trip in the Himalayas is where you don’t just see Ladakh, you experience its highest roads and most untouched lakes. On this 11-day journey you will travel from Srinagar to Leh, deep into Hanle, all the way to Umling La - one of the highest motorable roads in the world, and to the stunning blue waters of Tso Moriri, before ending in Manali.


The trip begins in the green valleys of Srinagar and slowly climbs into the dramatic landscapes of Ladakh. You cross high mountain passes, drive through wide cold deserts, and witness changing colours of Pangong Lake. In Leh, you explore monasteries and local markets. In Hanle, you experience peaceful villages and clear night skies filled with stars.


The real highlight is the drive to Umling La, where the air feels thin and the views feel endless. Standing there is a moment you will never forget. Tso Moriri adds another magical touch, with its calm waters surrounded by mountains and very few crowds.


Long scenic drives, simple mountain stays, and raw landscapes make this journey special. If you are looking for a complete Ladakh trip package that covers Srinagar, Leh, Umling La, Tso Moriri, and Manali in one route, this adventure gives you the full Himalayan experience in its purest form.
`,

    duration: 12,
    nights: 11,
    price: 38000,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',

    overviewPoints: [
      'Route: Srinagar - Kargil - Leh - Khardung-La - Nubra - Pangong - Hanle - Umling-La - Demchok - Tso Moriri - Leh - Sarchu - Manali - Delhi.',
      'Duration: 11 Nights / 12 Days.',
      'Trip Start: Srinagar',
      'Bike Ride Starts From: Srinagar',
      'Trip End: Delhi',
      'Highest Point: Umling La (19,038 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Manali , Sarchu , Khardung La , Leh , Nubra Valley , Pangong Lake, Hanle , Uming la , Demchok , Tso Moriri , Kargil , Srinagar.'
    ],

    highlights: [
      'Manali',
      'Sarchu',
      'Khardung La',
      'Leh',
      'Nubra Valley',
      // 'Turtuk',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Demchok',
      'Tso Moriri',
      'Jispa',
      'Srinagar'
    ],
    itinerary: [
      {
        day: 0,
        title: 'Departure From Delhi/Chandigarh to Manali. Overnight Journey to Manali.',
        description: [
          'Arrive at Delhi airport or railway station.',
          'Head to the pick-up point to board your transfers to Manali.',
          'Overnight journey to Manali.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali: Self-Exploration of Manali',
        description: [
          'Reach Manali - the "Valley of Gods" in the morning and head to your hotel.',
          'Check-in to your cozy hotel rooms and recharge yourself for the adventurous trip.',
          'You can then rest for some time and have a delicious breakfast at your hotel.',
          'As soon as you finish your breakfast, gear up for a fun-filled day exploring Manali\'s charming attractions on your own.',
          'You can start your sightseeing by visiting the famous Hidimba Temple, dedicated to the wife of Bheem.',
          'Next, you can take a short hike to the Jogni Waterfall - one of the most beautiful spots in Manali.',
          'Further, you can relax in the natural hot springs of Vashisht Temple which is dedicated to sage Vashisht, teacher of Lord Ram.',
          'After exploring various attractions, you can shop and eat around the famous Mall Road.',
          'Head back to your hotel, once you are done for the day.',
          'End your day with a briefing of the upcoming itinerary, and get ready to sleep in your comfortable hotel bed.',
          'Overnight stay in Manali.'
        ]
      },
      {
        day: 2,
        title: 'Manali To Sarchu Via Atal Tunnel [Distance: 175km, Duration: 7-8 Hours]',
        description: [
          'Wake up and get ready for an exciting journey from Manali in shared transfers to explore the majestic snow-capped peaks of the western Himalayas.',
          'Today, we will cover around 175 km on the Leh-Manali Highway, which will give you a glimpse of breathtaking scenery.',
          'While riding on the highway, we will enter the Atal Tunnel to reach Lahaul Valley.',
          'In the Lahaul Valley, get mesmerized by the stunning Chandra River and the towering peaks that surround it.',
          'Continue the journey to Keylong, the district headquarters of Lahaul & Spiti.',
          'We will continue our journey through Darcha, Patsio, and Zingzing Bar along the way.',
          'Later, we will spend some time admiring the stunning Suraj Tal Lake which is the source of the Bhaga River.',
          'We will then make a quick stop at Baralacha-La at an altitude of 4,892 meters before we continue our journey.',
          'Resume your journey to reach the Sarchu to spend your night in your camp along with a delicious dinner.',
          'Overnight stay in Sarchu.'
        ]
      },
      {
        day: 3,
        title: 'Journey from Sarchu to Leh via Moore Plains [Distance: 260 Kms, Duration: 7-8 Hours]',
        description: [
          'Wake up and get ready in your camps for an adventurous journey from Sarchu to Leh after a fulfilling breakfast.',
          'Collect your bike and get ready to begin the journey to Leh.',
          'On this journey, we will experience the thrill of conquering the famous Gata Loops that feature 21 hairpin bends at an elevation of 4669m.',
          'Next, we cross Nakee-La which is at an altitude of 4738 m.',
          'Following this you will cross Lachung-La at an altitude of 5065 m, surrounded by the beautiful landscape.',
          'We will then make a quick stop for lunch at Pang.',
          'Continue the journey through the Moore Plains, a straight and flattened road stretching over 50 km.',
          'Here, we can spot tiny colonies of Marmots and the wild herds of Kyung-Yak.',
          'As we cross the highest motorable road on the Leh-Manali Highway, Tanglang-La (5328m), our journey will take us through Upshi and Karu.',
          'After crossing these places we will reach your final destination - Leh.',
          'Upon reaching, we will check in to your hotel for relaxation and a delicious dinner.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 4,
        title: 'Leh To Nubra Valley Via Khardung La. [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up to a pleasant morning in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Before that, we will stop at the iconic Shanti Stupa for a mesmerizing view of Leh and its surroundings.',
          'Continue the journey further to the iconic Khardung-La - one of the world\'s highest motorable pass in the world at a height of 5359 meters.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          'As the day comes to an end, you come back to the Nubra Valley in your hotel room.',
          'Enjoy a delicious dinner, and sleep peacefully, knowing that you\'ve experienced a truly unforgettable day.',
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 6,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 7,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 8,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 10,
        title: 'Leh To Kargil Via Namika La & Fotu La. [Distance: 230km, Duration: 7-8 Hours]',
        description: [
          'Wake up to a pleasant morning in Leh and have your breakfast at the hotel.',
          'Get ready for another exciting day as we depart for the scenic town of Kargil.',
          'As you ride towards Kargil, we will stop at the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'Furthermore, we will visit the Gurudwara Pathar Sahib, dedicated to Guru Nanak Dev Ji, and houses a sacred boulder with his imprints.',
          'Next, we will also witness the rare phenomenon at the Magnetic Hill where the natural surroundings create an optical illusion that makes it look like vehicles are rolling uphill.',
          'Next, we will stop at the Sangam point where the Zanskar and Indus rivers meet to flow together.',
          'After this, we will stop at Lamayuru village - famous for its moonlike landscape.',
          'Continue the ride from Lamayuru to Kargil via Namika La [3700m], Fotu La [4108m] and Mulbek.',
          'Reach Kargil by evening, check in to your hotel and relax after a day of travel and adventure.',
          'Enjoy a delicious dinner and then settle in for the night.',
          'Overnight stay in Kargil.'
        ]
      },
      {
        day: 11,
        title: 'Kargil To Srinagar Via Sonamarg, Drass & Zojila. [Distance: 200km, Duration: 8-9 Hours]',
        description: [
          'Get out of bed in Kargil\'s hotel room and have a hearty breakfast before we start our journey toward the charming city of Srinagar.',
          'As we ride towards Srinagar, get ready to be awed by the stunning natural beauty of the region.',
          'We will first stop at the famous Drass village, often referred to as the Gateway to Ladakh and also known as the coldest inhabited place in India.',
          'Next, it\'s time to conquer the Zoji La, one of the most challenging and breathtaking mountain passes in India.',
          'Further, we will cross the rugged landscape to reach Sonmarg, a scenic meadow which was part of the ancient Silk Road.',
          'Finally, as you reach Srinagar by evening, it\'s time to relax and check in to your hotel.',
          'Enjoy the delicious dinner and call it a day.',
          'Overnight stay at Srinagar.'
        ]
      },
      {
        day: 12,
        title: 'Fly Back To Home. Depart with a lot of happy memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Srinagar.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Bike Trip concludes as you head to the Srinagar airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Volvo transfer from Delhi to Manali.',
      'Bike Rent for Sarchu to Srinagar (For Biking Option).',
      'Fuel for the bike as per the itinerary.',
      'Entire travel from Manali to Srinagar by tempo traveler/cab (For Tempo Traveler Option)',
      'Stay for 11 nights – 1 night in a hotel at Manali, 1 night in camps at Sarchu, 2 night in a hotel at Leh, 2 night in a hotel at Nubra Valley, 1 night in cottages at Pangong Tso, & 2 Nights in Hanle in Cottage/Homestay , 1 Night Hotel in Kargil , 1 Night Hotel in Srinagar on triple sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 2 & Dinner Day 12 )',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Elbow Guards, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Team Captain throughout the trip.',
      'Mechanical Backup. Daily bike check up.',
      'Spare wheels will be carried in case of puncture so that you don\'t have to wait.',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Medical Kit & An Oxygen Cylinder 24X7 in the car in case of emergency.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Manali : Hotel Conifer / Similar',
      'Sarchu : Deluxe Camp Stay',
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar.',
      'Kargil : Hotel Kargil Heights / Similar',
      'Srinagar : New Mamta / Similar'
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-27', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-06-04', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-18', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-07-02', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-16', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-30', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-13', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-27', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-10', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-24', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-08', spots: 10 }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹37,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹34,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹39,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹36,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹51,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹48,499' }
    ],
    batchDates: [
      { month: 'May', ranges: ['16th May - 27th May', '23rd May - 4th June ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 18th June', '20th June - 2nd July'] },
      { month: 'July', ranges: ['4th July - 16th July', '18th July - 30th July'] },
      { month: 'Aug', ranges: ['1st Aug - 13th Aug', '15th Aug - 27th Aug', '29th Aug - 10th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 24th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 8th Oct'] }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
  },
  {
    id: '21',
    title: '12 Days Srinagar - Leh - Delhi Group Trip with Hanle, Umling La & Tso Moriri.',
    slug: 'srinagar-leh-delhi-group-trip-hanle-umling-la-tso-moriri',
    image: '/images/LL11.PNG',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `

This value-edition trip in the Himalayas is where you don't just see Ladakh, you experience its highest roads and most untouched lakes. On this 11-day journey you will travel from Srinagar to Leh, deep into Hanle, all the way to Umling La - one of the highest motorable roads in the world, and to the stunning blue waters of Tso Moriri, before ending in Manali.

The trip begins in the green valleys of Srinagar and slowly climbs into the dramatic landscapes of Ladakh. You cross high mountain passes, drive through wide cold deserts, and witness changing colours of Pangong Lake. In Leh, you explore monasteries and local markets. In Hanle, you experience peaceful villages and clear night skies filled with stars.

The real highlight is the drive to Umling La, where the air feels thin and the views feel endless. Standing there is a moment you will never forget. Tso Moriri adds another magical touch, with its calm waters surrounded by mountains and very few crowds.

Long scenic drives, simple mountain stays, and raw landscapes make this journey special. If you are looking for a complete Ladakh trip package that covers Srinagar, Leh, Umling La, Tso Moriri, and Manali in one route, this adventure gives you the full Himalayan experience in its purest form.`,
    duration: 12,
    nights: 11,
    price: 0,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'India',
    highlights: [
      'Srinagar',
      'Kargil',
      'Khardung La',
      'Leh',
      'Nubra Valley',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Demchok',
      'Tso Moriri',
      'Sarchu',
      'Manali'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Srinagar. Day at Leisure in Srinagar.',
        description: [
          'Reach Srinagar - the summer capital of Jammu and Kashmir and head to your stay.',
          'Reach your Hotel and complete the check-in formalities.',
          'You can then explore the Srinagar Market on your own and return to your stay.',
          'You will then attend a short briefing session with the Team Captain for the next day.',
          'Overnight stay at Srinagar.'
        ]
      },
      {
        day: 2,
        title: 'Srinagar To Kargil Via Sonamarg, Drass & Zojila. [Distance: 200km, Duration: 8-9 Hours].',
        description: [
          'Wake up to a pleasant morning in Srinagar and have your breakfast at the hotel.',
          'Get ready for an exciting day as we depart for the scenic town of Kargil.',
          'As we start our journey, we will cross the beautiful meadows of Sonmarg, which was part of the ancient Silk Road.',
          'Next, it\'s time to conquer the Zoji La, one of the most challenging and breathtaking mountain passes in India at an altitude of 3528m.',
          'As the journey comes to an end, we will cross Drass village, often referred to as the Gateway to Ladakh and also known as the coldest inhabited place in India.',
          'Continue the journey to Kargil and check in to the hotel upon reaching.',
          'Have a delicious dinner and rest for the day.',
          'Overnight stay in Kargil.'
        ]
      },
      {
        day: 3,
        title: 'Kargil To Leh. En route explore some major landmarks. [Distance: 230km, Duration: 7-8 Hours].',
        description: [
          'Wake up to a chilly morning in Kargil and have your breakfast at the hotel.',
          'Later, get ready and hit the roads, as we will ride to Leh today.',
          'Today, we will pass 2 high altitude passes - Namika La [3700m] and Fotu La [4108m].',
          'On the way, we will also pass through the picturesque town of Lamayuru - known for its moon-like landscape.',
          'We will then take quick stops at Sangam Point to witness the confluence of Indus and Zanskar rivers.',
          'Our next stop is at the Magnetic Hill, known for creating an optical illusion.',
          'Later, stop at the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji, and houses a sacred boulder with his imprints.',
          'We will then reach our hotel in Leh, complete the check-in formalities and call it a day.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 4,
        title: 'Leh To Nubra Valley Via Khardung La. [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up to a pleasant morning in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Before that, we will stop at the iconic Shanti Stupa for a mesmerizing view of Leh and its surroundings.',
          'Continue the journey further to the iconic Khardung-La - one of the world\'s highest motorable pass in the world at a height of 5359 meters.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 6,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 7,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Leh via Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 9,
        title: 'Leh to Jispa via Tanglang La | Moore Plains | Sarchu [Distance: 260km, Duration: 8-9 Hours]',
        description: [
          'After having your breakfast in the morning at Leh, get ready for the day.',
          'Board your transfers and prepare yourself for an adventurous journey to Jispa.',
          'On this journey, we will pass some major high-altitude passes like the Tanglang-La (5328m), followed by Lachung-La (5065 m) and Nakee-La (4738 m).',
          'On the way, soak in the stunning landscape at the famous Moore Plains, a straight and flattened road stretching over 50 km.',
          'Before reaching Sarchu, we will also pass the treacherous Gata Loops that feature 21 hairpin bends at an elevation of 4669m.',
          'On the way, we will take a quick stop at the iconic Baralacha La located at an altitude of 4850m.',
          'Then, we will pass the scenic Suraj Taal and Deepak Taal Lakes.',
          'Further, we will pass the picturesque towns of Darcha.',
          'Overnight stay in Jispa.'
        ]
      },
      {
        day: 10,
        title: 'Sarchu To Manali Via Atal Tunnel. [Distance: 135 kms, Duration: 4-5 Hours]',
        description: [
          'Post breakfast in the morning, get ready for the day.',
          'Today, we will board our transfers to Manali via Atal Tunnel.',
          'On the way, we will take a quick stop at the iconic Baralacha La located at an altitude of 4850m.',
          'Then, we will pass the scenic Suraj Taal and Deepak Taal Lakes.',
          'Further, we will pass the picturesque towns of Darcha, Jispa, Keylong and Sissu until we reach the Atal Tunnel.',
          'After crossing the Atal Tunnel, pass through the Solang Valley - a hub for adventure activities to reach Manali.',
          'Upon reaching Manali, check in to your hotel and spend the evening at leisure.',
          'You can either rest in your room or head out to explore the Mall road where you can shop, eat or take a stroll.',
          'Overnight stay in Manali.'
        ]
      },
      {
        day: 11,
        title: 'Self-Exploration of Manali. Evening Depart to Delhi.',
        description: [
          'Wake up to a leisurely morning in Manali and have your breakfast at the hotel.',
          'You can then spend the day at leisure exploring Manali\'s charming attractions on your own.',
          'You can start your sightseeing by visiting the famous Hidimba Temple, dedicated to the wife of Bheem.',
          'Further, you can relax in the natural hot springs of Vashisht Temple which is dedicated to sage Vashisht, teacher of Lord Ram.',
          'After exploring various attractions, you can shop and eat around the famous Mall Road.',
          'By evening, reach the Manali bus stop to board your bus to Delhi.',
          'Overnight bus journey to Delhi.'
        ]
      },
      {
        day: 12,
        title: 'Reach Delhi by Morning. Take back a lot of adventurous memories.',
        description: [
          'After an overnight journey, reach Delhi in the morning.',
          'Your amazing Ladakh trip concludes, leaving you with a lot of adventurous memories.'
        ]
      }
    ],
    included: [
      'Volvo transfer from Manali to Delhi.',
      'Bike Rent for Srinagar- Sarchu (For Biking Option).',
      'Fuel for the bike as per the itinerary.',
      'Entire travel from Srinagar to Manali by tempo traveler/cab (For Tempo Traveler Option)',
      'Stay for 10 nights – 1 night in a hotel at Manali, 1 night in camps at Sarchu, 2 night in a hotel at Leh, 1 night in a hotel at Nubra Valley, 1 night in cottages at Pangong Tso, & 2 Nights in Hanle in Cottage/Homestay , 1 Night Stay Kargil , 1 Night Hotel in Srinagar on triple sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 2 & Dinner Day 11 )',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Elbow Guards, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Team Captain throughout the trip.',
      'Mechanical Backup. Daily bike check up.',
      'Spare wheels will be carried in case of puncture so that you don\'t have to wait.',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Medical Kit & An Oxygen Cylinder 24X7 in the car in case of emergency.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Manali : Hotel Conifer / Similar',
      'Sarchu : Deluxe Camp Stay',
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar.',
      'Kargil : Hotel Kargil Heights / Similar.',
      'Srinagar : New Mamta / Similar.'
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹36,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹33,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹38,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹35,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹50,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹47,499' }
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-27', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-06-03', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-17', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-07-01', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-15', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-29', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-12', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-26', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-09', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-23', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-07', spots: 10 }
    ],
    batchDates: [
      { month: 'May', ranges: ['16th May - 27th May', '23rd May - 3rd June ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 17th June', '20th June - 1st July'] },
      { month: 'July', ranges: ['4th July - 15th July', '18th July - 29th July'] },
      { month: 'Aug', ranges: ['1st Aug - 12th Aug', '15th Aug - 26th Aug', '29th Aug - 9th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 23rd Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 7th Oct'] }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.',
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
  },
  {
    id: '22',
    title: '7 Days Perfect Winter Spiti Valley Group Trip Super Saver Budget.',
    slug: '7-days-perfect-winter-spiti-valley-group-trip-super-saver-budget',
    image: '/images/spiti1.JPG',
    destination: 'Spiti Valley',
    category: 'Spiti',
    description: `



Spiti Valley, literally meaning the land between the magnificent India & majestical Tibet. This place is the epitome of magic. From beautiful landscape to a rich culture heritage- there is nothing you cannot find here! Seperated from Lahaul Valley by the soaring Kunzum La at 4551m, Spiti valley is a must visit destination in the months of October, November & December.

Moonscapes to Marvel Scattered villages, Spiti valley will surely make you forget about any other panorama you’ve ever seen.

The whitewashed mud-brick homes along with the perched Key Monastery looks exceptionally out of the world!

Rediscovering vintage Spiti is the place to revive love for the long lost things. This could be sending a postcard from the highest post office in the World, or go fossil hunting in the villages of Hikkim and Langza respectively. Langza welcomes you with a life size golden statue of Buddha. The sedimentary rocks of this village hide remains of plants & marine life which are millions of years old. Go see for yourself if you’re lucky enough to spot one!

Contrary to all shades of grey and white, a turquoise ribbon of the Spiti River will meet you as your near-constant companion, running along a broad valley before turning south at Sumdo into the precipitous gorges of the Hangrang Valley. Adding a cherry on top of the cake- we witness the beautiful landscape of Kinnaur, explore the quaint villages of Chitkul & Kalpa before continuing the journey to Spiti.

The approaches to Spiti remain among the most rugged and scenically spectacular roads in India, and that is why we want you to book our Spiti Valley Packages for 2025 and take that epic road trip with us, that too in the winters! With a group of like minded travellers, exploring a place like Spiti becomes even more fun. It’s never a journey instead a voyage that we take at Wanderphilia!

`,

    duration: 7,
    nights: 6,
    price: 0,
    rating: 0,
    difficulty: 'Moderate',
    groupSize: 0,
    tripType: 'India',
    overviewPoints: [
      'Route: Delhi → Shimla  → Sangla → Chitkul  → Kalpa → Nako  → Tabo  → Dhankar Monastery  → Kaza  → Kalpa → Delhi',
      'Duration: 6 Nights / 7 Days',
      'Trip Start: Delhi',
      'Trip End: Delhi',
      'Difficulty Level: Easy to Moderate',
      'Best Time to Visit: Oct to May',
      'Major Highlights: Chitkul , Nako , Hikkim , Komic , Langza , Key Monastery , Chicham Bridge'
    ],


    note: [
      'Travellers residing outside Delhi are suggested to book trains/flights reaching Delhi not later than 4 PM on the trip start date. Similarly, on trip end date, book returning flight/trains leaving post 12 PM.',

      'Numerous factors such as weather, road conditions, the physical ability of participants etc. may cause itinerary change. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing.',

      "The age limit of our group departures is 16 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.",

      "Dear traveller's In the event of extreme winter conditions, where snow may prevent the use of tempo travellers, we will opt for 4x4 vehicles to ensure safety and accessibility. Please note that any additional costs incurred for the 4x4 vehicle will be borne by the clients. Winter Spiti is known for snowfall, which may lead to route closures. Please be prepared for such adventures, as we will take the best possible alternatives in those situations to ensure a smooth journey."
    ],

    highlights: [
      'Chitkul',
      'Nako',
      'Hikkim',
      'Komic',
      'Langza',
      'Key Monastery',
      'Chicham Bridge'
    ],

    itinerary: [
      {
        day: 0,
        title: 'Departure from Delhi To Shimla at Evening. Overnight journey by Volvo.',
        description: [
          'Leave from Delhi by evening and reach Shimla the next morning.'
        ]
      },
      {
        day: 1,
        title: 'Reach Shimla- Drive To The Last Indian Village - Chitkul / Sangla [Distance: Approx 220km, Duration: 9-10 Hours]',
        description: [
          'Breakfast and freshen up.',
          'Drive through Kufri, Narkanda along the Indo-Tibetan highway on the way to Sangla',
          'Enter the Kinnaur valley by crossing Kinnaur Gate ( The rock tunnel is famously called as the Gateway of Kinnaur, situated around 170 kms from Shimla on the Shimla - Kaza road, also known as the Hindustan - Tibet road. )',
          'Reach Chitkul / Sangla by evening.',
          'Dinner and Overnight sleep.'
        ]
      },
      {
        day: 2,
        title: 'Transfer From Chitkul / Sangla To Kalpa. Overnight Stay At Kalpa. [ Distance: Approx 70km, Duration: 3-4 Hours ]',
        description: [
          'Wake up early morning and after check out visit Chitkul ( depending upon weather & other scenarios related to safety)',
          'Make a visit to the famous Cliff Point of Kalpa at Roghi village( ( depending upon weather & other scenarios related to safety)',
          'Then Explore Kinnaur district biggest market - Peo Market, reach Kalpa by evening and relax.',
          'Check-in to the hotel in Kalpa. Dinner & sleep overnight.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Kalpa to Tabo via Nako [Distance: 168km, Duration: 7-8 Hours]. Overnight stay at Tabo',
        description: [
          'Wake up early morning & after breakfast start your journey to Spiti Valley.',
          'Cross the Ka loops to reach Nako & have your lunch in Nako.',
          'Enter Spiti valley through Sumdo Border.',
          'Reach Tabo by evening & Visit the Oldest Monastery in Spiti Valley i.e. Tabo Monastery.',
          'Check-in to the homestay.: Dinner & sleep overnight.'
        ]
      },
      {
        day: 4,
        title: 'Visit Dhankar Monastery , Key Monastery , Chicham Bridge. Overnight Stay At Kaza. [Distance: Approx 125km, Duration: 6-7 Hours]',
        description: [
          'After Breakfast , first head towards Dhankar village and cover Dhankar Monastery which offers a spectacular view of confluence of Spiti and Pin river.',
          'Visit the most scenic monastery of Spiti Valley - The Key Monastery',
          'Further drive to the highest suspension bridge in Asia - The Chicham Bridge',
          'Come back to Kaza by evening.',
          'Dinner and sleep overnight.'
        ]
      },
      {
        day: 5,
        title: 'Visit Hikkim, Komik & Langza - Overnight Stay At Kaza. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Wake up early morning and after having the breakfast, head for Spiti Valley divine sightseeing.',
          'Visit the iconic villages of Spiti - Hikkim (location of the World\'s Highest Post Office) & Langza (the site for the holy Buddha Statue)',
          'Visit Komik (the highest village in the world connected through a motorable road)',
          'Come back to Kaza by evening. Dinner and sleep overnight.'
        ]
      },
      {
        day: 6,
        title: 'Departure To Kalpa. Overnight Stay At Kalpa. [Distance: 215 km, Duration: 7-8 Hours]',
        description: [
          'Wake up early morning and after breakfast check-out of the hotel.',
          'Depart for the Kalpa. Reach Kalpa by Night',
          'Check-in to the hotel and relax.',
          'Dinner & overnight in a hotel at Kalpa.'
        ]
      },
      {
        day: 7,
        title: 'Depart to Shimla. [Distance: 210km, Duration: 8-9 Hours] Overnight Volvo transfer to Delhi.',
        description: [
          'Wake up early morning and after breakfast depart for Shimla.',
          'Reach Shimla by evening.',
          'Depart for Delhi.'
        ]
      },
      {
        day: 8,
        title: 'Reach Delhi by morning.',
        description: [
          'Reach Delhi morning around 09:00 AM'
        ]
      }
    ],

    included: [
      'Volvo transfer from Delhi to Shimla & back.',
      '6 nights – 1 Night at Sangla ,2 Nights at Kalpa, 1 Night at Tabo, 2 Nights in Homestays at Kaza.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 7 )',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      '1 bonfire is included.'
    ],

    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.'
    ],

    stays: [
      'Sangla : Hotel Kamru / Similar',
      'Kalpa : Wanderers Homestay / Similar',
      'Tabo : Aema Inn / Similar.',
      'Kaza : Dragon Mud House / Similar'
    ],

    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-22', spots: 0 },
      { startDate: '2026-05-23', endDate: '2026-05-29', spots: 0 },
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 0 }
    ],

    batchDates: [
      { month: 'May', ranges: ['16nd May - 22th May', '23rd May - 29th May ( Eid Holiday )'] },
      { month: 'June', ranges: ['6th June - 12th June'] }
    ],

    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹21,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹19,499' },
    ],
  },
  {
    id: '23',
    title: '8 Days Exclusive Summer Spiti Valley with Chandratal Group Road Trip.',
    slug: '8-days-exclusive-summer-spiti-valley-with-chandratal-group-road-trip',
    image: '/images/spiti2.JPG',
    destination: 'Spiti Valley',
    category: 'Spiti',
    description: `



Spiti Valley is a high altitude desert whose beauty unveils after a tough and tricky ride through the most challenging roads of Himalayas. If you feel the need for adrenaline, you got your share of dose right throughout your trip to Spiti.

As you leave behind the chaos of cities, Spiti Valley will happily embrace you into a zone of peace and love. Soak in the holy vibes at Key Monastery, which is an important place of pilgrimage for the Buddhist population residing in Spiti. Explore the long lost stories in the fossils of Langza Village and witness the grandeur of the golden statue of Buddha. Ride upto the highest post office in the world at Hikkim and send a postcard to your loved ones and also to yourself! In short, just forget about the metropolis life for a few days and spend some time in a natural retreat at this high altitude desert! 

`,
    duration: 8,
    nights: 7,
    price: 0,
    rating: 0,
    difficulty: 'Moderate',
    groupSize: 0,
    tripType: 'India',
    overviewPoints: [
      'Route: Delhi → Shimla  → Sangla → Chitkul  → Kalpa → Nako  → Tabo  → Dhankar Monastery  → Kaza  →Channdratal → Manali → Delhi. ',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Delhi',
      'Trip End: Delhi',
      'Difficulty Level: Easy to Moderate ',
      'Best Time to Visit: June to Oct',
      'Major Highlights: Chitkul , Nako , Hikkim , Komic , Langza , Key Monastery , Chicham Bridge'
    ],
    highlights: [
      'Chitkul',
      'Nako',
      'Hikkim',
      'Komic',
      'Langza',
      'Key Monastery',
      'Chicham Bridge'
    ], costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹23,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹21,499' },
    ],

    itinerary: [
      {
        day: 0,
        title: 'Departure from Delhi to Shimla by evening. Overnight journey by Volvo.',
        description: [
          'Leave from Delhi by night and reach Shimla next morning.'
        ]
      },
      {
        day: 1,
        title: 'Reach Shimla- Transfer To Chitkul. Overnight Stay At Chitkul / Sangla [Distance: Approx 220km, Duration: 9-10 Hours]',
        description: [
          'Pitstop for Breakfast at Narkanda.',
          'Begin the journey to Chitkul, the last Indian village towards China border.',
          'Experience the journey through magnificent landscapes of Kinnaur valley along the banks of Satluj River.',
          'Reach Chitkul / Sangla by evening, check-in to the hotel, dinner and sleep overnight.'
        ]
      },
      {
        day: 2,
        title: 'Explore Chitkul - Transfer to Kalpa. Overnight stay at Kalpa. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Wake up early morning to experience one of the most beautiful sunrises.',
          'Explore the local village of Chitkul. Depart for Kalpa by Noon.',
          'Reach Kalpa by evening, check-in to the hotel, dinner and sleep overnight.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Kalpa to Tabo via Nako [Distance: 168km, Duration: 7-8 Hours]. Overnight stay at Tabo',
        description: [
          'Wake up early morning & after breakfast start your journey to Spiti Valley.',
          'Cross the Ka loops to reach Nako & have your lunch in Nako.',
          'Enter Spiti valley through Sumdo Border.',
          'Reach Tabo by evening & Visit the Oldest Monastery in Spiti Valley i.e. Tabo Monastery.',
          'Check-in to the homestay.: Dinner & sleep overnight.'
        ]
      },
      {
        day: 4,
        title: 'Visit Dhankar Monastery , Key Monastery , Chicham Bridge. Overnight Stay At Kaza. [Distance: Approx 125km, Duration: 6-7 Hours]',
        description: [
          'After Breakfast , first head towards Dhankar village and cover Dhankar Monastery which offers a spectacular view of confluence of Spiti and Pin river.',
          'Visit the most scenic monastery of Spiti Valley - The Key Monastery',
          'Further drive to the highest suspension bridge in Asia - The Chicham Bridge',
          'Come back to Kaza by evening.',
          'Dinner and sleep overnight.'
        ]
      },
      {
        day: 5,
        title: 'Visit Hikkim, Komik & Langza - Overnight Stay At Kaza. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Wake up early morning and after having the breakfast, head for Spiti Valley divine sightseeing.',
          'Visit the iconic villages of Spiti - Hikkim (location of the World\'s Highest Post Office) & Langza (the site for the holy Buddha Statue)',
          'Visit Komik (the highest village in the world connected through a motorable road)',
          'Come back to Kaza by evening. Dinner and sleep overnight.'
        ]
      },
      {
        day: 6,
        title: 'Depart for Chandra Taal - Overnight stay at Chandra Taal. [Distance: Approx 95 km, Duration: 5-6 Hours]',
        description: [
          'Wake up early morning and after having breakfast check-out of the campsite.',
          'Depart for Chandra Taal lake.',
          'On the way , take a pit stop for snacks at Losar, the last village of Spiti Valley.',
          'Reach Chandra Taal by evening & check-in to the camps.',
          'Dinner and stay in tents under the gaze of a million stars and the Milky Way Galaxy.'
        ]
      },
      {
        day: 7,
        title: 'Depart for Manali - Old Manali café crawl - Overnight stay at Manali. [Distance: Approx 95 km, Duration: 5-6 Hours]',
        description: [
          'Wake up early morning & after breakfast depart for Manali.',
          'Reach Manali by evening',
          'Check-in to the hotel.',
          'Old Manali café crawl.',
          'Dinner and Sleep Overnight.'
        ]
      },
      {
        day: 8,
        title: 'Self-Explore Manali - Departure To Delhi.',
        description: [
          'Wake up early morning & enjoy the beautiful sunrise.',
          'Manali self-exploration. Places to visit- Hadimba Devi Temple, Old Manali street, Mall Road.',
          'Depart for Delhi by evening.'
        ]
      },
      {
        day: 9,
        title: 'Reach Delhi by morning. [ Distance: 510 km, Duration: 10 - 11 Hours ]',
        description: [
          'Reach Delhi by morning with amazing trip memories.'
        ]
      }
    ],

    included: [
      'Volvo transfer from Delhi to Shimla & back.',
      '7 nights – 1 Night at Sangla ,1 Nights at Kalpa, 1 Night at Tabo, 2 Nights in Homestays at Kaza , 1 Night Chandratal Lake , 1 Night Manali on triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 8 )',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      '1 bonfire is included.'
    ],

    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.'
    ],

    stays: [
      'Sangla : Hotel Kamru / Similar',
      'Kalpa : Wanderers Homestay / Similar',
      'Tabo : Aema Inn / Similar.',
      'Kaza : Dragon Mud House / Similar',
      'Chandratal : Saryu’s Camps / Similar',
      'Manali : Hotel Conifer / Similar.'
    ],

    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-15', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-29', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-13', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-27', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-10', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-24', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-07', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-21', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 0 }
    ],

    batchDates: [
      { month: 'June', ranges: ['6th June - 15th June', '20th June - 29th June'] },
      { month: 'July', ranges: ['4th July - 13th July', '18th July - 27th July'] },
      { month: 'Aug', ranges: ['1st Aug - 10th Aug', '15th Aug - 24th  Aug', '29th Aug - 7th Sept'] },
      { month: 'Sept', ranges: ['12th Sept - 21st Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 5th Oct'] }
    ]
  },
  {
    id: '24',
    title: '7 Days Summer Spiti Valley with Chandratal Group Road Trip Super Saver Budget',
    slug: '7-days-summer-spiti-valley-with-chandratal-group-road-trip-super-saver-budget',
    image: '/images/spiti9.JPG',
    destination: 'Spiti Valley',
    category: 'Spiti',
    tripType: 'India',
    duration: 7,
    price: 0,
    rating: 4.7,
    difficulty: 'Moderate',
    groupSize: 12,
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-15', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-29', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-13', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-27', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-10', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-24', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-07', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-21', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 0 }
    ],

    overviewPoints: [
      "Route: Delhi → Shimla  → Sangla → Chitkul  → Kalpa → Nako  → Tabo  → Dhankar Monastery  → Kaza  →Channdratal → Manali → Delhi.",
      "Duration: 6 Nights / 7 Days.",
      "Trip Start: Delhi",
      "Trip End: Delhi",
      "Difficulty Level: Easy to Moderate .",
      "Best Time to Visit: June to September."
    ],

    highlights: [
      "Chitkul",
      "Nako",
      "Hikkim",
      "Komic",
      "Langza",
      "Key Monastery",
      "Chicham Bridge"
    ],

    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹21,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹19,499' },
    ],

    description: `Spiti Valley is a high altitude desert whose beauty unveils after a tough and tricky ride through the most challenging roads of Himalayas. If you feel the need for adrenaline, you got your share of dose right throughout your trip to Spiti.

As you leave behind the chaos of cities, Spiti Valley will happily embrace you into a zone of peace and love. Soak in the holy vibes at Key Monastery, which is an important place of pilgrimage for the Buddhist population residing in Spiti. Explore the long lost stories in the fossils of Langza Village and witness the grandeur of the golden statue of Buddha. Ride upto the highest post office in the world at Hikkim and send a postcard to your loved ones and also to yourself! In short, just forget about the metropolis life for a few days and spend some time in a natural retreat at this high altitude desert!`,

    itinerary: [
      {
        day: 0,
        title: "Departure from Delhi to Shimla by evening. Overnight journey by Volvo.",
        description: [
          "Leave from Delhi by night and reach Shimla next morning."
        ]
      },
      {
        day: 1,
        title: "Reach Shimla- Transfer To Chitkul. Overnight Stay At Chitkul / Sangla [Distance: Approx 220km, Duration: 9-10 Hours]",
        description: [
          "Pitstop for Breakfast at Narkanda.",
          "Begin the journey to Chitkul, the last Indian village towards China border.",
          "Experience the journey through magnificent landscapes of Kinnaur valley along the banks of Satluj River.",
          "Reach Chitkul / Sangla by evening, check-in to the hotel, dinner and sleep overnight."
        ]
      },
      {
        day: 2,
        title: "Explore Chitkul - Transfer to Kalpa. Overnight stay at Kalpa. [Distance: Approx 80km, Duration: 6-7 Hours]",
        description: [
          "Wake up early morning to experience one of the most beautiful sunrises.",
          "Explore the local village of Chitkul. Depart for Kalpa by Noon.",
          "Reach Kalpa by evening, check-in to the hotel, dinner and sleep overnight."
        ]
      },
      {
        day: 3,
        title: "Transfer from Kalpa to Tabo via Nako [Distance: 168km, Duration: 7-8 Hours]. Overnight stay at Tabo",
        description: [
          "Wake up early morning & after breakfast start your journey to Spiti Valley.",
          "Cross the Ka loops to reach Nako & have your lunch in Nako.",
          "Enter Spiti valley through Sumdo Border.",
          "Reach Tabo by evening & Visit the Oldest Monastery in Spiti Valley i.e. Tabo Monastery.",
          "Check-in to the homestay.: Dinner & sleep overnight."
        ]
      },
      {
        day: 4,
        title: "Visit Dhankar Monastery , Key Monastery , Chicham Bridge. Overnight Stay At Kaza. [Distance: Approx 125km, Duration: 6-7 Hours]",
        description: [
          "After Breakfast , first head towards Dhankar village and cover Dhankar Monastery which offers a spectacular view of confluence of Spiti and Pin river.",
          "Visit the most scenic monastery of Spiti Valley - The Key Monastery",
          "Further drive to the highest suspension bridge in Asia - The Chicham Bridge",
          "Come back to Kaza by evening.",
          "Dinner and sleep overnight."
        ]
      },
      {
        day: 5,
        title: "Visit Hikkim, Komik & Langza - Overnight Stay At Kaza. [Distance: Approx 80km, Duration: 6-7 Hours]",
        description: [
          "Wake up early morning and after having the breakfast, head for Spiti Valley divine sightseeing.",
          "Visit the iconic villages of Spiti - Hikkim (location of the World's Highest Post Office) & Langza (the site for the holy Buddha Statue)",
          "Visit Komik (the highest village in the world connected through a motorable road)",
          "Come back to Kaza by evening. Dinner and sleep overnight."
        ]
      },
      {
        day: 6,
        title: "Depart for Chandra Taal - Overnight stay at Chandra Taal. [Distance: Approx 95 km, Duration: 5-6 Hours]",
        description: [
          "Wake up early morning and after having breakfast check-out of the campsite.",
          "Depart for Chandra Taal lake.",
          "On the way , take a pit stop for snacks at Losar, the last village of Spiti Valley.",
          "Reach Chandra Taal by evening & check-in to the camps.",
          "Dinner and stay in tents under the gaze of a million stars and the Milky Way Galaxy."
        ]
      },
      {
        day: 7,
        title: "Depart for Delhi via Manali. [Distance: Approx 95 km, Duration: 5-6 Hours]",
        description: [
          "Wake up early morning & enjoy the beautiful sunrise.",
          "Manali self-exploration. Places to visit- Hadimba Devi Temple, Old Manali street, Mall Road. ( If Time Permits )",
          "Depart for Delhi by evening."
        ]
      },
      {
        day: 8,
        title: "Reach Delhi by morning. [ Distance: 510 km, Duration: 10 - 11 Hours ]",
        description: [
          "Reach Delhi by morning with amazing trip memories."
        ]
      }
    ],

    included: [
      "Volvo transfer from Delhi to Shimla & back.",
      "6 nights – 1 Night at Sangla ,1 Nights at Kalpa, 1 Night at Tabo, 2 Nights in Homestays at Kaza , 1 Night Chandratal Lake triple/quad sharing basis.",
      "Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 7 )",
      "All inner line permits for the trip.",
      "Driver Night Charges, Toll Tax, Parking Charges, etc.",
      "Team Captain throughout the trip.",
      "An Oxygen Cylinder 24X7 in the car in case of emergency",
      "1 bonfire is included."
    ],

    notIncluded: [
      "GST (5%) is applicable extra.",
      "Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.",
      "Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.",
      "Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)",
      "Anything not mentioned in the inclusions."
    ],

    stays: [
      "Sangla : Hotel Kamru / Similar",
      "Kalpa : Wanderers Homestay / Similar",
      "Tabo : Aema Inn / Similar.",
      "Kaza : Dragon Mud House / Similar",
      "Chandratal : Saryu’s Camps / Similar"
    ],

    batchDates: [
      {
        month: "June",
        ranges: [
          "6th June - 14th June",
          "20th June - 28th June"
        ]
      },
      {
        month: "July",
        ranges: [
          "4th July - 12th July",
          "18th July - 26th July"
        ]
      },
      {
        month: "Aug",
        ranges: [
          "1st Aug - 9th Aug",
          "15th Aug - 23rd Aug",
          "29th Aug - 6th Sept"
        ]
      },
      {
        month: "Sept",
        ranges: [
          "12th Sept - 20th Sept ( Ganesh Chaturthi Holiday )",
          "26th Sept - 4th Oct"
        ]
      }
    ]
  },
  {
    id: '25',
    title: '5 Days Summer Spiti Valley Short Circuit with Chandratal Group Road Trip Super Saver Budget',
    slug: '5-days-summer-spiti-valley-short-circuit-with-chandratal-group-road-trip-super-saver-budget',
    image: '/images/spiti5.JPG',
    destination: 'Spiti Valley',
    category: 'Spiti',
    tripType: 'India',
    duration: 6,
    price: 0,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    overviewPoints: [
      'Route: Delhi - Manali - Kaza -Key Monastery - Hikkim - Komik - Langza - Chandratal Lake - Manali - Delhi ',
      'Duration: 4 Nights / 5 Days.',
      'Trip Start: Delhi',
      'Trip End: Delhi',
      'Difficulty Level: Easy to Moderate .',
      'Best Time to Visit: June to October.',
      'Major Highlights: Hikkim , Komic , Langza , Key Monastery , Chicham Bridge , Chandratal Lake.'
    ],
    highlights: [
      'Hikkim',
      'Komic',
      'Langza',
      'Key Monastery',
      'Chicham Bridge',
      'Chandratal Lake'
    ],

    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹17,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹15,499' },
    ],

    description: `Spiti- The middle-land between the lush green valleys and the cold mountain deserts of Himalayas. A Spiti Valley Trip is a traveler’s delight, thanks to the thrilling roadways and rustic landscapes. While most parts of India undergo unbearably high temperatures, the beauty of Spiti shines like a diamond under sun during peak summer months. The best time to visit Spiti is from June-September when the glacial lakes will welcome you in all their glory. It is now that you hit those roads with our Spiti Valley RoadTrip Package!

The treacherous curves that lead to the valley of Spiti from Manali will give you a dose of adventure and beauty all at once. This is your chance to experience the thrill of traveling through the famous Rohtang Pass. Don’t forget to notice your surroundings because a beautiful change is taking place in your surroundings. It is here you’ll notice landscapes change from shades of green to brown.

When you finally enter Spiti Valley you’ll realize that it is much more than just a picturesque place of Himalayas. There’s an abundance of rich Buddhist-Tibetan culture that resides in the serrated villages of Spiti. The Key Monastery is one fine example of architecture that makes you adore the concept of simplicity in Buddhism.

Other than the skies, there stands another blue marvel on your Trip to Spiti-The Chandratal Lake! Take your time to absorb peace at this splendid glacial lake and click some postcard-perfect shots here. Speaking of postcards, why not send a letter to your loved ones from the World’s highest post office! Pretty special right!

So now that you know what to expect on this voyage to the high altitude desert, pack your bags and book yourself a slot in our Spiti Roadtrip Package for 2026!`,
    itinerary: [
      {
        day: 0,
        title: 'Departure from Delhi to Manali',
        description: [
          'Leave from Delhi by evening & reach Manali next morning.'
        ]
      },
      {
        day: 1,
        title: 'Reach Manali - Manali Self exploration - Overnight stay at Manali.',
        description: [
          'Reach Manali by morning and check-in to the Hotel.',
          'After having breakfast and some leisure, feel free to explore the local area of Manali according to the place that interests you.',
          'You can visit the Mall road, Hidimba Temple, Old Manali for some good cafes to chill or Vashisht temple for the Hot water Spring.',
          'Come back to the hotel by evening.',
          'Briefing about the next day and sleep overnight.'
        ]
      },
      {
        day: 2,
        title: 'Start your journey from Manali to Kaza via Atal Tunnel and Kunzum La. Overnight stay at Kaza. [ Distance: 185 km, Duration: 6 - 7 Hours ]',
        description: [
          'Early morning, we start our journey to the valley of the Gods – Lahaul & Spiti!',
          'Crossover to Lahaul by crossing the Engineering Marvel - Atal Tunnel, and watch the terrain shift from lush green valleys to brown arid deserts.',
          'At 14,931 ft we cross another high altitude pass & the gateway to the Spiti Valley – Kunzum La.',
          'On the way, visit the highest suspension bridge in Asia - The Chicham Bridge.We continue our drive through the stunning landscape to reach Kaza by evening, and overnight stay in hotel.'
        ]
      },
      {
        day: 3,
        title: 'Visit Key Monastery, Hikkim, Komic and Langza. Overnight stay at Kaza. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Being remotely located atop a hill overlooking endless plains, the Key Monastery is a world famous center for learning and is an obvious choice for those seeking peace and calm.',
          'Visit some of the highest inhabited regions of the world.',
          'The highest village in Asia – Komic, situated at a height of 4513 m, has a population of 84 people and is cut off from rest of the world for most parts of the year.',
          'Later, we drive to Hikkim, where we have a chance to send postcards from the world’s highest post office!',
          'At Langza, walk back to the prehistoric era when Spiti was submerged by the Tethys Sea, as you explore a land very rich with fossils of Marine animals and plants which were here millions of years ago.',
          'Overnight at Kaza.'
        ]
      },
      {
        day: 4,
        title: 'Start your journey from Kaza to Chandra Taal Lake via Losar & Kunzum La. Overnight stay at Chandra Taal [Distance: Approx 95 km, Duration: 5-6 Hours]',
        description: [
          'We start tracing our steps back towards Manali.',
          'However, make one last stop to witness another Spitian wonder – Chandra Taal Lake.',
          'The mystical and beautiful Chandra Taal Lake or the Moon Lake is located at a height of 14,000 feet.',
          'The Chandra Bhaga mountain range forms a striking backdrop for the lake, which changes appearance according to the pictures painted in the sky.',
          'Later check in to the Campsite at Chandra Taal Lake, and overnight stay at the tents under the gaze of a million stars and the Milky Way Galaxy.'
        ]
      },
      {
        day: 5,
        title: 'tart your journey back to Manali - Departure to Delhi. [ Distance: 510 km, Duration: 10 - 11 Hours]',
        description: [
          'Today, we commence our way back on the Manali – Kaza Road.',
          'We pass through some more stunning landscapes and reach Manali by afternoon.',
          'After some rest, we board the Volvo to Delhi and reach by next morning with lots of amazing memories to remember for a lifetime!'
        ]
      },
      {
        day: 6,
        title: 'Reach Delhi by morning.',
        description: [
          'Reach Delhi the next morning.'
        ]
      }
    ],
    included: [
      'Volvo transfer from Delhi to Shimla & back.',
      '4 nights – 1 Night Manali , 2 Nights in Homestays at Kaza , 1 Night Chandratal Lake triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 5 )',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      '1 bonfire is included.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.'
    ],
    stays: [
      'Manali : Hotel Conifer / Similar ',
      'Kaza : Dragon Mud House / Similar',
      'Chandratal : Saryu’s Camps / Similar'
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-02', spots: 0 }
    ],
    batchDates: [
      {
        month: 'June',
        ranges: ['6th June - 12 th June', '20th June - 26th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 10th July', '18th July - 24th July']
      },
      {
        month: 'Aug',
        ranges: ['1st Aug - 7th Aug', '15th Aug - 21th Aug', '29th Aug - 4th Sept']
      },
      {
        month: 'Sept',
        ranges: ['12th Sept - 18th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 2th Oct']
      }
    ]
  },
  {
    id: '26',
    title: '9 Days Summer Spiti Valley Bike Road Trip with Chandratal Lake Group Trip',
    slug: '9-days-summer-spiti-valley-bike-road-trip-with-chandratal-lake-group-trip',
    image: '/images/spiti12.JPG',
    destination: 'Spiti Valley',
    category: 'Spiti',
    tripType: 'India',
    duration: 8,
    price: 0,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    overviewPoints: [
      'Route: Delhi - Tirthan Valley - Chitkul - Kalpa - Kaza - Key Monastery - Hikkim - Langza - Chandratal Lake - Manali - Delhi.',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Delhi',
      'Trip End: Delhi',
      'Difficulty Level: Easy to Moderate .',
      'Best Time to Visit: June to Oct.',
      'Major Highlights: Jibhi , Chitkul , Nako , Hikkim , Komic , Langza , Key Monastery , Chicham Bridge , Chandratal Lake.'
    ],
    highlights: [
      'Jibhi',
      'Chitkul',
      'Nako',
      'Hikkim',
      'Komic',
      'Langza',
      'Key Monastery',
      'Chicham Bridge',
      'Chandratal Lake'
    ],

    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹23,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹21,499' },

      { label: 'Dual Bike (Double Sharing)', value: '₹29,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹27,499' },

      { label: 'Solo Bike (Double Sharing)', value: '₹39,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹37,499' },
    ],


    description: `Challenging Terrains, high passes, exhilarating views and one hell of a machine is what all bikers dream of. If you too are one of those who have a passion to ride on seemingly endless roads, then perhaps a bike trip to Spiti Valley is all that you need.

Spiti Valley is a high altitude desert whose beauty unveils after a tough and tricky ride through the most challenging roads of Himalayas. If you feel the need for adrenaline, you got your share of dose right throughout your trip to Spiti.

A bike expedition to Spiti can give you the feel of riding through the passes of Leh Ladakh, as this place is popularly called the mini version of it! As you begin your journey to Spiti from Manali, you travel through the popular Rohtang Pass located in the Pir Panjal Range of Himalayas. This ride will feed your appetite for thrill and vast soul-satiating panoramas.

As you leave behind the chaos of cities, Spiti Valley will happily embrace you into a zone of peace and love. Soak in the holy vibes at Key Monastery, which is an important place of pilgrimage for the Buddhist population residing in Spiti. Explore the long lost stories in the fossils of Langza Village and witness the grandeur of the golden statue of Buddha. Ride upto the highest post office in the world at Hikkim and send a postcard to your loved ones and also to yourself! In short, just forget about the metropolis life for a few days and spend some time in a natural retreat at this high altitude desert!

Our Bikes are already vrooming and we are all set to take you to this less explored paradise through our Spiti Valley Tour Packages for 2026! Time to get #Spitified!`,
    itinerary: [
      {
        day: 0,
        title: 'Departure from Delhi to Tirthan Valley. Overnight Journey In Volvo [ Distance: Approx 470 km, Duration: 11-12 Hours ]',
        description: [
          'Leave from Delhi by evening and reach Aut next morning.'
        ]
      },
      {
        day: 1,
        title: 'Reach Aut - Transfer to Gushaini/Jibhi - Overnight stay at Gushaini/Jibhi.',
        description: [
          'Depart for Gushaini/Jibhi (Backpackers)/ Bikers will head to Manali to collect their bikes & test ride from Manali to Gushaini/Jibhi.',
          'Check-in to the resort/Hotel.',
          'Breakfast and freshen up ( Bikers will be doing it in Manali).',
          'Trek to Choie/Jibhi waterfall (For Backpackers).',
          'Dinner and Overnight Sleep.'
        ]
      },
      {
        day: 2,
        title: 'Departure to Chitkul via Kinnaur Valley. Overnight stay at Chitkul. [ Distance: Approx 230 km, Duration: 10 -11 Hours ]',
        description: [
          'Early morning, begin the journey to Chitkul, the last Indian village towards China border.',
          'Experience the journey through magnificent landscapes of Kinnaur valley along the banks of Satluj River.',
          'Reach Chitkul by evening, check-in the camps, dinner and sleep overnight.'
        ]
      },
      {
        day: 3,
        title: 'Explore Chitkul - Transfer to Nako Via Kalpa. Overnight stay at Nako. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Wake up early morning to experience one of the most beautiful sunrises.',
          'Explore the local village of Chitkul. Depart for Kalpa by Noon.',
          'Enroute stop at Khwab Sangam.',
          'Reach Nako by evening, check-in to the hotel, dinner and sleep overnight.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Nako to Kaza via Tabo - Ka loops. Overnight stay at Kaza. [Distance: 220 km, Duration: 8- 9 Hours]',
        description: [
          'Wake-up early morning & after breakfast start your journey to Spiti Valley.',
          'Enter Spiti valley through Sumdo Border. Visit Nako Tabo villages en route Kaza.',
          'Cross the Ka loops en route Kaza.',
          'Reach Kaza by evening.',
          'Check-in to the Hotel/Homestay.',
          'Dinner & sleep overnight.'
        ]
      },
      {
        day: 5,
        title: 'Visit Key Monastery - Hikkim - Komic - Langza. Overnight stay at Kaza. [Distance: Approx 80km, Duration: 6-7 Hours]',
        description: [
          'Being remotely located atop a hill overlooking endless plains, the Key Monastery is a world famous center for learning and is an obvious choice for those seeking peace and calm.',
          'Further, drive to the highest suspension bridge in Asia - The Chicham Bridge.',
          'Visit some of the highest inhabited regions of the world.',
          'The highest village in Asia – Komic, situated at a height of 4513 m, has a population of 84 people and is cut off from rest of the world for most parts of the year.',
          'Later, we drive to Hikkim, where we have a chance to send postcards from the world\'s highest post office!',
          'At Langza, walk back to the prehistoric era when Spiti was submerged by the Tethys Sea, as you explore a land very rich with fossils of Marine animals and plants which were here millions of years ago.',
          'Overnight at Kaza.'
        ]
      },
      {
        day: 6,
        title: 'Depart for Chandra Taal - Overnight stay at Chandra Taal. [Distance: Approx 95 km, Duration: 5 - 6 Hours]',
        description: [
          'Wake up early morning and after having breakfast check-out of the Hotel.',
          'Depart for Chandra Taal lake.',
          'On the way , take a pit stop for snacks at Losar, the last village of Spiti Valley.',
          'Reach Chandra Taal by evening & check-in to the camps.',
          'Dinner and stay in tents under the gaze of a million stars and the Milky Way Galaxy.'
        ]
      },
      {
        day: 7,
        title: 'Depart for Manali - Old Manali café crawl - Overnight stay at Manali. [ Distance: 111 km, Duration: 6 - 7 Hours]',
        description: [
          'Wake up early morning & after breakfast depart for Manali.',
          'Reach Manali by evening',
          'Check-in to the hotel.',
          'Old Manali café crawl.',
          'Dinner and Sleep Overnight.'
        ]
      },
      {
        day: 8,
        title: 'Self-explore Manali - Departure to Delhi. [ Distance: 510 km, Duration: 10 - 11 Hours]',
        description: [
          'Wake up early morning & enjoy the beautiful sunrise.',
          'Manali self-exploration',
          'Places to visit- Hadimba Devi Temple, Old Manali street, Mall Road.',
          'Depart for Delhi by evening.',
          'Reach Delhi the next morning.'
        ]
      },
      {
        day: 9,
        title: 'Reach Delhi by morning',
        description: [
          'Reach Delhi by morning with amazing trip memories.'
        ]
      }
    ],
    included: [
      'Volvo transfer from Delhi to Shimla & back.',
      '7 nights – 1 NIght Jibhi , 1 Night at Sangla ,1 Nights at Nako , 2 Nights in Homestays at Kaza , 1 Night Chandratal Lake , 1 Night Manali on triple/quad sharing basis.',
      'Bike Rent for 7 days (for biking option)',
      'Fuel Expenses for the bike from Manali to Manali',
      'Mechanical Backup',
      'Entire travel from Aut to Manali by tempo traveler/cab (For Tempo Traveler Option)',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 8 )',
      'All inner line permits for the trip.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves ( only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      '1 bonfire is included.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Any damage to the bike except engine damage must be borne by the client.',
      'Anything not mentioned in the inclusions.'
    ],
    stays: [
      'Jibhi : Red Apple Hotel / Similar',
      'Sangla : Hotel Kamru / Similar',
      'Kalpa : Wanderers Homestay / Similar',
      'Tabo : Aema Inn / Similar.',
      'Kaza : Dragon Mud House / Similar',
      'Chandratal : Saryu\'s Camps / Similar',
      'Manali : Hotel Conifer / Similar.'
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-15', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-29', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-13', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-27', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-10', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-24', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-07', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-21', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 0 }
    ],
    batchDates: [
      {
        month: 'June',
        ranges: ['6th June - 15th June', '20th June - 29th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 13th July', '18th July - 27th July']
      },
      {
        month: 'Aug',
        ranges: ['1st Aug - 10th Aug', '15th Aug - 24th Aug', '29th Aug - 7th Sept']
      },
      {
        month: 'Sept',
        ranges: ['12th Sept - 21st Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 5th Oct']
      }
    ]
  },
  {
    id: '27',
    title: 'Bhutan Road Trip Package',
    slug: 'bhutan-road-trip-package-27',
    image: '/images/bhutan-cover1.jpg',
    destination: 'Bhutan',
    category: 'Bhutan',
    tripType: 'International',
    duration: 7,
    price: 0,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    overviewPoints: [
      'Route: Bagdogra → Phuntsholing → Thimphu → Punakha → Phobjikha Valley → Paro → Phuntsholing/Siliguri → Bagdogra.',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Bagdogra',
      'Trip End: Bagdogra',
      'Difficulty Level: Easy.',
      'Best Time to Visit: March - May & Sept - Oct.',
      'Major Highlights: Phobjikha Valley, Tiger Nest Monastery Paro, Hot Stone Bath Paro, Punakha Dzong, River Rafting in Punakha, Buddha Dordrenma Thimphu, Simply Bhutan, Chimi Lakhang Fertility Temple.'
    ],
    highlights: [
      'Phobjikha Valley',
      'Tiger Nest Monastery Paro',
      'Hot Stone Bath Paro',
      'Punakha Dzong',
      'River Rafting in Punakha',
      'Buddha Dordrenma Thimphu',
      'Simply Bhutan',
      'Chimi Lakhang Fertility Temple'
    ],

    costingDetails: [
      { label: 'Double Sharing Basis', value: '₹33,000' },
      { label: 'Triple Sharing Basis', value: '₹31,000' },
    ],


    description: `Begin in Bagdogra and journey through Bhutan’s most iconic destinations on this 7 Nights / 8 Days road trip. Travel from Phuentsholing to Thimphu, Punakha, Phobjikha Valley, and Paro before returning via Phuentsholing/Siliguri. Highlights include Tiger Nest Monastery, hot stone bath in Paro, Punakha Dzong, river rafting in Punakha, Buddha Dordrenma, Simply Bhutan, and Chimi Lakhang Fertility Temple.`,
    itinerary: [
      // {
      //   day: 0,
      //   title: 'Arrival in Bagdogra. Transfer to Phuentsholing.',
      //   description: [
      //     'Leave from Delhi by evening and reach Aut next morning.'
      //   ]
      // },
      {
        day: 1,
        title: 'Arrival in Bagdogra. Transfer to Phuentsholing.',
        description: [
          'Upon arrival at Bagdogra Airport, meet our representative who will help you board your transfer to Bhutan. ',
          'Enjoy your drive to the last Indian border town called Jaigaon, after which you will enter Bhutan.',
          'Here, you will arrive in Phuentsholing in the evening.',
          'Reach your hotel in Phuentsholing and check in to your hotel. ',
          'Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu. Travel to the capital city of Bhutan.',
        description: [
          'Post breakfast, complete the permit formalities at Jaigaon and begin your scenic drive towards Thimphu.',
          'Enjoy one of the most beautiful road journeys through Bhutan with mesmerizing countryside landscapes and mountain views.',
          'Drive through winding mountain roads surrounded by broadleaf forests, waterfalls, quaint villages, and charming towns.',
          'En route, stop at the famous Chuzom Bridge to witness the beautiful confluence of the Paro and Thimphu rivers.',
          'Capture memorable moments near the welcoming portrait of the King and Queen of Bhutan on your way to Thimphu.',
          'By evening, reach Thimphu, check in to your hotel, and if time permits, explore the local markets and the unique city without traffic lights.'
        ]
      },
      {
        day: 3,
        title: 'Excursion to Punakha. Pass the beautiful Dochu La. Overnight stay in Thimphu',
        description: [
          'Have your breakfast in the morning and get ready for the day.',
          'Today, we will take you to Punakha, located 75 kms to the east of Thimphu.',
          'Our 1st stop on today\'s road journey will be the Dochu La one of the most scenic mountain passes of Bhutan.',
          'We will spend some time admiring the surrounding views of the Himalayas while sipping a hot cup of tea/coffee in the cafe at the pass.',
          'We will also visit the 108 Druk Wangyal Chortens that are built on the pass in memory of the Bhutanese soldiers who died in “Operation All Clear” in 2003.',
          'After lunch, embark on a short hike to Chimi Lhakhang (temple of fertility) - a temple dedicated to Lam Drukpa Kuenley (Divine Mad Man).',
          'This place is considered the origin of Phalluses as the symbol of fertility and protection.'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Local Sightseeing. Transfer from Thimphu to Paro. Overnight stay in Paro.',
        description: [
          'Wake up in the morning and have your breakfast in the morning.',
          'Post breakfast local sightseeing of Thimphu. Simply Bhutan and Buddha Statue.',
          'Later, get ready to board your transfers to Paro. Arrival in Paro and check-in to the hotel.',
          'Have your dinner and overnight stay in Paro.'
        ]
      },
      {
        day: 5,
        title: 'Paro Local Sightseeing. Hike to Tiger\'s Nest.',
        description: [
          'Post breakfast in the morning, get ready to watch the most magical sight of Bhutan.',
          'Today, we will visit the famous Taktsang Monastery (Tiger Nest Temple), located 11 kms from Paro.',
          'Drive till the starting point of the hiking trail that will take you to the Taktsang Monastery.',
          'We will then start the hike through the beautiful pine forest to reach the magnificent Taktsang Monastery.',
          'You will have to hike for 2-4 hours (depending on your speed), to reach one of the holiest sites in Bhutan which clings impossibly to a sheer cliff face 900 meters above the valley.',
          'Spend some peaceful time walking around the monastery listening to the prayer chants, sound of the uttering flags or quietly meditating in the caves of the monastery.',
          'After spending enough time in the monastery, we will start our return journey to Paro.',
          'Overnight stay at the hotel in Paro.'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing. Embark on a scenic road journey.',
        description: [
          'Have your breakfast in the morning and get ready to start your return journey.',
          'You will board your transfers and start a beautiful return road journey.',
          'Enjoy this road journey and Reach Phuentsholing by evening.',
          'Check-in to the hotel. Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 7,
        title: 'Departure to Bagdogra Airport.',
        description: [
          'After breakfast in the morning, check-out and reach Bagdogra airport.',
          'Take back a treasure of happy memories to cherish for lifetime.'
        ]
      },

    ],
    included: [
      '6 Nights accommodation on double sharing basis.',
      'Daily Breakfast & Dinner (Breakfast except Day 1 & Dinner except Day 7).',
      'River Rafting experience in Punakha.',
      'Traditional Bhutanese Hot Stone Bath in Paro.',
      'Comfortable 11 Seater Tata Winger for 6 days.',
      'Professional English speaking Bhutanese guide.',
      'Sustainable Development Fee (SDF) included.',
      'All tolls, parking and driver night charges.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any food or beverage not included in the package such as alcoholic drinks, mineral water, highway meals or refreshments.',
      'Any personal expenses such as tips to drivers, camera/video charges, laundry, telephone bills etc.',
      'Any cost arising due to natural calamities such as landslides or roadblocks.',
      'Anything not specifically mentioned in the inclusions.',
      'Cost arising due to any change in tourism policy between Bhutan and India.',
      'Cost arising due to change or delay in flight timings.',
      'Entry tickets to monuments or attractions are not included.',
      'Return Transfer from Siliguri Hotel to Airport is excluded. Self Conveyance to be arranged as per your flight timings.'
    ],
    stays: [
      'Phuntsholing : Lakhi Hotel / Similar',
      'Thimphu : Hotel White Tara / Similar',
      'Paro : Rema Resort / Similar',
      'Siliguri : Hotel Cinderella / Similar'
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-15', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-29', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-13', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-27', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-10', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-24', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-07', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-21', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 0 }
    ],

    batchDates: [
      {
        month: 'June',
        ranges: ['6th June - 12th June', '20th June - 26th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 10th July', '18th July - 24th July', '25th July - 31st July']
      },
      {
        month: 'Aug',
        ranges: ['1st Aug - 7th Aug', '8th Aug - 14th Aug', '15th Aug - 21st Aug', '29th Aug - 4th Sept']
      },
      {
        month: 'Sept',
        ranges: ['5th Sept - 11th Sept', '12th Sept - 18th Sept', '26th Sept - 2nd Oct']
      },
      {
        month: 'Oct',
        ranges: ['3rd Oct - 9th Oct', '10th Oct - 16th Oct', '24th Oct - 30th Oct', '31st Oct - 6th Nov']
      }
    ],


    paymentPolicy: [
      'At booking: 25% (non-refundable)',
      'Within 45 days: 50% (non-refundable)',
      'Within 30 days: 75% (non-refundable)',
      '20 days or less: 100% (forfeited)'
    ],

    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited'
    ],

    note: [
      'Travellers residing outside Delhi are suggested to book trains/flights reaching Delhi not later than 4 PM on the trip start date. Similarly, on trip end date, book returning flight/trains leaving post 12 PM.',
      'Numerous factors such as weather, road conditions, the physical ability of participants etc. may cause itinerary change. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing.',
      'The age limit of our group departures is 16 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.',
      'Dear traveller\'s In the event of extreme winter conditions, where snow may prevent the use of tempo travellers, we will opt for 4x4 vehicles to ensure safety and accessibility.',
      'Please note that any additional costs incurred for the 4x4 vehicle will be borne by the clients.',
      'Winter Spiti is known for snowfall, which may lead to route closures.',
      'Please be prepared for such adventures, as we will take the best possible alternatives in those situations to ensure a smooth journey.'
    ],
  },
  {
    id: '28',
    title: 'Bhutan Road Trip Package',
    slug: 'bhutan-road-trip-package-28',
    image: '/images/bhutan-cover2.jpg',
    destination: 'Bhutan',
    category: 'Bhutan',
    tripType: 'International',
    duration: 8,
    price: 0,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    overviewPoints: [
      'Route: Bagdogra → Phuntsholing → Thimphu → Punakha → Phobjikha Valley → Paro → Phuntsholing/Siliguri → Bagdogra.',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Bagdogra',
      'Trip End: Bagdogra',
      'Difficulty Level: Easy.',
      'Best Time to Visit: March - May & Sept - Oct.',
      'Major Highlights: Phobjikha Valley, Tiger Nest Monastery Paro, Hot Stone Bath Paro, Punakha Dzong, River Rafting in Punakha, Buddha Dordrenma Thimphu, Simply Bhutan, Chimi Lakhang Fertility Temple.'
    ],
    highlights: [
      'Phobjikha Valley',
      'Tiger Nest Monastery Paro',
      'Hot Stone Bath Paro',
      'Punakha Dzong',
      'River Rafting in Punakha',
      'Buddha Dordrenma Thimphu',
      'Simply Bhutan',
      'Chimi Lakhang Fertility Temple'
    ],

    costingDetails: [
      { label: 'Double Sharing Basis', value: '₹33,000' },
      { label: 'Triple Sharing Basis', value: '₹31,000' },
    ],


    description: `Begin in Bagdogra and journey through Bhutan’s most iconic destinations on this 7 Nights / 8 Days road trip. Travel from Phuentsholing to Thimphu, Punakha, Phobjikha Valley, and Paro before returning via Phuentsholing/Siliguri. Highlights include Tiger Nest Monastery, hot stone bath in Paro, Punakha Dzong, river rafting in Punakha, Buddha Dordrenma, Simply Bhutan, and Chimi Lakhang Fertility Temple.`,

    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bagdogra. Transfer to Phuentsholing.',
        description: [
          'Upon arrival at Bagdogra Airport, meet our representative who will help you board your transfer to Bhutan.',
          'Enjoy your drive to the last Indian border town called Jaigaon, after which you will enter Bhutan.',
          'Here, you will arrive in Phuentsholing in the evening.',
          'Reach your hotel in Phuentsholing and check in to your hotel.',
          'Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu. Travel to the capital city of Bhutan.',
        description: [
          'Post breakfast , complete the permit formalities at Jaigaon and start your drive to Thimphu.',
          'Today’s road journey will take you through some of the most beautiful countryside landscapes of Bhutan.',
          'You will pass through some meandering mountain roads lined with broad leaves forests, waterfalls, quaint villages, and towns to reach Thimphu.',
          'En route, take a small stopover at the Chuzom Bridge from where you will see a beautiful confluence of the Paro and Thimphu rivers, along with a beautiful portrait of the King and Queen as a welcoming sign to Bhutan.',
          'By evening, reach Thimphu and check in to your hotel.',
          'If time permits, you can choose to explore Thimphu - the only city in the world without track lights or explore the local markets.',
          'Overnight stay in Thimphu.'
        ]
      },
      {
        day: 3,
        title: 'Drive to Punakha. Pass the beautiful Dochu La. Overnight stay in Punakha',
        description: [
          'Have your breakfast in the morning and get ready for the day.',
          'Today, we will take you to Punakha, located 75 kms to the east of Thimphu.',
          'Stop at the iconic Buddha Dordenma Statue for panoramic views of Thimphu Valley and some peaceful moments.',
          'Our 1st stop on today\'s road journey will be the Dochu La - one of the most scenic mountain passes of Bhutan.',
          'We will spend some time admiring the surrounding views of the Himalayas while sipping a hot cup of tea/coffee in the cafe at the pass.',
          'We will also visit the 108 Druk Wangyal Chortens that are built on the pass in memory of the Bhutanese soldiers who died in “Operation All Clear” in 2003.',
          'In Punakha, visit the majestic Punakha Dzong, beautifully set at the confluence of two rivers, followed by a walk across the famous Suspension Bridge.',
          'Not to miss out on a fun white water rafting at Manchu Pachu river - it will be an adventure worth remembering.',
          'After a fun day of exploring by evening reach at the hotel in Punakha and relax at the hotel.'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjika Valley',
        description: [
          'After breakfast, start your scenic drive from Punakha to Phobjikha Valley (Gangtey Valley), one of the most beautiful and peaceful valleys in Bhutan.',
          'Visit the historic Gangtey Monastery, an important Nyingma school monastery located on a hilltop overlooking the valley.',
          'Enjoy a short nature trail walk around the valley to soak in the scenic views and experience the calm and charm of this magical place.',
          'During the right season, get a chance to see the rare and graceful Black-Necked Cranes, for which the valley is famous.',
          'Drive back to Punakha after the excursion.'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro.',
        description: [
          'After breakfast, check out and get ready to proceed towards Paro.',
          'Visit Chimi Lhakhang (Fertility Temple), located near Lobesa- which is widely known for blessings related to fertility and happiness. ( A short trail)',
          'After the visit, continue your scenic journey towards Paro, passing through beautiful valleys and mountain roads.',
          'Check in to your hotel and take some time to relax after the drive.',
          'Spend the evening exploring Paro town, visiting local cafes, or simply relaxing and soaking in the peaceful surroundings.'
        ]
      },
      {
        day: 6,
        title: 'Trek to the Iconic Taktsang Monastery Aka Tiger Nest Monastery',
        description: [
          'Post breakfast in the morning, get ready to watch the most magical sight of Bhutan.',
          'Today, we will visit the famous Taktsang Monastery (Tiger Nest Temple), located 11 kms from Paro.',
          'Drive till the starting point of the hiking trail that will take you to the Taktsang Monastery.',
          'We will then start the hike through the beautiful pine forest to reach the magnificent Taktsang Monastery.',
          'You will have to hike for 2-4 hours (depending on your speed), to reach one of the holiest sites in Bhutan which clings impossibly to a sheer cliff face 900 meters above the valley.',
          'Spend some peaceful time walking around the monastery listening to the prayer chants, sound of the uttering flags or quietly meditating in the caves of the monastery.',
          'After spending enough time in the monastery, we will start our return journey to Paro.',
          'Overnight stay at the hotel in Paro.'
        ]
      },
      {
        day: 7,
        title: 'Paro → Phuentsholing → Siliguri Distance: 300 km | 8–9 hrs',
        description: [
          'After breakfast,we start our return journey, driving back through Phuentsholing and entering back to the Indian soil.',
          'Reach Siliguri by evening after a long but scenic drive.'
        ]
      },
      {
        day: 8,
        title: 'Departure to Bagdogra Airport.',
        description: [
          'After breakfast in the morning, check-out and reach Bagdogra airport.',
          'Take back a treasure of happy memories to cherish for lifetime.'
        ]
      }
    ],

    included: [
      '7 Nights accommodation on double sharing basis.',
      'Daily Breakfast & Dinner (Breakfast except Day 1 & Dinner except Day 8).',
      'River Rafting experience in Punakha.',
      'Traditional Bhutanese Hot Stone Bath in Paro.',
      'Comfortable 11 Seater Tata Winger for 7 days.',
      'Professional English speaking Bhutanese guide.',
      'Sustainable Development Fee (SDF) included.',
      'All tolls, parking and driver night charges.'
    ],

    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any food or beverage not included in the package such as alcoholic drinks, mineral water, highway meals or refreshments.',
      'Any personal expenses such as tips to drivers, camera/video charges, laundry, telephone bills etc.',
      'Any cost arising due to natural calamities such as landslides or roadblocks.',
      'Anything not specifically mentioned in the inclusions.',
      'Cost arising due to any change in tourism policy between Bhutan and India.',
      'Cost arising due to change or delay in flight timings.',
      'Entry tickets to monuments or attractions are not included.',
      'Return Transfer from Siliguri Hotel to Airport is excluded. Self Conveyance to be arranged as per your flight timings.'
    ],

    stays: [
      'Phuntsholing : Lakhi Hotel / Similar',
      'Thimphu : Hotel White Tara / Similar',
      'Punakha : Dragon Nest Resort Punakha / Similar',
      'Paro : Rema Resort / Similar',
      'Siliguri : Hotel Cinderella / Similar'
    ],

    paymentPolicy: [
      'At booking: 25% (non-refundable)',
      'Within 45 days: 50% (non-refundable)',
      'Within 30 days: 75% (non-refundable)',
      '20 days or less: 100% (forfeited)'
    ],

    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited'
    ],

    dates: [
      { startDate: '2025-06-10', endDate: '2025-06-16', spots: 12 },
      { startDate: '2025-07-15', endDate: '2025-07-21', spots: 10 }
    ],

    note: [
      'Travellers residing outside Delhi are suggested to book trains/flights reaching Delhi not later than 4 PM on the trip start date. Similarly, on trip end date, book returning flight/trains leaving post 12 PM.',
      'Numerous factors such as weather, road conditions, the physical ability of participants etc. may cause itinerary change. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing.',
      'The age limit of our group departures is 16 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.',
      'Dear traveller\'s In the event of extreme winter conditions, where snow may prevent the use of tempo travellers, we will opt for 4x4 vehicles to ensure safety and accessibility.',
      'Please note that any additional costs incurred for the 4x4 vehicle will be borne by the clients.',
      'Winter Spiti is known for snowfall, which may lead to route closures.',
      'Please be prepared for such adventures, as we will take the best possible alternatives in those situations to ensure a smooth journey.'
    ]
  },
  {
    id: '29',
    title: 'Bhutan Road Trip Package',
    slug: 'bhutan-road-trip-package-29',
    image: '/images/bhutan-cover3.PNG',
    destination: 'Bhutan',
    category: 'Bhutan',
    description: `7 Nights / 8 Days Bhutan Road Trip Package from Bagdogra through Phuentsholing, Thimphu, Punakha, Paro and back. Enjoy cultural highlights, scenic drives, river rafting, traditional Bhutanese hospitality, and comfortable road travel with an expert guide.`,
    duration: 8,
    price: 36999,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'International',
    overviewPoints: [
      'Route: Bagdogra → Phuntsholing → Thimphu → Punakha → Phobjikha Valley → Paro → Phuntsholing/Siliguri → Bagdogra.',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Bagdogra',
      'Trip End: Bagdogra',
      'Difficulty Level: Easy.',
      'Best Time to Visit: March - May & Sept - Oct.',
      'Major Highlights: Phobjikha Valley, Tiger Nest Monastery Paro, Hot Stone Bath Paro, Punakha Dzong, River Rafting in Punakha, Buddha Dordrenma Thimphu, Simply Bhutan, Chimi Lakhang Fertility Temple.'
    ],
    highlights: [
      'Phobjikha Valley',
      'Tiger Nest Monastery Paro',
      'Hot Stone Bath Paro',
      'Punakha Dzong',
      'River Rafting in Punakha',
      'Buddha Dordrenma Thimphu',
      'Simply Bhutan',
      'Chimi Lakhang Fertility Temple'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bagdogra. Transfer to Phuentsholing.',
        description: [
          'Upon arrival at Bagdogra Airport, meet our representative who will help you board your transfer to Bhutan.',
          'Enjoy your drive to the last Indian border town called Jaigaon, after which you will enter Bhutan.',
          'Here, you will arrive in Phuentsholing in the evening.',
          'Reach your hotel in Phuentsholing and check in to your hotel.',
          'Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu. Travel to the capital city of Bhutan.',
        description: [
          'Post breakfast, complete the permit formalities at Jaigaon and start your drive to Thimphu.',
          'Today’s road journey will take you through some of the most beautiful countryside landscapes of Bhutan.',
          'You will pass through meandering mountain roads lined with broad-leaved forests, waterfalls, quaint villages, and towns to reach Thimphu.',
          'En route, take a small stopover at the Chuzom Bridge from where you will see the confluence of the Paro and Thimphu rivers, along with a portrait of the King and Queen as a welcoming sign to Bhutan.',
          'By evening, reach Thimphu and check in to your hotel.',
          'If time permits, you can choose to explore Thimphu or local markets.',
          'Overnight stay in Thimphu.'
        ]
      },
      {
        day: 3,
        title: 'Drive to Punakha. Pass the beautiful Dochu La. Overnight stay in Punakha.',
        description: [
          'Have your breakfast in the morning and get ready for the day.',
          'Today, we will take you to Punakha, located 75 kms to the east of Thimphu.',
          'Stop at the iconic Buddha Dordenma Statue for panoramic views of Thimphu Valley.',
          'Our first stop on today’s road journey will be the Dochu La, one of the most scenic mountain passes of Bhutan.',
          'We will spend time admiring the Himalayas while sipping tea or coffee at the pass.',
          'We will also visit the 108 Druk Wangyal Chortens built in memory of Bhutanese soldiers who died in Operation All Clear in 2003.',
          'In Punakha, visit the majestic Punakha Dzong and walk across the famous suspension bridge.',
          'Enjoy a fun white water rafting experience at the Manchu Pachu river.',
          'After a fun day of exploring, reach your hotel in Punakha and relax.'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjikha Valley.',
        description: [
          'After breakfast, start your scenic drive from Punakha to Phobjikha Valley (Gangtey Valley).',
          'Visit the historic Gangtey Monastery, an important Nyingma monastery on a hilltop overlooking the valley.',
          'Enjoy a short nature trail walk around the valley to soak in the scenic views and the calm charm of this magical place.',
          'During the right season, get a chance to see the rare and graceful Black-Necked Cranes.',
          'Drive back to Punakha after the excursion.'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro.',
        description: [
          'After breakfast, check out and get ready to proceed towards Paro.',
          'Visit Chimi Lhakhang (Fertility Temple) near Lobesa, known for blessings related to fertility and happiness.',
          'After the visit, continue your scenic journey towards Paro through beautiful valleys and mountain roads.',
          'Check in to your hotel and take time to relax after the drive.',
          'Spend the evening exploring Paro town or visiting local cafes.'
        ]
      },
      {
        day: 6,
        title: 'Trek to the Iconic Taktsang Monastery Aka Tiger Nest Monastery.',
        description: [
          'Post breakfast, get ready to experience the most magical sight of Bhutan.',
          'Today, we visit the famous Taktsang Monastery (Tiger Nest Temple), located 11 kms from Paro.',
          'Drive to the hiking trail start point that leads to the Taktsang Monastery.',
          'Begin the hike through pine forest to reach the magnificent monastery.',
          'You will hike for 2-4 hours depending on your speed, to reach the monastery perched on a cliff face 900 meters above the valley.',
          'Spend peaceful time around the monastery listening to prayer chants and meditating in the caves.',
          'After time at the monastery, return to Paro.',
          'Overnight stay at the hotel in Paro.'
        ]
      },
      {
        day: 7,
        title: 'Paro → Phuentsholing → Siliguri Distance: 300 km | 8–9 hrs.',
        description: [
          'After breakfast, start your return journey through Phuentsholing and enter back into India.',
          'Reach Siliguri by evening after a long but scenic drive.'
        ]
      },
      {
        day: 8,
        title: 'Departure to Bagdogra Airport.',
        description: [
          'After breakfast, check out and reach Bagdogra airport.',
          'Take back a treasure of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '7 Nights accommodation on double sharing basis.',
      'Daily Breakfast & Dinner (Breakfast except Day 1 & Dinner except Day 8).',
      'River Rafting experience in Punakha.',
      'Traditional Bhutanese Hot Stone Bath in Paro.',
      'Comfortable 11 Seater Tata Winger for 7 days.',
      'Professional English speaking Bhutanese guide.',
      'Sustainable Development Fee (SDF) included.',
      'All tolls, parking and driver night charges.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any food or beverage not included in the package such as alcoholic drinks, mineral water, highway meals or refreshments.',
      'Any personal expenses such as tips to drivers, camera/video charges, laundry, telephone bills etc.',
      'Any cost arising due to natural calamities such as landslides or roadblocks.',
      'Anything not specifically mentioned in the inclusions.',
      'Cost arising due to any change in tourism policy between Bhutan and India.',
      'Cost arising due to change or delay in flight timings.',
      'Entry tickets to monuments or attractions are not included.',
      'Return Transfer from Siliguri Hotel to Airport is excluded. Self Conveyance to be arranged as per your flight timings.'
    ],
    stays: [
      'Phuntsholing : Lakhi Hotel / Similar',
      'Thimphu : Hotel White Tara / Similar',
      'Punakha : Dragon Nest Resort Punakha / Similar',
      'Paro : Rema Resort / Similar',
      'Siliguri : Hotel Cinderella / Similar'
    ],
    costingDetails: [
      { label: 'Double Sharing Basis', value: 'INR 36,999' },
      { label: 'Triple Sharing Basis', value: 'INR 34,999' }
    ],
    batchDates: [
      { month: 'June', ranges: ['6th June - 12th June', '20th June - 26th June'] },
      { month: 'July', ranges: ['4th July - 10th July', '18th July - 24th July', '25th July - 31st July'] },
      { month: 'Aug', ranges: ['1st Aug - 7th Aug', '8th Aug - 14th Aug', '15th Aug - 21st Aug', '29th Aug - 4th Sept'] },
      { month: 'Sept', ranges: ['5th Sept - 11th Sept', '12th Sept - 18th Sept', '26th Sept - 2nd Oct'] },
      { month: 'Oct', ranges: ['3rd Oct - 9th Oct', '10th Oct - 16th Oct', '24th Oct - 30th Oct', '31st Oct - 6th Nov'] }
    ],
    paymentPolicy: [
      'At booking: 25% (non-refundable)',
      'Within 45 days: 50% (non-refundable)',
      'Within 30 days: 75% (non-refundable)',
      '20 days or less: 100% (forfeited)'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited'
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 0 },
      { startDate: '2026-07-25', endDate: '2026-07-31', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 0 },
      { startDate: '2026-08-08', endDate: '2026-08-14', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 0 },
      { startDate: '2026-09-05', endDate: '2026-09-11', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-02', spots: 0 },
      { startDate: '2026-10-03', endDate: '2026-10-09', spots: 0 },
      { startDate: '2026-10-10', endDate: '2026-10-16', spots: 0 },
      { startDate: '2026-10-24', endDate: '2026-10-30', spots: 0 },
      { startDate: '2026-10-31', endDate: '2026-11-06', spots: 0 }
    ],
    note: [
      'Travellers residing outside Delhi are suggested to book trains/flights reaching Delhi not later than 4 PM on the trip start date. Similarly, on trip end date, book returning flight/trains leaving post 12 PM.',
      'Numerous factors such as weather, road conditions, the physical ability of participants etc. may cause itinerary change. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing.',
      'The age limit of our group departures is 16 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.',
      'Dear traveller\'s In the event of extreme winter conditions, where snow may prevent the use of tempo travellers, we will opt for 4x4 vehicles to ensure safety and accessibility.',
      'Please note that any additional costs incurred for the 4x4 vehicle will be borne by the clients.',
      'Winter Spiti is known for snowfall, which may lead to route closures.',
      'Please be prepared for such adventures, as we will take the best possible alternatives in those situations to ensure a smooth journey.'
    ]
  },
  {
    id: '30',
    title: 'Bhutan Road Trip Package',
    slug: 'bhutan-road-trip-package-30',
    image: '/images/bhutan-cover4.PNG',
    destination: 'Bhutan',
    category: 'Bhutan',
    description: `6 Nights / 7 Days Bhutan road trip from Bagdogra through Phuentsholing, Thimphu, Punakha, Paro, and back. Experience scenic drives, cultural temples, a hike to Tiger's Nest, river rafting, and traditional hot stone bath with expert guidance.`,
    duration: 7,
    price: 36999,
    rating: 4.6,
    difficulty: 'Moderate',
    groupSize: 12,
    tripType: 'International',
    overviewPoints: [
      'Route: Bagdogra → Phuntsholing → Thimphu → Punakha → Paro → Phuntsholing/Siliguri → Bagdogra.',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Bagdogra',
      'Trip End: Bagdogra',
      'Difficulty Level: Easy.',
      'Best Time to Visit: March - May & Sept - Oct.',
      'Major Highlights: Tiger Nest Monastery Paro, Hot Stone Bath Paro, Punakha Dzong, River Rafting in Punakha, Buddha Dordrenma Thimphu, Simply Bhutan, Chimi Lakhang Fertility Temple.'
    ],
    highlights: [
      'Tiger Nest Monastery Paro',
      'Hot Stone Bath Paro',
      'Punakha Dzong',
      'River Rafting in Punakha',
      'Buddha Dordrenma Thimphu',
      'Simply Bhutan',
      'Chimi Lakhang Fertility Temple'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bagdogra. Transfer to Phuentsholing.',
        description: [
          'Upon arrival at Bagdogra Airport, meet our representative who will help you board your transfer to Bhutan.',
          'Enjoy your drive to the last Indian border town called Jaigaon, after which you will enter Bhutan.',
          'Here, you will arrive in Phuentsholing in the evening.',
          'Reach your hotel in Phuentsholing and check in to your hotel.',
          'Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu. Travel to the capital city of Bhutan.',
        description: [
          'Post breakfast, complete the permit formalities at Jaigaon and start your drive to Thimphu.',
          'Today’s road journey will take you through some of the most beautiful countryside landscapes of Bhutan.',
          'You will pass through meandering mountain roads lined with broad-leaved forests, waterfalls, quaint villages, and towns to reach Thimphu.',
          'En route, take a small stopover at the Chuzom Bridge from where you will see the confluence of the Paro and Thimphu rivers, along with a portrait of the King and Queen as a welcoming sign to Bhutan.',
          'By evening, reach Thimphu and check in to your hotel.',
          'If time permits, you can choose to explore Thimphu or local markets.',
          'Overnight stay in Thimphu.'
        ]
      },
      {
        day: 3,
        title: 'Excursion to Punakha. Pass the beautiful Dochu La. Overnight stay in Thimphu.',
        description: [
          'Have your breakfast in the morning and get ready for the day.',
          'Today, we will take you to Punakha, located 75 kms to the east of Thimphu.',
          'Our first stop on today’s road journey will be the Dochu La, one of the most scenic mountain passes of Bhutan.',
          'We will spend time admiring the surrounding views of the Himalayas while sipping a hot cup of tea or coffee at the pass.',
          'We will also visit the 108 Druk Wangyal Chortens built in memory of the Bhutanese soldiers who died in “Operation All Clear” in 2003.',
          'After lunch, embark on a short hike to Chimi Lhakhang, the temple of fertility dedicated to Lam Drukpa Kuenley.',
          'This place is considered the origin of phalluses as symbols of fertility and protection.'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Local Sightseeing. Transfer from Thimphu to Paro. Overnight stay in Paro.',
        description: [
          'Wake up in the morning and have your breakfast.',
          'Post breakfast, enjoy local sightseeing in Thimphu including Simply Bhutan and the Buddha Statue.',
          'Later, board your transfers to Paro.',
          'Arrival in Paro and check-in to the hotel.',
          'Have dinner and overnight stay in Paro.'
        ]
      },
      {
        day: 5,
        title: 'Paro Local Sightseeing. Hike to Tiger’s Nest.',
        description: [
          'Post breakfast, get ready to watch the most magical sight of Bhutan.',
          'Today, we will visit the famous Taktsang Monastery (Tiger Nest Temple), located 11 kms from Paro.',
          'Drive to the hiking trail start point that will take you to the Taktsang Monastery.',
          'We will then start the hike through the beautiful pine forest to reach the magnificent Taktsang Monastery.',
          'You will hike for 2-4 hours depending on your speed to reach the monastery perched on a cliff face 900 meters above the valley.',
          'Spend peaceful time walking around the monastery listening to prayer chants and meditating in the caves.',
          'After spending enough time at the monastery, return to Paro.',
          'Overnight stay at the hotel in Paro.'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing. Embark on a scenic road journey.',
        description: [
          'Have your breakfast in the morning and get ready to start your return journey.',
          'You will board your transfers and start a beautiful return road journey.',
          'Enjoy this road journey and reach Phuentsholing by evening.',
          'Check-in to the hotel. Overnight stay in Phuentsholing.'
        ]
      },
      {
        day: 7,
        title: 'Departure to Bagdogra Airport.',
        description: [
          'After breakfast in the morning, check-out and reach Bagdogra airport.',
          'Take back a treasure of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '6 Nights accommodation on double sharing basis.',
      'Daily Breakfast & Dinner (Breakfast except Day 1 & Dinner except Day 7).',
      'River Rafting experience in Punakha.',
      'Traditional Bhutanese Hot Stone Bath in Paro.',
      'Comfortable 11 Seater Tata Winger for 6 days.',
      'Professional English speaking Bhutanese guide.',
      'Sustainable Development Fee (SDF) included.',
      'All tolls, parking and driver night charges.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any food or beverage not included in the package such as alcoholic drinks, mineral water, highway meals or refreshments.',
      'Any personal expenses such as tips to drivers, camera/video charges, laundry, telephone bills etc.',
      'Any cost arising due to natural calamities such as landslides or roadblocks.',
      'Anything not specifically mentioned in the inclusions.',
      'Cost arising due to any change in tourism policy between Bhutan and India.',
      'Cost arising due to change or delay in flight timings.',
      'Entry tickets to monuments or attractions are not included.',
      'Return Transfer from Siliguri Hotel to Airport is excluded. Self Conveyance to be arranged as per your flight timings.'
    ],
    stays: [
      'Phuntsholing : Lakhi Hotel / Similar',
      'Thimphu : Hotel White Tara / Similar',
      'Paro : Rema Resort / Similar',
      'Siliguri : Hotel Cinderella / Similar'
    ],
    costingDetails: [
      { label: 'Double Sharing Basis', value: 'INR 36,999' },
      { label: 'Triple Sharing Basis', value: 'INR 34,999' }
    ],
    batchDates: [
      { month: 'June', ranges: ['6th June - 12th June', '20th June - 26th June'] },
      { month: 'July', ranges: ['4th July - 10th July', '18th July - 24th July', '25th July - 31st July'] },
      { month: 'Aug', ranges: ['1st Aug - 7th Aug', '8th Aug - 14th Aug', '15th Aug - 21st Aug', '29th Aug - 4th Sept'] },
      { month: 'Sept', ranges: ['5th Sept - 11th Sept', '12th Sept - 18th Sept', '26th Sept - 2nd Oct'] },
      { month: 'Oct', ranges: ['3rd Oct - 9th Oct', '10th Oct - 16th Oct', '24th Oct - 30th Oct', '31st Oct - 6th Nov'] }
    ],
    paymentPolicy: [
      'At booking: 25% (non-refundable)',
      'Within 45 days: 50% (non-refundable)',
      'Within 30 days: 75% (non-refundable)',
      '20 days or less: 100% (forfeited)'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable',
      'Within 45 days: Minimum 50% deduction',
      'Within 30 days: Minimum 75% deduction',
      '20 days or less: 100% forfeited'
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 0 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 0 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 0 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 0 },
      { startDate: '2026-07-25', endDate: '2026-07-31', spots: 0 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 0 },
      { startDate: '2026-08-08', endDate: '2026-08-14', spots: 0 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 0 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 0 },
      { startDate: '2026-09-05', endDate: '2026-09-11', spots: 0 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 0 },
      { startDate: '2026-09-26', endDate: '2026-10-02', spots: 0 },
      { startDate: '2026-10-03', endDate: '2026-10-09', spots: 0 },
      { startDate: '2026-10-10', endDate: '2026-10-16', spots: 0 },
      { startDate: '2026-10-24', endDate: '2026-10-30', spots: 0 },
      { startDate: '2026-10-31', endDate: '2026-11-06', spots: 0 }
    ],
    note: [
      'Travellers residing outside Delhi are suggested to book trains/flights reaching Delhi not later than 4 PM on the trip start date. Similarly, on trip end date, book returning flight/trains leaving post 12 PM.',
      'Numerous factors such as weather, road conditions, the physical ability of participants etc. may cause itinerary change. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing.',
      'The age limit of our group departures is 16 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.',
      'Dear traveller\'s In the event of extreme winter conditions, where snow may prevent the use of tempo travellers, we will opt for 4x4 vehicles to ensure safety and accessibility.',
      'Please note that any additional costs incurred for the 4x4 vehicle will be borne by the clients.',
      'Winter Spiti is known for snowfall, which may lead to route closures.',
      'Please be prepared for such adventures, as we will take the best possible alternatives in those situations to ensure a smooth journey.'
    ]
  },
  {
    id: '31',
    title: '6 Days Ultimate Adventurous Himachal Group Trip',
    slug: '6-days-ultimate-adventurous-himachal-group-trip',
    image: '/images/himachal.jpg',
    destination: 'Himachal Pradesh',
    region: 'Himachal',
    category: 'Himachal',
    description: `Get away from the bustle of the city and set off on a once-in-a-lifetime Himalayan journey across Himachal Pradesh's stunning scenery. This trip offers the ideal fusion of adventure, nature, culture, and leisure, from the lively streets of Manali and the snow-covered splendor of Sissu to the hippy vibes of Kasol and the unspoiled charm of Jibhi. 
Experience thrilling river rafting, discover hidden Himalayan towns, go through enchanted forests to the mysterious Serolsar Lake, see the engineering marvel of the Atal Tunnel, and spend your evenings relaxing at picturesque mountain cafés with other tourists.
This trip promises lifelong experiences, whether you're an action seeker, a nature lover, or just someone looking to unplug and rejuvenate.`,
    duration: 6,
    nights: 5,
    price: 15500,
    rating: 4.8,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Delhi → Manali → Sissu → Kasol → Jibhi → Serolsar Lake → Delhi',
      'Beautiful Scenic Trek To Jogni Waterfall',
      'Atal Tunnel & Sissu Valley Exploration',
      'River Rafting Experience on Beas River',
      'Discover Tosh, Kalga, and Pulga in Parvati Valley',
      'Jibhi Waterfall & Mini Thailand Trek',
      'Trek toward Serolsar Lake from Jalori Pass'
    ],
    itinerary: [
      {
        day: 0,
        title: 'Delhi to Manali – Overnight Bus Journey',
        description: [
          'Your journey over the Himalayas starts in the evening from Delhi.',
          'Before boarding the overnight Volvo bus journey to Manali, get to know your trip captain and other travellers. Enjoy the breathtaking overnight journey over the Himachal Pradesh foothills as the city lights dim.',
          'Leaving Delhi',
          'Meet and converse with other travelers',
          'An Comfortable Overnight Volvo Trip.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali and Local Exploration ( Greetings from the Valley of Gods )',
        description: [
          'Highlights of the day :',
          'Beautiful Scenic Trek To Jogni Waterfall',
          'Hidimba Temple & Mall Road Stroll',
          'Old Manali Cafe Hopping',
          'Arrive in Manali early and check in your hotel rooms. Prepare to visit the lovely town of Manali after showering and unwinding for a while.',
          'Morning Visit Jogni Waterfall - Jogini Waterfall — A beautiful hidden waterfall near Manali, reached via a scenic drive to Vashisht Village followed by a peaceful 1.5–2 hour easy trek through pine forests, apple orchards, and mountain trails, making it a perfect nature escape with breathtaking Himalayan views.',
          'Start by going to the well-known Hadimba Devi Temple, is a 16th-century wooden temple dedicated to Goddess Hadimba from the Mahabharata, famous for its unique pagoda-style architecture, rich history, and scenic setting amidst lush deodar forests in Manali.',
          'Later, discover Old Manali\'s quaint streets, which are renowned for their lively cafés, regional markets, and mountainous atmosphere.',
          'Meals Included',
          ' Dinner',
          'Overnight Stay in Manali.'
        ]
      },
      {
        day: 2,
        title: 'Manali - Atal Tunnel - Sissu - and Solang Valley Tour  ( A Day of Snowy Valleys and Peaks )',
        description: [
          'Highlights of the day :',
          'Sissu - A breathtaking Himalayan village in the beautiful Lahaul Valley.',
          'Atal Tunnel',
          'Solang Vallley - Snow Activities.',
          'After breakfast, embark on an adventurous journey down one of the most amazing mountain routes in India.',
          'One of the longest highway tunnels in the world, the famous Atal Tunnel is located above 10,000 feet.',
          'Enter the stunning Lahaul Valley, a frigid desert valley renowned for its snow-capped peaks, ancient Buddhist culture, quaint towns, and unadulterated Himalayan beauty, and experience a dramatic change in scenery as you go through the famous Atal Tunnel.',
          'Explore the small town of Sissu in the center of the stunning Lahaul Valley, which is renowned for its unspoiled Himalayan scenery, magnificent snow-covered mountains, pristine rivers, and old Buddhist traditions. Sissu, which is well-known for its breathtaking views of glaciers and waterfalls, provides the ideal fusion of peaceful mountains and natural beauty.',
          'On your journey back to Manali, make a stop in Solang Valley, a stunning Himalayan valley known for its snow-capped peaks, verdant meadows, expansive mountain views, and exhilarating adventure sports that have made it one of Himachal\'s most popular tourist destinations.',
          'Meals Included',
          'Breakfast & Dinner',
          'Overnight stay in Manali'
        ]
      },
      {
        day: 3,
        title: 'Manali to Kasol enroute experience River Rafting ( The Parvati Valley and Adventure ).',
        description: [
          'Highlights of the day',
          'River Rafting Experience ( Optional )',
          'Visit Manikaran Gurudwara',
          'Kasol Cafe Hopping',
          'After breakfast, depart from the hotel and go to Kasol, Himachal Pradesh\'s picturesque backpacker\'s paradise, which is well-known for its lively café culture, breathtaking vistas of the Parvati River, pine-covered mountains, and laid-back Himalayan charm.',
          'Enjoy an exciting rafting experience on the Beas River (optional activity), a scenic Himalayan river known for its crystal-clear waters and beautiful mountain valleys.',
          'Drive through scenic mountain roads to reach Parvati Valley, a serene Himalayan valley known for its pine forests, charming villages, hot springs, and stunning natural beauty.',
          'After check-in, spend the evening exploring Kasol, a charming riverside village known for its bohemian vibe, lively cafés, local markets, and scenic Parvati River trails.',
          'Meals included',
          'Breakfast and dinner',
          'Overnight stay in Kasol'
        ]
      },
      {
        day: 4,
        title: 'Parvati Valley\'s Undiscovered Treasures ( Discover Tosh, Kalga, and Pulga. )',
        description: [
          'Highlights of the day :',
          'Visit Tosh Village',
          'Visit Hidden Gem of parvati valley',
          'Kasol Chalal Short Trek & explore local kasol in the evening',
          'Today is devoted to exploring Parvati Valley\'s splendor.',
          'Begin your journey towards Barshaini, a peaceful Himalayan village and gateway to the scenic trails and charming hamlets of Parvati Valley.',
          'Discover Tosh, a quaint Himalayan community tucked away in the Parvati Valley that is well-known for its distinctive culture, wooden homes, picturesque mountain views, and relaxed atmosphere.',
          'Visit Pulga and Kalga later. These beautiful hidden treasures of the Parvati Valley are renowned for their apple orchards, thick pine forests, wooden houses, and tranquil Himalayan charm.',
          'Enjoy the serene Himalayan vibe throughout the day before returning to Kasol, known for its lively cafés and scenic Parvati River views, by evening.',
          'Meals included',
          'Breakfast and dinner',
          'Overnight stay in Kasol'
        ]
      },
      {
        day: 5,
        title: 'Kasol - Jibhi via Aut & Banjar Valley ( 75 - 85 Kms 3 - 4 Hrs Drive )',
        description: [
          'Highlights of the day :',
          'Jibhi Local Exploration.',
          'Jibhi Waterfall',
          'Mini Thailand',
          'Check out after breakfast and head to Jibhi, a serene village in the Banjar Valley renowned for its unspoiled Himalayan charm, pine trees, riverside beauty, and wooden homes.',
          'After arrival, check in to your hotel and relax amidst the peaceful surroundings before visiting Jibhi Waterfall, a hidden waterfall surrounded by lush greenery and serene Himalayan beauty.',
          'Proceed to Mini Thailand, a picturesque secret location renowned for its distinctive rock formations, glistening streams, wooden bridges, and tropical-like splendor amid the Himalayas.',
          'Explore the neighborhood\'s markets, cafés, and riverbank vistas in the evening.',
          'Meals included',
          'Breakfast and dinner',
          'Overnight stay in Jibhi'
        ]
      },
      {
        day: 6,
        title: 'Trek toward Serolsar Lake followed by Farewell',
        description: [
          'Highlights of the Day',
          'Serolsar Lake Small Beautiful Trail',
          'Depart from the Mountains',
          'For one of the trip\'s most breathtaking experiences, get up early.',
          'Travel to Jalori Pass and start the picturesque journey to the captivating Serolsar Lake. Serolsar Lake is reached via an easy and scenic trek of approximately 5–6 kms (one way) from Jalori Pass, taking around 2–3 hours to reach depending on pace. The trail passes through beautiful oak and pine forests with peaceful Himalayan surroundings, making the journey itself a magical experience.',
          'This immaculate lake, which is surrounded by thick pine and oak trees, is revered and has breathtaking natural beauty.',
          'Before hiking back, take a few quiet moments at the lake.',
          'After lunch, head back to Aut, where you\'ll catch your Volvo bus to Delhi for the night.',
          'Meals included',
          'Breakfast',
          'Overnight Volvo journey to Delhi.'
        ]
      },
      {
        day: 7,
        title: 'Arrival in Delhi.',
        description: [
          'Arrive in Delhi with endless stories from the mountains, amazing photos, new friendships, and priceless memories.',
          'The tour concludes with wonderful recollections of the Himalayas.'
        ]
      }
    ],
    included: [
      'Volvo Transfers from Delhi to Himachal & Back',
      'Tempo Traveller / Sumo for Entire Sightseeing',
      '5 Nights Accommodation on Triple / Quad Sharing Accommodation',
      'Daily Breakfast & Dinner (Breakfast excluded on Day 1 and Dinner excluded on Day 6)',
      'All Inner Line Permits',
      'Driver Allowance & Night Charges',
      'Toll Tax, Parking Charges & State Taxes',
      'Experienced Trip Captain Throughout the Journey',
      'One Bonfire Evening.'
    ],
    notIncluded: [
      'GST (5%) Extra',
      'Lunches and Additional Meals',
      'Mineral Water, Soft Drinks & Alcoholic Beverages',
      'Personal Expenses & Shopping',
      'Entry Fees to Monuments & Attractions',
      'Camera & Video Charges',
      'River Rafting and Other Adventure Activities',
      'Expenses Due to Natural Calamities, Roadblocks, Landslides or Weather Conditions',
      'Anything Not Specifically Mentioned Under Inclusions'
    ],
    overviewPoints: [
      'Route: Delhi → Manali → Sissu → Kasol → Jibhi → Serolsar Lake      → Delhi',
      'Duration: 5 Nights / 6 Days',
      'Trip Start Point: Delhi',
      'Trip End Point: Delhi',
      'Difficulty Level: Easy to Moderate',
      'Best Time to Visit: May – July & November – March',
      'Stay Plan: 2N Manali • 2N Kasol • 1N Jibhi',
      'Cost: 15,500 TS , 16,500/- DS'
    ],
    stays: [
      'Manali: Hotel Conifer/Related',
      'Kasol: The Royal Orchard Kasol/Related',
      'Jibhi: Red Apple Hotel/Related'
    ],
    costingDetails: [
      { label: 'Triple Sharing (TS)', value: '₹15,500' },
      { label: 'Double Sharing (DS)', value: '₹16,500' }
    ],
    batchDates: [
      {
        month: 'June',
        ranges: ['6th June - 12th June', '20th June - 26th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 10th July', '18th July - 24th July']
      },
      {
        month: 'Aug',
        ranges: ['1st Aug - 7th Aug', '15th Aug - 21st  Aug', '29th Aug - 4th Sept']
      },
      {
        month: 'Sept',
        ranges: ['12th Sept - 18th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 5th Oct']
      }
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-12', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-26', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-10', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-24', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-07', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-21', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-04', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-18', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 10 }
    ]
  },
  {
    id: '32',
    title: '5 Days Offbeat Himachal Group Trip',
    slug: '5-days-offbeat-himachal-group-trip',
    image: '/images/himachal.jpg',
    destination: 'Himachal Pradesh',
    region: 'Himachal',
    category: 'Himachal',
    description: `On this carefully constructed 5-Day Offbeat Group Adventure, escape the everyday and see the unspoiled charm of Himachal Pradesh. This trip offers the perfect balance of nature, adventure, culture, and leisure, from the tranquil forests of Jibhi and the clear waters of Serolsar Lake to the energetic streets of Manali, the stunning scenery of Sissu, and the hippy vibes of Kasol. Travel with like-minded adventurers and take in breathtaking mountain drives, secret waterfalls, lakes tucked away in cedar forests, quaint cafés, local communities, river rafting activities, and breathtaking Himalayan sunsets.`,
    duration: 5,
    nights: 4,
    price: 13500,
    rating: 4.8,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Delhi → Aut  → Jibhi → Serolsar Lake → Manali → Sissu  → Kasol → Delhi.',
      'Manali , Sissu , Atal Tunnel , Kasol , Chalal Trek , Jibhi , Serolsar Lake.',
      'Jibhi Local Exploration & Jibhi Waterfall',
      'Trek to Serolsar Lake & 360 Degree View Point',
      'Atal Tunnel & Sissu Valley Exploration',
      'Kasol Cafe Hopping & Chalal Village Trek'
    ],
    itinerary: [
      {
        day: 0,
        title: 'Delhi to Aut – Overnight Himalayan Escape Begins(Approx. 500–520 KM | 10–12 Hrs)',
        description: [
          'The group assembles in Delhi and boards an overnight Volvo bus towards Himachal Pradesh to begin the Himalayan adventure.',
          'Relax and enjoy the scenic journey as the bustling city lights slowly give way to peaceful valleys, winding mountain roads, rivers, and charming Himalayan landscapes.',
          'Overnight Volvo Journey',
          'Scenic drive through Himachal',
          'Meet fellow travellers',
          'Comfortable Overnight Bus Journey.'
        ]
      },
      {
        day: 1,
        title: 'Arrival at Aut – Welcome to the Hidden Paradise of Jibhi',
        description: [
          'Highlights of the day :',
          'Jibhi Local Exploration.',
          'Jibhi Waterfall',
          'Mini Thailand',
          'Arrive at Aut, where our team will assist you with your transfer to Jibhi, a peaceful Himalayan village known for its pine forests, riverside beauty, wooden cottages, and tranquil mountain charm.',
          'En route, enjoy scenic views of lush valleys, winding riverside roads, dense cedar forests, and charming Himalayan villages surrounded by breathtaking landscapes.',
          'After breakfast and hotel check-in, spend the day exploring the serene beauty and untouched charm of this hidden gem in Himachal Pradesh.',
          'Visit Jibhi Waterfall, a hidden waterfall surrounded by lush greenery and peaceful natural surroundings, perfect for photography and relaxation.',
          'Explore Mini Thailand, a scenic spot famous for its unique rock formations, crystal-clear waters, and tropical-like Himalayan beauty.',
          'Spend the evening discovering cozy riverside cafés in Jibhi, enjoying local cuisine, peaceful mountain vibes, and the calm atmosphere of the valley.',
          'Meals included',
          'Breakfast and dinner',
          'Overnight stay in Jibhi'
        ]
      },
      {
        day: 2,
        title: 'Trekking to Serolsar Lake and a 360-degree Himalayan View',
        description: [
          'Jibhi → Jalori Pass → Serolsar Lake → Jibhi',
          'Highlights of the Day',
          'Serolsar Lake Small Beautiful Trail',
          '360 Degree small trail View Point',
          'Wake up to the crisp mountain air and enjoy breakfast before heading towards Jalori Pass, a scenic high-altitude mountain pass famous for its panoramic Himalayan views, lush valleys, and dense pine forests.',
          'En route, admire breathtaking snow-capped peaks, winding mountain roads, cedar-covered landscapes, and picturesque Himalayan scenery throughout the journey.',
          'From Jalori Pass, begin a scenic trek through thick pine and oak forests towards Serolsar Lake,Serolsar Lake is reached via an easy and scenic trek of approximately 5–6 kms (one way) from Jalori Pass, taking around 2–3 hours to reach depending on pace. The trail passes through beautiful oak and pine forests with peaceful Himalayan surroundings, making the journey itself a magical experience.',
          'Enjoy an easy to moderate Himalayan trek surrounded by dense cedar forest trails, fresh mountain air, and stunning landscapes.',
          'Visit the famous 360° viewpoint near Serolsar Lake offering breathtaking panoramic views of the snow-covered Himalayan ranges and incredible photography opportunities.',
          'Spend the evening at leisure in Jibhi, exploring charming cafés, local markets, and enjoying a cozy bonfire session (subject to weather conditions).',
          'Meals included',
          'Breakfast and dinner',
          'Overnight stay in Jibhi.'
        ]
      },
      {
        day: 3,
        title: 'Jibhi to Manali via Kullu Valley & Naggar ( Distance 95 - 110 kms 4 - 5 Hrs )',
        description: [
          'Highlights of the day :',
          'Beautiful River Rafting Experience ( Optional Activity )',
          'Hidimba Temple & Mall Road Stroll',
          'Old Manali Cafe Hopping',
          'After breakfast, check out and drive towards Manali, a beautiful Himalayan hill station known for its snow-covered peaks, pine forests, vibrant cafés, and lively mountain culture.',
          'En route, witness scenic river valleys, winding mountain roads, apple orchards, charming villages, and breathtaking Himalayan landscapes throughout the journey.',
          'Adventure lovers can enjoy an exciting rafting experience on the Beas River (optional activity at extra cost), famous for its thrilling rapids and crystal-clear waters.',
          'Upon arrival, visit Hadimba Devi Temple, an ancient cedar forest temple admired for its unique wooden pagoda-style architecture and mythological significance.',
          'Explore the charming streets of Old Manali, known for its lively cafés, live music spots, and relaxed backpacker vibe.',
          'Spend time at Mall Road, famous for shopping, local handicrafts, vibrant markets, and delicious street food experiences.',
          'Enjoy café hopping in Manali and savor Himachali as well as international cuisines amidst beautiful mountain surroundings.',
          ' Meals included',
          'Breakfast and dinner',
          'Overnight stay in Manali.'
        ]
      },
      {
        day: 4,
        title: 'Atal Tunnel Tour of Sissu then Transfer to Kasol',
        description: [
          'Highlights of the day : ',
          'Sissu - A breathtaking Himalayan village in the beautiful Lahaul Valley.',
          'Atal Tunnel',
          'Solang Vallley - Snow Activities ( If Time Permits ).',
          'Kasol Cafe Hoping & Local Market Exploration.',
          'After breakfast, embark on one of the most scenic drives of the trip through the breathtaking Himalayan landscapes of Himachal Pradesh.',
          'En route, witness snow-capped peaks, dramatic valleys, waterfalls, winding mountain roads, riverside views, and stunning changing landscapes throughout the journey.',
          'Drive through the iconic Atal Tunnel, one of the world’s longest high-altitude road tunnels and a remarkable engineering marvel connecting Manali to the beautiful Lahaul Valley.',
          'Continue towards Sissu, a peaceful Himalayan village famous for its waterfalls, glacier views, riverside beauty, and magnificent mountain scenery.',
          'Later, proceed towards Kasol, the vibrant backpacker destination of Parvati Valley known for its lively cafés, riverside charm, and relaxed mountain vibe.',
          'Spend the evening exploring charming cafés, enjoying riverside walks, and relaxing amidst the peaceful atmosphere of Parvati Valley.',
          ' Meals included',
          'Breakfast and dinner',
          'Overnight stay in Kasol.'
        ]
      },
      {
        day: 5,
        title: 'Kasol Local Explorartion & Departure',
        description: [
          'Highlights of the day',
          'Kasol Market',
          'Visit Manikaran Gurudwara',
          'Experience Beautiful Trail To Chalal Village.',
          'Visit Manikaran Sahib, a famous Gurudwara known for its spiritual significance, peaceful atmosphere, and natural hot water springs nestled beside the Parvati River.',
          'Embark on the easy and scenic Chalal trek, surrounded by dense pine forests, riverside trails, and stunning valley views.',
          'Explore the vibrant markets of Kasol, known for local shopping, souvenirs, lively cafés, and its laid-back Himalayan vibe.',
          'Meals Included: Breakfast',
          'Board your overnight Volvo journey back to Delhi with unforgettable mountain memories.',
          ' Meals included',
          'Breakfast',
          'Overnight bus joruney.'
        ]
      }
    ],
    included: [
      'Volvo transfers from Delhi and back',
      'Tempo Traveller / Sumo for all sightseeing and transfers',
      '4 Nights accommodationTriple/Quad sharing accommodation',
      'Daily Breakfast & Dinner (Except Dinner on Departure Day)',
      'All inner-line permits required for the trip',
      'Driver allowance, toll taxes and parking charges',
      'Experienced Trip Captain throughout the journey',
      'One Bonfire Evening.'
    ],
    notIncluded: [
      'GST (5%) extra',
      ' Lunches and personal food expenses',
      'Mineral water, beverages and alcoholic drinks',
      'River rafting charges and adventure activities not mentioned',
      'Personal expenses, tips and shopping',
      'Monument entry tickets, camera fees etc.',
      'Expenses arising from natural calamities, road closures, weather conditions or unforeseen circumstances',
      'Anything not specifically mentioned under inclusions'
    ],
    overviewPoints: [
      'Route: Delhi → Aut  → Jibhi → Serolsar Lake → Manali → Sissu  → Kasol → Delhi.',
      'Duration: 4 Nights / 5 Days.',
      'Trip Start: Delhi',
      'Trip End: Delhi',
      'Difficulty Level: Easy to Moderate.',
      'Best Time to Visit: Summer May to July & Winters Nov - March.',
      'Major Highlights: Manali , Sissu , Atal Tunnel , Kasol , Chalal Trek , Jibhi , Serolsar Lake.',
      'Trip Cost : 13,500/- TS , 14,500 DS'
    ],
    thingsToCarry: [
      'Warm jacket & fleece layer',
      'Comfortable trekking shoes',
      'Thermal wear (winter departures)',
      'Sunglasses & sunscreen',
      'Personal medicines',
      'Power bank',
      'Water bottle',
      'Backpack/daypack',
      'Raincoat/Poncho (during monsoon)',
      'Valid Government ID Proof'
    ],
    stays: [
      'Jibhi: 2 Nights',
      'Manali: 1 Night',
      'Kasol: 1 Night'
    ],
    costingDetails: [
      { label: 'Triple Sharing (TS)', value: '₹13,500' },
      { label: 'Double Sharing (DS)', value: '₹14,500' }
    ],
    batchDates: [
      {
        month: 'June',
        ranges: ['6th June - 11th June', '20th June - 25th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 9th July', '18th July - 23rd July']
      },
      {
        month: 'Aug',
        ranges: ['1st Aug - 6th Aug', '15th Aug - 20nd  Aug', '29th Aug - 3rd Sept']
      },
      {
        month: 'Sept',
        ranges: ['12th Sept - 17th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 4th Oct']
      }
    ],
    dates: [
      { startDate: '2026-06-06', endDate: '2026-06-11', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-25', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-09', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-23', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-06', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-20', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-03', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-17', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-04', spots: 10 }
    ]
  },
  {
    id: '33',
    title: 'Mesmerising Himachal Family Getaway | 7 days & 6  nights',
    slug: 'mesmerising-himachal-family-getaway-7-days-6-nights',
    image: '/images/himachal.jpg',
    destination: 'Himachal Pradesh',
    region: 'Himachal',
    category: 'Himachal',
    description: `Snow-capped Dhauladhar peaks, fluttering monastery prayer flags, the cascading Bhagsunag Waterfall, and the serene Golden Temple of Amritsar come together to create an unforgettable Himachal Pradesh getaway. Commence your journey in Amritsar by witnessing the tranquil Golden Temple, which is a representation of peace and spirituality. Later, observe the thrilling and historically significant Beating Retreat Ceremony at the Wagah Border, which will encourage a patriotic spirit. After that, you travel to the scenic hill towns of Dalhousie and Dharamshala. Explore the magnificent meadows of Khajjiar, popularly referred to as the "Mini Switzerland of India," where you may relax in the middle of nature or take part in thrilling adventure sports. Proceed to Dharamshala, the tranquil "Little Lhasa," in which the Dalai Lama resides. See the serene Tibetan monastery, the enchanting Bhagsunag Waterfall, and the holy Chamunda Devi Temple in Kangra to receive blessings. This Dharamshala–Dalhousie retreat promises wonderful experiences amid stunning surroundings, offering the ideal balance of adventure, leisure, and spiritual zen. Embark on this captivating adventure from Amritsar and make lifelong memories.`,
    duration: 7,
    nights: 6,
    price: 0,
    rating: 4.8,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'India',
    highlights: [
      'Golden Temple',
      'Attari Border',
      'Khajjair',
      'Dalhousie',
      'Dharamshala',
      'Mcleodganj'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Amritsar',
        description: [
          "Meet our representative when you arrive in Amritsar, then proceed to your accommodation. Explore the city's colourful charm and rich culture after checking in and taking a quick refreshment break.",
          "See the electrifying Wagah Border Ceremony, a powerful demonstration of pride and patriotism, after visiting the calming Golden Temple, the spiritual heart of Sikhism.",
          "Return to the hotel and unwind with a comfortable overnight stay in Amritsar."
        ]
      },
      {
        day: 2,
        title: 'Amritsar – Dalhousie (Distance: 200km & Duration: 5 to 6 hours)',
        description: [
          'After breakfast, depart the hotel and begin your scenic adventure to Dalhousie, one of the most scenic hill stations in Himachal Pradesh.',
          'Arrive Dalhousie, a beautiful hill town surrounded by towering mountains and pine forests. Enjoy a quiet evening amid the serene Himalayan landscape after checking into your accommodation.',
          'Have a delicious meal and a restful night in Dalhousie.'
        ]
      },
      {
        day: 3,
        title: 'Dalhousie Local Sightseeing & Khajjiar Excursion',
        description: [
          'Following breakfast, take a full-day tour to Dalhousie and the charming Khajjiar, also referred to as the "Mini Switzerland of India."',
          'Visit attractions including:',
          'Khajjiar Meadows',
          'Gandhi Chowk & Mall Road',
          'Panchpula Waterfalls',
          'Subhash Baoli',
          'St. John\'s Church',
          'Enjoy wide landscapes of tranquil woodlands, lush scenery, and the Dhauladhar mountain ranges. At Khajjiar, families can enjoy extra adventure activities like zorbing, horseback riding, and nature walks.',
          'Return back to the hotel in the evening, have a relaxing dinner, and spend the night in Dalhousie in comfort.'
        ]
      },
      {
        day: 4,
        title: 'Dalhousie – Dharamshala (Distance: 120km & Duration: 4-5 hours)',
        description: [
          'Check out after breakfast and head to the tranquil hill town of Dharamshala, which is known for its Tibetan heritage, spiritual charm, and stunning natural beauty. Dharamshala is hidden away within the majestic Dhauladhar hills.',
          'After arriving, settle into your accommodation and relax in the tranquil mountain setting. After spending the evening relaxing, have a delicious meal at the hotel.',
          'Overnight stay at Dharmshala'
        ]
      },
      {
        day: 5,
        title: 'Dharamshala & McLeod Ganj Sightseeing',
        description: [
          'After breakfast, embark on a sightseeing tour of Dharamshala and McLeod Ganj.',
          'Visit:',
          'Tsuglagkhang Complex (Dalai Lama Temple)',
          'Namgyal Monastery',
          'Bhagsunag Temple & Waterfall',
          'St. John in the Wilderness Church',
          'Tibetan Market',
          'Naddi View Point',
          'Dal Lake',
          'Cricket Stadium Dharamshala (subject to accessibility)',
          'Experience the lively Tibetan culture of Dharamshala, see serene monasteries, peruse regional handicrafts, and take in the breath-taking views of the mountains',
          'Go back to the hotel for a restful evening, enjoy a delicious meal, and spend the night in Dharamshala.'
        ]
      },
      {
        day: 6,
        title: 'Dharamshala – Amritsar (Distance: 200 Km & Duration: 5-6 hours)',
        description: [
          'Check out of the hotel after breakfast and head to Amritsar.',
          'After arriving, check into your hotel and spend the evening relaxing. Discover the lively local markets, indulge in real Punjabi cuisine, or take in the Golden Temple\'s peaceful setting.',
          'Enjoy a relaxing and restful overnight stay in Amritsar.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Amritsar',
        description: [
          'Check out and head to the Amritsar Airport/Railway Station after breakfast, taking with you treasured memories of an amazing trip.',
          'Take home a treasure of priceless moments, amazing experiences, and lovely memories as your Himachal family vacation draws to a close.'
        ]
      }
    ],
    included: [
      '6 Night’s accommodation in deluxe category hotels on double sharing basis',
      'Daily breakfast & dinner',
      'Breakfast from Day 2 to Day 7',
      'Dinner from Day 1 to Day 6',
      'Private transportation from Amritsar to Amritsar',
      'Experienced chauffeur-cum-driver',
      'Toll taxes',
      'Driver allowances and night charges',
      'Parking charges',
      'All sightseeing as per itinerary by private vehicle'
    ],
    notIncluded: [
      'GST @ 5% extra',
      'Airfare / Train tickets',
      'Lunches and en-route meals',
      'Mineral water, beverages, alcoholic drinks and snacks',
      'Monument entry fees',
      'Camera and video camera charges',
      'Adventure activities and personal expenses',
      'Tips and porterage charges',
      'Expenses arising due to natural calamities, landslides, road blockages, weather conditions or unforeseen circumstances',
      'Medical and travel insurance',
      'Anything not specifically mentioned under "Package Inclusions"'
    ],
    overviewPoints: [
      'Route: Amritsar → Dalhousie  → Khajjair → Dalhousie  → Dharamshala → Mcleod Ganj  → Amritsar.',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Amritsar',
      'Trip End: Amritsar',
      'Difficulty Level: Easy.',
      'Best Time to Visit: Sumer May to July , Winters Nov - March.'
    ],
    thingsToCarry: [
      'Authentic Government ID Card',
      'Comfortable warm clothing like woollen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      '3-litre water bladder or water bottle'
    ],
    travelEssentials: [
      {
        title: 'Clothes',
        items: [
          'A sun cap and a woollen cap',
          'UV protected sunglasses',
          'One cotton long sleeve and 2 short sleeve t-shirts'
        ]
      }
    ],
    stays: [
      'Amritsar : Sarovar Portico / Similar',
      'Dalhousie : Hotel Nature Valley Inn / Similar',
      'Dharamshala : Hotel Indraprastha Resort & Spa / Similar'
    ],
    dates: []
  },
  {
    id: '34',
    title: '6 Days Wonderful Kashmir Group Trip',
    slug: '6-days-wonderful-kashmir-group-trip',
    image: '/images/kashmir.jpg',
    destination: 'Kashmir',
    region: 'Kashmir',
    category: 'Kashmir',
    description: 'All inclusive curated Best OffBeat Kashmir Group & customised Tour Packages 2026 covering Gurez Valley , Pahalgam , Doodhpathri , Bangus Valley , Aru Valley , Betaab Valley , Yusmarg , Chatpal , Dal Lake , Gulmarg , Srinagar , Chandanwari.',
    duration: 6,
    nights: 5,
    price: 21499,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'India',
    overviewPoints: [
      'Route: Srinagar → Gulmarg  → Pahalgam → Sonmarg → Thajiwas Glacier → Srinagar.',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Srinagar',
      'Trip End: Srinagar',
      'Difficulty Level: Easy.',
      'Best Time to Visit: Summer May to July & Winters Nov - March.',
      'Major Highlights: Dal Lake , Gulmarg Gondola Ride  , Aru Valley , Betaab Valley , Sonmarg Thajiwas Glacier..',
      'Trip Cost : 21,499/- (Triple Sharing) , 23,499 (Double Sharing)'
    ],
    highlights: [
      'Dal Lake',
      'Gulmarg Gondola Ride',
      'Aru Valley',
      'Betaab Valley',
      'Sonmarg Thajiwas Glacier'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival In Srinagar | Dal Lake, Mughal Gardens & Local Exploration.',
        description: [
          'Upon arriving at Srinagar Airport, meet our representative who will assist you with your transfer to your Hotel.',
          'Check into your Hotel and complete the check-in.',
          'Take some time to rest and settle into the calm surroundings of Dal Lake.',
          'Later, head out to explore the famous Mughal Gardens including Shalimar Bagh, Nishat Bagh, and Chashme Shahi.',
          'Walk through beautifully landscaped gardens, fountains, and terraces overlooking the lake.',
          'In the evening, enjoy a peaceful 1-hour Shikara ride on Dal Lake.',
          'Glide past floating markets and wooden houses, with views of the Pir Panjal ranges in the backdrop.',
          'Have your dinner, return to your hotel and unwind for the night.',
          'Overnight stay in Srinagar.'
        ]
      },
      {
        day: 2,
        title: 'Srinagar To Gulmarg via Tanmarg | Gondola Ride & Leisure Day. ( Distance 55 - 60 Kms 2 2.5 Hrs Drive )',
        description: [
          'Wake up to a hearty breakfast, check out and get ready for your transfer to Gulmarg.',
          'Enjoy a scenic 2-hour drive via Tangmarg, with views of pine forests and snow-covered peaks.',
          'On arrival, experience the famous Gulmarg Gondola ride, one of the highest in Asia.',
          'Enjoy panoramic views of the Kashmir Valley as you ascend.',
          'Later, check in to your hotel in Gulmarg and take some time to relax.',
          'Spend your time exploring the region at your own pace.',
          'You can visit Khilanmarg by pony (6 km away) or simply walk around the market and cafés.',
          'Return to your hotel in the evening and have dinner.',
          'Overnight stay in Gulmarg.'
        ]
      },
      {
        day: 3,
        title: 'Gulmarg To Pahalgam | En-Route Visit To Avantipur Ruins ( Distance 140 - 155 Kms 4 Hrs Drive )',
        description: [
          'Start your day with breakfast and get ready for your transfer to Pahalgam.',
          'Enjoy a scenic 4-hour drive through valleys and countryside landscapes.',
          'En route, we’ll stop at the Avantipur Ruins in Pulwama, known for their ancient temple architecture.',
          'On arrival in Pahalgam, check in to your hotel and spend the rest of the day at leisure.',
          'You can try activities like river rafting or angling in the Lidder River, or explore the local market for souvenirs.',
          'Return to your hotel by evening for dinner.',
          'Overnight stay in Pahalgam.'
        ]
      },
      {
        day: 4,
        title: 'Visit Aru Valley, Betaab Valley & Chandanwari | Transfer To Srinagar ( Distance 90 - 100 Kms Approx 3 Hrs Drive ).',
        description: [
          'Wake up to a fresh morning in Pahalgam and enjoy your breakfast.',
          'Get ready and board your transfer for a day of exploring the nearby valleys.',
          'Begin with Aru Valley, known for its wide meadows, clear streams, and mountain views.',
          'Continue to Betaab Valley, surrounded by lush greenery and known for its scenic Bollywood film locations.',
          'Later, visit Chandanwari, a rocky valley that marks the starting point of the Amarnath Yatra.',
          'You can also opt for a pony ride here (at your own cost), depending on the weather.',
          'After the sightseeing, board your transfer back to Srinagar.',
          'On arrival, check in to your hotel and unwind with dinner.',
          'Overnight stay in Srinagar.'
        ]
      },
      {
        day: 5,
        title: 'Excursion To Sonmarg & Thajiwas Glacier & Houseboat Stay in Srinagar.',
        description: [
          'Start your day with a hearty breakfast and get ready for an excursion to Sonmarg.',
          'Board your transfer for a scenic 3-hour drive through valleys and mountain roads.',
          'On the way, pass along the Sindh River, with views of flowing water, meadows, and snow-capped peaks.',
          'The journey itself feels as beautiful as the destination.',
          'On reaching Sonmarg, take some time to soak in the open landscapes and fresh mountain air.',
          'You can then opt for a pony ride to Thajiwas Glacier (at your own cost).',
          'Ride through rugged trails to reach the glacier and witness its snow-covered beauty up close.',
          'After spending some time here, begin your drive back to Srinagar.',
          'Reach your hotel by evening, followed by dinner.',
          'Overnight stay in Srinagar House Boat.'
        ]
      },
      {
        day: 6,
        title: 'Departure | Until The Valley Calls Again.',
        description: [
          'Wake up to your final morning in Srinagar and enjoy breakfast at the hotel.',
          'Pack your bags and complete the check-out formalities.',
          'We’ll drop you off at Srinagar Airport for your onward journey.',
          'Head home taking back beautiful memories of Kashmir.'
        ]
      }
    ],
    included: [
      'Entire travel as per the itinerary in a private vehicle',
      'Accommodation for 5 Nights on a Double/ Triple Sharing Basis (1 night in Srinagar in Houseboat, 2 nights in Srinagar in a hotel, 1 night in Pahalgam in a hotel, 1 night in Gulmarg in a hotel)',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 6 )',
      'Driver Charges, Permits, Tolls, Fuel & Parking charges',
      'Shikara Ride (1 Hr Shikara Ride)',
      'Internal transfer to Aru Valley, Betaab Valley and Chandanwari',
      'Gondola Cable Car Phase 1 tickets. ( Gondola ride tickets are subject to availability)',
      'Team Captain throughout the trip',
      'Medical kit',
      'All inner line permit if anything is applicable',
      'Mughal Gardens entry tickets',
      'Entry tickets to Aru Valley, Betaab Valley and Chandanwari',
      'Airport pick-up'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any other food or beverage charges that are not included in the package.',
      'Any other costing involved due to any kind of natural calamity, forced circumstances, which are out of our control.',
      'Any other expense not mentioned in the inclusion column.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, laundry, telephone bills, tips, etc',
      'Airport drop not included',
      'Pony Rides are not included',
      'Any other adventure activities which is not mentioned in the inclusions'
    ],
    stays: [
      'Srinagar : Hotel Central Park / Similar',
      'Gulmarg : Shaw Inn By Stay Pattern / Similar',
      'Pahalgham : Hotel The Pahalgam Shore / Similar',
      'Srinagar Houseboat : Akbar House Boat / Similar.'
    ],
    note: [
      'Numerous factors such as extreme weather conditions, road conditions, the physical ability of participants etc. may lead to changes in itinerary. We reserve the rights to change any schedule in the interest of safety, comfort and general wellbeing of guests.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customise trips for travellers beyond the mentioned age bracket.',
      'Gondola ride tickets are subject to availability. In the event of ticket unavailability, Wanderphilia will not be held liable. We will make every effort to provide you with an alternate option.',
      'Kindly schedule flights arriving in Srinagar before 11:30 AM as our local sightseeing tour commences at 01:00 PM.',
      'We can swap the Pahalgam stay with Gulmarg and vice versa based on weather conditions and hotel availability. This way, there will be no change in the sightseeing options, as the number of nights at each destination will remain the same.',
      'Airport pickup is at a fixed time (depending on the majority of arrival time of the group members).'
    ],
    batchDates: [
      { month: 'June', ranges: ['20th June - 25th June'] },
      { month: 'July', ranges: ['4th July - 9th July', '18th July - 23rd July'] },
      { month: 'August', ranges: ['1st Aug - 8th Aug', '15th Aug - 20th  Aug', '29th Aug - 2nd Sept'] },
      { month: 'September', ranges: ['12th Sept - 17th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 4th Oct'] }
    ],
    costingDetails: [
      { label: 'Triple Sharing (TS)', value: '₹21,499' },
      { label: 'Double Sharing (DS)', value: '₹23,499' }
    ],
    dates: [
      { startDate: '2026-06-20', endDate: '2026-06-25', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-09', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-23', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-08', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-20', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-02', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-17', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-04', spots: 10 }
    ]
  },
  {
    id: '35',
    title: '7 Days Exclusive Singapore with Universal Studios',
    slug: '7-days-exclusive-singapore-with-universal-studios',
    image: '/images/singapore.png',
    destination: 'Singapore',
    region: 'Singapore',
    category: 'Singapore',
    description: 'Arrive in Singapore and enjoy a comfortable private transfer to your hotel Mi Rochor. Explore Universal Studios, Sentosa Cable Car, SEA Aquarium, Harry Potter: Visions of Magic, Wings of Time Show, Singapore Flyer, Gardens by the Bay Flower Dome & Cloud Forest, Night Safari, and River Wonders.',
    duration: 7,
    nights: 6,
    price: 64999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'International',
    highlights: [
      'Universal Studios',
      'Sentosa Cable Car',
      'Harry Porter Vision Of Magic',
      'Guided Singapore City Tour',
      'Singapore Flyer',
      'Singapore River Wonders',
      'Singapore Night Safari',
      'Gardens By The Bay'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 | Welcome to the Garden City Singapore',
        description: [
          'Arrive in Singapore and enjoy a comfortable private transfer to your hotel Mi Rochor.',
          'Evening enjoy Gardens by the bay Flower Dome , Cloud Forest , Jurassic World',
          'A relaxed first evening allowing your little one to settle comfortably.',
          'Overnight in Singapore.'
        ]
      },
      {
        day: 2,
        title: 'Singapore City Tour With Singapore Flyer & Evening at Marina Bay Sands.',
        description: [
          'Morning After Relaxing Breakfast Discover the city beyond its attractions.',
          'City Tour Merlion, ParkCivic, District, Marina Bay, Esplanade, Singapore River.',
          'Later, soar above the city aboard the iconic Singapore Flyer and admire panoramic views of Singapore\'s stunning skyline.',
          'Evening End your day at Marina Bay Sands, where the glittering skyline, illuminated waterfront, and endless city views create a truly magical setting. As Singapore sparkles beneath the night sky, take a moment to pause, reflect, and cherish these beautiful memories with your loved ones.',
          'Overnight In Singapore.'
        ]
      },
      {
        day: 3,
        title: 'Universal Studios Singapore – A Day of Thrills & Family Fun',
        description: [
          'After breakfast, enjoy a comfortable private transfer to Universal Studios Singapore.',
          'Highlights Of The Day',
          'Hollywood Boulevard & character meet-and-greets',
          'Minion Land',
          'Sesame Street Spaghetti Space Chase',
          'Madagascar Zone',
          'Jurassic Park Rapids Adventure',
          'WaterWorld stunt show and other live performances.',
          'After your full day at the park, return comfortably to your hotel by private transfer.',
          'Overnight In Singapore.'
        ]
      },
      {
        day: 4,
        title: 'Sentosa Island – A Day Straight Out of a Storybook.',
        description: [
          'After breakfast, enjoy a comfortable private transfer to Sentosa Island.',
          'Today is all about fun, excitement and unforgettable family memories on Singapore\'s famous island playground.',
          'Begin with a scenic Cable Car ride offering stunning views of the city skyline and harbour.',
          'Highlights Of The Day',
          'Cable Car Experience',
          'SEA Aquarium',
          'Harry Potter: Visions of Magic',
          'Wings of Time Show',
          'Sentosa Beaches & Waterfront.',
          'Overnight In Singapore.'
        ]
      },
      {
        day: 5,
        title: 'Singapore Mandai Wildlife Pandas, Rainforests & Wildlife Encounters',
        description: [
          'After a leisurely breakfast and relaxed morning, head towards one of Singapore\'s most loved wildlife experiences.',
          'River Wonders',
          'Highlights: Giant Panda Forest , Red Pandas , Amazon River Quest , Giant River Creatures , Freshwater Aquarium Exhibits , River-themed Wildlife Habitats.',
          'Later In The Evening Experience Singapore Night Safari & Animal Show',
          'Night Safari As darkness falls, embark on a unique tram journey through the rainforest and discover the fascinating world of nocturnal wildlife.',
          'Highlights: Guided Tram Ride , Creatures of the Night Presentation , Leopard Trail , Fishing Cat Trail , Asian Elephants',
          'A truly magical Singapore experience that delights travellers of all ages.',
          'Overnight in Singapore.'
        ]
      },
      {
        day: 6,
        title: 'Day at Leisure in Singapore Shopping , Little India , China Town',
        description: [
          'Today is yours to enjoy Singapore at your own pace. Whether you prefer shopping, sightseeing, relaxation, or discovering hidden corners of the city, Singapore offers something for every traveller.',
          'You may choose to explore the vibrant streets of Chinatown and Little India, indulge in world-class shopping along Orchard Road, stroll through the beautiful Singapore Botanic Gardens, relax by the Marina Bay waterfront, or discover charming cafés and local neighbourhoods.',
          'For families, there are plenty of child-friendly attractions, interactive museums, parks, and playgrounds to enjoy, while food lovers can savour Singapore\'s famous culinary delights at local hawker centres and restaurants.',
          'Take this opportunity to slow down, explore what interests you most, and create your own memorable Singapore experiences.',
          'Overnight In Singapore.'
        ]
      },
      {
        day: 7,
        title: 'Farewell Singapore ❤️',
        description: [
          'Enjoy a relaxed morning at leisure.',
          'Depending on your flight schedule, spend some final moments exploring nearby attractions, shopping, or simply relaxing with your family.',
          'Later, enjoy a private transfer to Singapore Airport for your onward journey.',
          'Carry home wonderful memories, magical moments, and countless smiles from your Singapore family adventure.',
          'We hope to welcome you on another Wanderphilia journey soon.'
        ]
      }
    ],
    included: [
      '6 Nights Accommodation in 4 Star Hotel Mi Rochor.',
      'Private Airport Transfers',
      'Universal Studios Entry Tickets.',
      'Sentosa Cable Car , Sea Aquarium & Wings of Time Show 7:40 Show Entry Tickets',
      'Harry Potter Vision Of Magic Entry Tickets',
      'Guided City Tour with Singapore flyer',
      'Marina Bay Sky Deck Entry Tickets',
      'Gardens By The Bay Cloud Forest , Flower Dome & Jurassic World',
      'River Wonders & Night Safari Entry Tickets',
      'All Sightseeing On Private Basis.'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions',
      'Security deposit at the hotel',
      'Round trip flight'
    ],
    overviewPoints: [
      'Route: Singapore City Tour → Marina Bay Sands → Universal Studios → Sentosa Island → Mandai Wildlife → Leisure Day',
      'Duration: 6 Nights / 7 Days',
      'Trip Start: Singapore Airport',
      'Trip End: Singapore Airport',
      'Difficulty Level: Easy',
      'Best Time to Visit: Year-round',
      'Stays: Hotel Mi Rochor / Similar',
      'Cost: 64,999/-'
    ],
    stays: [
      'Hotel Mi Rochor / Similar'
    ],
    costingDetails: [
      { label: 'Per Person Price', value: '₹64,999' }
    ],
    dates: []
  },
  {
    id: '36',
    title: '7 Days Exclusive Sikkim with Gangtok Pelling Darjeeling',
    slug: '7-days-exclusive-sikkim-with-gangtok-pelling-darjeeling',
    image: '/images/sikkim.png',
    destination: 'Sikkim',
    region: 'Sikkim',
    category: 'Sikkim',
    description: 'Explore Gangtok, Baba Mandir, Tsogmo Lake, Pelling, and Darjeeling in this 7-day exclusive tour of Sikkim.',
    duration: 7,
    nights: 6,
    price: 24999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    overviewPoints: [
      'Route: Bagdogra/NJP Railway Station → Gangtok  → Baba Mandir → Tsogmo Lake → Pelling → Darjeeling → Bagdogra.',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Bagdogra/NJP Railway Station',
      'Trip End: Bagdogra/NJP Railway Station',
      'Best Time to Visit: Summer May to July Winter November - February'
    ],
    highlights: [
      'Baba Mandir',
      'Tsogmo Lake',
      'Nathula Pass',
      'Chardham Namchi',
      'Ravangla Park',
      'India’s first Skywalk at around 7,000 ft',
      'Tiger Hill',
      'Batasia Loop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 Arrival At Bagdogra/NJP | Transfer To Gangtok ( Approximately 125–130 km 4.5 to 5.5 hours Drive )',
        description: [
          'Arrive at Bagdogra Airport or NJP Railway Station, and meet our representative who will assist you with your transfer to Gangtok.',
          'Begin your 4 to 5 hour journey through scenic hill roads, passing tea gardens ( Outside View ) and forested slopes along the way.',
          'Reach Gangtok by Afternoon and check into your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Day 2 Excursion To Tsomgo Lake & Baba Mandir | Nathula Pass (Optional) ( Approx Distance: 120 Km • Est. Travel Time: 8 hrs )',
        description: [
          '(Note: Nathula Pass Closed on Monday).',
          '( Todays Excursion Additional Cost 6000 Per Vehicle).',
          'After an early breakfast, board your transfers towards Tsomgo Lake, a sacred glacial lake at 12,313 ft.',
          'Enjoy the scenic mountain drive with winding roads and views of snow-covered landscapes along the way.',
          'Spend some time by the lake, known for its changing colors and calm surroundings.',
          'You can also enjoy a short yak ride or simply walk along the shore.',
          'You can also try some maggie and momos at the various food stalls around the lake.',
          'Continue further to Baba Mandir, a revered shrine dedicated to Baba Harbhajan Singh, an Indian Army soldier.',
          'Later, you can also opt to visit Nathula Pass at 14,140 feet, near the Indo-China border (subject to permit and availability).',
          'After sightseeing, return to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 3,
        title: 'Day 3 Gangtok To Pelling | Enchey Monastery & Monk Blessing ( Approx Distance 130 Kms 6 Hrs )',
        description: [
          'After breakfast, check out from your hotel and begin your journey towards Pelling.',
          'Before leaving Gangtok, visit Enchey Monastery, a peaceful 200-year-old monastery set on a hilltop.',
          'Visit Namchi Chardham & Ravangla Park Enroute.',
          'Spend some time here and receive a traditional monk blessing.',
          'Then, we’ll head towards Pelling, which takes around 4–5 hours through winding hill roads and changing landscapes.',
          'Reach Pelling by evening and check in to your hotel.',
          'You can spend the evening at leisure either taking a short walk or enjoy views of the surrounding mountains from your stay.',
          'Overnight stay in Pelling.'
        ]
      },
      {
        day: 4,
        title: 'Day 4 Pelling Sightseeing With Skywalk Experience',
        description: [
          'After Breakfast embark on a sightseeing tour of pelling covering - Kanchenjunga falls, Penyang Monastery, Rimbi Waterfall, Khecheopalri Lake, Orange Garden, Rabdentse Ruins & Skywalk.',
          'We’ll begin with a visit to Khecheopalri Lake, a sacred lake set amidst dense forest, known for its calm waters and local beliefs.',
          'Continue towards Rimbi Waterfalls for scenic views and stop by the nearby Rimbi Orange Garden (seasonal) where you can walk along Orange Orchards.',
          'Next, explore Darap Village, known for its traditional wooden houses and quiet village setting.',
          'Later, visit the Skywalk complex, home to the Chenrezig Statue, one of the tallest in Sikkim.',
          'You can walk on India’s first Skywalk at around 7,000 ft, where the valley slopes and monastery complex just lie underneath your feet.',
          'Next, we’ll head to Pemayangtse Monastery, a 17th-century monastery known for its detailed woodwork and spiritual significance.',
          'From here, we’ll take a short 15 - 20 minute forest walk to reach the Rabdentse Ruins, the remains of the old Sikkim capital.',
          'Return to your hotel by evening and relax after a full day.',
          'Overnight stay in Pelling.'
        ]
      },
      {
        day: 5,
        title: 'Day 5 Pelling To Darjeeling | Transfer To The Queen of Hills ( Approx Distance 100 Kms 4 Hrs Drive )',
        description: [
          'Enjoy your breakfast, check out from your hotel and begin your journey towards Darjeeling.',
          'The drive takes around 3-4 hours, gradually opening into rolling tea estates like Happy Valley with neatly lined plantations.',
          'Reach Darjeeling, check in to your hotel and spend the rest of the evening at leisure.',
          'You can either take a walk along Mall Road ( On Your Own ) or relax at heritage cafés with a cup of fresh Darjeeling tea overlooking the hills.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 6,
        title: 'Day 6 Full Day Local Sightseeing In Darjeeling',
        description: [
          'Start your day early around 4:00 AM for the drive to Tiger Hill to see a magical sunrise.',
          'Watch the first light hit Mt. Kanchenjunga, turning the peaks golden, with distant views of Mt. Everest on clear days.',
          'On the way back, stop at Batasia Loop to take stunning photos, where the spiral railway track curves through landscaped gardens with mountain views.',
          'Visit the Gorkha War Memorial here, built in honor of soldiers from the region.',
          'Get back to your hotel for breakfast, and then step out to explore the town.',
          'We’ll visit the Himalayan Mountaineering Institute ( closed on Thursday ) , Tenzing Rock ( closed on Thursday ) and the nearby zoo, home to species like the red panda and snow leopard.',
          'Later, visit the Japanese Temple and Peace Pagoda, known for their quiet setting and views over the town.',
          'Enjoy The Toy Train Ride ( Optional )',
          'After a full day of sightseeing, get back to your hotel by evening and relax.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 7,
        title: 'Day 7 Departure | Farewell To The Queen Of Hills',
        description: [
          'Enjoy a tasty breakfast and then prepare to check out of your hotel.',
          'We’ll drop you off at Bagdogra Airport or NJP Railway Station for your journey back home.',
          'Board your onward journey, taking back memories of misty mornings, mountain views, and slow-paced days.'
        ]
      }
    ],
    included: [
      '6 Nights Accommodation As Mentioned In Hotel Section',
      'Transportation in Innova ( Or As Per the group size )',
      'Meal Plan Breakfast & Dinner ( Except for Breakfast Day 1 & Dinner Day 7  ',
      'Exclusive Non AC vehicle for transfers & sightseeing. Vehicle will not be at disposal it will be available to guest as per itinerary only (point to point basis).',
      'All Permit Fees & Hotel Taxes (as per itinerary)',
      'Rates are valid for INDIAN NATIONALS only'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Vehicle and Permit charges for the visit to Nathu-La Pass',
      'Any kind of food and beverages that is not included in the package like alcohol drinks, mineral water, meals/refreshment/lunches on the highway.',
      'Any personal expense like tip to the drivers, entry to the monuments. monasteries, camera/video camera charges, laundry, telephone bills, tips etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer on the spot)',
      'Anything not mentioned in the inclusion.',
      'Air fares/Train Tickets'
    ],
    stays: [
      'Gangtok : Udaan Keepsa Hotel / Similar',
      'Pelling : Udaan Pinecrest / Similar',
      'Darjeeling : Anutri Hill Resort / Similar'
    ],
    note: 'Valid ID proof (Voter ID / Passport / Driving Licence). PAN Card & Aadhar Card is not acceptable. In case of a child below 18 years bring Aadhar or Birth Certificate. 4 Passport sized photographs of each person.',
    thingsToCarry: [
      'Authentic Government ID Card (Voter ID, Passport, or Driving License)',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    costingDetails: [
      { label: 'Price Starting at', value: '₹24,999/-' },
      { label: 'Get Quote Option', value: 'Contact Us' }
    ],
    dates: []
  },
  {
    id: '37',
    title: '5 Days Romantic Getaway Gangtok & Darjeeling Couple Special',
    slug: '5-days-romantic-getaway-gangtok-darjeeling-couple-special',
    image: '/images/sikkim.png',
    destination: 'Sikkim',
    region: 'Sikkim',
    category: 'Sikkim',
    description: 'Experience a romantic 5-day getaway in Gangtok and Darjeeling, customized specifically for couples.',
    duration: 5,
    nights: 4,
    price: 21999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'India',
    overviewPoints: [
      'Route: Bagdogra/NJP Railway Station → Gangtok  → Baba Mandir → Tsogmo Lake → Darjeeling → Bagdogra/NJP Railway Station.',
      'Duration: 4 Nights / 5 Days.',
      'Trip Start: Bagdogra/NJP Railway Station',
      'Trip End: Bagdogra/NJP Railway Station',
      'Best Time to Visit: Summer May to July Winter November - February'
    ],
    highlights: [
      'Baba Mandir',
      'Tsogmo Lake',
      'Nathula Pass',
      'Tiger Hill',
      'Batasia Loop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 Arrival At Bagdogra/NJP | Transfer To Gangtok ( Approximately 125–130 km 4.5 to 5.5 hours Drive )',
        description: [
          'Arrive at Bagdogra Airport or NJP Railway Station, and meet our representative who will assist you with your transfer to Gangtok.',
          'Begin your 4 to 5 hour journey through scenic hill roads, passing tea gardens ( Outside View ) and forested slopes along the way.',
          'Reach Gangtok by Afternoon and check into your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Day 2 Excursion To Tsomgo Lake & Baba Mandir | Nathula Pass (Optional) ( Approx Distance: 120 Km • Est. Travel Time: 8 hrs )',
        description: [
          '(Note: Nathula Pass Closed on Monday).',
          '( Todays Excursion Additional Cost 6000 Per Vehicle).',
          'After an early breakfast, board your transfers towards Tsomgo Lake, a sacred glacial lake at 12,313 ft.',
          'Enjoy the scenic mountain drive with winding roads and views of snow-covered landscapes along the way.',
          'Spend some time by the lake, known for its changing colors and calm surroundings.',
          'You can also enjoy a short yak ride or simply walk along the shore.',
          'You can also try some maggie and momos at the various food stalls around the lake.',
          'Continue further to Baba Mandir, a revered shrine dedicated to Baba Harbhajan Singh, an Indian Army soldier.',
          'Later, you can also opt to visit Nathula Pass at 14,140 feet, near the Indo-China border (subject to permit and availability).',
          'After sightseeing, return to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 3,
        title: 'Day 3 Gangtok To Darjeeling | Transfer To The Queen of Hills ( Approx Distance 100 Kms 4 Hrs Drive )',
        description: [
          'Enjoy your breakfast, check out from your hotel and begin your journey towards Darjeeling.',
          'The drive takes around 3-4 hours, gradually opening into rolling tea estates like Happy Valley with neatly lined plantations.',
          'Reach Darjeeling, check in to your hotel and spend the rest of the evening at leisure.',
          'You can either take a walk along Mall Road ( On Your Own ) or relax at heritage cafés with a cup of fresh Darjeeling tea overlooking the hills.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 4,
        title: 'Day 4 Full Day Local Sightseeing In Darjeeling',
        description: [
          'Start your day early around 4:00 AM for the drive to Tiger Hill to see a magical sunrise.',
          'Watch the first light hit Mt. Kanchenjunga, turning the peaks golden, with distant views of Mt. Everest on clear days.',
          'On the way back, stop at Batasia Loop to take stunning photos, where the spiral railway track curves through landscaped gardens with mountain views.',
          'Visit the Gorkha War Memorial here, built in honor of soldiers from the region.',
          'Get back to your hotel for breakfast, and then step out to explore the town.',
          'We’ll visit the Himalayan Mountaineering Institute ( closed on Thursday ) , Tenzing Rock ( closed on Thursday ) and the nearby zoo, home to species like the red panda and snow leopard.',
          'Later, visit the Japanese Temple and Peace Pagoda, known for their quiet setting and views over the town.',
          'Enjoy The Toy Train Ride ( Optional )',
          'After a full day of sightseeing, get back to your hotel by evening and relax.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 5,
        title: 'Day 5 Departure | Farewell To The Queen Of Hills',
        description: [
          'Enjoy a tasty breakfast and then prepare to check out of your hotel.',
          'We’ll drop you off at Bagdogra Airport or NJP Railway Station for your journey back home.',
          'Board your onward journey, taking back memories of misty mornings, mountain views, and slow-paced days.'
        ]
      }
    ],
    included: [
      '4 Nights Accommodation As Mentioned In Hotel Section',
      'Transportation in Innova ( Or As Per the group size )',
      'Meal Plan Breakfast & Dinner ( Except for Breakfast Day 1 & Dinner Day 7  ',
      'Exclusive Non AC vehicle for transfers & sightseeing. Vehicle will not be at disposal it will be available to guest as per itinerary only (point to point basis).',
      'All Permit Fees & Hotel Taxes (as per itinerary)',
      'Rates are valid for INDIAN NATIONALS only'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Vehicle and Permit charges for the visit to Nathu-La Pass',
      'Any kind of food and beverages that is not included in the package like alcohol drinks, mineral water, meals/refreshment/lunches on the highway.',
      'Any personal expense like tip to the drivers, entry to the monuments. monasteries, camera/video camera charges, laundry, telephone bills, tips etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer on the spot)',
      'Anything not mentioned in the inclusion.',
      'Air fares/Train Tickets'
    ],
    stays: [
      'Gangtok : Udaan Keepsa Hotel / Similar',
      'Darjeeling : Anutri Hill Resort / Similar'
    ],
    note: 'Note:- Valid ID proof (Voter ID / Passport / Driving Licence). PAN Card & Aadhar Card is not acceptable. In case of a child below 18 years bring Aadhar or Birth Certificate. 4 Passport sized photographs of each person.',
    thingsToCarry: [
      'Authentic Government ID Card (Voter ID, Passport, or Driving License)',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    costingDetails: [
      { label: 'Price Starting at', value: '₹21,999/-' },
      { label: 'Get Quote Option', value: 'Contact Us' }
    ],
    dates: []
  },
  {
    id: '38',
    title: '7 Days Wonderful Sikkim Darjeeling with Mirik',
    slug: '7-days-wonderful-sikkim-darjeeling-with-mirik',
    image: '/images/sikkim.png',
    destination: 'Sikkim',
    region: 'Sikkim',
    category: 'Sikkim',
    description: 'Discover Sikkim and Darjeeling, including a beautiful day excursion to the peaceful lakeside town of Mirik.',
    duration: 7,
    nights: 6,
    price: 25499,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    overviewPoints: [
      'Route: Bagdogra/NJP Railway Station → Gangtok  → Baba Mandir → Tsogmo Lake → Pelling → Darjeeling → Bagdogra.',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Bagdogra/NJP Railway Station',
      'Trip End: Bagdogra/NJP Railway Station',
      'Best Time to Visit: Summer May to July Winter November - February'
    ],
    highlights: [
      'Baba Mandir',
      'Tsogmo Lake',
      'Nathula Pass',
      'Chardham Namchi',
      'Ravangla Park',
      'India’s first Skywalk at around 7,000 ft',
      'Tiger Hill',
      'Batasia Loop',
      'Mirik'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 Arrival At Bagdogra/NJP | Transfer To Gangtok ( Approximately 125–130 km 4.5 to 5.5 hours Drive )',
        description: [
          'Arrive at Bagdogra Airport or NJP Railway Station, and meet our representative who will assist you with your transfer to Gangtok.',
          'Begin your 4 to 5 hour journey through scenic hill roads, passing tea gardens ( Outside View ) and forested slopes along the way.',
          'Reach Gangtok by Afternoon and check into your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Day 2 Excursion To Tsomgo Lake & Baba Mandir | Nathula Pass (Optional) ( Approx Distance: 120 Km • Est. Travel Time: 8 hrs )',
        description: [
          '(Note: Nathula Pass Closed on Monday).',
          '( Todays Excursion Additional Cost 6000 Per Vehicle).',
          'After an early breakfast, board your transfers towards Tsomgo Lake, a sacred glacial lake at 12,313 ft.',
          'Enjoy the scenic mountain drive with winding roads and views of snow-covered landscapes along the way.',
          'Spend some time by the lake, known for its changing colors and calm surroundings.',
          'You can also enjoy a short yak ride or simply walk along the shore.',
          'You can also try some maggie and momos at the various food stalls around the lake.',
          'Continue further to Baba Mandir, a revered shrine dedicated to Baba Harbhajan Singh, an Indian Army soldier.',
          'Later, you can also opt to visit Nathula Pass at 14,140 feet, near the Indo-China border (subject to permit and availability).',
          'After sightseeing, return to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 3,
        title: 'Day 3 Gangtok To Pelling Via Ravangla | Enchey Monastery & Monk Blessing ( Approx Distance 130 Kms 6 Hrs )',
        description: [
          'After breakfast, check out from your hotel and begin your journey towards Pelling.',
          'Before leaving Gangtok, visit Enchey Monastery, a peaceful 200-year-old monastery set on a hilltop.',
          'Visit Namchi Chardham & Ravangla Park Enroute.',
          'Spend some time here and receive a traditional monk blessing.',
          'Then, we’ll head towards Pelling, which takes around 4–5 hours through winding hill roads and changing landscapes.',
          'Reach Pelling by evening and check in to your hotel.',
          'You can spend the evening at leisure either taking a short walk or enjoy views of the surrounding mountains from your stay.',
          'Overnight stay in Pelling.'
        ]
      },
      {
        day: 4,
        title: 'Day 4 Pelling Sightseeing With Skywalk Experience Transfer To Darjeeling ( Approx Distance 100 Kms 4 Hrs Drive )',
        description: [
          'After Breakfast embark on a sightseeing tour of pelling covering - Kanchenjunga falls, Penyang Monastery, Rimbi Waterfall, Khecheopalri Lake, Orange Garden, Rabdentse Ruins & Skywalk.',
          'Visit the Skywalk complex and the towering Chenrezig Statue, one of the tallest in Sikkim.',
          'Walk on the glass Skywalk at around 7,000 ft, where you can see the valley slopes and monastery structures beneath your feet.',
          'Next, we’ll head to Pemayangtse Monastery, a 17th-century monastery known for its detailed woodwork and spiritual significance.',
          'From here, take a short 15 - 20 minute forest walk to reach the Rabdentse Ruins, the remains of the old Sikkim capital.',
          'After sightseeing, we’ll begin our journey towards Darjeeling, which takes around 4–5 hours.',
          'Reach Darjeeling by evening and check in to your hotel.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 5,
        title: 'Day 5 Mirik Excursion | Lakeside & Tea Gardens',
        description: [
          'After breakfast, head out for a day trip to Mirik, a quiet hill town located around 2 hours from Darjeeling.',
          'On arrival, we’ll visit Sumendu Lake, surrounded by pine forests and connected by a curved footbridge.',
          'Take a walk along the lakeside or simply relax by the water.',
          'You can also opt for a short boat ride on the lake or explore the nearby viewpoints.',
          'Spend some time around the tea gardens of Mirik, where neatly lined plantations stretch across the slopes.',
          'Later, return to Darjeeling by evening and enjoy your time at leisure.',
          'You can take a walk around Chowrasta ( On Your Own ) , watch the town slowly light up, or sit at a heritage café with a cup of Darjeeling tea.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 6,
        title: 'Day 6 Full Day Local Sightseeing In Darjeeling Toy Train Ride',
        description: [
          'Start your day early around 4:00 AM for the drive to Tiger Hill to see a magical sunrise.',
          'Watch the first light hit Mt. Kanchenjunga, turning the peaks golden, with distant views of Mt. Everest on clear days.',
          'On the way back, stop at Batasia Loop to take stunning photos, where the spiral railway track curves through landscaped gardens with mountain views.',
          'Visit the Gorkha War Memorial here, built in honor of soldiers from the region.',
          'Get back to your hotel for breakfast, and then step out to explore the town.',
          'We’ll visit the Himalayan Mountaineering Institute ( closed on Thursday ) , Tenzing Rock ( closed on Thursday ) and the nearby zoo, home to species like the red panda and snow leopard.',
          'Later, visit the Japanese Temple and Peace Pagoda, known for their quiet setting and views over the town.',
          'Enjoy The Toy Train Ride ( Optional )',
          'After a full day of sightseeing, get back to your hotel by evening and relax.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 7,
        title: 'Day 7 Departure | Farewell To The Queen Of Hills',
        description: [
          'Enjoy a tasty breakfast and then prepare to check out of your hotel.',
          'We’ll drop you off at Bagdogra Airport or NJP Railway Station for your journey back home.',
          'Board your onward journey, taking back memories of misty mornings, mountain views, and slow-paced days.'
        ]
      }
    ],
    included: [
      '6 Nights Accommodation As Mentioned In Hotel Section',
      'Transportation in Innova ( Or As Per the group size )',
      'Meal Plan Breakfast & Dinner ( Except for Breakfast Day 1 & Dinner Day 7  ',
      'Exclusive Non AC vehicle for transfers & sightseeing. Vehicle will not be at disposal it will be available to guest as per itinerary only (point to point basis).',
      'All Permit Fees & Hotel Taxes (as per itinerary)',
      'Rates are valid for INDIAN NATIONALS only'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Vehicle and Permit charges for the visit to Nathu-La Pass',
      'Any kind of food and beverages that is not included in the package like alcohol drinks, mineral water, meals/refreshment/lunches on the highway.',
      'Any personal expense like tip to the drivers, entry to the monuments. monasteries, camera/video camera charges, laundry, telephone bills, tips etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer on the spot)',
      'Anything not mentioned in the inclusion.',
      'Air fares/Train Tickets'
    ],
    stays: [
      'Gangtok : Udaan Keepsa Hotel / Similar',
      'Pelling : Udaan Pinecrest / Similar',
      'Darjeeling : Anutri Hill Resort / Similar'
    ],
    note: 'Note:- Valid ID proof (Voter ID / Passport / Driving Licence). PAN Card & Aadhar Card is not acceptable. In case of a child below 18 years bring Aadhar or Birth Certificate. 4 Passport sized photographs of each person.',
    thingsToCarry: [
      'Authentic Government ID Card (Voter ID, Passport, or Driving License)',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    costingDetails: [
      { label: 'Price Starting at', value: '₹25,499/-' },
      { label: 'Get Quote Option', value: 'Contact Us' }
    ],
    dates: []
  },
  {
    id: '39',
    title: '10 Days Offbeat & Adventure Sikkim Wanderphilia Exclusive',
    slug: '10-days-offbeat-adventure-sikkim-wanderphilia-exclusive',
    image: '/images/sikkim.png',
    destination: 'Sikkim',
    region: 'Sikkim',
    category: 'Sikkim',
    description: 'An ultimate 10-day offbeat adventure through Sikkim including Lachen, Lachung, Gurudongmar Lake, and Zuluk along the Old Silk Route.',
    duration: 11,
    nights: 10,
    price: 45499,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    overviewPoints: [
      'Route: Bagdogra/NJP Railway Station → Gangtok  → Lachen → Lachung → Gangtook → Zuluk → Baba Mandir → Tsogmo Lake → Darjeeling → Bagdogra/NJP Railway Station.',
      'Duration: 9 Nights / 10 Days.',
      'Trip Start: Bagdogra/NJP Railway Station',
      'Trip End: Bagdogra/NJP Railway Station',
      'Best Time to Visit: Summer May to July Winter November - February'
    ],
    highlights: [
      'Gurudongmar Lake',
      'Yumthang Valley',
      'Baba Mandir',
      'Tsogmo Lake',
      'Nathula Pass',
      'Zuluk',
      'Tiger Hill',
      'Batasia Loop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 Arrival At Bagdogra/NJP | Transfer To Gangtok ( Approximately 125–130 km 4.5 to 5.5 hours Drive )',
        description: [
          'Arrive at Bagdogra Airport or NJP Railway Station, and meet our representative who will assist you with your transfer to Gangtok.',
          'Begin your 4 to 5 hour journey through scenic hill roads, passing tea gardens ( Outside View ) and forested slopes along the way.',
          'Reach Gangtok by evening and check into your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Day 2 Excursion To Tsomgo Lake & Baba Mandir | Nathula Pass (Optional) ( Approx Distance: 120 Km • Est. Travel Time: 8 hrs )',
        description: [
          '(Note: Nathula Pass Closed on Monday).',
          '( Todays Excursion Additional Cost 6000 Per Vehicle).',
          'After an early breakfast, board your transfers towards Tsomgo Lake, a sacred glacial lake at 12,313 ft.',
          'Enjoy the scenic mountain drive with winding roads and views of snow-covered landscapes along the way.',
          'Spend some time by the lake, known for its changing colors and calm surroundings.',
          'You can also enjoy a short yak ride or simply walk along the shore.',
          'You can also try some maggie and momos at the various food stalls around the lake.',
          'Continue further to Baba Mandir, a revered shrine dedicated to Baba Harbhajan Singh, an Indian Army soldier.',
          'Later, you can also opt to visit Nathula Pass at 14,140 feet, near the Indo-China border (subject to permit and availability).',
          'After sightseeing, return to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 3,
        title: 'Day 3 Gangtok To Lachen | Transfer Via Mangan & Chungthang ( Approx 110 120  kms 5 - 6  Hrs Drive )',
        description: [
          'Wake up to a beautiful morning in Gangtok and have your breakfast.',
          'Next, begin your journey towards Lachen, a remote mountain village tucked away in North Sikkim, far from the usual tourist trail.',
          'The drive takes around 6–7 hours, following the Teesta River and gradually ascending into higher altitudes.',
          'On the way, you\'ll pass through Mangan, a small hill town often called the gateway to North Sikkim, with local markets and hillside homes.',
          'Along the way, you will pass through:',
          'Kabi Lungchok – A historically significant site marking the blood brotherhood treaty between the Lepcha and Bhutia communities.',
          'Seven Sisters Waterfall – One of the most photographed waterfalls in North Sikkim.',
          'Naga Waterfall – A stunning multi-tiered waterfall surrounded by lush greenery.',
          'Mangan – The district headquarters of North Sikkim and a popular refreshment stop.',
          'Singhik View Point – Offers breathtaking views of Mt. Kanchenjunga and the Teesta Valley (weather permitting).',
          'A little ahead comes Chungthang, where you can spot the meeting point of the Lachen Chu and Lachung Chu rivers set against the mountains.',
          'Overnight in Lachen.'
        ]
      },
      {
        day: 4,
        title: 'Day 4 Lachen To Lachung | Excursion To Gurudongmar Lake ( Approx 55 60 Kms 2 3 Hrs Drive )',
        description: [
          'Have your breakfast early and start your journey to Gurudongmar Lake.',
          'Enjoy the 3-4 hour drive, passing through high-altitude landscapes and rugged mountain terrain.',
          'En route, you will pass through Thangu Village (13450ft), a remote high-altitude village of Tibetan Nomads.',
          'Reach the surreal Gurudongmar Lake (17,800 ft), one of the highest lakes in the world.',
          'Spend some time here exploring the vast, barren surroundings, turquoise waters, and snow-covered peaks reflecting on the lake\'s surface.',
          'Due to the altitude, we\'ll make a brief stop and then begin the return journey.',
          'Then, we\'ll head towards Lachung via Chungthang, where the Lachen Chu and Lachung Chu rivers meet.',
          'Reach Lachung by evening and check in to your stay.',
          'Spend the evening at leisure, relaxing in this quiet mountain village surrounded by forests and waterfalls.',
          'Overnight stay in Lachung.'
        ]
      },
      {
        day: 5,
        title: 'Day 5 Excursion To Yumthang Valley | Optional Visit to Zero Point ( Approx 25 kms One Way 1 1.5 Hrs One Way )',
        description: [
          'Have your breakfast early and get ready for an exciting adventure.',
          'Today, we\'ll head to Yumthang Valley, located about 25 km from Lachung.',
          'Known as the "Valley of Flowers," this region is filled with alpine meadows, flowing rivers, and snow-covered peaks in the distance.',
          'Spend some time walking through the valley, crossing small streams, and soaking in the wide open landscapes.',
          'Depending on the season, you\'ll either see blooming rhododendrons or a blanket of snow covering the valley.',
          'You can also choose to visit Zero Point, where the road ends close to the Indo-China border (subject to weather and permits).',
          'Later, return to Lachung for an overnight stay.',
          'Overnight Stay in Lachung.'
        ]
      },
      {
        day: 6,
        title: 'Day 6 Transfer From Lachung To Gangtok | Leisure Time ( Approx 115 - 120 kms 5-6 Hrs Drive )',
        description: [
          'Enjoy your breakfast in Lachung and then check out of the hotel.',
          'We\'ll begin our journey back to Gangtok, passing through Chungthang and following the Teesta River.',
          'By the time we reach Gangtok, the familiar buzz of the town sets in again.',
          'Check in and settle into your hotel and relax after the long drive.',
          'You can step out to explore MG Marg ( On Your Own ) in the evening, to try hot momos, sip on local tea, or just walk through the lively street.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 7,
        title: 'Day 7 Gangtok To Zuluk | Into The Old Silk Route ( Approx 90 100 Kms 4 - 5 Hrs Drive )',
        description: [
          'After a filling breakfast, proceed to check out of the hotel.',
          'Board your transfer towards Zuluk, a hidden mountain hamlet tucked along the historic Old Silk Route, far away from the usual touristy spots.',
          'Along the way, you will pass through:',
          'Rongli – The gateway to the Old Silk Route and permit checkpoint.',
          'Lush Pine Forests – Dense forests and winding mountain roads.',
          'Historic Silk Route – Once an important trade route connecting India and Tibet.',
          'Padamchen – A charming Himalayan village surrounded by forests and mist-covered mountains.',
          'Panoramic Mountain Landscapes – Spectacular views of valleys, clouds, and rugged Himalayan terrain.',
          'Wanderphilia Signature Moment  - As dusk settles over the mountains, witness the clouds drifting through the valleys while the silence of the Himalayas creates a truly magical experience—an unforgettable evening on the legendary Old Silk Route.',
          'Overnight In Zuluk.'
        ]
      },
      {
        day: 8,
        title: 'Day 8 Zuluk To Pelling | Into The West Sikkim ( Approx 150 170 kms 6 - 8 Hrs Drive )',
        description: [
          'Wake up to a crisp mountain morning in Zuluk and enjoy your breakfast.',
          'Today, we leave behind the rugged terrain of the Old Silk Route and head towards Pelling in West Sikkim.',
          'Along the way, you will pass through:',
          'Thambi View Point – Famous for its iconic zig-zag roads and breathtaking Himalayan panoramas.',
          'Lungthung View Point – Spectacular views of the Eastern Himalayas (weather permitting).',
          'Ravangla Region – Known for its seasonal beauty, offering vistas of mountains and deep valleys.',
          'Traditional Sikkimese Villages – Offering glimpses into local culture and mountain life.',
          'Overnight Stay in Pelling.'
        ]
      },
      {
        day: 9,
        title: 'Day 9 Half-Day Pelling Sightseeing with Skywalk | Transfer To Darjeeling ( Approx Distance 100 Kms 4 Hrs Drive )',
        description: [
          'Enjoy your breakfast and get ready to explore some of Pelling\'s key highlights.',
          'Visit the Skywalk complex and Chenrezig Statue, one of the tallest in the world.',
          'Experience walking on India\'s first skywalk at 7,000 ft with the valley and monastery below you.',
          'Next, we\'ll head to Pemayangtse Monastery, a 17th century marvel known for its peaceful setting and detailed woodwork.',
          'From here, take a short 15–20 minute forest walk to reach the Rabdentse Ruins, the ancient Sikkim capital, overlooking the valley.',
          'After sightseeing, we\'ll begin the 4-5 hours journey towards Darjeeling.',
          'By evening, you\'ll reach Darjeeling and check into your stay.',
          'You can step out later for a short walk around Chowrasta ( On Your Own ) or relax at a café overlooking the tea estates.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 10,
        title: 'Day 10 Full Day Local Sightseeing In Darjeeling',
        description: [
          'Start your day early around 4:00 AM for the drive to Tiger Hill to see a magical sunrise.',
          'Watch the first light hit Mt. Kanchenjunga, turning the peaks golden, with distant views of Mt. Everest on clear days.',
          'On the way back, stop at Batasia Loop to take stunning photos, where the spiral railway track curves through landscaped gardens with mountain views.',
          'Visit the Gorkha War Memorial here, built in honor of soldiers from the region.',
          'Get back to your hotel for breakfast, and then step out to explore the town.',
          'We’ll visit the Himalayan Mountaineering Institute ( closed on Thursday ) , Tenzing Rock ( closed on Thursday ) and the nearby zoo, home to species like the red panda and snow leopard.',
          'Later, visit the Japanese Temple and Peace Pagoda, known for their quiet setting and views over the town.',
          'Enjoy The Toy Train Ride ( Optional )',
          'After a full day of sightseeing, get back to your hotel by evening and relax.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 11,
        title: 'Day 11 Departure | Farewell To The Queen Of Hills',
        description: [
          'Enjoy a tasty breakfast and then prepare to check out of your hotel.',
          'We’ll drop you off at Bagdogra Airport or NJP Railway Station for your journey back home.',
          'Board your onward journey, taking back memories of misty mornings, mountain views, and slow-paced days.'
        ]
      }
    ],
    included: [
      '10 Nights Accommodation As Mentioned In Hotel Section',
      'Transportation in Innova/Xylo ( Or As Per the group size )',
      'Meal Plan Breakfast & Dinner ( Except for Breakfast Day 1 & Dinner Day 11  ',
      'Exclusive Non AC vehicle for transfers & sightseeing. The vehicle will not be at disposal; it will be available to guests as per itinerary only (point to point basis).',
      'All Permit Fees & Hotel Taxes (as per itinerary)',
      'Rates are valid for INDIAN NATIONALS only'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Vehicle and Permit charges for the visit to Nathu-La Pass and Zero Point.',
      'Any kind of food and beverages that is not included in the package like alcohol drinks, mineral water, meals/refreshment/lunches on the highway.',
      'Any personal expense like tip to the drivers, entry to the monuments. monasteries, camera/video camera charges, laundry, telephone bills, tips etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer on the spot)',
      'Anything not mentioned in the inclusion.',
      'Air fares/Train Tickets'
    ],
    stays: [
      'Gangtok : Udaan Keepsa Hotel / Similar',
      'Lachen : Rufina Blue Pine Lachen / Similar',
      'Lachung : Magellan’s The Golden Bridge / Similar',
      'Zuluk : Voyage Glenz Resort / Similar',
      'Pelling : Udaan Pinecrest / Similar',
      'Darjeeling : Anutri Hill Resort / Similar'
    ],
    note: 'Note:- Valid ID proof (Voter ID / Passport / Driving Licence). PAN Card & Aadhar Card is not acceptable. In case of a child below 18 years bring Aadhar or Birth Certificate. 4 Passport sized photographs of each person.',
    thingsToCarry: [
      'Authentic Government ID Card (Voter ID, Passport, or Driving License)',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    costingDetails: [
      { label: 'Price Starting at', value: '₹45,499/-' },
      { label: 'Get Quote Option', value: 'Contact Us' }
    ],
    dates: []
  },
  {
    id: '40',
    title: '8 Days Unseen Sikkim Escape Zuluk , Aritar & Rishikhola with Darjeeling',
    slug: '8-days-unseen-sikkim-escape-zuluk-aritar-rishikhola-with-darjeeling',
    image: '/images/sikkim.png',
    destination: 'Sikkim',
    region: 'Sikkim',
    category: 'Sikkim',
    description: 'An ultimate 8-day unseen Sikkim escape through Zuluk, Aritar, Rishikhola, and Darjeeling along the Old Silk Route.',
    duration: 8,
    nights: 7,
    price: 29499,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 15,
    tripType: 'India',
    overviewPoints: [
      'Route: Bagdogra/NJP Railway Station → Gangtok  → Zuluk → Aritar → Rishikhola → Darjeeling → Bagdogra/NJP Railway Station.',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Bagdogra/NJP Railway Station',
      'Trip End: Bagdogra/NJP Railway Station',
      'Best Time to Visit: Summer May to July Winter November - February'
    ],
    highlights: [
      'Lampokhari Lake',
      'Nathang Valley',
      'Baba Mandir',
      'Tsogmo Lake',
      'Nathula Pass',
      'Zuluk',
      'Tiger Hill',
      'Batasia Loop'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Day 1 Arrival At Bagdogra/NJP | Transfer To Gangtok ( Approximately 125–130 km 4.5 to 5.5 hours Drive )',
        description: [
          'Arrive at Bagdogra Airport or NJP Railway Station, and meet our representative who will assist you with your transfer to Gangtok.',
          'Begin your 4 to 5 hour journey through scenic hill roads, passing tea gardens ( Outside View ) and forested slopes along the way.',
          'Reach Gangtok by evening and check into your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Day 2 Excursion To Tsomgo Lake & Baba Mandir | Nathula Pass (Optional) ( Approx Distance: 120 Km • Est. Travel Time: 8 hrs )',
        description: [
          '(Note: Nathula Pass Closed on Monday).',
          '( Todays Excursion Additional Cost 6000 Per Vehicle).',
          'After an early breakfast, board your transfers towards Tsomgo Lake, a sacred glacial lake at 12,313 ft.',
          'Enjoy the scenic mountain drive with winding roads and views of snow-covered landscapes along the way.',
          'Spend some time by the lake, known for its changing colors and calm surroundings.',
          'You can also enjoy a short yak ride or simply walk along the shore.',
          'You can also try some maggie and momos at the various food stalls around the lake.',
          'Continue further to Baba Mandir, a revered shrine dedicated to Baba Harbhajan Singh, an Indian Army soldier.',
          'Later, you can also opt to visit Nathula Pass at 14,140 feet, near the Indo-China border (subject to permit and availability).',
          'After sightseeing, return to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.'
        ]
      },
      {
        day: 3,
        title: 'Day 3 Gangtok To Zuluk | Into The Old Silk Route ( Approx 90 100 Kms 4 - 5 Hrs Drive )',
        description: [
          'After a filling breakfast, proceed to check out of the hotel.',
          'Board your transfer towards Zuluk, a hidden mountain hamlet tucked along the historic Old Silk Route, far away from the usual touristy spots.',
          'Along the way, you will pass through:',
          'Rongli – The gateway to the Old Silk Route and permit checkpoint.',
          'Lush Pine Forests – Dense forests and winding mountain roads.',
          'Historic Silk Route – Once an important trade route connecting India and Tibet.',
          'Padamchen – A charming Himalayan village surrounded by forests and mist-covered mountains.',
          'Panoramic Mountain Landscapes – Spectacular views of valleys, clouds, and rugged Himalayan terrain.',
          'Wanderphilia Signature Moment  - As dusk settles over the mountains, witness the clouds drifting through the valleys while the silence of the Himalayas creates a truly magical experience—an unforgettable evening on the legendary Old Silk Route.',
          'Overnight In Zuluk.'
        ]
      },
      {
        day: 4,
        title: 'Day 4 Zuluk To Aritar | Via Thambi Viewpoint & Nathang Valley ( Approx 35 45 Kms 1 - 2 Hrs Drive )',
        description: [
          'Wake up before dawn for one of the most rewarding mornings of your trip.',
          'Drive up to Thambi View Point (11,200 ft) to catch the first light of the sun touching the Kanchenjunga range, with the entire Himalayan skyline glowing gold in front of you.',
          'After soaking in the views, return for breakfast and then begin your drive deeper into this lesser-explored corner of East Sikkim.',
          'Continue towards Nathang Valley (13,500 ft), often called the "Ladakh of the East," for its wide, barren landscape and rugged mountain charm.',
          'Pass by Lungthung and Eagle\'s Nest Bunker, where panoramic valley views unfold in every direction',
          'Later, descend gradually towards Aritar, a peaceful little village in East Sikkim known for its calm lake and old-world charm.',
          'By evening, reach your stay and rest after a long, scenic drive.',
          'Overnight stay in Aritar.'
        ]
      },
      {
        day: 5,
        title: 'Day 5 Aritar To Rishikhola | A Quiet Riverside Retreat ( Approx 15 20 Kms 1 Hr Drive )',
        description: [
          'Begin your morning at a slow pace with breakfast and a short walk around Aritar.',
          'Visit Lampokhari Lake, a serene foot-shaped lake surrounded by pine forests, where you can take a small boat ride across the calm waters.',
          'Stop by the nearby Aritar Monastery, one of the oldest in the region, known for its quiet setting and traditional architecture.',
          'Later, check out and begin your drive towards Rishikhola, a hidden riverside hamlet on the Sikkim–Bengal border.',
          'The drive takes around 2–3 hours, winding down through small villages, terraced fields, and forested slopes.',
          'Reach Rishikhola by afternoon, where the gentle sound of the river greets you as soon as you step out of the vehicle.',
          'Check in to your riverside cottage and spend the rest of the day at complete leisure.',
          'You can take a walk along the river bed, dip your feet in the cool waters, or simply sit by the banks watching the day slowly fade.',
          'As the night falls, enjoy the rare quiet of a place untouched by city sounds, with just the river flowing in the background.',
          'Overnight Stay in Rishikhola.'
        ]
      },
      {
        day: 6,
        title: 'Day 6 Rishikhola To Darjeeling | Towards The Queen Of Hills ( Approx 70 80 Kms   4 - 5 Hrs )',
        description: [
          'Wake up to the sound of the river and enjoy a relaxed breakfast by the banks.',
          'After checking out, begin your journey towards Darjeeling, leaving behind the quiet of Rishikhola.',
          'The drive takes around 4–5 hours, gradually opening into rolling tea estates with neatly lined plantations stretching along the slopes.',
          'Reach Darjeeling by evening, check in to your hotel, and spend the rest of the time at leisure.',
          'You can take a walk along Mall Road ( On Your Own ), browse the shops at Chowrasta, or relax at a heritage café with a cup of fresh Darjeeling tea overlooking the hills.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 7,
        title: 'Day 7 Full Day Local Sightseeing In Darjeeling Toy Train Ride',
        description: [
          'Start your day early around 4:00 AM for the drive to Tiger Hill to see a magical sunrise.',
          'Watch the first light hit Mt. Kanchenjunga, turning the peaks golden, with distant views of Mt. Everest on clear days.',
          'On the way back, stop at Batasia Loop to take stunning photos, where the spiral railway track curves through landscaped gardens with mountain views.',
          'Visit the Gorkha War Memorial here, built in honor of soldiers from the region.',
          'Get back to your hotel for breakfast, and then step out to explore the town.',
          'We’ll visit the Himalayan Mountaineering Institute ( closed on Thursday ) , Tenzing Rock ( closed on Thursday ) and the nearby zoo, home to species like the red panda and snow leopard.',
          'Later, visit the Japanese Temple and Peace Pagoda, known for their quiet setting and views over the town.',
          'Enjoy The Toy Train Ride ( Optional )',
          'After a full day of sightseeing, get back to your hotel by evening and relax.',
          'Overnight In Darjeeling.',
          'Overnight stay in Darjeeling.'
        ]
      },
      {
        day: 8,
        title: 'Day 8 Departure | Farewell To The Queen Of Hills',
        description: [
          'Enjoy a tasty breakfast and then prepare to check out of your hotel.',
          'We’ll drop you off at Bagdogra Airport or NJP Railway Station for your journey back home.',
          'Board your onward journey, taking back memories of misty mornings, mountain views, and slow-paced days.'
        ]
      }
    ],
    included: [
      '7 Nights Accommodation As Mentioned In Hotels.',
      'Transportation in Innova/Xylo ( Or As Per the group size )',
      'Meal Plan Breakfast & Dinner ( Except for Breakfast Day 1 & Dinner Day 11  ',
      'Exclusive Non AC vehicle for transfers & sightseeing. The vehicle will not be at disposal; it will be available to guests as per itinerary only (point to point basis).',
      'All Permit Fees & Hotel Taxes (as per itinerary)',
      'Rates are valid for INDIAN NATIONALS only'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Vehicle and Permit charges for the visit to Nathu-La Pass and Zero Point.',
      'Any kind of food and beverages that is not included in the package like alcohol drinks, mineral water, meals/refreshment/lunches on the highway.',
      'Any personal expense like tip to the drivers, entry to the monuments. monasteries, camera/video camera charges, laundry, telephone bills, tips etc.',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne by the customer on the spot)',
      'Anything not mentioned in the inclusion.',
      'Air fares/Train Tickets'
    ],
    stays: [
      'Gangtok : Udaan Keepsa Hotel / Similar',
      'Zuluk : Voyage Glenz Resort / Similar',
      'Aritar : Eco Log Hut Resort / Similar',
      'Rishikhola : Rose Dell Inn / Similar',
      'Darjeeling : Anutri Hill Resort / Similar'
    ],
    note: 'Note:- Valid ID proof (Voter ID / Passport / Driving Licence). PAN Card & Aadhar Card is not acceptable. In case of a child below 18 years bring Aadhar or Birth Certificate. 4 Passport sized photographs of each person.',
    thingsToCarry: [
      'Authentic Government ID Card (Voter ID, Passport, or Driving License)',
      'Comfortable warm clothing like woolen socks, cap, fleece jackets or warmers, down jacket, toiletries.',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    costingDetails: [
      { label: 'Price Starting at', value: '₹29,499/-' },
      { label: 'Get Quote Option', value: 'Contact Us' }
    ],
    dates: []
  },
  {
    id: '41',
    title: '9 Days Exclusive Leh - Leh Group Trip with Turtuk , Hanle , Umling La & Tso Moriri.',
    slug: '9-days-exclusive-leh-leh-group-trip-with-turtuk-hanle-umling-la-tso-moriri',
    image: '/images/LL6.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `This 9 Nights - 10 Days Leh to Leh Umling La adventure is one of the most exciting ways to explore Ladakh’s famous high roads, valleys and wide open skies. Starting and ending in Leh, you will ride through Sham Valley, cross Khardung La - one of the highest motorable passes in the world and reach the beautiful Nubra Valley with its cold desert and sand dunes.
The trip takes you next to the stunning Pangong Tso Lake, where the water changes colour as the sun moves across the sky. After Pangong, you continue towards Hanle, a quiet village surrounded by mountains and clear night skies. Then comes the most exciting part - a full-day ride to Umling La, the highest motorable pass on Earth with huge views that feel like the world is right under your feet. Feel the adrenaline as you pass the iconic Rezang La War Memorial and camp under the starry skies at Hanle, home to India’s highest space observatory. But the crown jewel? Reaching Umling-La — the world’s highest motorable pass at 5640 meters! 
Throughout these 10 days, you will travel on thrilling roads, stay in simple and comfortable places, share stories around a bonfire, and see landscapes that change from green valleys to rocky mountains and blue lakes. This tour gives you the real feel of Ladakh’s nature and open roads, without extra frills - just great routes, great views and great memories.`,
    duration: 10,
    nights: 9,
    price: 28499,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Turtuk',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Tso Moriri'
    ],
    overviewPoints: [
      'Route: Leh → Sham Valley → Khardung la → Nubra Valley → Turtuk → Pangong → Hanle → Umingla → Demchok → Tso Moriri - Leh',
      'Duration: 9 Nights / 10 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Umling La (19,038 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Nubra Valley, Turtuk, Pangong Lake, Hanle, Uming la, Tso Moriri.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          "Rise and shine! It's time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.",
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          "As the day comes to an end, you come back to the Nubra Valley in your hotel room.",
          "Enjoy a delicious dinner, and sleep peacefully, knowing that you've experienced a truly unforgettable day.",
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 6,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 7,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Overnight Stay in Tso Moriri.'
        ]
      },
      {
        day: 9,
        title: 'Tso Moriri to Leh via Puga Valley and Chumathang [Distance: 154 km, Duration: 7-8 Hours]',
        description: [
          'Wake up to a pleasant morning in Tso Moriri and have your breakfast.',
          'Later, we will get ready to board our transfers to Leh.',
          'We will visit Puga Valley to experience its extensive geothermal activity, including natural hot springs, sulphur deposits, and bubbling mud pools.',
          'On the way to Leh, we will stop in Chumathang to witness the unique sulphur hot-springs.',
          'Continue the road journey and pass some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 10,
        title: 'Fly Back To Home. Depart with a lot of happy memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 9 nights – 3 nights in a hotel at Leh, 2 nights in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 2 Nights in Hanle Homestay , 1 Night in Tso Moriri on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 10 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  8 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh) ',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar.',
      'Tso Moriri : Lake View Stay / Similar.'
    ],
    batchDates: [
      {
        month: 'May',
        ranges: ['16nd May - 25th May', '23rd May - 1st June ( Eid Holiday )']
      },
      {
        month: 'June',
        ranges: ['6th June - 15th June', '20th June - 29th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 13th July', '18th July - 27th July']
      },
      {
        month: 'August',
        ranges: ['1st Aug - 10th Aug', '15th Aug - 24th Aug', '29th Aug - 7th Sept']
      },
      {
        month: 'September',
        ranges: ['12th Sept - 21st Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 5th Oct']
      }
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-25', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-06-01', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-15', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-29', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-13', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-27', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-10', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-24', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-07', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-21', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-05', spots: 10 }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹31,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹28,499' },
      { label: 'Dual Bike (Double Sharing)', value: '₹32,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹30,499' },
      { label: 'Solo Bike (Double Sharing)', value: '₹46,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹43,499' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.'
  },
  {
    id: '42',
    title: '9 Days Leh - Leh Bike Group Trip with Hanle , Umling La  & Tso Moriri.',
    slug: '9-days-leh-leh-bike-group-trip-with-turtuk-hanle-umling-la-tso-moriri',
    image: '/images/LL6.jpg',
    destination: 'Leh Ladakh',
    category: 'Leh Ladakh',
    description: `This 8 Nights - 9 Days Leh to Leh Umling La adventure is one of the most exciting ways to explore Ladakh’s famous high roads, valleys and wide open skies. Starting and ending in Leh, you will ride through Sham Valley, cross Khardung La - one of the highest motorable passes in the world and reach the beautiful Nubra Valley with its cold desert and sand dunes.
The trip takes you next to the stunning Pangong Tso Lake, where the water changes colour as the sun moves across the sky. After Pangong, you continue towards Hanle, a quiet village surrounded by mountains and clear night skies. Then comes the most exciting part - a full-day ride to Umling La, the highest motorable pass on Earth with huge views that feel like the world is right under your feet. Feel the adrenaline as you pass the iconic Rezang La War Memorial and camp under the starry skies at Hanle, home to India’s highest space observatory. But the crown jewel? Reaching Umling-La — the world’s highest motorable pass at 5640 meters! 
Throughout these 7 days, you will travel on thrilling roads, stay in simple and comfortable places, share stories around a bonfire, and see landscapes that change from green valleys to rocky mountains and blue lakes. This tour gives you the real feel of Ladakh’s nature and open roads, without extra frills - just great routes, great views and great memories.`,
    duration: 9,
    nights: 8,
    price: 26499,
    rating: 4.9,
    difficulty: 'Moderate',
    groupSize: 15,
    tripType: 'India',
    highlights: [
      'Khardung La',
      'Nubra Valley',
      'Turtuk',
      'Pangong Lake',
      'Hanle',
      'Umling La',
      'Tso Moriri'
    ],
    overviewPoints: [
      'Route: Leh → Sham Valley → Khardung la → Nubra Valley → Turtuk → Pangong → Hanle  → Umingla → Demchok  → Tso Moriri -  Leh',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Leh.',
      'Bike Ride Starts From: Leh.',
      'Trip End: Leh.',
      'Highest Point: Umling La (19,038 ft).',
      'Difficulty Level: Moderate - Difficult.',
      'Best Time to Visit: May to September.',
      'Major Highlights: Khardung La, Nubra Valley, Turtuk, Pangong Lake, Hanle, Uming la, Tso Moriri.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Leh. Leisure Day for Acclimatization.',
        description: [
          'Arrive at the Leh airport after a scenic flight over the Himalayas.',
          'Meet our representative who will help you with your transfers to the hotel.',
          'Complete the check-in formalities and rest for some time.',
          'You can then spend the rest of the day at leisure.',
          'We suggest you go for a short walk around your hotel, to acclimate yourself to the altitude better.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing- Visit Gurudwara Pathar Sahib, Shanti Stupa, etc.',
        description: [
          "Rise and shine! It's time to fuel up for an exciting day ahead with a delicious breakfast at the hotel.",
          'Get ready and board our transfers to explore the major landmarks towards Sham Valley.',
          'Before heading out of Leh, we will first visit the iconic Shanti Stupa to marvel at the stunning views of Leh city.',
          'Continue the adventurous ride to the Sham Valley, where we will first visit the Sangam point to witness the confluence of the Indus and Zanskar Rivers. the serene Pathar Sahib Gurudwara.',
          'Next, we will stop at the Magnetic Hill to experience a unique optical illusion that looks like vehicles are rolling uphill.',
          'Our last stop here will be the Pathar Sahib Gurudwara, dedicated to Guru Nanak Dev Ji.',
          'Here, we will learn about the fascinating story behind the sacred boulder that has an imprint of Guru Nanak Ji.',
          'We will then head back to Leh and visit the Hall of Fame, a museum/ war memorial built in memory of the martyrs of the Indo-Pak War that showcases various aspects of high-altitude warfare.',
          'You can spend your evening exploring the vibrant local Leh market and indulging in some delicious food and drinks at the cozy cafes around.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 3,
        title: 'Leh To Nubra Valley via Khardung-La [Distance: 125km, Duration: 5-6 Hours].',
        description: [
          'Wake up in your hotel room in Leh and have a delicious breakfast.',
          'We will then get you ready for the exciting journey on one of the highest motorable roads.',
          'Rev Up your engines and get ready for a thrilling ride to the Nubra Valley located to the north of Ladakh between the Karakoram and Ladakh ranges of the Himalayas.',
          'Our first stop will be the iconic Khardung-La - one of the highest motorable roads in the world at an altitude of 5359 meters.',
          'Further, we will pass by the Shyok River to reach Nubra Valley, also known as Ldorma or the Valley of Flowers.',
          'Continue riding through the mesmerizing landscapes until we reach Diskit.',
          'Here, we will stop at the Diskit Monastery which is famous for its 106 feet of Maitreya Buddha statue.',
          'Upon reaching Nubra, head to the Hunder Sand Dunes where you can spend time soaking in the views of the cold desert.',
          'You can also enjoy some adventure activities like a double-humped Bactrian camel ride or an ATV ride to explore the deserted land of Hunder. (on your own)',
          'Complete your sightseeing for the day, and head to your camps/ hotels.',
          'Overnight stay in Nubra Valley.'
        ]
      },
      {
        day: 4,
        title: 'Day excursion to Turtuk from Nubra Valley [Distance: 200km, Duration: 7-8 Hours]',
        description: [
          'Wake up in your hotel room in Nubra Valley.',
          'Have a delicious breakfast while admiring the majestic views of Nubra Valley.',
          'After a delicious breakfast, get ready to explore the Turtuk Village- a remote village with a unique identity, home to ethnic Muslims with distinct traditions and cultures.',
          'We will then explore this beautiful village surrounded by snow-clad mountains.',
          'Here we can try out fruits like apricots and walnuts, for which this place is well known.',
          'Next, we will visit the Shyok War Memorial which is dedicated to the Indian Army who fought in the challenging weather of Ladakh.',
          "As the day comes to an end, you come back to the Nubra Valley in your hotel room.",
          "Enjoy a delicious dinner, and sleep peacefully, knowing that you've experienced a truly unforgettable day.",
          'Overnight stay at Nubra Valley.'
        ]
      },
      {
        day: 5,
        title: 'Nubra to Pangong via Shyok Valley [Distance: 160 Km, Duration: 5-6 Hours].',
        description: [
          'Wake up in the Nubra Valley and get ready for an adventurous journey to the famous Pangong Tso.',
          'While riding, we will cross the charming Agam and Shyok villages which are known for their scenic beauty.',
          'Continue the adventurous journey until we are greeted with the majestic views of the famous Pangong Lake which is the highest saltwater lake in the world.',
          'Pangong Lake is about 4 km wide on average and at least 136 Km long and is located at an altitude of 4300 meters above sea level.',
          'Spend some time around the lake, where you can admire the reflection of the surrounding mountains in the stunning blue lake.',
          'You can also click pictures at the famous 3-idiots set here.',
          'We will then head to check in at our campsite near the lake and have a delicious dinner here.',
          'Overnight stay near Pangong Lake.'
        ]
      },
      {
        day: 6,
        title: 'Pangong to Hanle via Rezang La War Memorial [Distance: 165 Km, Duration: 8-9 Hours].',
        description: [
          'Get ready to start the day as you wake up early to witness a breathtaking sunrise.',
          'Later, we will get ready and buckle up for another thrilling journey towards the picturesque Hanle village.',
          'On the way, we will pass the town of Chushul and then stop at the Rezang La War Memorial.',
          'This War Memorial was built as a tribute to the brave soldiers who laid down their lives for their motherland in the 1962 Indo-China War.',
          'After paying respects to the martyrs, continue your journey and stop for a delicious lunch on the way (depending on time) before heading to Hanle.',
          'Cross the Loma Bridge on the Indus River and ride through the rugged landscapes until you reach the charming village of Hanle by evening.',
          'Upon reaching, we will check in to your cozy homestay, enjoy a delicious dinner, and settle in for a peaceful night\'s sleep.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 7,
        title: 'Day Excursion to Umling La | Visit Demchok [Distance: approx. 200 Km, Duration: 7-8 Hours].',
        description: [
          'Have your breakfast in the morning and get ready for the most exciting day of your tour.',
          'Get ready, ignite your engines, and begin a thrilling ride to the highest motorable road in the world - Umling La!',
          'En route, we will cross Photi La located at an altitude of 5524 meters.',
          'Enjoy this rough and adventurous ride through the stunning landscapes of Ladakh as you wind your way up to the summit.',
          'Reach Umling-La, located at an altitude of 5640 meters, which is higher than the Everest Base Camp.',
          'This pass forms the source for the Umlung Stream that drains into the Indus and is a tributary of the Kiungdul River.',
          'Spend some time admiring the surrounding views and clicking pictures at the Umling-La.',
          'On the way back we will visit Demchok, last village on the Indo-China border.',
          'Later, we will have our lunch and head back to our stay in Hanle.',
          'If time permits, we will visit the Hanle Observatory - the highest space observatory in India known for its advanced astronomical research.',
          'Reach your homestay in Hanle by evening and enjoy a tasty dinner.',
          'Overnight stay in Hanle.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Tso Moriri [Distance: 289 km, Duration: 7-8 Hours]',
        description: [
          'Post breakfast in the morning, get ready to explore another stunning high-altitude lake.',
          'Hit the roads to enjoy your ride to picturesque Tsomoriri Lake - a high-altitude lake with blue waters, home to many migratory birds and rare flora and fauna.',
          'On the way, we will cross the Loma Bridge on the Indus River and turn left towards Mahe.',
          'Continue the journey to Tso Moriri - India\'s highest and largest saltwater lake and lies at an elevation of 4,522 metres (14,836 feet).',
          'Spend some quality time at the lake & witness the changing hues of the lake and fall in love with nature all over again.',
          'Later, we will get ready to board our transfers to Leh.',
          'On the way to Leh, we will pass Chumathang and some scenic towns of Upshi, Karu and Thikshey.',
          'Upon reaching Leh, check-in to the hotel and freshen-up.',
          'You can then spend the rest of the evening exploring the Leh local market on your own.',
          'Here, you can indulge in shopping, go cafe hopping, try local delicacies.',
          'Overnight stay in Leh.'
        ]
      },
      {
        day: 9,
        title: 'Fly Back To Home. Depart with a lot of happy memories.',
        description: [
          'Wake up to the beautiful morning amidst the scenic views in Leh.',
          'Have your breakfast at the hotel and pack your bags.',
          'Your thrilling Ladakh Trip concludes as you head to the Leh airport for your onward journey.',
          'Come back home with adventurous memories which you will cherish for a lifetime.'
        ]
      }
    ],
    included: [
      'Stay for 8 nights – 3 nights in a hotel at Leh, 2 nights in a Hotel at Nubra Valley, 1 night in camps at Pangong Tso 2 Nights in Hanle Homestay on a triple/quad sharing basis.',
      'Breakfast & Dinner ( Breakfast except for Day 1 & Dinner Day 9 )',
      'Entire travel from Leh to Leh by tempo traveler/cab (For Tempo Traveler Option)',
      'Bike Rent for  7 days (For Biking Option).',
      'Fuel for the bike(Leh to Leh) ',
      'Riding Gears – Helmet (Standard Size 58 - 60 cms), Riding Gloves (only for riders), Riding Jackets, Knee Pads (Though it is recommended you carry your own helmet for comfort)',
      'Mechanical Backup.',
      'Driver Night Charges, Toll Tax, Parking Charges, etc.',
      'Team Captain throughout the trip.',
      'An Oxygen Cylinder 24X7 in the car in case of emergency',
      'Airport pick or drop. (Private taxi won\'t be provided, taxis will be available on pre-decided slots time as per the Flights timings of combined group).',
      'All inner line permits for the trip - Environmental fees as applicable.'
    ],
    notIncluded: [
      'GST (5%) is applicable extra.',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
      'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges, camel safari, river rafting, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions.',
      'Any damage to the bike except engine damage must be borne by the client.',
      'INR 5,000/- as security for the bike.'
    ],
    stays: [
      'Leh : The Kaal Hotel / Hotel Zanang / Similar',
      'Nubra : Hideout Camps / Similar',
      'Pangong : Snow Pine Cottages / Similar.',
      'Hanle : Aurora Cabins / Similar.',
      'Tso Moriri : Lake View Stay / Similar.'
    ],
    batchDates: [
      {
        month: 'May',
        ranges: ['16nd May - 24th May', '23rd May - 31st May ( Eid Holiday )']
      },
      {
        month: 'June',
        ranges: ['6th June - 14th June', '20th June - 28th June']
      },
      {
        month: 'July',
        ranges: ['4th July - 12th July', '18th July - 27th July']
      },
      {
        month: 'August',
        ranges: ['1st Aug - 9th Aug', '15th Aug - 23rd Aug', '29th Aug - 6th Sept']
      },
      {
        month: 'September',
        ranges: ['12th Sept - 20th Sept ( Ganesh Chaturthi Holiday )', '26th Sept - 4th Oct']
      }
    ],
    dates: [
      { startDate: '2026-05-16', endDate: '2026-05-24', spots: 10 },
      { startDate: '2026-05-23', endDate: '2026-05-31', spots: 10 },
      { startDate: '2026-06-06', endDate: '2026-06-14', spots: 10 },
      { startDate: '2026-06-20', endDate: '2026-06-28', spots: 10 },
      { startDate: '2026-07-04', endDate: '2026-07-12', spots: 10 },
      { startDate: '2026-07-18', endDate: '2026-07-26', spots: 10 },
      { startDate: '2026-08-01', endDate: '2026-08-09', spots: 10 },
      { startDate: '2026-08-15', endDate: '2026-08-23', spots: 10 },
      { startDate: '2026-08-29', endDate: '2026-09-06', spots: 10 },
      { startDate: '2026-09-12', endDate: '2026-09-20', spots: 10 },
      { startDate: '2026-09-26', endDate: '2026-10-04', spots: 10 }
    ],
    costingDetails: [
      { label: 'Tempo Traveller (Double Sharing)', value: '₹29,499' },
      { label: 'Tempo Traveller (Triple Sharing)', value: '₹26,499' },
      { label: 'Dual Bike (Double Sharing)', value: '₹30,499' },
      { label: 'Dual Bike (Triple Sharing)', value: '₹28,499' },
      { label: 'Solo Bike (Double Sharing)', value: '₹44,499' },
      { label: 'Solo Bike (Triple Sharing)', value: '₹41,499' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Authentic government ID card.',
      'Comfortable warm clothing including woolen socks, cap, fleece jacket, warmers, down jacket, and toiletries.',
      'Sunscreen & lip balm with good UV protection sunglasses.',
      'Personal medicines (if any) and altitude sickness medicines.',
      'Power banks (no electricity at Pangong Tso).',
      'Post-paid phone numbers only; most areas are no network zones.'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'Rucksack or day pack',
          '3-litre water bladder or water bottle',
          'Sun cap and woolen cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Gears',
        items: [
          'Helmet',
          'Riding gloves',
          'Riding jacket',
          'Knee pads'
        ]
      },
      {
        title: 'Clothes',
        items: [
          '1 cotton long sleeve',
          '2 short sleeve T-shirts',
          '1 fleece jacket',
          '1 heavy jacket or down jacket',
          '4 sets of undergarments',
          '2 pairs of socks',
          'Small towel',
          'Rain jacket or poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Above-the-ankle waterproof breathable hiking boots',
          'Flip flops or sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'One strip of Diamox',
          'Glucose powder',
          'Medicines for headache, diarrhoea, motion and altitude sickness',
          'Dettol, bandages, cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste and toothbrush',
          'Paper soap or sanitizer',
          'Sunscreen SPF40+',
          'Lip balm',
          'Cold cream',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: 'NOTE: INR 5,000/- needs to be submitted as security for the bike before the start of the trip. Any damage to the bike, except engine damage, has to be borne directly by the client.'
  },
  {
    id: '43',
    title: '7 Days Exclusive Thailand Full Moon Party Group Tour',
    slug: '7-days-exclusive-thailand-full-moon-party-group-tour',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Experience the ultimate tropical adventure with our 7 Days Exclusive Thailand Full Moon Party Group Tour. This journey takes you through Krabi's stunning limestone cliffs, the world-famous Full Moon Party in Koh Phangan, the vibrant fire shows on Koh Samui's beaches, and the beautiful Phi Phi Islands in Phuket. Enjoy high-speed boat rides, snorkeling in crystal-clear waters, and dance under the moonlit sky with travelers from all over the world. This is the perfect blend of natural beauty, tropical island hopping, and legendary nightlife.`,
    duration: 7,
    nights: 6,
    price: 45999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    highlights: [
      'Krabi',
      '4 Island',
      'Koh Samui',
      'Koh Phangan',
      'Phuket',
      'Phi Phi Island'
    ],
    overviewPoints: [
      'Route: Krabi → Koh Samui → Koh Phangan → Phuket',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Phuket (Transfer to Krabi).',
      'Trip End: Phuket.',
      'Major Highlights: Krabi 4 Island Tour, Koh Phangan Full Moon Party, Koh Samui Beach Fire Show, Phi Phi Island Speedboat Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Phuket Airport and transfer to Krabi.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Krabi.',
          'Upon reaching your hotel in Krabi, check in to the hotel and freshen up.',
          'Rest of the day for leisure.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: '4 Island Tour By Long Tail Boat With Local Lunch.',
        description: [
          'Post breakfast in the morning, get ready to spend an amazing day in the ocean.',
          'Board your transfers to the starting point of your long tail boat.',
          'Hop on to your long tail boat and spend the day exploring the scenic islands around Krabi.',
          'We will first visit Phra Nang Beach where you can spend some relaxing time sunbathing or swimming in the pristine blue water.',
          'Next, head to the exotic tropical Tub Island to enjoy snorkeling and strolling on the sand banks to neighboring islands during extreme low tide.',
          'Next, enjoy your lunch at Poda Island and explore the picturesque bamboo plantation, majestic limestone cliffs, and long-stretched beaches.',
          'Later, we will head to Chicken Island which is named after its shape.',
          'Marvel at the unique and picturesque limestones emerging from the sea and spend some leisure time here.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 3,
        title: 'Transfer From Krabi To Koh Samui. Enjoy The Full-Moon Party.',
        description: [
          'Have your breakfast at the hotel and get ready to board your coach to the port.',
          'Upon reaching, board your ferry that will take you to Koh Samui.',
          'Reach Koh Samui after a scenic boat ride, and get transferred to your hotel.',
          'Complete the check-in formalities at the hotel.',
          'Freshen up and get ready to enjoy a Full-Moon Party.',
          'Board your fixed-timed transfer and ferry to Koh Phangan.',
          'Reach Koh Phangan and spend the entire night enjoying the party under the light of a full-lit moon.',
          'Overnight Full-Moon Party at Koh Phangan.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Koh Phangan to Koh Samui. Beach Fire Show. Day at Leisure.',
        description: [
          'After having a blast at the Full-Moon Party in Koh Phangan, board your return transfers to Koh Samui.',
          'Board your fixed-timed ferry to Koh Samui and then the coach to reach your hotel.',
          'Upon reaching your hotel, relish a delicious breakfast to energize yourself after the party.',
          'You can spend the rest of the rest of afternoon at leisure relaxing in the room or exploring around.',
          'By evening, get ready to board your transfers to watch the amazing fire show on the beach.',
          'Enjoy the fire show, sip your favorite drinks, and you can spend the rest of the night partying at the beach club.',
          'Return to the hotel (on your own), at your convenience.',
          'Overnight stay in Koh Samui.'
        ]
      },
      {
        day: 5,
        title: 'Transfer from Koh Samui to Phuket. Day at Leisure.',
        description: [
          'Post breakfast at the hotel in Koh Samui, get ready and board your transfers to the ferry terminal.',
          'Upon reaching, board your ferry from Koh Samui to Donsak Pier, which is located on the main island of Thailand.',
          'From Donsak Pier, board your private transfers to your hotel in Phuket which will take approx. 4 to 5 hours.',
          'Reach your hotel and complete the check-in process.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 6,
        title: 'Phi Phi Island Tour with Local Lunch',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat Tour to Phi Phi Island.',
          'Hop on to your speed boat by 9 AM and spend the day exploring the scenic Phi Phi Islands.',
          'Enjoy this day as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching Phi Phi Island, you will visit some of the iconic locations like Ton Sai Bay.',
          'Stroll on the soft sand at the scenic Monkey Beach.',
          'Take a small stopover in Phi Phi Don, where we will enjoy a delicious lunch at the local restaurant.',
          'Post lunch, relax by swimming in the crystal-clear waters of the ocean.',
          'Next, we will take you to Koh Khai Nok where you can indulge in adventurous activities like snorkeling to take a look at the colorful marine life.',
          'After exploring all the islands by evening, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of happy memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Phuket Airport for your onward journey.',
          'Your amazing Thailand Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '6 nights’ accommodation with breakfast.',
      'All transportation by A/c Vehicles on a shared basis.',
      "Krabi's Four Island tour with Long Tail Boat and local lunch.",
      'Overnight Full-Moon Party at Koh Phangan.',
      'Fire show on the beach.',
      'Full Day Phi Phi Island Tour from Speed Boat with Local Lunch.',
      '24*7 on-call travel assistance.',
      'Airport pick-up and drop transfers.',
      'Services of the tour manager.'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions.',
      'Security deposit at the hotel.',
      'Round trip flight is not included.',
      'National park fees of 4 Island Tour and Phi Phi Island are not included in the package. Customers will have to pay THB 400 per person on the spot.'
    ],
    stays: [
      'Krabi: Deluxe Room on sharing basis / Similar',
      'Koh Samui: Deluxe Room on sharing basis / Similar',
      'Phuket: Deluxe Room on sharing basis / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['29th July - 4th Aug']
      },
      {
        month: 'August',
        ranges: ['26th Aug - 1st Sept']
      },
      {
        month: 'September',
        ranges: ['24th Sept - 30th Sept']
      },
      {
        month: 'October',
        ranges: ['25th Oct - 31st Oct']
      },
      {
        month: 'November',
        ranges: ['22nd Nov - 28th Nov']
      }
    ],
    dates: [
      { startDate: '2026-07-29', endDate: '2026-08-04', spots: 12 },
      { startDate: '2026-08-26', endDate: '2026-09-01', spots: 12 },
      { startDate: '2026-09-24', endDate: '2026-09-30', spots: 12 },
      { startDate: '2026-10-25', endDate: '2026-10-31', spots: 12 },
      { startDate: '2026-11-22', endDate: '2026-11-28', spots: 12 }
    ],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹45,999' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India.',
      'Sunscreen & lip balm, Good U/V protection sunglasses.',
      'Personal Medicines (if any).'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'A sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '44',
    title: 'Exclusive 7 Nights 8 Days Thailand Honeymoon Package – A Perfect Romantic Getaway',
    slug: 'exclusive-7-nights-8-days-thailand-honeymoon-package',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on a perfect romantic getaway with our Wanderphilia Exclusive 7 Nights 8 Days Thailand Honeymoon Package. Discover the serene beauty of Krabi's limestone cliffs, watch a dazzling cabaret show in Phuket, explore the pristine Phi Phi Islands by speedboat, and enjoy a romantic Chao Phraya River dinner cruise under Bangkok's night sky. Designed for couples seeking both adventure and relaxation, this honeymoon tour combines breathtaking scenic beauty with premium tropical stays, ensuring romantic memories you will cherish forever.`,
    duration: 8,
    nights: 7,
    price: 45999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Krabi',
      '4 Island',
      'Phuket',
      'Phi Phi Island',
      'Bangkok Evening Dinner Cruise',
      'Bangkok City & Temple Tour'
    ],
    overviewPoints: [
      'Route: Krabi → Phuket → Bangkok',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Phuket.',
      'Trip End: Bangkok.',
      'Major Highlights: Krabi 4 Island Speedboat Tour, Phuket City Tour, Siam Cabaret Show, Chao Phraya Dinner Cruise, Bangkok Temple Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Phuket. Transfer to Krabi.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Krabi.',
          'Enjoy a 3-hour drive to Krabi, through scenic tropical landscapes.',
          'Upon reaching Krabi, check-in to the hotel and have some rest.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: '4 Island Tour by Speed Boat.',
        description: [
          'Post breakfast in the morning, get ready to spend an amazing day in the ocean.',
          'Board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic islands around Krabi.',
          'On this tour, you will visit the scenic Phranang Cave Beach, Tup Island, Poda Island and Chicken Island.',
          'You will also take a small stopover in between to have your lunch.',
          'Spend this day exploring the secluded beaches, admiring the limestone rock formations or sit leisurely by the beach watching the blue ocean.',
          'Adventure couples can indulge in some fun water activities and discover more about each other while spending quality time in this romantic setting.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket. Cabaret Show in the evening.',
        description: [
          'After having your breakfast in the morning, get ready for the day.',
          'You will then board your transfers to Phuket.',
          'Reach Phuket, check-in to the hotel and have some rest.',
          'In the evening, watch the graceful movements of the artists as you enjoy the Siam Cabaret Show in Phuket.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Island Tour.',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day with your partner as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'You can also stroll hand in hand on the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 5,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 6,
        title: 'Phuket to Bangkok. Evening Dinner Cruise.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to the airport.',
          'You will then board a 2-hour flight to Bangkok.',
          'Upon reaching Bangkok, meet our representative who will transfer you to your hotel in Bangkok.',
          'Upon reaching, check-in to your hotel and rest for some time.',
          'In the evening, we will take you to enjoy a romantic dinner on a luxury cruise through the Chao Phraya River.',
          'Marvel at the beautiful skyline of Thailand and enjoy the live performances.',
          'Relish in the delicious buffet dinner in a perfect romantic setting.',
          'After completing your dinner, return back to your hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 7,
        title: 'Bangkok City Tour and Temple Tour.',
        description: [
          'Wake up to a beautiful morning in Bangkok and have your breakfast.',
          'Next, get ready to explore the iconic landmarks of Bangkok as you embark on a city tour today.',
          'Board your transfers to begin your city tour.',
          'On this tour, you will visit some of the famous temples like the Golden Buddha Temple, and Temple of the Emerald Buddha.',
          'We will also take you to the dazzling Gems Gallery, where you can shop some precious and semi-precious stones.',
          'Upon completing the city tour, return back to your hotel and have some rest.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 8,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Honeymoon Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '02 Nights Krabi accommodation',
      '03 Nights Phuket accommodation',
      '02 Nights Bangkok accommodation',
      'Krabi 4 Island Tour with Lunch',
      'Siam Cabaret Show Phuket',
      'Phi Phi island tour with lunch',
      'Phuket city tour',
      'Cruise Dinner at Chao Phraya River',
      'Bangkok City and Temple Tour',
      'Transfer: Airport - Krabi - Phuket - Airport',
      'Transfer: Bangkok Airport to Hotel - Airport'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions.',
      'Security deposit at the hotel.',
      'Round trip flight is not included.',
      'National park fees of 4 Island Tour and Phi Phi Island are not included in the package. Customers will have to pay THB 400 per person on the spot.'
    ],
    stays: [
      'Krabi: Deluxe Room / Similar',
      'Phuket: Deluxe Room / Similar',
      'Bangkok: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹45,999' }
    ],
    paymentPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    cancellationPolicy: [
      'At booking: 25% booking advance is non-refundable.',
      'Within 45 days: Minimum 50% deduction.',
      'Within 30 days: Minimum 75% deduction.',
      '20 days or less: 100% forfeited.'
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India.',
      'Sunscreen & lip balm, Good U/V protection sunglasses.',
      'Personal Medicines (if any).'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'A sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'Toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '45',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket Thailand Romantic Escape',
    slug: 'wanderphilia-exclusive-5-nights-6-days-krabi-phuket-thailand-romantic-escape',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on an unforgettable romantic escape to Thailand with our Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket package. Discover Krabi's stunning limestone cliffs, explore the pristine Phi Phi Islands by speedboat, watch a dazzling cabaret show, and experience the cultural charm of Phuket. Perfectly curated for couples seeking romance, adventure, and relaxation, this package includes luxury transfers, premium accommodation, guided island tours, and wonderful romantic memories to cherish for a lifetime.`,
    duration: 6,
    nights: 5,
    price: 35999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Krabi',
      '4 Island',
      'Phuket',
      'Phi Phi Island',
      'Phuket City Tour'
    ],
    overviewPoints: [
      'Route: Krabi → Phuket',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Phuket.',
      'Trip End: Phuket.',
      'Major Highlights: Krabi 4 Island Speedboat Tour, Siam Cabaret Show, Phi Phi Island Tour, Phuket City Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Phuket. Transfer to Krabi.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Krabi.',
          'Enjoy a 3-hour drive to Krabi, through scenic tropical landscapes.',
          'Upon reaching Krabi, check-in to the hotel and have some rest.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: '4 Island Tour by Speed Boat.',
        description: [
          'Post breakfast in the morning, get ready to spend an amazing day in the ocean.',
          'Board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic islands around Krabi.',
          'On this tour, you will visit the scenic Phranang Cave Beach, Tup Island, Poda Island and Chicken Island.',
          'You will also take a small stopover in between to have your lunch.',
          'Spend this day exploring the secluded beaches, admiring the limestone rock formations or sit leisurely by the beach watching the blue ocean.',
          'Adventure couples can indulge in some fun water activities and discover more about each other while spending quality time in this romantic setting.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket. Cabaret Show in the evening.',
        description: [
          'After having your breakfast in the morning, get ready for the day.',
          'You will then board your transfers to Phuket.',
          'Reach Phuket, check-in to the hotel and have some rest.',
          'In the evening, watch the graceful movements of the artists as you enjoy the Siam Cabaret Show in Phuket.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Island Tour.',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day with your partner as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'You can also stroll hand in hand on the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 5,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Honeymoon Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '02 Nights Krabi accommodation',
      '03 Nights Phuket accommodation',
      'Krabi 4 Island Tour with Lunch',
      'Siam Cabaret Show Phuket',
      'Phi Phi island tour with lunch',
      'Phuket city tour',
      'Transfer: Airport -Krabi - Phuket - Airport'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions',
      'Security deposit at the hotel.',
      'Round trip flight is not included.',
      'National park fees of 4 Island Tour and Phi Phi Island are not included in the package. Customers will have to pay THB 400 per person on the spot.'
    ],
    stays: [
      'Krabi: Deluxe Room / Similar',
      'Phuket: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹35,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '46',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Thailand Phuket Bangkok Couple Leisure Getaway',
    slug: 'wanderphilia-exclusive-5-nights-6-days-thailand-phuket-bangkok-couple-leisure-getaway',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on a perfect couple's getaway to Thailand with our Wanderphilia Exclusive 5 Nights 6 Days Phuket Bangkok Leisure Package. Experience a dazzling cabaret show in Phuket, explore the breathtaking Phi Phi Islands by speedboat, enjoy a romantic evening dinner cruise down the Chao Phraya River, and embark on a guided city and temple tour of Bangkok. This package is ideal for couples seeking a blend of tropical relaxation and cultural wonders.`,
    duration: 6,
    nights: 5,
    price: 35999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Phuket',
      'Phi Phi Island',
      'Bangkok Evening Dinner Cruise',
      'Bangkok City & Temple Tour'
    ],
    overviewPoints: [
      'Route: Phuket → Bangkok',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Phuket.',
      'Trip End: Bangkok.',
      'Major Highlights: Simon Cabaret Show, Phi Phi Island Tour, Chao Phraya Dinner Cruise, Bangkok City & Temple Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Phuket. Cabaret Show in the evening.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to your hotel.',
          'Upon reaching your hotel in Phuket, check-in to the hotel and have some rest.',
          'In the evening, watch the graceful movements of the artists as you enjoy the Simon Cabaret Show in Phuket.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 2,
        title: 'Phi Phi Island Tour.',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day with your partner as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'You can also stroll hand in hand on the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 3,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 4,
        title: 'Phuket to Bangkok. Evening Dinner Cruise.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to the airport.',
          'You will then board a 2-hour flight to Bangkok.',
          'Upon reaching Bangkok, meet our representative who will transfer you to your hotel in Bangkok.',
          'Upon reaching, check-in to your hotel and rest for some time.',
          'In the evening, we will take you to enjoy a romantic dinner on a luxury cruise through the Chao Phraya River.',
          'Marvel at the beautiful skyline of Thailand and enjoy the live performances.',
          'Relish in the delicious buffet dinner in a perfect romantic setting.',
          'After completing your dinner, return back to your hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 5,
        title: 'Bangkok City Tour and Temple Tour.',
        description: [
          'Wake up to a beautiful morning in Bangkok and have your breakfast.',
          'Next, get ready to explore the iconic landmarks of Bangkok as you embark on a city tour today.',
          'Board your transfers to begin your city tour.',
          'On this tour, you will visit some of the famous temples like the Golden Buddha Temple, and Temple of the Emerald Buddha.',
          'We will also take you to the dazzling Gems Gallery, where you can shop some precious and semi-precious stones.',
          'Upon completing the city tour, return back to your hotel and have some rest.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Honeymoon Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '03 Nights Phuket accommodation',
      '02 Nights Bangkok accommodation',
      'Siam Cabaret Show Phuket',
      'Phi Phi island tour with lunch',
      'Phuket city tour',
      'Cruise Dinner at Chopraya River',
      'Bangkok City and Temple Tour',
      'Transfer: Airport -Krabi - Phuket - Airport',
      'Transfer: Bangkok Airport to Hotel - Airport'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions',
      'Security deposit at the hotel.',
      'Round trip flight is not included.',
      'National park fees of 4 Island Tour and Phi Phi Island are not included in the package. Customers will have to pay THB 400 per person on the spot.'
    ],
    stays: [
      'Phuket: Deluxe Room / Similar',
      'Bangkok: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹35,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '47',
    title: 'Wanderphilia Exclusive 8 Nights 9 Days Whole Of Thailand Bangkok Pattaya Phuket Perfect Couple Trip',
    slug: 'wanderphilia-exclusive-8-nights-9-days-whole-of-thailand-bangkok-pattaya-phuket-perfect-couple-trip',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on the ultimate romantic getaway with our Wanderphilia Exclusive 8 Nights 9 Days Whole of Thailand Honeymoon Package. This comprehensive couple's tour takes you through the beautiful sights of Pattaya, the bustling capital of Bangkok, and the tropical paradise of Phuket. Enjoy the stunning Alcazar Show, speed boat transfers to Coral Island, botanical gardens in Nong Nooch Village, a full day at Safari World, a scenic dinner cruise on Chao Phraya River, wat and temple tours, a Simon Cabaret show, and exploring Phi Phi Islands. Perfect for couples desiring the complete Thailand experience.`,
    duration: 9,
    nights: 8,
    price: 55999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Pattaya',
      'Alcazar Show',
      'Coral Island',
      'Nong Nooch Village',
      'Full Day Bangkok Safari with Marine Park',
      'Bangkok Evening Dinner Cruise',
      'Bangkok City & Temple Tour',
      'Phuket',
      'Siam Niramit Show',
      'Phi Phi Island'
    ],
    overviewPoints: [
      'Route: Pattaya → Bangkok → Phuket',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Bangkok.',
      'Trip End: Phuket.',
      'Major Highlights: Alcazar Show, Coral Island speedboat tour, Nong Nooch Village, Safari World & Marine Park, Chao Phraya Dinner Cruise, Bangkok Temple Tour, Simon Cabaret Show, Phi Phi Island Speedboat Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Bangkok. Transfer to Pattaya and Evening Alcazar Show.',
        description: [
          'Upon your arrival at the Bangkok airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Pattaya.',
          'Enjoy a 2-hour drive to Pattaya, through scenic tropical landscapes.',
          'Upon reaching Pattaya, check in to the hotel and have some rest.',
          'In the evening, head out to visit the famous Alcazar Show which will amaze you with its mesmerizing and exotic set designs.',
          'The duration of the show is 70 minutes and features 17 acts that showcase the culture, dance, and songs of Chinese, Thai, Indian, Russian, Persian, etc',
          'After enjoying the show, return back to your hotel.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Start your day early and have your breakfast at the hotel.',
          'Get ready for a fun-filled day as you board your transfers for the Coral Island Tour.',
          'Reach the port, hop on your speedboat and enjoy a 45-minute boat ride to Coral Island.',
          'Upon reaching, spend some peaceful time by strolling leisurely on the famous Tawaen Beach.',
          'Adventure enthusiasts can indulge in some fun water activities and feel the adrenaline rush.',
          'You can choose to indulge in snorkeling and sea walker diving to discover the colourful aquatic life here.',
          'After exploring the islands, return to the mainland of Thailand.',
          'You can then spend the rest of the time partying on the famous Night street of Pattaya which has several bars, pubs, etc. to enjoy the nightlife.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Village Tour.',
        description: [
          'Wake up to a refreshing tropical morning in Pattaya and have your breakfast.',
          'Get ready and board your transfers to Nong Nooch Village which has a botanical garden, zoo and Thai Cultural Center with impressive shows.',
          'Spend some fun time with your family as you walk through the various themed parks, watch the live entertainment and watch the wild animals.',
          'You can also go for paddle boating in the scenic lake here.',
          'You will also get an insight into the countryside life and the cultural side of Thailand.',
          'Upon completing the exploration of Nong Nooch Tropical Village, return back to your hotel in Pattaya.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. City Tour and Evening Dinner Cruise.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to Bangkok',
          'Upon reaching Bangkok, check in to your hotel and head out to explore Bangkok.',
          'On this tour, you will visit some of the famous temples like the Golden Buddha Temple, and Temple of the Emerald Buddha.',
          'We will also take you to the dazzling Gems Gallery, where you can shop for some precious and semi-precious stones.',
          'Upon completing the city tour, return back to your hotel and have some rest.',
          'In the evening, we will take you to enjoy your dinner on a luxury cruise through the Chao Phraya River.',
          'Marvel at the beautiful skyline of Thailand and enjoy the live performances onboard.',
          'Relish in the delicious buffet dinner in a perfect setting.',
          'After completing your dinner, return back to your hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Have your breakfast at the hotel in the morning and get ready for the day.',
          'Board your transfers to enjoy an amazing day with your family and friends at the Safari World and Marine Park.',
          'Spend the whole day here, by participating in several activities.',
          'You can watch some exotic animals like giraffes, zebras, white tigers, and lions in the open-air zoo at Safari World.',
          'In the afternoon, you can relish the delicious lunch served at the restaurants or cafes inside this park.',
          'You can also watch the colorful birds in the aviary here.',
          'Enjoy watching the aquatic animals like dolphins and sea lions.',
          'You can also watch some shows for entertainment in various zones - Cowboy shows, tricks by various animals like elephants, dolphins, etc.',
          'After spending this fun-filled day, return to the hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 6,
        title: 'Bangkok to Phuket. Cabaret Show in the evening.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to the airport.',
          'You will then board a 2-hour flight to Phuket.',
          'Upon reaching Phuket, meet our representative who will transfer you to your hotel.',
          'Upon reaching, check in to your hotel and rest for some time.',
          'In the evening, watch the graceful movements of the artists as you enjoy the Simon Cabaret Show in Phuket.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 7,
        title: 'Phi Phi Island Tour.',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day with your partner as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'You can also stroll hand in hand on the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 8,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 9,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Phuket Airport for your onward journey.',
          'Your romantic Thailand Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '03 Nights Pattaya accommodation',
      '02 Nights Bangkok accommodation',
      '03 Nights Phuket accommodation',
      'Alcazar shows',
      'Coral Island with lunch',
      'Nong Nooch Village tour',
      'Bangkok City and Temple (Golden Buddha & Reclining Buddha) tour',
      'Dinner Cruise Chao River',
      'Safari world with Marine Park tour with lunch',
      'Simon Cabaret Show Phuket',
      'Phi Phi island tour with lunch',
      'Phuket city tour',
      'Transfer: Airport - Pattaya - Bangkok - Airport - Phuket - Airport PVT'
    ],
    notIncluded: [
      'Airfare, advised separately',
      'Any Expenses of a personal nature',
      'Any meals not explicitly mentioned in the itinerary',
      'GST & TCS as applicable extra',
      'National Park Fee'
    ],
    stays: [
      'Pattaya: Deluxe Room / Similar',
      'Bangkok: Deluxe Room / Similar',
      'Phuket: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹55,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '48',
    title: 'Wanderphilia Exclusive 6 Nights 7 Days Thailand Bangkok Pattaya Perfect Family Getaway',
    slug: 'wanderphilia-exclusive-6-nights-7-days-thailand-bangkok-pattaya-perfect-family-getaway',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on the perfect family getaway to Thailand with our Wanderphilia Exclusive 6 Nights 7 Days Bangkok Pattaya Package. Create lifelong family memories as you enjoy Pattaya's famous Alcazar Show, explore Coral Island by speedboat, wander Nong Nooch Village botanical gardens, spend full days at Safari World & Marine Park and Dream World theme park, experience a scenic dinner cruise on Chao Phraya River, and enjoy a guided wat and temple tour of Bangkok.`,
    duration: 7,
    nights: 6,
    price: 30999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 4,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Pattaya',
      'Alcazar Show',
      'Coral Island Tour',
      'Nong Nooch Village',
      'Full Day Bangkok Safari with Marine Park',
      'Full Day Dream World',
      'Bangkok Evening Dinner Cruise',
      'Bangkok City & Temple Tour'
    ],
    overviewPoints: [
      'Route: Pattaya → Bangkok',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Bangkok.',
      'Trip End: Bangkok.',
      'Major Highlights: Alcazar Show, Coral Island speedboat tour, Nong Nooch Village, Safari World & Marine Park, Dream World Amusement Park, Chao Phraya Dinner Cruise, Bangkok Temple Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Bangkok. Transfer to Pattaya and Evening Alcazar Show.',
        description: [
          'Upon your arrival at the Bangkok airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Pattaya.',
          'Enjoy a 2-hour drive to Pattaya, through scenic tropical landscapes.',
          'Upon reaching Pattaya, check in to the hotel and have some rest.',
          'In the evening, head out to visit the famous Alcazar Show which will amaze you with its mesmerizing and exotic set designs.',
          'The duration of the show is 70 minutes and features 17 acts that showcase the culture, dance, and songs of Chinese, Thai, Indian, Russian, Persian, etc',
          'After enjoying the show, return back to your hotel.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Start your day early and have your breakfast at the hotel.',
          'Get ready for a fun-filled day as you board your transfers for the Coral Island Tour.',
          'Reach the port, hop on your speedboat and enjoy a 45-minute boat ride to Coral Island.',
          'Upon reaching, spend some peaceful time by strolling leisurely on the famous Tawaen Beach.',
          'Adventure enthusiasts can indulge in some fun water activities and feel the adrenaline rush.',
          'You can choose to indulge in snorkeling and sea walker diving to discover the colourful aquatic life here.',
          'After exploring the islands, return to the mainland of Thailand.',
          'You can then spend the rest of the time partying on the famous Night street of Pattaya which has several bars, pubs, etc. to enjoy the nightlife.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Village Tour.',
        description: [
          'Wake up to a refreshing tropical morning in Pattaya and have your breakfast.',
          'Get ready and board your transfers to Nong Nooch Village which has a botanical garden, zoo and Thai Cultural Center with impressive shows.',
          'Spend some fun time with your family as you walk through the various themed parks, watch the live entertainment and watch the wild animals.',
          'You can also go for paddle boating in the scenic lake here.',
          'You will also get an insight into the countryside life and the cultural side of Thailand.',
          'Upon completing the exploration of Nong Nooch Tropical Village, return back to your hotel in Pattaya.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. City Tour and Evening Dinner Cruise.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to Bangkok',
          'Upon reaching Bangkok, check in to your hotel and head out to explore Bangkok.',
          'On this tour, you will visit some of the famous temples like the Golden Buddha Temple, and Temple of the Emerald Buddha.',
          'We will also take you to the dazzling Gems Gallery, where you can shop for some precious and semi-precious stones.',
          'Upon completing the city tour, return back to your hotel and have some rest.',
          'In the evening, we will take you to enjoy your dinner on a luxury cruise through the Chao Phraya River.',
          'Marvel at the beautiful skyline of Thailand and enjoy the live performances onboard.',
          'Relish in the delicious buffet dinner in a perfect setting.',
          'After completing your dinner, return back to your hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Have your breakfast at the hotel in the morning and get ready for the day.',
          'Board your transfers to enjoy an amazing day with your family and friends at the Safari World and Marine Park.',
          'Spend the whole day here, by participating in several activities.',
          'You can watch some exotic animals like giraffes, zebras, white tigers, and lions in the open-air zoo at Safari World.',
          'In the afternoon, you can relish the delicious lunch served at the restaurants or cafes inside this park.',
          'You can also watch the colorful birds in the aviary here.',
          'Enjoy watching the aquatic animals like dolphins and sea lions.',
          'You can also watch some shows for entertainment in various zones - Cowboy shows, tricks by various animals like elephants, dolphins, etc.',
          'After spending this fun-filled day, return to the hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 6,
        title: 'Full-Day Tour of Dream World.',
        description: [
          'Post breakfast in the morning, get ready, and board your transfers to the Dream World.',
          'Reach Dream World and enjoy the day exploring various theme-based zones here.',
          'Experience the adrenaline rush as you hop on fun rides such as the Sky Coaster, the Speed Mouse Coaster, Grand Canyon, Super Splash, and more.',
          'Enjoy the thrill at some of the park’s most daring slides like Super Splash, Hanging Coaster, and Space Mountain.',
          'The kid in you will jump for joy as you meet your favorite childhood cartoon characters here.',
          'In the afternoon, have your lunch at the in-house restaurant and cafes.',
          'You can also enjoy snow sports in the snow world here and enjoy many water rides in the water canyon.',
          'After enjoying your day at the Dream World, return back to the hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Family Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '03 Nights Pattaya accommodation',
      '03 Nights Bangkok accommodation',
      'Alcazar shows',
      'Coral Island with lunch',
      'Nong Nooch Village tour',
      'Bangkok City and Temple (Golden Buddha & Reclining Buddha) tour',
      'Dinner Cruise Chao Phraya River',
      'Safari world with Marine Park tour with lunch',
      'Dream World with Lunch',
      'Transfer: Airport - Pattaya - Bangkok - Airport PVT'
    ],
    notIncluded: [
      'Airfare, advised separately',
      'Any Expenses of a personal nature',
      'Any meals not explicitly mentioned in the itinerary',
      'GST & TCS as applicable extra',
      'National Park Fee'
    ],
    stays: [
      'Pattaya: Deluxe Room / Similar',
      'Bangkok: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹30,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '49',
    title: 'Wanderphilia Exclusive 4 Nights 5 Days Thailand Exclusive Phuket Perfect Family Leisure Trip',
    slug: 'wanderphilia-exclusive-4-nights-5-days-thailand-exclusive-phuket-perfect-family-leisure-trip',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Experience the ultimate family vacation with our Wanderphilia Exclusive 4 Nights 5 Days Thailand Exclusive Phuket Family Leisure Trip. Take in spectacular views from the Big Buddha and Promthep Cape on a guided city tour, discover the breathtaking Phi Phi Islands by speedboat with a local lunch, and get up close with big cats at the Phuket Tiger Kingdom. Perfect for families looking for a mixture of adventure and tropical relaxation.`,
    duration: 5,
    nights: 4,
    price: 25999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 4,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Phuket',
      'City Tour with Big Buddha',
      'Promthep Cape Phuket',
      'Phi Phi Island Tour',
      'Visit Tiger Kingdom'
    ],
    overviewPoints: [
      'Route: Phuket',
      'Duration: 4 Nights / 5 Days.',
      'Trip Start: Phuket.',
      'Trip End: Phuket.',
      'Major Highlights: Big Buddha City Tour, Promthep Cape, Phi Phi Islands Speedboat Tour, Tiger Kingdom (Medium Tiger Zone).'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Phuket. Day at leisure.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to your hotel.',
          'Upon reaching your hotel in Phuket, check in to the hotel and have some rest.',
          'You can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 2,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'We will also explore Old Phuket Town known for the Sino-Portuguese style architecture.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 3,
        title: 'Phi Phi Island Tour with Local Lunch',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'Stroll on the soft sand at the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 4,
        title: 'Visit Tiger Kingdom (Medium Tiger Zone). Evening at Leisure.',
        description: [
          'Have your breakfast at the hotel in the morning and get ready for the day.',
          'Today, we will participate in one of the most unique and fun experiences in Phuket.',
          'Get ready to meet the big cats as we take you to the Tiger Kingdom in Phuket.',
          'Upon reaching, we will visit the Medium-sized Tiger Zone where you can feed, pet, and click pictures with the tigers.',
          'You can also get information on tiger behavior and conservation efforts taken to protect them.',
          'You can also shop some tiger souvenirs and enjoy some delicious food in the cafe of the Tiger Kingdom',
          'After completely exploring the Tiger Kingdom, board your return transfers to the hotel.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 5,
        title: 'Departure. Take back a lot of happy memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Phuket Airport for your onward journey.',
          'Your amazing Thailand Family Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '4 nights’ accommodation with breakfast.',
      'All transportation by A/c Vehicles on a shared basis.',
      'Phuket City tour with shared transfers.',
      'Full Day Phi Phi Island Tour with Lunch by Speed boat (Excluding National Park Fee)',
      'Half day Tiger Kingdom tour with shared Transfer (Medium Tiger)',
      '24*7 on-call travel assistance.',
      'Airport pick-up and drop transfers.'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions.',
      'Security deposit at the hotel',
      'Round trip flight'
    ],
    stays: [
      'Phuket: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹25,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '50',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Thailand Bangkok Pattaya Relaxed Family Trip',
    slug: 'wanderphilia-exclusive-5-nights-6-days-thailand-bangkok-pattaya-relaxed-family-trip',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on a relaxed family getaway to Thailand with our Wanderphilia Exclusive 5 Nights 6 Days Bangkok Pattaya Family Package. Perfect for families looking to create wonderful memories, this tour features Pattaya's famous Alcazar Show, a speedboat tour to Coral Island, a full day exploring Safari World and Marine Park, and a city and temple tour of Bangkok. Enjoy a blend of leisure, entertainment, and sightseeing designed to keep all family members engaged and relaxed.`,
    duration: 6,
    nights: 5,
    price: 30999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 4,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Pattaya',
      'Alcazar Show',
      'Coral Island Tour',
      'Full Day Bangkok Safari with Marine Park',
      'Bangkok City & Temple Tour'
    ],
    overviewPoints: [
      'Route: Pattaya → Bangkok',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Bangkok.',
      'Trip End: Bangkok.',
      'Major Highlights: Coral Island speedboat tour, Safari World & Marine Park, Bangkok City & Temple Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Bangkok. Transfer to Pattaya.',
        description: [
          'Upon your arrival at the Bangkok airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Pattaya.',
          'Enjoy a 2-hour drive to Pattaya, through scenic tropical landscapes.',
          'Upon reaching Pattaya, check in to the hotel and have some rest.',
          'You can spend the rest of your time at leisure.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Start your day early and have your breakfast at the hotel.',
          'Get ready for a fun-filled day as you board your transfers for the Coral Island Tour.',
          'Reach the port, hop on your speedboat and enjoy a 45-minute boat ride to Coral Island.',
          'Upon reaching, spend some peaceful time by strolling leisurely on the famous Tawaen Beach.',
          'Adventure enthusiasts can indulge in some fun water activities and feel the adrenaline rush.',
          'You can choose to indulge in snorkeling and sea walker diving to discover the colourful aquatic life here.',
          'After exploring the islands, return to the mainland of Thailand.',
          'You can then spend the rest of the time partying on the famous Night street of Pattaya which has several bars, pubs, etc. to enjoy the nightlife.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 3,
        title: 'Day at leisure (Free Day to Explore the city)',
        description: [
          'Wake up to a pleasant morning in Pattaya and have your breakfast at the hotel.',
          'You can then spend the rest of the day at leisure.',
          'Either relax in the hotel or explore around the city.',
          'Visit attractions like Big Buddha Temple, Pattaya City View Point, and the Sanctuary of Truth (at an additional cost).',
          'In the evening you can watch the Alcazar Show or party at Pattaya Night Street (on your own).',
          'After completing your exploration, return back to your hotel.',
          'Overnight stay in Pattaya.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. En route Bangkok City Tour.',
        description: [
          'After having your breakfast at the hotel, pack your bag and board your transfers to Bangkok.',
          'Before heading to the hotel in Bangkok, we will first visit some of the famous landmarks here like the Golden Buddha Temple and Mini Reclining Buddha.',
          'After completing the sightseeing tour, reach your hotel and check in.',
          'You can then spend the rest of the time at leisure.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Have your breakfast at the hotel in the morning and get ready for the day.',
          'Board your transfers to enjoy an amazing day with your family and friends at the Safari World and Marine Park.',
          'Spend the whole day here, by participating in several activities.',
          'You can watch some exotic animals like giraffes, zebras, white tigers, and lions in the open-air zoo at Safari World.',
          'In the afternoon, you can relish the delicious lunch served at the restaurants or cafes inside this park.',
          'You can also watch the colorful birds in the aviary here.',
          'Enjoy watching the aquatic animals like dolphins and sea lions.',
          'You can also watch some shows for entertainment in various zones - Cowboy shows, tricks by various animals like elephants, dolphins, etc.',
          'After spending this fun-filled day, return to the hotel.',
          'Overnight stay in Bangkok.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of happy memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Family Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '03 Nights Pattaya accommodation',
      '02 Nights Bangkok accommodation',
      'Coral Island with lunch',
      'Bangkok City and Temple (Golden Buddha & Reclining Buddha) tour',
      'Safari world with Marine Park tour with lunch',
      'Transfer: Airport - Pattaya - Bangkok - Airport PVT'
    ],
    notIncluded: [
      'Airfare, advised separately',
      'Any Expenses of a personal nature',
      'Any meals not explicitly mentioned in the itinerary',
      'GST & TCS as applicable extra',
      'National Park Fee'
    ],
    stays: [
      'Pattaya: Deluxe Room / Similar',
      'Bangkok: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹30,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  },
  {
    id: '51',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket Thailand Romantic Escape',
    slug: 'wanderphilia-exclusive-6-nights-7-days-krabi-phuket-thailand-romantic-escape',
    image: '/images/thailand.jpg',
    destination: 'Thailand',
    category: 'Thailand',
    description: `Embark on a beautiful tropical romance with our Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket Thailand Romantic Escape. Specially crafted for couples, this tour features a speedboat trip exploring Krabi's 4 Islands, a morning city tour of Krabi's natural and cultural landmarks, speedboat excursion of the scenic Phi Phi Islands with a local lunch, and a guided Phuket city tour. Enjoy premium beach stays and custom transfers, creating memories of a lifetime with your partner.`,
    duration: 7,
    nights: 6,
    price: 30999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 2,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Krabi',
      '4 Island',
      'Phuket',
      'Phi Phi Island',
      'Phuket City Tour'
    ],
    overviewPoints: [
      'Route: Krabi → Phuket',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Phuket.',
      'Trip End: Phuket.',
      'Major Highlights: Krabi 4 Island speedboat tour, Krabi City Tour, Phi Phi Islands Speedboat Tour, Phuket City Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrive in Phuket. Transfer to Krabi.',
        description: [
          'Upon your arrival at the Phuket airport, complete the immigration formalities.',
          'Meet our representative, who will help you board your transfers to Krabi.',
          'Enjoy a 3-hour drive to Krabi, through scenic tropical landscapes.',
          'Upon reaching Krabi, check-in to the hotel and have some rest.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: '4 Island Tour by Speed Boat.',
        description: [
          'Post breakfast in the morning, get ready to spend an amazing day in the ocean.',
          'Board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic islands around Krabi.',
          'On this tour, you will visit the scenic Phranang Cave Beach, Tup Island, Poda Island and Chicken Island.',
          'You will also take a small stopover in between to have your lunch.',
          'Spend this day exploring the secluded beaches, admiring the limestone rock formations or sit leisurely by the beach watching the blue ocean.',
          'Adventure couples can indulge in some fun water activities and discover more about each other while spending quality time in this romantic setting.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 3,
        title: 'Krabi Half Day Morning City Tour. Evening at leisure.',
        description: [
          'Wake up to a pleasant morning in Krabi and have your breakfast at the hotel.',
          'Get ready as we begin our morning city tour of Krabi.',
          'We will start by taking a scenic drive along the coastline of Krabi and marvel at the endless views of the Andaman Sea.',
          'Our first stop here would be Khao Khanab Nam - a secluded cave along the Krabi River with beautiful limestone cave formations.',
          'Later, drive a little further along the mangrove forest to reach the symbol of Krabi - “The Mud Crabs Sculpture”, to click some pictures.',
          'Next, we will visit Wat Sai Thai - a temple backed with a limestone cliff housing a 150-year-old reclining Buddha Statue.',
          'Our tour concludes with a short hike to Wat Sai Thai also known as Tiger Cave temple.',
          'Here, we will marvel at the panoramic view of the surroundings and take a walk in the rainforest to see big trees 1000 years old.',
          'Upon completing the sightseeing, we will return to our hotel.',
          'You can then spend the day at leisure.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Krabi to Phuket. Day at leisure.',
        description: [
          'After having your breakfast in the morning, get ready for the day.',
          'You will then board your transfers to Phuket which will take around 2-3 hours.',
          'Reach Phuket, check in to the hotel, and have some rest.',
          'You can then spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 5,
        title: 'Phi Phi Island Tour.',
        description: [
          'Wake up to a beautiful tropical morning and have your breakfast at the hotel.',
          'Next, get ready and board your transfers to the starting point of your speed boat.',
          'Hop on to your speedboat and spend the day exploring the scenic Phi Phi islands.',
          'Enjoy this day with your partner as you spend some leisure time gliding through the ocean waters.',
          'Upon reaching the Phi Phi Islands, you will visit some of the iconic locations like the Maya Bay and some stunning limestone caves.',
          'You can also stroll hand in hand on the scenic Monkey Beach.',
          'You will also take a small stopover in between to have your lunch.',
          'After exploring all the islands, return back to the mainland of Thailand.',
          'Upon reaching, you will be transferred back to your hotel.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 6,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Have your breakfast in the morning and get ready to explore Phuket.',
          'Board your transfers for the day, which will take you to some iconic landmarks across Phuket.',
          'On this city tour, you will visit the famous Karon View Point to admire stunning views of the crescent-shaped Kata and Kata Noi Beaches.',
          'You will also visit the historic Wat Chalong Temple and the famous Buddha Statue of Phuket.',
          'Upon completing the city tour, you can spend the rest of the day at leisure.',
          'Overnight stay in Phuket.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Have your breakfast in the morning and pack your bags.',
          'Board your transfer to Bangkok Airport for your onward journey.',
          'Your amazing Thailand Honeymoon Tour concludes once you are dropped off at the airport.',
          'Take back a lot of happy memories to cherish for a lifetime.'
        ]
      }
    ],
    included: [
      '3 nights’ accommodation with breakfast in Krabi Hotel.',
      '3 nights’ accommodation with breakfast in Phuket Hotel.',
      'All transportation by A/c Vehicles on a shared basis.',
      'Four Island tour with speed boat on a shared basis.',
      'Half day Krabi Morning City Tour with shared transfers',
      'Krabi hotel to Phuket hotel transfers.',
      'Phuket City tour with shared transfers.',
      'Full Day Phi Phi Island Tour with Lunch by Speed boat (Excluding National Park Fee)',
      '24*7 on-call travel assistance.',
      'Airport pick-up and drop transfers.'
    ],
    notIncluded: [
      'Any expense of a personal nature.',
      'Any meals not explicitly mentioned in the itinerary.',
      'GST and TCS as applicable extra.',
      'Any change in itinerary due to unforeseen conditions',
      'Security deposit at the hotel.',
      'Round trip flight is not included.',
      'National park fees of 4 Island Tour and Phi Phi Island are not included in the package. Customers will have to pay THB 400 per person on the spot.'
    ],
    stays: [
      'Krabi: Deluxe Room / Similar',
      'Phuket: Deluxe Room / Similar'
    ],
    batchDates: [],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing (Per Person)', value: '₹30,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Travel Essentials',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle',
          'a sun cap',
          'UV protected sunglasses'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Sport Shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder',
          'Medicines for headaches, diarrhoea, motion sickness',
          'Dettol',
          'Bandages',
          'Cotton'
        ]
      },
      {
        title: 'Personal Accessories',
        items: [
          'toothpaste, toothbrush',
          'Paper soap, or sanitizer',
          'Sunscreen minimum of spf40 , lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'National Park Fees during 4 Island and Phi Phi Island tours are not included in the package. Customers will have to pay THB 400 per person on the spot.',
      'Koh Phangan Fullmoon party expenses are on your own. 200 THB per person.',
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Thailand.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'Phuket arrival time should be 10:00 Am and Departure Flight time from Phuket should be after 02:00 Pm.',
      'Rates are not valid for Festival Duration like Diwali, Dussehra, Christmas, and New Year'
    ]
  }
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
  {
    title: 'Bhutan',
    slug: 'bhutan',
    image: '/images/Bhutan_cat.jpg',
    description: 'A peaceful kingdom known for its stunning landscapes, rich Buddhist culture, and focus on happiness.',
    tripCount: 3,
  },
  {
    title: 'Singapore',
    slug: 'singapore',
    image: '/images/singapore.png',
    description: 'A futuristic city-state combining lush gardens, thrilling attractions, and diverse culture.',
    tripCount: 1,
  },
  {
    title: 'Sikkim',
    slug: 'sikkim',
    image: '/images/sikkim.png',
    description: 'Explore the land of mystic valleys, pristine lakes, and majestic peaks.',
    tripCount: 1,
  },
  {
    title: 'Thailand',
    slug: 'thailand',
    image: '/images/thailand.jpg',
    description: 'Tropical paradise with gorgeous islands, white sand beaches, and vibrant nightlife.',
    tripCount: 1,
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
    image: '/images/leh-ladakh.jpg',
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
    image: '/images/japan.jpg',
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
    image: '/images/everest.jpg',
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
