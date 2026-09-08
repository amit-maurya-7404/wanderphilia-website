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
          'Transfer: Airport pickup at Kushok Bakula Rimpochee Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town',
          'Sightseeing: Evening trip briefing & orientation by Trip Captain'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Cultural Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic views of Leh Valley',
          'Sightseeing: Historic Gurudwara Pathar Sahib & Magnetic Hill gravity-defying phenomenon',
          'Sightseeing: Indus & Zanskar River Confluence (Sangam Point)',
          'Sightseeing: Ladakh Hall of Fame War Memorial & Leh Market cafe hopping'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: Scenic 130 km ride/drive crossing the iconic Khardung La Pass (17,982 ft)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes with double-humped Bactrian camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 180 km off-road ride/drive through scenic Agam & Shyok river route',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: Majestic color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: Famous 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Leh via Chang La Pass (17,590 ft)',
        description: [
          'Transfer: 140 km return ride/drive crossing Chang La Pass (17,590 ft) to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Sunrise by Pangong Lake & scenic passes of Karu, Thiksey and Shey',
          'Sightseeing: Evening leisure for souvenir shopping in Leh Main Bazaar'
        ]
      },
      {
        day: 6,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for onward journey',
          'Sightseeing: Departure with unforgettable Himalayan memories'
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
          'Transfer: Airport pickup at Leh Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic city views',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill & historic Gurudwara Pathar Sahib',
          'Sightseeing: Hall of Fame War Memorial & evening at Leh Market cafes'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km scenic ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Turtuk Day Excursion (Balti Village)',
        description: [
          'Transfer: 200 km round-trip excursion along the Shyok River',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Historic Turtuk Village (India-Pakistan border area) & apricot orchards',
          'Sightseeing: Unique Balti culture exploration & Shyok War Memorial'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok Route',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: World-famous high-altitude Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots point & picturesque lakeside sunset'
        ]
      },
      {
        day: 6,
        title: 'Pangong Lake to Leh via Chang La Pass (17,590 ft)',
        description: [
          'Transfer: 140 km return ride/drive crossing Chang La Pass (5,360 m) to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Sunrise at Pangong Lake, Karu, Thiksey & Shey monastery views',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 7,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for departure',
          'Sightseeing: Departure with cherished memories of Ladakh'
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
          'Transfer: Airport pickup at Leh Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town',
          'Sightseeing: Evening trip briefing & orientation by Trip Captain'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic city views',
          'Sightseeing: Historic Gurudwara Pathar Sahib & Magnetic Hill phenomenon',
          'Sightseeing: Indus & Zanskar River Confluence (Sangam Point)',
          'Sightseeing: Ladakh Hall of Fame War Memorial & Leh Market cafe hopping'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 130 km ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 180 km off-road ride/drive through scenic Agam & Shyok river route',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km rugged ride/drive through Chushul, Tsaga La & Loma Bridge',
          'Accommodation: Homestay in Hanle (Dark Sky Reserve)',
          'Sightseeing: Historic Rezang La 1962 War Memorial tribute',
          'Sightseeing: Remote Changthang wilderness & stargazing in Hanle Dark Sky Reserve'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Leh via Tso Moriri Lake Excursion',
        description: [
          'Transfer: 289 km scenic journey via Mahe, Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Pristine blue Tso Moriri Lake at 14,836 ft with migratory birds',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 7,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for onward journey',
          'Sightseeing: Departure with unforgettable Himalayan memories'
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
          'Transfer: Airport pickup at Leh Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic views of Leh Valley',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill & historic Gurudwara Pathar Sahib',
          'Sightseeing: Hall of Fame War Memorial & evening at Leh Market cafes'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km scenic ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km rugged ride/drive through Chushul, Tsaga La & Loma Bridge',
          'Accommodation: Homestay in Hanle (Dark Sky Reserve)',
          'Sightseeing: Historic Rezang La 1962 War Memorial tribute',
          'Sightseeing: Remote Changthang wilderness & stargazing in Hanle Dark Sky Reserve'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Border Excursion',
        description: [
          'Transfer: 200 km round-trip excursion over Photi La (18,124 ft) to Umling La',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: World’s highest motorable pass - Umling La Pass (19,024 ft / 5,640 m)',
          'Sightseeing: Demchok Indo-China border village & optional Indian Astronomical Observatory'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Leh via Tso Moriri Lake Excursion',
        description: [
          'Transfer: 289 km scenic journey via Mahe, Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Pristine blue Tso Moriri Lake at 14,836 ft with migratory birds',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 8,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for onward flight',
          'Sightseeing: Departure with thrilling Himalayan memories'
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
          'Transfer: Airport pickup at Leh Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic city views',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill & historic Gurudwara Pathar Sahib',
          'Sightseeing: Hall of Fame War Memorial & evening at Leh Market cafes'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km scenic ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Turtuk Day Excursion (Balti Village)',
        description: [
          'Transfer: 200 km round-trip excursion along the Shyok River',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Historic Turtuk Village (India-Pakistan border area) & apricot orchards',
          'Sightseeing: Unique Balti culture exploration & Shyok War Memorial'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Tso Moriri via Kaksang La Pass (17,851 ft)',
        description: [
          'Transfer: 175 km off-road journey crossing Chushul, Kaksang La, Yaye Tso & Kyagar Tso',
          'Accommodation: Stay / Camp near Tso Moriri Lake',
          'Sightseeing: Spectacular Mirpal Tso, Kyagar Tso & high-altitude Kaksang La Pass',
          'Sightseeing: Pristine blue Tso Moriri Lake with migratory birds and wildlife'
        ]
      },
      {
        day: 7,
        title: 'Tso Moriri to Leh via Puga Valley Geothermal Springs',
        description: [
          'Transfer: 154 km scenic drive via Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Puga Valley geothermal mud pools & Chumathang hot sulphur springs',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 8,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for onward journey',
          'Sightseeing: Departure with cherished Himalayan memories'
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
          'Transfer: Airport pickup at Leh Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic views of Leh Valley',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill & historic Gurudwara Pathar Sahib',
          'Sightseeing: Hall of Fame War Memorial & evening at Leh Market cafes'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km scenic ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 5,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km rugged ride/drive through Chushul, Tsaga La & Loma Bridge',
          'Accommodation: Homestay in Hanle (Dark Sky Reserve)',
          'Sightseeing: Historic Rezang La 1962 War Memorial tribute',
          'Sightseeing: Remote Changthang wilderness & stargazing in Hanle Dark Sky Reserve'
        ]
      },
      {
        day: 6,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Border Excursion',
        description: [
          'Transfer: 200 km round-trip excursion over Photi La (18,124 ft) to Umling La',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: World’s highest motorable pass - Umling La Pass (19,024 ft / 5,640 m)',
          'Sightseeing: Demchok Indo-China border village & optional Indian Astronomical Observatory'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Tso Moriri Lake',
        description: [
          'Transfer: 289 km scenic journey across Loma Bridge, Mahe & Nyoma to Tso Moriri',
          'Accommodation: Stay / Camp near Tso Moriri Lake',
          'Sightseeing: Pristine high-altitude blue waters of Tso Moriri at 14,836 ft & migratory bird watching'
        ]
      },
      {
        day: 8,
        title: 'Tso Moriri to Leh via Puga Valley Geothermal Springs',
        description: [
          'Transfer: 154 km scenic drive via Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Puga Valley geothermal mud pools & Chumathang hot sulphur springs',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 9,
        title: 'Leh Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Leh Airport for onward journey',
          'Sightseeing: Departure with thrilling Himalayan memories'
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
        title: 'Delhi / Chandigarh to Manali Overnight Journey',
        description: [
          'Transfer: Overnight AC Volvo / vehicle transfer from Delhi / Chandigarh to Manali',
          'Accommodation: Overnight in transit Volvo'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali & Local Exploration',
        description: [
          'Transfer: Morning arrival at Manali & hotel transfer',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Check-in, relax & visit Hidimba Devi Temple and Vashisht Hot Springs',
          'Sightseeing: Jogini Waterfall short hike, Mall Road stroll & evening trip briefing'
        ]
      },
      {
        day: 2,
        title: 'Manali to Sarchu via Atal Tunnel & Baralacha La (16,040 ft)',
        description: [
          'Transfer: 175 km ride/drive via Atal Tunnel, Lahaul Valley, Keylong & Darcha',
          'Accommodation: Campsite in Sarchu',
          'Sightseeing: Scenic drive through Atal Tunnel, Suraj Tal Lake & Baralacha La Pass (4,892 m)'
        ]
      },
      {
        day: 3,
        title: 'Sarchu to Leh via Gata Loops, Nakee La, Lachung La & Moore Plains',
        description: [
          'Transfer: 260 km high-altitude highway journey to Leh crossing Tanglang La (17,480 ft)',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Conquering 21 hairpin bends of Gata Loops, Nakee La (4,738 m) & Lachung La (5,065 m)',
          'Sightseeing: Cruising the 50-km flat Moore Plains with wildlife spotting & Tanglang La Pass'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Shanti Stupa, Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Turtuk Day Excursion (Balti Village)',
        description: [
          'Transfer: 200 km round-trip excursion along the Shyok River',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Historic Turtuk Village (India-Pakistan border area) & apricot orchards',
          'Sightseeing: Unique Balti culture exploration & Shyok War Memorial'
        ]
      },
      {
        day: 6,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 7,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km rugged ride/drive through Chushul, Tsaga La & Loma Bridge',
          'Accommodation: Homestay in Hanle (Dark Sky Reserve)',
          'Sightseeing: Historic Rezang La 1962 War Memorial tribute',
          'Sightseeing: Remote Changthang wilderness & stargazing in Hanle Dark Sky Reserve'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Border Excursion',
        description: [
          'Transfer: 200 km round-trip excursion over Photi La (18,124 ft) to Umling La',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: World’s highest motorable pass - Umling La Pass (19,024 ft / 5,640 m)',
          'Sightseeing: Demchok Indo-China border village & optional Indian Astronomical Observatory'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri Lake Excursion',
        description: [
          'Transfer: 289 km scenic journey across Loma Bridge, Mahe, Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Pristine blue Tso Moriri Lake at 14,836 ft with migratory birds',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 10,
        title: 'Leh to Jispa via Tanglang La, Moore Plains & Baralacha La',
        description: [
          'Transfer: 260 km scenic return drive crossing Tanglang La, Lachung La, Nakee La & Sarchu',
          'Accommodation: Hotel / Camp in Jispa',
          'Sightseeing: Moore Plains, Gata Loops, Baralacha La, Deepak Tal & Suraj Tal lakes'
        ]
      },
      {
        day: 11,
        title: 'Jispa to Manali via Atal Tunnel & Overnight Volvo to Delhi',
        description: [
          'Transfer: 135 km drive via Keylong, Sissu, Atal Tunnel & Solang Valley to Manali',
          'Transfer: Evening overnight Volvo bus transfer from Manali to Delhi',
          'Accommodation: Overnight in Volvo bus',
          'Sightseeing: Sissu waterfall & Solang Valley views'
        ]
      },
      {
        day: 12,
        title: 'Arrival in Delhi',
        description: [
          'Transfer: Morning arrival at Delhi',
          'Sightseeing: Tour concludes with cherished Himalayan memories'
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
        title: 'Delhi / Chandigarh to Manali Overnight Journey',
        description: [
          'Transfer: Overnight AC Volvo / vehicle transfer from Delhi / Chandigarh to Manali',
          'Accommodation: Overnight in transit Volvo'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali & Local Exploration',
        description: [
          'Transfer: Morning arrival at Manali & hotel transfer',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Check-in, relax & visit Hidimba Devi Temple and Vashisht Hot Springs',
          'Sightseeing: Jogini Waterfall short hike, Mall Road stroll & evening trip briefing'
        ]
      },
      {
        day: 2,
        title: 'Manali to Sarchu via Atal Tunnel & Baralacha La (16,040 ft)',
        description: [
          'Transfer: 175 km ride/drive via Atal Tunnel, Lahaul Valley, Keylong & Darcha',
          'Accommodation: Campsite in Sarchu',
          'Sightseeing: Scenic drive through Atal Tunnel, Suraj Tal Lake & Baralacha La Pass (4,892 m)'
        ]
      },
      {
        day: 3,
        title: 'Sarchu to Leh via Gata Loops, Nakee La, Lachung La & Moore Plains',
        description: [
          'Transfer: 260 km high-altitude highway journey to Leh crossing Tanglang La (17,480 ft)',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Conquering 21 hairpin bends of Gata Loops, Nakee La (4,738 m) & Lachung La (5,065 m)',
          'Sightseeing: Cruising the 50-km flat Moore Plains with wildlife spotting & Tanglang La Pass'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Shanti Stupa, Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert, double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Turtuk Day Excursion (Balti Village)',
        description: [
          'Transfer: 200 km round-trip excursion along the Shyok River',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Historic Turtuk Village (India-Pakistan border area) & apricot orchards',
          'Sightseeing: Unique Balti culture exploration & Shyok War Memorial'
        ]
      },
      {
        day: 6,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km ride/drive through scenic Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: High-altitude color-changing Pangong Lake at 14,270 ft',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset'
        ]
      },
      {
        day: 7,
        title: 'Pangong Lake to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km rugged ride/drive through Chushul, Tsaga La & Loma Bridge',
          'Accommodation: Homestay in Hanle (Dark Sky Reserve)',
          'Sightseeing: Historic Rezang La 1962 War Memorial tribute',
          'Sightseeing: Remote Changthang wilderness & stargazing in Hanle Dark Sky Reserve'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Border Excursion',
        description: [
          'Transfer: 200 km round-trip excursion over Photi La (18,124 ft) to Umling La',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: World’s highest motorable pass - Umling La Pass (19,024 ft / 5,640 m)',
          'Sightseeing: Demchok Indo-China border village & optional Indian Astronomical Observatory'
        ]
      },
      {
        day: 9,
        title: 'Hanle to Leh via Tso Moriri Lake Excursion',
        description: [
          'Transfer: 289 km scenic journey across Loma Bridge, Mahe, Chumathang, Upshi & Karu to Leh',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Pristine blue Tso Moriri Lake at 14,836 ft with migratory birds',
          'Sightseeing: Evening leisure for shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 10,
        title: 'Leh to Kargil via Magnetic Hill, Sangam Point & Lamayuru',
        description: [
          'Transfer: 230 km highway ride/drive crossing Fotu La (4,108 m) & Namika La (3,700 m)',
          'Accommodation: Hotel in Kargil',
          'Sightseeing: Hall of Fame, Gurudwara Pathar Sahib, Magnetic Hill & Sangam confluence',
          'Sightseeing: Ancient Lamayuru Moonland monastery & Mulbekh giant rock Buddha'
        ]
      },
      {
        day: 11,
        title: 'Kargil to Srinagar via Dras, Zoji La Pass & Sonamarg',
        description: [
          'Transfer: 200 km breathtaking mountain drive crossing the iconic Zoji La Pass (11,575 ft)',
          'Accommodation: Hotel in Srinagar',
          'Sightseeing: Dras War Memorial (Kargil War tribute), Tiger Hill views & Sonamarg golden meadows'
        ]
      },
      {
        day: 12,
        title: 'Srinagar Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Srinagar Airport for onward journey',
          'Sightseeing: Departure with cherished memories of the great Himalayan expedition'
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
        title: 'Arrival in Srinagar & Leisure Day',
        description: [
          'Transfer: Arrival at Srinagar Airport & transfer to hotel',
          'Accommodation: Hotel in Srinagar',
          'Sightseeing: Leisure evening walk around Srinagar Market & Dal Lake boulevard',
          'Sightseeing: Trip briefing & orientation session with Team Captain'
        ]
      },
      {
        day: 2,
        title: 'Srinagar to Kargil via Sonamarg, Zoji La Pass & Drass',
        description: [
          'Transfer: 200 km scenic drive/ride along the ancient Silk Route via Zoji La Pass (3,528 m)',
          'Accommodation: Hotel in Kargil',
          'Sightseeing: Golden meadows of Sonamarg & Drass Village (Gateway to Ladakh)',
          'Sightseeing: Drass War Memorial & Kargil historic viewpoints'
        ]
      },
      {
        day: 3,
        title: 'Kargil to Leh via Lamayuru Moonland & Sham Valley',
        description: [
          'Transfer: 230 km ride/drive crossing Namika La (3,700 m) & Fotu La (4,108 m)',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Spectacular lunar landscapes of Lamayuru Monastery',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence), Magnetic Hill & Gurudwara Pathar Sahib'
        ]
      },
      {
        day: 4,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km thrilling ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Panoramic Leh Valley view from Shanti Stupa',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes with double-humped Bactrian camel safari & ATV rides'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km off-road journey through Agam & Shyok river valley',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: World\'s highest saltwater Pangong Lake (4,300 m)',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset photography'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km ride/drive through Chushul & Loma Bridge across the Indus River',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Rezang La War Memorial tribute to the martyrs of 1962 War',
          'Sightseeing: Dark sky stargazing in the tranquil high-altitude village of Hanle'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Excursion',
        description: [
          'Transfer: 200 km round-trip ride/drive crossing Photi La (5,524 m)',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Conquer Umling La (5,640 m) — the highest motorable road in the world',
          'Sightseeing: Demchok border village (Indo-China border) & Indian Astronomical Observatory'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Leh via Tso Moriri Lake & Chumathang',
        description: [
          'Transfer: 289 km scenic journey to Leh via Mahe, Chumathang & Upshi',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Breathtaking deep blue waters of Tso Moriri Lake (4,522 m)',
          'Sightseeing: Chumathang hot springs & evening shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 9,
        title: 'Leh to Jispa via Moore Plains, Gata Loops & Baralacha La',
        description: [
          'Transfer: 260 km highway ride/drive crossing Tanglang La (5,328 m), Lachung La (5,065 m) & Nakee La (4,738 m)',
          'Accommodation: Hotel / Camps in Jispa',
          'Sightseeing: 50 km straight stretch of Moore Plains & 21 hairpin bends of Gata Loops',
          'Sightseeing: Baralacha La Pass (4,850 m), Suraj Taal & Deepak Taal lakes'
        ]
      },
      {
        day: 10,
        title: 'Jispa to Manali via Atal Tunnel',
        description: [
          'Transfer: 135 km drive/ride through Lahaul Valley and Atal Tunnel',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Scenic mountain towns of Keylong, Sissu & Solang Valley',
          'Sightseeing: Evening leisure stroll & cafe hopping at Manali Mall Road'
        ]
      },
      {
        day: 11,
        title: 'Manali Local Sightseeing & Overnight Volvo to Delhi',
        description: [
          'Transfer: Evening overnight Volvo bus transfer from Manali to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Historic Hidimba Devi Temple & Vashisht Temple hot water springs',
          'Sightseeing: Old Manali cafes & shopping along the Mall Road'
        ]
      },
      {
        day: 12,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival at Delhi ISBT / Majnu Ka Tilla',
          'Sightseeing: Departure with unforgettable high-altitude Himalayan memories'
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Bus',
        description: [
          'Transfer: Overnight AC Volvo transfer from Delhi (Majnu Ka Tilla / ISBT) to Shimla'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Chitkul / Sangla via Kinnaur Gate',
        description: [
          'Transfer: 220 km scenic drive from Shimla to Chitkul / Sangla via Kufri & Narkanda',
          'Accommodation: Hotel / Homestay in Sangla / Chitkul',
          'Sightseeing: Drive along Hindustan-Tibet Highway and Satluj River valley',
          'Sightseeing: Historic Kinnaur Gate rock-cut tunnel (Gateway of Kinnaur)'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Village Exploration & Transfer to Kalpa',
        description: [
          'Transfer: 70 km drive from Chitkul to Kalpa via Reckong Peo',
          'Accommodation: Hotel / Homestay in Kalpa',
          'Sightseeing: Explore Chitkul — India\'s last inhabited village near the Indo-Tibetan border',
          'Sightseeing: Roghi Village Cliff Point & panoramic views of Kinner Kailash peak'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Village & Ka Loops',
        description: [
          'Transfer: 168 km drive to Tabo crossing Ka Loops & Sumdo Border checkpoint',
          'Accommodation: Homestay in Tabo',
          'Sightseeing: Confluence of Spiti and Satluj rivers at Khab Sangam & pristine Nako Lake',
          'Sightseeing: 1,000-year-old historic Tabo Monastery (Ajanta of the Himalayas)'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Gompa & Chicham Bridge',
        description: [
          'Transfer: 125 km drive to Kaza exploring high-altitude monasteries and gorges',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Cliff-hanging Dhankar Monastery overlooking Spiti & Pin river confluence',
          'Sightseeing: Iconic 1,000-year-old Key Monastery perched at 13,668 ft',
          'Sightseeing: Chicham Bridge — Asia\'s highest suspension bridge at 13,596 ft'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komik & Langza',
        description: [
          'Transfer: 80 km circuit drive across the highest motorable villages in Spiti',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Hikkim — post a letter from the World\'s Highest Post Office (14,567 ft)',
          'Sightseeing: Komik — highest motorable village in the world (15,027 ft)',
          'Sightseeing: Langza — giant golden Buddha statue overlooking the valley & marine fossil hunting'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Kalpa via Spiti Valley Highway',
        description: [
          'Transfer: 215 km scenic return drive from Kaza to Kalpa',
          'Accommodation: Hotel / Homestay in Kalpa',
          'Sightseeing: Panoramic landscapes along the rugged Spiti & Satluj river gorges',
          'Sightseeing: Evening leisure stroll with sunset views over Kinner Kailash'
        ]
      },
      {
        day: 7,
        title: 'Kalpa to Shimla & Overnight Volvo to Delhi',
        description: [
          'Transfer: 210 km drive from Kalpa to Shimla; evening overnight Volvo bus to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Scenic mountain route through Kinnaur & apple orchards of Shimla hills'
        ]
      },
      {
        day: 8,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 09:00 AM)',
          'Sightseeing: Departure with unforgettable memories of Winter Spiti Valley'
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Bus',
        description: [
          'Transfer: Overnight AC Volvo transfer from Delhi (Majnu Ka Tilla / ISBT) to Shimla'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Chitkul / Sangla via Kinnaur Valley',
        description: [
          'Transfer: 220 km scenic drive from Shimla to Chitkul / Sangla via Narkanda & Rampur',
          'Accommodation: Hotel / Homestay in Sangla / Chitkul',
          'Sightseeing: Spectacular drive along the Hindustan-Tibet Highway and Satluj River',
          'Sightseeing: Rock-cut Kinnaur Gate tunnel & evening walk along Baspa River'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Exploration & Transfer to Kalpa',
        description: [
          'Transfer: 80 km scenic drive from Chitkul to Kalpa via Reckong Peo',
          'Accommodation: Hotel / Homestay in Kalpa',
          'Sightseeing: Explore Chitkul — India\'s last inhabited village near the Tibet border',
          'Sightseeing: Roghi Village Cliff Point & golden sunset over the sacred Kinner Kailash range'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Village & Ka Loops',
        description: [
          'Transfer: 168 km drive to Tabo crossing Khab Sangam, Ka Loops & Sumdo Border checkpoint',
          'Accommodation: Homestay in Tabo',
          'Sightseeing: Confluence of Spiti & Satluj rivers at Khab & pristine Nako Lake',
          'Sightseeing: 1,000-year-old historic Tabo Monastery (Ajanta of the Himalayas)'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Gompa & Chicham Bridge',
        description: [
          'Transfer: 125 km drive to Kaza visiting iconic Spitian monasteries and gorges',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Cliff-top Dhankar Monastery overlooking Spiti & Pin river confluence',
          'Sightseeing: Magnificent 1,000-year-old Key Monastery perched at 13,668 ft',
          'Sightseeing: Chicham Bridge — Asia\'s highest suspension bridge at 13,596 ft'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komik & Langza',
        description: [
          'Transfer: 80 km circuit drive across the highest inhabited villages of Spiti',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Hikkim — post a letter from the World\'s Highest Post Office (14,567 ft)',
          'Sightseeing: Komik — highest motorable village in the world (15,027 ft)',
          'Sightseeing: Langza — giant Buddha statue facing snow-clad peaks & marine fossil hunting'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass (14,931 ft)',
        description: [
          'Transfer: 95 km off-road drive from Kaza to Chandratal via Losar & Kunzum Pass (4,551 m)',
          'Accommodation: Swiss Campsite near Chandratal Lake',
          'Sightseeing: Turquoise blue crescent-shaped Chandratal Lake (Moon Lake) at 14,100 ft',
          'Sightseeing: Stargazing under the Milky Way Galaxy & campsite bonfire'
        ]
      },
      {
        day: 7,
        title: 'Chandratal Lake to Manali via Atal Tunnel',
        description: [
          'Transfer: 95 km rugged mountain drive via Batal, Gramphu and Atal Tunnel to Manali',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Chandra River valley landscapes and Pir Panjal mountain views',
          'Sightseeing: Evening leisure stroll & cafe crawl in Old Manali'
        ]
      },
      {
        day: 8,
        title: 'Manali Local Sightseeing & Overnight Volvo to Delhi',
        description: [
          'Transfer: Evening overnight AC Volvo transfer from Manali to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Self-exploration of Manali visiting Hadimba Devi Temple, Vashisht & Mall Road'
        ]
      },
      {
        day: 9,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 08:00 - 09:00 AM)',
          'Sightseeing: Departure with cherished memories of the complete Spiti Valley road trip'
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
        title: 'Departure from Delhi to Shimla | Overnight Volvo Bus',
        description: [
          'Transfer: Overnight AC Volvo transfer from Delhi (Majnu Ka Tilla / ISBT) to Shimla'
        ]
      },
      {
        day: 1,
        title: 'Shimla to Chitkul / Sangla via Kinnaur Valley',
        description: [
          'Transfer: 220 km scenic drive from Shimla to Chitkul / Sangla via Narkanda & Rampur',
          'Accommodation: Hotel / Homestay in Sangla / Chitkul',
          'Sightseeing: Spectacular drive along the Hindustan-Tibet Highway and Satluj River',
          'Sightseeing: Rock-cut Kinnaur Gate tunnel & evening walk along Baspa River'
        ]
      },
      {
        day: 2,
        title: 'Chitkul Exploration & Transfer to Kalpa',
        description: [
          'Transfer: 80 km scenic drive from Chitkul to Kalpa via Reckong Peo',
          'Accommodation: Hotel / Homestay in Kalpa',
          'Sightseeing: Explore Chitkul — India\'s last inhabited village near the Tibet border',
          'Sightseeing: Roghi Village Cliff Point & golden sunset over the sacred Kinner Kailash range'
        ]
      },
      {
        day: 3,
        title: 'Kalpa to Tabo via Nako Village & Ka Loops',
        description: [
          'Transfer: 168 km drive to Tabo crossing Khab Sangam, Ka Loops & Sumdo Border checkpoint',
          'Accommodation: Homestay in Tabo',
          'Sightseeing: Confluence of Spiti & Satluj rivers at Khab & pristine Nako Lake',
          'Sightseeing: 1,000-year-old historic Tabo Monastery (Ajanta of the Himalayas)'
        ]
      },
      {
        day: 4,
        title: 'Tabo to Kaza via Dhankar Monastery, Key Gompa & Chicham Bridge',
        description: [
          'Transfer: 125 km drive to Kaza visiting iconic Spitian monasteries and gorges',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Cliff-top Dhankar Monastery overlooking Spiti & Pin river confluence',
          'Sightseeing: Magnificent 1,000-year-old Key Monastery perched at 13,668 ft',
          'Sightseeing: Chicham Bridge — Asia\'s highest suspension bridge at 13,596 ft'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Village Circuit | Hikkim, Komik & Langza',
        description: [
          'Transfer: 80 km circuit drive across the highest inhabited villages of Spiti',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Hikkim — post a letter from the World\'s Highest Post Office (14,567 ft)',
          'Sightseeing: Komik — highest motorable village in the world (15,027 ft)',
          'Sightseeing: Langza — giant Buddha statue facing snow-clad peaks & marine fossil hunting'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass (14,931 ft)',
        description: [
          'Transfer: 95 km off-road drive from Kaza to Chandratal via Losar & Kunzum Pass (4,551 m)',
          'Accommodation: Swiss Campsite near Chandratal Lake',
          'Sightseeing: Turquoise blue crescent-shaped Chandratal Lake (Moon Lake) at 14,100 ft',
          'Sightseeing: Stargazing under the Milky Way Galaxy & campsite bonfire'
        ]
      },
      {
        day: 7,
        title: 'Chandratal Lake to Manali & Overnight Volvo to Delhi',
        description: [
          'Transfer: 95 km drive via Batal, Gramphu and Atal Tunnel to Manali; evening Volvo to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Majestic Lahaul Valley views & Atal Tunnel engineering marvel',
          'Sightseeing: Evening leisure stroll at Manali Mall Road before departure'
        ]
      },
      {
        day: 8,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 08:00 - 09:00 AM)',
          'Sightseeing: Tour concludes with thrilling high-altitude Spiti memories'
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
        title: 'Departure from Delhi to Manali | Overnight Volvo Bus',
        description: [
          'Transfer: Overnight AC Volvo transfer from Delhi (Majnu Ka Tilla / ISBT) to Manali'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali & Local Self-Exploration',
        description: [
          'Transfer: Morning arrival in Manali & hotel transfer',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Historic Hadimba Devi Temple, Vashisht Hot Water Springs & Old Manali cafes',
          'Sightseeing: Evening orientation & trip briefing session with Team Captain'
        ]
      },
      {
        day: 2,
        title: 'Manali to Kaza via Atal Tunnel, Kunzum Pass & Chicham Bridge',
        description: [
          'Transfer: 185 km high-altitude drive crossing Atal Tunnel and Kunzum La Pass (14,931 ft)',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Transition from lush green Kullu Valley to dramatic arid mountains of Spiti',
          'Sightseeing: Asia\'s highest suspension bridge — Chicham Bridge at 13,596 ft'
        ]
      },
      {
        day: 3,
        title: 'Kaza Village Circuit | Key Monastery, Hikkim, Komik & Langza',
        description: [
          'Transfer: 80 km circuit drive across the highest inhabited villages in the world',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Majestic 1,000-year-old Key Gompa Monastery perched at 13,668 ft',
          'Sightseeing: Komik — highest motorable village in the world (15,027 ft)',
          'Sightseeing: Hikkim — post a letter from the World\'s Highest Post Office (14,567 ft)',
          'Sightseeing: Langza — giant Buddha statue facing snow-capped peaks & prehistoric fossil hunting'
        ]
      },
      {
        day: 4,
        title: 'Kaza to Chandratal Lake via Losar & Kunzum Pass',
        description: [
          'Transfer: 95 km off-road drive from Kaza to Chandratal via Losar & Kunzum Pass (4,551 m)',
          'Accommodation: Swiss Campsite near Chandratal Lake',
          'Sightseeing: Turquoise blue crescent-shaped Chandratal Lake (Moon Lake) at 14,100 ft',
          'Sightseeing: Spectacular sunset over the Chandra Bhaga range & Milky Way stargazing'
        ]
      },
      {
        day: 5,
        title: 'Chandratal to Manali & Overnight Volvo to Delhi',
        description: [
          'Transfer: 95 km rugged mountain drive via Batal, Gramphu & Atal Tunnel to Manali; evening Volvo to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Dramatic riverbeds of Chandra River & Atal Tunnel engineering marvel',
          'Sightseeing: Evening leisure stroll & cafe hopping at Manali Mall Road'
        ]
      },
      {
        day: 6,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 08:00 - 09:00 AM)',
          'Sightseeing: Departure with unforgettable memories of the Spiti Short Circuit'
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
        title: 'Departure from Delhi to Aut (Tirthan Valley) | Overnight Volvo Bus',
        description: [
          'Transfer: Overnight AC Volvo transfer from Delhi (Majnu Ka Tilla / ISBT) to Aut'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Aut & Transfer to Jibhi / Gushaini',
        description: [
          'Transfer: Transfer from Aut to Jibhi / Gushaini (Bikers collect bikes in Manali & ride to Jibhi)',
          'Accommodation: Hotel / Resort in Jibhi / Gushaini',
          'Sightseeing: Relaxing nature walk through pine forests & trek to Jibhi / Choie Waterfall',
          'Sightseeing: Bike test ride, riding gear allotment & expedition briefing'
        ]
      },
      {
        day: 2,
        title: 'Jibhi to Chitkul via Jalori Pass & Kinnaur Valley',
        description: [
          'Transfer: 230 km scenic mountain ride along the Satluj & Baspa river valleys',
          'Accommodation: Campsite / Homestay in Chitkul',
          'Sightseeing: Dramatic Hindustan-Tibet Highway drive through rock-cut Kinnaur Gate',
          'Sightseeing: Arrive in Chitkul — India\'s last inhabited village near the Indo-Tibetan border'
        ]
      },
      {
        day: 3,
        title: 'Chitkul to Nako via Kalpa & Khab Sangam',
        description: [
          'Transfer: 80 km scenic ride to Nako via Reckong Peo & Khab Sangam',
          'Accommodation: Hotel / Homestay in Nako',
          'Sightseeing: Morning walk in Chitkul village & panoramic Kinner Kailash peak views',
          'Sightseeing: Khab Sangam (Spiti & Satluj river confluence) & high-altitude Nako Lake'
        ]
      },
      {
        day: 4,
        title: 'Nako to Kaza via Ka Loops & Tabo Monastery',
        description: [
          'Transfer: 220 km ride to Kaza crossing Sumdo Border checkpoint & Ka Loops',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Negotiating the steep hairpin bends of Ka Loops',
          'Sightseeing: Historic 1,000-year-old Tabo Monastery (Ajanta of the Himalayas)'
        ]
      },
      {
        day: 5,
        title: 'Kaza High-Altitude Circuit | Key Monastery, Chicham, Hikkim & Langza',
        description: [
          'Transfer: 80 km circuit ride across the world\'s highest motorable villages',
          'Accommodation: Homestay in Kaza',
          'Sightseeing: Perched 1,000-year-old Key Gompa Monastery (13,668 ft)',
          'Sightseeing: Chicham Bridge — Asia\'s highest suspension bridge (13,596 ft)',
          'Sightseeing: Komik (15,027 ft), Hikkim post office (14,567 ft) & Langza golden Buddha'
        ]
      },
      {
        day: 6,
        title: 'Kaza to Chandratal Lake via Kunzum La Pass (14,931 ft)',
        description: [
          'Transfer: 95 km off-road ride from Kaza to Chandratal via Losar & Kunzum Pass (4,551 m)',
          'Accommodation: Swiss Campsite near Chandratal Lake',
          'Sightseeing: Conquer the majestic high-altitude Kunzum La Pass',
          'Sightseeing: Crescent-shaped Chandratal Lake (Moon Lake) at 14,100 ft & Milky Way stargazing'
        ]
      },
      {
        day: 7,
        title: 'Chandratal Lake to Manali via Atal Tunnel',
        description: [
          'Transfer: 111 km adventurous off-road ride via Batal, Gramphu & Atal Tunnel to Manali',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Crossing rugged water crossings (pagal nalas) along the Chandra River',
          'Sightseeing: Evening cafe crawl & farewell celebration in Old Manali'
        ]
      },
      {
        day: 8,
        title: 'Manali Self-Exploration & Overnight Volvo to Delhi',
        description: [
          'Transfer: Evening overnight AC Volvo transfer from Manali to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: Self-exploration of Manali visiting Hadimba Devi Temple, Vashisht & Mall Road'
        ]
      },
      {
        day: 9,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 08:00 - 09:00 AM)',
          'Sightseeing: Tour concludes with epic memories of the Spiti Valley Bike Expedition'
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
        title: 'Arrival in Bagdogra & Transfer to Phuentsholing',
        description: [
          'Transfer: Airport pickup at Bagdogra Airport (IXB) & drive to Phuentsholing via Jaigaon border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Cross the iconic Indo-Bhutan border gate into the Land of the Thunder Dragon',
          'Sightseeing: Evening leisure walk around Phuentsholing town and local market'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Bridge',
        description: [
          'Transfer: 170 km scenic mountain drive from Phuentsholing to Thimphu via Gedu & Chapcha',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Complete immigration and entry permit formalities at Jaigaon / Phuentsholing',
          'Sightseeing: Chuzom Bridge confluence of Paro & Thimphu rivers with King & Queen portrait',
          'Sightseeing: Evening exploration of Thimphu — the world\'s only capital city without traffic lights'
        ]
      },
      {
        day: 3,
        title: 'Excursion to Punakha via Dochu La Pass (3,100 m)',
        description: [
          'Transfer: 75 km excursion drive from Thimphu to Punakha and return',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Spectacular Dochu La Pass with 108 Druk Wangyal Chortens and Himalayan vistas',
          'Sightseeing: Hike to Chimi Lhakhang (Fertility Temple of Divine Madman Drukpa Kuenley)',
          'Sightseeing: Scenic drive along the lush Pho Chhu and Mo Chhu river valleys'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Sightseeing & Transfer to Paro',
        description: [
          'Transfer: Scenic transfer from Thimphu to Paro Valley',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Buddha Dordenma (Giant Golden Buddha) offering panoramic Thimphu Valley views',
          'Sightseeing: Simply Bhutan living cultural museum, traditional archery & costume showcase',
          'Sightseeing: Evening arrival in Paro & traditional hot stone bath relaxation'
        ]
      },
      {
        day: 5,
        title: 'Paro Sightseeing & Hike to Tiger\'s Nest Monastery',
        description: [
          'Transfer: Short transfer to Taktsang base trailhead',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Pilgrimage hike to iconic Paro Taktsang (Tiger\'s Nest) clinging to a 900m sheer cliff',
          'Sightseeing: Ancient meditation caves, prayer wheel chambers & panoramic valley vistas'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing via Countryside Valleys',
        description: [
          'Transfer: Scenic mountain drive from Paro descending to Phuentsholing border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Scenic mountain route through waterfalls, pine forests & Bhutanese villages',
          'Sightseeing: Evening souvenir shopping and farewell dinner in Phuentsholing'
        ]
      },
      {
        day: 7,
        title: 'Phuentsholing to Bagdogra Airport & Tour Conclusion',
        description: [
          'Transfer: Morning drive from Phuentsholing across the border to Bagdogra Airport (IXB)',
          'Sightseeing: Departure with treasured memories of the Bhutan Kingdom'
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
        title: 'Arrival in Bagdogra & Transfer to Phuentsholing',
        description: [
          'Transfer: Airport pickup at Bagdogra Airport (IXB) & drive to Phuentsholing via Jaigaon border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Cross the iconic Indo-Bhutan border gate into the Himalayan Kingdom',
          'Sightseeing: Evening leisure walk around Phuentsholing town'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Bridge',
        description: [
          'Transfer: 170 km scenic mountain drive from Phuentsholing to Thimphu via Gedu',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Complete immigration permit formalities & drive through cascading mountain valleys',
          'Sightseeing: Chuzom Bridge river confluence & evening stroll in Thimphu town'
        ]
      },
      {
        day: 3,
        title: 'Thimphu to Punakha via Dochu La Pass (3,100 m) & River Rafting',
        description: [
          'Transfer: 75 km drive from Thimphu to Punakha via Dochu La Pass',
          'Accommodation: Hotel / Resort in Punakha',
          'Sightseeing: Buddha Dordenma (Giant Golden Buddha) with panoramic valley views',
          'Sightseeing: Dochu La Pass with 108 memorial chortens & snow-clad Himalayan views',
          'Sightseeing: Majestic Punakha Dzong & Pho Chhu suspension bridge walk',
          'Sightseeing: Thrilling white-water river rafting in Punakha (Mo Chhu / Pho Chhu)'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjikha Valley (Gangtey)',
        description: [
          'Transfer: Scenic day excursion drive from Punakha to Phobjikha Valley and return',
          'Accommodation: Hotel / Resort in Punakha',
          'Sightseeing: Pristine glacial Phobjikha Valley (winter habitat of Black-Necked Cranes)',
          'Sightseeing: 17th-century Gangtey Monastery on a hilltop & Gangtey nature trail walk'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro via Chimi Lhakhang & Hot Stone Bath',
        description: [
          'Transfer: Scenic mountain drive from Punakha to Paro Valley via Lobesa',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Short hike to Chimi Lhakhang (Fertility Temple) in Lobesa',
          'Sightseeing: Traditional Bhutanese Hot Stone Bath relaxation in Paro'
        ]
      },
      {
        day: 6,
        title: 'Hike to Iconic Paro Taktsang (Tiger\'s Nest Monastery)',
        description: [
          'Transfer: Short transfer to Taktsang base trailhead',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Epic hike to sacred Paro Taktsang (Tiger\'s Nest) clinging to a 900m sheer cliff',
          'Sightseeing: Ancient prayer chambers, butter lamps & panoramic Paro valley views'
        ]
      },
      {
        day: 7,
        title: 'Paro to Phuentsholing / Siliguri',
        description: [
          'Transfer: 300 km scenic return drive from Paro via Phuentsholing to Siliguri',
          'Accommodation: Hotel in Siliguri',
          'Sightseeing: Scenic descent across the Bhutanese border back into India'
        ]
      },
      {
        day: 8,
        title: 'Siliguri to Bagdogra Airport & Tour Conclusion',
        description: [
          'Transfer: Morning hotel checkout & transfer to Bagdogra Airport (IXB)',
          'Sightseeing: Departure with magical memories of the Bhutan Kingdom'
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
        title: 'Arrival in Bagdogra & Transfer to Phuentsholing',
        description: [
          'Transfer: Airport pickup at Bagdogra Airport (IXB) & drive to Phuentsholing via Jaigaon border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Cross the iconic Indo-Bhutan border gate into the Himalayan Kingdom',
          'Sightseeing: Evening leisure walk around Phuentsholing town'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Bridge',
        description: [
          'Transfer: 170 km scenic mountain drive from Phuentsholing to Thimphu via Gedu',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Complete immigration permit formalities & drive through cascading mountain valleys',
          'Sightseeing: Chuzom Bridge river confluence & evening stroll in Thimphu town'
        ]
      },
      {
        day: 3,
        title: 'Thimphu to Punakha via Dochu La Pass (3,100 m) & River Rafting',
        description: [
          'Transfer: 75 km drive from Thimphu to Punakha via Dochu La Pass',
          'Accommodation: Hotel / Resort in Punakha',
          'Sightseeing: Buddha Dordenma (Giant Golden Buddha) with panoramic valley views',
          'Sightseeing: Dochu La Pass with 108 memorial chortens & snow-clad Himalayan views',
          'Sightseeing: Majestic Punakha Dzong & Pho Chhu suspension bridge walk',
          'Sightseeing: Thrilling white-water river rafting in Punakha (Mo Chhu / Pho Chhu)'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Phobjikha Valley (Gangtey)',
        description: [
          'Transfer: Scenic day excursion drive from Punakha to Phobjikha Valley and return',
          'Accommodation: Hotel / Resort in Punakha',
          'Sightseeing: Pristine glacial Phobjikha Valley (winter habitat of Black-Necked Cranes)',
          'Sightseeing: 17th-century Gangtey Monastery on a hilltop & Gangtey nature trail walk'
        ]
      },
      {
        day: 5,
        title: 'Punakha to Paro via Chimi Lhakhang & Hot Stone Bath',
        description: [
          'Transfer: Scenic mountain drive from Punakha to Paro Valley via Lobesa',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Short hike to Chimi Lhakhang (Fertility Temple) in Lobesa',
          'Sightseeing: Traditional Bhutanese Hot Stone Bath relaxation in Paro'
        ]
      },
      {
        day: 6,
        title: 'Hike to Iconic Paro Taktsang (Tiger\'s Nest Monastery)',
        description: [
          'Transfer: Short transfer to Taktsang base trailhead',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Epic hike to sacred Paro Taktsang (Tiger\'s Nest) clinging to a 900m sheer cliff',
          'Sightseeing: Ancient prayer chambers, butter lamps & panoramic Paro valley views'
        ]
      },
      {
        day: 7,
        title: 'Paro to Phuentsholing / Siliguri',
        description: [
          'Transfer: 300 km scenic return drive from Paro via Phuentsholing to Siliguri',
          'Accommodation: Hotel in Siliguri',
          'Sightseeing: Scenic descent across the Bhutanese border back into India'
        ]
      },
      {
        day: 8,
        title: 'Siliguri to Bagdogra Airport & Tour Conclusion',
        description: [
          'Transfer: Morning hotel checkout & transfer to Bagdogra Airport (IXB)',
          'Sightseeing: Departure with magical memories of the Bhutan Kingdom'
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
        title: 'Arrival in Bagdogra & Transfer to Phuentsholing',
        description: [
          'Transfer: Airport pickup at Bagdogra Airport (IXB) & drive to Phuentsholing via Jaigaon border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Cross the iconic Indo-Bhutan border gate into the Land of the Thunder Dragon',
          'Sightseeing: Evening leisure walk around Phuentsholing town and local market'
        ]
      },
      {
        day: 2,
        title: 'Phuentsholing to Thimphu via Chuzom Bridge',
        description: [
          'Transfer: 170 km scenic mountain drive from Phuentsholing to Thimphu via Gedu & Chapcha',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Complete immigration and entry permit formalities at Jaigaon / Phuentsholing',
          'Sightseeing: Chuzom Bridge confluence of Paro & Thimphu rivers with King & Queen portrait',
          'Sightseeing: Evening exploration of Thimphu — the world\'s only capital city without traffic lights'
        ]
      },
      {
        day: 3,
        title: 'Excursion to Punakha via Dochu La Pass (3,100 m)',
        description: [
          'Transfer: 75 km excursion drive from Thimphu to Punakha and return',
          'Accommodation: Hotel in Thimphu',
          'Sightseeing: Spectacular Dochu La Pass with 108 Druk Wangyal Chortens and Himalayan vistas',
          'Sightseeing: Hike to Chimi Lhakhang (Fertility Temple of Divine Madman Drukpa Kuenley)',
          'Sightseeing: Scenic drive along the lush Pho Chhu and Mo Chhu river valleys'
        ]
      },
      {
        day: 4,
        title: 'Thimphu Sightseeing & Transfer to Paro',
        description: [
          'Transfer: Scenic transfer from Thimphu to Paro Valley',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Buddha Dordenma (Giant Golden Buddha) offering panoramic Thimphu Valley views',
          'Sightseeing: Simply Bhutan living cultural museum, traditional archery & costume showcase',
          'Sightseeing: Evening arrival in Paro & traditional hot stone bath relaxation'
        ]
      },
      {
        day: 5,
        title: 'Paro Sightseeing & Hike to Tiger\'s Nest Monastery',
        description: [
          'Transfer: Short transfer to Taktsang base trailhead',
          'Accommodation: Hotel / Resort in Paro',
          'Sightseeing: Pilgrimage hike to iconic Paro Taktsang (Tiger\'s Nest) clinging to a 900m sheer cliff',
          'Sightseeing: Ancient meditation caves, prayer wheel chambers & panoramic valley vistas'
        ]
      },
      {
        day: 6,
        title: 'Paro to Phuentsholing via Countryside Valleys',
        description: [
          'Transfer: Scenic mountain drive from Paro descending to Phuentsholing border',
          'Accommodation: Hotel in Phuentsholing',
          'Sightseeing: Scenic mountain route through waterfalls, pine forests & Bhutanese villages',
          'Sightseeing: Evening souvenir shopping and farewell dinner in Phuentsholing'
        ]
      },
      {
        day: 7,
        title: 'Phuentsholing to Bagdogra Airport & Tour Conclusion',
        description: [
          'Transfer: Morning drive from Phuentsholing across the border to Bagdogra Airport (IXB)',
          'Sightseeing: Departure with treasured memories of the Bhutan Kingdom'
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
        title: 'Delhi to Manali | Overnight Volvo Bus Journey',
        description: [
          'Transfer: Evening overnight AC Volvo bus transfer from Delhi (Majnu Ka Tilla / ISBT) to Manali'
        ]
      },
      {
        day: 1,
        title: 'Arrival in Manali, Jogni Waterfall Trek & Old Manali',
        description: [
          'Transfer: Morning arrival in Manali & hotel check-in',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Scenic nature trek through apple orchards & pine forests to Jogini Waterfall',
          'Sightseeing: 16th-century wooden pagoda Hadimba Devi Temple & cafe hopping in Old Manali'
        ]
      },
      {
        day: 2,
        title: 'Atal Tunnel, Sissu (Lahaul Valley) & Solang Valley',
        description: [
          'Transfer: 110 km high-altitude drive through Atal Tunnel to Lahaul Valley and return',
          'Accommodation: Hotel in Manali',
          'Sightseeing: Drive through Atal Tunnel engineering marvel (above 10,000 ft)',
          'Sightseeing: Sissu waterfall & glacier viewpoints in snowy Lahaul Valley',
          'Sightseeing: Solang Valley adventure sports and snow activities'
        ]
      },
      {
        day: 3,
        title: 'Manali to Kasol via River Rafting & Manikaran Sahib',
        description: [
          'Transfer: 85 km scenic mountain drive from Manali to Kasol along Parvati River',
          'Accommodation: Hotel / Resort in Kasol',
          'Sightseeing: Thrilling white-water river rafting on the Beas River in Kullu',
          'Sightseeing: Spiritual visit to Manikaran Sahib Gurudwara & natural hot springs',
          'Sightseeing: Bohemian cafes and riverside walk along the Parvati River in Kasol'
        ]
      },
      {
        day: 4,
        title: 'Parvati Valley Hamlets | Tosh, Kalga, Pulga & Chalal',
        description: [
          'Transfer: Day excursion drive from Kasol to Barshaini village trailhead and return',
          'Accommodation: Hotel / Resort in Kasol',
          'Sightseeing: Discover picturesque mountain hamlets of Tosh, Kalga & Pulga',
          'Sightseeing: Riverside pine forest trek to Chalal village & evening market exploration'
        ]
      },
      {
        day: 5,
        title: 'Kasol to Jibhi | Jibhi Waterfall & Mini Thailand',
        description: [
          'Transfer: 80 km scenic drive from Kasol to Jibhi via Aut & Banjar Valley',
          'Accommodation: Hotel / Resort in Jibhi',
          'Sightseeing: Jibhi Waterfall surrounded by dense cedar forests & wooden bridges',
          'Sightseeing: Mini Thailand secret natural rock pool & cozy riverside cafes'
        ]
      },
      {
        day: 6,
        title: 'Jalori Pass & Serolsar Lake Trek | Overnight Volvo to Delhi',
        description: [
          'Transfer: Drive to Jalori Pass; evening return to Aut for overnight Volvo to Delhi',
          'Accommodation: Overnight Volvo Bus Journey',
          'Sightseeing: High-altitude trek (5 km) from Jalori Pass to sacred Serolsar Lake',
          'Sightseeing: 360-degree panoramic Himalayan viewpoint & Budhi Nagin Temple'
        ]
      },
      {
        day: 7,
        title: 'Arrival in Delhi & Tour Conclusion',
        description: [
          'Transfer: Morning arrival in Delhi (around 08:00 - 09:00 AM)',
          'Sightseeing: Departure with unforgettable memories of Himachal Pradesh'
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
        title: 'Delhi to Aut – Overnight Himalayan Escape Begins',
        description: [
          'Transfer: Assemble at Delhi boarding point and board comfortable overnight Volvo bus to Himachal Pradesh (approx. 500-520 km / 10-12 hrs).',
          'Enjoy the scenic overnight drive as cityscapes give way to peaceful mountain valleys.',
          'Meet and interact with fellow travellers along the way.'
        ]
      },
      {
        day: 1,
        title: 'Arrival at Aut – Transfer to Jibhi & Local Exploration',
        description: [
          'Transfer: Morning arrival at Aut; meet representative and transfer to the peaceful mountain hamlet of Jibhi.',
          'Accommodation: Check-in and relax at hotel / wooden cottage stay in Jibhi.',
          'Sightseeing: Visit the hidden Jibhi Waterfall surrounded by lush pine and cedar forests.',
          'Sightseeing: Explore Mini Thailand, famous for natural rock formations and crystal-clear mountain streams.',
          'Sightseeing: Evening leisure for riverside walks and exploring cozy local mountain cafes.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Trek to Serolsar Lake & 360-Degree Himalayan Viewpoint',
        description: [
          'Transfer: Morning scenic drive from Jibhi to Jalori Pass.',
          'Sightseeing: Begin scenic 5-6 km trek through dense oak and cedar forest trails to sacred Serolsar Lake.',
          'Sightseeing: Hike to the 360-degree viewpoint near the lake for panoramic vistas of snow-capped Himalayan ranges.',
          'Sightseeing: Return to Jibhi for evening cafe hopping and a cozy bonfire session (weather permitting).',
          'Accommodation: Overnight stay in Jibhi.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Jibhi to Manali via Kullu Valley & Naggar',
        description: [
          'Transfer: Scenic drive from Jibhi to Manali through Kullu Valley and apple orchards (approx. 95-110 km / 4-5 hrs).',
          'Sightseeing: Optional thrilling Beas River white water rafting in Kullu (at extra cost).',
          'Sightseeing: Visit ancient Hadimba Devi Temple set amidst tall deodar cedar groves.',
          'Sightseeing: Explore lively Old Manali cafes, local bakeries, and vibrant Mall Road for souvenirs.',
          'Accommodation: Check-in & overnight stay at hotel in Manali.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Atal Tunnel, Sissu Valley Exploration & Transfer to Kasol',
        description: [
          'Transfer: Morning scenic drive through the engineering marvel Atal Tunnel into Lahaul Valley.',
          'Sightseeing: Explore picturesque Sissu village, majestic waterfalls, and snow-capped glacier viewpoints.',
          'Sightseeing: Optional snow activities at Solang Valley (if time permits).',
          'Transfer: Scenic drive to Kasol nestled along the roaring Parvati River.',
          'Sightseeing: Evening leisure for cafe hopping and soaking in the bohemian vibes of Parvati Valley.',
          'Accommodation: Check-in & overnight stay in Kasol.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Kasol Local Exploration, Manikaran Sahib & Overnight Departure to Delhi',
        description: [
          'Sightseeing: Visit holy Manikaran Sahib Gurudwara and natural thermal hot water springs.',
          'Sightseeing: Scenic nature trek to Chalal Village along pine forests and riverside trails.',
          'Sightseeing: Explore Kasol flea markets and cafes for handicrafts and Israeli cuisine.',
          'Transfer: Board evening overnight Volvo bus back to Delhi with unforgettable Himalayan memories.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival in Amritsar | Golden Temple & Wagah Border',
        description: [
          'Transfer: Pick-up on arrival at Amritsar Airport / Railway Station and transfer to hotel.',
          'Accommodation: Check-in & relaxation at hotel in Amritsar.',
          'Sightseeing: Visit the serene and spiritual Golden Temple (Harmandir Sahib).',
          'Sightseeing: Witness the electrifying Beating Retreat Ceremony at the Wagah Border.',
          'Accommodation: Comfortable overnight stay in Amritsar.',
          'Meals Included: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Amritsar to Dalhousie',
        description: [
          'Transfer: Scenic drive from Amritsar to Dalhousie through rolling hills and pine forests (approx. 200 km / 5-6 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Dalhousie.',
          'Sightseeing: Spend a quiet evening enjoying the tranquil Himalayan surroundings and valley views.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Dalhousie Sightseeing & Khajjiar Excursion',
        description: [
          'Sightseeing: Full-day excursion to Khajjiar ("Mini Switzerland of India"), scenic meadows, and pine-fringed lake.',
          'Sightseeing: Enjoy optional adventure activities at Khajjiar like zorbing, horseback riding, and nature trails.',
          'Sightseeing: Visit Panchpula Waterfalls, Subhash Baoli, St. John\'s Church, and Gandhi Chowk / Mall Road.',
          'Accommodation: Overnight stay in Dalhousie.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Dalhousie to Dharamshala',
        description: [
          'Transfer: Scenic mountain drive from Dalhousie to Dharamshala / McLeod Ganj (approx. 120 km / 4-5 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Dharamshala.',
          'Sightseeing: Evening at leisure to soak in the peaceful Tibetan ambiance and Dhauladhar views.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Dharamshala & McLeod Ganj Sightseeing',
        description: [
          'Sightseeing: Visit Tsuglagkhang Complex (Dalai Lama Temple) and Namgyal Monastery.',
          'Sightseeing: Explore Bhagsunag Temple and the cascading Bhagsunag Waterfall.',
          'Sightseeing: Visit St. John in the Wilderness Church, Tibetan Craft Market, and Naddi View Point overlooking Dhauladhar ranges.',
          'Sightseeing: Visit serene Dal Lake and HPCA International Cricket Stadium Dharamshala (subject to accessibility).',
          'Accommodation: Overnight stay in Dharamshala.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Dharamshala to Amritsar',
        description: [
          'Transfer: Scenic drive from Dharamshala back to Amritsar (approx. 200 km / 5-6 hrs).',
          'Accommodation: Check-in at hotel in Amritsar.',
          'Sightseeing: Evening at leisure for local market shopping and authentic Punjabi culinary delights.',
          'Accommodation: Overnight stay in Amritsar.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Amritsar',
        description: [
          'Transfer: Check-out and private transfer to Amritsar Airport / Railway Station for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival in Srinagar | Dal Lake, Mughal Gardens & Shikara Ride',
        description: [
          'Transfer: Pick-up from Srinagar Airport and transfer to hotel in Srinagar.',
          'Accommodation: Check-in & relaxation at hotel in Srinagar.',
          'Sightseeing: Explore historic Mughal Gardens — Shalimar Bagh, Nishat Bagh, and Chashme Shahi overlooking Dal Lake.',
          'Sightseeing: Enjoy a 1-hour sunset Shikara ride on Dal Lake passing floating markets and Pir Panjal mountain backdrops.',
          'Accommodation: Overnight stay in Srinagar.',
          'Meals Included: Dinner.'
        ]
      },
      {
        day: 2,
        title: 'Srinagar to Gulmarg | Gondola Ride & Leisure Exploration',
        description: [
          'Transfer: Scenic drive to Gulmarg via Tangmarg pine forests (approx. 55-60 km / 2-2.5 hrs).',
          'Sightseeing: Experience Asia\'s highest cable car — Gulmarg Gondola Ride (Phase 1 included).',
          'Sightseeing: Panoramic snow views across Kashmir Valley and optional pony ride to Khilanmarg.',
          'Sightseeing: Explore Gulmarg golf course, local markets, and cafes at leisure.',
          'Accommodation: Check-in & overnight stay at hotel in Gulmarg.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gulmarg to Pahalgam via Avantipur Ruins',
        description: [
          'Transfer: Scenic 4-hour drive to Pahalgam through saffron fields and Lidder Valley (approx. 140-155 km).',
          'Sightseeing: En-route visit to ancient 9th-century Avantipur Temple Ruins in Pulwama.',
          'Sightseeing: Optional river rafting or angling in the crystal-clear Lidder River.',
          'Accommodation: Check-in & overnight stay at hotel in Pahalgam.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Pahalgam Valleys Tour (Aru, Betaab, Chandanwari) to Srinagar',
        description: [
          'Sightseeing: Excursion to scenic Aru Valley with lush meadows and mountain streams.',
          'Sightseeing: Visit picturesque Betaab Valley, famed for its Bollywood film backdrops.',
          'Sightseeing: Explore Chandanwari, the starting point of the holy Amarnath Yatra.',
          'Transfer: Drive back to Srinagar (approx. 90-100 km / 3 hrs).',
          'Accommodation: Check-in & overnight stay at hotel in Srinagar.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Excursion to Sonmarg & Thajiwas Glacier | Traditional Houseboat Stay',
        description: [
          'Transfer: Scenic 3-hour morning drive to Sonmarg ("Meadow of Gold") along the Sindh River.',
          'Sightseeing: Explore Sonmarg alpine meadows and take an optional pony ride to Thajiwas Glacier.',
          'Transfer: Return drive to Srinagar in the evening.',
          'Accommodation: Check-in & traditional overnight stay in a luxury Houseboat on Dal Lake.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Departure from Srinagar',
        description: [
          'Transfer: Check-out and private transfer to Srinagar Airport for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Welcome to Singapore | Gardens by the Bay',
        description: [
          'Transfer: Private airport transfer from Singapore Changi Airport to Hotel Mi Rochor.',
          'Accommodation: Check-in & relaxation at Hotel Mi Rochor.',
          'Sightseeing: Visit Gardens by the Bay — explore the Flower Dome, Cloud Forest, and Jurassic World exhibit.',
          'Accommodation: Overnight stay in Singapore.'
        ]
      },
      {
        day: 2,
        title: 'Singapore City Tour, Singapore Flyer & Marina Bay Sands',
        description: [
          'Sightseeing: Half-day guided city tour covering Merlion Park, Civic District, Marina Bay, Esplanade, and Singapore River.',
          'Sightseeing: Soar above the skyline aboard the giant observation wheel, the Singapore Flyer.',
          'Sightseeing: Visit Marina Bay Sands Skypark observation deck for panoramic evening skyline views.',
          'Accommodation: Overnight stay in Singapore.',
          'Meals Included: Breakfast.'
        ]
      },
      {
        day: 3,
        title: 'Universal Studios Singapore – Full Day of Thrills',
        description: [
          'Transfer: Morning private transfer to Resorts World Sentosa.',
          'Sightseeing: Full-day adventure at Universal Studios Singapore.',
          'Sightseeing: Experience Hollywood Boulevard, Minion Land, Transformers 3D, Jurassic Park Rapids Adventure, and WaterWorld stunt show.',
          'Transfer: Evening private return transfer to hotel.',
          'Accommodation: Overnight stay in Singapore.',
          'Meals Included: Breakfast.'
        ]
      },
      {
        day: 4,
        title: 'Sentosa Island | Cable Car, S.E.A. Aquarium & Wings of Time',
        description: [
          'Transfer: Private transfer to Mount Faber / HarbourFront for Sentosa Cable Car.',
          'Sightseeing: Scenic Singapore Cable Car ride offering panoramic views over the harbor and city.',
          'Sightseeing: Explore S.E.A. Aquarium, home to over 100,000 marine animals across diverse habitats.',
          'Sightseeing: Experience Harry Potter: Visions of Magic interactive exhibition.',
          'Sightseeing: Watch the award-winning Wings of Time multi-sensory night laser and water show on Siloso Beach.',
          'Accommodation: Overnight stay in Singapore.',
          'Meals Included: Breakfast.'
        ]
      },
      {
        day: 5,
        title: 'Mandai Wildlife Reserve | River Wonders & Night Safari',
        description: [
          'Sightseeing: Visit River Wonders — explore Giant Panda Forest (Kai Kai & Jia Jia), Red Pandas, and Amazon River Quest.',
          'Sightseeing: Experience world-famous Night Safari — guided tram ride through nocturnal rainforest habitats.',
          'Sightseeing: Watch the Creatures of the Night animal presentation and walk along Leopard and Fishing Cat trails.',
          'Accommodation: Overnight stay in Singapore.',
          'Meals Included: Breakfast.'
        ]
      },
      {
        day: 6,
        title: 'Day at Leisure | Shopping, Little India & Chinatown',
        description: [
          'Sightseeing: Day at leisure for shopping along Orchard Road and exploring cultural enclaves like Chinatown and Little India.',
          'Sightseeing: Stroll through UNESCO-listed Singapore Botanic Gardens or relax along Marina Bay waterfront.',
          'Sightseeing: Savor iconic culinary delights at famous Singapore hawker centres (Lau Pa Sat, Maxwell, Old Airport Road).',
          'Accommodation: Overnight stay in Singapore.',
          'Meals Included: Breakfast.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Singapore',
        description: [
          'Transfer: Morning at leisure, followed by private transfer to Changi Airport for onward flight.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival at Bagdogra/NJP | Transfer to Gangtok',
        description: [
          'Transfer: Pick-up from Bagdogra Airport (IXB) / NJP Railway Station and scenic mountain drive to Gangtok (approx. 125-130 km / 4.5-5.5 hrs).',
          'Sightseeing: Enjoy panoramic views of the Teesta River and hillside tea gardens en route.',
          'Accommodation: Check-in & overnight stay at hotel in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Transfer: Early morning mountain drive to high-altitude East Sikkim (approx. 120 km round trip / 8 hrs).',
          'Sightseeing: Visit sacred glacial Tsomgo Lake (12,313 ft) with changing lake colors and optional yak ride.',
          'Sightseeing: Visit Baba Harbhajan Singh Mandir, dedicated to the legendary Indian Army soldier.',
          'Sightseeing: Optional excursion to Indo-China border at Nathula Pass (14,140 ft, subject to permits and weather; closed on Mondays).',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Pelling via Namchi & Ravangla',
        description: [
          'Transfer: Scenic mountain drive from Gangtok to Pelling (approx. 130 km / 6 hrs).',
          'Sightseeing: Visit historic 200-year-old Enchey Monastery for traditional monk blessings.',
          'Sightseeing: En-route visit to Siddheshwar Dham (Chardham) in Namchi and Buddha Park in Ravangla.',
          'Accommodation: Check-in & overnight stay at hotel in Pelling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Pelling Sightseeing & Skywalk Experience',
        description: [
          'Sightseeing: Visit sacred Khecheopalri Lake, known as the wish-fulfilling lake in dense forest.',
          'Sightseeing: Explore Rimbi Waterfalls, Rimbi Orange Garden (seasonal), and cascading Kanchenjunga Falls.',
          'Sightseeing: Walk India\'s first glass Skywalk at 7,000 ft beneath the towering Chenrezig Statue.',
          'Sightseeing: Visit 17th-century Pemayangtse Monastery and take a short forest trail to historical Rabdentse Ruins.',
          'Accommodation: Overnight stay in Pelling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Pelling to Darjeeling – Queen of the Hills',
        description: [
          'Transfer: Drive from Pelling to Darjeeling through tea gardens and hill ranges (approx. 100 km / 4 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Darjeeling.',
          'Sightseeing: Evening at leisure to stroll along Chowrasta Mall Road and enjoy fresh Darjeeling tea at heritage cafes.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Full Day Darjeeling Sightseeing & Sunrise at Tiger Hill',
        description: [
          'Sightseeing: Early morning drive (4:00 AM) to Tiger Hill for spectacular sunrise over Mt. Kanchenjunga and Himalayan peaks.',
          'Sightseeing: Visit Batasia Loop spiral railway and Gorkha War Memorial with mountain vistas.',
          'Sightseeing: Visit Himalayan Mountaineering Institute (HMI), Padmaja Naidu Himalayan Zoo (Red Pandas, Snow Leopards), and Tenzing Rock.',
          'Sightseeing: Visit Japanese Peace Pagoda, Buddhist Temple, and optional iconic Darjeeling Himalayan Toy Train joyride.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Darjeeling to Bagdogra/NJP',
        description: [
          'Transfer: Check-out and transfer to Bagdogra Airport (IXB) / NJP Railway Station (approx. 70 km / 3 hrs) for onward flight/train.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival at Bagdogra/NJP | Transfer to Gangtok',
        description: [
          'Transfer: Pick-up from Bagdogra Airport / NJP Railway Station and private scenic drive to Gangtok (approx. 125-130 km / 4.5-5.5 hrs).',
          'Sightseeing: Scenic drive passing Teesta River valley and lush tea terraces.',
          'Accommodation: Check-in & overnight stay at hotel in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Transfer: Early morning drive to high-altitude East Sikkim (approx. 120 km round trip).',
          'Sightseeing: Visit sacred glacial Tsomgo Lake (12,313 ft) with snow-capped mountain backdrops and optional yak ride.',
          'Sightseeing: Visit Baba Harbhajan Singh Mandir shrine.',
          'Sightseeing: Optional excursion to Nathula Pass on the Indo-China border (subject to permits and weather; closed on Mondays).',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Darjeeling – The Queen of Hills',
        description: [
          'Transfer: Scenic drive from Gangtok to Darjeeling (approx. 100 km / 4 hrs) through emerald tea plantations.',
          'Accommodation: Check-in & relaxation at hotel in Darjeeling.',
          'Sightseeing: Romantic evening walk along Chowrasta Mall Road, shopping for local crafts, and enjoying fresh Darjeeling tea.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Full Day Darjeeling Sightseeing & Tiger Hill Sunrise',
        description: [
          'Sightseeing: Early morning excursion (4:00 AM) to Tiger Hill for golden sunrise views over Mt. Kanchenjunga.',
          'Sightseeing: Visit Batasia Loop and Gorkha War Memorial with panoramic Himalayan backdrops.',
          'Sightseeing: Visit Himalayan Mountaineering Institute, Padmaja Naidu Himalayan Zoo, and Tenzing Rock.',
          'Sightseeing: Visit Japanese Peace Pagoda and enjoy an optional romantic Toy Train joyride.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Departure from Darjeeling to Bagdogra/NJP',
        description: [
          'Transfer: Check-out and transfer to Bagdogra Airport / NJP Railway Station (approx. 70 km / 3 hrs) for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival at Bagdogra/NJP | Transfer to Gangtok',
        description: [
          'Transfer: Pick-up from Bagdogra Airport / NJP Railway Station and transfer to Gangtok (approx. 125-130 km / 4.5-5.5 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Gangtok.',
          'Sightseeing: Evening at leisure to stroll along MG Marg.',
          'Accommodation: Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Transfer: Morning drive to high-altitude East Sikkim (approx. 120 km round trip).',
          'Sightseeing: Visit holy glacial Tsomgo Lake (12,313 ft) and enjoy scenic lakeside views.',
          'Sightseeing: Visit Baba Harbhajan Singh Mandir.',
          'Sightseeing: Optional visit to Indo-China border at Nathula Pass (subject to permits; closed on Mondays).',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Pelling via Ravangla & Namchi',
        description: [
          'Transfer: Scenic drive from Gangtok to Pelling (approx. 130 km / 6 hrs).',
          'Sightseeing: Visit historic Enchey Monastery for traditional monk blessings.',
          'Sightseeing: En-route visit to Siddheshwar Dham (Chardham Namchi) and Buddha Park in Ravangla.',
          'Accommodation: Check-in & overnight stay at hotel in Pelling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Pelling Sightseeing with Skywalk & Transfer to Darjeeling',
        description: [
          'Sightseeing: Visit Rimbi Waterfalls, Orange Garden, and Kanchenjunga Waterfalls.',
          'Sightseeing: Walk India\'s first glass Skywalk at 7,000 ft and visit the colossal Chenrezig Statue.',
          'Sightseeing: Visit 17th-century Pemayangtse Monastery and historic Rabdentse Ruins.',
          'Transfer: Afternoon drive from Pelling to Darjeeling (approx. 100 km / 4 hrs).',
          'Accommodation: Check-in & overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Excursion to Mirik Lake & Tea Gardens',
        description: [
          'Transfer: Scenic 2-hour day trip to the peaceful hill town of Mirik.',
          'Sightseeing: Visit Sumendu Lake (Mirik Lake) surrounded by dense pine forests and crossed by an arched footbridge.',
          'Sightseeing: Enjoy lakeside boating, horseback riding, or relaxing walks along tea gardens.',
          'Transfer: Return drive to Darjeeling by evening.',
          'Sightseeing: Evening leisure along Chowrasta Mall Road and heritage cafes.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Full Day Darjeeling Sightseeing & Tiger Hill Sunrise',
        description: [
          'Sightseeing: Early morning trip (4:00 AM) to Tiger Hill for iconic sunrise views over Mt. Kanchenjunga.',
          'Sightseeing: Visit Batasia Loop spiral railway and Gorkha War Memorial.',
          'Sightseeing: Visit Himalayan Mountaineering Institute (HMI), Padmaja Naidu Himalayan Zoo, and Tenzing Rock.',
          'Sightseeing: Visit Japanese Peace Pagoda and enjoy optional Darjeeling Himalayan Toy Train joyride.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Departure from Darjeeling to Bagdogra/NJP',
        description: [
          'Transfer: Check-out and transfer to Bagdogra Airport / NJP Railway Station for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival at Bagdogra/NJP | Transfer to Gangtok',
        description: [
          'Transfer: Pick-up from Bagdogra Airport / NJP Railway Station and transfer to Gangtok (approx. 125-130 km / 4.5-5.5 hrs).',
          'Accommodation: Check-in & overnight stay at hotel in Gangtok.',
          'Sightseeing: Evening at leisure to explore MG Marg.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Transfer: Mountain excursion to Tsomgo Lake and Baba Mandir (approx. 120 km round trip).',
          'Sightseeing: Visit glacial Tsomgo Lake (12,313 ft) and Baba Harbhajan Singh Mandir.',
          'Sightseeing: Optional visit to Nathula Pass on the Indo-China border (subject to permits).',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Lachen via Mangan & Chungthang',
        description: [
          'Transfer: Scenic mountain drive to North Sikkim (approx. 110-120 km / 5-6 hrs).',
          'Sightseeing: En-route stop at Kabi Lungchok historical site, Seven Sisters Waterfall, and Naga Waterfall.',
          'Sightseeing: Stop at Singhik Viewpoint for panoramic vistas of Mt. Kanchenjunga and Teesta Valley.',
          'Sightseeing: Drive through Chungthang, the confluence of Lachen Chu and Lachung Chu rivers.',
          'Accommodation: Check-in & overnight stay at hotel in Lachen.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Lachen to Gurudongmar Lake Excursion & Transfer to Lachung',
        description: [
          'Transfer: Early morning high-altitude drive passing Thangu Village (13,450 ft) to Gurudongmar Lake (approx. 55-60 km / 3-4 hrs).',
          'Sightseeing: Visit holy Gurudongmar Lake at 17,800 ft, one of the highest lakes in the world with turquoise glacial waters.',
          'Transfer: Return drive through Chungthang to Lachung valley.',
          'Accommodation: Check-in & overnight stay at hotel in Lachung.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Excursion to Yumthang Valley & Optional Zero Point',
        description: [
          'Transfer: Morning drive to Yumthang Valley (approx. 25 km / 1-1.5 hrs).',
          'Sightseeing: Explore the picturesque "Valley of Flowers" with alpine meadows, hot springs, and river streams.',
          'Sightseeing: Optional excursion to Zero Point (Yumesamdong) near the international border for snow landscapes.',
          'Accommodation: Overnight stay at hotel in Lachung.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Transfer from Lachung to Gangtok',
        description: [
          'Transfer: Drive back from Lachung to Gangtok along the Teesta River (approx. 115-120 km / 5-6 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Gangtok.',
          'Sightseeing: Evening at leisure to stroll MG Marg, enjoy hot momos, and shop for local handicrafts.',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Gangtok to Zuluk along the Old Silk Route',
        description: [
          'Transfer: Scenic mountain drive to Zuluk along the historic Old Silk Route via Rongli (approx. 90-100 km / 4-5 hrs).',
          'Sightseeing: Drive through pine forests and picturesque hamlet of Padamchen.',
          'Sightseeing: Witness sunset over drifting valley clouds along the legendary trade route.',
          'Accommodation: Check-in & overnight stay in Zuluk.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Zuluk to Pelling via Thambi Viewpoint & Nathang Valley',
        description: [
          'Sightseeing: Pre-dawn drive to Thambi Viewpoint (11,200 ft) for 32-hairpin zig-zag road vistas and sunrise over Kanchenjunga range.',
          'Sightseeing: Explore high-altitude Nathang Valley (13,500 ft) and Lungthung Viewpoint.',
          'Transfer: Drive to Pelling in West Sikkim via Ravangla region (approx. 150-170 km / 6-8 hrs).',
          'Accommodation: Check-in & overnight stay in Pelling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 9,
        title: 'Pelling Sightseeing & Skywalk | Transfer to Darjeeling',
        description: [
          'Sightseeing: Walk India\'s first glass Skywalk at 7,000 ft and visit the colossal Chenrezig Statue.',
          'Sightseeing: Visit 17th-century Pemayangtse Monastery and forest walk to Rabdentse Ruins.',
          'Transfer: Afternoon drive from Pelling to Darjeeling (approx. 100 km / 4 hrs).',
          'Accommodation: Check-in & overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 10,
        title: 'Full Day Darjeeling Sightseeing & Tiger Hill Sunrise',
        description: [
          'Sightseeing: Early morning trip (4:00 AM) to Tiger Hill for world-famous sunrise over Mt. Kanchenjunga.',
          'Sightseeing: Visit Batasia Loop, Gorkha War Memorial, and Japanese Peace Pagoda.',
          'Sightseeing: Explore Himalayan Mountaineering Institute, Padmaja Naidu Himalayan Zoo, and Tenzing Rock.',
          'Sightseeing: Optional Darjeeling Himalayan Toy Train joyride.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 11,
        title: 'Departure from Darjeeling to Bagdogra/NJP',
        description: [
          'Transfer: Check-out and transfer to Bagdogra Airport / NJP Railway Station for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival at Bagdogra/NJP | Transfer to Gangtok',
        description: [
          'Transfer: Pick-up from Bagdogra Airport / NJP Railway Station and transfer to Gangtok (approx. 125-130 km / 4.5-5.5 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Gangtok.',
          'Sightseeing: Evening at leisure to explore MG Marg.',
          'Accommodation: Overnight stay in Gangtok.'
        ]
      },
      {
        day: 2,
        title: 'Excursion to Tsomgo Lake & Baba Mandir | Optional Nathula Pass',
        description: [
          'Transfer: High-altitude mountain drive to East Sikkim (approx. 120 km round trip).',
          'Sightseeing: Visit holy glacial Tsomgo Lake (12,313 ft) and Baba Harbhajan Singh Mandir.',
          'Sightseeing: Optional visit to Indo-China border at Nathula Pass (subject to permits).',
          'Accommodation: Overnight stay in Gangtok.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 3,
        title: 'Gangtok to Zuluk along the Old Silk Route',
        description: [
          'Transfer: Scenic drive towards Zuluk via Rongli checkpoint (approx. 90-100 km / 4-5 hrs).',
          'Sightseeing: Pass through dense pine forests, historic trade checkpoints, and mountain village of Padamchen.',
          'Sightseeing: Evening sunset and drifting clouds over the Old Silk Route valleys.',
          'Accommodation: Check-in & overnight stay in Zuluk.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 4,
        title: 'Zuluk to Aritar via Thambi Viewpoint & Nathang Valley',
        description: [
          'Sightseeing: Early morning drive to Thambi Viewpoint (11,200 ft) for golden sunrise views over Kanchenjunga and hairpin loops.',
          'Sightseeing: Drive through rugged Nathang Valley (13,500 ft), Lungthung, and Eagle\'s Nest Bunker.',
          'Transfer: Descend to the peaceful village of Aritar (approx. 35-45 km / 2 hrs).',
          'Accommodation: Check-in & overnight stay at eco-resort in Aritar.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 5,
        title: 'Aritar to Rishikhola Riverside Retreat',
        description: [
          'Sightseeing: Visit Lampokhari Lake (emerald boot-shaped lake) and ancient Aritar Monastery.',
          'Transfer: Short scenic drive down to Rishikhola river hamlet on the Sikkim-Bengal border (approx. 15-20 km / 1 hr).',
          'Sightseeing: Riverside walks, dipping feet in crystal-clear mountain waters, bird watching, and peaceful bonfire evening.',
          'Accommodation: Check-in & overnight stay in riverside eco-cottages in Rishikhola.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 6,
        title: 'Rishikhola to Darjeeling – Queen of the Hills',
        description: [
          'Transfer: Scenic drive from Rishikhola to Darjeeling through tea estates (approx. 70-80 km / 4-5 hrs).',
          'Accommodation: Check-in & relaxation at hotel in Darjeeling.',
          'Sightseeing: Evening at leisure around Chowrasta Mall Road and heritage tea cafes.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 7,
        title: 'Full Day Darjeeling Sightseeing & Tiger Hill Sunrise',
        description: [
          'Sightseeing: Early morning trip (4:00 AM) to Tiger Hill for panoramic sunrise over Mt. Kanchenjunga.',
          'Sightseeing: Visit Batasia Loop spiral railway, Gorkha War Memorial, and Japanese Peace Pagoda.',
          'Sightseeing: Visit Himalayan Mountaineering Institute, Padmaja Naidu Himalayan Zoo, and Tenzing Rock.',
          'Sightseeing: Optional heritage Darjeeling Toy Train ride.',
          'Accommodation: Overnight stay in Darjeeling.',
          'Meals Included: Breakfast & Dinner.'
        ]
      },
      {
        day: 8,
        title: 'Departure from Darjeeling to Bagdogra/NJP',
        description: [
          'Transfer: Check-out and transfer to Bagdogra Airport / NJP Railway Station for onward journey.',
          'Meals Included: Breakfast.'
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Transfer: Airport pickup at Kushok Bakula Rimpochee Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town',
          'Sightseeing: Evening trip briefing & orientation session with Trip Captain'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic views of Leh city',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill optical illusion & historic Gurudwara Pathar Sahib',
          'Sightseeing: Ladakh Hall of Fame War Memorial & evening cafe hopping at Leh Market'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km scenic ride/drive crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert with double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Turtuk Village (Indo-Pak Border)',
        description: [
          'Transfer: 160 km round-trip excursion along Shyok River to Turtuk',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Explore remote border village of Turtuk & unique Balti culture',
          'Sightseeing: Apricot and walnut orchards & Shyok War Memorial'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km off-road journey via Agam & Shyok river route',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: Color-changing high-altitude Pangong Tso (4,300 m)',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset photography'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km ride/drive through Chushul & Loma Bridge across the Indus River',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Rezang La War Memorial tribute to the martyrs of 1962 War',
          'Sightseeing: Dark sky stargazing in the tranquil high-altitude village of Hanle'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Excursion',
        description: [
          'Transfer: 200 km round-trip ride/drive crossing Photi La (5,524 m)',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Summit Umling La (5,640 m) — the world\'s highest motorable road',
          'Sightseeing: Demchok border village (Indo-China border) & Indian Astronomical Observatory'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Tso Moriri Lake via Mahe',
        description: [
          'Transfer: 150 km scenic journey across Loma Bridge & Mahe to Tso Moriri',
          'Accommodation: Lake View Stay / Camp at Tso Moriri (Korzok)',
          'Sightseeing: Pristine high-altitude deep blue waters of Tso Moriri Lake (4,522 m)',
          'Sightseeing: Wetland sanctuary home to migratory birds & historic Korzok Monastery'
        ]
      },
      {
        day: 9,
        title: 'Tso Moriri to Leh via Puga Valley & Chumathang Hot Springs',
        description: [
          'Transfer: 154 km scenic drive/ride from Tso Moriri to Leh via Chumathang & Upshi',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Geothermal sulphur mud pools of Puga Valley & Chumathang Hot Springs',
          'Sightseeing: Scenic towns of Karu, Thiksey & evening shopping in Leh Main Bazaar'
        ]
      },
      {
        day: 10,
        title: 'Leh Airport Drop & Tour Conclusion',
        description: [
          'Transfer: Hotel checkout & airport drop at Kushok Bakula Rimpochee Airport Leh',
          'Sightseeing: Departure with unforgettable memories of the ultimate Ladakh expedition'
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
        title: 'Arrival in Leh & Acclimatization Day',
        description: [
          'Transfer: Airport pickup at Kushok Bakula Rimpochee Airport & hotel transfer',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Mandatory rest & acclimatization walk around Leh town',
          'Sightseeing: Evening bike allotment, test ride & briefing with Road Captain'
        ]
      },
      {
        day: 2,
        title: 'Leh Local Sightseeing & Sham Valley Tour',
        description: [
          'Accommodation: Hotel in Leh',
          'Sightseeing: Iconic Shanti Stupa with panoramic views of Leh Valley',
          'Sightseeing: Sangam Point (Indus & Zanskar River Confluence)',
          'Sightseeing: Magnetic Hill optical illusion & historic Gurudwara Pathar Sahib',
          'Sightseeing: Ladakh Hall of Fame War Memorial & evening cafe hopping at Leh Market'
        ]
      },
      {
        day: 3,
        title: 'Leh to Nubra Valley via Khardung La Pass (17,982 ft)',
        description: [
          'Transfer: 125 km thrilling ride crossing Khardung La Pass (5,359 m)',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Diskit Monastery & 106-ft Maitreya Buddha Statue',
          'Sightseeing: Hunder Sand Dunes cold desert with double-humped camel safari & ATV rides'
        ]
      },
      {
        day: 4,
        title: 'Day Excursion to Turtuk Village (Indo-Pak Border)',
        description: [
          'Transfer: 160 km round-trip ride along Shyok River to Turtuk',
          'Accommodation: Hotel / Camp in Nubra Valley',
          'Sightseeing: Ride to the remote border village of Turtuk & explore Balti culture',
          'Sightseeing: Apricot and walnut orchards & Shyok War Memorial'
        ]
      },
      {
        day: 5,
        title: 'Nubra Valley to Pangong Tso via Shyok River',
        description: [
          'Transfer: 160 km off-road riverbed ride via Agam & Shyok river route',
          'Accommodation: Campsite near Pangong Lake',
          'Sightseeing: Color-changing high-altitude Pangong Tso (4,300 m)',
          'Sightseeing: 3 Idiots shooting point & lakeside sunset photography'
        ]
      },
      {
        day: 6,
        title: 'Pangong Tso to Hanle via Rezang La War Memorial',
        description: [
          'Transfer: 165 km ride through Chushul & Loma Bridge across the Indus River',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Rezang La War Memorial tribute to the martyrs of 1962 War',
          'Sightseeing: Dark sky stargazing in the tranquil high-altitude village of Hanle'
        ]
      },
      {
        day: 7,
        title: 'Hanle to Umling La Pass (19,024 ft) & Demchok Excursion',
        description: [
          'Transfer: 200 km round-trip ride crossing Photi La (5,524 m)',
          'Accommodation: Homestay in Hanle',
          'Sightseeing: Summit Umling La (5,640 m) — the world\'s highest motorable road',
          'Sightseeing: Demchok border village (Indo-China border) & Indian Astronomical Observatory'
        ]
      },
      {
        day: 8,
        title: 'Hanle to Leh via Tso Moriri Lake & Chumathang',
        description: [
          'Transfer: 289 km scenic journey to Leh via Loma Bridge, Mahe & Chumathang',
          'Accommodation: Hotel in Leh',
          'Sightseeing: Pristine high-altitude deep blue waters of Tso Moriri Lake (4,522 m)',
          'Sightseeing: Chumathang hot springs & evening shopping at Leh Main Bazaar'
        ]
      },
      {
        day: 9,
        title: 'Leh Airport Drop & Tour Conclusion',
        description: [
          'Transfer: Hotel checkout & airport drop at Kushok Bakula Rimpochee Airport Leh',
          'Sightseeing: Departure with unforgettable riding memories of the Ladakh bike expedition'
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
        title: 'Arrival in Phuket & Transfer to Krabi Hotel',
        description: [
          'Transfer: Airport pickup at Phuket International Airport & scenic transfer to Krabi',
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Check-in, relax & evening stroll at Ao Nang Beach Market'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4-Island Tour by Longtail Boat with Snorkeling',
        description: [
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Phra Nang Cave Beach, Princess Cave & limestone cliffs',
          'Sightseeing: Tub Island & Mor Island Sandbar Walk during low tide',
          'Sightseeing: Chicken Island Snorkeling & coral reef marine life',
          'Sightseeing: Poda Island Beach Picnic Lunch & turquoise waters'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Koh Samui Ferry & Iconic Koh Phangan Full Moon Party',
        description: [
          'Transfer: Coach to pier & ferry crossing to Koh Samui island',
          'Transfer: Speedboat transfer from Koh Samui to Koh Phangan for Full Moon Party',
          'Accommodation: Overnight Full Moon Party on Haad Rin Beach, Koh Phangan',
          'Sightseeing: World-famous Full Moon Beach Party with neon body paint & international DJs'
        ]
      },
      {
        day: 4,
        title: 'Koh Phangan to Koh Samui Return & Beach Fire Show',
        description: [
          'Transfer: Early morning ferry return from Koh Phangan to Koh Samui hotel',
          'Accommodation: Beach Resort in Koh Samui',
          'Sightseeing: Afternoon relaxation & recovery by the pool',
          'Sightseeing: Spectacular Night Beach Fire Show & Beachfront Clubbing'
        ]
      },
      {
        day: 5,
        title: 'Koh Samui to Phuket Transfer & Leisure Evening',
        description: [
          'Transfer: Ferry to Donsak Pier & private coach drive to Phuket',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Bangla Road Nightlife & Patong Beach Night Walk'
        ]
      },
      {
        day: 6,
        title: 'Phi Phi Islands Speedboat Tour with Maya Bay & Snorkeling',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Speedboat cruise to Phi Phi Don & Phi Phi Leh Islands',
          'Sightseeing: Iconic Maya Bay, Viking Cave & Pileh Lagoon emerald swimming',
          'Sightseeing: Monkey Beach Stroll & Khai Nok Island Snorkeling'
        ]
      },
      {
        day: 7,
        title: 'Departure from Phuket - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Phuket International Airport for departure flight'
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
        title: 'Arrival in Phuket & Scenic Transfer to Krabi',
        description: [
          'Transfer: Airport pickup at Phuket International Airport & scenic road drive to Krabi',
          'Accommodation: Hotel / Resort in Krabi',
          'Sightseeing: Check-in, freshen up & leisure sunset walk at Ao Nang Beach'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4-Island Speedboat Excursion with Beach Lunch',
        description: [
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Phranang Cave Beach & sacred Princess Shrine',
          'Sightseeing: Tup Island & Mor Island pristine sandbar walk',
          'Sightseeing: Poda Island Beach Stroll & Chicken Island limestone rock photography',
          'Sightseeing: Snorkeling in crystal-clear emerald waters'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket Transfer & Evening Siam Cabaret Show',
        description: [
          'Transfer: Private transfer from Krabi to Phuket hotel',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Siam Cabaret Show dazzling theatrical performance & glamorous costumes'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Islands Speedboat Tour with Maya Bay',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Speedboat trip to Phi Phi Don & Phi Phi Leh',
          'Sightseeing: Iconic Maya Bay & Pileh Lagoon emerald swimming',
          'Sightseeing: Monkey Beach & Viking Cave historic rock formations'
        ]
      },
      {
        day: 5,
        title: 'Phuket City Heritage & Scenic Viewpoints Tour',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Karon Viewpoint panoramic vistas of Kata & Kata Noi beaches',
          'Sightseeing: Sacred Wat Chalong Buddhist Temple & Big Buddha Statue on Nakkerd Hill',
          'Sightseeing: Leisure Evening at Patong Beach & Night Bazaar'
        ]
      },
      {
        day: 6,
        title: 'Phuket to Bangkok Flight & Romantic Chao Phraya Dinner Cruise',
        description: [
          'Transfer: Domestic flight from Phuket to Bangkok & private hotel transfer',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Luxury Chao Phraya River Evening Dinner Cruise',
          'Sightseeing: Illuminated Night Views of Wat Arun, Grand Palace & Skyline'
        ]
      },
      {
        day: 7,
        title: 'Bangkok Historic Temples Tour & Gems Gallery',
        description: [
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Golden Buddha Temple (Wat Traimit) & Emerald Buddha Temple (Wat Phra Kaew)',
          'Sightseeing: World\'s Largest Gems Gallery Handcrafted Jewelry Tour',
          'Sightseeing: Evening Street Food & Shopping at IconSiam / Pratunam'
        ]
      },
      {
        day: 8,
        title: 'Departure from Bangkok - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Suvarnabhumi / Don Mueang International Airport'
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
        title: 'Arrival in Phuket & Transfer to Krabi',
        description: [
          'Transfer: Airport pickup at Phuket Airport & scenic 3-hour transfer to Krabi',
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Check-in, relax & evening at leisure'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4-Island Tour by Speedboat',
        description: [
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Krabi 4 Island Speedboat Tour',
          'Sightseeing: Phra Nang Cave Beach, Tup Island & Poda Island',
          'Sightseeing: Chicken Island Snorkeling & Beach Picnic Lunch'
        ]
      },
      {
        day: 3,
        title: 'Krabi to Phuket Transfer & Evening Siam Cabaret Show',
        description: [
          'Transfer: Scenic road transfer from Krabi to Phuket hotel',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Check-in & evening Siam Cabaret Show Phuket'
        ]
      },
      {
        day: 4,
        title: 'Phi Phi Islands Speedboat Tour',
        description: [
          'Transfer: Speedboat transfers for island hopping',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phi Phi Island Speedboat Tour with Maya Bay & Monkey Beach',
          'Sightseeing: Snorkeling in crystal-clear waters & beachside lunch'
        ]
      },
      {
        day: 5,
        title: 'Phuket City Tour & Leisure Evening',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phuket City Tour & Karon View Point',
          'Sightseeing: Historic Wat Chalong Temple & Big Buddha Statue',
          'Sightseeing: Panoramic views of Kata & Kata Noi Beaches'
        ]
      },
      {
        day: 6,
        title: 'Phuket Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Phuket Airport for onward flight',
          'Sightseeing: Departure with cherished tropical memories'
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
        title: 'Arrival in Phuket & Simon Cabaret Show',
        description: [
          'Transfer: Airport pickup at Phuket Airport & transfer to hotel',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Check-in & evening Simon Cabaret Show Phuket'
        ]
      },
      {
        day: 2,
        title: 'Phi Phi Islands Speedboat Tour',
        description: [
          'Transfer: Speedboat transfers for island hopping',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phi Phi Island Tour with Maya Bay & Monkey Beach',
          'Sightseeing: Snorkeling in turquoise waters & island lunch'
        ]
      },
      {
        day: 3,
        title: 'Phuket City Tour & Leisure Evening',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phuket City Tour with Karon View Point',
          'Sightseeing: Wat Chalong Temple & Big Buddha Statue',
          'Sightseeing: Scenic views of Kata & Kata Noi Beaches'
        ]
      },
      {
        day: 4,
        title: 'Phuket to Bangkok & Chao Phraya Dinner Cruise',
        description: [
          'Transfer: Transfer to Phuket Airport & flight to Bangkok',
          'Transfer: Bangkok Airport pickup & transfer to hotel',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Luxury Chao Phraya River Dinner Cruise with live performances'
        ]
      },
      {
        day: 5,
        title: 'Bangkok City & Temple Tour',
        description: [
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Bangkok City & Temple Tour',
          'Sightseeing: Golden Buddha Temple (Wat Traimit) & Emerald Buddha Temple',
          'Sightseeing: Gems Gallery shopping experience'
        ]
      },
      {
        day: 6,
        title: 'Bangkok Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Bangkok Airport for onward journey',
          'Sightseeing: Departure with unforgettable Thailand memories'
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
        title: 'Arrival in Bangkok, Transfer to Pattaya & Alcazar Show',
        description: [
          'Transfer: Airport pickup at Bangkok Airport & 2-hour drive to Pattaya',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Check-in & evening Alcazar Cabaret Show with exotic set designs'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Speedboat Tour & Pattaya Nightlife',
        description: [
          'Transfer: Speedboat ride from Pattaya pier to Coral Island',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Tawaen Beach relaxation, swimming & water sports',
          'Sightseeing: Snorkeling & sea walker coral exploration',
          'Sightseeing: Evening stroll & nightlife on Pattaya Walking Street'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Tropical Botanical Village Tour',
        description: [
          'Transfer: Round-trip transfer to Nong Nooch Tropical Village',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Nong Nooch Botanical Gardens, Zoo & Thai Cultural Show',
          'Sightseeing: Themed gardens, elephant talent show & scenic lake paddle boating'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok, City Temples & Chao Phraya Dinner Cruise',
        description: [
          'Transfer: Inter-city transfer from Pattaya to Bangkok hotel',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Bangkok City & Temple Tour with Golden Buddha & Gems Gallery',
          'Sightseeing: Luxury Chao Phraya River Dinner Cruise with international buffet'
        ]
      },
      {
        day: 5,
        title: 'Full Day Safari World & Marine Park',
        description: [
          'Transfer: Round-trip transfer to Safari World & Marine Park',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Open-air Safari Park with lions, tigers, zebras & giraffes',
          'Sightseeing: Marine Park shows featuring dolphins, sea lions & cowboy stunts',
          'Sightseeing: Buffet lunch inside the park & exotic bird aviary'
        ]
      },
      {
        day: 6,
        title: 'Bangkok to Phuket & Simon Cabaret Show',
        description: [
          'Transfer: Transfer to Bangkok Airport & flight to Phuket',
          'Transfer: Phuket Airport pickup & hotel check-in',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Evening Simon Cabaret Show Phuket'
        ]
      },
      {
        day: 7,
        title: 'Phi Phi Islands Speedboat Tour',
        description: [
          'Transfer: Speedboat transfers for island hopping',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phi Phi Island Tour with Maya Bay & Monkey Beach',
          'Sightseeing: Snorkeling in turquoise waters & beachside lunch'
        ]
      },
      {
        day: 8,
        title: 'Phuket City Tour & Leisure Evening',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phuket City Tour & Karon View Point',
          'Sightseeing: Wat Chalong Temple & Big Buddha Statue',
          'Sightseeing: Scenic coastline views of Kata & Kata Noi Beaches'
        ]
      },
      {
        day: 9,
        title: 'Phuket Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Phuket Airport for onward flight',
          'Sightseeing: Departure with wonderful memories of Thailand'
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
        title: 'Arrival in Bangkok, Transfer to Pattaya & Alcazar Show',
        description: [
          'Transfer: Airport pickup at Bangkok Airport & 2-hour drive to Pattaya',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Check-in & evening Alcazar Cabaret Show'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Speedboat Tour & Pattaya Walking Street',
        description: [
          'Transfer: Speedboat ride to Coral Island (Koh Larn)',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Tawaen Beach relaxation & water sports',
          'Sightseeing: Snorkeling & vibrant evening at Pattaya Walking Street'
        ]
      },
      {
        day: 3,
        title: 'Nong Nooch Tropical Botanical Village Tour',
        description: [
          'Transfer: Round-trip transfer to Nong Nooch Tropical Village',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Nong Nooch Botanical Gardens, Zoo & Thai Cultural Show',
          'Sightseeing: Elephant shows, themed gardens & lake views'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok, City Temples & Chao Phraya Dinner Cruise',
        description: [
          'Transfer: Inter-city transfer from Pattaya to Bangkok',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Golden Buddha Temple, Reclining Buddha & Gems Gallery',
          'Sightseeing: Luxury Chao Phraya River Dinner Cruise with live entertainment'
        ]
      },
      {
        day: 5,
        title: 'Full Day Safari World & Marine Park',
        description: [
          'Transfer: Round-trip transfer to Safari World & Marine Park',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Open-air Safari Park drive-through with exotic wildlife',
          'Sightseeing: Marine Park dolphin, sea lion & stunt shows with buffet lunch'
        ]
      },
      {
        day: 6,
        title: 'Full Day Dream World Amusement Park',
        description: [
          'Transfer: Round-trip transfer to Dream World Bangkok',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Thrill rides including Sky Coaster, Grand Canyon & Super Splash',
          'Sightseeing: Snow Town winter experience, cartoon parades & buffet lunch'
        ]
      },
      {
        day: 7,
        title: 'Bangkok Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Bangkok Airport for departure',
          'Sightseeing: Departure with cherished family memories'
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
        title: 'Arrival in Phuket & Leisure Day',
        description: [
          'Transfer: Airport pickup at Phuket International Airport & transfer to hotel',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Check-in, relax & evening at leisure'
        ]
      },
      {
        day: 2,
        title: 'Phuket City Tour with Big Buddha & Promthep Cape',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Karon View Point overlooking Kata & Kata Noi Beaches',
          'Sightseeing: Wat Chalong Temple & Phuket Big Buddha Statue',
          'Sightseeing: Promthep Cape panoramic viewpoints & Old Phuket Town Sino-Portuguese architecture'
        ]
      },
      {
        day: 3,
        title: 'Phi Phi Islands Speedboat Tour with Local Lunch',
        description: [
          'Transfer: Speedboat transfers for island hopping',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phi Phi Island Tour with Maya Bay, Viking Cave & Monkey Beach',
          'Sightseeing: Snorkeling in turquoise lagoons & beachside lunch'
        ]
      },
      {
        day: 4,
        title: 'Tiger Kingdom Phuket (Medium Tiger Zone) & Leisure Evening',
        description: [
          'Transfer: Round-trip transfer to Tiger Kingdom Phuket',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Tiger Kingdom Medium Tiger Zone encounter & photo opportunities',
          'Sightseeing: Educational conservation briefing & evening leisure at Patong'
        ]
      },
      {
        day: 5,
        title: 'Phuket Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Phuket Airport for onward flight',
          'Sightseeing: Departure with wonderful family memories'
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
        title: 'Arrival in Bangkok & Transfer to Pattaya',
        description: [
          'Transfer: Airport pickup at Bangkok Airport & 2-hour drive to Pattaya',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Check-in, relax & evening at leisure'
        ]
      },
      {
        day: 2,
        title: 'Coral Island Speedboat Tour & Pattaya Nightlife',
        description: [
          'Transfer: Speedboat ride from Pattaya pier to Coral Island (Koh Larn)',
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Tawaen Beach relaxation, swimming & water sports',
          'Sightseeing: Snorkeling, seafood lunch & evening at Pattaya Walking Street'
        ]
      },
      {
        day: 3,
        title: 'Leisure Day in Pattaya & Optional Sightseeing',
        description: [
          'Accommodation: Hotel in Pattaya',
          'Sightseeing: Free day for beach leisure, shopping or visiting Sanctuary of Truth',
          'Sightseeing: Optional visit to Big Buddha Temple & Pattaya City Viewpoint'
        ]
      },
      {
        day: 4,
        title: 'Pattaya to Bangkok & En Route City Temple Tour',
        description: [
          'Transfer: Scenic inter-city transfer from Pattaya to Bangkok',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Bangkok City Tour with Golden Buddha Temple & Reclining Buddha',
          'Sightseeing: Hotel check-in & evening leisure'
        ]
      },
      {
        day: 5,
        title: 'Full Day Safari World & Marine Park',
        description: [
          'Transfer: Round-trip transfer to Safari World & Marine Park',
          'Accommodation: Hotel in Bangkok',
          'Sightseeing: Open-air Safari Park safari drive with lions, zebras & giraffes',
          'Sightseeing: Marine Park dolphin, seal & stunt shows with buffet lunch'
        ]
      },
      {
        day: 6,
        title: 'Bangkok Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Bangkok Airport for departure',
          'Sightseeing: Departure with memorable family experiences'
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
        title: 'Arrival in Phuket & Transfer to Krabi',
        description: [
          'Transfer: Airport pickup at Phuket Airport & 3-hour transfer to Krabi',
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Check-in, relax & evening at leisure'
        ]
      },
      {
        day: 2,
        title: 'Krabi 4-Island Tour by Speedboat',
        description: [
          'Transfer: Speedboat transfers for 4-Island hopping',
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Phra Nang Cave Beach, Tup Island & Poda Island',
          'Sightseeing: Chicken Island Snorkeling & beach picnic lunch'
        ]
      },
      {
        day: 3,
        title: 'Krabi Half-Day Morning City Tour & Rainforest Walk',
        description: [
          'Accommodation: Hotel in Krabi',
          'Sightseeing: Scenic coastline drive & Khao Khanab Nam limestone cave',
          'Sightseeing: Mud Crabs Sculpture photo stop & Wat Sai Thai Reclining Buddha',
          'Sightseeing: Tiger Cave Temple panoramic viewpoint & 1000-year-old rainforest walk'
        ]
      },
      {
        day: 4,
        title: 'Krabi to Phuket Transfer & Leisure Evening',
        description: [
          'Transfer: Scenic 2-3 hour drive from Krabi to Phuket hotel',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Check-in, beach relaxation & evening stroll at Patong'
        ]
      },
      {
        day: 5,
        title: 'Phi Phi Islands Speedboat Tour',
        description: [
          'Transfer: Speedboat transfers for island hopping',
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Phi Phi Island Tour with Maya Bay & Monkey Beach',
          'Sightseeing: Snorkeling in crystal-clear waters & beachside lunch'
        ]
      },
      {
        day: 6,
        title: 'Phuket City Tour & Panoramic Viewpoints',
        description: [
          'Accommodation: Hotel in Phuket',
          'Sightseeing: Karon View Point overlooking Kata & Kata Noi Beaches',
          'Sightseeing: Historic Wat Chalong Temple & Phuket Big Buddha Statue',
          'Sightseeing: Old Phuket Town heritage walk & sunset views'
        ]
      },
      {
        day: 7,
        title: 'Phuket Departure',
        description: [
          'Transfer: Hotel checkout & transfer to Phuket Airport for departure',
          'Sightseeing: Departure with cherished romantic memories'
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
      hotels: 4,
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
        'Airport & Sightseeing in Private Mini Bus',
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
          'Transfer: We will pick you up at Noi Bai Airport and transfer you to Hanoi Hotel Private Transfers By Mini Bus.',
          'Accommodation: Babylon Grand Hotel',
          'Sightseeing: Hanoi Guided City Tour Old Quarters',
          'Sightseeing: Experience Hanoi on Cycle ( Hanoi Cyclo Tour )',
          'Sightseeing: Evening Visit Train Street & Famous Beer Experience.'
        ]
      },
      {
        day: 2,
        title: 'Ninh - Binh - Trang An - Mua Cave , Overnight Train to Sapa',
        description: [
          'Transfer: Luxury Overnight Train To Sapa  Hanoi → Sapa: SP3 Overnight Train — 22:00–05:55 hrs',
          'Accommodation: Luxury Overnight Train (SP3 AC Sleeper Cabin)',
          'Sightseeing: Nin Binh Experience - Trang An Boat Ride , Visit Mua Cave View point , Hoa Lu Ancient Capital'
        ]
      },
      {
        day: 3,
        title: 'Sapa Rong May Glass Bridge , Rainbow Slide , Alpine Coaster & Cat Cat Village',
        description: [
          'Accommodation: Sapa Relax Hotel',
          'Sightseeing: Muong Hoa Glass Bridge',
          'Sightseeing: Rainbow Slide Experience',
          'Sightseeing: Apline Coaster',
          'Sightseeing: Cat Cat Villlage Trail'
        ]
      },
      {
        day: 4,
        title: 'Fansipan Peak with Muong Hoa Train & Cable Car , Sleeper Bus Transfer from Sapa - Hanoi',
        description: [
          'Transfer: Sleeper Bus Sapa - Hanoi',
          'Accommodation: Babylon Grand Hotel',
          'Sightseeing: Fansipan Peak with Muong Hoa Train & Cable Car',
          'Sightseeing: Enjoy Nightlife in Hanoi'
        ]
      },
      {
        day: 5,
        title: 'Hanoi to Danang , Hoi An ancient town Exploration',
        description: [
          'Transfer: Early Morning Private Transnfer To Noi Bai International Airport & flight to Danang',
          'Accommodation: Vinh Hung Old Town Hotel / Merry Hotel',
          'Sightseeing: Hoi An Ancient Town Exploration',
          'Sightseeing: Coconnut Bakset Ride',
          'Sightseeing: Bicycle Tour in Hoi An Village',
          'Sightseeing: Lattern Boat Ride Experience'
        ]
      },
      {
        day: 6,
        title: 'Visit Bana Hill Cable Car, Golden Bridge, Fantasy Park & French Village & Visit Dragon Bridge.',
        description: [
          'Accommodation: Merry Hotel',
          'Sightseeing: Bana Hills',
          'Sightseeing: Golden Hands Bridge',
          'Sightseeing: Fantasy Park',
          'Sightseeing: French Village',
          'Sightseeing: Evening at Beach'
        ]
      },
      {
        day: 7,
        title: 'Early Morning Flight Danang to Ho Chi Minh , Cu Chi Tunnel',
        description: [
          'Transfer: Early Morning Private Transnfer To International Airport & flight to Ho Chi Minh',
          'Accommodation: Liberty Green Hotel',
          'Sightseeing: Cu Chi Tunnel with Ak 47 Shooting',
          'Sightseeing: Visit Most Iconic Apartment Cafe',
          'Sightseeing: Bui Vein Walking Street'
        ]
      },
      {
        day: 8,
        title: 'Your amazing adventure comes to an end with unforgettable memories to take Home',
        description: [
          'Transfer: Airport Transfer fixed timing as per Group Departure.'
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
      'Compulsory tipping for guide & driver: 3usd/pax/day',
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
        ranges: ['2nd - 9th October']
      },
      {
        month: 'November',
        ranges: ['14th - 21st November']
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
    summaryDetails: {
      accommodation: [
        { city: 'Hanoi', hotel: 'Hotel / Similar' },
        { city: 'Da Nang', hotel: 'Hotel / Similar' },
        { city: 'Phu Quoc', hotel: 'Hotel / Similar' }
      ],
      meals: [
        '8 Breakfast & 1 Cruise Lunch'
      ],
      transfers: [
        'Airport Pick-up & Drop-off in Private AC Vehicle',
        'Hanoi - Ha Long Bay Return Cruise Transfers',
        'Hanoi to Da Nang & Da Nang to Phu Quoc Domestic Flight Transfers'
      ],
      activities: [
        {
          city: 'Hanoi & Ha Long Bay',
          items: [
            'Hanoi Guided City Tour & Tran Quoc Pagoda',
            'Famous Train Street & Beer Street Experience',
            'Ha Long Bay Luxury Day Cruise with Kayaking & Sunset Party'
          ]
        },
        {
          city: 'Da Nang & Hoi An',
          items: [
            'Marble Mountains & Huyen Khong Cave',
            'Coconut Village Basket Boat Ride in Cam Thanh',
            'Hoi An Ancient Town Walking Tour & Lantern Boat Ride',
            'Ba Na Hills Cable Car, Golden Bridge & Fantasy Park'
          ]
        },
        {
          city: 'Phu Quoc',
          items: [
            '4 Islands Speedboat Tour with Coral Reef Snorkeling',
            'Aquatopia Water Park & Hon Thom Cable Car Ride',
            'Grand World & VinWonders / Vinpearl Safari (Optional)'
          ]
        }
      ]
    },
    itinerary: [
      {
        day: 1,
        title: 'Hanoi Arrival, Half-Day City Tour, Train Street & Beer Street',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to Hanoi Hotel by Private Vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda & West Lake',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Famous Train Street & Cafe Experience',
          'Sightseeing: Old Quarter Market & Beer Street'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Sunset Party',
        description: [
          'Transfer: Hanoi to Tuan Chau Marina (Ha Long Bay) & return transfers',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Kayaking through Hidden Lagoons & Caves',
          'Sightseeing: Sunset Party on Cruise with Music & Drinks'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Da Nang Flight, Hotel Check-in & Leisure Exploration',
        description: [
          'Transfer: Transfer to Hanoi Airport, domestic flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Local Da Nang Night Markets'
        ]
      },
      {
        day: 4,
        title: 'Marble Mountains, Coconut Basket Boat & Hoi An Ancient Town with Lantern Boat Ride',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Huyen Khong Cave Temple',
          'Sightseeing: Non Nuoc Stone Carving Village',
          'Sightseeing: Iconic Coconut Basket Boat Ride in Cam Thanh Village',
          'Sightseeing: Hoi An Ancient Town Exploration & Japanese Covered Bridge',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ride',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village & European Architecture',
          'Sightseeing: Fantasy Park Rides & Entertainment Zone',
          'Sightseeing: Linh Ung Pagoda & Flower Gardens'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Phu Quoc Flight, Leisure & Optional Grand World Exploration',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Phu Quoc Island',
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: Leisure Time at Long Beach',
          'Sightseeing: Visit Grand World Phu Quoc & Venice Canals (Optional)',
          'Sightseeing: Duong Dong Night Market Seafood & Shopping'
        ]
      },
      {
        day: 7,
        title: 'Phu Quoc 4 Islands Speedboat Tour, Snorkeling, Aquatopia Water Park & Cable Car',
        description: [
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: 4 Islands Speedboat Tour (Gam Ghi, Xuong & May Rut Islands)',
          'Sightseeing: Snorkeling among Coral Reefs & Marine Life',
          'Sightseeing: Aquatopia Water Park Thrill Rides on Thom Island',
          'Sightseeing: World\'s Longest Sea-Crossing Hon Thom Cable Car Ride'
        ]
      },
      {
        day: 8,
        title: 'Phu Quoc Day at Leisure - Optional VinWonders & Vinpearl Safari Park',
        description: [
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: Day at Leisure to Relax at Tropical Beaches & Resort',
          'Sightseeing: VinWonders Theme Park Thrill Rides (Optional)',
          'Sightseeing: Vinpearl Safari Open Wildlife Conservation Tour (Optional)',
          'Sightseeing: Sunset Views & Cafe Hopping in Sunset Town'
        ]
      },
      {
        day: 9,
        title: 'Departure from Phu Quoc - Tour Concludes with Unforgettable Memories',
        description: [
          'Transfer: Transfer to Phu Quoc International Airport as per group departure flight timing'
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
        title: 'Arrival in Hanoi, Transfer to Sapa & Evening at Leisure',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to Sapa by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Scenic Drive through Northern Highlands',
          'Sightseeing: Evening at Leisure in Sapa Town & Central Square'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing - Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Sun World Fansipan Legend Cable Car to Indochina Peak',
          'Sightseeing: Rong May Glass Bridge Mountain Valley Views',
          'Sightseeing: Cat Cat Traditional Hmong Cultural Village Trail'
        ]
      },
      {
        day: 3,
        title: 'Sapa to Hanoi Transfer & Half-Day Guided City Tour',
        description: [
          'Transfer: Transfer from Sapa to Hanoi by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ho Chi Minh Complex, Mausoleum & One Pillar Pagoda',
          'Sightseeing: Historic Temple of Literature',
          'Sightseeing: Hoan Kiem Lake, Ngoc Son Temple & Old Quarter Walking Tour'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Buffet Lunch',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Luxury Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Hidden Caves',
          'Sightseeing: Onboard Vietnamese Buffet Lunch with Bay Views'
        ]
      },
      {
        day: 5,
        title: 'Hanoi to Da Nang Flight & Evening at Leisure',
        description: [
          'Transfer: Transfer to Noi Bai Airport, flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Han River Promenade'
        ]
      },
      {
        day: 6,
        title: 'Marble Mountain, Coconut Forest & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Cave Temples',
          'Sightseeing: Cam Thanh Coconut Village Basket Boat Ride',
          'Sightseeing: Hoi An Ancient Town Walking Tour',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Indoor Rides & Entertainment'
        ]
      },
      {
        day: 8,
        title: 'Da Nang to Ho Chi Minh City Flight & Evening Exploration',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City',
          'Accommodation: Hotel in Ho Chi Minh City',
          'Sightseeing: Nguyen Hue Walking Street & Saigon Skyline',
          'Sightseeing: Exterior of Saigon Central Post Office & Notre-Dame Cathedral'
        ]
      },
      {
        day: 9,
        title: 'Cu Chi Tunnels Tour & Departure with Unforgettable Memories',
        description: [
          'Transfer: Transfer to Tan Son Nhat Airport for onward flight',
          'Sightseeing: Historic Cu Chi Tunnels Underground Network Tour'
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
        title: 'Arrival in Hanoi, Transfer to Sapa & Evening at Leisure',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to Sapa by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Scenic Drive through Northern Highlands',
          'Sightseeing: Evening at Leisure in Sapa Town & Central Square'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing - Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Sun World Fansipan Legend Cable Car to Highest Peak',
          'Sightseeing: Rong May Glass Bridge Mountain Valley Views',
          'Sightseeing: Cat Cat Traditional Hmong Cultural Village Trail'
        ]
      },
      {
        day: 3,
        title: 'Sapa to Hanoi Transfer & Half-Day Guided City Tour',
        description: [
          'Transfer: Transfer from Sapa to Hanoi by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ho Chi Minh Complex, Mausoleum & One Pillar Pagoda',
          'Sightseeing: Historic Temple of Literature',
          'Sightseeing: Hoan Kiem Lake, Ngoc Son Temple & Old Quarter Walking Tour'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Sunset Party',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Hidden Caves',
          'Sightseeing: Sunset Party on Luxury Cruise with Music & Drinks'
        ]
      },
      {
        day: 5,
        title: 'Hanoi to Da Nang Flight & Evening at Leisure',
        description: [
          'Transfer: Transfer to Noi Bai Airport, flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Han River Promenade'
        ]
      },
      {
        day: 6,
        title: 'Marble Mountain, Coconut Forest & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Cave Temples',
          'Sightseeing: Cam Thanh Coconut Village Basket Boat Ride',
          'Sightseeing: Hoi An Ancient Town Walking Tour',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Indoor Rides & Entertainment'
        ]
      },
      {
        day: 8,
        title: 'Departure from Da Nang - Tour Concludes with Happy Memories',
        description: [
          'Transfer: Transfer to Da Nang International Airport for onward flight'
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
        title: 'Arrival in Hanoi, Transfer to Sapa & Evening at Leisure',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to Sapa by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Scenic Mountain Drive through Northern Highlands',
          'Sightseeing: Evening at Leisure in Sapa Town & Central Square'
        ]
      },
      {
        day: 2,
        title: 'Sapa Sightseeing - Fansipan Peak, Glass Bridge & Cat Cat Village',
        description: [
          'Accommodation: Hotel in Sapa',
          'Sightseeing: Sun World Fansipan Legend Cable Car to Highest Peak',
          'Sightseeing: Rong May Glass Bridge Valley Views',
          'Sightseeing: Cat Cat Traditional Hmong Cultural Village Trail'
        ]
      },
      {
        day: 3,
        title: 'Sapa to Hanoi Transfer & Half-Day Guided City Tour',
        description: [
          'Transfer: Transfer from Sapa to Hanoi by Sleeper / Limousine Bus',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ho Chi Minh Complex, Mausoleum & One Pillar Pagoda',
          'Sightseeing: Historic Temple of Literature',
          'Sightseeing: Hoan Kiem Lake, Ngoc Son Temple & Old Quarter Walking Tour'
        ]
      },
      {
        day: 4,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Buffet Lunch',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Hidden Caves',
          'Sightseeing: Onboard Vietnamese Buffet Lunch with Bay Views'
        ]
      },
      {
        day: 5,
        title: 'Hanoi to Da Nang Flight & Evening at Leisure',
        description: [
          'Transfer: Transfer to Noi Bai Airport, flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Han River Promenade'
        ]
      },
      {
        day: 6,
        title: 'Marble Mountain, Coconut Forest & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Cave Temples',
          'Sightseeing: Cam Thanh Coconut Village Basket Boat Ride',
          'Sightseeing: Hoi An Ancient Town Walking Tour',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 7,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Indoor Rides & Entertainment'
        ]
      },
      {
        day: 8,
        title: 'Da Nang to Phu Quoc Flight & Island Leisure',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Phu Quoc Island',
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: Relax along Golden Sands of Long Beach',
          'Sightseeing: Explore Phu Quoc Night Market & Beachfront Cafes'
        ]
      },
      {
        day: 9,
        title: 'Phu Quoc 4 Islands Speedboat Tour, Snorkeling, Aquatopia Water Park & Cable Car',
        description: [
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: Speedboat Tour to Gam Ghi, Xuong & May Rut Islands',
          'Sightseeing: Snorkeling among Coral Reefs & Marine Life',
          'Sightseeing: Aquatopia Water Park Thrill Rides on Thom Island',
          'Sightseeing: World\'s Longest Sea-Crossing Hon Thom Cable Car Ride'
        ]
      },
      {
        day: 10,
        title: 'Phu Quoc Day at Leisure - Optional VinWonders & Vinpearl Safari Park',
        description: [
          'Accommodation: Hotel in Phu Quoc',
          'Sightseeing: Day at Leisure to Relax at Tropical Beaches & Resort',
          'Sightseeing: VinWonders Theme Park Thrill Rides (Optional)',
          'Sightseeing: Vinpearl Safari Open Wildlife Conservation Tour (Optional)',
          'Sightseeing: Sunset Views & Cafe Hopping in Sunset Town'
        ]
      },
      {
        day: 11,
        title: 'Departure from Phu Quoc - Tour Concludes with Happy Memories',
        description: [
          'Transfer: Transfer to Phu Quoc International Airport for onward flight'
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
        title: 'Hanoi Arrival, Half-Day City Tour, Train Street & Beer Street',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to hostel/hotel in Hanoi',
          'Accommodation: Stay in Hanoi',
          'Sightseeing: Tran Quoc Pagoda & West Lake',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Iconic Train Street & Cafe Experience',
          'Sightseeing: Old Quarter Market & Beer Street'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Sunset Party',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Stay in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Luxury Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Caves',
          'Sightseeing: Sunset Party on Cruise with Music & Drinks'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Da Nang Flight, Check-in & Leisure Exploration',
        description: [
          'Transfer: Transfer to Hanoi Airport, domestic flight to Da Nang & transfer to stay',
          'Accommodation: Stay in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Local Night Markets'
        ]
      },
      {
        day: 4,
        title: 'Marble Mountains, Coconut Basket Boat & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Stay in Da Nang',
          'Sightseeing: Marble Mountains & Huyen Khong Cave Temple',
          'Sightseeing: Non Nuoc Stone Carving Village',
          'Sightseeing: Iconic Coconut Basket Boat Ride in Cam Thanh',
          'Sightseeing: Hoi An Ancient Town Exploration & Japanese Bridge',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Stay in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Rides & Entertainment Zone',
          'Sightseeing: Linh Ung Pagoda & Flower Gardens'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon (Ho Chi Minh) Flight & Leisure Exploration',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Stay in Saigon',
          'Sightseeing: Nguyen Hue Walking Street & Local Food Trail',
          'Sightseeing: Evening at Leisure to Explore City Landmarks'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Tour & Departure with Happy Memories',
        description: [
          'Transfer: Transfer to Tan Son Nhat Airport for onward journey',
          'Sightseeing: Historic Cu Chi Tunnels Underground Network Exploration'
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
        title: 'Hanoi Arrival, Half-Day City Tour, Train Street & Beer Street',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to hotel in Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda & West Lake',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Iconic Train Street & Cafe Experience',
          'Sightseeing: Old Quarter Market & Beer Street'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Sunset Party',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Luxury Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Caves',
          'Sightseeing: Sunset Party on Cruise with Music & Drinks'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Da Nang Flight, Check-in & Leisure Exploration',
        description: [
          'Transfer: Transfer to Hanoi Airport, domestic flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Local Night Markets'
        ]
      },
      {
        day: 4,
        title: 'Marble Mountains, Coconut Basket Boat & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Huyen Khong Cave Temple',
          'Sightseeing: Non Nuoc Stone Carving Village',
          'Sightseeing: Iconic Coconut Basket Boat Ride in Cam Thanh',
          'Sightseeing: Hoi An Ancient Town Exploration & Japanese Bridge',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Rides & Entertainment Zone',
          'Sightseeing: Linh Ung Pagoda & Flower Gardens'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon (Ho Chi Minh) Flight & Leisure Exploration',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Nguyen Hue Walking Street & Local Food Trail',
          'Sightseeing: Evening at Leisure to Explore City Landmarks'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Tour & Departure with Happy Memories',
        description: [
          'Transfer: Transfer to Tan Son Nhat Airport for onward journey',
          'Sightseeing: Historic Cu Chi Tunnels Underground Network Exploration'
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
        title: 'Hanoi Arrival, Half-Day City Tour, Train Street & Beer Street',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to hotel in Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda & West Lake',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Famous Train Street & Cafe Experience',
          'Sightseeing: Old Quarter Market & Beer Street'
        ]
      },
      {
        day: 2,
        title: 'Ha Long Bay Luxury Day Cruise, Kayaking & Sunset Party',
        description: [
          'Transfer: Hanoi to Ha Long Bay return transfers in AC vehicle',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ha Long Bay UNESCO World Heritage Luxury Cruising',
          'Sightseeing: Kayaking through Limestone Lagoons & Caves',
          'Sightseeing: Sunset Party on Cruise with Music & Drinks'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Da Nang Flight, Hotel Check-in & Leisure Exploration',
        description: [
          'Transfer: Transfer to Hanoi Airport, domestic flight to Da Nang & hotel transfer',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Relax at My Khe Beach',
          'Sightseeing: Visit Dragon Bridge & Local Da Nang Night Markets'
        ]
      },
      {
        day: 4,
        title: 'Marble Mountains, Coconut Basket Boat & Hoi An Ancient Town with Lantern Boat',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Marble Mountains & Huyen Khong Cave Temple',
          'Sightseeing: Non Nuoc Stone Carving Village',
          'Sightseeing: Iconic Coconut Basket Boat Ride in Cam Thanh',
          'Sightseeing: Hoi An Ancient Town Exploration & Japanese Bridge',
          'Sightseeing: Evening Lantern Boat Ride on Hoai River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills Scenic Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge',
          'Sightseeing: French Village Architecture & Square',
          'Sightseeing: Fantasy Park Rides & Entertainment Zone',
          'Sightseeing: Linh Ung Pagoda & Flower Gardens'
        ]
      },
      {
        day: 6,
        title: 'Departure from Da Nang - Tour Concludes with Happy Memories',
        description: [
          'Transfer: Transfer to Da Nang International Airport for onward journey'
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
        title: 'Hanoi Arrival, Half-Day City Tour, Train Street & Beer Street',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to hotel in Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda & West Lake',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Famous Train Street & Cafe Experience',
          'Sightseeing: Old Quarter Market & Beer Street'
        ]
      },
      {
        day: 2,
        title: 'Ninh Binh Day Tour - Hoa Lu Ancient Capital, Tam Coc Caves & Bich Dong',
        description: [
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple Exploration'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Halong Bay - Luxury Overnight Cruise Experience',
        description: [
          'Transfer: Scenic transfer from Hanoi to Tuan Chau Marina (Halong Bay)',
          'Accommodation: Luxury Overnight Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Karst Cruising',
          'Sightseeing: Grottoes Exploration, Kayaking & Sunset Viewing',
          'Sightseeing: Onboard Cooking Demonstration & Evening Entertainment'
        ]
      },
      {
        day: 4,
        title: 'Halong Bay Sunrise Cruise, Disembark & Flight to Saigon (Ho Chi Minh)',
        description: [
          'Transfer: Return transfer to Hanoi & domestic flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Morning Sunrise over Halong Bay Islets & Caves Tour',
          'Sightseeing: Evening Exploration & Ben Thanh Market Shopping'
        ]
      },
      {
        day: 5,
        title: 'Full-Day Mekong Delta Tour, Canal Boat Ride & Vinh Trang Pagoda',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Scenic Mekong Delta River Boat Ride to My Tho',
          'Sightseeing: Coconut Candy & Rice Paper Workshop Tour',
          'Sightseeing: Traditional Southern Folk Music & Tropical Fruits',
          'Sightseeing: Vinh Trang Pagoda Architectural Visit'
        ]
      },
      {
        day: 6,
        title: 'Departure from Saigon - Tour Concludes with Romantic Memories',
        description: [
          'Transfer: Transfer to Tan Son Nhat Airport for onward journey'
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
        title: 'Hanoi Arrival, Ba Dinh Square, Temple of Literature & 1-Hour Cyclo Tour',
        description: [
          'Transfer: Pick up at Noi Bai International Airport & transfer to hotel in Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ba Dinh Square, Ho Chi Minh Complex & One Pillar Pagoda',
          'Sightseeing: Historic Temple of Literature',
          'Sightseeing: 1-Hour Traditional Cyclo Tour of Hanoi Old Quarter & Hoan Kiem Lake'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay - Luxury Overnight Cruise Experience',
        description: [
          'Transfer: Transfer from Hanoi to Halong Bay in AC vehicle',
          'Accommodation: Luxury Overnight Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Cruising',
          'Sightseeing: Limestone Grottoes Exploration, Kayaking & Swimming',
          'Sightseeing: Sunset Party, Cooking Demonstration & Dinner on Cruise'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Sunrise Cruise, Brunch & Return to Hanoi',
        description: [
          'Transfer: Disembark from cruise & return transfer to Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Sunrise Viewing over Emerald Bay & Caves Excursion',
          'Sightseeing: Onboard Gourmet Brunch',
          'Sightseeing: Evening at Leisure in Hanoi'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Hoi An Ancient Town Walking Tour',
        description: [
          'Transfer: Transfer to Hanoi Airport, domestic flight to Da Nang & hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An Ancient Town UNESCO Heritage Walk',
          'Sightseeing: Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Thu Bon River Promenade & Lantern Market'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, Cable Car, Golden Hands Bridge & Fantasy Park',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Views',
          'Sightseeing: French Village Architecture & Debay Wine Cellar',
          'Sightseeing: Fantasy Park Rides & Entertainment'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon Flight & Historic City Sights Tour',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon',
          'Sightseeing: War Remnants Museum & Reunification Palace',
          'Sightseeing: Notre-Dame Cathedral & Saigon Central Post Office',
          'Sightseeing: Ben Thanh Market Shopping & Food Trail'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Underground Network Tour & Leisure Afternoon',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Military Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure in Saigon Downtown'
        ]
      },
      {
        day: 8,
        title: 'Departure from Saigon - Tour Concludes with Sweet Memories',
        description: [
          'Transfer: Transfer to Tan Son Nhat Airport for return flight'
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
        title: 'Arrival in Hanoi & City Sightseeing Tour',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi downtown hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ba Dinh Square & Ho Chi Minh Complex (Mausoleum exterior, Stilt House, One-Pillar Pagoda)',
          'Sightseeing: Temple of Literature (First University of Vietnam)',
          'Sightseeing: 1-Hour Cyclo Tour through Hanoi Old Quarter & Hoan Kiem Lake'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay Transfer & Luxury Cruise with Kayaking',
        description: [
          'Transfer: Drive through Red River Delta to Halong Bay pier',
          'Accommodation: Overnight Luxury Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Limestone Cave Exploration, Kayaking & Swimming',
          'Sightseeing: Sunset Deck Cooking Demonstration & Squid Fishing'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Sunrise Cruise & Transfer back to Hanoi',
        description: [
          'Transfer: Cruise disembarkation & transfer back to Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Early Morning Sunrise & Tai Chi on the Bay',
          'Sightseeing: Scenic Island Cruising past Sail Island & Turtle Islet',
          'Sightseeing: Leisure Evening exploring Hanoi Nightlife & Cafes'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Hoi An Ancient Town Walking Tour',
        description: [
          'Transfer: Airport transfer & domestic flight from Hanoi to Da Nang',
          'Accommodation: Beachside Hotel in Da Nang',
          'Sightseeing: Hoi An Ancient Town Guided Heritage Walk',
          'Sightseeing: Japanese Covered Bridge, Chinese Assembly Halls & Ancient Houses',
          'Sightseeing: Lantern Shopping & Street Food Walk along Thu Bon River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Le Jardin D’Amour Flower Gardens, Debay Wine Cellar & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon Flight & Historic Landmarks Tour',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: War Remnants Museum & Reunification Palace',
          'Sightseeing: Notre-Dame Cathedral & Saigon Central Post Office',
          'Sightseeing: Ben Thanh Market Shopping & Food Trail'
        ]
      },
      {
        day: 7,
        title: 'Mekong Delta Boat Excursion, Canals & Vinh Trang Pagoda',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Scenic Boat Cruise along Mekong River & Floating Villages',
          'Sightseeing: Tropical Fruit Tasting & Southern Vietnamese Folk Music',
          'Sightseeing: Hand-rowed Sampan Ride through Shaded Coconut Canals',
          'Sightseeing: Coconut Candy Workshop & Honeybee Farm',
          'Sightseeing: Historic Vinh Trang Pagoda Architectural Tour'
        ]
      },
      {
        day: 8,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 9,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Full-Day Ninh Binh Tour - Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Transfer: Scenic countryside drive to Ninh Binh (approx. 90 km)',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Dynasties Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple & Mountain Views'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay UNESCO Day Cruise & Evening at Leisure in Hanoi',
        description: [
          'Transfer: Round-trip highway transfer between Hanoi and Halong Bay pier',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Halong Bay UNESCO Day Cruise & Seafood Lunch Onboard',
          'Sightseeing: Karst Grottoes Exploration past Sail Island & Turtle Islet',
          'Sightseeing: Floating Fishing Village Views & Evening at Leisure'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Coastal Town Leisure',
        description: [
          'Transfer: Airport transfer & flight to Da Nang; hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: My Khe Beach Stroll & Da Nang City Exploration',
          'Sightseeing: Dragon Bridge & Evening Riverside Atmosphere'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Debay Wine Cellar, Le Jardin D’Amour Gardens & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Heritage Tour & Lantern Markets',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An UNESCO Ancient Town Guided Walk',
          'Sightseeing: 17th-Century Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Traditional Old Town Clubhouses & Folk Music',
          'Sightseeing: Lantern Shopping & Street Food along Thu Bon River'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Saigon Flight & Dynamic City Leisure',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: Ben Thanh Market Shopping & Food Exploration',
          'Sightseeing: Dynamic Saigon Nightlife & Nguyen Hue Walking Street'
        ]
      },
      {
        day: 8,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Full-Day Ninh Binh Tour - Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Transfer: Countryside transfer to Ninh Binh (approx. 90 km)',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Dynasties Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple & Mountain Views'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay UNESCO Day Cruise & Evening at Leisure in Hanoi',
        description: [
          'Transfer: Round-trip highway transfer between Hanoi and Halong Bay pier',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Halong Bay UNESCO Day Cruise & Seafood Lunch Onboard',
          'Sightseeing: Karst Grottoes Exploration past Sail Island & Turtle Islet',
          'Sightseeing: Floating Fishing Village Views & Evening at Leisure'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Coastal Town Leisure',
        description: [
          'Transfer: Airport transfer & flight to Da Nang; hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: My Khe Beach Stroll & Da Nang City Exploration',
          'Sightseeing: Dragon Bridge & Evening Riverside Atmosphere'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Debay Wine Cellar, Le Jardin D’Amour Gardens & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Heritage Tour & Lantern Markets',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An UNESCO Ancient Town Guided Walk',
          'Sightseeing: 17th-Century Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Traditional Old Town Clubhouses & Folk Music',
          'Sightseeing: Lantern Shopping & Street Food along Thu Bon River'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Saigon Flight & Dynamic City Leisure',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: Ben Thanh Market Shopping & Food Exploration',
          'Sightseeing: Dynamic Saigon Nightlife & Nguyen Hue Walking Street'
        ]
      },
      {
        day: 8,
        title: 'Full-Day Mekong Delta Boat Tour & Canals',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Scenic Boat Cruise along Mekong River to My Tho',
          'Sightseeing: Tropical Fruit Tasting & Southern Vietnamese Folk Music',
          'Sightseeing: Hand-rowed Sampan Ride through Shaded Coconut Canals',
          'Sightseeing: Coconut Candy Workshop & Honeybee Farm',
          'Sightseeing: Historic Vinh Trang Pagoda Architectural Tour'
        ]
      },
      {
        day: 9,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & City Sightseeing Tour',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi downtown hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Ba Dinh Square & Ho Chi Minh Complex (Mausoleum exterior, Stilt House, One-Pillar Pagoda)',
          'Sightseeing: Temple of Literature (First University of Vietnam)',
          'Sightseeing: 1-Hour Cyclo Tour through Hanoi Old Quarter & Hoan Kiem Lake'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay Transfer & Luxury Cruise with Kayaking',
        description: [
          'Transfer: Countryside drive to Halong Bay pier',
          'Accommodation: Overnight Luxury Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Limestone Cave Exploration, Kayaking & Swimming',
          'Sightseeing: Sunset Deck Cooking Demonstration & Squid Fishing'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Sunrise Cruise & Transfer back to Hanoi',
        description: [
          'Transfer: Cruise disembarkation & transfer back to Hanoi',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Early Morning Sunrise & Tai Chi on the Bay',
          'Sightseeing: Scenic Island Cruising past Sail Island & Turtle Islet',
          'Sightseeing: Leisure Evening exploring Hanoi Nightlife & Cafes'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Saigon Flight & Historic Landmarks Tour',
        description: [
          'Transfer: Transfer to airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: War Remnants Museum & Reunification Palace',
          'Sightseeing: Notre-Dame Cathedral & Saigon Central Post Office',
          'Sightseeing: Ben Thanh Market Shopping & Street Food'
        ]
      },
      {
        day: 5,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 6,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Full-Day Ninh Binh Tour - Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Transfer: Countryside transfer to Ninh Binh (approx. 90 km)',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Dynasties Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple & Mountain Views'
        ]
      },
      {
        day: 3,
        title: 'Hanoi to Halong Bay Transfer & Overnight Cruise Experience',
        description: [
          'Transfer: Drive through Red River Delta to Halong Bay pier',
          'Accommodation: Overnight Luxury Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Grottoes Exploration, Kayaking & Swimming',
          'Sightseeing: Sunset Deck Cooking Demonstration & Dinner'
        ]
      },
      {
        day: 4,
        title: 'Halong Bay Sunrise Cruise & Flight to Saigon',
        description: [
          'Transfer: Cruise disembarkation, drive to Hanoi Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: Sunrise View & Morning Cruise past Sail Island & Turtle Islet',
          'Sightseeing: Ben Thanh Market & Evening Leisure in Dynamic Saigon'
        ]
      },
      {
        day: 5,
        title: 'Full-Day Mekong Delta Boat Tour & Canals',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Scenic Boat Cruise along Mekong River to My Tho',
          'Sightseeing: Tropical Fruit Tasting & Southern Vietnamese Folk Music',
          'Sightseeing: Hand-rowed Sampan Ride through Shaded Coconut Canals',
          'Sightseeing: Coconut Candy Workshop & Honeybee Farm',
          'Sightseeing: Historic Vinh Trang Pagoda Architectural Tour'
        ]
      },
      {
        day: 6,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 7,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Hanoi to Halong Bay Transfer & Luxury Overnight Cruise',
        description: [
          'Transfer: Drive through Red River Delta to Halong Bay pier',
          'Accommodation: Overnight Luxury Cruise in Halong Bay',
          'Sightseeing: Halong Bay UNESCO World Heritage Island Cruising',
          'Sightseeing: Grottoes Exploration, Kayaking & Swimming',
          'Sightseeing: Sunset Deck Cooking Demonstration & Dinner'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay Sunrise Cruise & Transfer back to Hanoi',
        description: [
          'Transfer: Cruise disembarkation & transfer back to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Early Morning Sunrise & Tai Chi on the Bay',
          'Sightseeing: Scenic Cruising past Sail Island & Turtle Islet',
          'Sightseeing: Leisure Evening exploring Hanoi Nightlife'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Hoi An Ancient Town Heritage Tour',
        description: [
          'Transfer: Airport transfer & flight to Da Nang; beachside hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An UNESCO Ancient Town Guided Walk',
          'Sightseeing: Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Lantern Shopping & Food Stalls along Thu Bon River'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Debay Wine Cellar, Le Jardin D’Amour Gardens & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Da Nang to Saigon Flight & Historic Landmarks Tour',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: War Remnants Museum & Reunification Palace',
          'Sightseeing: Notre-Dame Cathedral & Saigon Central Post Office',
          'Sightseeing: Ben Thanh Market Shopping & Food Exploration'
        ]
      },
      {
        day: 7,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 8,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Full-Day Ninh Binh Tour - Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Transfer: Countryside transfer to Ninh Binh (approx. 90 km)',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Dynasties Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple & Mountain Views'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay UNESCO Day Cruise & Evening at Leisure in Hanoi',
        description: [
          'Transfer: Round-trip highway transfer between Hanoi and Halong Bay pier',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Halong Bay UNESCO Day Cruise & Seafood Lunch Onboard',
          'Sightseeing: Karst Grottoes Exploration past Sail Island & Turtle Islet',
          'Sightseeing: Floating Fishing Village Views & Evening at Leisure'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Coastal Town Leisure',
        description: [
          'Transfer: Airport transfer & flight to Da Nang; hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: My Khe Beach Stroll & Da Nang City Exploration',
          'Sightseeing: Dragon Bridge & Evening Riverside Atmosphere'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Debay Wine Cellar, Le Jardin D’Amour Gardens & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Heritage Tour & Lantern Markets',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An UNESCO Ancient Town Guided Walk',
          'Sightseeing: 17th-Century Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Traditional Old Town Clubhouses & Folk Music',
          'Sightseeing: Lantern Shopping & Street Food along Thu Bon River'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Saigon Flight & Dynamic City Leisure',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: Ben Thanh Market Shopping & Food Exploration',
          'Sightseeing: Dynamic Saigon Nightlife & Nguyen Hue Walking Street'
        ]
      },
      {
        day: 8,
        title: 'Full-Day Mekong Delta Boat Tour & Canals',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Scenic Boat Cruise along Mekong River to My Tho',
          'Sightseeing: Tropical Fruit Tasting & Southern Vietnamese Folk Music',
          'Sightseeing: Hand-rowed Sampan Ride through Shaded Coconut Canals',
          'Sightseeing: Coconut Candy Workshop & Honeybee Farm',
          'Sightseeing: Historic Vinh Trang Pagoda Architectural Tour'
        ]
      },
      {
        day: 9,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 10,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Hanoi & Half-Day City Tour with Train Street',
        description: [
          'Transfer: Airport pickup & transfer to Hanoi hotel',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tran Quoc Pagoda on West Lake',
          'Sightseeing: Famous Hanoi Train Street Cafe Experience',
          'Sightseeing: Ho Chi Minh Mausoleum & One Pillar Pagoda',
          'Sightseeing: Old Quarter Market & Beer Street Night Walk'
        ]
      },
      {
        day: 2,
        title: 'Full-Day Ninh Binh Tour - Hoa Lu Ancient Capital & Tam Coc Caves',
        description: [
          'Transfer: Countryside transfer to Ninh Binh (approx. 90 km)',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Tam Coc Caves Sampan Boat Ride (Halong Bay on Land)',
          'Sightseeing: Hoa Lu Ancient Capital, Dinh & Le Dynasties Temples',
          'Sightseeing: Bich Dong Pagoda Cave Temple & Mountain Views'
        ]
      },
      {
        day: 3,
        title: 'Halong Bay UNESCO Day Cruise & Evening at Leisure in Hanoi',
        description: [
          'Transfer: Round-trip highway transfer between Hanoi and Halong Bay pier',
          'Accommodation: Hotel in Hanoi',
          'Sightseeing: Halong Bay UNESCO Day Cruise & Seafood Lunch Onboard',
          'Sightseeing: Karst Grottoes Exploration past Sail Island & Turtle Islet',
          'Sightseeing: Floating Fishing Village Views & Evening at Leisure'
        ]
      },
      {
        day: 4,
        title: 'Hanoi to Da Nang Flight & Coastal Town Leisure',
        description: [
          'Transfer: Airport transfer & flight to Da Nang; hotel check-in',
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: My Khe Beach Stroll & Da Nang City Exploration',
          'Sightseeing: Dragon Bridge & Evening Riverside Atmosphere'
        ]
      },
      {
        day: 5,
        title: 'Ba Na Hills Tour, World-Record Cable Car & Golden Bridge',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Ba Na Hills World-Record Cable Car Ascent',
          'Sightseeing: Iconic Golden Hands Bridge Panoramic Walk',
          'Sightseeing: Debay Wine Cellar, Le Jardin D’Amour Gardens & Linh Ung Pagoda',
          'Sightseeing: Fantasy Park Rides & French Village Summit Views'
        ]
      },
      {
        day: 6,
        title: 'Hoi An Ancient Town Heritage Tour & Lantern Markets',
        description: [
          'Accommodation: Hotel in Da Nang',
          'Sightseeing: Hoi An UNESCO Ancient Town Guided Walk',
          'Sightseeing: 17th-Century Japanese Covered Bridge & Chinese Assembly Halls',
          'Sightseeing: Traditional Old Town Clubhouses & Folk Music',
          'Sightseeing: Lantern Shopping & Street Food along Thu Bon River'
        ]
      },
      {
        day: 7,
        title: 'Da Nang to Saigon Flight & Dynamic City Leisure',
        description: [
          'Transfer: Transfer to Da Nang Airport & flight to Ho Chi Minh City (Saigon)',
          'Accommodation: Hotel in Saigon (Ho Chi Minh City)',
          'Sightseeing: Ben Thanh Market Shopping & Food Exploration',
          'Sightseeing: Dynamic Saigon Nightlife & Nguyen Hue Walking Street'
        ]
      },
      {
        day: 8,
        title: 'Cu Chi Tunnels Underground Network Tour & Afternoon Leisure',
        description: [
          'Accommodation: Hotel in Saigon',
          'Sightseeing: Historic Cu Chi Tunnels Network Tour & Underground Crawl Experience',
          'Sightseeing: Afternoon at Leisure for Shopping & Cafe Hopping in Saigon'
        ]
      },
      {
        day: 9,
        title: 'Departure from Saigon - Return Flight Home',
        description: [
          'Transfer: Transfer to Tan Son Nhat International Airport for departure flight'
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
        title: 'Arrival in Bali & Transfer to Ubud',
        description: [
          'Transfer: Airport pickup at Ngurah Rai International Airport & scenic drive to Ubud',
          'Accommodation: Hotel in Ubud',
          'Sightseeing: Check-in, relax & evening stroll in Ubud cultural market'
        ]
      },
      {
        day: 2,
        title: 'Iconic Bali Swing & Thrilling ATV Quad Bike Adventure',
        description: [
          'Accommodation: Hotel in Ubud',
          'Sightseeing: Bali Swing Experience over lush jungle & rice terraces',
          'Sightseeing: All-Terrain Vehicle (ATV) Quad Bike Ride through streams & mud trails',
          'Sightseeing: Authentic Indonesian Lunch & Ubud Sunset Views'
        ]
      },
      {
        day: 3,
        title: 'Ubud to Gili Trawangan Speedboat Transfer & Island Nightlife',
        description: [
          'Transfer: Transfer to Bali Pier & fast speedboat to Gili Trawangan',
          'Transfer: Traditional Cidomo (horse cart) transfer to island hotel',
          'Accommodation: Hotel in Gili Trawangan',
          'Sightseeing: Vehicle-free Island Exploration by bicycle or foot',
          'Sightseeing: Rabbit Jump Sunset Party & Gili Night Market Street Food'
        ]
      },
      {
        day: 4,
        title: 'Gili Islands Snorkeling Adventure & Underwater Sculptures',
        description: [
          'Accommodation: Hotel in Gili Trawangan',
          'Sightseeing: 3-Island Snorkeling Cruise around Gili Air, Gili Meno & Gili Trawangan',
          'Sightseeing: Famous Underwater Statues & Sea Turtle Spotting Point',
          'Sightseeing: Sunset Over Ocean & Lively Beachfront Cafes'
        ]
      },
      {
        day: 5,
        title: 'Gili to Nusa Penida Speedboat & Kelingking T-Rex Sunset',
        description: [
          'Transfer: Cidomo to Gili Port & speedboat transfer to Nusa Penida Island',
          'Accommodation: Hotel in Nusa Penida',
          'Sightseeing: Kelingking Beach Iconic T-Rex Cliff Viewpoint',
          'Sightseeing: Sunset Views from high limestone cliffs & Indian Dinner'
        ]
      },
      {
        day: 6,
        title: 'Diamond Beach Sunrise, Mainland Transfer & Uluwatu Kecak Dance',
        description: [
          'Transfer: Speedboat from Nusa Penida to Sanur Port (Mainland Bali) & drive to Kuta',
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Early Morning Sunrise at Diamond Beach & Rumah Pohon Treehouse',
          'Sightseeing: Uluwatu Cliff Temple Sunset Views',
          'Sightseeing: Traditional Balinese Kecak & Fire Dance Performance'
        ]
      },
      {
        day: 7,
        title: 'Day at Leisure in Kuta - Beaches, Cafe Hopping & Spa',
        description: [
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Leisure Morning at Kuta Beach / Seminyak Beach Clubs',
          'Sightseeing: Traditional Balinese Spa & Massage (Optional)',
          'Sightseeing: Souvenir Shopping at Discovery Mall & Street Boutiques'
        ]
      },
      {
        day: 8,
        title: 'Departure from Bali - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Denpasar International Airport'
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
        title: 'Arrival in Bali & Transfer to Kuta Hotel',
        description: [
          'Transfer: Airport pickup at Ngurah Rai International Airport & transfer to Kuta',
          'Accommodation: 4-Star Deluxe Hotel in Kuta',
          'Sightseeing: Check-in, freshen up & leisure evening exploring Kuta beach and markets'
        ]
      },
      {
        day: 2,
        title: 'Tanjung Benoa Watersports & Uluwatu Sunset Temple Tour',
        description: [
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Tanjung Benoa Watersports (Banana Boat Ride, Jet Ski & Parasailing)',
          'Sightseeing: Uluwatu Cliff Temple Scenic Sunset Views',
          'Sightseeing: Evening Cafes & Nightlife in South Bali'
        ]
      },
      {
        day: 3,
        title: 'Tanah Lot Coastal Temple Tour & Leisure Afternoon',
        description: [
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Historic Tanah Lot Sea Temple on Ocean Rock Formation',
          'Sightseeing: Afternoon at Leisure for Beach Stroll, Cafe Hopping & Spa'
        ]
      },
      {
        day: 4,
        title: 'Kuta to Ubud Transfer with Iconic Bali Swing Experience',
        description: [
          'Transfer: Scenic drive from Kuta to Ubud cultural valley',
          'Accommodation: Deluxe Hotel / Resort in Ubud',
          'Sightseeing: World-Famous Bali Swing Experience overlooking jungle and rice terraces',
          'Sightseeing: Ubud Market & Art Galleries Evening Walk'
        ]
      },
      {
        day: 5,
        title: 'Kintamani Mt. Batur Volcano, Tegalalang Rice Terraces & Waterfall',
        description: [
          'Accommodation: Hotel in Ubud',
          'Sightseeing: Kintamani Village & Active Mt. Batur Volcano Panoramic Viewpoint',
          'Sightseeing: UNESCO Tegalalang Step Rice Terraces Walk',
          'Sightseeing: Scenic Cascades at Tegenungan Waterfall'
        ]
      },
      {
        day: 6,
        title: 'Departure from Bali - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Denpasar International Airport for departure flight'
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
        title: 'Arrival in Bali & Transfer to Seminyak with Candlelight Dinner',
        description: [
          'Transfer: Airport pickup at Ngurah Rai International Airport & transfer to Seminyak',
          'Accommodation: Deluxe Hotel / Villa in Seminyak',
          'Sightseeing: Relaxing check-in & romantic candlelight dinner at hotel'
        ]
      },
      {
        day: 2,
        title: 'Iconic Temples Tour - Uluwatu Cliff Temple & Tanah Lot Sunset',
        description: [
          'Accommodation: Hotel in Seminyak',
          'Sightseeing: Uluwatu Cliff Temple with breathtaking Indian Ocean views',
          'Sightseeing: Historic Tanah Lot Sea Temple & Golden Sunset Photography'
        ]
      },
      {
        day: 3,
        title: 'Seminyak to Nusa Penida Speedboat & Kelingking T-Rex Excursion',
        description: [
          'Transfer: Speedboat from Sanur to Nusa Penida Island',
          'Accommodation: Hotel in Nusa Penida',
          'Sightseeing: Crystal Beach & Snorkeling Bay (Optional Watersports)',
          'Sightseeing: Iconic Kelingking T-Rex Cliff Viewpoint & Secret Beach'
        ]
      },
      {
        day: 4,
        title: 'Diamond Beach Sunrise & Transfer to Ubud Valley',
        description: [
          'Transfer: Speedboat from Nusa Penida to Mainland Bali & scenic drive to Ubud',
          'Accommodation: Deluxe Hotel in Ubud',
          'Sightseeing: Early Sunrise at Diamond Beach & Rumah Pohon Treehouse',
          'Sightseeing: Ubud Traditional Art Market & Evening Stroll'
        ]
      },
      {
        day: 5,
        title: 'Ubud Bali Swing & Thrilling ATV Quad Bike Adventure',
        description: [
          'Accommodation: Hotel in Ubud',
          'Sightseeing: World-Famous Bali Swing over tropical jungles and rice fields',
          'Sightseeing: ATV Quad Bike Safari across mud tracks, waterfalls & caves'
        ]
      },
      {
        day: 6,
        title: 'Ubud to Kuta Transfer & Authentic Balinese Couple Spa',
        description: [
          'Transfer: Transfer from Ubud to Kuta coastal town',
          'Accommodation: Deluxe Hotel in Kuta',
          'Sightseeing: Authentic 2-Hour Balinese Rejuvenation Spa & Massage',
          'Sightseeing: Sunset Drinks & Souvenir Shopping in Kuta Downtown'
        ]
      },
      {
        day: 7,
        title: 'Departure from Bali - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Denpasar International Airport for departure flight'
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
        title: 'Arrival in Bali & Transfer to Ubud with Candlelight Dinner',
        description: [
          'Transfer: Airport pickup at Denpasar Airport & transfer to Ubud',
          'Accommodation: Deluxe Villa / Resort in Ubud',
          'Sightseeing: Check-in, relax & romantic candlelight dinner at resort'
        ]
      },
      {
        day: 2,
        title: 'Ayung River White Water Rafting & ATV Quad Bike Adventure',
        description: [
          'Accommodation: Villa / Resort in Ubud',
          'Sightseeing: Ayung River Whitewater Rafting with certified instructor',
          'Sightseeing: Jungle & Mud Trail ATV Quad Bike Adventure'
        ]
      },
      {
        day: 3,
        title: 'Bali Swing, Kintamani Mt. Batur, Tegalalang Terraces & Waterfall',
        description: [
          'Accommodation: Villa / Resort in Ubud',
          'Sightseeing: Iconic Bali Swing Experience with panoramic valley view',
          'Sightseeing: Kintamani Viewpoint overlooking Mt. Batur volcano & Lake Batur',
          'Sightseeing: Tegalalang Step Rice Terraces & Tegenungan Cascading Waterfall'
        ]
      },
      {
        day: 4,
        title: 'Ubud to Kuta Transfer & Tanah Lot Coastal Temple Sunset',
        description: [
          'Transfer: Transfer from Ubud to Kuta hotel',
          'Accommodation: 4-Star Deluxe Hotel in Kuta',
          'Sightseeing: Iconic Tanah Lot Temple Sunset Views on rocky sea outcrop'
        ]
      },
      {
        day: 5,
        title: 'Full-Day Nusa Penida Excursion - Kelingking T-Rex & Crystal Bay',
        description: [
          'Transfer: Fast speedboat round-trip between Sanur and Nusa Penida Island',
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Kelingking Beach T-Rex Cliff Edge Panoramic Viewpoint',
          'Sightseeing: Crystal Bay Beach Stroll & Optional Snorkeling'
        ]
      },
      {
        day: 6,
        title: 'Uluwatu Cliff Temple, Padang-Padang Beach & Beach Club',
        description: [
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Uluwatu Ocean Cliff Temple & Spiritual Views',
          'Sightseeing: Padang-Padang Beach Walk & Single Fin Beach Club Sunset'
        ]
      },
      {
        day: 7,
        title: 'Lempuyang Gate of Heaven & Balinese Couples Spa',
        description: [
          'Accommodation: Hotel in Kuta',
          'Sightseeing: Pura Lempuyang Iconic "Gate of Heaven" with Mt. Agung backdrop',
          'Sightseeing: Relaxing Balinese Traditional Full-Body Couple Spa & Massage'
        ]
      },
      {
        day: 8,
        title: 'Departure from Bali - Return Flight Home',
        description: [
          'Transfer: Hotel checkout & transfer to Denpasar International Airport for departure flight'
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
