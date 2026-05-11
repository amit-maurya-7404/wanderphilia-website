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
    image: '/images/Bhutan_cat.jpeg',
    description: 'A peaceful kingdom known for its stunning landscapes, rich Buddhist culture, and focus on happiness.',
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
