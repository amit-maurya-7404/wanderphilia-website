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

export interface TripInclusionCounts {
  hotels?: number | string
  transfers?: number | string
  experiences?: number | string
  meals?: number | string
  visa?: boolean | string
  tripGuide?: boolean | string
}

export interface TripSummaryActivityGroup {
  city?: string
  title?: string
  items: string[]
}

export interface TripSummaryAccommodationItem {
  city?: string
  hotel: string
}

export interface TripSummaryDetails {
  accommodation?: (string | TripSummaryAccommodationItem)[]
  meals?: string[]
  transfers?: string[]
  activities?: (string | TripSummaryActivityGroup)[]
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
  route?: string
  staySummary?: string
  customRoute?: string
  overviewPoints?: string[]
  stays?: string[]
  summaryDetails?: TripSummaryDetails
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
  images?: string[]
  inclusionsSummary?: TripInclusionCounts
  inclusionsCount?: TripInclusionCounts
  hotelsCount?: number | string
  transfersCount?: number | string
  experiencesCount?: number | string
  mealsCount?: number | string
}

export function getTripInclusionDetails(trip: Partial<Trip>): {
  hotels: string
  transfers: string
  experiences: string
  meals: string
  visa?: string | null
  tripGuide: string
} {
  const custom = trip.inclusionsSummary || trip.inclusionsCount || {}
  const duration = trip.duration || 1
  const itinerary = trip.itinerary || []

  // 1. HOTELS
  let hotelsStr = ''
  if (custom.hotels !== undefined && custom.hotels !== null) {
    if (typeof custom.hotels === 'number') {
      hotelsStr = `${custom.hotels} ${custom.hotels === 1 ? 'Hotel' : 'Hotels'}`
    } else {
      const s = String(custom.hotels).trim()
      hotelsStr = /hotel/i.test(s) ? s : `${s} Hotels`
    }
  } else if (trip.hotelsCount !== undefined) {
    hotelsStr = typeof trip.hotelsCount === 'number' ? `${trip.hotelsCount} ${trip.hotelsCount === 1 ? 'Hotel' : 'Hotels'}` : String(trip.hotelsCount)
  } else {
    let stayCount = 0
    if (trip.stays && trip.stays.length > 0) {
      stayCount = trip.stays.length
    } else if (itinerary.length > 0) {
      const locations = new Set<string>()
      itinerary.forEach((day) => {
        const descLines = Array.isArray(day.description) ? day.description : [day.description || '']
        for (const line of descLines) {
          const match = line.match(/(?:overnight stay (?:in|at|near)?|check-in (?:to your hotel in|to|at)?)\s+([^.,]+)/i)
          if (match && match[1]) {
            const loc = match[1].trim().toLowerCase()
            if (loc && !['hotel', 'camp', 'resort', 'the', 'your'].includes(loc)) {
              locations.add(loc)
            }
          }
        }
      })
      stayCount = locations.size
    }
    if (stayCount <= 0) {
      stayCount = Math.max(1, Math.min(duration - 1, Math.max(2, Math.round(duration / 2.2))))
    }
    hotelsStr = `${stayCount} ${stayCount === 1 ? 'Hotel' : 'Hotels'}`
  }

  // 2. TRANSFERS
  let transfersStr = ''
  if (custom.transfers !== undefined && custom.transfers !== null) {
    if (typeof custom.transfers === 'number') {
      transfersStr = `${custom.transfers} Transfers`
    } else {
      const s = String(custom.transfers).trim()
      transfersStr = /transfer/i.test(s) ? s : `${s} Transfers`
    }
  } else if (trip.transfersCount !== undefined) {
    transfersStr = typeof trip.transfersCount === 'number' ? `${trip.transfersCount} Transfers` : String(trip.transfersCount)
  } else {
    let transferCount = 0
    if (itinerary.length > 0) {
      itinerary.forEach((day) => {
        const lines = Array.isArray(day.description) ? day.description : [day.description || '']
        lines.forEach((l) => {
          const lower = l.toLowerCase()
          if (
            lower.includes('transfer') ||
            lower.includes('pick up') ||
            lower.includes('pickup') ||
            lower.includes('drop') ||
            lower.includes('airport') ||
            lower.includes('drive to') ||
            lower.includes('travel to') ||
            lower.includes('proceed to') ||
            lower.includes('flight') ||
            lower.includes('ferry') ||
            lower.includes('speed boat') ||
            lower.includes('cruise') ||
            lower.includes('cab')
          ) {
            transferCount++
          }
        })
      })
    }
    if (transferCount < 4) {
      transferCount = Math.max(4, Math.round(duration * 1.55))
    }
    transfersStr = `${transferCount} Transfers`
  }

  // 3. EXPERIENCES
  let experiencesStr = ''
  if (custom.experiences !== undefined && custom.experiences !== null) {
    if (typeof custom.experiences === 'number') {
      experiencesStr = `${custom.experiences} Experiences`
    } else {
      const s = String(custom.experiences).trim()
      experiencesStr = /experience/i.test(s) ? s : `${s} Experiences`
    }
  } else if (trip.experiencesCount !== undefined) {
    experiencesStr = typeof trip.experiencesCount === 'number' ? `${trip.experiencesCount} Experiences` : String(trip.experiencesCount)
  } else {
    let expCount = 0
    if (trip.highlights && trip.highlights.length > 0) {
      expCount = trip.highlights.length
    }
    if (expCount < 3 && itinerary.length > 0) {
      expCount = Math.max(4, Math.round(duration * 1.1))
    }
    if (expCount <= 0) {
      expCount = Math.max(4, duration)
    }
    experiencesStr = `${expCount} Experiences`
  }

  // 4. MEALS
  let mealsStr = ''
  if (custom.meals !== undefined && custom.meals !== null) {
    if (typeof custom.meals === 'number') {
      mealsStr = `${custom.meals} Meals`
    } else {
      const s = String(custom.meals).trim()
      mealsStr = /meal/i.test(s) ? s : `${s} Meals`
    }
  } else if (trip.mealsCount !== undefined) {
    mealsStr = typeof trip.mealsCount === 'number' ? `${trip.mealsCount} Meals` : String(trip.mealsCount)
  } else {
    const mealCount = Math.max(1, duration - 1)
    mealsStr = `${mealCount} Meals`
  }

  // 5. VISA
  let visaStr: string | null = null
  if (custom.visa !== undefined && custom.visa !== null) {
    if (typeof custom.visa === 'boolean') {
      visaStr = custom.visa ? 'Visa' : null
    } else {
      visaStr = String(custom.visa).trim() || null
    }
  } else if (trip.tripType === 'International') {
    visaStr = 'Visa'
  } else {
    visaStr = null
  }

  // 6. TRIP GUIDE
  let guideStr = 'Trip Guide'
  if (custom.tripGuide !== undefined && custom.tripGuide !== null) {
    if (typeof custom.tripGuide === 'boolean') {
      guideStr = custom.tripGuide ? 'Trip Guide' : ''
    } else {
      guideStr = String(custom.tripGuide).trim() || 'Trip Guide'
    }
  }

  return {
    hotels: hotelsStr,
    transfers: transfersStr,
    experiences: experiencesStr,
    meals: mealsStr,
    visa: visaStr,
    tripGuide: guideStr,
  }
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Fly to Leh & arrive at Kushok Bakula Rimpochee Airport with scenic Himalayan aerial views',
          'Meet Wanderphilia representative & private transfer to hotel in Leh',
          'Hotel check-in, rest & mandatory high-altitude acclimatization',
          'Evening gentle acclimatization walk around Leh local market & cafes',
          'Trip briefing & route orientation by Trip Captain',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing: Magnetic Hill, Pathar Sahib, Sangam & Shanti Stupa',
        description: [
          'Enjoy morning breakfast at hotel',
          'Visit Hall of Fame Museum commemorating brave Indian soldiers',
          'Experience gravity-defying phenomenon at Magnetic Hill',
          'Seek blessings at sacred Gurudwara Pathar Sahib',
          'Witness magnificent confluence of Indus & Zanskar rivers at Sangam Point',
          'Catch breathtaking panoramic sunset over Leh Valley from iconic Shanti Stupa',
          'Evening at leisure to explore vibrant Leh Bazaar',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (5,359 m) — 130 km, 5-6 hrs',
        description: [
          'Early morning breakfast & start thrilling drive towards Nubra Valley',
          'Ascend and cross Khardung La Pass (17,582 ft / 5,359 m) — one of the highest motorable roads in the world',
          'Descend into the scenic valley of flowers along Shyok River',
          'Visit Diskit Monastery & marvel at the giant 106 ft Maitreya Buddha Statue',
          'Experience double-humped Bactrian camel safari & ATV rides on Hunder Sand Dunes',
          'Evening check-in at Nubra deluxe camp / hotel with bonfire',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake via Shyok River Route — 180 km, 5-6 hrs',
        description: [
          'Morning breakfast amidst peaceful Nubra desert landscape',
          'Drive along the scenic and rugged Shyok River valley route',
          'Pass through picturesque remote villages of Agam and Durbuk',
          'First glimpse of the mesmerizing blue waters of Pangong Tso (14,270 ft / 4,350 m)',
          'Spend afternoon admiring color-changing hues of the lake & click photos at famous 3-Idiots point',
          'Witness magical sunset over high-altitude lake surrounded by barren peaks',
          'Stargazing experience under crystal clear Himalayan skies',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Leh via Chang La Pass (5,360 m) — 140 km, 5-6 hrs',
        description: [
          'Wake up early to witness breathtaking golden sunrise over Pangong Lake',
          'Enjoy warm lakeside breakfast before departure',
          'Ascend and cross mighty Chang La Pass (17,586 ft / 5,360 m)',
          'En route visit the iconic Thiksey Monastery & Rancho School (Druk Padma Karpo)',
          'Arrive back in Leh by evening & hotel check-in',
          'Free time for souvenir shopping in Leh Main Bazaar & farewell cafe evening',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Departure from Leh — Fly Home with Unforgettable Ladakh Memories',
        description: [
          'Enjoy final breakfast in Leh',
          'Hotel check-out and private transfer to Leh Airport as per flight schedule',
          'Board flight with aerial Himalayan views & unforgettable Ladakh memories',
          'Meals: Breakfast'
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
    id: '2',
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Arrive at Leh Airport with stunning aerial views of snow-clad Himalayan ranges',
          'Warm welcome & private transfer to hotel in Leh',
          'Check-in and mandatory rest for high-altitude acclimatization',
          'Evening gentle walk to Leh Market & Leh Palace area',
          'Trip briefing & itinerary orientation by Trip Captain',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Cultural Sightseeing: Sangam, Magnetic Hill, Pathar Sahib & Shanti Stupa',
        description: [
          'Morning breakfast at hotel',
          'Explore Hall of Fame war museum & pay tribute to Indian heroes',
          'Experience Magnetic Hill phenomenon & drive along scenic Indus Valley',
          'Visit Gurudwara Pathar Sahib & Sangam confluence (Indus & Zanskar rivers)',
          'Visit Shanti Stupa for panoramic 360-degree sunset view of Leh town',
          'Evening cafe hopping and shopping in Leh market',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (5,359 m) — 125 km, 5-6 hrs',
        description: [
          'Early morning breakfast & start adventurous ride towards Nubra Valley',
          'Summit the legendary Khardung La Pass (17,582 ft / 5,359 m) — world’s premier motorable pass',
          'Scenic descent into Nubra Valley along Shyok River',
          'Visit historic Diskit Monastery & 106 ft Maitreya Buddha Statue overlooking the valley',
          'Explore Hunder White Sand Dunes with double-humped Bactrian camel ride',
          'Camp / hotel check-in with evening bonfire & dinner',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Excursion to Turtuk Village & Tyakshi (Indo-Pak Border) — 200 km, 7-8 hrs',
        description: [
          'Morning breakfast and drive along the scenic Shyok River towards Baltistan border',
          'Enter Turtuk Village — India’s northernmost village opened to tourists in 2010',
          'Explore unique Balti cultural heritage, ancient wooden houses & lush apricot orchards',
          'Visit Tyakshi Village — the last point accessible before the Indo-Pakistan Line of Control (LOC)',
          'Interact with warm locals and try traditional Balti cuisine / apricot juice',
          'Return drive to Hunder by evening & relax',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Lake via Shyok Route — 160 km, 5-6 hrs',
        description: [
          'Breakfast with scenic morning desert views in Nubra',
          'Ride along the rugged Shyok River gorges and scenic river crossings',
          'Pass picturesque remote hamlets of Agam, Shyok & Durbuk',
          'Arrive at world-famous Pangong Tso (14,270 ft / 4,350 m) — highest saltwater lake',
          'Witness enchanting colour changes of lake from turquoise to deep royal blue',
          'Photography at 3-Idiots point & magical evening sunset by the shore',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Pangong Lake to Leh via Chang La Pass (5,360 m) — 140 km, 5-6 hrs',
        description: [
          'Sunrise photography session over tranquil waters of Pangong Lake',
          'Lakeside breakfast & start return drive to Leh',
          'Cross mighty Chang La Pass (17,586 ft / 5,360 m) — 3rd highest motorable pass in the world',
          'En route stop at famous Thiksey Monastery & Sindhu Ghat',
          'Arrive in Leh by evening, check into hotel & rest',
          'Celebratory farewell group dinner in Leh',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 7,
        title: 'Departure from Leh — Return Home with Lifetime Memories',
        description: [
          'Morning breakfast at hotel',
          'Assisted transfer to Leh Airport as per flight schedule',
          'Fly back home carrying cherishable Ladakh expedition memories',
          'Meals: Breakfast'
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
    id: '3',
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Arrive at Leh Airport with breathtaking Himalayan aerial vistas',
          'Warm welcome & transfer to hotel in Leh',
          'Mandatory complete rest day for high-altitude acclimatization',
          'Evening gentle walk around Leh Main Market',
          'Tour briefing & bike allocation by Trip Captain & mechanic',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Sightseeing & Acclimatization Ride: Sangam, Magnetic Hill & Shanti Stupa',
        description: [
          'Breakfast followed by orientation ride along the scenic Leh-Srinagar Highway',
          'Visit Hall of Fame Museum, Magnetic Hill & Gurudwara Pathar Sahib',
          'Witness the scenic confluence of Indus & Zanskar rivers at Sangam Point',
          'Evening visit to Shanti Stupa for panoramic sunset over Leh Valley',
          'Final bike checks and gear fitting for upcoming high-altitude circuit',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (5,359 m) — 130 km, 5-6 hrs',
        description: [
          'Early morning ride flag-off towards Khardung La',
          'Scale Khardung La Pass (17,582 ft / 5,359 m) — iconic high mountain pass',
          'Descend into the vast white desert valley of Nubra',
          'Visit Diskit Monastery and the gigantic 106 ft Maitreya Buddha Statue',
          'Double-humped Bactrian camel safari & ATV rides on Hunder Sand Dunes',
          'Overnight in Nubra Valley Camps / Hotel',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake via Shyok Route — 180 km, 5-6 hrs',
        description: [
          'Morning breakfast in Nubra and start off-road trail along Shyok River',
          'Cross scenic riverbeds, rocky terrain and picturesque Ladakhi hamlets',
          'First breathtaking look of azure Pangong Lake (14,270 ft)',
          'Ride along the iconic shores & photoshoot at 3-Idiots point',
          'Sunset reflections and stargazing by lakeside camps',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Chushul, Rezang La & Tsaga La — 165 km, 7-8 hrs',
        description: [
          'Sunrise breakfast by Pangong Lake',
          'Ride through remote Changthang plateau towards Indo-China border region',
          'Pay tribute to 1962 war heroes at the historic Rezang La War Memorial',
          'Cross scenic Tsaga La Pass and Loma Bend checkpoint',
          'Arrive in remote astronomy village of Hanle (14,760 ft)',
          'Visit Hanle Monastery & world-famous Indian Astronomical Observatory',
          'Incredible Dark Sky Sanctuary stargazing & Milky Way photography',
          'Overnight in Hanle Homestay / Guesthouse',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Leh via Chumathang Hot Springs & Indus Valley — 260 km, 7-8 hrs',
        description: [
          'Morning breakfast in remote Hanle village',
          'Ride along the surreal Changthang landscapes and wild Kiang (Tibetan wild ass) sightings',
          'Stop at Chumathang Hot Springs known for natural mineral waters',
          'Cruise along smooth tarmac of Indus Valley highway passing Upshi and Karu',
          'Reach Leh by evening & return bikes to base',
          'Celebratory dinner in Leh market',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 7,
        title: 'Departure from Leh — End of Epic Ladakh Expedition',
        description: [
          'Morning breakfast at hotel',
          'Transfer to Leh Airport for return flight',
          'Depart with unforgettable memories of Khardung La, Pangong & Hanle',
          'Meals: Breakfast'
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
    id: '4',
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Arrive at Leh Airport with stunning snow-capped mountain views',
          'Airport reception & transfer to hotel in Leh',
          'Mandatory day of rest for oxygen acclimatization',
          'Evening gentle stroll in Leh Market & briefing with Trip Leader',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Sightseeing: Sangam, Magnetic Hill, Pathar Sahib & Shanti Stupa',
        description: [
          'Breakfast followed by test ride & bike allocation',
          'Visit Hall of Fame Museum, Magnetic Hill & Gurudwara Pathar Sahib',
          'Scenic stop at Indus-Zanskar Sangam confluence',
          'Sunset views from Shanti Stupa overlooking Leh city',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La (5,359 m) — 125 km, 5-6 hrs',
        description: [
          'Breakfast & thrilling ride up to Khardung La (17,582 ft / 5,359 m)',
          'Celebrate summiting world’s most iconic motorable pass',
          'Descend into picturesque Nubra Valley along Shyok River',
          'Visit Diskit Monastery & 106 ft Maitreya Buddha Statue',
          'Camel safari on Hunder Sand Dunes amidst mountain backdrop',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake via Shyok Route — 160 km, 5-6 hrs',
        description: [
          'Morning breakfast & off-road adventure along Shyok River valley',
          'Arrive at Pangong Tso (14,270 ft) & marvel at its multi-shade blue waters',
          'Lakeside photography at 3-Idiots point & sunset walk',
          'Stargazing under unpolluted high-altitude night skies',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial — 165 km, 7-8 hrs',
        description: [
          'Lakeside sunrise breakfast & departure towards Changthang border region',
          'Visit the iconic Rezang La War Memorial & pay homage to Charlie Company heroes',
          'Cross Tsaga La Pass and drive along raw Tibetan plateau wilderness',
          'Arrive in Hanle — India’s first designated Dark Sky Sanctuary (14,760 ft)',
          'Visit Hanle Monastery & world’s highest telescope observatory',
          'Overnight in Hanle',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Excursion to Umling La Pass (19,024 ft) — World’s Highest Motorable Pass',
        description: [
          'Early morning breakfast & prepare for the pinnacle ride of the expedition',
          'Ascend through high-altitude desert terrain to conquer Umling La Pass (19,024 ft / 5,798 m)',
          'Stand atop the Highest Motorable Road on Planet Earth — a world record achievement',
          'Photography at the world record milestone board overlooking Indo-China borderlands',
          'Visit Demchok border area & return to Hanle for warm evening celebration',
          'Overnight in Hanle',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Leh via Tso Moriri, Kyagar Tso, Puga & Chumathang — 289 km, 8-9 hrs',
        description: [
          'Early breakfast & start long scenic expedition across southern Ladakh',
          'Visit pristine high-altitude lake of Tso Moriri & Kyagar Tso',
          'Witness bubbling geothermal sulphur vents in surreal Puga Valley',
          'Pass Chumathang Hot Springs and cruise back into Leh along Indus River',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 8,
        title: 'Departure from Leh — Fly Home with World Record Memories',
        description: [
          'Morning breakfast at hotel',
          'Transfer to Leh Airport for onward journey',
          'Meals: Breakfast'
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
    id: '5',
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
        day: 1,
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Arrive at Leh Airport & transfer to hotel',
          'Complete rest day for high-altitude acclimatization',
          'Evening stroll in Leh Bazaar & tour briefing',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing: Magnetic Hill, Pathar Sahib & Shanti Stupa',
        description: [
          'Breakfast & test ride along Indus Valley',
          'Visit Hall of Fame, Magnetic Hill, Gurudwara Pathar Sahib & Sangam confluence',
          'Sunset views from Shanti Stupa overlooking Leh city',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (5,359 m) — 125 km, 5-6 hrs',
        description: [
          'Ride over legendary Khardung La Pass (17,582 ft / 5,359 m)',
          'Descend into Nubra Valley & visit Diskit Monastery (106 ft Buddha Statue)',
          'Double-humped camel safari on Hunder Sand Dunes',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Excursion to Turtuk Village & Tyakshi (Indo-Pak Border) — 200 km, 7-8 hrs',
        description: [
          'Scenic drive along Shyok River to Indo-Pakistan border region',
          'Explore traditional Balti village of Turtuk, apricot orchards & heritage museum',
          'Visit Tyakshi border village before returning to Hunder',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Lake via Shyok Route — 160 km, 5-6 hrs',
        description: [
          'Ride through rugged Shyok River gorges and rocky water crossings',
          'Arrive at magnificent Pangong Tso (14,270 ft) & enjoy colour-changing views',
          'Photoshoot at 3-Idiots point & lakeside stargazing',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Tso Moriri via Chushul, Tsaga La & Loma — 175 km, 8-9 hrs',
        description: [
          'Sunrise breakfast & ride along untouched Changthang landscapes',
          'Pay homage at Rezang La War Memorial & cross scenic Tsaga La Pass',
          'Pass Loma and Mahe Bridge to reach breathtaking Tso Moriri Lake (Korzok - 14,836 ft)',
          'Explore Korzok Monastery & witness sunset over the blue sapphire lake',
          'Overnight in Tso Moriri (Korzok)',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 7,
        title: 'Tso Moriri to Leh via Puga Geothermal Valley, Tsokar & Tanglang La — 220 km, 7-8 hrs',
        description: [
          'Morning walk along Tso Moriri shores & breakfast',
          'Explore steaming sulphur springs in Puga Valley & salt-encrusted Tsokar Lake',
          'Cross mighty Tanglang La Pass (17,480 ft / 5,328 m) — 2nd highest pass in Ladakh',
          'Descend into Indus Valley and arrive back in Leh for farewell celebration',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 8,
        title: 'Departure from Leh — Fly Home',
        description: [
          'Breakfast at hotel',
          'Transfer to Leh Airport with extraordinary memories of Ladakh circuit',
          'Meals: Breakfast'
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
    id: '6',
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Arrive at Leh Airport with aerial views of snow peaks & transfer to hotel',
          'Mandatory day of rest for oxygen acclimatization',
          'Evening walk to Leh market & briefing by Trip Captain',
          'Overnight in Leh',
          'Meals: Dinner'
        ]
      },
      {
        day: 2,
        title: 'Leh Sightseeing: Sangam, Magnetic Hill, Pathar Sahib & Shanti Stupa',
        description: [
          'Breakfast and acclimatization ride along Indus River',
          'Visit Hall of Fame Museum, Magnetic Hill, Gurudwara Pathar Sahib & Sangam confluence',
          'Catch golden sunset over Leh from Shanti Stupa',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (5,359 m) — 130 km, 5-6 hrs',
        description: [
          'Ascend and cross legendary Khardung La Pass (17,582 ft / 5,359 m)',
          'Visit Diskit Monastery & 106 ft Maitreya Buddha Statue',
          'Camel ride and ATV adventures on Hunder Sand Dunes',
          'Overnight in Nubra Valley',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Lake via Shyok Route — 160 km, 5-6 hrs',
        description: [
          'Ride along rugged Shyok River gorges and scenic river crossings',
          'Reach azure Pangong Tso (14,270 ft) & witness colour changes across the lake',
          'Lakeside photoshoot at 3-Idiots point & magical evening bonfire',
          'Overnight in Pangong Lake Camps',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial — 165 km, 7-8 hrs',
        description: [
          'Sunrise breakfast by Pangong Lake',
          'Ride through remote Changthang plateau towards Indo-China border',
          'Pay tribute to 1962 heroes at Rezang La War Memorial',
          'Cross Tsaga La Pass and Loma Checkpoint to reach Hanle (14,760 ft)',
          'Stargazing at Hanle Dark Sky Reserve',
          'Overnight in Hanle',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Umling La Pass (19,024 ft) — World’s Highest Motorable Pass',
        description: [
          'Early breakfast and ride to conquer Umling La Pass (19,024 ft / 5,798 m)',
          'Stand on the world’s highest motorable road & photo milestone session',
          'Visit Demchok village & return to Hanle for evening celebration',
          'Overnight in Hanle',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Tso Moriri (Korzok) via Mahe Bridge & Kyagar Tso — 160 km, 6-7 hrs',
        description: [
          'Morning breakfast in Hanle and ride across raw Changthang wilderness',
          'Spot wildlife including Tibetan Wild Ass (Kiang), Black-Necked Cranes and Marmots',
          'Arrive at stunning high-altitude lake of Tso Moriri (Korzok - 14,836 ft)',
          'Sunset reflections along the pristine mountain-fringed lake',
          'Overnight in Tso Moriri',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 8,
        title: 'Tso Moriri to Leh via Puga Geothermal Valley, Tsokar & Tanglang La — 220 km, 7-8 hrs',
        description: [
          'Breakfast with panoramic views of Tso Moriri',
          'Explore steaming geothermal sulphur springs in Puga Valley & salt lake Tsokar',
          'Cross mighty Tanglang La Pass (17,480 ft / 5,328 m)',
          'Scenic descent to Leh via Upshi & Karu for farewell dinner',
          'Overnight in Leh',
          'Meals: Breakfast & Dinner'
        ]
      },
      {
        day: 9,
        title: 'Departure from Leh — Fly Home',
        description: [
          'Breakfast at hotel',
          'Transfer to Leh Airport with a heart full of high-altitude adventures',
          'Meals: Breakfast'
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
    id: '7',
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
        title: 'Departure From Delhi / Chandigarh to Manali',
        description: [
          'Report at Delhi / Chandigarh pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Manali.',
          'Overnight semi-sleeper Volvo journey through the Himalayas.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali | Acclimatization & Local Exploration',
        description: [
          'Arrive in Manali (Valley of Gods) in the morning and transfer to your hotel.',
          'Check-in, relax, and freshen up after the overnight journey.',
          'Visit the historic Hadimba Devi Temple amidst towering deodar forests.',
          'Take a scenic hike to the breathtaking Jogini Waterfalls.',
          'Visit Vashisht Village to experience the natural healing sulphur hot springs.',
          'Stroll through Mall Road & Old Manali for local cafe hopping and shopping.',
          'Evening trip briefing, safety orientation, and riding gear allocation.',
          'Overnight in Manali.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Manali to Sarchu via Atal Tunnel & Baralacha La [175 km / 7-8 hrs]',
        description: [
          'Early morning departure from Manali towards Sarchu via the Leh-Manali Highway.',
          'Drive through the engineering marvel, Atal Tunnel (9.02 km), entering Lahaul Valley.',
          'Cruise along the scenic Chandra River passing Keylong, Darcha, Patsio, and Zingzing Bar.',
          'Witness the emerald-green high altitude Suraj Tal Lake (source of the Bhaga River).',
          'Scale the challenging Baralacha La Pass (4,890 m / 16,043 ft).',
          'Arrive at the high-altitude windswept plains of Sarchu (4,290 m).',
          'Check-in to your deluxe Swiss camps and acclimatize under a starlit Himalayan sky.',
          'Overnight in Sarchu.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Sarchu to Leh via Gata Loops, Moore Plains & Tanglang La [260 km / 7-8 hrs]',
        description: [
          'Post-breakfast ride from Sarchu to Leh crossing the high-altitude border.',
          'Conquer the legendary 21 hairpin bends of Gata Loops (4,669 m).',
          'Cross the high mountain passes: Nakee La (4,738 m) and Lachung La (5,065 m).',
          'Stop for a hot lunch at the rugged settlement of Pang.',
          'Cruise through the picturesque Moore Plains – a 50 km straight plateau at 4,000+ m.',
          'Scale the second-highest pass on the highway, Tanglang La (5,328 m / 17,480 ft).',
          'Descend through Upshi and Karu along the Indus River valley to reach Leh.',
          'Check-in to your hotel in Leh, relax, and enjoy a warm dinner.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La & Diskit Monastery [125 km / 5-6 hrs]',
        description: [
          'Morning visit to Shanti Stupa for panoramic 360-degree views of Leh town and the Stok range.',
          'Embark on a thrilling ride north towards Nubra Valley via Khardung La.',
          'Summit the world-renowned Khardung La Pass (5,359 m / 17,582 ft).',
          'Descend into the scenic Shyok Valley and reach Diskit.',
          'Visit the historic 14th-century Diskit Monastery and the towering 106-foot Maitreya Buddha.',
          'Ride to the white sand dunes of Hunder.',
          'Experience a double-humped Bactrian camel safari and desert ATV rides across the dunes.',
          'Check-in to your hotel/campsite in Nubra Valley for a cozy evening.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Turtuk Village Excursion [200 km / 7-8 hrs]',
        description: [
          'Morning drive towards Turtuk – India’s northernmost frontier village opened to tourists in 2010.',
          'Ride along the raging Shyok River through dramatic gorge landscapes.',
          'Explore Turtuk village, steeped in unique Balti heritage, apricot orchards, and wooden houses.',
          'Visit the historic Turtuk Yabgo Royal Palace and the Shyok War Memorial.',
          'Interact with friendly local villagers and taste organic fresh apricots and walnuts.',
          'Return to Nubra Valley by late afternoon.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Nubra Valley to Pangong Tso via Shyok River Route [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Nubra Valley towards the iconic Pangong Tso.',
          'Ride along the scenic Shyok River route through Agham and Shyok villages.',
          'First glimpse of the mesmerizing, color-changing turquoise waters of Pangong Lake (4,350 m / 14,270 ft).',
          'Stroll along the world’s highest saltwater lake and snap photos at the famous 3-Idiots movie point.',
          'Witness a magical Himalayan sunset painting the lake in shades of sapphire and amber.',
          'Check-in to lake-view deluxe cottages/camps for a serene bonfire evening.',
          'Overnight near Pangong Lake.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial [165 km / 8-9 hrs]',
        description: [
          'Witness an unforgettable sunrise over the crystalline blue waters of Pangong Lake.',
          'Post-breakfast journey towards the remote astronomical paradise of Hanle.',
          'Ride past Chushul village and visit the legendary Rezang La War Memorial.',
          'Pay homage to the 114 brave soldiers of Charlie Company (1962 Sino-Indian War).',
          'Cross the Indus River via Loma Bridge and ride through the pristine Changthang Wildlife Sanctuary.',
          'Arrive in Hanle village, one of the world’s highest inhabited plateaus.',
          'Check-in to your traditional homestay and stargaze under India’s premier Dark Sky Reserve.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Frontier Excursion [200 km / 7-8 hrs]',
        description: [
          'Post-breakfast adventure to conquer the highest motorable road on the planet.',
          'Ascend through Photi La Pass (5,524 m) across raw, lunar-like mountain terrain.',
          'Summit Umling La Pass at a record-shattering 19,024 ft (5,640 m) – higher than Everest Base Camp.',
          'Celebrate your achievement and click iconic milestone photos with your bike/group.',
          'Ride down towards Demchok, the last Indian border outpost on the Indo-China frontier.',
          'Visit the historic 17th-century Hanle Monastery and view the Indian Astronomical Observatory.',
          'Return to your Hanle homestay for a hearty local dinner.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri Lake [289 km / 7-8 hrs]',
        description: [
          'Morning departure from Hanle towards the pristine Tso Moriri Lake.',
          'Ride via Loma Bridge and Mahe along the turquoise Indus and Chumathang hot springs.',
          'Arrive at the majestic Tso Moriri (4,522 m / 14,836 ft), India’s largest and highest high-altitude wetland lake.',
          'Spot rare Himalayan migratory birds including the Black-necked Crane and Bar-headed Goose.',
          'Continue the scenic drive past Upshi, Karu, and Thiksey to arrive back in Leh.',
          'Check-in to your hotel in Leh, relax, and explore Leh Main Bazaar for souvenirs and cafes.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Leh to Jispa via Tanglang La, Moore Plains & Baralacha La [260 km / 8-9 hrs]',
        description: [
          'Morning departure from Leh on the return leg towards Jispa.',
          'Cross Tanglang La Pass (5,328 m) and cruise the vast 50 km stretch of Moore Plains.',
          'Traverse Lachung La (5,065 m) and Nakee La (4,738 m).',
          'Descend the hairpin turns of Gata Loops to Sarchu and continue towards Baralacha La (4,890 m).',
          'Pass the serene Deepak Tal and Suraj Tal lakes before descending through Darcha into Jispa.',
          'Check-in to your riverside campsite/hotel in Jispa along the Bhaga River.',
          'Overnight in Jispa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 11,
        title: 'Jispa to Manali via Atal Tunnel | Departure to Delhi [135 km / 4-5 hrs]',
        description: [
          'Post-breakfast scenic ride from Jispa towards Manali.',
          'Drive through Keylong, Sissu waterfalls, and cross the engineering marvel of Atal Tunnel.',
          'Pass through Solang Valley and arrive in Manali by afternoon.',
          'Free time in Manali for last-minute shopping or relaxing at Old Manali cafes.',
          'Board the evening overnight Volvo coach back to Delhi.',
          'Overnight journey in Volvo.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 12,
        title: 'Arrival in Delhi | Trip Concludes',
        description: [
          'Arrive in Delhi in the morning.',
          'Trip concludes with lifelong memories of the ultimate Leh-Ladakh, Umling La & Changthang expedition.'
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
    id: '8',
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
        title: 'Departure From Delhi / Chandigarh to Manali',
        description: [
          'Report at Delhi / Chandigarh pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Manali.',
          'Overnight semi-sleeper Volvo journey through the Himalayas.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali | Acclimatization & Local Exploration',
        description: [
          'Arrive in Manali (Valley of Gods) in the morning and transfer to your hotel.',
          'Check-in, relax, and freshen up after the overnight journey.',
          'Visit the historic Hadimba Devi Temple amidst towering deodar forests.',
          'Take a scenic hike to the breathtaking Jogini Waterfalls.',
          'Visit Vashisht Village to experience the natural healing sulphur hot springs.',
          'Stroll through Mall Road & Old Manali for local cafe hopping and shopping.',
          'Evening trip briefing, safety orientation, and riding gear allocation.',
          'Overnight in Manali.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Manali to Sarchu via Atal Tunnel & Baralacha La [175 km / 7-8 hrs]',
        description: [
          'Early morning departure from Manali towards Sarchu via the Leh-Manali Highway.',
          'Drive through the engineering marvel, Atal Tunnel (9.02 km), entering Lahaul Valley.',
          'Cruise along the scenic Chandra River passing Keylong, Darcha, Patsio, and Zingzing Bar.',
          'Witness the emerald-green high altitude Suraj Tal Lake (source of the Bhaga River).',
          'Scale the challenging Baralacha La Pass (4,890 m / 16,043 ft).',
          'Arrive at the high-altitude windswept plains of Sarchu (4,290 m).',
          'Check-in to your deluxe Swiss camps and acclimatize under a starlit Himalayan sky.',
          'Overnight in Sarchu.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Sarchu to Leh via Gata Loops, Moore Plains & Tanglang La [260 km / 7-8 hrs]',
        description: [
          'Post-breakfast ride from Sarchu to Leh crossing the high-altitude border.',
          'Conquer the legendary 21 hairpin bends of Gata Loops (4,669 m).',
          'Cross the high mountain passes: Nakee La (4,738 m) and Lachung La (5,065 m).',
          'Stop for a hot lunch at the rugged settlement of Pang.',
          'Cruise through the picturesque Moore Plains – a 50 km straight plateau at 4,000+ m.',
          'Scale the second-highest pass on the highway, Tanglang La (5,328 m / 17,480 ft).',
          'Descend through Upshi and Karu along the Indus River valley to reach Leh.',
          'Check-in to your hotel in Leh, relax, and enjoy a warm dinner.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La & Diskit Monastery [125 km / 5-6 hrs]',
        description: [
          'Morning visit to Shanti Stupa for panoramic 360-degree views of Leh town and the Stok range.',
          'Embark on a thrilling ride north towards Nubra Valley via Khardung La.',
          'Summit the world-renowned Khardung La Pass (5,359 m / 17,582 ft).',
          'Descend into the scenic Shyok Valley and reach Diskit.',
          'Visit the historic 14th-century Diskit Monastery and the towering 106-foot Maitreya Buddha.',
          'Ride to the white sand dunes of Hunder.',
          'Experience a double-humped Bactrian camel safari and desert ATV rides across the dunes.',
          'Check-in to your hotel/campsite in Nubra Valley for a cozy evening.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Turtuk Village Excursion [200 km / 7-8 hrs]',
        description: [
          'Morning drive towards Turtuk – India’s northernmost frontier village opened to tourists in 2010.',
          'Ride along the raging Shyok River through dramatic gorge landscapes.',
          'Explore Turtuk village, steeped in unique Balti heritage, apricot orchards, and wooden houses.',
          'Visit the historic Turtuk Yabgo Royal Palace and the Shyok War Memorial.',
          'Interact with friendly local villagers and taste organic fresh apricots and walnuts.',
          'Return to Nubra Valley by late afternoon.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Nubra Valley to Pangong Tso via Shyok River Route [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Nubra Valley towards the iconic Pangong Tso.',
          'Ride along the scenic Shyok River route through Agham and Shyok villages.',
          'First glimpse of the mesmerizing, color-changing turquoise waters of Pangong Lake (4,350 m / 14,270 ft).',
          'Stroll along the world’s highest saltwater lake and snap photos at the famous 3-Idiots movie point.',
          'Witness a magical Himalayan sunset painting the lake in shades of sapphire and amber.',
          'Check-in to lake-view deluxe cottages/camps for a serene bonfire evening.',
          'Overnight near Pangong Lake.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial [165 km / 8-9 hrs]',
        description: [
          'Witness an unforgettable sunrise over the crystalline blue waters of Pangong Lake.',
          'Post-breakfast journey towards the remote astronomical paradise of Hanle.',
          'Ride past Chushul village and visit the legendary Rezang La War Memorial.',
          'Pay homage to the 114 brave soldiers of Charlie Company (1962 Sino-Indian War).',
          'Cross the Indus River via Loma Bridge and ride through the pristine Changthang Wildlife Sanctuary.',
          'Arrive in Hanle village, one of the world’s highest inhabited plateaus.',
          'Check-in to your traditional homestay and stargaze under India’s premier Dark Sky Reserve.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Frontier Excursion [200 km / 7-8 hrs]',
        description: [
          'Post-breakfast adventure to conquer the highest motorable road on the planet.',
          'Ascend through Photi La Pass (5,524 m) across raw, lunar-like mountain terrain.',
          'Summit Umling La Pass at a record-shattering 19,024 ft (5,640 m) – higher than Everest Base Camp.',
          'Celebrate your achievement and click iconic milestone photos with your bike/group.',
          'Ride down towards Demchok, the last Indian border outpost on the Indo-China frontier.',
          'Visit the historic 17th-century Hanle Monastery and view the Indian Astronomical Observatory.',
          'Return to your Hanle homestay for a hearty local dinner.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri Lake [289 km / 7-8 hrs]',
        description: [
          'Morning departure from Hanle towards the pristine Tso Moriri Lake.',
          'Ride via Loma Bridge and Mahe along the turquoise Indus and Chumathang hot springs.',
          'Arrive at the majestic Tso Moriri (4,522 m / 14,836 ft), India’s largest and highest high-altitude wetland lake.',
          'Spot rare Himalayan migratory birds including the Black-necked Crane and Bar-headed Goose.',
          'Continue the scenic drive past Upshi, Karu, and Thiksey to arrive back in Leh.',
          'Check-in to your hotel in Leh, relax, and explore Leh Main Bazaar for souvenirs and cafes.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Leh to Kargil via Hall of Fame, Magnetic Hill & Lamayuru [230 km / 7-8 hrs]',
        description: [
          'Post-breakfast departure from Leh towards Kargil via the Leh-Srinagar Highway.',
          'Visit the Hall of Fame Museum, honoring the heroic soldiers of Ladakh.',
          'Seek blessings at Gurudwara Pathar Sahib, maintained by the Indian Army.',
          'Experience the gravity-defying phenomenon at Magnetic Hill.',
          'Marvel at Sangam – the dramatic confluence of the Indus and Zanskar rivers.',
          'Ride through the ancient moonscapes of Lamayuru and visit the historic Lamayuru Monastery.',
          'Scale Fotu La (4,108 m) and Namika La (3,700 m) passes to reach Kargil.',
          'Check-in to your hotel in Kargil for a relaxed evening.',
          'Overnight in Kargil.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 11,
        title: 'Kargil to Srinagar via Drass, Kargil War Memorial & Zoji La Pass [200 km / 8-9 hrs]',
        description: [
          'Early morning departure from Kargil towards Srinagar.',
          'Stop at Drass – the second coldest inhabited place in the world and visit the Kargil War Memorial.',
          'Conquer the legendary, thrilling hairpin switchbacks of Zoji La Pass (3,528 m).',
          'Descend into Kashmir valley and admire the lush alpine meadows and glaciers of Sonamarg.',
          'Ride along the Sindh River valley and arrive in Srinagar by evening.',
          'Check-in to your hotel/houseboat in Srinagar and enjoy a traditional Kashmiri dinner.',
          'Overnight in Srinagar.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 12,
        title: 'Departure from Srinagar | Trip Concludes',
        description: [
          'Post-breakfast check-out from your Srinagar hotel.',
          'Optional morning Shikara ride on the tranquil Dal Lake.',
          'Transfer to Srinagar Airport for your return flight.',
          'Trip concludes with unforgettable memories of the complete Manali-Leh-Srinagar grand expedition.',
          'Meals: Breakfast.'
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
    id: '9',
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
        title: 'Arrival in Srinagar | Acclimatization & Dal Lake Exploration',
        description: [
          'Arrive at Srinagar Airport and transfer to your hotel/houseboat.',
          'Check-in, relax, and unpack amidst the scenic Kashmir valley.',
          'Optional serene Shikara ride on Dal Lake and stroll through local markets.',
          'Evening trip briefing, bike inspection/handover, and safety orientation.',
          'Overnight in Srinagar.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Srinagar to Kargil via Sonamarg, Zoji La Pass & Drass [200 km / 8-9 hrs]',
        description: [
          'Morning departure from Srinagar towards Kargil.',
          'Ride through the lush green Sindh Valley and picturesque meadows of Sonamarg.',
          'Ascend and conquer the legendary Zoji La Pass (3,528 m).',
          'Stop at Drass – the world’s second coldest inhabited place, and visit the Kargil War Memorial.',
          'Pay homage to the heroes of Operation Vijay.',
          'Arrive in Kargil by evening and check-in to your hotel.',
          'Overnight in Kargil.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Kargil to Leh via Lamayuru, Fotu La, Magnetic Hill & Sangam [230 km / 7-8 hrs]',
        description: [
          'Post-breakfast ride from Kargil to Leh via NH1.',
          'Cross the high-altitude passes: Fotu La (4,108 m) and Namika La (3,700 m).',
          'Marvel at the lunar-like landscapes of Lamayuru and visit Lamayuru Monastery.',
          'Witness the Sangam – confluence of Indus & Zanskar rivers.',
          'Experience the gravity-defying Magnetic Hill and visit Gurudwara Pathar Sahib.',
          'Visit the Hall of Fame War Memorial before arriving in Leh.',
          'Check-in to your Leh hotel for a cozy dinner.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La & Diskit Monastery [125 km / 5-6 hrs]',
        description: [
          'Morning visit to Shanti Stupa for sweeping panoramic views of Leh town.',
          'Ride north to Nubra Valley via the world-renowned Khardung La Pass (5,359 m / 17,582 ft).',
          'Descend into Shyok Valley and visit the 14th-century Diskit Monastery with its 106 ft Maitreya Buddha.',
          'Ride to the cold desert dunes of Hunder.',
          'Enjoy double-humped Bactrian camel safaris and ATV rides amidst the dunes.',
          'Check-in to your deluxe campsite/hotel in Nubra Valley.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River Route [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Nubra Valley towards Pangong Tso.',
          'Ride along the rugged Shyok River route via Agham and Shyok villages.',
          'First glimpse of the magnificent, multi-hued Pangong Lake (4,350 m / 14,270 ft).',
          'Spend time walking along the lake shores and click photos at the famous 3-Idiots point.',
          'Witness a breathtaking Himalayan sunset over the turquoise waters.',
          'Check-in to your lake-view cottages/camps.',
          'Overnight near Pangong Lake.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial [165 km / 8-9 hrs]',
        description: [
          'Witness an unforgettable sunrise over the crystalline blue waters of Pangong Lake.',
          'Post-breakfast journey towards the remote astronomical wonderland of Hanle.',
          'Pass Chushul village and pay homage at the Rezang La War Memorial.',
          'Cross the Loma Bridge over the Indus River into the pristine Changthang sanctuary.',
          'Arrive in Hanle village, check-in to your cozy homestay, and stargaze under India’s premier Dark Sky Reserve.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Frontier Excursion [200 km / 7-8 hrs]',
        description: [
          'Post-breakfast adventure to summit the world’s highest motorable pass.',
          'Ascend through Photi La Pass (5,524 m) across lunar mountain terrains.',
          'Summit Umling La Pass at a record-shattering 19,024 ft (5,640 m).',
          'Celebrate the milestone and take victory photographs at the summit marker.',
          'Ride down towards Demchok, the last Indian border outpost on the Indo-China frontier.',
          'Visit the historic 17th-century Hanle Monastery and view the Indian Astronomical Observatory.',
          'Return to your Hanle homestay for dinner.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Leh via Tso Moriri Lake [289 km / 7-8 hrs]',
        description: [
          'Morning departure from Hanle towards the pristine Tso Moriri Lake.',
          'Ride via Loma Bridge and Mahe along the turquoise Indus and Chumathang hot springs.',
          'Arrive at the majestic Tso Moriri (4,522 m / 14,836 ft), India’s highest and largest saltwater lake.',
          'Spot rare Himalayan migratory birds including the Black-necked Crane and Bar-headed Goose.',
          'Continue the scenic drive past Upshi, Karu, and Thiksey to arrive back in Leh.',
          'Check-in to your hotel in Leh, relax, and explore Leh Main Bazaar for souvenirs and cafes.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Leh to Jispa via Tanglang La, Moore Plains & Baralacha La [260 km / 8-9 hrs]',
        description: [
          'Morning departure from Leh on the return leg towards Jispa.',
          'Cross Tanglang La Pass (5,328 m) and cruise the vast 50 km stretch of Moore Plains.',
          'Traverse Lachung La (5,065 m) and Nakee La (4,738 m).',
          'Descend the hairpin turns of Gata Loops to Sarchu and continue towards Baralacha La (4,890 m).',
          'Pass the serene Deepak Tal and Suraj Tal lakes before descending through Darcha into Jispa.',
          'Check-in to your riverside campsite/hotel in Jispa along the Bhaga River.',
          'Overnight in Jispa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Jispa to Manali via Atal Tunnel & Solang Valley [135 km / 4-5 hrs]',
        description: [
          'Post-breakfast scenic ride from Jispa towards Manali.',
          'Drive through Keylong, Sissu waterfalls, and cross the engineering marvel of Atal Tunnel.',
          'Pass through Solang Valley and arrive in Manali by afternoon.',
          'Check-in to your hotel in Manali and relax.',
          'Evening at leisure to explore Old Manali cafes and Mall Road.',
          'Overnight in Manali.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 11,
        title: 'Manali Local Exploration | Overnight Volvo to Delhi',
        description: [
          'Morning at leisure in Manali.',
          'Explore Hadimba Devi Temple, Jogini Waterfalls, or Vashisht hot springs on your own.',
          'Stroll through Mall Road for last-minute souvenir shopping and dining.',
          'Evening reporting at Manali bus stand to board the overnight AC Volvo coach to Delhi.',
          'Overnight semi-sleeper Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 12,
        title: 'Arrival in Delhi | Trip Concludes',
        description: [
          'Arrive in Delhi in the morning.',
          'Trip concludes with lifelong memories of the Srinagar-Ladakh-Manali Grand Himalayan Expedition.'
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
    id: 'WNDPI-WSP-001',
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Journey',
        description: [
          'Report at Delhi pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Shimla.',
          'Overnight semi-sleeper Volvo journey through Himachal foothills.'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Sangla / Chitkul via Kinnaur Gate [220 km / 9-10 hrs]',
        description: [
          'Arrive in Shimla in the morning, freshen up, and have breakfast.',
          'Board private shared transfers and drive along the historic Hindustan-Tibet Highway.',
          'Pass scenic Apple country towns: Kufri, Narkanda, and Rampur Bushahr.',
          'Enter Kinnaur Valley crossing the iconic rock-cut "Kinnaur Gate" tunnel.',
          'Drive along the roaring Baspa River to reach the fairy-tale village of Sangla / Chitkul.',
          'Check-in to your cozy hotel/homestay for a traditional Kinnauri dinner.',
          'Overnight in Sangla / Chitkul.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Excursion & Transfer to Kalpa | Kinner Kailash Views [70 km / 3-4 hrs]',
        description: [
          'Morning excursion to Chitkul – the last inhabited Indian village near the Indo-Tibet border.',
          'Walk along the crystalline Baspa River and visit the iconic "Hindustan Ka Aakhri Dhaba".',
          'Drive to Kalpa with jaw-dropping views of the sacred Kinner Kailash peak (6,050 m).',
          'Visit the dramatic cliff edge at Roghi Suicide Point.',
          'Explore Reckong Peo local market and taste fresh Kinnauri apples.',
          'Check-in to your hotel in Kalpa for a scenic sunset over Kinner Kailash.',
          'Overnight in Kalpa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Lake & Gue Mummy [168 km / 7-8 hrs]',
        description: [
          'Post-breakfast drive deeper into the Trans-Himalayas towards Spiti Valley.',
          'Navigate the thrilling Ka Loops and arrive at the serene high-altitude Nako Lake & village.',
          'Cross the border check-post at Sumdo to officially enter Spiti Valley.',
          'Witness the sacred 500-year-old preserved natural mummy at Gue Village.',
          'Arrive at Tabo and explore the UNESCO World Heritage Tabo Monastery (founded in 996 AD).',
          'Check-in to your homestay/hotel in Tabo.',
          'Overnight in Tabo.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Monastery & Chicham Bridge [125 km / 6-7 hrs]',
        description: [
          'Morning departure from Tabo towards Kaza.',
          'Visit the cliff-hanging Dhankar Monastery perched dramatically over the confluence of Spiti & Pin rivers.',
          'Drive to the iconic 1,000-year-old Key Monastery – Spiti’s largest fortified Buddhist monastery.',
          'Interact with the lamas and savor a warm cup of herbal tea inside the monastery.',
          'Drive across the engineering marvel, Chicham Bridge – Asia’s highest suspension bridge over a 1,000 ft deep gorge.',
          'Arrive in Kaza, check-in to your hotel/homestay, and relax.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komic & Langza [80 km / 6-7 hrs]',
        description: [
          'Full-day high-altitude village exploration around Kaza.',
          'Visit Langza – the "Fossil Village" guarded by the majestic giant golden Buddha statue.',
          'Drive to Komic (4,587 m) – among the world’s highest motorable villages with a monastery.',
          'Visit Hikkim (4,400 m) and post a handwritten postcard to loved ones from the World’s Highest Post Office.',
          'Return to Kaza by late afternoon and explore Kaza Main Market and local cafes.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Kalpa Return Drive [215 km / 7-8 hrs]',
        description: [
          'Early morning departure from Kaza beginning the return journey towards Kalpa.',
          'Drive along the turquoise Spiti River capturing stunning winter panoramic views.',
          'Pass through Sumdo, Nako, and Pooh along the rugged Hindustan-Tibet Highway.',
          'Arrive back in the peaceful hamlet of Kalpa by evening.',
          'Check-in to your hotel and unwind with a warm bonfire and dinner.',
          'Overnight in Kalpa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Kalpa to Shimla | Overnight Volvo to Delhi [210 km / 8-9 hrs]',
        description: [
          'Post-breakfast scenic drive from Kalpa to Shimla.',
          'Descend through Rampur and Narkanda, arriving at Shimla by evening.',
          'Board the overnight AC Volvo coach back to Delhi.',
          'Overnight Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Arrival in Delhi | Trip Concludes',
        description: [
          'Arrive in Delhi in the morning (around 09:00 AM).',
          'Trip concludes with unforgettable memories of the winter wonderland in Spiti Valley.'
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
    id: 'WNDPI-SSP-001',
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Journey',
        description: [
          'Report at Delhi pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Shimla.',
          'Overnight semi-sleeper Volvo journey through Himachal foothills.'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Chitkul / Sangla via Kinnaur Gate [220 km / 9-10 hrs]',
        description: [
          'Arrive in Shimla in the morning, freshen up, and enjoy breakfast at Narkanda.',
          'Drive along the Satluj River and the historic Hindustan-Tibet Highway.',
          'Pass through the majestic Kinnaur Gate rock tunnel into the Baspa Valley.',
          'Arrive in Chitkul / Sangla by evening and check-in to your riverside hotel/homestay.',
          'Overnight in Chitkul / Sangla.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Exploration & Transfer to Kalpa | Kinner Kailash Views [80 km / 3-4 hrs]',
        description: [
          'Witness a stunning sunrise over the snow-capped Kinnauri peaks.',
          'Explore Chitkul – India’s last inhabited village before the Indo-Tibet frontier.',
          'Stroll along the pristine Baspa River and visit the iconic Last Dhaba of India.',
          'Drive to Kalpa with panoramic views of the sacred Kinner Kailash peak.',
          'Visit the dramatic Roghi Cliff Suicide Point and Reckong Peo market.',
          'Check-in to your hotel in Kalpa for sunset views.',
          'Overnight in Kalpa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Lake & Gue Mummy [168 km / 7-8 hrs]',
        description: [
          'Post-breakfast journey from Kalpa towards the Trans-Himalayan Spiti Valley.',
          'Navigate the winding Ka Loops and stop at the holy Nako Lake & village.',
          'Cross the border check-post at Sumdo and visit the 500-year-old preserved mummy at Gue.',
          'Arrive at Tabo and explore the ancient 1,000-year-old UNESCO Tabo Monastery.',
          'Check-in to your homestay/hotel in Tabo.',
          'Overnight in Tabo.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Monastery & Chicham Bridge [125 km / 6-7 hrs]',
        description: [
          'Morning drive from Tabo towards Kaza.',
          'Explore Dhankar Monastery perched precariously on a jagged cliff overlooking the river confluence.',
          'Visit the iconic 11th-century Key Monastery – Spiti’s spiritual heart and largest monastery.',
          'Enjoy warm herbal butter tea with the resident Buddhist monks.',
          'Drive across Chicham Bridge – Asia’s highest suspension bridge spanning a 1,000 ft canyon.',
          'Arrive in Kaza and check-in to your hotel/homestay.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komic & Langza [80 km / 6-7 hrs]',
        description: [
          'Full-day high-altitude exploration around Kaza’s highest villages.',
          'Visit Langza – the "Fossil Village" under the gaze of the majestic golden Buddha statue.',
          'Drive up to Komic (4,587 m) – among the world’s highest motorable villages.',
          'Visit Hikkim (4,400 m) and send postcards from the World’s Highest Post Office.',
          'Return to Kaza by evening to explore the local market and enjoy cafe hopping.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass [95 km / 5-6 hrs]',
        description: [
          'Morning departure from Kaza towards the crescent-shaped Chandratal Lake.',
          'Drive past Losar – the last village of Spiti Valley, and cross the majestic Kunzum La Pass (4,551 m / 14,931 ft).',
          'Pay respects at Kunzum Mata Temple before descending towards Chandratal.',
          'Trek 1.5 km to the pristine turquoise waters of Chandratal (Moon Lake) reflecting Himalayan giants.',
          'Check-in to your deluxe alpine tents and stargaze under the brilliant Milky Way galaxy.',
          'Overnight in Chandratal Camps.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Chandratal to Manali via Batal, Chhatru & Atal Tunnel [95 km / 5-6 hrs]',
        description: [
          'Post-breakfast off-roading adventure from Chandratal to Manali.',
          'Navigate the rugged water crossings of Batal, Chhatru, and Gramphu along the Chandra River.',
          'Cross the engineering marvel, Atal Tunnel (9.02 km), entering the lush Kullu Valley.',
          'Arrive in Manali by afternoon and check-in to your hotel.',
          'Evening cafe crawl and live music experience in Old Manali.',
          'Overnight in Manali.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Manali Local Exploration | Overnight Volvo to Delhi',
        description: [
          'Morning at leisure in Manali.',
          'Visit Hadimba Devi Temple, Vashisht hot springs, and stroll through Mall Road.',
          'Evening reporting at Manali bus stand to board the overnight AC Volvo coach to Delhi.',
          'Overnight Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Arrival in Delhi | Trip Concludes [510 km / 10-11 hrs]',
        description: [
          'Arrive in Delhi in the morning (around 09:00 AM).',
          'Trip concludes with lifelong memories of the complete Spiti-Kinnaur-Chandratal Grand Circuit.'
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
    id: 'WNDPI-SSP-002',
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Journey',
        description: [
          'Report at Delhi pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Shimla.',
          'Overnight semi-sleeper Volvo journey through Himachal foothills.'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Chitkul / Sangla via Kinnaur Gate [220 km / 9-10 hrs]',
        description: [
          'Arrive in Shimla in the morning, freshen up, and enjoy breakfast at Narkanda.',
          'Drive along the Satluj River and the historic Hindustan-Tibet Highway.',
          'Pass through the majestic Kinnaur Gate rock tunnel into the Baspa Valley.',
          'Arrive in Chitkul / Sangla by evening and check-in to your riverside hotel/homestay.',
          'Overnight in Chitkul / Sangla.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Exploration & Transfer to Kalpa | Kinner Kailash Views [80 km / 3-4 hrs]',
        description: [
          'Witness a stunning sunrise over the snow-capped Kinnauri peaks.',
          'Explore Chitkul – India’s last inhabited village before the Indo-Tibet frontier.',
          'Stroll along the pristine Baspa River and visit the iconic Last Dhaba of India.',
          'Drive to Kalpa with panoramic views of the sacred Kinner Kailash peak.',
          'Visit the dramatic Roghi Cliff Suicide Point and Reckong Peo market.',
          'Check-in to your hotel in Kalpa for sunset views.',
          'Overnight in Kalpa.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Lake & Gue Mummy [168 km / 7-8 hrs]',
        description: [
          'Post-breakfast journey from Kalpa towards the Trans-Himalayan Spiti Valley.',
          'Navigate the winding Ka Loops and stop at the holy Nako Lake & village.',
          'Cross the border check-post at Sumdo and visit the 500-year-old preserved mummy at Gue.',
          'Arrive at Tabo and explore the ancient 1,000-year-old UNESCO Tabo Monastery.',
          'Check-in to your homestay/hotel in Tabo.',
          'Overnight in Tabo.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Monastery & Chicham Bridge [125 km / 6-7 hrs]',
        description: [
          'Morning drive from Tabo towards Kaza.',
          'Explore Dhankar Monastery perched precariously on a jagged cliff overlooking the river confluence.',
          'Visit the iconic 11th-century Key Monastery – Spiti’s spiritual heart and largest monastery.',
          'Enjoy warm herbal butter tea with the resident Buddhist monks.',
          'Drive across Chicham Bridge – Asia’s highest suspension bridge spanning a 1,000 ft canyon.',
          'Arrive in Kaza and check-in to your hotel/homestay.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komic & Langza [80 km / 6-7 hrs]',
        description: [
          'Full-day high-altitude exploration around Kaza’s highest villages.',
          'Visit Langza – the "Fossil Village" under the gaze of the majestic golden Buddha statue.',
          'Drive up to Komic (4,587 m) – among the world’s highest motorable villages.',
          'Visit Hikkim (4,400 m) and send postcards from the World’s Highest Post Office.',
          'Return to Kaza by evening to explore the local market and enjoy cafe hopping.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass [95 km / 5-6 hrs]',
        description: [
          'Morning departure from Kaza towards the crescent-shaped Chandratal Lake.',
          'Drive past Losar – the last village of Spiti Valley, and cross the majestic Kunzum La Pass (4,551 m / 14,931 ft).',
          'Pay respects at Kunzum Mata Temple before descending towards Chandratal.',
          'Trek 1.5 km to the pristine turquoise waters of Chandratal (Moon Lake) reflecting Himalayan giants.',
          'Check-in to your deluxe alpine tents and stargaze under the brilliant Milky Way galaxy.',
          'Overnight in Chandratal Camps.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Chandratal to Manali via Atal Tunnel | Departure to Delhi [95 km / 5-6 hrs]',
        description: [
          'Post-breakfast off-roading adventure from Chandratal to Manali via Batal & Atal Tunnel.',
          'Arrive in Manali by afternoon for brief exploration of Mall Road and cafes.',
          'Board the evening overnight AC Volvo coach back to Delhi.',
          'Overnight Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Arrival in Delhi | Trip Concludes [510 km / 10-11 hrs]',
        description: [
          'Arrive in Delhi in the morning (around 09:00 AM).',
          'Trip concludes with unforgettable memories of the Super Saver Spiti Valley & Chandratal road trip.'
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
    id: 'WNDPI-SSP-003',
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
        title: 'Departure from Delhi to Manali | Overnight Volvo Journey',
        description: [
          'Report at Delhi pickup point in the evening.',
          'Board the comfortable AC semi-sleeper Volvo coach for Manali.',
          'Overnight Volvo journey through the Himalayas.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali | Acclimatization & Local Exploration',
        description: [
          'Arrive in Manali in the morning and transfer to your hotel.',
          'Check-in, freshen up, and acclimatize to the mountain elevation.',
          'Explore Hadimba Devi Temple amidst tall deodar woods, Vashisht hot springs, and Mall Road.',
          'Evening trip briefing and safety orientation with your trek captain.',
          'Overnight in Manali.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Manali to Kaza via Atal Tunnel, Kunzum La & Chicham Bridge [185 km / 6-7 hrs]',
        description: [
          'Early morning departure from Manali towards Kaza.',
          'Cross the engineering marvel, Atal Tunnel (9.02 km), entering the Lahaul Valley.',
          'Navigate the rugged mountain roads of Gramphu, Chhatru, and Batal.',
          'Ascend the mighty Kunzum La Pass (4,551 m / 14,931 ft) and pay homage at Kunzum Mata Temple.',
          'Drive across Chicham Bridge – Asia’s highest suspension bridge over a 1,000 ft deep gorge.',
          'Arrive in Kaza by evening and check-in to your hotel/homestay.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Kaza High-Altitude Circuit | Key Monastery, Hikkim, Komic & Langza [80 km / 6-7 hrs]',
        description: [
          'Full-day exploration of Spiti’s highest iconic villages and monasteries.',
          'Visit the 1,000-year-old Key Monastery perched atop a scenic mountain ridge.',
          'Enjoy warm herbal tea and interact with resident Buddhist monks.',
          'Visit Langza – the "Fossil Village" under the gaze of the giant golden Buddha statue.',
          'Drive to Komic (4,587 m) – one of the highest motorable villages in the world.',
          'Visit Hikkim (4,400 m) and post a handwritten letter from the World’s Highest Post Office.',
          'Return to Kaza by evening for local market shopping and cafe hopping.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass [95 km / 5-6 hrs]',
        description: [
          'Morning departure from Kaza towards the magical Chandratal Lake.',
          'Drive past Losar village and traverse the high Kunzum La Pass.',
          'Trek 1.5 km to the pristine crescent-shaped Chandratal (Moon Lake) at 14,000 ft.',
          'Witness the crystalline waters changing shades of sapphire, green, and turquoise.',
          'Check-in to your deluxe alpine campsite near the lake.',
          'Unwind under a brilliant canopy of a million stars and the Milky Way galaxy.',
          'Overnight in Chandratal Camps.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Chandratal to Manali via Atal Tunnel | Departure to Delhi [95 km / 5-6 hrs]',
        description: [
          'Post-breakfast scenic off-road drive from Chandratal back to Manali.',
          'Cross Batal, Chhatru, and re-enter Kullu Valley via Atal Tunnel.',
          'Arrive in Manali by afternoon with time for last-minute souvenir shopping.',
          'Board the evening overnight AC Volvo coach back to Delhi.',
          'Overnight Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Arrival in Delhi | Trip Concludes',
        description: [
          'Arrive in Delhi in the morning (around 09:00 AM).',
          'Trip concludes with unforgettable memories of the Spiti Valley Short Circuit adventure.'
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
    id: 'WNDPI-SSP-004',
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
        title: 'Departure from Delhi to Tirthan Valley | Overnight Volvo Journey',
        description: [
          'Report at Delhi pickup point in the evening.',
          'Board the comfortable AC Volvo coach for Aut / Tirthan Valley.',
          'Overnight semi-sleeper Volvo journey through Himachal valleys.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Aut | Transfer to Jibhi & Bike Handover',
        description: [
          'Arrive at Aut in the morning and transfer to Jibhi / Gushaini in Tirthan Valley.',
          'Bikers collect their Royal Enfield motorcycles in Manali / Aut for bike allotment and test ride.',
          'Check-in to your riverside resort/wooden cottage in Jibhi.',
          'Short nature hike to the serene Jibhi Waterfall and explore pine-forested trails.',
          'Evening rider briefing, route orientation, and safety guidelines.',
          'Overnight in Jibhi / Tirthan Valley.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Jibhi to Chitkul via Kinnaur Gate [230 km / 10-11 hrs]',
        description: [
          'Early morning departure from Jibhi towards Chitkul via Rampur.',
          'Ride along the raging Satluj River entering the majestic Kinnaur Valley.',
          'Pass the iconic rock-cut Kinnaur Gate and ascend into the lush green Baspa Valley.',
          'Arrive at Chitkul – the last inhabited Indian village near the Indo-Tibet border.',
          'Check-in to your riverside campsite/hotel in Chitkul.',
          'Overnight in Chitkul.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Chitkul to Nako via Khab Sangam & Kalpa [80 km / 6-7 hrs]',
        description: [
          'Witness a glorious sunrise over the snow-capped Kinnauri peaks.',
          'Stroll along the crystal-clear Baspa River and visit the iconic Last Dhaba of India.',
          'Ride from Chitkul to Nako via Kalpa.',
          'Stop at Khab Sangam – the scenic confluence of the Spiti and Satluj rivers.',
          'Arrive in the picturesque high-altitude village of Nako and visit Nako Lake.',
          'Check-in to your hotel in Nako.',
          'Overnight in Nako.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Nako to Kaza via Tabo Monastery & Ka Loops [220 km / 8-9 hrs]',
        description: [
          'Post-breakfast ride from Nako to Kaza via Tabo.',
          'Cross the border post at Sumdo to enter the Spiti Valley.',
          'Navigate the winding Ka Loops and stop at the 1,000-year-old UNESCO World Heritage Tabo Monastery.',
          'Visit the cliff-hanging Dhankar Monastery overlooking the Spiti-Pin river confluence.',
          'Arrive in Kaza by evening and check-in to your hotel/homestay.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Circuit | Key Monastery, Chicham Bridge, Hikkim, Komic & Langza [80 km / 6-7 hrs]',
        description: [
          'Full-day high-altitude village circuit on your bikes around Kaza.',
          'Visit the iconic 1,000-year-old Key Monastery perched high on a hill cone.',
          'Drive across Chicham Bridge – Asia’s highest suspension bridge spanning a 1,000 ft canyon.',
          'Ride to Langza (Fossil Village) with its majestic golden Buddha statue.',
          'Scale the heights to Komic (4,587 m) – one of the highest motorable villages in the world.',
          'Visit Hikkim (4,400 m) to post letters from the World’s Highest Post Office.',
          'Return to Kaza by evening for local cafe hopping.',
          'Overnight in Kaza.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass [95 km / 5-6 hrs]',
        description: [
          'Morning departure from Kaza towards Chandratal Lake.',
          'Ride past Losar and conquer the rugged Kunzum La Pass (4,551 m / 14,931 ft).',
          'Pay homage at Kunzum Mata Temple before descending to the Moon Lake.',
          'Trek 1.5 km to the pristine crescent-shaped turquoise waters of Chandratal Lake.',
          'Check-in to your deluxe alpine campsite and stargaze under the brilliant Milky Way galaxy.',
          'Overnight in Chandratal Camps.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Chandratal to Manali via Batal, Chhatru & Atal Tunnel [111 km / 6-7 hrs]',
        description: [
          'Post-breakfast off-roading adventure from Chandratal to Manali.',
          'Conquer raw Himalayan water crossings at Batal, Chhatru, and Gramphu along the Chandra River.',
          'Ride through the engineering marvel, Atal Tunnel (9.02 km), entering the lush Kullu Valley.',
          'Arrive in Manali, handover your bikes, and check-in to your hotel.',
          'Evening cafe crawl and celebration dinner in Old Manali.',
          'Overnight in Manali.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Manali Local Exploration | Overnight Volvo to Delhi',
        description: [
          'Morning at leisure in Manali.',
          'Explore Hadimba Temple, Vashisht hot springs, and stroll through Mall Road for souvenirs.',
          'Evening reporting at Manali bus stand to board the overnight AC Volvo coach to Delhi.',
          'Overnight Volvo journey.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Arrival in Delhi | Trip Concludes [510 km / 10-11 hrs]',
        description: [
          'Arrive in Delhi in the morning (around 09:00 AM).',
          'Trip concludes with unforgettable memories of the ultimate Spiti Valley & Chandratal Bike Expedition.'
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
    id: '15',
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
      {
        day: 1,
        title: 'Arrival in Bagdogra | Transfer to Phuentsholing',
        description: [
          'Arrive at Bagdogra Airport (IXB) / Hasimara Railway Station.',
          'Meet our representative and board your scenic transfer to the border town of Jaigaon.',
          'Complete immigration entry formalities and cross the grand Bhutan Gate into Phuentsholing.',
          'Check-in to your hotel in Phuentsholing and relax after your journey.',
          'Evening stroll around the clean streets and local markets of Phuentsholing.',
          'Overnight in Phuentsholing.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom River Confluence [165 km / 5-6 hrs]',
        description: [
          'Post-breakfast scenic road journey from Phuentsholing to Thimphu – capital city of Bhutan.',
          'Wind through mist-covered emerald hills, lush subtropical forests, and pristine waterfalls.',
          'Stop at the picturesque Chuzom Bridge – confluence of the Paro Chhu and Wang Chhu rivers.',
          'Admire the grand royal welcome portrait of the King and Queen of Bhutan.',
          'Arrive in Thimphu, the world’s only capital city without a single traffic light.',
          'Check-in to your hotel, followed by an evening walk through Norzin Lam and Clock Tower Square.',
          'Overnight in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Thimphu to Punakha Excursion | Dochula Pass, Chimi Lhakhang & Punakha Dzong [75 km / 3-4 hrs]',
        description: [
          'Morning drive from Thimphu towards the historic valley of Punakha.',
          'Ascend Dochula Pass (3,100 m) featuring 108 Druk Wangyal Chortens and panoramic Himalayan snow peaks.',
          'Sip hot butter tea at Dochula mountain cafe taking in the crisp mountain breeze.',
          'Embark on a pleasant nature hike through paddy fields to Chimi Lhakhang (Fertility Temple).',
          'Explore the majestic Punakha Dzong at the confluence of Pho Chhu and Mo Chhu rivers.',
          'Walk across the thrilling 160-meter Punakha Suspension Bridge hung over the azure river.',
          'Experience exciting river rafting on the gentle rapids of the Mo Chhu River.',
          'Return to Thimphu by evening.',
          'Overnight in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Sightseeing to Paro | Buddha Point, Simply Bhutan & Hot Stone Bath [50 km / 1.5 hrs]',
        description: [
          'Morning visit to the magnificent Buddha Dordenma – a 169 ft bronze Buddha statue overlooking Thimphu.',
          'Experience living Bhutanese heritage, archery, and traditional folk dances at Simply Bhutan Living Museum.',
          'Scenic afternoon drive along the river valley to the historic valley town of Paro.',
          'Visit the ancient Rinpung Dzong (Paro Dzong) and take photos across the traditional wooden bridge.',
          'Check-in to your hotel/resort in Paro and enjoy a traditional hot stone herbal bath.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Paro | Hike to the Iconic Taktsang (Tiger\'s Nest Monastery)',
        description: [
          'Early morning pilgrimage hike to the world-famous Paro Taktsang (Tiger’s Nest Monastery).',
          'Trek through aromatic blue pine forests draped in Spanish moss and colorful prayer flags.',
          'Climb 900 meters above the valley floor to the miraculous monastery clinging to a sheer cliff face.',
          'Explore sacred prayer caves, marvel at the sacred relics, and soak in profound spiritual tranquility.',
          'Descend back to the base and explore Paro Town for authentic handicraft shopping and souvenir cafes.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing Return Scenic Drive [140 km / 4-5 hrs]',
        description: [
          'Post-breakfast scenic drive from Paro back towards the border town of Phuentsholing.',
          'Enjoy breathtaking views of cascading waterfalls, deep gorges, and traditional Bhutanese farmhouses.',
          'Arrive in Phuentsholing by evening, complete exit biometric stamps, and check-in to your hotel.',
          'Celebrate your memorable Bhutan expedition with a farewell group dinner.',
          'Overnight in Phuentsholing.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Phuentsholing to Bagdogra Airport | Departure',
        description: [
          'Post-breakfast check-out from your hotel.',
          'Transfer from Phuentsholing / Jaigaon to Bagdogra Airport (IXB).',
          'Trip concludes with cherished memories of the Land of the Thunder Dragon.',
          'Meals: Breakfast.'
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
    id: '16',
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
        title: 'Arrival in Bagdogra | Transfer to Phuentsholing',
        description: [
          'Arrive at Bagdogra Airport (IXB) / Hasimara Railway Station.',
          'Meet our representative and board your scenic transfer to Jaigaon on the Indo-Bhutan border.',
          'Complete immigration entry formalities and step through the ornate Bhutan Gate into Phuentsholing.',
          'Check-in to your hotel in Phuentsholing and relax.',
          'Evening stroll around the peaceful border town.',
          'Overnight in Phuentsholing.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Confluence [165 km / 5-6 hrs]',
        description: [
          'Post-breakfast scenic road journey from Phuentsholing to Thimphu.',
          'Ascend winding Himalayan roads through subtropical forests, misty valleys, and roadside waterfalls.',
          'Stop at the Chuzom River confluence (Paro Chhu & Wang Chhu) and view the welcoming portrait of the Bhutanese Monarchs.',
          'Arrive in Thimphu, the culturally rich capital of Bhutan.',
          'Check-in to your hotel and enjoy an evening stroll around Clock Tower Square and local handicraft bazaars.',
          'Overnight in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Thimphu to Punakha via Buddha Point, Dochula Pass & Punakha Dzong [75 km / 3-4 hrs]',
        description: [
          'Morning visit to the magnificent Buddha Dordenma (Buddha Point) for panoramic views of Thimphu valley.',
          'Scenic drive over Dochula Pass (3,100 m) featuring 108 Druk Wangyal Chortens and panoramic Himalayan vistas.',
          'Sip hot butter tea at Dochula pass cafe and capture memorable photographs.',
          'Descend into the subtropical valley of Punakha.',
          'Explore the majestic Punakha Dzong (Palace of Great Happiness) nestled between two rivers.',
          'Walk across the 160 m Punakha Suspension Bridge and experience thrilling river rafting on the Mo Chhu River.',
          'Check-in to your hotel/resort in Punakha.',
          'Overnight in Punakha.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjikha Valley | Gangtey Monastery & Nature Trail [80 km / 3 hrs]',
        description: [
          'Full-day scenic excursion to the pristine Phobjikha Valley (Gangtey Valley).',
          'Drive through dense oak and rhododendron forests to one of Bhutan’s most stunning glacial valleys.',
          'Visit the historic 17th-century Gangtey Monastery perched on a hilltop ridge.',
          'Take a scenic Gangtey Nature Trail hike across open alpine meadows and pine forests.',
          'Spot the rare and sacred Black-Necked Cranes (seasonal) at the conservation center.',
          'Return to Punakha by evening.',
          'Overnight in Punakha.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro via Chimi Lhakhang & Rinpung Dzong [125 km / 3.5 hrs]',
        description: [
          'Post-breakfast departure from Punakha towards Paro.',
          'Hike through picturesque terraced paddy fields to visit Chimi Lhakhang (Fertility Temple).',
          'Continue scenic mountain drive along the river towards Paro.',
          'Visit the historic Rinpung Dzong (Paro Dzong) and the National Museum (Ta Dzong).',
          'Check-in to your Paro resort and rejuvenate with a traditional Bhutanese hot stone herbal bath.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Paro | Hike to the Iconic Taktsang (Tiger\'s Nest Monastery)',
        description: [
          'Early morning pilgrimage hike to the legendary Paro Taktsang (Tiger’s Nest Monastery).',
          'Trek through aromatic blue pine forests adorned with fluttering prayer flags.',
          'Climb 900 meters above the valley floor to the sacred cliffside sanctuary.',
          'Explore ancient prayer caves and soak in profound spiritual serenity.',
          'Descend to the base and spend the evening shopping for souvenirs and cafe hopping in Paro Town.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Paro to Siliguri via Phuentsholing [300 km / 8-9 hrs]',
        description: [
          'Post-breakfast return road journey from Paro through Phuentsholing to Siliguri.',
          'Enjoy breathtaking downhill Himalayan scenery and waterfall vistas.',
          'Cross the border back into India and arrive in Siliguri by evening.',
          'Check-in to your hotel in Siliguri and celebrate the journey with a farewell dinner.',
          'Overnight in Siliguri.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Siliguri to Bagdogra Airport | Departure',
        description: [
          'Post-breakfast check-out from your Siliguri hotel.',
          'Transfer to Bagdogra Airport (IXB) for your return flight.',
          'Trip concludes with lifelong memories of the mystical kingdom of Bhutan.',
          'Meals: Breakfast.'
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
    id: '17',
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
        title: 'Arrival in Bagdogra | Transfer to Phuentsholing',
        description: [
          'Arrive at Bagdogra Airport (IXB) / Hasimara Railway Station.',
          'Meet our representative and board your scenic transfer to Jaigaon on the Indo-Bhutan border.',
          'Complete immigration entry formalities and step through the ornate Bhutan Gate into Phuentsholing.',
          'Check-in to your hotel in Phuentsholing and relax.',
          'Evening stroll around the peaceful border town.',
          'Overnight in Phuentsholing.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Confluence [165 km / 5-6 hrs]',
        description: [
          'Post-breakfast scenic road journey from Phuentsholing to Thimphu.',
          'Ascend winding Himalayan roads through subtropical forests, misty valleys, and roadside waterfalls.',
          'Stop at the Chuzom River confluence (Paro Chhu & Wang Chhu) and view the welcoming portrait of the Bhutanese Monarchs.',
          'Arrive in Thimphu, the culturally rich capital of Bhutan.',
          'Check-in to your hotel and enjoy an evening stroll around Clock Tower Square and local handicraft bazaars.',
          'Overnight in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Thimphu to Punakha via Buddha Point, Dochula Pass & Punakha Dzong [75 km / 3-4 hrs]',
        description: [
          'Morning visit to the magnificent Buddha Dordenma (Buddha Point) for panoramic views of Thimphu valley.',
          'Scenic drive over Dochula Pass (3,100 m) featuring 108 Druk Wangyal Chortens and panoramic Himalayan vistas.',
          'Sip hot butter tea at Dochula pass cafe and capture memorable photographs.',
          'Descend into the subtropical valley of Punakha.',
          'Explore the majestic Punakha Dzong (Palace of Great Happiness) nestled between two rivers.',
          'Walk across the 160 m Punakha Suspension Bridge and experience thrilling river rafting on the Mo Chhu River.',
          'Check-in to your hotel/resort in Punakha.',
          'Overnight in Punakha.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjikha Valley | Gangtey Monastery & Nature Trail [80 km / 3 hrs]',
        description: [
          'Full-day scenic excursion to the pristine Phobjikha Valley (Gangtey Valley).',
          'Drive through dense oak and rhododendron forests to one of Bhutan’s most stunning glacial valleys.',
          'Visit the historic 17th-century Gangtey Monastery perched on a hilltop ridge.',
          'Take a scenic Gangtey Nature Trail hike across open alpine meadows and pine forests.',
          'Spot the rare and sacred Black-Necked Cranes (seasonal) at the conservation center.',
          'Return to Punakha by evening.',
          'Overnight in Punakha.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro via Chimi Lhakhang & Rinpung Dzong [125 km / 3.5 hrs]',
        description: [
          'Post-breakfast departure from Punakha towards Paro.',
          'Hike through picturesque terraced paddy fields to visit Chimi Lhakhang (Fertility Temple).',
          'Continue scenic mountain drive along the river towards Paro.',
          'Visit the historic Rinpung Dzong (Paro Dzong) and the National Museum (Ta Dzong).',
          'Check-in to your Paro resort and rejuvenate with a traditional Bhutanese hot stone herbal bath.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Paro | Hike to the Iconic Taktsang (Tiger\'s Nest Monastery)',
        description: [
          'Early morning pilgrimage hike to the legendary Paro Taktsang (Tiger’s Nest Monastery).',
          'Trek through aromatic blue pine forests adorned with fluttering prayer flags.',
          'Climb 900 meters above the valley floor to the sacred cliffside sanctuary.',
          'Explore ancient prayer caves and soak in profound spiritual serenity.',
          'Descend to the base and spend the evening shopping for souvenirs and cafe hopping in Paro Town.',
          'Overnight in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Paro to Siliguri via Phuentsholing [300 km / 8-9 hrs]',
        description: [
          'Post-breakfast return road journey from Paro through Phuentsholing to Siliguri.',
          'Enjoy breathtaking downhill Himalayan scenery and waterfall vistas.',
          'Cross the border back into India and arrive in Siliguri by evening.',
          'Check-in to your hotel in Siliguri and celebrate the journey with a farewell dinner.',
          'Overnight in Siliguri.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Siliguri to Bagdogra Airport | Departure',
        description: [
          'Post-breakfast check-out from your Siliguri hotel.',
          'Transfer to Bagdogra Airport (IXB) for your return flight.',
          'Trip concludes with lifelong memories of the mystical kingdom of Bhutan.',
          'Meals: Breakfast.'
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
    id: '18',
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
        title: 'Arrival in Bagdogra | Transfer to Phuentsholing',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB).',
          'Board your transfer and drive towards the Indo-Bhutan border town of Jaigaon.',
          'Cross the border gate to enter Phuentsholing, Bhutan.',
          'Check in to your hotel and unwind after your journey.',
          'Spend the evening at leisure exploring the local Bhutanese border town.',
          'Overnight stay in Phuentsholing.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu | Scenic Himalayan Drive',
        description: [
          'Enjoy breakfast and complete the immigration permit formalities at the border.',
          'Embark on a scenic drive to Thimphu, passing winding mountain roads, broad-leaved forests, waterfalls, and quaint villages.',
          'Stop at the Chuzom Bridge to witness the confluence of the Paro and Thimphu rivers and the King & Queen portrait.',
          'Arrive in Thimphu by late afternoon and check in to your hotel.',
          'Spend the evening exploring the local Thimphu markets, handicraft emporiums, and clock tower square.',
          'Overnight stay in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Excursion to Punakha via Dochula Pass (3,100 m)',
        description: [
          'Relish breakfast and begin your day excursion towards the sub-tropical Punakha Valley (75 km).',
          'Ascend Dochula Pass (3,100 m) for panoramic Himalayan vistas and visit the 108 Druk Wangyal Chortens.',
          'Enjoy a warm cup of tea or coffee at the pass while admiring snow-peaked vistas.',
          'Descend into Punakha valley and embark on a short scenic walk through paddy fields to Chimi Lhakhang (the Fertility Temple).',
          'Return to Thimphu in the evening and relax at your hotel.',
          'Overnight stay in Thimphu.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Sightseeing | Transfer to Paro',
        description: [
          'Wake up and enjoy a hearty breakfast at the hotel.',
          'Visit the colossal Buddha Dordenma (Buddha Point) for sweeping views of Thimphu Valley.',
          'Experience Bhutanese culture and living traditions at the Simply Bhutan living museum.',
          'Board your vehicle and proceed on a picturesque drive to Paro.',
          'Arrive in Paro, check in to your hotel, and spend a relaxing evening by the riverside.',
          'Overnight stay in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Paro Sightseeing | Hike to Tiger’s Nest (Taktsang)',
        description: [
          'Fuel up with breakfast and head to the trailhead for the iconic Taktsang Monastery (Tiger’s Nest).',
          'Trek 2–4 hours through fragrant pine forests and fluttering prayer flags up to the cliffside monastery (900 m above the valley floor).',
          'Explore the sacred caves, shrines, and breathtaking valley viewpoints.',
          'Hike down and return to Paro town for a traditional Bhutanese Hot Stone Bath experience.',
          'Spend your evening strolling through Paro’s quaint heritage street and souvenir shops.',
          'Overnight stay in Paro.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing | Scenic Return Descent',
        description: [
          'Savor breakfast with scenic mountain views and check out from your hotel.',
          'Board your transfer and enjoy a scenic descent back to Phuentsholing.',
          'Enjoy stopovers along the winding highway for photos and mountain vistas.',
          'Check in to your hotel upon reaching Phuentsholing.',
          'Spend your farewell evening exploring the border town markets and café hopping.',
          'Overnight stay in Phuentsholing.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Phuentsholing to Bagdogra Airport | Departure',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your transfer back to Bagdogra Airport (IXB) for your onward flight.',
          'Conclude your memorable Bhutan journey with unforgettable Himalayan memories.',
          'Meals: Breakfast.'
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
    id: '19',
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
        title: 'Delhi to Manali | Overnight Volvo Journey',
        description: [
          'Assemble at the designated pickup point in Delhi by evening.',
          'Meet your trip captain and fellow travelers for a brief trip orientation.',
          'Board your comfortable AC Volvo bus and begin the overnight journey to Himachal Pradesh.',
          'Enjoy the scenic drive as you transition from city lights to Himalayan foothills.',
          'Overnight journey in Volvo bus.'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali | Jogini Waterfall & Old Manali Exploration',
        description: [
          'Arrive in Manali in the morning and transfer to your hotel for check-in and relaxation.',
          'Drive towards Vashisht village and embark on an easy 1.5–2 hour trek to Jogini Waterfall.',
          'Admire the cascading waterfall surrounded by lush pine forests, apple orchards, and valley views.',
          'Visit the historic 16th-century wooden Hadimba Devi Temple set amidst tall deodars.',
          'Stroll through Old Manali’s vibrant lanes, exploring quirky cafés, live music spots, and local markets.',
          'Overnight stay in Manali.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Manali – Atal Tunnel – Sissu Valley – Solang Valley',
        description: [
          'Enjoy breakfast and set out for a scenic high-altitude mountain expedition.',
          'Drive through the iconic Atal Tunnel (10,000+ ft) into the dramatic Lahaul Valley.',
          'Explore the postcard-perfect village of Sissu, marveling at the cascading Sissu Waterfall and glaciers.',
          'Stop at Solang Valley on your return for thrilling adventure activities like paragliding, zorbing, and quad biking.',
          'Return to Manali by evening and unwind with your group.',
          'Overnight stay in Manali.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Manali to Kasol en route Beas River Rafting & Manikaran',
        description: [
          'Have breakfast and check out from Manali to begin your journey to Parvati Valley.',
          'Experience thrilling white-water river rafting on the gushing Beas River (optional/direct pay).',
          'Visit the revered Manikaran Sahib Gurudwara and witness the natural hot sulfur springs.',
          'Drive into Kasol, check in to your stay, and soak in the vibrant backpacker culture.',
          'Spend the evening café hopping, shopping at local flea markets, and chilling beside the Parvati River.',
          'Overnight stay in Kasol.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Parvati Valley Exploration | Tosh, Kalga & Chalal',
        description: [
          'Wake up to the sounds of the rushing Parvati River and enjoy breakfast.',
          'Drive to Barshaini, the gateway to Parvati Valley’s traditional mountain hamlets.',
          'Hike up to the picturesque village of Tosh for stunning snow-capped mountain views and wooden house architecture.',
          'Explore the serene pine-shaded trails of Kalga and Pulga (Fairy Forest).',
          'Take a leisurely evening walk to Chalal village before returning to Kasol for dinner.',
          'Overnight stay in Kasol.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kasol to Jibhi via Banjar Valley | Jibhi Waterfall & Mini Thailand',
        description: [
          'Savor breakfast, check out from Kasol, and drive through the Aut tunnel towards Banjar Valley.',
          'Arrive in the peaceful hamlet of Jibhi and check in to your traditional wooden stay.',
          'Take an easy stroll to the serene Jibhi Waterfall nestled among pine woods and wooden footbridges.',
          'Trek down through the forest trail to the picturesque freshwater rock pools of Mini Thailand.',
          'Spend the evening relaxing at cozy local cafes and enjoying peaceful riverside vibes.',
          'Overnight stay in Jibhi.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Jalori Pass & Serolsar Lake Trek | Overnight Volvo to Delhi',
        description: [
          'Enjoy an early breakfast and check out from your stay in Jibhi.',
          'Drive up to Jalori Pass (10,800 ft) for sweeping 360-degree views of the Himalayas.',
          'Embark on an easy 5–6 km scenic forest trek through oak and pine woods to mystical Serolsar Lake.',
          'Spend tranquil moments at the sacred lake and visit the revered Budhi Nagin Temple.',
          'Trek back to Jalori Pass, board your transfer to Aut, and catch your overnight AC Volvo bus to Delhi.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Arrival in Delhi | Trip Concludes',
        description: [
          'Arrive back in Delhi early in the morning.',
          'Bid farewell to your travel companions and take home memories of your unforgettable Himachal adventure.'
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
    id: '20',
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
        title: 'Delhi to Aut | Overnight Himalayan Escape',
        description: [
          'Assemble at the designated pickup point in Delhi by evening.',
          'Meet your trip captain and fellow travelers for a brief trip briefing.',
          'Board your comfortable AC Volvo bus and begin your overnight journey to Himachal Pradesh.',
          'Enjoy the scenic drive transitioning from urban lights to the tranquil Himalayan foothills.',
          'Overnight journey in Volvo bus.'
        ]
      },
      {
        day: 1,
        title: 'Arrival at Aut | Transfer to Jibhi & Local Exploration',
        description: [
          'Arrive at Aut in the morning and board your transfer towards the scenic Banjar Valley.',
          'Check in to your cozy wooden cottage/stay in Jibhi and freshen up.',
          'Take a relaxing nature walk to the picturesque Jibhi Waterfall surrounded by wooden bridges and lush pine forest.',
          'Trek to the natural rock pool formation at Mini Thailand for crystal-clear waters and photography.',
          'Spend the evening café hopping, exploring local handicrafts, and relaxing amidst quiet riverside vibes.',
          'Overnight stay in Jibhi.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Trek to Serolsar Lake & 360-Degree Himalayan Viewpoint',
        description: [
          'Wake up to crisp mountain air and enjoy breakfast.',
          'Drive up to Jalori Pass (10,800 ft), admiring sweeping views of cedar-covered slopes and snow-capped peaks.',
          'Embark on an easy-to-moderate 5–6 km trek through dense oak and rhododendron forest to Serolsar Lake.',
          'Visit the holy Budhi Nagin Temple beside the pristine lake and hike to the 360° viewpoint for panoramic vistas.',
          'Trek back to Jalori Pass and return to Jibhi for a cozy evening around a bonfire.',
          'Overnight stay in Jibhi.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Jibhi to Manali via Kullu Valley | Hadimba Temple & Old Manali',
        description: [
          'Savor breakfast, check out from Jibhi, and embark on a scenic drive to Manali along the Beas River.',
          'Stop in Kullu Valley for an exhilarating white-water river rafting session on the Beas River (optional/direct pay).',
          'Reach Manali and check in to your hotel to freshen up.',
          'Visit the iconic Hadimba Devi Temple nestled in ancient deodar woods.',
          'Spend your evening café hopping in Old Manali, enjoying live music, and strolling along Mall Road.',
          'Overnight stay in Manali.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Manali – Atal Tunnel – Sissu Valley – Kasol',
        description: [
          'Enjoy breakfast and get ready for a spectacular high-altitude road adventure.',
          'Pass through the engineering wonder Atal Tunnel into the dramatic landscapes of Lahaul Valley.',
          'Explore the enchanting Himalayan hamlet of Sissu, taking in the roaring waterfall and glacier views.',
          'Drive towards the Parvati Valley and reach Kasol by late afternoon.',
          'Check in to your riverside stay and spend the evening exploring Kasol’s bohemian cafes, German bakeries, and flea markets.',
          'Overnight stay in Kasol.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Manikaran Sahib & Chalal Trek | Overnight Volvo to Delhi',
        description: [
          'Have breakfast and check out from your hotel.',
          'Visit the sacred Manikaran Sahib Gurudwara and experience the natural hot sulfur springs.',
          'Embark on a scenic pine-forest walk along the Parvati River to the peaceful hamlet of Chalal.',
          'Spend your last hours shopping for souvenirs and chilling by the river in Kasol.',
          'Board your evening AC Volvo bus back to Delhi with unforgettable mountain memories.',
          'Meals: Breakfast.'
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
    id: '21',
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
    showGetQuoteOnly: true,
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
        title: 'Arrival in Amritsar | Golden Temple & Wagah Border Ceremony',
        description: [
          'Meet our representative upon arrival at Amritsar Airport or Railway Station and transfer to your hotel.',
          'Check in, freshen up, and prepare for an enriching cultural and spiritual tour.',
          'Visit the peaceful and radiant Golden Temple (Harmandir Sahib), the spiritual center of Sikhism.',
          'Drive to the Attari-Wagah Border in the afternoon to witness the patriotic Beating Retreat Ceremony.',
          'Return to Amritsar city in the evening for dinner and overnight rest.',
          'Overnight stay in Amritsar.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Amritsar to Dalhousie (200 km / 5–6 hrs)',
        description: [
          'Savor breakfast at the hotel and complete check-out formalities.',
          'Embark on a scenic uphill road journey towards the colonial hill retreat of Dalhousie.',
          'Arrive in Dalhousie, surrounded by towering pine trees and Dhauladhar views, and check in to your hotel.',
          'Spend a leisurely evening relaxing in the cool mountain climate.',
          'Overnight stay in Dalhousie.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Dalhousie Sightseeing & Khajjiar (Mini Switzerland) Excursion',
        description: [
          'Enjoy breakfast and head out for a full-day excursion to the picturesque Khajjiar meadows.',
          'Stroll around Khajjiar lake, surrounded by dense deodars, and enjoy optional activities like zorbing and horse riding.',
          'Visit Panchpula Waterfalls, Subhash Baoli, and the historic St. John’s Church.',
          'Spend the evening browsing local handicraft stalls and street cafes along Gandhi Chowk and Mall Road.',
          'Overnight stay in Dalhousie.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Dalhousie to Dharamshala (120 km / 4–5 hrs)',
        description: [
          'Relish breakfast, check out from the hotel, and start your scenic drive to Dharamshala.',
          'Enjoy sweeping valley panoramas as you approach the hillside sanctuary in the Kangra Valley.',
          'Arrive in Dharamshala, check in to your hotel, and relax amid tranquil pine forests.',
          'Spend the evening at leisure exploring quaint mountain cafes and local markets.',
          'Overnight stay in Dharamshala.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Dharamshala & McLeod Ganj Full-Day Sightseeing',
        description: [
          'Enjoy a wholesome breakfast and set out for full-day sightseeing across Dharamshala and McLeod Ganj.',
          'Visit the sacred Tsuglagkhang Complex (Dalai Lama Temple) and Namgyal Monastery.',
          'Explore Bhagsunag Temple and hike to the cascading Bhagsunag Waterfall.',
          'Visit St. John in the Wilderness Church, scenic Dal Lake, and Naddi Viewpoint for sunset over Dhauladhar peaks.',
          'Stop for photos outside the picturesque HPCA Dharamshala Cricket Stadium (subject to accessibility).',
          'Overnight stay in Dharamshala.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Dharamshala to Amritsar (200 km / 5–6 hrs)',
        description: [
          'Check out after breakfast and embark on the return drive to Amritsar.',
          'Arrive in Amritsar by late afternoon and check in to your hotel.',
          'Spend your evening exploring local Punjabi street food, shopping for phulkari work, or taking an evening stroll near the illuminated Golden Temple.',
          'Overnight stay in Amritsar.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Amritsar Departure | Tour Concludes',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Transfer to Amritsar Airport or Railway Station for your onward journey.',
          'Depart with fond memories of a spiritually enriching and scenic Himalayan family holiday.',
          'Meals: Breakfast.'
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
    id: '22',
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
        title: 'Arrival in Srinagar | Dal Lake, Mughal Gardens & Sunset Shikara Ride',
        description: [
          'Meet our representative upon arrival at Srinagar Airport (SXR) and transfer to your hotel.',
          'Check in, freshen up, and take in the serene mountain surroundings.',
          'Explore the historic Mughal Gardens: Shalimar Bagh, Nishat Bagh, and Chashme Shahi overlooking Dal Lake.',
          'Enjoy an enchanting 1-hour sunset Shikara ride across the tranquil waters of Dal Lake.',
          'Glide past floating markets and ornate houseboats with the Pir Panjal mountain range in the backdrop.',
          'Return to your hotel for dinner and overnight rest.',
          'Overnight stay in Srinagar.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg via Tangmarg | Gondola Cable Car Ride',
        description: [
          'Enjoy breakfast, check out from Srinagar, and drive to the alpine wonderland of Gulmarg (55 km / 2 hrs).',
          'Ascend via the world-famous Gulmarg Gondola Cable Car (Phase 1) for panoramic views of snow-capped peaks.',
          'Check in to your hotel in Gulmarg and relax amidst the meadows.',
          'Spend your afternoon exploring Khilanmarg (optional pony ride) or strolling through pine-fringed cafes.',
          'Return to your hotel in the evening for dinner.',
          'Overnight stay in Gulmarg.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gulmarg to Pahalgam via Avantipur Ruins (140 km / 4 hrs)',
        description: [
          'Savor breakfast, check out from Gulmarg, and proceed on a scenic drive to Pahalgam (Valley of Shepherds).',
          'En route, explore the 9th-century Avantipur Ruins dedicated to Lord Vishnu and Lord Shiva.',
          'Drive along the sparkling Lidder River and check in to your hotel in Pahalgam.',
          'Spend the evening at leisure exploring Pahalgam’s pine forests, local saffron markets, and riverside trails.',
          'Overnight stay in Pahalgam.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Pahalgam Valleys Excursion (Aru, Betaab & Chandanwari) | Transfer to Srinagar',
        description: [
          'Wake up to mountain views and enjoy breakfast.',
          'Board local union vehicles to explore the scenic trio: Aru Valley, Betaab Valley, and Chandanwari.',
          'Walk through pristine meadows at Aru Valley, explore the Bollywood famous Betaab Valley, and witness glacier viewpoints at Chandanwari.',
          'Complete your sightseeing and drive back towards Srinagar (90 km / 3 hrs).',
          'Check in to your hotel in Srinagar and unwind.',
          'Overnight stay in Srinagar.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Excursion to Sonmarg & Thajiwas Glacier | Traditional Houseboat Stay',
        description: [
          'Enjoy a hearty breakfast and depart on a scenic day excursion to Sonmarg (Meadow of Gold).',
          'Drive along the cascading Sindh River flanked by towering Himalayan mountains.',
          'Arrive in Sonmarg and take an optional pony trek or walk to the foot of Thajiwas Glacier.',
          'Spend time playing in the snow and taking in dramatic mountain landscapes.',
          'Drive back to Srinagar in the evening and check in to a traditional Kashmiri Houseboat on Dal Lake.',
          'Enjoy a special Kashmiri dinner on board the houseboat.',
          'Overnight stay in Srinagar Houseboat.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Srinagar Departure | Valley Farewell',
        description: [
          'Relish breakfast on the houseboat deck and complete check-out formalities.',
          'Board your transfer to Srinagar Airport (SXR) for your return flight.',
          'Conclude your heavenly Kashmir holiday with memories to cherish for a lifetime.',
          'Meals: Breakfast.'
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
    id: '23',
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
        title: 'Welcome to Singapore | Gardens by the Bay (Flower Dome & Cloud Forest)',
        description: [
          'Arrive at Singapore Changi Airport (SIN) and meet our representative for your private transfer.',
          'Check in to Hotel Mi Rochor and relax comfortably after your flight.',
          'Head out in the evening to visit the world-renowned Gardens by the Bay.',
          'Explore the climate-controlled Flower Dome and witness the dramatic indoor waterfall inside Cloud Forest.',
          'Experience the mesmerizing Garden Rhapsody light and sound show at the Supertree Grove.',
          'Overnight stay in Singapore.'
        ]
      },
      {
        day: 2,
        title: 'Guided Singapore City Tour | Singapore Flyer & Marina Bay Sands',
        description: [
          'Enjoy a lavish breakfast at the hotel.',
          'Embark on a guided half-day city tour visiting Merlion Park, Civic District, Esplanade, and Singapore River.',
          'Soar above the city aboard the iconic Singapore Flyer for 360-degree panoramic skyline views.',
          'Visit the Marina Bay Sands SkyPark Observation Deck for breathtaking views over Marina Bay.',
          'Stroll along the waterfront promenade and watch the Spectra Light & Water Show.',
          'Overnight stay in Singapore.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Universal Studios Singapore | Full-Day Theme Park Adventure',
        description: [
          'Fuel up with breakfast and take your private transfer to Resorts World Sentosa.',
          'Spend an action-packed full day exploring the 6 themed zones of Universal Studios Singapore.',
          'Enjoy thrilling rides including Battlestar Galactica, Transformers The Ride 3D, and Jurassic Park Rapids Adventure.',
          'Experience live street performances and character meet-and-greets across Hollywood Boulevard and Minion Land.',
          'Board your private transfer back to the hotel in the evening.',
          'Overnight stay in Singapore.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Sentosa Island Discovery | Cable Car, S.E.A. Aquarium & Wings of Time',
        description: [
          'Relish breakfast and board the scenic Mount Faber Cable Car to Sentosa Island.',
          'Explore the deep blue at S.E.A. Aquarium, home to over 100,000 marine animals and majestic manta rays.',
          'Experience the spellbinding Harry Potter: Visions of Magic interactive exhibition.',
          'Spend the afternoon relaxing along the sandy shores of Siloso and Palawan beaches.',
          'Watch the spectacular Wings of Time multi-sensory night show featuring laser displays, fountains, and pyrotechnics.',
          'Overnight stay in Singapore.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Mandai Wildlife Reserve | River Wonders & Night Safari',
        description: [
          'Savor breakfast and enjoy a relaxed morning at the hotel.',
          'Head to Mandai Wildlife Reserve in the afternoon to visit River Wonders.',
          'Walk through the Giant Panda Forest to see Kai Kai & Jia Jia, and ride the Amazon River Quest boat.',
          'As darkness falls, embark on the world-famous Night Safari tram journey through nocturnal wildlife habitats.',
          'Watch the Creatures of the Night presentation and walk along the illuminated Leopard Trail.',
          'Overnight stay in Singapore.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Leisure Day | Shopping, Cultural Heritage & Local Flavours',
        description: [
          'Enjoy breakfast at your own pace.',
          'Spend the day exploring vibrant heritage quarters: Chinatown, Little India, and Arab Street (Haji Lane).',
          'Indulge in premier retail shopping along Orchard Road and Bugis Street.',
          'Taste authentic Singaporean delicacies like Hainanese Chicken Rice, Laksa, and Chili Crab at iconic hawker centres.',
          'Visit the lush UNESCO World Heritage Singapore Botanic Gardens for a peaceful evening walk.',
          'Overnight stay in Singapore.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Jewel Changi & Departure | Farewell Singapore',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your private transfer to Singapore Changi Airport.',
          'Visit Jewel Changi to witness the world’s tallest indoor waterfall (HSBC Rain Vortex) and lush canopy park.',
          'Board your return flight home carrying unforgettable Singapore memories.',
          'Meals: Breakfast.'
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
    id: '24',
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
        title: 'Arrival at Bagdogra / NJP | Transfer to Gangtok (125 km / 5 hrs)',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB) or NJP Railway Station.',
          'Board your transfer and embark on a scenic drive along the Teesta River flanked by tea gardens and lush hills.',
          'Reach Gangtok by afternoon and complete hotel check-in formalities.',
          'Spend the evening strolling through MG Marg for local momos, tea, and souvenirs.',
          'Overnight stay in Gangtok.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Relish an early breakfast and drive towards the high-altitude glacial Tsomgo Lake (12,313 ft).',
          'Admire the serene lake with its changing hues, snow-covered mountains, and optional yak rides.',
          'Proceed further up to the revered Baba Harbhajan Singh Mandir (13,200 ft).',
          'Optionally visit the Indo-China border at Nathula Pass (14,140 ft, subject to permit & availability).',
          'Drive back to Gangtok in the late afternoon and unwind at your hotel.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Pelling via Namchi Char Dham & Ravangla Buddha Park',
        description: [
          'Enjoy breakfast, check out from Gangtok, and visit the peaceful hilltop Enchey Monastery.',
          'Receive blessings from the monks before beginning your scenic drive into West Sikkim.',
          'En route, visit the Siddheshwar Dham (Char Dham) in Namchi and the monumental Buddha Park in Ravangla.',
          'Arrive in Pelling by late afternoon and check in to your resort.',
          'Spend a quiet evening enjoying panoramic views of Mount Kanchenjunga.',
          'Overnight stay in Pelling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Pelling Sightseeing & Skywalk Experience | Rabdentse Ruins',
        description: [
          'Fuel up with breakfast and set out for full-day sightseeing across Pelling.',
          'Walk on India’s first Glass Skywalk at 7,000 ft beneath the towering Chenrezig Statue.',
          'Visit the 17th-century Pemayangtse Monastery and take a peaceful 15-minute forest walk to ancient Rabdentse Ruins.',
          'Visit the sacred Khecheopalri Lake, Rimbi Waterfalls, Orange Gardens, and Kanchenjunga Falls.',
          'Return to your hotel in the evening and relax amidst mountain tranquility.',
          'Overnight stay in Pelling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Pelling to Darjeeling | The Queen of Hills (100 km / 4 hrs)',
        description: [
          'Savor breakfast, check out from Pelling, and begin your scenic drive into West Bengal\'s Queen of Hills.',
          'Wind through tea estates like Happy Valley and lush green mountain slopes.',
          'Arrive in Darjeeling by afternoon and check in to your hillside hotel.',
          'Spend the evening walking around Mall Road and Chowrasta, sipping world-famous Darjeeling tea.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Darjeeling Sunrise at Tiger Hill & Full-Day Local Sightseeing',
        description: [
          'Depart early around 4:00 AM for Tiger Hill to witness the golden sunrise over Mt. Kanchenjunga and Mt. Everest.',
          'Stop on the return drive at Batasia Loop to view the spiral toy train track and the Gorkha War Memorial.',
          'Return to the hotel for breakfast, followed by visits to the Himalayan Mountaineering Institute (HMI), Padmaja Naidu Zoo, and Tenzing Rock.',
          'Visit the Japanese Peace Pagoda and Tibetan Refugee Self-Help Centre.',
          'Enjoy an optional heritage Toy Train joy ride in the afternoon.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Darjeeling to Bagdogra / NJP | Departure',
        description: [
          'Enjoy a leisurely breakfast overlooking the misty hills and check out from your hotel.',
          'Board your transfer back to Bagdogra Airport (IXB) or NJP Railway Station.',
          'Depart with unforgettable memories of the Eastern Himalayas.',
          'Meals: Breakfast.'
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
    id: '25',
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
        title: 'Arrival at Bagdogra / NJP | Transfer to Gangtok (125 km / 5 hrs)',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB) or NJP Railway Station.',
          'Embark on a scenic drive along the winding Teesta River and lush green Himalayan foothills.',
          'Arrive in Gangtok by afternoon and complete hotel check-in formalities.',
          'Spend a cozy evening taking a leisurely stroll hand-in-hand along the pedestrianized MG Marg.',
          'Overnight stay in Gangtok.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Savor an early breakfast and set out towards the high-altitude glacial Tsomgo Lake (12,313 ft).',
          'Admire panoramic snow-capped mountain views and enjoy a romantic walk along the lake perimeter.',
          'Visit the revered Baba Harbhajan Singh Mandir (13,200 ft).',
          'Optionally visit Nathula Pass at the Indo-China border (14,140 ft, subject to permit & availability).',
          'Return to Gangtok by evening for dinner and relaxation.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Darjeeling | The Queen of Hills (100 km / 4 hrs)',
        description: [
          'Relish breakfast, check out from Gangtok, and journey towards the romantic hill town of Darjeeling.',
          'Drive past sprawling emerald tea estates like Happy Valley and mist-shrouded valleys.',
          'Arrive in Darjeeling, check in to your hotel, and relax with panoramic valley views.',
          'Spend your evening exploring Chowrasta Mall Road and sampling fresh Darjeeling tea at cozy heritage cafes.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Tiger Hill Sunrise & Full-Day Darjeeling Sightseeing',
        description: [
          'Wake up early around 4:00 AM for a sunrise drive to Tiger Hill, watching dawn illuminate Mt. Kanchenjunga in gold.',
          'Stop at Batasia Loop to view the spiral heritage track and the Gorkha War Memorial.',
          'Return for breakfast, then visit Himalayan Mountaineering Institute, Padmaja Naidu Zoo, and Japanese Peace Pagoda.',
          'Optionally board the iconic Darjeeling Himalayan Toy Train for a romantic joy ride.',
          'Spend your farewell evening soaking in sunset views over the tea plantations.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Darjeeling to Bagdogra / NJP | Departure',
        description: [
          'Savor breakfast with mountain views and complete check-out formalities.',
          'Board your private transfer back to Bagdogra Airport (IXB) or NJP Railway Station.',
          'Conclude your romantic Himalayan vacation with memories to cherish forever.',
          'Meals: Breakfast.'
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
    id: '26',
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
        title: 'Arrival at Bagdogra / NJP | Transfer to Gangtok (125 km / 5 hrs)',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB) or NJP Railway Station.',
          'Embark on a scenic drive along the Teesta River towards Gangtok.',
          'Reach Gangtok by afternoon and complete hotel check-in formalities.',
          'Spend the evening at leisure exploring MG Marg, savoring hot momos, and enjoying local markets.',
          'Overnight stay in Gangtok.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Fuel up with breakfast and head towards the sacred high-altitude glacial Tsomgo Lake (12,313 ft).',
          'Admire the sparkling alpine lake surrounded by steep snow-clad peaks.',
          'Visit the revered Baba Harbhajan Singh Mandir (13,200 ft).',
          'Optionally visit the Indo-China border at Nathula Pass (14,140 ft, subject to permit & availability).',
          'Return to Gangtok in the late afternoon for dinner and rest.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Pelling via Namchi Char Dham & Ravangla Buddha Park',
        description: [
          'Enjoy breakfast, check out from Gangtok, and visit Enchey Monastery for monk blessings.',
          'Drive into West Sikkim with stops at Namchi Siddheshwar Dham (Char Dham) and Ravangla Buddha Park.',
          'Arrive in Pelling by late afternoon and check in to your hotel.',
          'Spend a peaceful evening enjoying spectacular views of Mt. Kanchenjunga.',
          'Overnight stay in Pelling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Pelling Sightseeing & Skywalk | Transfer to Darjeeling (100 km / 4 hrs)',
        description: [
          'Enjoy breakfast and head out to explore Pelling’s top attractions.',
          'Experience walking across India’s first Glass Skywalk at 7,000 ft beneath the Chenrezig Statue.',
          'Visit the 17th-century Pemayangtse Monastery and take a short forest trail walk to Rabdentse Ruins.',
          'Visit Khecheopalri Lake, Rimbi Falls, and Orange Gardens before driving towards Darjeeling.',
          'Reach Darjeeling by evening and check in to your hotel.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Day Excursion to Mirik Lake & Tea Gardens',
        description: [
          'Relish breakfast and proceed on a picturesque 2-hour day excursion to the tranquil lake town of Mirik.',
          'Stroll around Sumendu (Mirik) Lake and cross the arched footbridge surrounded by pine groves.',
          'Enjoy an optional boating experience on the lake or relax at lakeside cafes.',
          'Visit sprawling tea estates stretching across emerald rolling hills.',
          'Drive back to Darjeeling in the late afternoon and spend the evening exploring Chowrasta.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Tiger Hill Sunrise & Full-Day Darjeeling Sightseeing',
        description: [
          'Depart early around 4:00 AM for Tiger Hill to watch the golden sunrise over Mt. Kanchenjunga.',
          'Stop at Batasia Loop and the Gorkha War Memorial on your scenic return drive.',
          'Return for breakfast, then visit the Himalayan Mountaineering Institute, Zoo, and Japanese Peace Pagoda.',
          'Optionally ride the world-renowned Darjeeling Himalayan Toy Train.',
          'Spend your final evening shopping for tea and souvenirs along Mall Road.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Darjeeling to Bagdogra / NJP | Departure',
        description: [
          'Enjoy breakfast with mountain views and complete check-out formalities.',
          'Board your transfer back to Bagdogra Airport (IXB) or NJP Railway Station.',
          'Conclude your wonderful Sikkim, Darjeeling, and Mirik tour.',
          'Meals: Breakfast.'
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
    id: '27',
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
        title: 'Arrival at Bagdogra / NJP | Transfer to Gangtok (125 km / 5 hrs)',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB) or NJP Railway Station.',
          'Embark on a scenic drive along the Teesta River towards Gangtok.',
          'Reach Gangtok by late afternoon and check in to your hotel.',
          'Spend the evening at leisure exploring MG Marg, savoring local snacks and tea.',
          'Overnight stay in Gangtok.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Savor an early breakfast and drive towards the high-altitude glacial Tsomgo Lake (12,313 ft).',
          'Admire the serene lake with its changing hues, snow-covered mountains, and optional yak rides.',
          'Proceed further up to the revered Baba Harbhajan Singh Mandir (13,200 ft).',
          'Optionally visit the Indo-China border at Nathula Pass (14,140 ft, subject to permit & availability).',
          'Drive back to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Lachen | Gateway to North Sikkim (120 km / 6 hrs)',
        description: [
          'Enjoy breakfast, check out from Gangtok, and start your scenic drive into North Sikkim.',
          'Pass scenic landmarks including Seven Sisters Waterfalls, Naga Falls, and Singhik Viewpoint.',
          'Stop at Chungthang, the confluence of Lachen Chu and Lachung Chu rivers.',
          'Arrive in the remote alpine village of Lachen (8,838 ft) by evening and check in to your hotel.',
          'Overnight stay in Lachen.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Lachen to Gurudongmar Lake (17,800 ft) | Transfer to Lachung',
        description: [
          'Wake up early around 4:00 AM and embark on an exhilarating drive towards sacred Gurudongmar Lake.',
          'Pass through the cold desert landscape of Thangu Valley and Chopta Valley.',
          'Witness the breathtaking turquoise waters of Gurudongmar Lake, surrounded by snow-capped peaks.',
          'Return to Lachen for lunch, check out, and drive towards the picturesque village of Lachung (8,610 ft).',
          'Check in to your hotel in Lachung and enjoy a peaceful evening by the river.',
          'Overnight stay in Lachung.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Excursion to Yumthang Valley (Valley of Flowers) | Optional Zero Point',
        description: [
          'Relish breakfast and head out to explore the stunning Yumthang Valley (11,800 ft).',
          'Walk across colorful rhododendron sanctuaries, alpine meadows, and hot sulfur springs.',
          'Optionally drive further up to Zero Point (Yumesamdong, 15,300 ft) where the road ends near snowfields.',
          'Return to Lachung by afternoon and spend the evening relaxing.',
          'Overnight stay in Lachung.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Lachung to Gangtok (120 km / 6 hrs)',
        description: [
          'Have breakfast, check out from Lachung, and begin your return drive down to Gangtok.',
          'Enjoy picturesque waterfall stops along the Teesta River valley.',
          'Arrive in Gangtok by late afternoon and check in to your hotel.',
          'Spend the evening relaxing or shopping for local Sikkimese handicrafts along MG Marg.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Gangtok to Zuluk via Old Silk Route (90 km / 4 hrs)',
        description: [
          'Enjoy breakfast, check out, and drive towards the historic Old Silk Route.',
          'Pass through Rongli permit checkpoint and drive through the dense pine forests of Padamchen.',
          'Arrive in the remote mountain hamlet of Zuluk (9,400 ft) and check in to your homestay.',
          'Witness the sunset over winding Himalayan valleys and experience the profound stillness of the mountains.',
          'Overnight stay in Zuluk.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Zuluk to Pelling via Thambi Viewpoint & Lungthung (160 km / 7 hrs)',
        description: [
          'Wake up early for sunrise at Thambi Viewpoint (11,200 ft), witnessing the 32 hairpin loops and Mt. Kanchenjunga in gold.',
          'Drive past Lungthung and descend into West Sikkim through Ravangla.',
          'Arrive in Pelling by late afternoon and check in to your resort.',
          'Spend a quiet evening taking in panoramic views of the Kanchenjunga range.',
          'Overnight stay in Pelling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Pelling Sightseeing & Skywalk | Transfer to Darjeeling (100 km / 4 hrs)',
        description: [
          'Enjoy breakfast and visit the Glass Skywalk at 7,000 ft beneath the monumental Chenrezig Statue.',
          'Visit the 17th-century Pemayangtse Monastery and take a short forest walk to Rabdentse Ruins.',
          'Drive towards Darjeeling through rolling tea estates like Happy Valley.',
          'Reach Darjeeling by evening, check in to your hotel, and stroll through Chowrasta.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Tiger Hill Sunrise & Full-Day Darjeeling Sightseeing',
        description: [
          'Depart early at 4:00 AM for Tiger Hill to watch the golden sunrise over Mt. Kanchenjunga and Mt. Everest.',
          'Stop at Batasia Loop and the Gorkha War Memorial on your return drive.',
          'Return for breakfast, then visit Himalayan Mountaineering Institute, Zoo, and Japanese Peace Pagoda.',
          'Optionally ride the historic Darjeeling Himalayan Toy Train.',
          'Spend your final evening enjoying local tea and cafe hopping along Mall Road.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 11,
        title: 'Darjeeling to Bagdogra / NJP | Departure',
        description: [
          'Savor breakfast overlooking misty hills and complete check-out formalities.',
          'Board your transfer back to Bagdogra Airport (IXB) or NJP Railway Station.',
          'Conclude your grand 11-day Sikkim, North Sikkim, Silk Route & Darjeeling expedition.',
          'Meals: Breakfast.'
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
    id: '28',
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
        title: 'Arrival at Bagdogra / NJP | Transfer to Gangtok (125 km / 5 hrs)',
        description: [
          'Meet our representative upon arrival at Bagdogra Airport (IXB) or NJP Railway Station.',
          'Embark on a scenic drive along the Teesta River towards Gangtok.',
          'Reach Gangtok by late afternoon and complete hotel check-in formalities.',
          'Spend the evening at leisure exploring MG Marg, sampling local street food and tea.',
          'Overnight stay in Gangtok.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Savor an early breakfast and head towards the sacred high-altitude glacial Tsomgo Lake (12,313 ft).',
          'Admire the serene lake with its changing hues, snow-covered mountains, and optional yak rides.',
          'Proceed further up to the revered Baba Harbhajan Singh Mandir (13,200 ft).',
          'Optionally visit the Indo-China border at Nathula Pass (14,140 ft, subject to permit & availability).',
          'Drive back to Gangtok by evening and relax at your hotel.',
          'Overnight stay in Gangtok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Zuluk via Old Silk Route (90 km / 4 hrs)',
        description: [
          'Enjoy breakfast, check out, and drive towards the historic Old Silk Route.',
          'Pass through Rongli permit checkpoint and drive through the dense pine forests of Padamchen.',
          'Arrive in the remote mountain hamlet of Zuluk (9,400 ft) and check in to your homestay.',
          'Witness the sunset over winding Himalayan valleys and experience the profound stillness of the mountains.',
          'Overnight stay in Zuluk.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Zuluk to Aritar via Thambi Viewpoint & Nathang Valley (45 km / 2 hrs)',
        description: [
          'Wake up before dawn and drive up to Thambi View Point (11,200 ft) for a golden sunrise over Mt. Kanchenjunga.',
          'Admire the famous 32 hairpin turns of the Silk Route snaking through the valley.',
          'Drive through Nathang Valley (13,500 ft), known as the "Ladakh of the East," and pass Lungthung and Eagle\'s Nest Bunker.',
          'Descend into the tranquil lakeside village of Aritar and check in to your stay.',
          'Spend a quiet evening taking in the village charm.',
          'Overnight stay in Aritar.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Aritar to Rishikhola | Riverside Retreat (20 km / 1 hr)',
        description: [
          'Enjoy breakfast and visit Lampokhari Lake (emerald boot-shaped lake) surrounded by pine trees.',
          'Visit the historic Aritar Monastery before checking out and driving towards Rishikhola.',
          'Descend into the secluded riverside valley of Rishikhola along the Sikkim-Bengal border.',
          'Check in to your eco-cottage right beside the rushing Rishi River.',
          'Spend the afternoon dipping your feet in the river, birdwatching, and relaxing in nature.',
          'Overnight stay in Rishikhola.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Rishikhola to Darjeeling | The Queen of Hills (80 km / 4 hrs)',
        description: [
          'Wake up to the soothing sounds of the river and enjoy a fresh riverside breakfast.',
          'Check out and begin your ascent towards Darjeeling through rolling tea gardens.',
          'Arrive in Darjeeling by afternoon and check in to your hotel.',
          'Spend the evening exploring Chowrasta, Mall Road, and local handicraft shops.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Tiger Hill Sunrise & Full-Day Darjeeling Sightseeing',
        description: [
          'Depart early at 4:00 AM for Tiger Hill to watch the golden sunrise over Mt. Kanchenjunga and Mt. Everest.',
          'Stop at Batasia Loop and the Gorkha War Memorial on your return drive.',
          'Return for breakfast, then visit Himalayan Mountaineering Institute, Zoo, and Japanese Peace Pagoda.',
          'Optionally ride the historic Darjeeling Himalayan Toy Train.',
          'Spend your final evening enjoying local tea and cafe hopping along Mall Road.',
          'Overnight stay in Darjeeling.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Darjeeling to Bagdogra / NJP | Departure',
        description: [
          'Savor breakfast with mountain views and complete check-out formalities.',
          'Board your transfer back to Bagdogra Airport (IXB) or NJP Railway Station.',
          'Conclude your offbeat Silk Route, Aritar, Rishikhola & Darjeeling vacation.',
          'Meals: Breakfast.'
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
    id: '29',
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
        title: 'Arrival in Leh | Acclimatization & Evening Market Walk',
        description: [
          'Arrive at Kushok Bakula Rimpochee Airport (Leh) with spectacular views over the snow-clad Himalayas.',
          'Meet our representative and transfer to your hotel in Leh.',
          'Check-in and rest for complete acclimatization to high altitude (3,500 m).',
          'Take a light evening stroll around Leh Main Bazaar and Tibetan market.',
          'Trip briefing and orientation session with your tour leader.',
          'Overnight in Leh.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Leh to Sham Valley Excursion | Sangam, Magnetic Hill & Hall of Fame',
        description: [
          'Morning drive towards Sham Valley for local sightseeing along the Indus River.',
          'Visit the peaceful Shanti Stupa for panoramic 360-degree views of Leh valley.',
          'Witness the dramatic Sangam – confluence of the emerald Indus and muddy Zanskar rivers.',
          'Experience the gravity-defying phenomenon at Magnetic Hill.',
          'Seek blessings at Gurudwara Pathar Sahib, dedicated to Guru Nanak Dev Ji.',
          'Visit the Hall of Fame War Memorial museum honoring brave Indian Army soldiers.',
          'Evening at leisure for cafe hopping and shopping in Leh market.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La & Diskit Monastery [125 km / 5-6 hrs]',
        description: [
          'Morning departure from Leh towards the stunning Nubra Valley.',
          'Scale the legendary Khardung La Pass (5,359 m / 17,582 ft) – among the world’s highest motorable roads.',
          'Descend into the scenic Shyok Valley to arrive at Diskit.',
          'Visit the 14th-century Diskit Monastery and marvel at the 106-foot Maitreya Buddha statue.',
          'Explore the cold desert sand dunes of Hunder.',
          'Enjoy double-humped Bactrian camel safaris and optional ATV rides across the white dunes.',
          'Check-in to your deluxe campsite/hotel in Nubra Valley.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Turtuk Village Excursion [200 km / 7-8 hrs]',
        description: [
          'Morning scenic ride along the Shyok River towards Turtuk Village.',
          'Explore India’s northernmost border village, steeped in unique Balti culture and traditions.',
          'Walk through ancient stone alleys, lush apricot orchards, and traditional wooden homes.',
          'Visit the historic Turtuk Yabgo Royal Palace and the Shyok War Memorial.',
          'Taste organic local apricots and walnuts while interacting with friendly locals.',
          'Return to your Nubra Valley hotel/camp by evening.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River Route [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Nubra Valley towards the iconic Pangong Tso.',
          'Ride along the offbeat Shyok River route through Agham and Shyok villages.',
          'Behold the breathtaking first view of Pangong Lake (4,350 m / 14,270 ft) changing colors from turquoise to deep blue.',
          'Walk along the shore of the world’s highest saltwater lake and visit the 3-Idiots movie point.',
          'Witness an unforgettable sunset over the shimmering Himalayan waters.',
          'Check-in to your lake-view deluxe cottages/camps for a cozy night under the stars.',
          'Overnight near Pangong Lake.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial [165 km / 8-9 hrs]',
        description: [
          'Witness a magical sunrise over the tranquil waters of Pangong Tso.',
          'Post-breakfast journey towards the remote astronomical hub of Hanle.',
          'Pass Chushul village and pay homage at the Rezang La War Memorial.',
          'Cross the Loma Bridge on the Indus River into the pristine Changthang Wildlife Sanctuary.',
          'Arrive in Hanle village, one of the world’s highest inhabited plateaus.',
          'Check-in to your traditional homestay and stargaze under India’s premier Dark Sky Reserve.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Frontier Excursion [200 km / 7-8 hrs]',
        description: [
          'Early morning expedition to conquer the highest motorable road on Earth.',
          'Ascend through Photi La Pass (5,524 m) across rugged, moon-like high-altitude desert.',
          'Summit Umling La Pass at an astounding 19,024 ft (5,640 m) – higher than Everest Base Camp.',
          'Celebrate the milestone achievement with group photographs at the iconic summit board.',
          'Ride down towards Demchok, the last Indian border outpost on the Indo-China LAC.',
          'Visit the historic 17th-century Hanle Monastery overlooking the vast valley.',
          'Return to your homestay in Hanle for a warm local dinner.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Tso Moriri Lake via Mahe Bridge [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Hanle towards the remote high-altitude gem, Tso Moriri.',
          'Ride across the pristine Changthang plateau via Mahe Bridge.',
          'Arrive at the spellbinding Tso Moriri Lake (4,522 m / 14,836 ft), surrounded by snow-capped peaks.',
          'Spot rare wildlife including Kiangs (Tibetan wild ass), Marmots, and migratory Black-necked Cranes.',
          'Walk along the serene shores of Karzok village.',
          'Check-in to your hotel/campsite overlooking the cobalt-blue lake.',
          'Overnight in Tso Moriri.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Tso Moriri to Leh via Puga Geothermal Valley & Chumathang [220 km / 6-7 hrs]',
        description: [
          'Post-breakfast ride from Tso Moriri back to Leh via Puga Valley and Chumathang.',
          'Witness the surreal geothermal landscape of Puga Valley with bubbling sulphur mud pools and hot geysers.',
          'Stop at Chumathang hot springs along the Indus River.',
          'Drive through the scenic Indus gorge passing Upshi, Karu, and Thiksey.',
          'Arrive in Leh by late afternoon and check-in to your hotel.',
          'Spend your final evening shopping for Pashmina shawls, souvenirs, and dining at local cafes.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Departure from Leh | Trip Concludes',
        description: [
          'Post-breakfast check-out from your Leh hotel.',
          'Transfer to Kushok Bakula Rimpochee Airport for your return flight.',
          'Trip concludes with lifelong memories of the ultimate Leh-Ladakh, Umling La & Changthang grand expedition.',
          'Meals: Breakfast.'
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
    id: '30',
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
        title: 'Arrival in Leh | Acclimatization & Evening Market Walk',
        description: [
          'Arrive at Leh Airport with stunning aerial views of the snow-capped Himalayan ranges.',
          'Meet our tour executive and transfer to your hotel in Leh.',
          'Check-in, relax, and rest for full acclimatization to high altitude (3,500 m).',
          'Take a gentle evening stroll around Leh Main Bazaar and Tibetan market.',
          'Briefing and orientation session with your trip leader.',
          'Overnight in Leh.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Leh to Sham Valley Excursion | Sangam, Magnetic Hill & Hall of Fame',
        description: [
          'Morning ride towards Sham Valley along the Indus River.',
          'Visit the peaceful Shanti Stupa for panoramic 360-degree views of Leh valley.',
          'Witness the dramatic Sangam – confluence of the emerald Indus and muddy Zanskar rivers.',
          'Experience the gravity-defying phenomenon at Magnetic Hill.',
          'Seek blessings at Gurudwara Pathar Sahib, dedicated to Guru Nanak Dev Ji.',
          'Visit the Hall of Fame War Memorial museum honoring the Indian Army martyrs.',
          'Evening free for cafe hopping and shopping in Leh market.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La & Diskit Monastery [125 km / 5-6 hrs]',
        description: [
          'Morning departure from Leh towards the magical Nubra Valley.',
          'Scale the legendary Khardung La Pass (5,359 m / 17,582 ft).',
          'Descend into the scenic Shyok Valley to arrive at Diskit.',
          'Visit the 14th-century Diskit Monastery and the towering 106-foot Maitreya Buddha.',
          'Ride to the cold desert sand dunes of Hunder.',
          'Enjoy double-humped Bactrian camel safaris and ATV rides across the white dunes.',
          'Check-in to your deluxe campsite/hotel in Nubra Valley.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Turtuk Village Excursion [200 km / 7-8 hrs]',
        description: [
          'Morning scenic ride along the Shyok River towards Turtuk Village.',
          'Explore India’s northernmost frontier village, steeped in unique Balti heritage.',
          'Walk through stone alleys, apricot orchards, and traditional wooden homes.',
          'Visit the historic Turtuk Yabgo Royal Palace and Shyok War Memorial.',
          'Taste organic local apricots and walnuts while interacting with friendly locals.',
          'Return to your Nubra Valley hotel/camp by evening.',
          'Overnight in Nubra Valley.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River Route [160 km / 5-6 hrs]',
        description: [
          'Morning departure from Nubra Valley towards the iconic Pangong Tso.',
          'Ride along the offbeat Shyok River route through Agham and Shyok villages.',
          'First glimpse of the magnificent, multi-hued Pangong Lake (4,350 m / 14,270 ft).',
          'Walk along the shore of the world’s highest saltwater lake and visit the 3-Idiots movie point.',
          'Witness a breathtaking sunset painting the lake in shades of sapphire and amber.',
          'Check-in to lake-view deluxe cottages/camps.',
          'Overnight near Pangong Lake.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial [165 km / 8-9 hrs]',
        description: [
          'Witness a magical sunrise over the tranquil blue waters of Pangong Tso.',
          'Post-breakfast journey towards the remote astronomical hub of Hanle.',
          'Pass Chushul village and pay homage at the Rezang La War Memorial.',
          'Cross the Loma Bridge over the Indus River into the pristine Changthang sanctuary.',
          'Arrive in Hanle village, one of the world’s highest inhabited plateaus.',
          'Check-in to your traditional homestay and stargaze under India’s premier Dark Sky Reserve.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Frontier Excursion [200 km / 7-8 hrs]',
        description: [
          'Early morning expedition to conquer the highest motorable road on Earth.',
          'Ascend through Photi La Pass (5,524 m) across raw, lunar-like high-altitude desert.',
          'Summit Umling La Pass at a record-shattering 19,024 ft (5,640 m).',
          'Celebrate the milestone achievement with photos at the iconic summit marker.',
          'Ride down towards Demchok, the last Indian border outpost on the Indo-China frontier.',
          'Visit the historic 17th-century Hanle Monastery overlooking the valley.',
          'Return to your homestay in Hanle for a warm local dinner.',
          'Overnight in Hanle.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Leh via Tso Moriri Lake & Chumathang [289 km / 7-8 hrs]',
        description: [
          'Morning departure from Hanle towards the pristine Tso Moriri Lake.',
          'Ride via Loma Bridge and Mahe along the turquoise Indus and Chumathang hot springs.',
          'Arrive at the majestic Tso Moriri (4,522 m / 14,836 ft), India’s highest and largest saltwater lake.',
          'Spot rare Himalayan wildlife including Kiangs, Marmots, and migratory Black-necked Cranes.',
          'Continue the scenic drive past Upshi, Karu, and Thiksey to arrive back in Leh.',
          'Check-in to your hotel in Leh, relax, and explore Leh Main Bazaar for souvenirs and cafes.',
          'Overnight in Leh.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Departure from Leh | Trip Concludes',
        description: [
          'Post-breakfast check-out from your Leh hotel.',
          'Transfer to Kushok Bakula Rimpochee Airport for your return flight.',
          'Trip concludes with unforgettable memories of the Leh-Ladakh, Umling La & Changthang expedition.',
          'Meals: Breakfast.'
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
    id: '31',
    title: '7 Days Exclusive Thailand Full Moon Party Group Tour',
    slug: '7-days-exclusive-thailand-full-moon-party-group-tour',
    image: '/images/thailand-full-moon-party.png',
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
        title: 'Arrival in Phuket | Transfer to Krabi & Leisure',
        description: [
          'Arrive at Phuket International Airport (HKT) and complete immigration formalities.',
          'Meet our representative and board your scenic transfer to Krabi.',
          'Check in to your hotel in Krabi and freshen up after your flight.',
          'Spend the evening at leisure relaxing at Ao Nang Beach or exploring local night markets.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4 Islands Tour by Longtail Boat with Beach Lunch',
        description: [
          'Enjoy breakfast at the hotel and transfer to the pier for your island hopping adventure.',
          'Board a traditional longtail boat to explore Phra Nang Cave Beach, Tup Island, Poda Island, and Chicken Island.',
          'Swim and snorkel in crystal-clear waters, witness sandbars during low tide, and admire limestone cliffs.',
          'Relish a delicious local lunch on the beach at Poda Island.',
          'Return to the mainland in the late afternoon and enjoy evening cafe hopping.',
          'Overnight stay in Krabi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Koh Samui | World-Famous Koh Phangan Full Moon Party',
        description: [
          'Have breakfast, check out from Krabi, and transfer by coach and ferry to tropical Koh Samui.',
          'Check in to your hotel in Koh Samui, freshen up, and get ready for the party of a lifetime.',
          'Board your evening ferry transfer to Haad Rin Beach on Koh Phangan.',
          'Dance the night away under the full moon with world-class DJs, neon body paint, and beachside music.',
          'Enjoy the legendary Full Moon Party till dawn.',
          'Overnight Full Moon Party experience at Koh Phangan.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Koh Phangan to Koh Samui | Beach Fire Show & Nightlife',
        description: [
          'Board your return morning ferry back to Koh Samui and transfer to your hotel.',
          'Relish a hearty breakfast and rest after the high-energy party night.',
          'Spend a leisurely afternoon lounging by the pool or enjoying a traditional Thai massage.',
          'In the evening, head to the beach club to witness an electrifying Thai Beach Fire Show.',
          'Sip tropical cocktails and enjoy Samui’s vibrant seaside nightlife.',
          'Overnight stay in Koh Samui.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Koh Samui to Phuket via Donsak Pier',
        description: [
          'Enjoy breakfast, check out from your hotel, and board the ferry to Donsak Pier on the mainland.',
          'Board your comfortable transfer and drive across scenic landscapes to Phuket (4–5 hrs).',
          'Arrive in Phuket, check in to your hotel, and unwind.',
          'Spend the evening exploring Patong Beach, Bangla Road nightlife, or local seafood stalls.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Full-Day Phi Phi Islands Speedboat Tour with Buffet Lunch',
        description: [
          'Wake up early, enjoy breakfast, and transfer to the marina.',
          'Board your high-speed boat to the world-famous Phi Phi Islands archipelago.',
          'Cruise past iconic Maya Bay, Loh Samah Bay, Viking Cave, and Monkey Beach.',
          'Savor a scrumptious buffet lunch at a beachfront restaurant on Phi Phi Don.',
          'Snorkel among vibrant coral reefs and exotic marine life at Koh Khai Nok.',
          'Return to Phuket by evening for your farewell night.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 7,
        title: 'Phuket Airport Transfer | Departure',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your transfer to Phuket International Airport (HKT) for your return flight.',
          'Conclude your epic Thailand Full Moon Party vacation with unforgettable memories.',
          'Meals: Breakfast.'
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
    id: '32',
    title: 'Exclusive 7 Nights 8 Days Thailand Honeymoon Package – A Perfect Romantic Getaway',
    slug: 'exclusive-7-nights-8-days-thailand-honeymoon-package',
    image: '/images/thailand-honeymoon.png',
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
        title: 'Arrival in Phuket | Transfer to Krabi & Leisure',
        description: [
          'Arrive at Phuket International Airport (HKT) and meet your representative.',
          'Enjoy a scenic 3-hour private transfer to Krabi along tropical coastlines.',
          'Check in to your romantic resort in Krabi and freshen up.',
          'Spend a leisurely evening strolling along Ao Nang beach and enjoying sunset cocktails.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4 Islands Speedboat Tour with Beachside Lunch',
        description: [
          'Savor breakfast at your resort before heading to the pier.',
          'Board a speedboat to explore Phra Nang Cave Beach, Tup Island, Chicken Island, and Poda Island.',
          'Swim and snorkel in emerald waters and walk along the scenic sandbar during low tide.',
          'Enjoy a romantic lunch on the white sandy beaches of Poda Island.',
          'Return to your resort by late afternoon to relax.',
          'Overnight stay in Krabi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket | Siam Niramit / Cabaret Show',
        description: [
          'Enjoy breakfast, check out from Krabi, and take your scenic private transfer to Phuket.',
          'Arrive in Phuket and check in to your deluxe honeymoon resort.',
          'Spend the afternoon relaxing by the pool or enjoying couples’ spa treatments.',
          'In the evening, watch the dazzling Siam Cabaret Show featuring stunning costumes and stage performances.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Islands Speedboat Excursion with Buffet Lunch',
        description: [
          'Wake up early and enjoy breakfast before transferring to the marina.',
          'Cruise on a high-speed boat to the stunning Phi Phi Islands.',
          'Visit world-famous Maya Bay, Viking Cave, and pristine Monkey Beach.',
          'Relish a delicious buffet lunch at a beachfront restaurant on Phi Phi Don.',
          'Enjoy snorkeling among colorful reefs and turquoise waters at Khai Island.',
          'Return to Phuket in the evening for dinner at your leisure.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 5,
        title: 'Phuket City & Cultural Sightseeing Tour',
        description: [
          'Have breakfast at the resort and set out for a guided Phuket city tour.',
          'Admire sweeping coastal panoramas from Karon Viewpoint and Promthep Cape.',
          'Visit the revered Wat Chalong Temple and marvel at the 45-meter Big Buddha statue.',
          'Walk through Old Phuket Town admiring Sino-Portuguese heritage architecture.',
          'Spend a romantic evening at leisure watching the sunset over Patong Beach.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Flight to Bangkok | Luxury Chao Phraya River Dinner Cruise',
        description: [
          'Enjoy breakfast, check out from Phuket, and transfer to Phuket Airport for your flight to Bangkok.',
          'Arrive at Bangkok Airport, meet our representative, and transfer to your luxury hotel.',
          'Check in and freshen up before your evening romantic experience.',
          'Board a luxury cruise on the Chao Phraya River for an exquisite buffet dinner under the illuminated Bangkok skyline.',
          'Enjoy live music, traditional Thai dance, and iconic views of Wat Arun lit up at night.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Bangkok City & Iconic Temple Tour',
        description: [
          'Relish breakfast and embark on a guided Bangkok city and heritage tour.',
          'Visit the Temple of the Golden Buddha (Wat Traimit) and the Temple of the Reclining Buddha (Wat Pho).',
          'Stop at the Gems Gallery for authentic Thai gemstones and jewelry.',
          'Spend the afternoon and evening shopping at ICONSIAM or exploring vibrant night markets.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Bangkok Departure | Farewell Thailand',
        description: [
          'Savor breakfast at the hotel and complete check-out formalities.',
          'Board your private transfer to Bangkok Airport (BKK/DMK) for your flight home.',
          'Conclude your romantic Thailand honeymoon with unforgettable memories.',
          'Meals: Breakfast.'
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
    id: '33',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket Thailand Romantic Escape',
    slug: 'wanderphilia-exclusive-5-nights-6-days-krabi-phuket-thailand-romantic-escape',
    image: '/images/thailand-romantic-escape.png',
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
        title: 'Arrival in Phuket | Transfer to Krabi & Leisure',
        description: [
          'Arrive at Phuket International Airport (HKT) and meet our representative.',
          'Board your scenic private transfer to Krabi (approx. 3 hrs).',
          'Check in to your romantic resort in Krabi and freshen up.',
          'Spend a relaxed evening walking along Ao Nang beach and taking in the tropical sea breeze.',
          'Overnight stay in Krabi.'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4 Islands Speedboat Tour with Beachside Lunch',
        description: [
          'Enjoy breakfast at your resort before heading to the pier.',
          'Board a speedboat to explore Phra Nang Cave Beach, Tup Island, Chicken Island, and Poda Island.',
          'Swim, snorkel in turquoise waters, and walk along the scenic sandbar during low tide.',
          'Savor a delicious picnic lunch on the sandy shores of Poda Island.',
          'Return to your resort by late afternoon to relax.',
          'Overnight stay in Krabi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket | Siam Cabaret Show',
        description: [
          'Savor breakfast, check out from Krabi, and take your private transfer to Phuket.',
          'Arrive in Phuket, check in to your deluxe hotel, and relax.',
          'In the evening, watch the dazzling Siam Cabaret Show with spectacular choreography, music, and vibrant costumes.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Islands Speedboat Excursion with Buffet Lunch',
        description: [
          'Wake up early and enjoy breakfast before transferring to the marina.',
          'Board your speedboat to explore the world-famous Phi Phi Islands.',
          'Cruise past iconic Maya Bay, Viking Cave, and pristine Monkey Beach.',
          'Enjoy a buffet lunch at a beachfront restaurant on Phi Phi Don.',
          'Snorkel among colorful coral reefs and marine life at Khai Island.',
          'Return to Phuket in the evening for leisure.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 5,
        title: 'Phuket City & Cultural Sightseeing Tour',
        description: [
          'Have breakfast at the hotel and embark on a guided Phuket city tour.',
          'Admire coastal panoramas from Karon Viewpoint and Promthep Cape.',
          'Visit the historic Wat Chalong Temple and the monumental Big Buddha statue.',
          'Explore the charming heritage shophouses of Old Phuket Town.',
          'Spend your final romantic evening at leisure exploring Patong night markets.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Phuket Airport Transfer | Departure',
        description: [
          'Savor breakfast at the hotel and complete check-out formalities.',
          'Board your private transfer to Phuket International Airport (HKT) for your onward flight.',
          'Conclude your romantic Krabi & Phuket escape with beautiful memories.',
          'Meals: Breakfast.'
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
    id: '34',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Thailand Phuket Bangkok Couple Leisure Getaway',
    slug: 'wanderphilia-exclusive-5-nights-6-days-thailand-phuket-bangkok-couple-leisure-getaway',
    image: '/images/thailand-couple-leisure.png',
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
          'Arrive at Phuket International Airport, complete immigration, and meet our local tour representative.',
          'Board your private transfer and drive through scenic coastal roads to your Phuket hotel.',
          'Check in to your hotel and unwind after your journey.',
          'In the evening, attend the world-renowned Simon Cabaret Show featuring glamorous musical acts and stunning sets.',
          'Overnight stay in Phuket.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Phi Phi Island Tour.',
        description: [
          'Enjoy a delightful tropical breakfast at the hotel before morning pickup.',
          'Transfer to the pier and board a high-speed speedboat towards the world-famous Phi Phi Islands.',
          'Cruise across azure waters and visit iconic Maya Bay, surrounded by soaring limestone cliffs.',
          'Discover hidden sea caves and take romantic beachside strolls along soft white sands of Monkey Beach.',
          'Relish a delicious buffet lunch on the island and enjoy swimming and snorkeling in turquoise waters.',
          'Board your speedboat back to the mainland pier and transfer to your hotel.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Savor breakfast at the hotel and set out on a comprehensive guided Phuket city tour.',
          'Drive up to Karon Viewpoint to take in panoramic vistas of Kata Noi, Kata, and Karon beaches.',
          'Visit the revered Wat Chalong Temple and marvel at the colossal 45-meter Big Buddha statue.',
          'Spend the evening at leisure exploring Patong nightlife, vibrant street markets, or relaxing on the beach.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Phuket to Bangkok. Evening Dinner Cruise.',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Transfer to Phuket Airport and board your scheduled domestic flight to Bangkok.',
          'Arrive in Bangkok, meet your representative, and transfer to your hotel for check-in.',
          'In the evening, embark on a luxury Chao Phraya River Dinner Cruise featuring live entertainment.',
          'Savor a lavish international buffet dinner while admiring Bangkok’s illuminated riverfront palaces and temples.',
          'Transfer back to your hotel after the cruise.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Bangkok City Tour and Temple Tour.',
        description: [
          'Wake up to breakfast at the hotel and depart for a guided Bangkok city & temple tour.',
          'Visit Wat Traimit (Temple of the Golden Buddha) and Wat Phra Kaew (Temple of the Emerald Buddha).',
          'Explore the world-famous Gems Gallery to witness artisanal Thai jewelry craftsmanship.',
          'Spend the evening exploring vibrant night bazaars, street food stalls, or luxury shopping malls at leisure.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Enjoy breakfast at the hotel and pack your bags for departure.',
          'Complete check-out formalities and board your transfer to Suvarnabhumi / Don Mueang International Airport.',
          'Board your flight back home carrying cherished memories of your romantic Thailand getaway.',
          'Meals: Breakfast.'
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
    id: '35',
    title: 'Wanderphilia Exclusive 8 Nights 9 Days Whole Of Thailand Bangkok Pattaya Phuket Perfect Couple Trip',
    slug: 'wanderphilia-exclusive-8-nights-9-days-whole-of-thailand-bangkok-pattaya-phuket-perfect-couple-trip',
    image: '/images/thailand-whole-couple.png',
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
          'Arrive at Bangkok International Airport, complete customs formalities, and meet our tour representative.',
          'Board your comfortable transfer for a scenic 2-hour drive along the eastern seaboard to Pattaya.',
          'Check in to your Pattaya hotel and relax after your journey.',
          'In the evening, head out for the world-famous Alcazar Cabaret Show featuring 17 grand cultural acts, dazzling costumes, and state-of-the-art light and sound.',
          'Return to your hotel after the spectacular performance.',
          'Overnight stay in Pattaya.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Enjoy an energizing breakfast at the hotel before morning pickup.',
          'Transfer to Pattaya beach pier and board a high-speed speedboat to Coral Island (Koh Larn).',
          'Arrive at Tawaen Beach, sink your feet into powdery white sand, and enjoy swimming in crystal-clear waters.',
          'Optionally participate in thrilling watersports like parasailing, jet skiing, banana boat rides, or sea walking.',
          'Savor a delicious Indian lunch before cruising back to the Pattaya mainland.',
          'Spend your evening exploring Pattaya Walking Street with its energetic night markets, live music, and dining hubs.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Village Tour.',
        description: [
          'Relish breakfast at your hotel and board your transfer to Nong Nooch Tropical Botanical Garden.',
          'Explore landscaped themed gardens including the French Garden, Stonehenge Garden, and Dinosaur Valley.',
          'Watch captivating Thai cultural dance performances, martial arts demonstrations, and the famous elephant show.',
          'Enjoy a leisurely paddle boat ride on the lake or stroll through the colorful orchid nursery.',
          'Return to your hotel in Pattaya for an evening at leisure.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. City Tour and Evening Dinner Cruise.',
        description: [
          'Have breakfast at the hotel, check out, and board your transfer to Bangkok.',
          'Upon arrival, embark on a guided temple tour visiting Wat Traimit (Golden Buddha) and Wat Pho (Reclining Buddha).',
          'Visit the renowned Gems Gallery to witness Thai gemstone artistry.',
          'Check in to your Bangkok hotel and relax.',
          'In the evening, board a luxury Chao Phraya River Dinner Cruise featuring live entertainment and an international buffet.',
          'Admire illuminated Bangkok landmarks like Wat Arun and the Grand Palace from the open-air deck.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Enjoy breakfast at the hotel and set off for an action-packed day at Safari World and Marine Park.',
          'Drive through the open-air Safari Park to spot lions, zebras, giraffes, and rhinos roaming freely.',
          'Proceed to the Marine Park to witness exciting live shows including Dolphin Shows, Sea Lion shows, and the Hollywood Stunt Show.',
          'Relish a delicious buffet lunch served within the park complex.',
          'Visit the bird aviary and feed giraffes at the elevated feeding terrace.',
          'Return to your Bangkok hotel in the late afternoon for evening leisure.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Bangkok to Phuket. Cabaret Show in the evening.',
        description: [
          'Have breakfast at the hotel, check out, and transfer to the airport for your flight to Phuket.',
          'Arrive at Phuket International Airport, meet your representative, and transfer to your Phuket hotel.',
          'Complete check-in formalities and spend the afternoon unwinding.',
          'In the evening, attend the dazzling Simon Cabaret Show, Phuket’s premier transvestite theatrical performance.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Phi Phi Island Tour.',
        description: [
          'Enjoy breakfast at the hotel and transfer to the pier for your Phi Phi Islands speedboat excursion.',
          'Glide across the turquoise Andaman Sea towards Maya Bay, Loh Samah Bay, and Viking Cave.',
          'Visit Monkey Beach to spot playful wild macaques on the shore.',
          'Swim, snorkel among vibrant coral reefs, and savor a buffet lunch at Phi Phi Don.',
          'Return by speedboat to Phuket and transfer back to your hotel.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 8,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Savor breakfast at the hotel and set out on a guided sightseeing tour across Phuket.',
          'Take in sweeping panoramic views from Karon Viewpoint and visit the iconic 45m-tall Big Buddha.',
          'Explore the sacred Wat Chalong Temple and marvel at Sino-Portuguese heritage architecture in Old Phuket Town.',
          'Spend the evening relaxing on Patong Beach or exploring Bangla Road and night markets.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Enjoy your final breakfast at the hotel and pack your luggage.',
          'Complete check-out and board your scheduled transfer to Phuket International Airport.',
          'Board your flight back home filled with unforgettable memories of your comprehensive Thailand journey.',
          'Meals: Breakfast.'
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
    id: '36',
    title: 'Wanderphilia Exclusive 6 Nights 7 Days Thailand Bangkok Pattaya Perfect Family Getaway',
    slug: 'wanderphilia-exclusive-6-nights-7-days-thailand-bangkok-pattaya-perfect-family-getaway',
    image: '/images/thailand-family-getaway.png',
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
          'Arrive at Bangkok Airport, complete immigration formalities, and meet our representative.',
          'Board your private transfer and drive 2 hours through scenic coastal highways to Pattaya.',
          'Check in to your Pattaya hotel and unwind after your journey.',
          'In the evening, attend the world-famous Alcazar Cabaret Show with 17 spectacular cultural acts, dazzling stage designs, and grand costumes.',
          'Overnight stay in Pattaya.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Enjoy an early breakfast at the hotel before morning pickup.',
          'Transfer to Pattaya beach pier and board a speedboat to Coral Island (Koh Larn).',
          'Arrive at Tawaen Beach to relax on white sands or swim in clear turquoise waters.',
          'Optionally participate in exciting watersports like parasailing, sea walking, or banana boat rides.',
          'Savor a delicious Indian lunch on the island before returning by speedboat to the mainland.',
          'Spend the evening exploring Pattaya’s vibrant walking street, beach promenade, and night markets.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Village Tour.',
        description: [
          'Relish a hearty breakfast at your hotel and board transfers to Nong Nooch Tropical Botanical Garden.',
          'Explore world-class landscaped gardens including the French Garden, Stonehenge Garden, and Dinosaur Valley.',
          'Watch captivating Thai cultural dance performances, traditional martial arts, and the famous elephant talent show.',
          'Enjoy paddle boating on the scenic lake or stroll through colorful orchid and bonsai exhibits.',
          'Return to Pattaya in the late afternoon with the evening free at leisure.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. City Tour and Evening Dinner Cruise.',
        description: [
          'Have breakfast at the hotel, check out, and board your comfortable transfer to Bangkok.',
          'Upon arrival in Bangkok, embark on a guided temple tour visiting Wat Traimit (Golden Buddha) and Wat Pho (Reclining Buddha).',
          'Visit the renowned Gems Gallery to browse exquisite handcrafted jewelry.',
          'Check in to your Bangkok hotel and relax.',
          'In the evening, board a luxury Chao Phraya River Dinner Cruise featuring live entertainment and an international buffet.',
          'Admire illuminated Bangkok landmarks along the riverfront under the night sky.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Enjoy breakfast at the hotel and set off for an exciting family day at Safari World and Marine Park.',
          'Drive through the open Safari Park and witness lions, tigers, zebras, and giraffes in open habitats.',
          'Explore Marine Park to watch thrilling live shows including Dolphin Shows, Sea Lion spectacles, and the Hollywood Stunt Show.',
          'Relish a delicious buffet lunch inside the park complex.',
          'Hand-feed giraffes at the elevated feeding platform and explore the tropical aviary.',
          'Return to your Bangkok hotel in the evening.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Full-Day Tour of Dream World.',
        description: [
          'Have breakfast at the hotel and transfer to Dream World Amusement Park for a thrilling day with family.',
          'Experience adrenaline-pumping rides including Sky Coaster, Speed Mouse, Grand Canyon, Super Splash, and Space Mountain.',
          'Meet beloved cartoon characters in fantasy zones and explore the magical Snow Town with sub-zero snow slides.',
          'Enjoy a delightful buffet lunch at the park restaurant.',
          'Cool off on family-friendly water attractions and canyon splashes before transferring back to the hotel.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Enjoy breakfast at the hotel and pack your bags.',
          'Complete check-out formalities and board your scheduled transfer to Bangkok Airport.',
          'Depart for home carrying wonderful memories of your fun-filled Thailand family vacation.',
          'Meals: Breakfast.'
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
    id: '37',
    title: 'Wanderphilia Exclusive 4 Nights 5 Days Thailand Exclusive Phuket Perfect Family Leisure Trip',
    slug: 'wanderphilia-exclusive-4-nights-5-days-thailand-exclusive-phuket-perfect-family-leisure-trip',
    image: '/images/thailand-phuket-family.png',
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
          'Arrive at Phuket International Airport, complete customs and immigration, and meet our tour representative.',
          'Board your private transfer and drive to your hotel in Phuket.',
          'Check in to your hotel and unwind in the tropical setting.',
          'Spend the rest of the day at leisure exploring local cafes or relaxing by the beach.',
          'Overnight stay in Phuket.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Enjoy a leisurely breakfast at your hotel before setting out on a guided Phuket city tour.',
          'Visit Karon Viewpoint for sweeping panoramic views over Kata Noi, Kata, and Karon beaches.',
          'Explore the sacred Wat Chalong Temple and marvel at the 45-meter-tall Big Buddha on Nakkerd Hill.',
          'Admire vibrant Sino-Portuguese heritage architecture and colorful murals in Old Phuket Town.',
          'Visit Promthep Cape, Phuket’s southernmost viewpoint, famous for stunning ocean scenery.',
          'Spend the evening relaxing at Patong or exploring night markets.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Phi Phi Island Tour with Local Lunch',
        description: [
          'Have breakfast at the hotel and transfer to the pier for your Phi Phi Islands speedboat excursion.',
          'Cruise through crystal-clear waters to Maya Bay, surrounded by towering limestone cliffs.',
          'Visit Viking Cave, Loh Samah Bay, and Monkey Beach to observe playful monkeys along the sand.',
          'Relish a delicious buffet lunch on Phi Phi Don Island.',
          'Swim and snorkel among colorful coral reefs and exotic marine life before returning by speedboat to the pier.',
          'Transfer back to your hotel for an evening at leisure.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Visit Tiger Kingdom (Medium Tiger Zone). Evening at Leisure.',
        description: [
          'Savor breakfast at the hotel and depart for a thrilling visit to Tiger Kingdom Phuket.',
          'Enter the Medium Tiger Zone under professional handler guidance to observe, pet, and take memorable photos with majestic big cats.',
          'Learn about tiger conservation initiatives and captive care standards.',
          'Browse the on-site souvenir shop and relax at the garden cafe.',
          'Return to your hotel with the remainder of the day free for beach activities or shopping.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Departure. Take back a lot of happy memories.',
        description: [
          'Enjoy breakfast at the hotel and pack your luggage.',
          'Complete check-out formalities and board your scheduled transfer to Phuket International Airport.',
          'Depart for home carrying wonderful tropical memories of your Phuket family holiday.',
          'Meals: Breakfast.'
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
    id: '38',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Thailand Bangkok Pattaya Relaxed Family Trip',
    slug: 'wanderphilia-exclusive-5-nights-6-days-thailand-bangkok-pattaya-relaxed-family-trip',
    image: '/images/thailand-bangkok-pattaya-family.png',
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
          'Arrive at Bangkok Airport, complete customs and immigration, and meet our tour representative.',
          'Board your private transfer and enjoy a scenic 2-hour drive to the vibrant coastal resort city of Pattaya.',
          'Check in to your Pattaya hotel and relax after your journey.',
          'Spend the evening at leisure exploring local cafes, Pattaya beach, or relaxing at the hotel.',
          'Overnight stay in Pattaya.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Tour. Spend the Evening at Pattaya Night Street.',
        description: [
          'Enjoy breakfast at the hotel and transfer to Pattaya pier.',
          'Board a high-speed speedboat and cruise across turquoise waters to Coral Island (Koh Larn).',
          'Relax on the sandy shores of Tawaen Beach or swim in clear emerald waters.',
          'Optionally participate in thrilling watersports including parasailing, jet skiing, and sea walking.',
          'Savor a delicious Indian lunch before returning by speedboat to the mainland.',
          'Spend the evening exploring Pattaya’s bustling walking street and night bazaar.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Day at leisure (Free Day to Explore the city)',
        description: [
          'Wake up to a leisurely breakfast at the hotel with the entire day free at your own pace.',
          'Optionally visit iconic landmarks like the Big Buddha Temple (Wat Phra Yai) or the Sanctuary of Truth.',
          'Relax by the hotel swimming pool or indulge in shopping at Central Festival Mall.',
          'In the evening, optionally attend the famous Alcazar Show or explore lively local eateries.',
          'Overnight stay in Pattaya.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok. En route Bangkok City Tour.',
        description: [
          'Have breakfast at the hotel, complete check-out, and board your transfer to Bangkok.',
          'Upon arrival, embark on a city tour visiting Wat Traimit (Golden Buddha) and Wat Pho (Reclining Buddha).',
          'Visit the World Gems Collection gallery to see handcrafted jewelry and gemstone exhibits.',
          'Check in to your Bangkok hotel and enjoy the rest of the day exploring the city at leisure.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Full Day at the Safari World and Marine Park.',
        description: [
          'Enjoy breakfast at the hotel and depart for a full-day adventure at Safari World & Marine Park.',
          'Take a safari drive through open landscapes to see zebras, giraffes, lions, and exotic African wildlife.',
          'Watch entertaining marine shows including the Dolphin Show, Sea Lion Show, and stunt performances.',
          'Relish a delicious buffet lunch served within the park.',
          'Visit the tropical bird aviary and feed giraffes from the raised observation terrace.',
          'Transfer back to your Bangkok hotel in the late afternoon.',
          'Overnight stay in Bangkok.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Departure. Take back a lot of happy memories.',
        description: [
          'Enjoy breakfast at the hotel and pack your bags.',
          'Complete check-out formalities and board your transfer to Bangkok Airport.',
          'Board your flight back home with wonderful memories of your relaxed Thailand family holiday.',
          'Meals: Breakfast.'
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
    id: '39',
    title: 'Wanderphilia Exclusive 5 Nights 6 Days Krabi Phuket Thailand Romantic Escape',
    slug: 'wanderphilia-exclusive-6-nights-7-days-krabi-phuket-thailand-romantic-escape',
    image: '/images/thailand-krabi-phuket-romantic.png',
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
          'Arrive at Phuket International Airport, complete customs and immigration, and meet our representative.',
          'Board your comfortable air-conditioned transfer for a scenic 3-hour drive along the Andaman coast to Krabi.',
          'Check in to your resort in Krabi and unwind after your journey.',
          'Spend the evening at leisure strolling along Ao Nang beach or enjoying a seaside cafe.',
          'Overnight stay in Krabi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: '4 Island Tour by Speed Boat.',
        description: [
          'Enjoy breakfast at the resort and transfer to the pier for your Krabi 4 Islands speedboat tour.',
          'Visit Phra Nang Cave Beach with its Princess Cave shrine and towering limestone cliffs.',
          'Walk along the famous sandbar connecting Tup Island and Mor Island at low tide.',
          'Admire Chicken Island’s unique rock formation and snorkel in vibrant coral reefs.',
          'Relax and enjoy a packed picnic lunch on the pristine white sands of Poda Island.',
          'Return by speedboat to the pier and transfer back to your resort.',
          'Overnight stay in Krabi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Krabi Half Day Morning City Tour. Evening at leisure.',
        description: [
          'Savor breakfast at the resort and embark on a guided morning city tour of Krabi.',
          'Admire views of Khao Khanab Nam limestone peaks rising over the Krabi River.',
          'Stop at the iconic Giant Mud Crabs sculpture along the mangrove waterfront for photos.',
          'Visit Wat Sai Thai with its historic 150-year-old reclining Buddha under a limestone cliff.',
          'Visit the revered Tiger Cave Temple (Wat Tham Suea) nestled within lush ancient rainforests.',
          'Return to your resort and enjoy the afternoon and evening at leisure.',
          'Overnight stay in Krabi.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Transfer from Krabi to Phuket. Day at leisure.',
        description: [
          'Enjoy breakfast at the resort, check out, and board your transfer to Phuket.',
          'Enjoy the scenic 2-to-3-hour overland drive across southern Thailand’s tropical countryside.',
          'Arrive in Phuket, check in to your hotel, and relax.',
          'Spend the rest of the day exploring Phuket’s beaches or relaxing by the pool.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Phi Phi Island Tour.',
        description: [
          'Enjoy breakfast at the hotel and transfer to the pier for your Phi Phi Islands speedboat excursion.',
          'Cruise to Maya Bay, Viking Cave, and Loh Samah Bay surrounded by sheer karst cliffs.',
          'Stroll along Monkey Beach and observe wild monkeys in their natural coastal habitat.',
          'Relish a delicious buffet lunch at Phi Phi Don Island.',
          'Swim and snorkel in warm crystal-clear waters before returning to the Phuket mainland.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Phuket City Tour. Evening at Leisure.',
        description: [
          'Savor breakfast at the hotel and depart for a guided Phuket highlights tour.',
          'Take in panoramic ocean views from Karon Viewpoint and visit the majestic Big Buddha.',
          'Visit the historic Wat Chalong Temple and admire Sino-Portuguese heritage buildings in Old Phuket Town.',
          'Spend your final evening shopping for souvenirs or enjoying Patong’s lively nightlife.',
          'Overnight stay in Phuket.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Departure. Take back a lot of romantic memories.',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your scheduled transfer to Phuket International Airport.',
          'Depart for home carrying unforgettable romantic memories of your Krabi and Phuket escape.',
          'Meals: Breakfast.'
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
  },
  {
    id: '61',
    title: 'Exclusive Vietnam Group Trip 7 Nights / 8 Days',
    slug: 'exclusive-vietnam-group-trip-7n-8d',
    image: '/images/vietnam.png',
    images: [
      '/images/vietnam.png',
      '/images/vietnam-sapa.png',
      '/images/vietnam2.jpg',
      '/images/vietnam3.jpg',
      '/images/vietnam4.jpg'
    ],
    destination: 'Vietnam',
    category: 'Vietnam',
    description: 'Embark on an unforgettable 8-day journey across Vietnam from Hanoi and Sapa in the northern mountains to the coastal beauty of Da Nang and Hoi An, and the bustling energy of Ho Chi Minh City. Experience Hanoi Old Quarters with a cyclo tour and Train Street, marvel at the Trang An boat ride and Mua Cave in Ninh Binh, ride the SP3 luxury overnight train to Sapa, and experience the thrilling Rong May Glass Bridge, Rainbow Slide, Alpine Coaster, and Fansipan Peak cable car. Discover Hoi An ancient town, take a coconut basket ride, explore Ba Na Hills with the iconic Golden Hands Bridge, crawl through the historic Cu Chi Tunnels with AK-47 shooting, and savor authentic egg coffee in Saigon.',
    duration: 8,
    nights: 7,
    route: '2N Hanoi - 2N Sapa - 2N Danang - 1N Ho Chi Minh',
    price: 57499,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    inclusionsSummary: {
      hotels: '4 Cities',
      transfers: 14,
      experiences: 9,
      meals: 8,
      visa: true,
      tripGuide: true,
    },
    highlights: [
      'Hanoi Old Quarters & Cyclo Tour',
      'Ninh Binh Trang An Boat Ride & Mua Cave',
      'Luxury Overnight Train to Sapa',
      'Rong May Glass Bridge & Alpine Coaster',
      'Fansipan Peak Cable Car & Muong Hoa Train',
      'Hoi An Ancient Town & Lantern Boat Ride',
      'Ba Na Hills & Golden Bridge',
      'Cu Chi Tunnels with AK-47 Shooting',
      'Apartment Cafe Egg Coffee & Bui Vien Street'
    ],
    overviewPoints: [
      'Route: 2N Hanoi - 2N Sapa - 2N Danang - 1N Ho Chi Minh',
      'Duration: 7 Nights / 8 Days',
      'Trip Start: Hanoi',
      'Trip End: Ho Chi Minh',
      'Major Highlights: Hanoi Old Quarters & Cyclo Tour, Ninh Binh Trang An Boat Ride & Mua Cave, Luxury Overnight Train & Sleeper Bus, Sapa Rong May Glass Bridge & Alpine Coaster, Fansipan Peak Cable Car, Hoi An Ancient Town & Lantern Boat Ride, Ba Na Hills & Golden Bridge, Cu Chi Tunnels with AK-47 Shooting.'
    ],
    summaryDetails: {
      accommodation: [
        { city: 'Hanoi', hotel: 'Babylon Grand Hotel / Similar' },
        { city: 'Sapa', hotel: 'Sapa Relax Hotel / Similar' },
        { city: 'Hoi An', hotel: 'Vinh Hung Old Town Hotel / Similar' },
        { city: 'Da Nang', hotel: 'Merry Hotel / Similar' },
        { city: 'Ho Chi Minh', hotel: 'Liberty Green Hotel / Similar' }
      ],
      meals: [
        '7 Breakfast'
      ],
      transfers: [
        'Airport & Sightseeing in Private Mini Bus.',
        'Hanoi - Sapa By Luxury Train',
        'Sapa - Hanoi By Sleeper Bus'
      ],
      activities: [
        {
          city: 'Hanoi',
          items: [
            'Hanoi Guided City Tour Old Quarters',
            'Nin Binh Experience - Trang An Boat Ride , Visit Mua Cave View point , Hoa Lu Ancient Capital',
            'Experience Hanoi on Cycle ( Hanoi Cyclo Tour )',
            'Evening Visit Train Street & Famous Beer Experience.'
          ]
        },
        {
          city: 'Sapa',
          items: [
            'Rong May Glass Bridge Experience with Ziplining',
            'Rainbow Slide & Alpine Coaters Ride Experience ( Experience worth Remembering )',
            'Cat Cat Village Trail',
            'Fansipan Peak with Moung Hua Train & Cable Car Experience'
          ]
        },
        {
          city: 'Da Nang',
          items: [
            'Visit Ancient Town Hoi An',
            'Iconic Coconut Basket Ride',
            'Experience Hoi An Town On Bicycle',
            'Evening Experience Lantern Boat Ride',
            'Visit Bana Hill Cable Car, Golden Bridge, Fantasy Park & French Village.',
            'Danang City Tour'
          ]
        },
        {
          city: 'Ho Chi Minh',
          items: [
            'Visit Cu Chi Tunnel & Experience - Ak 47 Shooting.',
            'Visit Apartment Cafe Experience Best Egg Coffee at Poo Cafe',
            'Night enjoy at Bui Vein Walking Street.'
          ]
        }
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Hanoi Arrival , Hanoi City Tour , Evening visit Train Street & Beer Street',
        description: [
          'Accommodation : Babylon Grand Hotel',
          'Arrive in Hanoi',
          'Transfer to Hotel In Central Hanoi OLD QUATER',
          'Guided City Tour',
          'Evening Old Quarter Cycle Tour & Train Street',
          'Experience most lively street Of Hanoi Beer Street',
          'Overnight in Hanoi'
        ]
      },
      {
        day: 2,
        title: 'Ninh - Binh - Trang An - Mua Cave , Overnight Train to Sapa',
        description: [
          'Enjoy Early Morning Breakfast',
          'Day Trip to Ninh Binh',
          'Experience most iconic Boat Ride Trang An',
          'Visit Ancient Capital Hou Lu',
          'Evening experience sunset from Mua Cave',
          'Later Experience Overnight Train Journey to Sapa',
          'Hanoi → Sapa: SP3 Overnight Train — 22:00–05:55 hrs',
          'Overnight in Train',
          'Meal : ( Breakfast )'
        ]
      },
      {
        day: 3,
        title: 'Sapa Rong May Glass Bridge , Rainbow Slide , Alpine Coaster & Cat Cat Village',
        description: [
          'Arrive Early Morning around 5 am in Sapa',
          'Early Hotel Check in Relax &  Rest',
          'After Breakfast Later in Afternoon Visit Muong Hoa Glass Bridge',
          'Experience Most iconic Rainbow Slide Alpine Coaster',
          'Cat Cat Village Beautiful Trail',
          'Evening at Leisure Explore Cafe Shopping Street',
          'Overnight in Sapa',
          'Meals : Breakfast'
        ]
      },
      {
        day: 4,
        title: 'Fansipan Peak with Muong Hoa Train & Cable Car , Sleeper Bus Transfer from Sapa - Hanoi',
        description: [
          'Early Morning Breakfast',
          'After Breakfast visit Fansipan Peak ( Roof of Indochina )',
          'Muong Hoa Train & Cable Car',
          'Later Board your Sleeper Bus To Hanoi',
          'Reach Hanoi by Evening & evening at leisure enjoy nightlife in Hanoi.',
          'Overnight in Hanoi.',
          'Meals : ( Breakfast )'
        ]
      },
      {
        day: 5,
        title: 'Hanoi to Danang , Hoi An ancient town Exploration',
        description: [
          'Early Morning Packed Breakfast',
          'Transfer to Airport & catch flight for Danang',
          'Arrive in Danang Board your Transfer for Hoi An ( Most Iconic Ancient Town of Vietnam )',
          'Enjoy Coconut Basket Ride',
          'Experience Hoi An Lantern Village Paddling on Cycle',
          'Evening Lantern Boat Ride Experience',
          'Overnight in Danang',
          'Meals ( Breakfast )'
        ]
      },
      {
        day: 6,
        title: 'Visit Bana Hill Cable Car, Golden Bridge, Fantasy Park & French Village & Visit Dragon Bridge.',
        description: [
          'Relaxing Morning Breakfast',
          'Visit Bana Hills Two Way Cable Car',
          'Golden Hands Bridge',
          'Fantasy Park',
          'Visit French Village',
          'Relaxing Evening on the beach Explore Cafes & Nightlife',
          'Overnight in Danang.',
          'Meals : ( Breakfast )'
        ]
      },
      {
        day: 7,
        title: 'Early Morning Flight Danang to Ho Chi Minh , Cu Chi Tunnel',
        description: [
          'After Breakfast Transfer To Airport',
          'Arrive in Ho Chi Minh',
          'Visit Cu Chi Tunnel Experience Riffle Shooting',
          'Cafe Hopping visit Apartment Cafe',
          'Evening at Leisure at Bui Vien Street',
          'Overnight in Ho Chi Minh',
          'Meals : ( Breakfast )'
        ]
      },
      {
        day: 8,
        title: 'Your amazing adventure comes to an end with unforgettable memories to take Home',
        description: [
          'Airport Transfer fixed timing as per Group Departure.'
        ]
      }
    ],
    included: [
      'Ground transfer by Private minibus, joining sleeping bus & luxury train as mentioned',
      'Wanderphilia Guide plus local guide.',
      'Guided Hanoi city tour',
      'Hanoi Cycle Tour',
      'Ninh Binh Trang An boattrip, Mua Cave',
      'Rong May Glass brigde, Cat Cat village, slide Alpine Coaster in Sapa',
      'Cable car Fansifan with roundtrip Muong hoa train',
      'Hoi An Cocunut basket ride explore hoi by cycle evening lattern boat ride experience',
      'Visit Bana Hill Cable Car, Golden Bridge, Fantasy Park & French Village & Visit Dragon Bridge',
      'Cu Chi Tunnel with AK 47 Shoooting tour',
      'Water on tours ( 2bottle/pax.day)',
      'Hotels accommodation with Breakfast ( Double & Triple Sharing )',
      'One way train ticket for overnight (4berth/cabin)',
      'One way by sleeping day bus from Sapa to Hanoi ( single cabin)',
      'Vietnam E Visa'
    ],
    notIncluded: [
      'Meals as mentioned above',
      'Compjlsory tipping for guide & driver: 3usd/pax/day',
      'Governmnet Taxes & Charges',
      'Domestic flight',
      'Visa Fee',
      'Ohters items not mentioned above'
    ],
    stays: [
      'Hanoi: Babylon Grand Hotel / Similar',
      'Sapa: Sapa Relax Hotel / Similar',
      'Hoi An: Vinh Hung Old Town Hotel / Similar',
      'Da Nang: Merry Hotel / Similar',
      'Ho Chi Minh: Liberty Green Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'September',
        ranges: ['19th - 26th September']
      },
      {
        month: 'October',
        ranges: ['2nd - 9th Oct']
      },
      {
        month: 'November',
        ranges: ['14th - 21st Nov']
      },
      {
        month: 'December',
        ranges: ['12th - 19th December']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Triple Sharing', value: '₹57,499' },
      { label: 'Double Sharing', value: '₹57,499' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'A sun cap',
          'UV protected sunglasses',
          'Cotton Shirts and T-shirts',
          'Jeans, Shorts and cotton pants',
          'Warm layer/jacket for Sapa & Fansipan Peak',
          'Sets of undergarments',
          'Pair of socks',
          'A small towel or Beach Towel',
          'A rain jacket or a poncho'
        ]
      },
      {
        title: 'Footwear',
        items: [
          'Comfortable Walking/Hiking shoes or Sneakers',
          'Flip flops/sandals'
        ]
      },
      {
        title: 'Medication',
        items: [
          'Glucose powder / Electrolytes',
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
          'Sunscreen minimum of SPF 40, lip balm, cold creams',
          'Body spray',
          'Universal power adapter'
        ]
      }
    ],
    paymentPolicy: [
      '50% advance payment is required to confirm the booking and secure all travel services.',
      'Balance 50% payment must be received at least 15 days prior to departure.',
      'All bookings are subject to availability and confirmation from respective suppliers at the time of payment.',
      'Any increase in taxes, government levies, fuel surcharges, or currency fluctuations before final payment may be charged additionally.'
    ],
    paymentTerms: [
      '50% advance payment is required to confirm the booking and secure all travel services.',
      'Balance 50% payment must be received at least 15 days prior to departure.',
      'All bookings are subject to availability and confirmation from respective suppliers at the time of payment.',
      'Any increase in taxes, government levies, fuel surcharges, or currency fluctuations before final payment may be charged additionally.'
    ],
    cancellationPolicy: [
      'More than 30 days before departure – Cancellation charges as per actual expenses incurred and supplier policies.',
      '30 to 16 days before departure – 50% of the total package cost.',
      '15 to 08 days before departure – 75% of the total package cost.',
      '07 days or less before departure / No Show – 100% of the total package cost.'
    ],
    note: [
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '40',
    title: '9 Days Exclusive Vietnam with Phu Quoc Group Trip',
    slug: 'vietnam-phu-quoc-group-trip',
    image: '/images/vietnam.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: "Experience the ultimate 9-day journey through the wonders of Vietnam and the tropical paradise of Phu Quoc. Discover the historic charm of Hanoi, cruise through the breathtaking limestone karsts of Ha Long Bay, marvel at the Golden Bridge and Ba Na Hills in Da Nang, step back in time at Hoi An Ancient Town, and unwind on the pristine beaches of Phu Quoc. A perfect blend of culture, history, adventure, and relaxation.",
    duration: 9,
    nights: 8,
    price: 64999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    inclusionsSummary: {
      hotels: 4,
      transfers: 14,
      experiences: 9,
      meals: 8,
      visa: true,
      tripGuide: true,
    },
    highlights: [
      'Hanoi',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Hoi An',
      'Bana Hills',
      'Phu Quoc'
    ],
    overviewPoints: [
      'Route: Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills → Phu Quoc',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Phu Quoc.',
      'Major Highlights: Hanoi Train Street, Ha Long Bay Luxury Cruise with Kayaking, Ba Na Hills & Golden Bridge, Coconut Forest, Hoi An Ancient Town with Lantern Boat ride, and Phu Quoc island hopping.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi - Half-Day City Tour',
        description: [
          'Arrive at Noi Bai International Airport, complete customs & immigration, and meet our tour representative.',
          'Transfer to your hotel in central Hanoi, check in, and refresh.',
          'Visit Tran Quoc Pagoda, Hanoi’s oldest Buddhist temple set on the picturesque West Lake.',
          'Experience the excitement of Hanoi Train Street, sipping Vietnamese egg coffee as the train passes inches away.',
          'Pass by the historic Ho Chi Minh Mausoleum complex and visit the iconic One Pillar Pagoda.',
          'Explore the lively 36 Guilds of the Hanoi Old Quarter and immerse in the buzzing nightlife of Ta Hien Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Cruise - Kayaking & Sunset Party',
        description: [
          'Enjoy breakfast at the hotel and depart on a scenic highway drive to Tuan Chau Marina.',
          'Board a luxury day cruise and glide through UNESCO-listed Ha Long Bay surrounded by thousands of limestone karsts.',
          'Relish a sumptuous Vietnamese seafood buffet lunch while cruising past iconic rock formations.',
          'Kayak or take a bamboo boat through hidden emerald lagoons and sea caves.',
          'Enjoy an energetic upper-deck sunset party with music, refreshments, and panoramic views of the bay.',
          'Disembark at Tuan Chau Marina and transfer back to Hanoi in the evening.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Hanoi to Da Nang. Day at Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Noi Bai Airport.',
          'Board your short 1.5-hour domestic flight to the coastal city of Da Nang.',
          'Meet your local representative on arrival and transfer to your beachfront hotel.',
          'Spend the afternoon relaxing on My Khe Beach or exploring Da Nang’s trendy seaside cafes.',
          'In the evening, take a leisurely stroll along the Han River to view the iconic Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Trip to Marble Mountain, Hoi An Ancient Town and Lantern on Boat Tour.',
        description: [
          'Savor breakfast at the hotel and head to the sacred Marble Mountains (Thuy Son).',
          'Explore hidden cave sanctuaries including Huyen Khong Cave and visit ancient Tam Thai Pagoda.',
          'Stop at Non Nuoc Stone Carving Village to observe local sculptors at work.',
          'Head to Cam Thanh Coconut Village for an exciting spinning bamboo basket boat ride through water coconut waterways.',
          'Proceed to the UNESCO World Heritage town of Hoi An to explore the 17th-century Japanese Covered Bridge and Chinese Assembly Halls.',
          'Board a traditional wooden boat on the Hoai River at dusk to release glowing flower lanterns onto the water.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Day Trip - Golden Bridge, Fantasy Park & French Village',
        description: [
          'Enjoy breakfast at the hotel and transfer to the base of the Truong Son Mountains at Ba Na Hills.',
          'Ascend via the world-record cable car system offering breathtaking forest canopy views.',
          'Walk across the world-famous Golden Hands Bridge perched high above the mist.',
          'Explore the European-inspired French Village, Debay Wine Cellar, and Le Jardin D’Amour flower gardens.',
          'Enjoy indoor rides, 4D/5D theaters, and games at Fantasy Park.',
          'Descend via cable car and return to your Da Nang hotel for an evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Transfer to Phu Quoc. Leisure Day. Optional Visit to Grand World.',
        description: [
          'Have breakfast at the hotel, check out, and transfer to Da Nang Airport.',
          'Board your domestic flight to the tropical paradise island of Phu Quoc.',
          'Arrive at Phu Quoc International Airport, transfer to your beach resort, and check in.',
          'Spend the afternoon unwinding on powdery sands or relaxing by the resort pool.',
          'In the evening, optionally visit Grand World Phu Quoc—"The Sleepless City"—to stroll Venice-style canals and watch the water fountain spectacle.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: '4 Islands Tour with Cable Car and Aquatopia Water Park.',
        description: [
          'Enjoy a tropical breakfast at the resort before morning pickup.',
          'Board a high-speed speedboat to explore south Phu Quoc’s islands: Gam Ghi, Xuong, May Rut, and Thom Island.',
          'Snorkel among pristine coral reefs in crystal-clear waters and relax on May Rut Beach.',
          'Relish a delicious island lunch with fresh local specialties.',
          'Arrive at Thom Island to enjoy thrilling water slides and rides at Aquatopia Water Park.',
          'Experience the world’s longest over-sea cable car ride back to An Thoi harbour with spectacular 360-degree ocean panoramas.',
          'Transfer back to your resort for evening leisure.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 8,
        title: 'Day at Leisure. Optional Tour to Vin Wonders and Vinpearl Safari Park.',
        description: [
          'Wake up to a leisurely breakfast at the resort with the day free to explore at your own pace.',
          'Optionally visit Vinpearl Safari, Vietnam’s premier semi-wild animal conservation sanctuary.',
          'Ride open safari vehicles to spot lions, rhinos, giraffes, and Bengal tigers roaming freely.',
          'Optionally spend the afternoon at VinWonders theme park experiencing thrilling coasters and the giant sea-shell aquarium.',
          'Visit Duong Dong Night Market in the evening to taste fresh grilled seafood and shop for Phu Quoc black pepper and pearls.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Departure from Phu Quoc. Depart with a lot of happy memories.',
        description: [
          'Enjoy your final tropical breakfast at the resort and complete check-out.',
          'Board your scheduled private transfer to Phu Quoc International Airport for your departure flight.',
          'Depart Vietnam with incredible memories, photos, and stories of your northern, central, and island adventure.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '08 Nights Accommodation based on double/twin sharing room with daily buffet breakfast.',
      'A total of 9 meals included Breakfast from Day 2 to Day 9 and Lunch on Day 2.',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with Sunset party and Kayaking',
      'Marble Mountains Tour',
      'Coconut Village Tour with Basket Boat ride',
      'Hoi An Ancient Town Tour',
      'Lantern boat ride on Hoai River',
      'Full Day Bana Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      '4 Island Hopping Tour (cable car ticket and speedboat included) + Aquatopia waterpark',
      'Sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per the program',
      'Local English-speaking guides in Vietnam',
      'Bottles of mineral water on the tour day',
      'Fixed Airport Pickup & Drop.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Phu Quoc: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 20th July', '26th July - 3rd Aug']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 23rd Aug', '23rd - 31st Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 21st Sept', '27th Sept - 5th Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 12th Oct', '18th Oct - 26th Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 15th Nov', '15th Nov - 23rd Nov', '22nd Nov - 30th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 13th Dec', '13th - 21st Dec']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹64,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '41',
    title: '9 Days Best Of Vietnam with Sapa Group Trip',
    slug: 'best-of-vietnam-with-sapa-group-trip',
    image: '/images/vietnam-sapa.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: "Embark on the ultimate 9-day journey through the natural, cultural, and historical highlights of Vietnam. Hike through the stunning rice terraces of Sapa and learn about mountain cultures in Cat Cat Village. Climb Fansipan peak on the legendary cable car and enjoy views from the Glass Bridge. Explore Hanoi's historic landmarks, and cruise past limestone karsts on a luxury Ha Long Bay cruise. Travel south to Da Nang, step on the famous Golden Bridge at Ba Na Hills, take traditional basket boat rides, stroll Hoi An Ancient Town's lantern-lit streets, and explore Ho Chi Minh City's landmarks and the historic Cu Chi Tunnels. A comprehensive journey through Vietnam's best landmarks.",
    duration: 9,
    nights: 8,
    price: 69999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    inclusionsSummary: {
      hotels: 4,
      transfers: 14,
      experiences: 9,
      meals: 8,
      visa: true,
      tripGuide: true,
    },
    highlights: [
      'Hanoi',
      'Sapa',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Ho Chi Minh City',
      'Bana Hills',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Sapa → Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills → Ho Chi Minh City',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Ho Chi Minh City.',
      'Major Highlights: Fansipan Peak & Glass Bridge in Sapa, Hanoi City Tour, Ha Long Bay Day Cruise, Ba Na Hills & Golden Bridge, Coconut Forest, Hoi An Ancient Town & Lantern Boat Ride, Saigon City Sightseeing, and Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival In Hanoi & Transfer To Sapa | Evening At Leisure',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete immigration, and meet our tour representative.',
          'Board your scheduled luxury limousine / sleeper bus for a scenic highland journey to Sapa.',
          'Wind through lush pine-covered valleys, misty peaks, and terraced rice hillsides.',
          'Arrive in Sapa mountain town, check in to your hotel, and relax.',
          'Spend the evening at leisure exploring Sapa Town square, the Stone Church, and cozy alpine cafes.',
          'Overnight stay in Sapa.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing Tour | Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Enjoy breakfast at the hotel and set off for Fansipan Peak—the "Roof of Indochina" at 3,143m.',
          'Ride the Sun World cable car soaring high above the Muong Hoa Valley to reach the summit.',
          'Explore grand pagodas, the giant bronze Buddha, and panoramic viewing platforms on the peak.',
          'Visit the Rong May Glass Bridge and gaze down through glass walkways into sheer mountain canyons.',
          'Trek down through the picturesque Hmong tribal hamlet of Cat Cat Village with its cascades and waterwheels.',
          'Return to Sapa town in the late afternoon for evening leisure.',
          'Overnight stay in Sapa.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Sapa To Hanoi | Hanoi Half-Day City Tour',
        description: [
          'Savor breakfast at the hotel, check out, and board your return limousine/sleeper transfer to Hanoi.',
          'Arrive in Hanoi in the afternoon, check in to your hotel, and set out for a guided city tour.',
          'Visit the historic Ho Chi Minh Complex, Ba Dinh Square, and the unique lotus-shaped One Pillar Pagoda.',
          'Explore the Temple of Literature, Vietnam’s first national university dating back to 1070.',
          'Stroll around Hoan Kiem Lake, cross the red Huc Bridge to Ngoc Son Temple, and explore the bustling 36 Old Quarter streets.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay | Luxury Day Cruise, Kayaking & Buffet Lunch.',
        description: [
          'Enjoy an early breakfast at the hotel and board transfers across the Red River Delta to Tuan Chau Marina.',
          'Embark on a luxury day cruise across UNESCO-listed Ha Long Bay amidst soaring limestone pillars.',
          'Savor a lavish seafood and Vietnamese buffet lunch served in the panoramic dining salon.',
          'Kayak or take a bamboo sampan through tranquil lagoons, sea grottoes, and limestone arches.',
          'Relax on the open sun deck for a lively sunset party with music, refreshments, and sea breezes.',
          'Disembark at the marina and transfer back to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 5,
        title: 'Hanoi To Da Nang | Evening At Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Hanoi Airport.',
          'Board your domestic flight to Da Nang (approx. 1 hour 20 minutes).',
          'Arrive in Da Nang, meet your local guide, and transfer to your coastal hotel for check-in.',
          'Spend the afternoon relaxing on white sandy shores of My Khe Beach.',
          'In the evening, stroll along the Han River waterfront to witness the illuminated Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang | Marble Mountain, Coconut Forest, Hoi An Ancient Town & Lantern Boat Ride',
        description: [
          'Enjoy breakfast at the hotel and depart for the sacred Marble Mountains.',
          'Climb stone steps to explore Huyen Khong Cave, Tam Thai Pagoda, and panoramic coastal viewpoints.',
          'Proceed to Cam Thanh Coconut Village and board traditional spinning bamboo basket boats through nipa palm canals.',
          'Head into UNESCO World Heritage town of Hoi An, walking past Chinese Assembly Halls and the Japanese Covered Bridge.',
          'At dusk, board a wooden lantern boat on the Hoai River to release candlelit flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Day Trip | Cable Car, Golden Bridge, Fantasy Park & French Village.',
        description: [
          'Savor breakfast at the hotel and journey to the base of Ba Na Hills.',
          'Ride the world-record cable car over lush rainforests and waterfalls up to the mountain resort.',
          'Walk across the world-famous Golden Hands Bridge held aloft by colossal stone hands.',
          'Explore the French Village, Le Jardin D’Amour flower gardens, and Linh Ung Pagoda.',
          'Enjoy free access to rides, 4D/5D attractions, and arcade games at Fantasy Park.',
          'Descend by cable car in the late afternoon and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Da Nang To Ho Chi Minh City | Evening At Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Board your flight to Ho Chi Minh City (Saigon).',
          'Arrive in Saigon, meet your representative, and transfer to your central hotel for check-in.',
          'Spend the evening strolling along Nguyen Hue Walking Street, admiring Saigon Opera House and the French colonial City Hall.',
          'Optionally visit Bui Vien Walking Street to experience Saigon’s energetic nightlife.',
          'Overnight stay in Ho Chi Minh City.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Explore Cu Chi Tunnels | Depart With A Lot Of Happy Memories',
        description: [
          'Enjoy breakfast at the hotel and check out of your room.',
          'Depart for the historic Cu Chi Tunnels, an immense 250km underground network from the Vietnam War.',
          'Crawl through preserved tunnels, see hidden trapdoors, field hospitals, and weapon workshops.',
          'Optionally test your aim at the firing range with historic AK-47 rifles.',
          'Transfer directly to Tan Son Nhat International Airport in Ho Chi Minh City for your onward flight.',
          'Depart with memories of an unforgettable journey from North to South Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '08 Nights Accommodation based on double/twin sharing room as per the itinerary',
      'A total of 9 meals included Breakfast from Day 2 to Day 9 and Lunch on Day 4',
      'Hanoi to Sapa & Sapa to Hanoi VIA Sleeper or Limo Bus',
      'Sun World Fansipan Legend With Cable car ticket',
      'Glass Bridge Ticket',
      'Cat Cat Village Tour',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with onboard Cruise Lunch and Kayaking',
      'Full Day Bana - Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      'Hoi An Ancient Town Tour',
      'Basket Boat Ride in Coconut Forest and Lantern boat ride on Hoai River',
      'Cu Chi Tunnels Tour',
      'All entrance fees and sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per program',
      'Local English-speaking guides in Vietnam',
      'Bottles of mineral water on tour day.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Sapa: Deluxe Room / Similar',
      'Hanoi: Deluxe Room / Similar',
      'Da Nang: Deluxe Room / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['10th July - 18th July', '24th July - 1st Aug']
      },
      {
        month: 'August',
        ranges: ['13th Aug - 21st Aug', '21st Aug - 29th Aug']
      },
      {
        month: 'September',
        ranges: ['11th Sept - 19th Sept', '25th Sept - 3rd Oct']
      },
      {
        month: 'October',
        ranges: ['2nd Oct - 10th Oct', '16th Oct - 24th Oct']
      },
      {
        month: 'November',
        ranges: ['5th Nov - 13th Nov', '13th Nov - 21st Nov', '20th Nov - 27th Nov']
      },
      {
        month: 'December',
        ranges: ['3rd Dec - 11th Dec', '11th - 19th Dec']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹69,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '42',
    title: '8 Days Highlights of Vietnam with Sapa Group Trip',
    slug: 'highlights-of-vietnam-with-sapa-group-trip',
    image: '/images/vietnam-highlights.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: "Embark on an incredible 8-day group trip highlighting the very best of Vietnam. Hike the scenic, mist-shrouded hills of Sapa and experience traditional Hmong culture in Cat Cat Village. Climb Fansipan peak on the legendary cable car, explore the historic Old Quarter and Ho Chi Minh Complex in Hanoi, and cruise the breathtaking karsts of Ha Long Bay on a luxury day cruise. Travel south to Da Nang, stroll down lantern-lit canals in the UNESCO World Heritage town of Hoi An, and step onto the famous Golden Bridge at Ba Na Hills. A perfect adventure covering Vietnam's top landmarks.",
    duration: 8,
    nights: 7,
    price: 59999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    inclusionsSummary: {
      hotels: 4,
      transfers: 14,
      experiences: 9,
      meals: 8,
      visa: true,
      tripGuide: true,
    },
    highlights: [
      'Hanoi',
      'Sapa',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Hoi An Ancient Town',
      'Bana Hills'
    ],
    overviewPoints: [
      'Route: Hanoi → Sapa → Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Da Nang.',
      'Major Highlights: Fansipan Peak & Glass Bridge in Sapa, Hanoi City Tour, Ha Long Bay Luxury Day Cruise, Marble Mountains, Coconut Village Basket Boat, Hoi An Ancient Town & Lantern Boat Ride, Golden Bridge & Ba Na Hills.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival In Hanoi & Transfer To Sapa | Evening At Leisure',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete immigration, and meet our tour representative.',
          'Board your scheduled luxury limousine / sleeper bus for a scenic highland journey to Sapa.',
          'Wind through lush pine-covered valleys, misty peaks, and terraced rice hillsides.',
          'Arrive in Sapa mountain town, check in to your hotel, and relax.',
          'Spend the evening at leisure exploring Sapa Town square, the Stone Church, and cozy alpine cafes.',
          'Overnight stay in Sapa.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing Tour | Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Enjoy breakfast at the hotel and set off for Fansipan Peak—the "Roof of Indochina" at 3,143m.',
          'Ride the Sun World cable car soaring high above the Muong Hoa Valley to reach the summit.',
          'Explore grand pagodas, the giant bronze Buddha, and panoramic viewing platforms on the peak.',
          'Visit the Rong May Glass Bridge and gaze down through glass walkways into sheer mountain canyons.',
          'Trek down through the picturesque Hmong tribal hamlet of Cat Cat Village with its cascades and waterwheels.',
          'Return to Sapa town in the late afternoon for evening leisure.',
          'Overnight stay in Sapa.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Sapa To Hanoi | Hanoi Half-Day City Tour',
        description: [
          'Savor breakfast at the hotel, check out, and board your return limousine/sleeper transfer to Hanoi.',
          'Arrive in Hanoi in the afternoon, check in to your hotel, and set out for a guided city tour.',
          'Visit the historic Ho Chi Minh Complex, Ba Dinh Square, and the unique lotus-shaped One Pillar Pagoda.',
          'Explore the Temple of Literature, Vietnam’s first national university dating back to 1070.',
          'Stroll around Hoan Kiem Lake, cross the red Huc Bridge to Ngoc Son Temple, and explore the bustling 36 Old Quarter streets.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay | Luxury Day Cruise, Kayaking & Buffet Lunch.',
        description: [
          'Enjoy an early breakfast at the hotel and board transfers across the Red River Delta to Tuan Chau Marina.',
          'Embark on a luxury day cruise across UNESCO-listed Ha Long Bay amidst soaring limestone pillars.',
          'Savor a lavish seafood and Vietnamese buffet lunch served in the panoramic dining salon.',
          'Kayak or take a bamboo sampan through tranquil lagoons, sea grottoes, and limestone arches.',
          'Relax on the open sun deck for a lively sunset party with music, refreshments, and sea breezes.',
          'Disembark at the marina and transfer back to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 5,
        title: 'Hanoi To Da Nang | Evening At Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Hanoi Airport.',
          'Board your domestic flight to Da Nang (approx. 1 hour 20 minutes).',
          'Arrive in Da Nang, meet your local guide, and transfer to your coastal hotel for check-in.',
          'Spend the afternoon relaxing on white sandy shores of My Khe Beach.',
          'In the evening, stroll along the Han River waterfront to witness the illuminated Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang | Marble Mountain, Coconut Forest, Hoi An Ancient Town & Lantern Boat Ride',
        description: [
          'Enjoy breakfast at the hotel and depart for the sacred Marble Mountains.',
          'Climb stone steps to explore Huyen Khong Cave, Tam Thai Pagoda, and panoramic coastal viewpoints.',
          'Proceed to Cam Thanh Coconut Village and board traditional spinning bamboo basket boats through nipa palm canals.',
          'Head into UNESCO World Heritage town of Hoi An, walking past Chinese Assembly Halls and the Japanese Covered Bridge.',
          'At dusk, board a wooden lantern boat on the Hoai River to release candlelit flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Day Trip | Cable Car, Golden Bridge, Fantasy Park & French Village.',
        description: [
          'Savor breakfast at the hotel and journey to the base of Ba Na Hills.',
          'Ride the world-record cable car over lush rainforests and waterfalls up to the mountain resort.',
          'Walk across the world-famous Golden Hands Bridge held aloft by colossal stone hands.',
          'Explore the French Village, Le Jardin D’Amour flower gardens, and Linh Ung Pagoda.',
          'Enjoy free access to rides, 4D/5D attractions, and arcade games at Fantasy Park.',
          'Descend by cable car in the late afternoon and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Depart With A Lot Of Happy Memories',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your scheduled transfer to Da Nang International Airport for your departure flight.',
          'Depart Vietnam with lifelong memories of northern mountains, misty peaks, limestone bays, and ancient lantern-lit towns.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '07 Nights Accommodation based on double/twin sharing room as per the itinerary',
      'A total of 8 meals included Breakfast from Day 2 to Day 8 and Lunch on Day 2',
      'Hanoi to Sapa & Sapa to Hanoi VIA Sleeper or Limo Bus',
      'Sun World Fansipan Legend With Cable car ticket',
      'Glass Bridge Ticket',
      'Cat Cat Village Tour',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with Sunset party and Kayaking',
      'Marble Mountains Tour',
      'Coconut Village Tour with Basket Boat ride',
      'Hoi An Ancient Town Tour',
      'Lantern boat ride on Hoai River',
      'Full Day Bana Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      'Sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per the program',
      'Local English-speaking guides in Vietnam',
      'Bottles of mineral water on the tour day',
      'Fixed Airport Pick-up & Drop-off'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Sapa: Deluxe Room / Similar',
      'Hanoi: Deluxe Room / Similar',
      'Da Nang: Deluxe Room / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['10th July - 17th July', '24th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['13th Aug - 20th Aug', '21st Aug - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['11th Sept - 18th Sept', '25th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['2nd Oct - 11th Oct', '16th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['5th Nov - 12th Nov', '13th Nov - 20th Nov', '20th Nov - 27th Nov']
      },
      {
        month: 'December',
        ranges: ['3rd Dec - 10th Dec', '11th - 18th Dec']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹59,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '43',
    title: '11 Days Wonders Of Vietnam with Sapa & Phu Quoc Group Trip',
    slug: 'wonders-of-vietnam-with-sapa-and-phu-quoc-group-trip',
    image: '/images/vietnam-wonders.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: "Experience the ultimate 11-day group trip covering the complete wonders of Vietnam. Explore Sapa's misty peaks, climb Fansipan Legend on the scenic cable car, walk Sapa's Glass Bridge, and stroll the paths of Cat Cat Village. Experience Hanoi's historic landmarks and cruise through Ha Long Bay's dramatic karsts on a luxury day cruise. Take a flight to Da Nang, visit the Marble Mountains, ride basket boats in Coconut Forest, walk through lantern-lined streets in Hoi An, and step on the famous Golden Bridge at Ba Na Hills. Continue to Phu Quoc Island to relax on Long Beach, visit Grand World, and take speedboat hopping tours of the southern islands and Aquatopia waterpark. A comprehensive, power-packed travel adventure.",
    duration: 11,
    nights: 10,
    price: 82999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    highlights: [
      'Hanoi',
      'Sapa',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Ho Chi Minh City',
      'Bana Hills',
      'Phu Quoc'
    ],
    overviewPoints: [
      'Route: Hanoi → Sapa → Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills → Phu Quoc',
      'Duration: 10 Nights / 11 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Phu Quoc.',
      'Major Highlights: Fansipan Legend & Glass Bridge in Sapa, Hanoi City Tour, Ha Long Bay Luxury Day Cruise, Golden Bridge & Ba Na Hills, Coconut Forest & Hoi An Lantern Boat Ride, Phu Quoc 4-Islands Tour & Aquatopia Water Park.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival In Hanoi & Transfer To Sapa | Evening At Leisure',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete immigration, and meet our representative.',
          'Board your scheduled luxury limousine / sleeper bus for a scenic highland journey to Sapa.',
          'Travel through misty mountain valleys and terraced rice hillsides of the Hoang Lien Son range.',
          'Arrive in Sapa, check in to your hotel, and relax.',
          'Spend the evening at leisure exploring Sapa Town square, the Stone Church, and local alpine cafes.',
          'Overnight stay in Sapa.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing Tour | Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Enjoy breakfast at the hotel and set off for Fansipan Peak—the "Roof of Indochina" at 3,143m.',
          'Ride the Sun World cable car soaring over the misty Muong Hoa Valley to reach the summit.',
          'Explore grand pagodas, the giant bronze Buddha, and scenic summit platforms.',
          'Visit the Rong May Glass Bridge for exhilarating views looking down into sheer mountain gorges.',
          'Trek down through the picturesque Hmong tribal village of Cat Cat with its waterfalls and waterwheels.',
          'Return to Sapa town for an evening at leisure.',
          'Overnight stay in Sapa.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Sapa To Hanoi | Hanoi Half-Day City Tour',
        description: [
          'Savor breakfast at the hotel, check out, and board your return limousine/sleeper transfer to Hanoi.',
          'Arrive in Hanoi, check in to your hotel, and embark on a guided cultural city tour.',
          'Visit the historic Ho Chi Minh Complex, Ba Dinh Square, and the lotus-shaped One Pillar Pagoda.',
          'Explore the Temple of Literature, Vietnam’s ancient first imperial university.',
          'Stroll around Hoan Kiem Lake, cross the red Huc Bridge to Ngoc Son Temple, and explore the bustling 36 Old Quarter streets.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay | Luxury Day Cruise, Kayaking & Buffet Lunch.',
        description: [
          'Enjoy an early breakfast at the hotel and board transfers across the Red River Delta to Tuan Chau Marina.',
          'Board a luxury day cruise and glide through UNESCO-listed Ha Long Bay surrounded by thousands of limestone karsts.',
          'Savor a lavish seafood and Vietnamese buffet lunch in the panoramic dining salon.',
          'Kayak or take a bamboo sampan through hidden emerald lagoons and sea caves.',
          'Enjoy an upper-deck sunset party with music, refreshments, and sea breezes before returning to the pier.',
          'Transfer back to Hanoi in the evening.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 5,
        title: 'Hanoi To Da Nang | Evening At Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Hanoi Airport.',
          'Board your short domestic flight to the coastal city of Da Nang.',
          'Meet your local guide upon arrival and transfer to your beachfront hotel for check-in.',
          'Spend the afternoon relaxing on white sandy shores of My Khe Beach.',
          'In the evening, stroll along the Han River waterfront to view the illuminated Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang | Marble Mountain, Coconut Forest, Hoi An Ancient Town & Lantern Boat Ride',
        description: [
          'Enjoy breakfast at the hotel and depart for the sacred Marble Mountains.',
          'Climb stone steps to explore Huyen Khong Cave, Tam Thai Pagoda, and panoramic coastal viewpoints.',
          'Proceed to Cam Thanh Coconut Village and board traditional spinning bamboo basket boats through nipa palm canals.',
          'Head into UNESCO World Heritage town of Hoi An, walking past Chinese Assembly Halls and the Japanese Covered Bridge.',
          'At dusk, board a wooden lantern boat on the Hoai River to release candlelit flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Day Trip | Cable Car, Golden Bridge, Fantasy Park & French Village.',
        description: [
          'Savor breakfast at the hotel and journey to the base of Ba Na Hills.',
          'Ride the world-record cable car over lush rainforests and waterfalls up to the mountain resort.',
          'Walk across the world-famous Golden Hands Bridge held aloft by colossal stone hands.',
          'Explore the French Village, Le Jardin D’Amour flower gardens, and Linh Ung Pagoda.',
          'Enjoy free access to rides, 4D/5D attractions, and arcade games at Fantasy Park.',
          'Descend by cable car in the late afternoon and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Da Nang To Phu Quoc | Island Leisure.',
        description: [
          'Have breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Board your domestic flight to Phu Quoc Island, the tropical pearl of southern Vietnam.',
          'Arrive at Phu Quoc Airport, transfer to your beach resort, and complete check-in.',
          'Spend the afternoon sunbathing on Long Beach or enjoying the resort swimming pool.',
          'In the evening, visit Duong Dong Night Market to sample fresh grilled seafood and island delicacies.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: '4 Islands Tour with Cable Car and Aquatopia Water Park.',
        description: [
          'Enjoy a tropical breakfast at the resort before morning pickup.',
          'Board a high-speed speedboat to explore southern islands: Gam Ghi, Xuong, May Rut, and Thom Island.',
          'Snorkel among pristine coral reefs in crystal-clear waters and relax on May Rut Beach.',
          'Relish a delicious island lunch with fresh local specialties.',
          'Arrive at Thom Island to enjoy exhilarating slides and wave pools at Aquatopia Water Park.',
          'Ride the world’s longest over-sea cable car back to An Thoi harbour with spectacular 360-degree ocean panoramas.',
          'Transfer back to your resort for evening leisure.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 10,
        title: 'Day at Leisure. Optional Tour to Vin Wonders and Vinpearl Safari Park.',
        description: [
          'Wake up to a leisurely breakfast at the resort with the day free to explore at your own pace.',
          'Optionally visit Vinpearl Safari, Vietnam’s premier open wildlife sanctuary, to view lions, rhinos, and giraffes.',
          'Optionally explore VinWonders theme park with its giant Neptune palace aquarium and rollercoasters.',
          'In the evening, optionally visit Grand World Phu Quoc to stroll illuminated Venetian canals and watch the water show.',
          'Overnight stay in Phu Quoc.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 11,
        title: 'Departure from Phu Quoc. Depart with a lot of happy memories.',
        description: [
          'Enjoy your final tropical breakfast at the resort and complete check-out.',
          'Board your scheduled transfer to Phu Quoc International Airport for your departure flight.',
          'Depart Vietnam with unforgettable memories of mountains, bays, heritage towns, and tropical islands.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '10 Nights Accommodation based on double/twin sharing room as per the itinerary',
      'A total of 11 meals included Breakfast from Day 2 to Day 11 and Lunch on Day 4',
      'Hanoi to Sapa & Sapa to Hanoi VIA Sleeper or Limo Bus',
      'Sun World Fansipan Legend With Cable car ticket',
      'Glass Bridge Ticket',
      'Cat Cat Village Tour',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with onboard Cruise Lunch and Kayaking',
      'Marble Mountains Tour',
      'Coconut Village Tour with Basket Boat ride',
      'Hoi An Ancient Town Tour',
      'Lantern boat ride on Hoai River',
      'Full Day Bana Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      '4 Island Hopping Tour (cable car ticket and speedboat included) + Aquatopia waterpark',
      'Sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per the program',
      'Local English-speaking guides in Vietnam',
      'Bottles of mineral water on the tour day',
      'Fixed Airport Pick-up & Drop-off'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Sapa: Deluxe Room / Similar',
      'Hanoi: Deluxe Room / Similar',
      'Da Nang: Deluxe Room / Similar',
      'Phu Quoc: Deluxe Room / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['10th July - 20th July', '24th July - 3rd Aug']
      },
      {
        month: 'August',
        ranges: ['13th Aug - 23rd Aug', '21st Aug - 31st Aug']
      },
      {
        month: 'September',
        ranges: ['11th Sept - 21st Sept', '25th Sept - 5th Oct']
      },
      {
        month: 'October',
        ranges: ['2nd Oct - 12th Oct', '16th Oct - 26th Oct']
      },
      {
        month: 'November',
        ranges: ['5th Nov - 15th Nov', '13th Nov - 21st Nov', '20th Nov - 30th Nov']
      },
      {
        month: 'December',
        ranges: ['3rd Dec - 13th Dec', '11th - 21st Dec']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹82,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '44',
    title: '7 Days Backpacking Vietnam with Hanoi , Ha Long Bay , Da Nang , Saigon Group Trip',
    slug: 'backpacking-vietnam-with-hanoi-ha-long-bay-da-nang-saigon-group-trip',
    image: '/images/vietnam-backpacking.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: "Join the ultimate 7-day backpacking group adventure across Vietnam. Start in the historic streets of Hanoi with a half-day city tour, see the famous Train Street, and cruise the emerald waters of Ha Long Bay on a luxury cruise. Travel south to Da Nang, climb the Marble Mountains, ride traditional basket boats, and walk the romantic lantern-lit streets of Hoi An. Explore Saigon (Ho Chi Minh City) and discover the historic Cu Chi Tunnels before departing. Perfect for budget-conscious explorers and backpackers looking to experience Vietnam's top highlights.",
    duration: 7,
    nights: 6,
    price: 32999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    highlights: [
      'Hanoi',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Latern on Boat Tour',
      'Hoi An Ancient Tour',
      'Bana Hills',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City)',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Ha Long Bay Luxury Day Cruise, Marble Mountains, Coconut Forest & Hoi An Lantern Boat Ride, Saigon City Exploration, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi - Half-Day City Tour',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete customs, and meet our tour representative.',
          'Transfer to your central accommodation, check in, and refresh.',
          'Visit Tran Quoc Pagoda on West Lake and pass by the historic Ho Chi Minh Mausoleum complex.',
          'Experience the buzz of Hanoi Train Street, watching trains rumble past cozy trackside cafes.',
          'Stroll through the lively alleys of Hanoi Old Quarter and experience the nightlife on Ta Hien Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Cruise - Kayaking & Sunset Party',
        description: [
          'Enjoy breakfast and travel along the expressway to Tuan Chau Marina.',
          'Board a luxury day cruise across UNESCO World Heritage Ha Long Bay surrounded by towering limestone karsts.',
          'Savor a delicious seafood and Vietnamese buffet lunch on board.',
          'Kayak or take a bamboo sampan through hidden lagoons and sea caves.',
          'Enjoy an energetic upper-deck sunset party with music, refreshments, and panoramic bay views.',
          'Disembark at the marina and transfer back to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Hanoi to Da Nang. Day at Leisure.',
        description: [
          'Have breakfast, complete check-out, and transfer to Hanoi Airport.',
          'Board your short 1.5-hour domestic flight to the coastal city of Da Nang.',
          'Arrive in Da Nang, transfer to your hotel, and check in.',
          'Spend the afternoon relaxing on the sands of My Khe Beach.',
          'In the evening, stroll along the Han River to view the iconic Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Trip to Marble Mountain, Hoi An Ancient Town and Lantern on Boat Tour.',
        description: [
          'Enjoy breakfast and set out for the limestone peaks of the Marble Mountains.',
          'Climb to explore Huyen Khong Cave sanctuary, Tam Thai Pagoda, and panoramic coastal lookouts.',
          'Proceed to Cam Thanh Coconut Village for a fun spinning bamboo basket boat ride.',
          'Explore UNESCO-listed Hoi An Ancient Town, crossing the 17th-century Japanese Bridge and viewing historic merchant houses.',
          'At dusk, board a traditional wooden boat on the Hoai River to release glowing flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Day Trip - Golden Bridge, Fantasy Park & French Village',
        description: [
          'Savor breakfast at the hotel and transfer to the base of Ba Na Hills.',
          'Ride the world-record cable car soaring above lush mountain rainforests and waterfalls.',
          'Walk along the breathtaking Golden Hands Bridge held high by giant stone hands.',
          'Explore the European-inspired French Village, Debay Wine Cellar, and Le Jardin D’Amour flower gardens.',
          'Enjoy indoor attractions, games, and 4D/5D theaters at Fantasy Park.',
          'Descend by cable car and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon. Spend the day at Leisure.',
        description: [
          'Have breakfast, complete check-out, and transfer to Da Nang Airport.',
          'Board your domestic flight to Ho Chi Minh City (Saigon).',
          'Arrive in Saigon, meet your representative, and transfer to your accommodation.',
          'Spend the afternoon and evening at leisure exploring Nguyen Hue Walking Street and the French colonial Opera House.',
          'Optionally visit Bui Vien Walking Street to experience Saigon’s buzzing nightlife.',
          'Overnight stay in Saigon.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Visit Cu Chi Tunnels | Depart with a lot of happy memories.',
        description: [
          'Enjoy breakfast and check out of your accommodation.',
          'Drive to the historic Cu Chi Tunnels network used during the Vietnam War.',
          'Crawl through preserved tunnels, see hidden trapdoors, underground bunkers, and weapon displays.',
          'Transfer directly to Tan Son Nhat International Airport in Ho Chi Minh City for your departure flight.',
          'Depart Vietnam with incredible memories of your backpacking journey from North to South.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '06 Nights Accommodation in hostel',
      'A total of 7 meals included Breakfast from Day 2 to Day 7 and Lunch on Day 2.',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with onboard Cruise Lunch and Kayaking',
      'Full Day Bana - Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      'Hoi An Ancient Town Tour',
      'Basket Boat Ride in Coconut Forest and Lantern boat ride on Hoai River',
      'Cu Chi Tunnels Tour',
      'All entrance fees and sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per program',
      'Local English-speaking guides in Vietnam',
      'Bottles of mineral water on tour day'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hostel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 18th July', '26th July - 1st Aug']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 21st Aug', '23rd Aug - 29th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 19th Sept', '27th Sept - 3rd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 10th Oct', '18th Oct - 24th Oct']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹32,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '45',
    title: '7 Days Mesmerising Vietnam Group Trip',
    slug: 'mesmerising-vietnam-group-trip',
    image: '/images/vietnam-mesmerising.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Uncover the magic of Vietnam on this mesmerising 7-day group trip. Stroll through Hanoi's historic Old Quarter and see the famous Train Street. Cruise past majestic limestone karsts and islets on a luxury Ha Long Bay day tour, including kayaking and a sunset party. Fly south to Da Nang, step onto the stunning Golden Bridge held by giant stone hands at Ba Na Hills, explore the caves of Marble Mountain, and experience a lantern boat ride in the UNESCO World Heritage town of Hoi An. End your adventure in Saigon (Ho Chi Minh City) with a trip through the historic Cu Chi Tunnels. The perfect balance of history, scenery, and culture.`,
    duration: 7,
    nights: 6,
    price: 47999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    highlights: [
      'Hanoi',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Bana Hills',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City)',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Ha Long Bay Luxury Day Cruise, Marble Mountains, Coconut Forest & Hoi An Lantern Boat Ride, Ba Na Hills & Golden Bridge, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi - Half-Day City Tour',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete customs, and meet our representative.',
          'Transfer to your central hotel, check in, and refresh.',
          'Visit Tran Quoc Pagoda on West Lake and pass by the historic Ho Chi Minh Mausoleum complex.',
          'Experience the buzz of Hanoi Train Street, watching trains rumble past cozy trackside cafes.',
          'Stroll through the lively alleys of Hanoi Old Quarter and experience the nightlife on Ta Hien Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Cruise - Kayaking & Sunset Party',
        description: [
          'Enjoy breakfast and travel along the expressway to Tuan Chau Marina.',
          'Board a luxury day cruise across UNESCO World Heritage Ha Long Bay surrounded by towering limestone karsts.',
          'Savor a delicious seafood and Vietnamese buffet lunch on board.',
          'Kayak or take a bamboo sampan through hidden lagoons and sea caves.',
          'Enjoy an energetic upper-deck sunset party with music, refreshments, and panoramic bay views.',
          'Disembark at the marina and transfer back to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Hanoi to Da Nang. Day at Leisure.',
        description: [
          'Have breakfast, complete check-out, and transfer to Hanoi Airport.',
          'Board your short 1.5-hour domestic flight to the coastal city of Da Nang.',
          'Arrive in Da Nang, transfer to your hotel, and check in.',
          'Spend the afternoon relaxing on the sands of My Khe Beach.',
          'In the evening, stroll along the Han River to view the iconic Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Trip to Marble Mountain, Hoi An Ancient Town and Lantern on Boat Tour.',
        description: [
          'Enjoy breakfast and set out for the limestone peaks of the Marble Mountains.',
          'Climb to explore Huyen Khong Cave sanctuary, Tam Thai Pagoda, and panoramic coastal lookouts.',
          'Proceed to Cam Thanh Coconut Village for a fun spinning bamboo basket boat ride.',
          'Explore UNESCO-listed Hoi An Ancient Town, crossing the 17th-century Japanese Bridge and viewing historic merchant houses.',
          'At dusk, board a traditional wooden boat on the Hoai River to release glowing flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Day Trip - Golden Bridge, Fantasy Park & French Village',
        description: [
          'Savor breakfast at the hotel and transfer to the base of Ba Na Hills.',
          'Ride the world-record cable car soaring above lush mountain rainforests and waterfalls.',
          'Walk along the breathtaking Golden Hands Bridge held high by giant stone hands.',
          'Explore the European-inspired French Village, Debay Wine Cellar, and Le Jardin D’Amour flower gardens.',
          'Enjoy indoor attractions, games, and 4D/5D theaters at Fantasy Park.',
          'Descend by cable car and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon. Spend the day at Leisure.',
        description: [
          'Have breakfast, complete check-out, and transfer to Da Nang Airport.',
          'Board your domestic flight to Ho Chi Minh City (Saigon).',
          'Arrive in Saigon, meet your representative, and transfer to your hotel.',
          'Spend the afternoon and evening at leisure exploring Nguyen Hue Walking Street and the French colonial Opera House.',
          'Optionally visit Bui Vien Walking Street to experience Saigon’s buzzing nightlife.',
          'Overnight stay in Saigon.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels and Departure',
        description: [
          'Enjoy breakfast and check out of your hotel.',
          'Drive to the historic Cu Chi Tunnels network used during the Vietnam War.',
          'Crawl through preserved tunnels, see hidden trapdoors, underground bunkers, and weapon displays.',
          'Transfer directly to Tan Son Nhat International Airport in Ho Chi Minh City for your departure flight.',
          'Depart Vietnam with incredible memories of your journey from Hanoi to Saigon.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '06 Nights Accommodation based on double/twin sharing room with daily buffet breakfast',
      'A total of 7 meals included Breakfast from Day 2 to Day 7 and Lunch on Day 2.',
      'Half-day Hanoi City tour',
      'Halong Bay day tour with onboard Cruise Lunch and Kayaking',
      'Full Day Bana - Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides)',
      'Hoi An Ancient Town Tour',
      'Basket Boat Ride in Coconut Forest and Lantern boat ride on Hoai River',
      'Cu Chi Tunnels Tour',
      'All entrance fees and sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per program',
      'Local English-speaking guides in Vietnam.',
      'Bottles of mineral water on tour day'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 18th July', '26th July - 1st Aug']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 21st Aug', '23rd - 29th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 19th Sept', '27th Sept - 3rd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 10th Oct', '18th Oct - 24th Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 13th Nov', '15th Nov - 21st Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹47,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '46',
    title: '6 Days Best of Vietnam Group Trip',
    slug: 'best-of-vietnam-group-trip',
    image: '/images/vietnam-best.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Experience the highlights of Vietnam in 6 days. Walk through the bustling historic streets of Hanoi and check out the famous Train Street. Board a luxury day cruise to sail past the limestone islands of Ha Long Bay, go kayaking, and enjoy a sunset party. Travel to Da Nang, step onto the famous Golden Bridge at Ba Na Hills, take a basket boat ride in Cam Thanh Coconut Village, and wander the historic lantern-lit streets of Hoi An Ancient Town. The perfect introductory trip to Vietnam's north and central wonders.`,
    duration: 6,
    nights: 5,
    price: 36999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 16,
    tripType: 'International',
    showGetQuoteOnly: false,
    highlights: [
      'Hanoi',
      'Ha Long Bay Luxury Cruise',
      'Danang',
      'Golden Bridge',
      'Fantasy Park',
      'Hoi An',
      'Bana Hills'
    ],
    overviewPoints: [
      'Route: Hanoi → Ha Long Bay → Da Nang → Hoi An → Ba Na Hills',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Da Nang.',
      'Major Highlights: Hanoi Train Street & City Tour, Ha Long Bay Luxury Day Cruise, Marble Mountains, Coconut Village Basket Boat Tour, Hoi An Ancient Town & Lantern Boat Ride, Ba Na Hills & Golden Bridge.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi - Half-Day City Tour',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete immigration, and meet our tour representative.',
          'Transfer to your hotel in central Hanoi, check in, and refresh.',
          'Visit Tran Quoc Pagoda on West Lake and pass by the historic Ho Chi Minh Mausoleum complex.',
          'Experience the buzz of Hanoi Train Street, watching trains rumble past cozy trackside cafes.',
          'Stroll through the lively alleys of Hanoi Old Quarter and experience the nightlife on Ta Hien Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Cruise - Kayaking & Sunset Party',
        description: [
          'Enjoy breakfast and travel along the expressway to Tuan Chau Marina.',
          'Board a luxury day cruise across UNESCO World Heritage Ha Long Bay surrounded by towering limestone karsts.',
          'Savor a delicious seafood and Vietnamese buffet lunch on board.',
          'Kayak or take a bamboo sampan through hidden lagoons and sea caves.',
          'Enjoy an energetic upper-deck sunset party with music, refreshments, and panoramic bay views.',
          'Disembark at the marina and transfer back to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Hanoi to Da Nang. Day at Leisure.',
        description: [
          'Have breakfast, complete check-out, and transfer to Hanoi Airport.',
          'Board your short 1.5-hour domestic flight to the coastal city of Da Nang.',
          'Arrive in Da Nang, transfer to your hotel, and check in.',
          'Spend the afternoon relaxing on the sands of My Khe Beach.',
          'In the evening, stroll along the Han River to view the iconic Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Trip to Marble Mountain, Hoi An Ancient Town and Lantern on Boat Tour.',
        description: [
          'Enjoy breakfast and set out for the limestone peaks of the Marble Mountains.',
          'Climb to explore Huyen Khong Cave sanctuary, Tam Thai Pagoda, and panoramic coastal lookouts.',
          'Proceed to Cam Thanh Coconut Village for a fun spinning bamboo basket boat ride.',
          'Explore UNESCO-listed Hoi An Ancient Town, crossing the 17th-century Japanese Bridge and viewing historic merchant houses.',
          'At dusk, board a traditional wooden boat on the Hoai River to release glowing flower lanterns.',
          'Return to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Day Trip - Golden Bridge, Fantasy Park & French Village',
        description: [
          'Savor breakfast at the hotel and transfer to the base of Ba Na Hills.',
          'Ride the world-record cable car soaring above lush mountain rainforests and waterfalls.',
          'Walk along the breathtaking Golden Hands Bridge held high by giant stone hands.',
          'Explore the European-inspired French Village, Debay Wine Cellar, and Le Jardin D’Amour flower gardens.',
          'Enjoy indoor attractions, games, and 4D/5D theaters at Fantasy Park.',
          'Descend by cable car and return to Da Nang.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Departure from Da Nang. Take back a lot of happy memories.',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your scheduled transfer to Da Nang International Airport for your departure flight.',
          'Depart Vietnam with incredible memories of Hanoi, Ha Long Bay, Ba Na Hills, and Hoi An.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '05 Nights Accommodation based on double/twin sharing room with daily buffet breakfast',
      'A total of 6 meals included Breakfast from Day 2 to Day 6 and Lunch on Day 2.',
      'Half-day Hanoi City tour.',
      'Halong Bay day tour with Sunset party and Kayaking.',
      'Marble Mountains Tour.',
      'Coconut Village Tour with Basket Boat ride.',
      'Hoi An Ancient Town Tour.',
      'Lantern boat ride on Hoai River.',
      'Full Day Bana Hill Tour with Cable Car and tickets to Golden Bridge, French Village, Fantasy Park (with rides).',
      'Sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per the program.',
      'Local English-speaking guides in Vietnam.',
      'Bottles of mineral water on the tour day.',
      'Fixed Airport Pickup & Drop.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹36,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '47',
    title: '6 Days Romantic Escape Vietnam Couple Special',
    slug: 'romantic-escape-vietnam-couple-special',
    image: '/images/vietnam-couple.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Indulge in a romantic 6-day couple's getaway discovering the charm and natural beauty of Vietnam. Begin with Hanoi's historic landmarks and unique Train Street. Take a peaceful boat ride through the scenic Hoa Lu and Tam Coc caves of Ninh Binh, often called the "Halong Bay on Land." Spend a magical night cruising along Halong Bay on a luxurious overnight cruise, kayaking through caves and watching the sunset. Fly to Saigon (Ho Chi Minh City) to explore the vibrant city life and take a scenic boat trip down the iconic Mekong Delta. A perfect, intimate escape tailored for couples.`,
    duration: 6,
    nights: 5,
    price: 35999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ninh Binh',
      'Saigao',
      'Mekong Delta'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Saigon (Ho Chi Minh City) → Mekong Delta',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Luxury Overnight Cruise, Mekong Delta Scenic Boat Ride.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi - Half-Day City Tour',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi, complete immigration, and meet our tour representative.',
          'Transfer to your romantic central hotel, check in, and refresh.',
          'Visit Tran Quoc Pagoda on West Lake and view the historic Ho Chi Minh Mausoleum complex.',
          'Experience the buzz of Hanoi Train Street, enjoying a cup of egg coffee beside the tracks.',
          'Enjoy a 1-hour romantic cyclo ride through the 36 Old Quarter streets and explore Ta Hien Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Full Day Tour To Ninh Binh – Hoa Lu – Tam Coc',
        description: [
          'Enjoy breakfast at the hotel and take a scenic drive south through rural landscapes to Ninh Binh.',
          'Board a traditional sampan boat for a serene cruise through the three limestone caves of Tam Coc ("Halong Bay on Land").',
          'Glide past emerald rivers, towering karst formations, and lush paddy fields.',
          'Relish a delicious local Vietnamese lunch at a riverside restaurant.',
          'Explore Hoa Lu, the 10th-century ancient capital of Vietnam, visiting the historic Dinh and Le king temples.',
          'Visit peaceful Bich Dong Pagoda built into a limestone cliff face before returning to Hanoi.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Transfer from Hanoi to Halong Bay. Overnight Stay on Cruise.',
        description: [
          'Enjoy breakfast at the hotel and travel through the scenic Red River Delta to Tuan Chau Marina.',
          'Board a luxury boutique overnight cruise across the emerald waters of UNESCO-listed Ha Long Bay.',
          'Relish a gourmet seafood lunch on board as you sail past towering limestone islands.',
          'Kayak or take a bamboo boat through hidden sea caves and swim in secluded emerald lagoons.',
          'Participate in a sunset cooking demonstration and enjoy happy hour cocktails on the sun deck.',
          'Savor a candlelit dinner on board followed by squid fishing or stargazing.',
          'Overnight stay on cruise in Ha Long Bay.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Halong Bay to Hanoi. Transfer From Hanoi to Saigon.',
        description: [
          'Greet the sunrise over Ha Long Bay with a morning Tai Chi session on the sun deck.',
          'Cruise past iconic islets including Butterfly Rock, Turtle Islet, and floating fishing villages.',
          'Enjoy an international buffet brunch on board as the ship glides back toward the harbour.',
          'Disembark at Tuan Chau Marina and transfer directly to Hanoi Airport.',
          'Board your domestic flight to vibrant Ho Chi Minh City (Saigon).',
          'Arrive in Saigon, meet your guide, and transfer to your hotel for check-in and evening leisure.',
          'Overnight stay in Saigon.',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 5,
        title: 'Full-Day Tour to Mekong Delta',
        description: [
          'Enjoy breakfast at the hotel and depart for My Tho in the fertile Mekong Delta.',
          'Board a private wooden motorboat and cruise along the mighty Mekong River.',
          'Sample fresh tropical fruits and listen to live southern Vietnamese folk music (Don Ca Tai Tu).',
          'Row through shaded coconut palm canals on small traditional sampans.',
          'Visit a local family-run coconut candy workshop and taste warm honey tea with royal jelly.',
          'Visit historic Vinh Trang Pagoda featuring unique Vietnamese, Khmer, and French colonial architecture.',
          'Return to Saigon in the late afternoon for an evening at leisure.',
          'Overnight stay in Saigon.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Departure from Saigon. Take back a lot of happy memories.',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Spend any remaining free time shopping for souvenirs at Ben Thanh Market.',
          'Board your private airport transfer to Tan Son Nhat International Airport for your departure flight.',
          'Depart Vietnam with cherished memories of your romantic escape together.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '05 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Overnight Cruise in Halong on SIC basis',
      'Full-Day Tour to Mekong Delta with Boat Ride',
      'To and Fro flights from Ahmedabad.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Halong Bay: Overnight Cruise / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹35,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '48',
    title: '8 Days Honeymoon Escape Vietnam Couple Special',
    slug: 'honeymoon-escape-vietnam-couple-special',
    image: '/images/vietnam-honeymoon.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Embark on a romantic 8-day honeymoon escape through the highlights of Vietnam. Stroll through Ba Dinh Square and Hanoi's Temple of Literature, and take a traditional 1-hour cyclo ride. Sail through the natural wonder of Ha Long Bay on a luxury overnight cruise with gourmet meals and kayaking. Travel to Da Nang and take a romantic walk through Hoi An Ancient Town, then ride the cable car to Ba Na Hills and stand on the famous Golden Bridge. End in dynamic Saigon (Ho Chi Minh City) with a historic city sightseeing tour and crawl through the legendary Cu Chi Tunnels. Specially designed for couples celebrating their love.`,
    duration: 8,
    nights: 7,
    price: 55999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Saigon City Tour',
      'Ho Chi Minh',
      'Hoi An Ancient Town',
      'Ha Long Bay Cruise',
      'Bana Hills',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Halong Bay → Hanoi → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City) → Cu Chi Tunnels',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi 1-hour Cyclo Tour & City Sights, Halong Bay Luxury Overnight Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Saigon Landmarks, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Cyclo Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and meet the local tour representative.',
          'Transfer to the hotel in downtown Hanoi for check-in and leisure time.',
          'Visit Ba Dinh Square, Ho Chi Minh Complex (Mausoleum exterior, house-on-stilts, fishpond), and One Pillar Pagoda.',
          'Explore the Temple of Literature (Van Mieu), Vietnam\'s first national university.',
          'Enjoy a 1-hour cyclo ride exploring the bustling French & Old Quarter and scenic Hoan Kiem Lake.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay | Luxury Overnight Cruise & Karst Exploration',
        description: [
          'Enjoy breakfast at the hotel and check out by 9:00 AM.',
          'Drive east through the Red River Delta countryside and rural villages towards Halong Bay (approx. 3 hours).',
          'Board the luxury Halong Bay cruise, receive a welcome briefing, and check in to your cabin.',
          'Savor a gourmet buffet lunch while sailing past iconic limestone karsts and islets.',
          'Visit limestone grottos and enjoy swimming or kayaking through tranquil emerald waters.',
          'Attend a Vietnamese cooking demonstration on the sundeck followed by a multi-course dinner.',
          'Spend the evening relaxing on board, squid fishing, or enjoying onboard entertainment.',
          'Overnight stay in Halong Bay Cruise.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay to Hanoi | Sunrise Cruise & Return to Hanoi',
        description: [
          'Wake up early for sunrise over the Eastern Sea and an optional morning Tai Chi session on deck.',
          'Cruise past famous karst formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Enjoy a hearty brunch on board as the cruise sails back toward the harbor.',
          'Disembark at Tuan Chau pier and transfer by road back to Hanoi.',
          'Check in to your hotel in Hanoi and enjoy the evening at leisure exploring local cafes and night markets.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Flight Transfer & Hoi An Ancient Town Tour',
        description: [
          'Have breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local representative upon arrival and check in to your beachside hotel.',
          'Transfer to the UNESCO World Heritage town of Hoi An in the afternoon.',
          'Take a guided walking tour across the Japanese Covered Bridge, Chinese Assembly Halls, and historic merchant houses.',
          'Stroll along the lantern-lit Thu Bon River and vibrant night market, with opportunities for custom tailoring and souvenir shopping.',
          'Transfer back to Da Nang for the night.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Enjoy breakfast at the hotel and depart for the scenic Ba Na Hills.',
          'Ride the world-record cable car up to 1,487m above sea level, enjoying sweeping views of Da Nang.',
          'Walk across the world-famous Golden Bridge held aloft by giant stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, Linh Ung Pagoda, and the giant Buddha statue.',
          'Enjoy thrilling rides, carnival games, and 4D/5D experiences at Fantasy Park.',
          'Visit Nghinh Phong Tower and the Bell Tower at the mountain summit before riding the cable car down.',
          'Return to Da Nang and spend the evening relaxing by My Khe Beach.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Saigon City Landmarks',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Da Nang Airport.',
          'Board a flight to Ho Chi Minh City (Saigon) and transfer to your downtown hotel for check-in.',
          'Visit the War Remnants Museum to explore historic military exhibits, photographs, and artifacts.',
          'Tour the historic Reunification Palace, the former presidential headquarters of South Vietnam.',
          'Admire French colonial landmarks including Notre Dame Cathedral (exterior) and the Central Post Office.',
          'Browse local handicrafts, textiles, and street food at the iconic Ben Thanh Market.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Have breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the guerrilla defense network built during the war.',
          'Explore the underground network featuring trap doors, living quarters, weapon workshops, and command bunkers.',
          'Experience crawling through a preserved tunnel section to appreciate the resilience of the fighters.',
          'Return to Ho Chi Minh City for an afternoon at leisure for shopping or relaxation.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at your hotel and spend the morning at leisure for last-minute souvenir shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your scheduled flight back home with unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '6 nights accommodation based on double/twin sharing room in Hanoi, Danang and Ho Chi Minh city',
      '1-night cruise stay based on twin sharing cabin on non-private junk in Halong Bay (shuttle bus round trip transfer)',
      'A total of 10 meals ( Day 2- B+ L+D, Day 3- B+ Brunch, Day 4- B , Day 5- B, Day 6- B, Day 7- B, Day 8 B ) are included.',
      'All entrance fees and sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per program',
      'Local English-speaking guides in Vietnam.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Halong Bay: Overnight Cruise / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹55,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '49',
    title: '9 Days Beauty Of Vietnam Couple Trip',
    slug: 'beauty-of-vietnam-couple-trip',
    image: '/images/vietnam-beauty.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Discover the true beauty of Vietnam on an unforgettable 9-day romantic couple's trip. Travel from the historic streets of Hanoi to the UNESCO World Heritage Site of Halong Bay for an overnight luxury cruise. Fly to Da Nang to take a sunset walk through Hoi An Ancient Town and visit the spectacular Ba Na Hills to see the iconic Golden Bridge. Complete your romance in dynamic Saigon (Ho Chi Minh City) with a scenic Mekong Delta boat excursion and a visit to the historic Cu Chi Tunnels. A perfect tour combining nature, history, and intimate travel experiences.`,
    duration: 9,
    nights: 8,
    price: 65999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Saigon City Tour',
      'Ho Chi Minh',
      'Hoi An Ancient Town',
      'Ha Long Bay Cruise',
      'Bana Hills',
      'Mekong Delta',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Halong Bay → Hanoi → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City) → Mekong Delta → Cu Chi Tunnels',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi 1-hour Cyclo Tour & City Sights, Halong Bay Luxury Overnight Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Saigon Landmarks, Mekong Delta Boat Excursion, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Cyclo Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and meet your local tour representative.',
          'Transfer to the hotel in downtown Hanoi for check-in and relaxation.',
          'Visit Ba Dinh Square, Ho Chi Minh Complex (Mausoleum exterior, stilt house, fishpond), and One Pillar Pagoda.',
          'Explore the historic Temple of Literature, Vietnam\'s first national university.',
          'Experience a 1-hour traditional cyclo ride exploring Hanoi\'s bustling Old Quarter and scenic Hoan Kiem Lake.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay | Luxury Overnight Cruise & Karst Exploration',
        description: [
          'Enjoy breakfast at the hotel, check out, and depart eastward for Halong Bay (approx. 3 hours).',
          'Drive through the lush Red River Delta with scenic views of countryside rice fields.',
          'Board the luxury cruise at Halong Bay pier, attend a welcome briefing, and check in to your cabin.',
          'Relish a delectable seafood lunch while sailing past iconic limestone karsts and islets.',
          'Explore hidden limestone caves and enjoy kayaking or swimming in emerald waters.',
          'Attend a Vietnamese cooking demonstration on the sundeck followed by a gourmet dinner.',
          'Overnight stay in Halong Bay Cruise.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay to Hanoi | Sunrise Cruise & Return to Hanoi',
        description: [
          'Wake up early to witness a breathtaking sunrise over the bay and join an optional Tai Chi session.',
          'Cruise past notable islets including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Savor an early brunch on board while cruising back towards Tuan Chau pier.',
          'Disembark and transfer by road back to Hanoi to check in at your hotel.',
          'Spend the evening at leisure exploring Hanoi\'s night markets, cafes, and street food scene.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Flight Transfer & Hoi An Ancient Town Tour',
        description: [
          'Have breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local representative upon arrival and check in to your beachside hotel.',
          'Transfer to the UNESCO World Heritage town of Hoi An in the afternoon.',
          'Take a walking tour across the 400-year-old Japanese Covered Bridge, Chinese Assembly Halls, and historic merchant houses.',
          'Stroll through the lantern-lit streets along Thu Bon River and explore local handicraft markets.',
          'Transfer back to Da Nang for an overnight stay.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Enjoy breakfast at the hotel and proceed to the scenic Ba Na Hills.',
          'Ride the world-record cable car ascending 1,487m above sea level with panoramic mountain views.',
          'Walk across the world-famous Golden Bridge held up by giant stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy thrilling rides and games at Fantasy Park, and visit Nghinh Phong Tower at the peak.',
          'Ride the cable car down and return to Da Nang for an evening at leisure by the beach.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Saigon City Landmarks',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Da Nang Airport.',
          'Board a flight to Ho Chi Minh City (Saigon) and transfer to your downtown hotel for check-in.',
          'Visit the War Remnants Museum to learn about Vietnam\'s wartime history and heroic resistance.',
          'Tour the historic Reunification Palace, a premier symbol of the end of the Vietnam War.',
          'Admire classic French colonial architecture at Notre Dame Cathedral (exterior) and the Central Post Office.',
          'Explore the vibrant Ben Thanh Market for local souvenirs, handicrafts, and delicacies.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Mekong Delta Excursion | River Cruise & Island Culture',
        description: [
          'Savor breakfast at the hotel and travel south towards My Tho in the Mekong Delta.',
          'Board a motorboat cruise along the Mekong River, observing floating houses and riverbank life.',
          'Visit a lush fruit orchard on an island to taste fresh tropical fruits while listening to Southern Vietnamese folk music.',
          'Take a scenic rowboat ride along narrow palm-shaded canals and visit local coconut candy and honey workshops.',
          'Visit the historic Vinh Trang Pagoda, showcasing a unique blend of Asian and European architectural styles.',
          'Return to Ho Chi Minh City in the late afternoon and enjoy an evening stroll along Nguyen Hue Walking Street.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Enjoy breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the extensive underground network built during the war.',
          'Explore the multi-tiered tunnel system featuring trap doors, living quarters, weapon workshops, and field hospitals.',
          'Experience crawling through a designated safe section of the underground tunnels.',
          'Return to Ho Chi Minh City for an afternoon at leisure for shopping and relaxation.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at your hotel and spend free time at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your departure flight back home carrying unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance on airport',
      'Local english-speaking guide/driver in Vietnam',
      '8 nights accommodation in double/twin sharing rooms (2 nights in Hanoi, 2 nights in Danang, 3 nights in Ho Chi Minh city and 1 night cruise stay in Halong Bay)',
      'Meals Included - 8 breakfasts (Day 2-7), 1 Lunch & 1 Dinner (Day 2), 1 Brunch (Day 3)',
      'All entrance fees and sightseeing as mentioned in the itinerary',
      'Transportation by vehicle with A/C as per itinerary',
      'Travel assistance'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Halong Bay: Overnight Cruise / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹65,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '50',
    title: '8 Days Dreamy Escape Vietnam Couple Special Trip',
    slug: 'dreamy-escape-vietnam-couple-special-trip',
    image: '/images/vietnam-dreamy.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Experience the magic of Vietnam on a romantic 8-day couple's dreamy escape. Begin with a historic Hanoi city tour and unique Train Street experience. Drive to Ninh Binh to visit the ancient capital of Hoa Lu and take a scenic boat trip through Tam Coc Caves. Enjoy a wonderful day cruise along the limestone karsts of Halong Bay with a delicious lunch onboard. Fly to Da Nang to stroll through the charming streets of Hoi An Ancient Town and ride the cable car to the summit of Ba Na Hills to see the famous Golden Bridge. Conclude your trip in Saigon (Ho Chi Minh City) with leisure time for shopping or nightlife. A dreamy getaway designed for couples.`,
    duration: 8,
    nights: 7,
    price: 35999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ninh Binh',
      'Ha Long Bay',
      'Bana Hills',
      'Hoi An Ancient Town',
      'Ho Chi Minh',
      'Da Nang',
      'Saigao'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City)',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Day Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Saigon Sights.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Meet your driver and transfer to the downtown hotel for check-in and leisure.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist temple in Hanoi set beside the tranquil West Lake.',
          'Experience the famous Hanoi Train Street with cafes perched along active railroad tracks.',
          'Visit the Ho Chi Minh Mausoleum and the unique lotus-shaped One Pillar Pagoda.',
          'Explore the bustling Old Quarter markets, Beer Street (Ta Hien), and Hanoi Night Market.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour | Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Enjoy breakfast at the hotel and drive south towards Ninh Binh province (approx. 90 km).',
          'Embark on a traditional sampan boat ride through the scenic limestone caves of Tam Coc ("Halong Bay on Land").',
          'Savor a local Vietnamese buffet lunch at a restaurant in Ninh Binh.',
          'Visit Hoa Lu, the ancient 10th-century capital of Vietnam, exploring the historic Dinh and Le temples.',
          'Admire the serene Bich Dong Pagoda nestled against limestone mountains.',
          'Drive back to Hanoi in the late afternoon and enjoy an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Day Cruise | Limestone Karsts & Grottoes',
        description: [
          'Have breakfast at your hotel and depart by road for Halong Bay (approx. 3.5 hours).',
          'Arrive at Tuan Chau Marina and board a 4-hour scenic Halong Bay day cruise.',
          'Cruise past iconic limestone formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Explore natural limestone grottos and cruise past floating fishing villages.',
          'Savor a freshly prepared Vietnamese seafood lunch on board the cruise.',
          'Disembark at the marina and transfer back to Hanoi for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Coastal Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local tour representative upon arrival.',
          'Transfer to your beachside hotel in Da Nang for check-in and relaxation.',
          'Spend the afternoon and evening at leisure exploring My Khe Beach, local markets, or the Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Have breakfast at the hotel and transfer to the scenic Ba Na Hills resort.',
          'Ascend via the world-record cable car to 1,487m above sea level with panoramic views.',
          'Walk across the iconic Golden Bridge supported by colossal stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy exciting rides, arcade games, and 4D/5D attractions at Fantasy Park.',
          'Visit Nghinh Phong Tower and Bell Tower before taking the cable car back down to the foothill.',
          'Return to Da Nang for a relaxing evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Tour | UNESCO World Heritage Walking Tour',
        description: [
          'Enjoy breakfast at the hotel and depart for a full-day tour to the UNESCO-listed ancient town of Hoi An.',
          'Take a walking tour across the 17th-century Japanese Covered Bridge and visit historic Chinese Assembly Halls.',
          'Explore ancient timber merchant houses and listen to traditional folk music at old town clubhouses.',
          'Stroll along the scenic Thu Bon River and vibrant night market with custom tailor shops and lantern displays.',
          'Transfer back to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Flight Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Fly to Ho Chi Minh City (Saigon) and transfer with your representative to the downtown hotel.',
          'Check in to your hotel and spend the afternoon and evening at leisure.',
          'Explore top Saigon landmarks, shop at the bustling Ben Thanh Market, or experience the nightlife on Bui Vien Street.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Have breakfast at the hotel and spend free time at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your departure flight back home with wonderful memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '07 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Lunch Cruise in Halong on SIC basis',
      'Bana Hill Cable Car Tickets',
      'Full-Day Tour to Bana Hills',
      'Full-Day Tour to Ancient Town of Hoi An.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹35,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '51',
    title: '9 Days Luxury Vietnam Couple Getaway',
    slug: 'luxury-vietnam-couple-getaway',
    image: '/images/vietnam-luxury-couple.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Indulge in a romantic and luxurious 9-day couple's getaway exploring Vietnam's most iconic destinations. Start your journey with a half-day tour of Hanoi and its famous Train Street. Spend a full day exploring Ninh Binh's Hoa Lu and cruising through the beautiful Tam Coc caves. Embark on a scenic Halong Bay day cruise with a delicious lunch. Fly to Da Nang to visit the scenic Ba Na Hills and Golden Hands Bridge, and take a guided walk in the ancient town of Hoi An. End in Saigon with a premium full-day Mekong Delta boat tour and local sightseeing. Designed to combine comfort and magic.`,
    duration: 9,
    nights: 8,
    price: 65999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ninh Binh',
      'Ha Long Bay',
      'Bana Hills',
      'Hoi An Ancient Town',
      'Ho Chi Minh',
      'Da Nang',
      'Saigao'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City)',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Day Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Mekong Delta Full-Day Tour.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Transfer to the downtown hotel for check-in and leisure time.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist pagoda in Hanoi located on the West Lake.',
          'Experience the thrill of Hanoi Train Street with vibrant cafes along the railway tracks.',
          'Visit the Ho Chi Minh Mausoleum complex and the historic lotus-shaped One Pillar Pagoda.',
          'Explore the bustling Old Quarter markets, Beer Street, and the lively Hanoi Night Market.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour | Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Enjoy breakfast at the hotel and depart on a scenic drive to Ninh Binh province (approx. 90 km).',
          'Take a relaxing sampan boat ride through the majestic limestone caves of Tam Coc.',
          'Savor a traditional Vietnamese lunch at a local restaurant in Ninh Binh.',
          'Tour Hoa Lu, the 10th-century ancient capital of Vietnam, visiting the historic Dinh and Le temples.',
          'Visit the tranquil Bich Dong Pagoda nestled into the mountainside.',
          'Return to Hanoi in the late afternoon and spend the evening exploring local cafes and street food.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Day Cruise | Limestone Karsts & Grottoes',
        description: [
          'Enjoy breakfast at your hotel and depart by road for Halong Bay (approx. 3.5 hours).',
          'Arrive at Tuan Chau Marina and board a 4-hour scenic Halong Bay day cruise.',
          'Cruise past iconic limestone formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Explore natural limestone caves and cruise past floating fishing villages.',
          'Relish a freshly prepared Vietnamese lunch served on board the cruise.',
          'Disembark at the marina and transfer back to Hanoi for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Coastal Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local tour representative upon arrival.',
          'Transfer to your hotel in Da Nang for check-in and relaxation.',
          'Spend the afternoon and evening at leisure exploring My Khe Beach, local markets, or the illuminated Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Have breakfast at the hotel and transfer to the scenic Ba Na Hills resort.',
          'Ascend via the world-record cable car to 1,487m above sea level with panoramic views.',
          'Walk across the iconic Golden Bridge supported by colossal stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy exciting rides, arcade games, and 4D/5D attractions at Fantasy Park.',
          'Visit Nghinh Phong Tower and Bell Tower before taking the cable car back down to the foothill.',
          'Return to Da Nang for a relaxing evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Tour | UNESCO World Heritage Walking Tour',
        description: [
          'Enjoy breakfast at the hotel and depart for a full-day tour to the UNESCO-listed ancient town of Hoi An.',
          'Take a walking tour across the 17th-century Japanese Covered Bridge and visit historic Chinese Assembly Halls.',
          'Explore ancient timber merchant houses and listen to traditional folk music at old town clubhouses.',
          'Stroll along the scenic Thu Bon River and vibrant night market with custom tailor shops and lantern displays.',
          'Transfer back to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Flight Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Fly to Ho Chi Minh City (Saigon) and transfer with your representative to the downtown hotel.',
          'Check in to your hotel and spend the afternoon and evening at leisure.',
          'Explore top Saigon landmarks, shop at the bustling Ben Thanh Market, or experience the nightlife on Bui Vien Street.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Mekong Delta Excursion | River Cruise & Island Culture',
        description: [
          'Enjoy breakfast at the hotel and depart for My Tho in the scenic Mekong Delta.',
          'Board a motorized boat to cruise along the river, observing floating fish farms and river life.',
          'Visit an island orchard to sample fresh tropical fruits while enjoying traditional folk music.',
          'Row along narrow palm-fringed canals on a wooden sampan and visit local honeybee and coconut candy workshops.',
          'Visit the historic Vinh Trang Pagoda, known for its unique blend of Asian and European architecture.',
          'Return to Ho Chi Minh City in the evening for an overnight stay.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend free time at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your departure flight back home with unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '08 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Lunch Cruise in Halong on SIC basis',
      'Bana Hill Cable Car Tickets',
      'Full-Day Tour to Bana Hills',
      'Full-Day Tour to Ancient Town of Hoi An',
      'Full-Day Tour to Mekong Delta with Boat Ride'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹65,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '52',
    title: '6 Day Exotic Vietnam Couple Special Trip',
    slug: 'exotic-vietnam-couple-special-trip',
    image: '/images/vietnam-exotic.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Indulge in a romantic 6-day exotic couple's getaway discovering the charm and natural beauty of Vietnam. Start with Hanoi's historic landmarks, including a 1-hour cyclo tour around the Old Quarter. Board an overnight luxury cruise along Halong Bay, a UNESCO World Heritage Site. Fly to Saigon (Ho Chi Minh City) to explore the War Remnants Museum and the Reunification Palace, and visit the historic Cu Chi Tunnels. A perfect short escape designed for couples.`,
    duration: 6,
    nights: 5,
    price: 32999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Saigon City Tour',
      'Ho Chi Minh',
      'Hoi An Ancient Town',
      'Ha Long Bay Cruise',
      'Bana Hills',
      'Cu Chi Tunnel'
    ],
    overviewPoints: [
      'Route: Hanoi → Halong Bay → Hanoi → Saigon (Ho Chi Minh City) → Cu Chi Tunnels',
      'Duration: 5 Nights / 6 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi 1-hour Cyclo Tour & City Tour, Halong Bay Luxury Overnight Cruise, Saigon Landmarks, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Cyclo Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and meet the local tour representative.',
          'Transfer to the downtown hotel for check-in and leisure time.',
          'Visit Ba Dinh Square, Ho Chi Minh Complex (Mausoleum exterior, house-on-stilts, fishpond), and One Pillar Pagoda.',
          'Explore the Temple of Literature (Van Mieu), Vietnam\'s first national university.',
          'Enjoy a 1-hour cyclo ride exploring Hanoi\'s vibrant Old Quarter and scenic Hoan Kiem Lake.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay | Luxury Overnight Cruise & Karst Exploration',
        description: [
          'Enjoy breakfast at the hotel, check out, and depart eastward for Halong Bay (approx. 3 hours).',
          'Drive through the lush Red River Delta with views of countryside farms and paddy fields.',
          'Board the luxury cruise at Halong Bay, receive a welcome briefing, and settle into your cabin.',
          'Savor a gourmet buffet lunch while cruising past magnificent karst peaks and islets.',
          'Explore limestone caves and enjoy swimming or kayaking in emerald waters.',
          'Attend a Vietnamese cooking demonstration on the sundeck followed by a multi-course dinner.',
          'Overnight stay in Halong Bay Cruise.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay to Hanoi | Sunrise Cruise & Return to Hanoi',
        description: [
          'Wake up early to catch the sunrise over the bay and join an optional Tai Chi session on deck.',
          'Cruise past notable formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Enjoy a hearty brunch on board as the cruise sails back toward the harbor.',
          'Disembark at Tuan Chau pier and transfer by road back to Hanoi.',
          'Check in to your hotel in Hanoi and enjoy the evening exploring local night markets and cafes.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Ho Chi Minh City (Saigon) | Saigon City Landmarks',
        description: [
          'Have breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Ho Chi Minh City (Saigon) and transfer to your downtown hotel for check-in.',
          'Visit the War Remnants Museum to explore historic military exhibits, photographs, and artifacts.',
          'Tour the historic Reunification Palace, the former presidential headquarters of South Vietnam.',
          'Admire French colonial landmarks including Notre Dame Cathedral (exterior) and the Central Post Office.',
          'Browse local handicrafts, textiles, and street food at the iconic Ben Thanh Market.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Enjoy breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the guerrilla defense network built during the war.',
          'Explore the underground network featuring trap doors, living quarters, weapon workshops, and command bunkers.',
          'Experience crawling through a preserved tunnel section to appreciate the resilience of the fighters.',
          'Return to Ho Chi Minh City for an afternoon at leisure for shopping or relaxation.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at your hotel and spend the morning at leisure for last-minute souvenir shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your scheduled flight back home with unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '4 nights accommodation based on double/twin sharing room (2 nights in Hanoi and 3 nights in Ho Chi Minh city).',
      '1-night cruise stay based on twin sharing cabin on non-private junk in Halong Bay (shuttle bus round trip transfer)',
      'A total of 8 meals ( Day 2- B+ L+ D, Day 3- B+ Brunch , Day 4- B , Day 5- B, Day 6- B, Day 7- B ) are included.',
      'All entrance fees and sightseeing as mentioned in the program',
      'Transportation by vehicle with A/C as per program',
      'Local English-speaking guides in Vietnam.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹32,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '53',
    title: '7 Days Family Vietnam Vacation',
    slug: 'family-vietnam-vacation',
    image: '/images/vietnam-family.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Create lifelong memories with your loved ones on this premium 7-day family vacation to Vietnam. Start with a cultural sightseeing tour of Hanoi's oldest temples and a fun walk down the iconic Train Street. Discover the scenic ancient capital of Hoa Lu and boat through the limestone karsts of Ninh Binh. Experience a magic overnight luxury cruise in Halong Bay, featuring swimming, kayaking, and culinary activities. Fly to dynamic Saigon (Ho Chi Minh City) for a family boat excursion along the Mekong Delta and a historic visit to the Cu Chi Tunnels. The perfect balanced adventure for families.`,
    duration: 7,
    nights: 6,
    price: 40999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ninh Binh',
      'Saigao',
      'Mekong Delta'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Saigon (Ho Chi Minh City) → Mekong Delta → Cu Chi Tunnels',
      'Duration: 6 Nights / 7 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Overnight Luxury Cruise, Mekong Delta Boat Excursion, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Meet your driver and transfer to the downtown hotel for check-in and leisure.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist temple in Hanoi located on the tranquil West Lake.',
          'Experience the famous Hanoi Train Street with trackside cafes and unique street vibes.',
          'Visit the Ho Chi Minh Mausoleum complex and the iconic lotus-shaped One Pillar Pagoda.',
          'Explore the vibrant Old Quarter, shop for local souvenirs, and enjoy the nightlife on Beer Street.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour | Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Enjoy breakfast at the hotel and depart on a 90 km scenic drive south to Ninh Binh province.',
          'Embark on a traditional sampan boat ride through the stunning limestone caves of Tam Coc.',
          'Savor a delicious buffet lunch featuring local Vietnamese delicacies.',
          'Visit Hoa Lu, the 10th-century ancient capital of Vietnam, and explore the Dinh and Le dynasty temples.',
          'Admire the serene Bich Dong Pagoda nestled into the mountain cliffside.',
          'Return by road to Hanoi in the late afternoon for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Halong Bay | Luxury Overnight Cruise & Karst Exploration',
        description: [
          'Enjoy breakfast at the hotel, check out, and depart at 9:00 AM for Halong Bay (approx. 3 hours).',
          'Drive through the lush Red River Delta countryside with views of rural farming communities.',
          'Arrive at Tuan Chau Marina, board your luxury overnight cruise, and check in to your cabin.',
          'Relish a delectable seafood lunch while sailing past majestic karst formations and islets.',
          'Explore limestone grottos and enjoy swimming or kayaking through emerald waters.',
          'Attend a Vietnamese cooking demonstration on the sundeck and watch a picturesque sunset.',
          'Savor a gourmet dinner on board and spend the evening enjoying squid fishing or music.',
          'Overnight stay in Halong Bay Cruise.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Halong Bay to Hanoi & Flight to Ho Chi Minh City | Coastal to Metropolis Transfer',
        description: [
          'Wake up early to catch the sunrise over the bay and join an optional Tai Chi session.',
          'Cruise past notable rock formations including Sail Island, Fisherman\'s Head Rock, and Turtle Islet.',
          'Explore hidden caves and floating fishing villages before savoring a delicious brunch on board.',
          'Disembark at the marina and transfer by road to Hanoi Airport.',
          'Board a domestic flight to Ho Chi Minh City (Saigon) and transfer to your downtown hotel for check-in.',
          'Spend the evening at leisure exploring local streets or shopping at Ben Thanh Market.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 5,
        title: 'Mekong Delta Excursion | River Cruise & Island Culture',
        description: [
          'Enjoy breakfast at the hotel and depart for My Tho in the picturesque Mekong Delta.',
          'Board a motorized boat cruise on the Mekong River, observing floating fish farms and river life.',
          'Stop at an island orchard to sample sweet tropical fruits while enjoying Southern Vietnamese folk music.',
          'Row through narrow, palm-shaded canals on small sampans and visit local honeybee and coconut candy workshops.',
          'Visit the historic Vinh Trang Pagoda, admiring its ornate fusion of Chinese, Cambodian, and French architecture.',
          'Transfer back to Ho Chi Minh City in the late afternoon for an evening at leisure.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Have breakfast at the hotel and transfer to the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the guerrilla warfare and tunnel construction.',
          'Explore the underground network featuring trap doors, living quarters, weapon workshops, and field hospitals.',
          'Experience crawling through a designated preserved tunnel section.',
          'Enjoy a traditional lunch at a local restaurant before returning to Ho Chi Minh City.',
          'Spend the evening exploring vibrant markets, rooftop lounges, or the nightlife on Bui Vien Street.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and complete check-out formalities.',
          'Board your transfer to Tan Son Nhat International Airport in Ho Chi Minh City.',
          'Board your flight back home carrying fond memories of your Vietnam family holiday.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '06 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Overnight Cruise in Halong on SIC basis',
      'Half-Day Excursion to Chu Chi Tunnels on SIC basis',
      'Full-Day Tour to Mekong Delta with Boat Ride'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Halong Bay: Overnight Cruise / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹40,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '54',
    title: '8 Days Best Of Vietnam Family Vacation',
    slug: 'best-of-vietnam-family-vacation',
    image: '/images/vietnam-family-best.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Embark on the ultimate 8-day family vacation showcasing the very best of Vietnam. Start with a historic city tour of Hanoi and experience its unique Train Street. Enjoy a magical overnight cruise in Halong Bay with a cooking demonstration and water activities. Fly to Da Nang to stroll through the charming streets of Hoi An Ancient Town and ride the cable car to Ba Na Hills to see the iconic Golden Bridge. Finish your journey in dynamic Saigon (Ho Chi Minh City) with local sightseeing and a tour of the historic Cu Chi Tunnels. A perfect balanced trip for the entire family.`,
    duration: 8,
    nights: 7,
    price: 45999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ha Long Bay Cruise',
      'Bana Hills & Golden Gate Bridge',
      'Hoi An Ancient Town',
      'Ho Chi Minh',
      'Saigao'
    ],
    overviewPoints: [
      'Route: Hanoi → Halong Bay → Hanoi → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City) → Cu Chi Tunnels',
      'Duration: 7 Nights / 8 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Sights, Halong Bay Luxury Overnight Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Saigon Landmarks, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Meet your driver and transfer to the downtown hotel for check-in and leisure.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist temple in Hanoi located on West Lake.',
          'Experience Hanoi Train Street with vibrant cafes along the railway tracks.',
          'Visit the Ho Chi Minh Mausoleum complex and the lotus-shaped One Pillar Pagoda.',
          'Explore the Old Quarter, shop for local souvenirs, and enjoy the evening at Beer Street and the night market.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay | Luxury Overnight Cruise & Karst Exploration',
        description: [
          'Enjoy breakfast at the hotel, check out, and depart at 9:00 AM for Halong Bay (approx. 3 hours).',
          'Drive through the lush Red River Delta countryside with views of rural paddy fields and villages.',
          'Arrive at Tuan Chau Marina, board your luxury overnight cruise, and check in to your cabin.',
          'Savor a gourmet buffet lunch while sailing past iconic karst formations and islets.',
          'Explore limestone grottos and enjoy swimming or kayaking in emerald waters.',
          'Attend a Vietnamese cooking demonstration on the sundeck followed by a multi-course dinner.',
          'Spend the evening relaxing on board or participating in squid fishing.',
          'Overnight stay in Halong Bay Cruise.',
          'Meals: Breakfast, Lunch & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay to Hanoi | Sunrise Cruise & Return to Hanoi',
        description: [
          'Rise early for sunrise over the bay and an optional morning Tai Chi session on the sundeck.',
          'Cruise past famous karst formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Check out of your cabin and enjoy a hearty brunch on board as the ship cruises back to the harbor.',
          'Disembark at the pier and transfer by road back to Hanoi.',
          'Check in to your hotel and enjoy the evening at leisure exploring Hanoi\'s lively streets and cafes.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Brunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Flight Transfer & Hoi An Ancient Town Tour',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local tour guide upon arrival and check in to your beachside hotel.',
          'Transfer to the UNESCO World Heritage town of Hoi An in the afternoon.',
          'Take a guided walking tour across the 400-year-old Japanese Covered Bridge, Chinese Assembly Halls, and historic merchant houses.',
          'Stroll along the lantern-lit Thu Bon River and vibrant night market, with opportunities for custom tailoring and shopping.',
          'Transfer back to Da Nang for the night.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Enjoy breakfast at the hotel and depart for the scenic Ba Na Hills.',
          'Ride the world-record cable car ascending 1,487m above sea level with panoramic mountain views.',
          'Walk across the iconic Golden Bridge held aloft by giant stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy exciting rides and entertainment at Fantasy Park, and visit Nghinh Phong Tower and Bell Tower at the summit.',
          'Take the cable car back down to the foothill and return to Da Nang for an evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Saigon City Landmarks',
        description: [
          'Have breakfast at the hotel, check out, and transfer to Da Nang Airport.',
          'Fly to Ho Chi Minh City (Saigon) and transfer with your representative to the downtown hotel for check-in.',
          'Visit the War Remnants Museum to explore historic military exhibits, photographs, and artifacts.',
          'Tour the historic Reunification Palace, the former presidential headquarters of South Vietnam.',
          'Admire French colonial landmarks including Notre Dame Cathedral (exterior) and the Central Post Office.',
          'Explore the bustling Ben Thanh Market for local souvenirs, handicrafts, and delicacies.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Enjoy breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the guerrilla defense network built during the war.',
          'Explore the underground network featuring trap doors, living quarters, weapon workshops, and command bunkers.',
          'Experience crawling through a preserved tunnel section to appreciate the resilience of the fighters.',
          'Enjoy lunch at a local restaurant and return to Ho Chi Minh City for an afternoon at leisure.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend the morning at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your departure flight back home carrying wonderful memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '6-night accommodation based on twin sharing room.',
      '1-night cruise based on twin sharing cabin on non-private junk in Halong Bay.',
      'Meals as mentioned in the program. B-Breakfast, Br-Brunch, L-Lunch, D-Dinner .',
      'All entrance fees and sightseeing as mentioned in the program.',
      'Transportation by vehicle with A/C as per program.',
      'Local English speaking guides in Vietnam.',
      'Bottles of mineral water on tour day.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Halong Bay: Overnight Cruise / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹45,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '55',
    title: '10 Days Exciting Vietnam Family Trip',
    slug: 'exciting-vietnam-family-trip',
    image: '/images/vietnam-family-exciting.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Treat your family to an exciting 10-day vacation exploring the treasures of Vietnam. Discover Hanoi's oldest pagoda and walk down the thrilling Train Street. Spend a day in Ninh Binh to visit the ancient temples of Hoa Lu and take a scenic rowboat ride through Tam Coc Caves. Take a relaxing day cruise along the limestone formations of Halong Bay with a delicious lunch. Fly to Da Nang to stroll Hoi An Ancient Town and visit the spectacular Ba Na Hills and Golden Bridge. Complete your holiday in dynamic Saigon (Ho Chi Minh City) with a Mekong Delta boat excursion and a visit to the historic Cu Chi Tunnels. An unforgettable experience for all ages.`,
    duration: 10,
    nights: 9,
    price: 65999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ha Long Bay Cruise',
      'Bana Hills & Golden Gate Bridge',
      'Hoi An Ancient Town',
      'Ho Chi Minh',
      'Saigao'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City) → Mekong Delta → Cu Chi Tunnels',
      'Duration: 9 Nights / 10 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Day Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Mekong Delta Boat Excursion, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Transfer to the downtown hotel for check-in and leisure time.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist pagoda in Hanoi located on the West Lake.',
          'Experience the thrill of Hanoi Train Street with vibrant cafes along the active railway tracks.',
          'Visit the Ho Chi Minh Mausoleum complex and the historic lotus-shaped One Pillar Pagoda.',
          'Explore the bustling Old Quarter markets, Beer Street, and the lively Hanoi Night Market.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour | Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Enjoy breakfast at the hotel and depart on a scenic 90 km drive to Ninh Binh province.',
          'Take a relaxing sampan boat ride through the majestic limestone caves of Tam Coc ("Halong Bay on Land").',
          'Savor a traditional Vietnamese lunch at a local restaurant in Ninh Binh.',
          'Tour Hoa Lu, the 10th-century ancient capital of Vietnam, exploring the historic Dinh and Le temples.',
          'Visit the tranquil Bich Dong Pagoda nestled into the mountain cliffside.',
          'Return to Hanoi in the late afternoon and spend the evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Day Cruise | Limestone Karsts & Grottoes',
        description: [
          'Have breakfast at your hotel and depart by road for Halong Bay (approx. 3.5 hours).',
          'Arrive at Tuan Chau Marina and board a 4-hour scenic Halong Bay day cruise.',
          'Cruise past iconic limestone formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Explore natural limestone caves and cruise past floating fishing villages.',
          'Savor a freshly prepared Vietnamese seafood lunch served on board.',
          'Disembark at the marina and transfer back to Hanoi for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Coastal Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local tour representative upon arrival.',
          'Transfer to your beachside hotel in Da Nang for check-in and relaxation.',
          'Spend the afternoon and evening at leisure exploring My Khe Beach, local markets, or the illuminated Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Have breakfast at the hotel and transfer to the scenic Ba Na Hills resort.',
          'Ascend via the world-record cable car to 1,487m above sea level with panoramic mountain views.',
          'Walk across the iconic Golden Bridge supported by colossal stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy exciting rides, arcade games, and 4D/5D attractions at Fantasy Park.',
          'Visit Nghinh Phong Tower and Bell Tower before taking the cable car back down to the foothill.',
          'Return to Da Nang for a relaxing evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Tour | UNESCO World Heritage Walking Tour',
        description: [
          'Enjoy breakfast at the hotel and depart for a full-day tour to the UNESCO-listed ancient town of Hoi An.',
          'Take a walking tour across the 17th-century Japanese Covered Bridge and visit historic Chinese Assembly Halls.',
          'Explore ancient timber merchant houses and listen to traditional folk music at old town clubhouses.',
          'Stroll along the scenic Thu Bon River and vibrant night market with custom tailor shops and lantern displays.',
          'Transfer back to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Flight Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Fly to Ho Chi Minh City (Saigon) and transfer with your representative to the downtown hotel for check-in.',
          'Spend the afternoon and evening at leisure exploring Saigon\'s vibrant streets, cafes, or Ben Thanh Market.',
          'Experience the bustling nightlife along Bui Vien Walking Street or Nguyen Hue Boulevard.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Mekong Delta Excursion | River Cruise & Island Culture',
        description: [
          'Enjoy breakfast at the hotel and depart for My Tho in the scenic Mekong Delta.',
          'Board a motorized boat to cruise along the Mekong River, observing floating fish farms and river life.',
          'Visit an island orchard to sample fresh tropical fruits while enjoying traditional Southern folk music.',
          'Row along narrow palm-fringed canals on a wooden sampan and visit local honeybee and coconut candy workshops.',
          'Visit the historic Vinh Trang Pagoda, known for its unique blend of Asian and European architecture.',
          'Return to Ho Chi Minh City in the evening for an overnight stay.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 9,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Have breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the extensive underground network built during the war.',
          'Explore the multi-tiered tunnel system featuring trap doors, living quarters, weapon workshops, and field hospitals.',
          'Experience crawling through a designated safe section of the underground tunnels.',
          'Savor a local lunch at a restaurant before returning to Ho Chi Minh City for an afternoon at leisure.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 10,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend free time at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Tan Son Nhat International Airport.',
          'Board your departure flight back home carrying unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '09 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Lunch Cruise in Halong on SIC basis',
      'Bana Hill Cable Car Tickets',
      'Full-Day Tour to Bana Hills',
      'Full-Day Tour to Ancient Town of Hoi An',
      'Full-Day Tour to Mekong Delta with Boat Ride',
      'Half-Day Excursion to Chu Chi Tunnels on SIC basis'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹65,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '56',
    title: '9 Days Exclusive Vietnam Family Trip',
    slug: 'exclusive-vietnam-family-trip',
    image: '/images/vietnam-family-exclusive.png',
    destination: 'Vietnam',
    category: 'Vietnam',
    description: `Treat your family to an exclusive 9-day vacation exploring the treasures of Vietnam. Discover Hanoi's oldest pagoda and walk down the thrilling Train Street. Spend a day in Ninh Binh to visit the ancient temples of Hoa Lu and take a scenic rowboat ride through Tam Coc Caves. Take a relaxing day cruise along the limestone formations of Halong Bay with a delicious lunch. Fly to Da Nang to stroll Hoi An Ancient Town and visit the spectacular Ba Na Hills and Golden Bridge. Complete your holiday in dynamic Saigon (Ho Chi Minh City) with a visit to the historic Cu Chi Tunnels. An unforgettable experience for all ages.`,
    duration: 9,
    nights: 8,
    price: 55999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 10,
    tripType: 'International',
    showGetQuoteOnly: true,
    highlights: [
      'Hanoi',
      'Ha Long Bay Cruise',
      'Bana Hills & Golden Gate Bridge',
      'Hoi An Ancient Town',
      'Ho Chi Minh',
      'Saigao'
    ],
    overviewPoints: [
      'Route: Hanoi → Ninh Binh → Halong Bay → Da Nang → Hoi An → Ba Na Hills → Saigon (Ho Chi Minh City) → Cu Chi Tunnels',
      'Duration: 8 Nights / 9 Days.',
      'Trip Start: Hanoi.',
      'Trip End: Saigon (Ho Chi Minh City).',
      'Major Highlights: Hanoi Train Street & City Tour, Hoa Lu & Tam Coc Caves in Ninh Binh, Halong Bay Day Cruise, Hoi An Ancient Town Tour, Ba Na Hills Cable Car & Golden Bridge, Cu Chi Tunnels.'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Hanoi | Hanoi City Tour & Train Street Experience',
        description: [
          'Arrive at Noi Bai International Airport in Hanoi and complete immigration formalities.',
          'Meet your driver and transfer to the downtown hotel for check-in and leisure.',
          'Visit Tran Quoc Pagoda, the oldest Buddhist temple in Hanoi located on West Lake.',
          'Experience the famous Hanoi Train Street with trackside cafes and lively neighborhood vibe.',
          'Visit the Ho Chi Minh Mausoleum complex and the iconic lotus-shaped One Pillar Pagoda.',
          'Explore the bustling Old Quarter markets, Beer Street (Ta Hien), and the Hanoi Night Market.',
          'Overnight stay in Hanoi.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour | Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Enjoy breakfast at the hotel and depart on a 90 km scenic drive south to Ninh Binh province.',
          'Embark on a traditional sampan boat ride through the majestic limestone caves of Tam Coc.',
          'Savor a delicious buffet lunch featuring authentic Vietnamese specialties.',
          'Visit Hoa Lu, the 10th-century ancient capital of Vietnam, and tour the historic Dinh and Le temples.',
          'Admire the serene Bich Dong Pagoda nestled against the mountain cliffside.',
          'Return to Hanoi in the late afternoon for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Day Cruise | Limestone Karsts & Grottoes',
        description: [
          'Enjoy breakfast at the hotel and depart by road for Halong Bay (approx. 3.5 hours).',
          'Arrive at Tuan Chau Marina and board a 4-hour scenic Halong Bay day cruise.',
          'Cruise past iconic limestone formations including Sail Island, Fisherman\'s Head Rock, Butterfly Rock, and Turtle Islet.',
          'Explore natural limestone grottos and cruise past floating fishing villages.',
          'Savor a freshly prepared Vietnamese seafood lunch on board the cruise.',
          'Disembark at the marina and transfer back to Hanoi for an evening at leisure.',
          'Overnight stay in Hanoi.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang | Coastal Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, check out, and transfer to Hanoi Airport.',
          'Board a domestic flight to Da Nang; meet your local tour guide upon arrival.',
          'Transfer to your hotel in Da Nang for check-in and relaxation.',
          'Spend the afternoon and evening at leisure exploring My Khe Beach, local seafood spots, or the Dragon Bridge.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Excursion | Golden Bridge & Fantasy Park',
        description: [
          'Have breakfast at the hotel and transfer to the scenic Ba Na Hills resort.',
          'Ascend via the world-record cable car to 1,487m above sea level with panoramic views.',
          'Walk across the iconic Golden Bridge supported by colossal stone hands.',
          'Explore Le Jardin D\'Amour flower gardens, Debay Wine Cellar, and Linh Ung Pagoda with its giant Buddha statue.',
          'Enjoy exciting rides, arcade games, and 4D/5D attractions at Fantasy Park.',
          'Visit Nghinh Phong Tower and Bell Tower before taking the cable car back down to the foothill.',
          'Return to Da Nang for a relaxing evening at leisure.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Tour | UNESCO World Heritage Walking Tour',
        description: [
          'Enjoy breakfast at the hotel and depart for a full-day tour to the UNESCO-listed ancient town of Hoi An.',
          'Take a walking tour across the 17th-century Japanese Covered Bridge and visit historic Chinese Assembly Halls.',
          'Explore ancient timber merchant houses and listen to traditional folk music at old town clubhouses.',
          'Stroll along the scenic Thu Bon River and vibrant night market with custom tailor shops and lantern displays.',
          'Transfer back to Da Nang in the evening.',
          'Overnight stay in Da Nang.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Ho Chi Minh City (Saigon) | Flight Transfer & Leisure',
        description: [
          'Enjoy breakfast at the hotel, complete check-out, and transfer to Da Nang Airport.',
          'Fly to Ho Chi Minh City (Saigon) and transfer with your representative to the downtown hotel for check-in.',
          'Spend the afternoon and evening at leisure exploring Saigon\'s vibrant streets, cafes, or Ben Thanh Market.',
          'Experience the bustling nightlife along Bui Vien Walking Street or Nguyen Hue Boulevard.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Cu Chi Tunnels Excursion | Underground War Network',
        description: [
          'Have breakfast at the hotel and depart for the historic Cu Chi Tunnels.',
          'Watch an introductory documentary highlighting the extensive underground network built during the war.',
          'Explore the multi-tiered tunnel system featuring trap doors, living quarters, weapon workshops, and field hospitals.',
          'Experience crawling through a designated safe section of the underground tunnels.',
          'Enjoy lunch at a local restaurant before returning to Ho Chi Minh City for an afternoon at leisure.',
          'Overnight stay in Ho Chi Minh City (Saigon).',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 9,
        title: 'Departure from Ho Chi Minh City | Trip Concludes',
        description: [
          'Have breakfast at the hotel and complete check-out formalities.',
          'Board your transfer to Tan Son Nhat International Airport in Ho Chi Minh City.',
          'Board your scheduled flight back home with unforgettable memories of Vietnam.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Meet & Greet assistance at the Airport',
      '08 Nights\' Accommodation on Breakfast Basis',
      'Airport Pickup and Drop on a private basis',
      'Half-Day Hanoi City Tour with 1-hour Cyclo tour',
      'SIC tour to Ninh Binh with Local Lunch',
      'Lunch Cruise in Halong on SIC basis',
      'Bana Hill Cable Car Tickets',
      'Full-Day Tour to Bana Hills',
      'Full-Day Tour to Ancient Town of Hoi An',
      'Half-Day Excursion to Chu Chi Tunnels on SIC basis.'
    ],
    notIncluded: [
      'Single Supplement. Early check-in and late check-out. Hotel/Room upgrade.',
      'Visa Service to Vietnam.',
      'Tours which are not included in the package.',
      'Meals not mentioned in the program.',
      'Any International Flight and airport tax.',
      'Drinks, personal expenses and any services not clearly mentioned in the program.',
      'Travel Insurance.',
      'GST & TCS as applicable extra.',
      'Wax Museum, cotton animal game, and carnival skill tickets at Fantasy Park are not included.',
      'Tips for Guide and Driver extra @ $3/- per adult per day'
    ],
    stays: [
      'Hanoi: Hotel / Similar',
      'Da Nang: Hotel / Similar',
      'Saigon: Hotel / Similar'
    ],
    batchDates: [
      {
        month: 'July',
        ranges: ['12th July - 17th July', '26th July - 31st July']
      },
      {
        month: 'August',
        ranges: ['15th Aug - 20th Aug', '23rd - 28th Aug']
      },
      {
        month: 'September',
        ranges: ['13th Sept - 18th Sept', '27th Sept - 2nd Oct']
      },
      {
        month: 'October',
        ranges: ['4th Oct - 9th Oct', '18th Oct - 23rd Oct']
      },
      {
        month: 'November',
        ranges: ['7th Nov - 12th Nov', '15th Nov - 20th Nov', '22nd Nov - 28th Nov']
      },
      {
        month: 'December',
        ranges: ['5th Dec - 11th Dec', '13th - 19th Dec.']
      }
    ],
    dates: [],
    costingDetails: [
      { label: 'Starting from', value: '₹55,999' }
    ],
    thingsToCarry: [
      'Passport with minimum 6 months validity from the date of departure from India',
      'Sunscreen & lip balm, Good U/V protection sunglasses',
      'Personal Medicines (if any)'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Vietnam. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Vietnam.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ]
  },
  {
    id: '57',
    title: '8 Days Wonderful Bali with Gili Island & Nusa Penida Group Trip',
    slug: 'wonderful-bali-group-trip',
    image: '/images/bali-group-trip.png',
    destination: 'Bali',
    category: 'Bali',
    description: 'Experience Ubud, Bali Swing, ATV Ride, Gili Island, Nusa Penida, Uluwatu Temple and Kecak Dance on this wonderful 8-day group trip.',
    duration: 8,
    price: 52999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'International',
    highlights: [
      'Ubud',
      'Bali Swing',
      'ATV Ride',
      'Gili Island',
      'Nusa Penida',
      'Uluwatu Temple',
      'Kecak Dance'
    ],
    heroMedia: [
      { type: 'image', src: '/images/bali-group-trip.png', alt: 'Wonderful Bali' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali | Transfer to Ubud & Leisure',
        description: [
          'Arrive at Ngurah Rai International Airport (Denpasar) in Bali and complete immigration formalities.',
          'Meet your tour representative and transfer scenic inland to Ubud.',
          'Check in to your hotel in Ubud and freshen up.',
          'Spend the rest of the evening at leisure exploring Ubud\'s vibrant cafes and art markets.',
          'Overnight stay in Ubud.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Ubud Adventure Day | Bali Jungle Swing & ATV Quad Bike Tour',
        description: [
          'Enjoy a hearty breakfast at the hotel and set out for a thrilling adventure day in Ubud.',
          'Experience the famous Bali Swing, soaring over lush tropical rainforests and rice terraces.',
          'Capture Instagram-worthy photos in flowing dresses at iconic nest and swing setups.',
          'Gear up for a thrilling 1-hour guided ATV quad bike ride through countryside mud tracks, bamboo forests, and river streams.',
          'Return to your hotel in Ubud to freshen up and relax.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Ubud to Gili Trawangan | Fast Ferry & Island Foam Party',
        description: [
          'Grab a packed breakfast and depart early at 6:00 AM for the harbor.',
          'Board a fast ferry across the ocean to the tropical paradise of Gili Trawangan (approx. 2.5 to 3 hours).',
          'Hop on a traditional Cidomo (horse-drawn cart) to transfer to your island resort and check in.',
          'Spend the afternoon at leisure strolling along pristine white-sand beaches or cycling around the island.',
          'Join the famous Rabbit Jump foam party in the evening and explore Gili\'s lively night market.',
          'Overnight stay in Gili Trawangan.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Gili Trawangan Island Life | Water Adventures & Sunset Leisure',
        description: [
          'Wake up to a tropical island morning and enjoy breakfast at the resort.',
          'Spend the day at leisure on the non-motorized island, cycling along coastal paths or relaxing on the beach.',
          'Option to join a 2–3 hour Scuba Diving session with pool training and open-water reef diving.',
          'Option to join a full-day 3-Island snorkeling tour covering Gili Air, Gili Meno, and Gili Trawangan coral reefs and sea turtle spots.',
          'Witness a spectacular tropical sunset on the western beach and enjoy Gili\'s beachside nightlife.',
          'Overnight stay in Gili Trawangan.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Gili Trawangan to Nusa Penida | Kelingking Beach Sunset',
        description: [
          'Enjoy breakfast at the hotel and board a Cidomo transfer back to Gili pier.',
          'Board a speed ferry across the azure ocean to the dramatic island of Nusa Penida.',
          'Arrive in Nusa Penida and savor a delicious Indian lunch.',
          'Visit the world-famous Kelingking Beach to marvel at the iconic T-Rex cliff formation and watch a panoramic sunset.',
          'Check in to your hotel in Nusa Penida for a relaxing evening.',
          'Overnight stay in Nusa Penida.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'Diamond Beach Sunrise & Mainland Return | Uluwatu Temple & Kecak Dance',
        description: [
          'Early morning wake-up at 3:00 AM to witness a magical sunrise at Diamond Beach.',
          'Admire the sparkling white sands, diamond-shaped sea stacks, and lush coastal cliffs.',
          'Return to the hotel for breakfast, check out by 11:00 AM, and transfer to the port.',
          'Board the speed ferry back to Sanur harbor on mainland Bali.',
          'Visit the dramatic cliff-top Uluwatu Temple overlooking the Indian Ocean for a mesmerizing sunset.',
          'Watch the iconic Balinese Kecak Fire Dance performance depicting the epic Ramayana.',
          'Transfer to your hotel in Kuta for check-in.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Day at Leisure in Kuta | Beach, Spa & Shopping',
        description: [
          'Enjoy breakfast at the hotel and spend a full day at leisure in Kuta.',
          'Optional activities include relaxing with a traditional Balinese massage, taking a surf lesson, or visiting GWK Cultural Park.',
          'Explore vibrant beach clubs, local boutiques, and seaside restaurants in Kuta and Seminyak.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Bali | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend your final hours packing or souvenir shopping.',
          'Complete check-out formalities and board your transfer to Denpasar International Airport.',
          'Board your scheduled flight back home with incredible memories of Bali and the Gili Islands.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Accommodation for 7 nights (2 nights in Ubud, 2 nights in Gili Trawangan, 1 night in Nusa Penida and 2 nights in Kuta) with breakfast',
      'Transfers from Ubud - Gili Island - Nusa Penida - Kuta',
      'Half day tour of Bali Swing (3 swings)',
      'Half day tour of Single ATV Ride (1 Hour)',
      'Sunset Tour at Kelingking Beach',
      'Sunrise Tour at Diamond Beach',
      'Visit Uluwatu Temple for Sunset View and Kecak dance',
      'Entire travel as per the itinerary',
      'English-speaking guide throughout your journey in Bali',
      'Entry tickets to all the attractions mentioned in the itinerary',
      'Ubud to Gili, Gili to Nusa, and Nusa to Kuta ferry are included',
      'Airport Pick up and Drop is included for fixed time according to the maximum people\'s arrival and departure timing'
    ],
    notIncluded: [
      'GST and TCS as applicable extra',
      'Water Sports or any other activity other than mentioned in the itinerary',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway',
      'Any personal expenses like a tip to the drivers, camera/video camera charges, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions',
      'Cost arises due to change or delay in flight timings. Wanderphilia as a responsible travel partner will definitely try to minimise the impact of delay but Wanderphilia shall not be liable/responsible for such incidents',
      'Visa is available on arrival at an approx. cost of US$ 35 per person',
      'JagaWisata Indonesia Travel Insurance, can be bought at Bali Airport upon arrival with an Insurance Premium of USD 36.00'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Bali. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Bali.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹52,999/- per person' }
    ],
    batchDates: [
      { month: 'July', ranges: ['18th July - 25th July'] },
      { month: 'August', ranges: ['18th Aug - 25th Aug'] },
      { month: 'September', ranges: ['26th Sept - 3rd Oct'] },
      { month: 'October', ranges: ['17th Oct - 24th Oct'] },
      { month: 'November', ranges: ['21st Nov - 28th Nov'] },
      { month: 'December', ranges: ['12th Dec - 19th Dec'] }
    ],
    dates: [
      { startDate: '2026-07-18', endDate: '2026-07-25', spots: 18 },
      { startDate: '2026-08-18', endDate: '2026-08-25', spots: 18 },
      { startDate: '2026-09-26', endDate: '2026-10-03', spots: 18 },
      { startDate: '2026-10-17', endDate: '2026-10-24', spots: 18 },
      { startDate: '2026-11-21', endDate: '2026-11-28', spots: 18 },
      { startDate: '2026-12-12', endDate: '2026-12-19', spots: 18 }
    ]
  },
  {
    id: '58',
    title: '6 Days Romantic Bali Getaway',
    slug: 'romantic-bali-getaway',
    image: '/images/romantic-bali-getaway.png',
    destination: 'Bali',
    category: 'Bali',
    description: 'Experience Kuta, Water Activities in Tanjung Benoa, Tanah Lot Temple, Bali Swing, and Kintamani Village Tour on this romantic 6-day getaway.',
    duration: 6,
    price: 23999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'International',
    highlights: [
      'Kuta',
      'Water Activities in Tanjung Benoa',
      'Tanah Lot Temple',
      'Bali Swing',
      'Kintamani Village Tour'
    ],
    heroMedia: [
      { type: 'image', src: '/images/romantic-bali-getaway.png', alt: 'Romantic Bali' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali | Transfer to Kuta & Leisure',
        description: [
          'Arrive at Ngurah Rai International Airport (Denpasar) in Bali and complete immigration formalities.',
          'Meet your local representative and transfer to your hotel in Kuta.',
          'Check in to your hotel and unwind after your flight.',
          'Spend the evening at leisure exploring Kuta Beach, local markets, and vibrant seaside cafes.',
          'Overnight stay in Kuta.',
          'Meals: Not Included.'
        ]
      },
      {
        day: 2,
        title: 'Tanjung Benoa Water Sports & Uluwatu Temple Sunset Tour',
        description: [
          'Enjoy breakfast at the hotel and transfer to the Tanjung Benoa peninsula for thrilling water sports.',
          'Experience an action-packed banana boat ride, jet ski adventure, and parasailing over the Indian Ocean.',
          'Savor lunch at a local restaurant before departing for the southern cliff coast.',
          'Visit the dramatic cliff-top Uluwatu Temple, perched 70 meters above the roaring waves, to watch a breathtaking sunset.',
          'Return to Kuta for an evening at leisure.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Tanah Lot Coastal Temple Tour & Sunset Views',
        description: [
          'Have breakfast at the hotel and spend the morning relaxing at the hotel pool or strolling along the beach.',
          'Depart in the afternoon for a half-day tour to the iconic Tanah Lot Temple.',
          'Admire the ancient Hindu shrine perched atop a wave-swept offshore rock formation.',
          'Capture stunning sunset photographs as the sun dips below the ocean horizon.',
          'Return to your hotel in Kuta for the night.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Kuta to Ubud Transfer | World-Famous Bali Swing Experience',
        description: [
          'Enjoy breakfast at the hotel, check out, and depart on a scenic drive from Kuta to Ubud.',
          'Stop en route to experience the world-famous Bali Jungle Swing, soaring high over tropical ravines and palm groves.',
          'Pose for romantic couple photos in floral bird nests and cliffside photo points.',
          'Arrive in Ubud, check in to your resort, and spend the evening exploring Ubud\'s art markets and tranquil surroundings.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Kintamani Highland Tour | Mt. Batur, Tegalalang Rice Terraces & Tegenungan Waterfall',
        description: [
          'Savor breakfast at the hotel and depart for a full-day cultural and nature tour of Kintamani.',
          'Stop at the Kintamani viewpoint to take in panoramic vistas of active volcano Mount Batur and its crater lake.',
          'Walk through the emerald-green terraces of Tegalalang Rice Field and learn about traditional Subak irrigation.',
          'Visit the scenic Tegenungan Waterfall nestled amidst lush tropical foliage.',
          'Return to Ubud for a relaxing evening.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Departure from Bali | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend free time at leisure for last-minute shopping.',
          'Complete check-out formalities and transfer to Denpasar International Airport.',
          'Board your scheduled flight back home with cherished memories of your romantic Bali getaway.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '5 Nights Accomodation in 4 Star Deluxe Hotels',
      'Water Sports Activities in Tanjung Benoa',
      'Visit to Tanah Lot Temple',
      'Kintamani Village Tour',
      'Bali Swing',
      'Transfer from Kuta to Ubud'
    ],
    notIncluded: [
      'GST and TCS as applicable extra',
      'Water Sports or any other activity other than mentioned in the itinerary',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway',
      'Any personal expenses like a tip to the drivers, camera/video camera charges, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions',
      'Cost arises due to change or delay in flight timings. Wanderphilia as a responsible travel partner will definitely try to minimise the impact of delay but Wanderphilia shall not be liable/responsible for such incidents',
      'Visa is available on arrival at an approx. cost of US$ 35 per person',
      'JagaWisata Indonesia Travel Insurance, can be bought at Bali Airport upon arrival with an Insurance Premium of USD 36.00'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Bali. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Bali.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹23,999/- per person' }
    ],
    dates: []
  },
  {
    id: '59',
    title: '7 Days Honeymoon Special Bali Seminyak, Nusa Penida, Ubud & Kuta',
    slug: 'honeymoon-special-bali',
    image: '/images/honeymoon-special-bali.png',
    destination: 'Bali',
    category: 'Bali',
    description: 'Experience 2N Seminyak, 1N Nusa Penida, 2N Ubud, and 1N Kuta on this honeymoon special 7-day tour with Uluwatu and Tanah Lot Temple sightseeing, Bali Swing, and traditional Balinese Spa.',
    duration: 7,
    price: 26999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'International',
    highlights: [
      'Seminyak',
      'Visit Uluwatu & Tanah Lot Temple',
      'Nusa Penida',
      'Ubud',
      'Bali Swing',
      'Kuta',
      'Traditional Bali Spa'
    ],
    heroMedia: [
      { type: 'image', src: '/images/honeymoon-special-bali.png', alt: 'Honeymoon Special Bali' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali | Transfer to Seminyak & Candlelight Dinner',
        description: [
          'Arrive at Ngurah Rai International Airport (Denpasar) in Bali and complete immigration formalities.',
          'Meet your tour representative and transfer to your luxury hotel in stylish Seminyak.',
          'Check in to your room and enjoy free time to unwind by the pool or stroll along Seminyak Beach.',
          'Savor a romantic complimentary candlelight dinner at the hotel in the evening.',
          'Overnight stay in Seminyak.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Iconic Temples Tour | Cliff-top Uluwatu & Coastal Tanah Lot Sunset',
        description: [
          'Enjoy breakfast at the hotel and depart on a scenic southern coastal temple tour.',
          'Visit the dramatic cliff-top Uluwatu Temple, perched 70 meters above the crashing waves of the Indian Ocean.',
          'Return to the hotel to relax, before heading out in the late afternoon to the coastal Tanah Lot Temple.',
          'Watch a glorious sunset as the ancient temple is illuminated against the ocean tide.',
          'Capture stunning couple photographs before returning to your hotel.',
          'Overnight stay in Seminyak.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Seminyak to Nusa Penida | Crystal Bay, Kelingking T-Rex Cliff & Secret Point',
        description: [
          'Have breakfast at the hotel, check out, and transfer to the harbor.',
          'Board a fast speed boat across the azure ocean to Nusa Penida island.',
          'Travel from Sampalan Beach to Crystal Bay with opportunities for swimming and snorkeling.',
          'Savor lunch and visit the iconic Kelingking Beach to admire the famous T-Rex cliff viewpoint.',
          'Explore the scenic Secret Point surf viewpoint before checking in to your Nusa Penida hotel.',
          'Overnight stay in Nusa Penida.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 4,
        title: 'Diamond Beach Sunrise & Treehouse | Transfer to Cultural Ubud',
        description: [
          'Depart early at 4:30 AM for a magical sunrise tour at Diamond Beach.',
          'Visit the famous Rumah Pohon Molenteng Tree House for panoramic couple photos overlooking the bay.',
          'Return to the hotel for breakfast by 9:30 AM, check out, and transfer to the port.',
          'Board a fast boat to Sanur harbor on mainland Bali and transfer scenic inland to Ubud.',
          'Check in to your resort in Ubud and spend a relaxing evening amidst tranquil tropical greenery.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Ubud Adventure Day | Bali Jungle Swing & ATV Quad Bike Tour',
        description: [
          'Wake up to a serene morning in Ubud and enjoy breakfast at the hotel.',
          'Experience the famous Bali Jungle Swing, soaring over lush rainforests and cascading valleys.',
          'Pose for photos in whimsical nests, heart swings, and jungle viewpoints.',
          'Gear up for an exhilarating guided ATV quad bike ride through countryside trails, river streams, and bamboo forests.',
          'Return to your Ubud resort to freshen up and relax for the evening.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Ubud to Kuta Transfer | Rejuvenating Balinese Couple Spa',
        description: [
          'Enjoy breakfast at the resort, check out, and transfer to vibrant Kuta.',
          'Check in to your hotel in Kuta and relax after the drive.',
          'Indulge together in an authentic, rejuvenating traditional Balinese spa and couples massage.',
          'Spend the evening exploring Kuta\'s vibrant markets, beach promenade, and boutique shops.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Bali | Trip Concludes',
        description: [
          'Have breakfast at the hotel and spend your morning packing or doing last-minute souvenir shopping.',
          'Complete check-out formalities and board your transfer to Denpasar International Airport.',
          'Board your departure flight back home with romantic, lifelong memories of Bali.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      '6 Nights Accommodation on Deluxe Properties.',
      'Entire travel as per the itinerary',
      'Airport transfer included',
      'Above all mentioned tours are included.',
      'All the entry tickets are included',
      'Breakfast from Day 2 to Day 7'
    ],
    notIncluded: [
      'GST and TCS as applicable extra',
      'Water Sports or any other activity other than mentioned in the itinerary',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway',
      'Any personal expenses like a tip to the drivers, camera/video camera charges, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions',
      'Cost arises due to change or delay in flight timings. Wanderphilia as a responsible travel partner will definitely try to minimise the impact of delay but Wanderphilia shall not be liable/responsible for such incidents',
      'Visa is available on arrival at an approx. cost of US$ 35 per person',
      'JagaWisata Indonesia Travel Insurance, can be bought at Bali Airport upon arrival with an Insurance Premium of USD 36.00'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Bali. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Bali.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹26,999/- per person' }
    ],
    dates: []
  },
  {
    id: '60',
    title: '8 Days Honeymoon Special Bali Seminyak, Nusa Penida, Ubud & Kuta',
    slug: 'honeymoon-special-bali-8days',
    image: '/images/honeymoon-special-bali-8days.png',
    destination: 'Bali',
    category: 'Bali',
    description: 'Experience 3N Ubud and 4N Kuta on this honeymoon special 8-day tour with Ayung River white water rafting, Bali Swing, ATV ride, Kelingking Beach excursion, Tanah Lot and Uluwatu Temple tours, and traditional Balinese Spa.',
    duration: 8,
    price: 35999,
    rating: 4.9,
    difficulty: 'Easy',
    groupSize: 18,
    tripType: 'International',
    highlights: [
      'Ubud',
      'Bali Swing',
      'Water Sports & ATV Ride',
      'Nusa Penida Island Tour',
      'Tanah Lot Temple',
      'Ulawatu Temple',
      'Gate To Heaven'
    ],
    heroMedia: [
      { type: 'image', src: '/images/honeymoon-special-bali-8days.png', alt: '8 Days Honeymoon Special Bali' }
    ],
    itinerary: [
      {
        day: 1,
        title: 'Arrival in Bali | Transfer to Ubud & Candlelight Dinner',
        description: [
          'Arrive at Ngurah Rai International Airport (Denpasar) in Bali and complete immigration formalities.',
          'Meet your tour representative and transfer to your luxury resort in Ubud.',
          'Check in to your room and enjoy free time to unwind amidst tropical jungle landscapes.',
          'Savor a romantic complimentary candlelight dinner at the resort in the evening.',
          'Overnight stay in Ubud.',
          'Meals: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Ayung River White Water Rafting & ATV Quad Bike Adventure',
        description: [
          'Wake up to a lush tropical morning and enjoy breakfast at the hotel.',
          'Transfer to the Ayung River for an exciting white-water rafting adventure through jungle gorges.',
          'Receive a safety briefing and paddle through gentle rapids with scenic waterfall views.',
          'Gear up for an exhilarating guided ATV quad bike tour through rural Balinese villages and mud trails.',
          'Return to your resort in Ubud for a relaxing evening.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Bali Jungle Swing, Mt. Batur Viewpoint, Tegalalang Rice Terraces & Tegenungan Waterfall',
        description: [
          'Enjoy breakfast at the hotel and set out to explore the cultural highlights of Ubud.',
          'Experience the famous Bali Jungle Swing, soaring high over tropical ravines with iconic photo stops.',
          'Head to the Kintamani viewpoint to admire panoramic vistas of Mount Batur volcano and its crater lake.',
          'Stroll through the scenic terraced landscape of Tegalalang Rice Terraces.',
          'Visit the cascading Tegenungan Waterfall surrounded by dense tropical greenery.',
          'Return to Ubud for the evening.',
          'Overnight stay in Ubud.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Ubud to Kuta Transfer | Tanah Lot Sea Temple Sunset',
        description: [
          'Have breakfast at the resort, check out, and transfer south to vibrant Kuta.',
          'Check in to your hotel in Kuta and relax after the journey.',
          'Depart in the late afternoon for the iconic coastal Tanah Lot Temple.',
          'Witness a mesmerizing sunset as the tide surrounds this ancient sea temple, capturing postcard-worthy photos.',
          'Return to Kuta for an evening at leisure.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Nusa Penida Day Tour | Crystal Bay & Kelingking T-Rex Cliff',
        description: [
          'Enjoy breakfast at the hotel and transfer to Sanur harbor for a fast boat ride to Nusa Penida island.',
          'Cruise across azure waters and visit Crystal Bay with opportunities for swimming or snorkeling.',
          'Savor lunch and explore the world-famous Kelingking Beach to marvel at the iconic T-Rex cliff formation.',
          'Board the fast boat back to mainland Bali in the afternoon and return to your hotel in Kuta.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast & Lunch.'
        ]
      },
      {
        day: 6,
        title: 'South Bali Highlights | Cliff-top Uluwatu Temple & Padang Padang Beach',
        description: [
          'Enjoy breakfast at the hotel and depart on a scenic South Bali sightseeing tour.',
          'Visit the dramatic cliff-top Uluwatu Temple, perched 70 meters above the crashing Indian Ocean.',
          'Relax on the golden sands of picturesque Padang Padang Beach.',
          'Spend the afternoon at leisure, with optional entry to the famous Single Fin Day Club.',
          'Return to Kuta in the evening for an overnight stay.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Pura Lempuyang "Gate of Heaven" Tour & Rejuvenating Balinese Spa',
        description: [
          'Savor breakfast at the hotel and travel to East Bali to visit the historic Pura Lempuyang Temple.',
          'Pose at the iconic "Gate of Heaven" with majestic Mount Agung framed between the split gates.',
          'Return to Kuta in the afternoon for a traditional Balinese couple spa and rejuvenating massage.',
          'Spend your final evening shopping for souvenirs or dining at vibrant beach clubs.',
          'Overnight stay in Kuta.',
          'Meals: Breakfast.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Bali | Trip Concludes',
        description: [
          'Enjoy breakfast at the hotel and spend your morning packing and at leisure.',
          'Complete check-out formalities and board your transfer to Denpasar International Airport.',
          'Board your departure flight back home carrying unforgettable romantic memories of Bali.',
          'Meals: Breakfast.'
        ]
      }
    ],
    included: [
      'Entire travel in a private vehicle as per the itinerary.',
      '7Nights Accomodation on 4 Star Deluxe Water Villa',
      'Airport pick up and drop.',
      'Water sports activities in Tanjung Benoa (Banana boat ride, Jet Ski and Parasailing)',
      'Dolphin watching tour in Lovina.',
      'Half day tour to Uluwatu temple.',
      'Full day tour to Nusa penida.',
      'Half day tour to bali Swing.',
      'Full day tour to Kintamani village for Mt Batur volcano view point, Tegalalang Rice Terrace and Tegenungan Waterfall.',
      'Half day tour to Tanah Lot temple',
      'English speaking driver cum guide.',
      'Breakfast from Day 2 to Day 8'
    ],
    notIncluded: [
      'GST and TCS as applicable extra',
      'Water Sports or any other activity other than mentioned in the itinerary',
      'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway',
      'Any personal expenses like a tip to the drivers, camera/video camera charges, laundry, telephone bills, tips, etc',
      'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
      'Anything not mentioned in the inclusions',
      'Cost arises due to change or delay in flight timings. Wanderphilia as a responsible travel partner will definitely try to minimise the impact of delay but Wanderphilia shall not be liable/responsible for such incidents',
      'Visa is available on arrival at an approx. cost of US$ 35 per person',
      'JagaWisata Indonesia Travel Insurance, can be bought at Bali Airport upon arrival with an Insurance Premium of USD 36.00'
    ],
    travelEssentials: [
      {
        title: 'Gears',
        items: [
          'A medium size trolley with one cabin bag',
          'Reusable water bladder or water bottle'
        ]
      },
      {
        title: 'Clothes',
        items: [
          'a sun cap',
          'UV protected sunglasses',
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
          'Sunscreen minimum of spf40, lip balm, cold creams',
          'Body spray',
          'LED torch light'
        ]
      }
    ],
    note: [
      'Normal Check-in and Check-out time is 03:00 PM and 12:00 noon respectively in Bali. Early check-in with breakfast is available at an extra cost of 30 USD/ per person.',
      'Airport transfer is at fixed time (depending on the majority of arrival and departure time of the group) - Any early or late transfer will be charged extra.',
      'The age limit of our group departures is 18 to 42 years due to the power packed itineraries that we provide to our travellers. We can customize trips for travellers beyond the mentioned age bracket.',
      'Every traveler is required to be holding a valid passport with an expiry date at least 6 months post the date of entering Bali.',
      'Tour rates are calculated based on current fuel rates and may be revised if there is a sudden increase in fuel prices or an increase of 15% or above.',
      'If the guest count for a batch is fewer than 9 guests, only a local guide will be available during the tour, and an Indian Trip Captain will not be accompanying the group.'
    ],
    costingDetails: [
      { label: 'Double Sharing Rate', value: '₹35,999/- per person' }
    ],
    dates: []
  }
];

export const destinations: Destination[] = [
  {
    title: 'Leh Ladakh',
    slug: 'leh-ladakh',
    image: '/images/leh-ladakh.jpg',
    description: 'Land of high-altitude passes, blue lakes, and ancient monasteries.',
    tripCount: 6,
  },
  {
    title: 'Spiti Valley',
    slug: 'spiti',
    image: '/images/spiti-valley.jpg',
    description: 'Explore the cold desert, snow-capped peaks, and ancient Tibetan monasteries.',
    tripCount: 4,
  },
  {
    title: 'Kashmir',
    slug: 'kashmir',
    image: '/images/kashmir.jpg',
    description: 'Paradise on Earth with scenic valleys, shikara rides, and snow mountains.',
    tripCount: 3,
  },
  {
    title: 'Himachal Pradesh',
    slug: 'himachal',
    image: '/images/himachal.jpg',
    description: 'Charming hill stations, paragliding in Bir, and scenic valley drives.',
    tripCount: 6,
  },
  {
    title: 'Bali',
    slug: 'bali',
    image: '/images/bali.jpg',
    description: 'Tropical beaches, pristine temples, and vibrant cultural vibes.',
    tripCount: 4,
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
  {
    title: 'Vietnam',
    slug: 'vietnam',
    image: '/images/vietnam.png',
    description: 'Discover pristine beaches, ancient cities, dynamic cultures, and breathtaking natural wonders of Vietnam.',
    tripCount: 17,
  }
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
