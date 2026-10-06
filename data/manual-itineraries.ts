import { ManualItinerary } from '@/types/manual-itinerary';
import { ItineraryDocument } from '@/types/itinerary';

export const himachalExplorerManualItinerary: ManualItinerary = {
  id: 'himachal-explorer',
  slug: 'wanderphilia-signature-himachal-explorer',
  title: 'Wanderphilia Signature Himachal Explorer',
  subtitle: 'Signature Himalayan Mountain Expedition',
  duration: '9 Nights / 10 Days | 25 December – 3 January',
  numNights: 9,
  numDays: 10,
  dates: '25 December – 3 January',
  route: 'Chandigarh → Dharamshala → Dalhousie → Bir → Manali → Kasol → Chandigarh.',
  routeSummary: '2N Dharamshala | 2N Dalhousie | 1N Bir | 2N Manali | 2N Kasol',
  destination: 'Himachal Pradesh',
  travelStyle: 'Signature Explorer Trip',
  tripType: 'Curated Group / Customised Tour',
  leadName: 'Valued Traveler',
  vehicleType: '17 Seater Tempo Traveller',
  mealPlan: 'Breakfast & Dinner (Breakfast except for Day 1 & Dinner for day 10)',
  heroImage: '/images/himachal.jpg',
  galleryImages: [
    '/images/himachal.jpg',
    '/images/himachal2.jpg',
    '/images/himachal3.jpg',
    '/images/himachal4.jpg',
    '/images/himachal5.jpg',
    '/images/himachal6.jpg',
    '/images/himachal7.jpg',
    '/images/himachal8.jpg',
    '/images/himachal9.jpg'
  ],
  accommodations: [
    { city: 'Dharamshala', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
    { city: 'Dalhousie', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
    { city: 'Bir', nights: 1, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
    { city: 'Manali', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
    { city: 'Kasol', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '25 Dec',
      title: 'Day 1 | 25 Dec Chandigarh → Dharamshala',
      route: 'Chandigarh → Dharamshala',
      durationNote: 'Approx. 6–7 hrs',
      intro: 'Your Himachal adventure begins with a scenic drive from Chandigarh towards the mountains.',
      timeline: [
        'Pickup from Chandigarh',
        'Scenic drive through the Kangra Valley',
        'Check-in and freshen up',
        'Evening exploration of McLeod Ganj',
        'Discover local cafés and mountain streets',
        'Sunset at Naddi View Point',
        'Tibetan Market stroll'
      ],
      stayLocation: 'Dharamshala',
      image: '/images/himachal.jpg',
      meals: 'Dinner'
    },
    {
      day: 2,
      date: '26 Dec',
      title: 'Day 2 | 26 Dec Dharamshala & McLeod Ganj — Culture, Cafés & Mountains',
      route: 'Dharamshala & McLeod Ganj',
      intro: 'After breakfast, explore the cultural heart of Dharamshala.',
      timeline: [
        'Dalai Lama Temple Complex',
        'Namgyal Monastery',
        'Bhagsunag Temple',
        'Bhagsu Waterfall',
        'St. John in the Wilderness Church'
      ],
      sections: [
        {
          title: 'Evening :',
          items: [
            'Café hopping in McLeod Ganj',
            'Local shopping',
            'Exploring the charming lanes of McLeod Ganj'
          ],
          type: 'normal'
        },
        {
          title: 'Optional for active travellers:',
          note: 'Half-day Triund hike, subject to weather, trail conditions and fitness.',
          items: [
            'Half-day Triund hike, subject to weather, trail conditions and fitness.'
          ],
          type: 'optional'
        }
      ],
      stayLocation: 'Dharamshala',
      image: '/images/himachal2.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      date: '27 Dec',
      title: 'Day 3 | 27 Dec Dharamshala → Dalhousie',
      route: 'Dharamshala → Dalhousie',
      durationNote: 'Approx. 4–5 hrs',
      intro: 'Leave the Kangra Valley behind and journey towards the colonial charm of Dalhousie.',
      timeline: [],
      sections: [
        {
          title: 'After check-in:',
          items: [
            'Gandhi Chowk',
            'Subhash Chowk',
            'Explore the local market',
            'Relaxed evening at a cosy café'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Dalhousie',
      image: '/images/himachal3.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      date: '28 Dec',
      title: 'Day 4 | 28 Dec Khajjiar — The Mini Switzerland of Himachal',
      route: 'Dalhousie & Khajjiar',
      intro: 'A beautiful day exploring the forests and meadows surrounding Dalhousie.',
      timeline: [
        'Drive to Khajjiar',
        'Explore the famous Khajjiar Meadows',
        'Photography & leisure time',
        'Optional horse riding',
        'Optional adventure activities',
        'Kalatop Wildlife Sanctuary / nature walk, subject to time and conditions'
      ],
      outro: [
        'Return to Dalhousie by evening.',
        'Enjoy a relaxed evening at your own pace.'
      ],
      stayLocation: 'Dalhousie',
      image: '/images/himachal4.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      date: '29 Dec',
      title: 'Day 5 | 29 Dec Dalhousie → Bir',
      route: 'Dalhousie → Bir',
      durationNote: 'Approx. 5–6 hrs',
      intro: 'Today, the journey takes you towards one of Himachal’s most vibrant adventure towns.',
      timeline: [],
      sections: [
        {
          title: 'After reaching Bir:',
          items: [
            'Check-in and relax',
            'Explore Bir Monastery',
            'Walk through the Tibetan Colony',
            'Sunset at Bir Landing Site',
            'Discover Bir’s independent cafés'
          ],
          type: 'normal'
        },
        {
          title: 'Signature Experience:',
          items: [
            'Watch the paragliders soar over the valley at sunset.'
          ],
          type: 'signature'
        },
        {
          title: 'Optional:',
          items: [
            'Paragliding experience, subject to weather and operational conditions.'
          ],
          type: 'optional'
        }
      ],
      stayLocation: 'Bir',
      image: '/images/himachal5.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      date: '30 Dec',
      title: 'Day 6 | 30 Dec Bir → Manali',
      route: 'Bir → Manali',
      durationNote: 'Approx. 6–7 hrs',
      intro: 'A scenic journey deeper into the Himalayas.\n\nEnjoy the changing landscapes as you make your way towards Manali.',
      timeline: [],
      sections: [
        {
          title: 'On arrival:',
          items: [
            'Check-in and unwind',
            'Explore Old Manali',
            'Café hopping',
            'Riverside / mountain-side stroll',
            'Live music in the evening'
          ],
          type: 'normal'
        }
      ],
      outro: 'Get ready — the New Year celebrations are just around the corner!',
      stayLocation: 'Manali',
      image: '/images/himachal6.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      date: '31 Dec',
      title: 'Day 7 | 31 Dec Manali — Snow, Adventure & New Year’s Eve 🎉',
      route: 'Manali (Solang Valley & New Year’s Eve)',
      timeline: [],
      sections: [
        {
          title: 'Solang Valley Depending on weather and snow conditions:',
          items: [
            'Snow activities',
            'Ropeway',
            'ATV',
            'Zipline',
            'Paragliding',
            'Leisure time amidst the mountains'
          ],
          type: 'normal'
        },
        {
          title: 'Later, visit:',
          items: [
            'Nehru Kund',
            'Vashisht Village',
            'Vashisht Hot Springs'
          ],
          type: 'normal'
        },
        {
          title: 'New Year’s Eve in Manali 🎉',
          note: 'Dress up, gather with your fellow travellers and celebrate the final night of the year with:',
          items: [
            'New Year’s Eve celebration',
            'Music & entertainment',
            'Dinner',
            'Countdown to midnight',
            'Mountain party atmosphere'
          ],
          type: 'celebration'
        }
      ],
      outro: 'Return to the hotel and get ready for the evening.',
      stayLocation: 'Manali',
      image: '/images/himachal7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      date: '1 Jan',
      title: 'Day 8 | 1 Jan Manali → Kasol',
      route: 'Manali → Kasol',
      durationNote: 'Approx. 3–4 hrs',
      intro: 'Wake up to the first morning of the new year and leave the festive energy of Manali behind for the laid-back charm of the Parvati Valley.\n\nDrive towards Kasol through the beautiful Kullu Valley.',
      timeline: [],
      sections: [
        {
          title: 'En route, depending on time:',
          items: [
            'Kullu Valley viewpoints',
            'Riverside landscapes',
            'Local cafés'
          ],
          type: 'normal'
        },
        {
          title: 'After reaching Kasol:',
          items: [
            'Check-in',
            'Relax by the Parvati River',
            'Explore the Kasol market',
            'Café hopping',
            'Easy evening in the valley'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Kasol',
      image: '/images/himachal8.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      date: '2 Jan',
      title: 'Day 9 | 2 Jan Parvati Valley — Kasol, Manikaran & Mountain Villages',
      route: 'Parvati Valley (Kasol & Manikaran)',
      intro: 'A slow, immersive day in the Parvati Valley.',
      timeline: [],
      sections: [
        {
          title: 'Explore:',
          items: [
            'Kasol',
            'Chalal village trail / riverside walk',
            'Manikaran Sahib',
            'Hot springs',
            'Parvati Valley viewpoints'
          ],
          type: 'normal'
        },
        {
          title: 'Optional:',
          items: [
            'Trek towards Tosh, subject to weather, trail conditions and group fitness. For a relaxed group, this can be replaced with a café-and-village exploration day.'
          ],
          type: 'optional'
        }
      ],
      outro: 'Later, return to Kasol and spend your final evening soaking in its unique mountain culture.',
      stayLocation: 'Kasol',
      image: '/images/himachal9.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      date: '3 Jan',
      title: 'Day 10 | 3 Jan Kasol → Chandigarh | Departure',
      route: 'Kasol → Chandigarh',
      intro: 'Enjoy breakfast amidst the mountains before beginning your journey back to Chandigarh.',
      timeline: [
        'Breakfast',
        'Check-out',
        'Scenic drive through the Kullu Valley',
        'En-route mountain & riverside stops, subject to time',
        'Drop at Chandigarh'
      ],
      stayLocation: 'Trip Ends: Chandigarh',
      image: '/images/himachal_hero.jpg',
      meals: 'Breakfast',
      signOff: 'Until the next adventure — Wanderphilia style.'
    }
  ],
  inclusions: [
    '9 Nights Accommodation on Deluxe Property on Triple Sharing Basis.',
    'Sightseeing & Transfers in 17 Seater Tempo Traveller From Amritsar - Amritsar for 10 Days .',
    'Meals Breakfast & Dinner ( Breakfast except for Day 1 & Dinner for day 10 )',
    'Chauffer Cum Guide For Entire Trip',
    'River Rafting Experience in Manali.',
    'Driver Allowance & Night Charges.',
    'Tolls Included.'
  ],
  exclusions: [
    'Anything not specifically mentioned in the inclusions.',
    'Cost arising due to change or delay in flight timings.',
    'Entry tickets to any monuments or attractions are not included.'
  ],
  thingsToCarry: [
    'Light Woollens/Jackets',
    'Comfortable Shoes',
    'Personal Medicines',
    'Sunscreen & Sunglasses',
    'Power Bank & Chargers',
    'Snacks & Essentials for Kids'
  ]
};

export const vietnamAneeshManualItinerary: ManualItinerary = {
  id: 'vietnam-aneesh',
  slug: 'vietnam-signature-luxury-expedition',
  title: 'Grand Vietnam & Ha Long Bay Luxury Expedition',
  subtitle: '5-Star Luxury Private Expedition • South to North Vietnam & Ha Long Bay Cruise',
  duration: '14 Nights / 15 Days | 25 October – 08 November',
  numNights: 14,
  numDays: 15,
  dates: '25 October – 08 November',
  route: 'Ho Chi Minh → Cu Chi → Phu Quoc → Da Nang → Ba Na Hills → Hoi An → Hanoi → Ninh Binh → Sapa → Fansipan → Ha Long Bay → Hanoi',
  routeSummary: '2N Ho Chi Minh | 3N Phu Quoc | 2N Da Nang | 1N Ba Na Hills | 1N Da Nang | 2N Hanoi | 2N Sapa | 1N Ha Long Bay Cruise',
  destination: 'Vietnam',
  travelStyle: '5-Star Luxury Private Tour',
  tripType: 'Customised Private Tour (5 Adults)',
  leadName: 'Aneesh',
  adults: 5,
  kids: 0,
  perAdultPrice: 170772,
  baseAmount: 798000,
  gstPercentage: 5,
  gstAmount: 39900,
  tcsPercentage: 2,
  tcsAmount: 15960,
  finalQuotationAmount: 853860,
  vehicleType: 'Private AC Van with Dedicated Chauffeur & English-Speaking Tour Guides',
  mealPlan: 'Daily Breakfast at 5-Star Hotels (except Day 1) & Full Board Meals (B/L/D) on Ha Long Bay Cruise',
  heroImage: '/images/banner-vietnam-cruise.png',
  galleryImages: [
    '/images/banner-vietnam-cruise.png',
    '/images/vietnam.png',
    '/images/vietnam-wonders.png',
    '/images/vietnam-sapa.png',
    '/images/vietnam-highlights.png',
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png',
    '/images/vietnam-mesmerising.png',
    '/images/vietnam-exotic.png',
    '/images/vietnam-dreamy.png'
  ],
  accommodations: [
    { city: 'Ho Chi Minh', nights: 2, hotelName: 'HOTEL EQUATORIAL HO CHI MINH CITY (5-Star)', roomCategory: 'Deluxe Room' },
    { city: 'Phu Quoc', nights: 3, hotelName: 'WYNDHAM GRAND HOTEL (5-Star)', roomCategory: 'Deluxe Garden View Room' },
    { city: 'Da Nang', nights: 2, hotelName: 'GRAND TOURANE HOTEL (5-Star)', roomCategory: 'Deluxe City View Room' },
    { city: 'Ba Na Hills', nights: 1, hotelName: 'Mercure Danang French Village Bana Hills (4-Star Superior)', roomCategory: 'Standard / Deluxe Room' },
    { city: 'Da Nang', nights: 1, hotelName: 'GRAND TOURANE HOTEL (5-Star)', roomCategory: 'Deluxe City View Room' },
    { city: 'Hanoi', nights: 2, hotelName: 'GRAND VISTA HOTEL (5-Star)', roomCategory: 'Deluxe Room' },
    { city: 'Sapa', nights: 2, hotelName: 'KK SAPA HOTEL (5-Star Luxury)', roomCategory: 'Deluxe Garden View Room' },
    { city: 'Ha Long Bay', nights: 1, hotelName: 'AMBASSADOR CRUISE HA LONG BAY (5-Star Luxury Cruise)', roomCategory: 'Deluxe Balcony Oceanview Cabin (2D1N Overnight)' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '25 Oct',
      title: 'Day 1 | 25 Oct Ho Chi Minh Arrival & City Highlights Tour',
      route: 'Tan Son Nhat Airport → Ho Chi Minh City Sightseeing',
      durationNote: 'Arrival Day (Driver + Guide)',
      intro: 'Welcome to Vietnam! Upon arrival at Tan Son Nhat International Airport, you will be warmly greeted by your private local guide and driver to begin discovering the main highlights of Saigon.',
      timeline: [
        'Warm airport greeting by your private local guide and chauffeur',
        'Visit the War Remnants Museum to gain deep insights into Vietnam’s modern history',
        'Explore the Reunification Palace (Independence Palace), an iconic landmark of Vietnam’s history',
        'Admire the elegant French-colonial Notre Dame Cathedral in District 1',
        'Explore the charming Central Post Office designed by Gustave Eiffel',
        'Transfer to Hotel Equatorial Ho Chi Minh City for check-in and relaxation (early check-in not included)',
        'Evening free at leisure to stroll around vibrant Saigon'
      ],
      sections: [
        {
          title: 'Saigon Highlights Included:',
          items: [
            'War Remnants Museum & Reunification Palace entry and guided tour.',
            'Notre Dame Cathedral & Central Post Office historical exploration.',
            'Private comfortable AC Van and dedicated English-speaking guide.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Ho Chi Minh City',
      image: '/images/vietnam-beauty.png',
      meals: 'On own / In-flight'
    },
    {
      day: 2,
      date: '26 Oct',
      title: 'Day 2 | 26 Oct Cu Chi Underground Tunnels & Ben Thanh Market Shopping',
      route: 'Ho Chi Minh City ↔ Cu Chi Historic Tunnels',
      durationNote: 'Excursion (Driver + Guide)',
      intro: 'After breakfast, meet your guide and depart for an excursion to the legendary Cu Chi Tunnels, the historic underground network that played a crucial role during the Vietnam War.',
      timeline: [
        'Breakfast at Hotel Equatorial Ho Chi Minh City',
        '08:00 AM: Depart Ho Chi Minh City for Cu Chi Tunnels through rural countryside',
        'Watch an introductory video on the construction and defense strategies of the tunnels',
        'Explore underground living quarters, kitchens, hospital bunkers, meeting rooms, and weapon traps',
        'Experience crawling through safe sections of the historic tunnel network',
        'Taste traditional boiled tapioca with roasted peanuts and hot tea — the wartime staple diet',
        'In the afternoon, return to Ho Chi Minh City for shopping time at Ben Thanh Market',
        'Browse local handicrafts, Vietnamese coffee, silk, cashews, and souvenirs',
        'Return to the hotel and relax for the night, with the day’s activities ending'
      ],
      sections: [
        {
          title: 'Historical & Cultural Highlights:',
          items: [
            'Cu Chi Tunnels guided underground exploration with entrance ticket.',
            'Ben Thanh Market shopping and Saigon city exploration.',
            'Private transport and dedicated English-speaking guide.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Ho Chi Minh City',
      image: '/images/vietnam-exotic.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 3,
      date: '27 Oct',
      title: 'Day 3 | 27 Oct Flight to Phu Quoc Island — Tropical Island Getaway',
      route: 'Ho Chi Minh → Phu Quoc Island',
      durationNote: 'Domestic Flight & Transfer (Driver)',
      intro: 'After breakfast at the hotel, transfer to Tan Son Nhat Airport for your domestic flight to Phu Quoc, Vietnam’s premier island paradise in the Gulf of Thailand.',
      timeline: [
        'Breakfast at Hotel Equatorial Ho Chi Minh City',
        'Private chauffeur transfer to Tan Son Nhat Airport for the flight to Phu Quoc',
        'Flight to Phu Quoc International Airport',
        'Upon arrival in Phu Quoc, meet your private island driver',
        'Transfer to the 5-Star Wyndham Grand Phu Quoc and head to the hotel for check-in (early check-in not included)',
        'Rest, refresh, and enjoy the pristine resort pools, beachfront, and tropical island vibe'
      ],
      stayLocation: 'Phu Quoc',
      image: '/images/vietnam-wonders.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 4,
      date: '28 Oct',
      title: 'Day 4 | 28 Oct Full Day at VinWonders Theme Park, Vinpearl Safari & Grand World',
      route: 'Phu Quoc Resort ↔ VinWonders, Vinpearl Safari & Grand World',
      durationNote: 'Full Day Tour (Driver)',
      intro: 'After breakfast, set out for a full day of excitement at VinWonders, the island’s largest theme park, and Vinpearl Safari, home to a wide variety of wildlife, followed by the vibrant Grand World complex.',
      timeline: [
        'Lavish breakfast at Wyndham Grand Phu Quoc',
        'Morning visit to Vinpearl Safari — Vietnam’s first and largest open semi-wild conservation zoo',
        'Experience the special Safari bus tour up-close with Bengal tigers, lions, rhinos, giraffes, and zebras',
        'Continue to VinWonders Phu Quoc — Southeast Asia’s largest theme park with thrilling rollercoasters, water park, and Neptune Palace Aquarium',
        'In the afternoon, continue to Grand World, the vibrant entertainment and cultural complex of Phu Quoc (note: Tinh Hoa Show, Venice boat trip and Teddy Bear Museum are not included)',
        'Stroll through the colorful Italian-inspired Venice canal promenade and Bamboo Legend architecture',
        'Conclude the day by returning to your hotel for rest'
      ],
      sections: [
        {
          title: 'Included Theme Park Passes:',
          items: [
            'Vinpearl Safari Full Entry Ticket with specialized safari bus tour.',
            'VinWonders Full Day Access Ticket including all rides and the Giant Turtle Aquarium.',
            'Grand World Complex visit (Note: Tinh Hoa Show, Venice boat trip and Teddy Bear Museum are not included).'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Phu Quoc',
      image: '/images/vietnam-wonders.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 5,
      date: '29 Oct',
      title: 'Day 5 | 29 Oct 3 Islands Speedboat Tour, Hon Thom Cable Car & Kiss Bridge',
      route: 'Phu Quoc 3 Islands Speedboat Tour → Hon Thom Island → Sunset Town',
      durationNote: '08:00 AM – Full Day Tour (Driver + Guide)',
      intro: 'Embark on an exhilarating 3 Islands speedboat adventure to explore coral reefs and white sand lagoons, ride the world’s longest over-sea cable car, and witness Sunset Town & Kiss Bridge.',
      timeline: [
        'Breakfast at the resort',
        '08:00 AM: Embark on an exciting 3 Islands Tour by speed boat (JOINING speed boat)',
        'Discover Gam Ghi Island with its colorful coral reefs and crystal waters for snorkeling',
        'Continue to Xuong Island for stunning seascapes and photography',
        'Relax at May Rut Island, where a white sand lagoon and clear waters invite you to swim or simply unwind',
        'Later, enjoy a ride on the spectacular Hon Thom Cable Car, the longest over-sea cable car in the world (7,899.9m)',
        'Have fun at Aquatopia Water Park on Hon Thom Island with a variety of exciting water slides and family attractions',
        'Continue to the striking Kiss Bridge and Sunset Town, an architectural icon that offers sweeping sea views and a perfect photo opportunity at the point where the two halves of the bridge almost meet',
        'Return to the hotel after the tour for relaxation'
      ],
      sections: [
        {
          title: 'Island Expedition Inclusions:',
          items: [
            '3 Islands Speedboat Tour (Gam Ghi, Xuong & May Rut Islands) with snorkeling equipment.',
            'Hon Thom Cable Car round-trip ticket & Aquatopia Water Park access.',
            'Kiss Bridge entry & Sunset Town Mediterranean promenade.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Phu Quoc',
      image: '/images/vietnam-dreamy.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 6,
      date: '30 Oct',
      title: 'Day 6 | 30 Oct Flight to Da Nang — Central Vietnam Coastal Welcome',
      route: 'Phu Quoc → Da Nang',
      durationNote: 'Domestic Flight & Check-in (Driver)',
      intro: 'After breakfast, transfer to Phu Quoc airport for your domestic flight to Da Nang, the premier coastal city of Central Vietnam.',
      timeline: [
        'Breakfast at Wyndham Grand Phu Quoc and check-out',
        'Transfer to the airport for the flight to Da Nang',
        'Upon arrival at Da Nang Airport, meet your driver',
        'Private transfer and check-in at the 5-Star Grand Tourane Hotel along My Khe Beach (early check-in is not included)',
        'Evening: Free at leisure to relax on the beach, visit the Dragon Bridge, or explore the Da Nang night market'
      ],
      stayLocation: 'Da Nang',
      image: '/images/vietnam.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 7,
      date: '31 Oct',
      title: 'Day 7 | 31 Oct Ba Na Hills, Giant Hand Golden Bridge & Overnight in French Village',
      route: 'Da Nang → Ba Na Hills Mountain Station (Driver)',
      intro: 'Following breakfast, depart for Ba Na Hills and enjoy a scenic cable car ride offering breathtaking mountain views, stroll across the iconic Golden Bridge, and stay overnight in the French Village.',
      timeline: [
        'Following breakfast at Grand Tourane Hotel, depart for Ba Na Hills',
        'Enjoy a scenic world-record cable car ride offering breathtaking mountain views',
        'Explore the iconic Golden Bridge held by giant hands stretching across the misty mountain',
        'Stroll through the charming French Village with medieval European architecture and Le Jardin D’Amour flower gardens',
        'Experience the fun attractions, 4D/5D cinemas, and rides at Fantasy Park',
        'Check-in at Mercure Danang French Village Bana Hills',
        'Overnight in Ba Na Hills — experience the enchanting, quiet mountain atmosphere after day crowds depart'
      ],
      sections: [
        {
          title: 'Ba Na Hills Highlights:',
          items: [
            'Round-trip Cable Car Ticket & Fantasy Park amusement park access.',
            'Golden Bridge (Cau Vang) giant hands walk.',
            'Overnight stay at Mercure Danang French Village Bana Hills.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Ba Na Hills',
      image: '/images/vietnam.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 8,
      date: '01 Nov',
      title: 'Day 8 | 01 Nov Coconut Forest Basket Boat, Hoi An Ancient Town & Lantern Boat Ride',
      route: 'Ba Na Hills → Cam Thanh Coconut Forest → Hoi An Ancient Town → Da Nang',
      durationNote: 'Full Day Tour (Driver + Guide)',
      intro: 'Descend Ba Na Hills and journey to Cam Thanh Coconut Forest for a thrilling basket boat ride, followed by a walking tour through lantern-lit Hoi An Ancient Town and a lantern boat ride on the Hoai River.',
      timeline: [
        'After breakfast, enjoy your leisure time in Ba Na Hills',
        'Check-out at the hotel, go down by cable car and meet the guide and driver',
        'The journey then leads to Cam Thanh Coconut Forest to take a traditional bamboo basket boat ride with fun boat spinning',
        'Head to Hoi An Ancient Town for a guided walking tour through lantern-lit streets, Japanese Covered Bridge, and Chinese Assembly Halls',
        'Have a magical lantern boat ride on Hoai River and release candle-lit paper lanterns on the water',
        'In the evening, return to Da Nang, check in at Grand Tourane Hotel, and enjoy the rest of the day at leisure'
      ],
      sections: [
        {
          title: 'Cultural Highlights Included:',
          items: [
            'Cam Thanh Coconut Forest bamboo basket boat adventure.',
            'Hoi An Ancient Town UNESCO World Heritage walking tour ticket.',
            'Romantic Hoai River lantern boat ride with floating paper lanterns.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Da Nang',
      image: '/images/vietnam-highlights.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 9,
      date: '02 Nov',
      title: 'Day 9 | 02 Nov Flight to Hanoi & City Heritage Tour',
      route: 'Da Nang → Hanoi Capital (Driver + Guide)',
      intro: 'After breakfast, transfer to Da Nang Airport for your flight to Hanoi. Upon arrival, embark on a cultural tour of Vietnam’s thousand-year-old capital.',
      timeline: [
        'After breakfast, transfer to Da Nang airport for the flight to Ha Noi',
        'Upon arrival in Hanoi: You will be welcomed by our guide and driver',
        'Visit Ba Dinh Square, the historic Ho Chi Minh Mausoleum (outside), and the sacred One Pillar Pagoda',
        'Visit the Temple of Literature (Van Mieu), Vietnam’s first national university established in 1070',
        'Continue to Hoan Kiem Lake, cross the scarlet bridge to Ngoc Son Temple, and explore the bustling Hanoi Old Quarter',
        'Head to the 5-Star Grand Vista Hotel for check-in (early check-in not included)',
        'Evening at leisure to explore Hanoi’s charming cafés and street food culture'
      ],
      stayLocation: 'Hanoi',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 10,
      date: '03 Nov',
      title: 'Day 10 | 03 Nov Ninh Binh Day Tour — Tam Coc Caves, Bich Dong Pagoda & Hoa Lu',
      route: 'Hanoi ↔ Ninh Binh (Driver + Guide)',
      durationNote: 'Full Day Excursion',
      intro: 'After breakfast, depart for picturesque Ninh Binh province to experience bamboo boat rides through limestone caves, historic cave pagodas, and Vietnam’s ancient capital.',
      timeline: [
        'After breakfast at Grand Vista Hotel, depart for Ninh Binh',
        'Enjoy a traditional bamboo boat ride along the Ngo Dong River, passing through the three limestone caves of Tam Coc and the peaceful rice fields',
        'Continue to visit Bich Dong Pagoda, a 15th-century ancient temple built into a limestone mountain with scenic panoramic views',
        'Conclude with a visit to the ancient capital Hoa Lu (10th century temples of Dinh and Le dynasties) before returning to Hanoi in the afternoon',
        'Return to Hanoi and enjoy an evening at leisure'
      ],
      sections: [
        {
          title: 'Ninh Binh Day Highlights:',
          items: [
            'Tam Coc traditional bamboo rowboat excursion through 3 karst caves.',
            'Bich Dong ancient mountain cave pagoda.',
            'Hoa Lu ancient royal citadel of the 10th century.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Hanoi',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 11,
      date: '04 Nov',
      title: 'Day 11 | 04 Nov Scenic Mountain Drive to Sapa & Black H’mong Cat Cat Village',
      route: 'Hanoi → Sapa Highland Valley (Driver + Guide in Sapa)',
      durationNote: 'Scenic 6-hr Drive via Expressway',
      intro: 'After breakfast, begin the scenic six-hour drive through misty mountain ranges to Sapa, famous for terraced rice valleys and vibrant ethnic minority villages.',
      timeline: [
        'After breakfast at Grand Vista Hotel, begin the scenic six-hour drive to Sapa via the expressway',
        'Check in to the 5-Star KK Sapa Hotel (early check-in not included) and take a brief rest',
        'In the afternoon, stroll through Cat Cat Village, a traditional Black H’mong settlement known for wooden houses, cascading waterfalls, and traditional weaving craftsmanship',
        'Evening free to relax, sample regional highland dishes, or take a gentle walk through Sapa town'
      ],
      stayLocation: 'Sapa',
      image: '/images/vietnam-sapa.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 12,
      date: '05 Nov',
      title: 'Day 12 | 05 Nov Fansipan Legend Peak ("Roof of Indochina") & Sapa City Tour',
      route: 'Sapa Town ↔ Fansipan Legend Peak (Driver + Guide in Sapa)',
      durationNote: 'Peak Expedition & Heritage Tour',
      intro: 'After breakfast, start the day with an unforgettable excursion to Fansipan Legend Peak (3,143m), the highest mountain peak in Indochina, followed by a Sapa city heritage tour.',
      timeline: [
        'After breakfast at KK Sapa Hotel, start the day with an excursion to Fansipan Legend Peak',
        'Board the scenic Muong Hoa mountain train, then glide above the majestic Hoang Lien Son range by cable car',
        'Take a one-way funicular train to the summit of Fansipan, the “Roof of Indochina” (3,143m), where clouds drift across panoramic mountain peaks',
        'Touch the iconic summit milestone and admire the monumental Grand Buddha statue on the mountain',
        'Later, enjoy a Sapa City Tour, including a visit to the iconic Stone Church along with the town’s central square and cultural landmarks that reflect Sapa’s unique highland charm',
        'Return to the hotel for leisure and relaxation'
      ],
      sections: [
        {
          title: 'Fansipan Mountain Inclusions:',
          items: [
            '2-Way Muong Hoa Funicular Mountain Train Ticket.',
            '2-Way Fansipan Legend High-Altitude Cable Car Ticket.',
            '1-Way Summit Funicular Ticket to the top of Fansipan (3,143m).',
            'Sapa Stone Church & Central Square walking tour.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Sapa',
      image: '/images/vietnam-sapa.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 13,
      date: '06 Nov',
      title: 'Day 13 | 06 Nov Sapa to Hanoi Return Drive & Leisure Evening',
      route: 'Sapa → Hanoi (Driver)',
      durationNote: 'Return Drive (~5.5 hrs)',
      intro: 'After check-out at the hotel in Sapa, begin your return journey to Hanoi via the expressway and enjoy a relaxing evening in the capital.',
      timeline: [
        'Breakfast at KK Sapa Hotel and leisurely morning photography',
        'After check-out at the hotel in Sapa, return to Ha Noi',
        'Transfer to Ha Noi and check-in at the 5-Star Grand Vista Hotel (early check-in is not included)',
        'Enjoy your leisure time in Ha Noi for café hopping, West Lake stroll, or souvenir shopping'
      ],
      stayLocation: 'Hanoi',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 14,
      date: '07 Nov',
      title: 'Day 14 | 07 Nov Ha Long Bay UNESCO World Heritage 5-Star Luxury Overnight Cruise',
      route: 'Hanoi → Ha Long Bay (Driver & Ambassador Cruise Crew)',
      durationNote: 'Overnight Cruise Voyage',
      intro: 'After breakfast, journey to Ha Long Bay, a UNESCO World Heritage Site, and embark on the 5-Star Ambassador Cruise to discover emerald waters, limestone karsts, and sunset over the bay.',
      timeline: [
        'After breakfast at Grand Vista Hotel Hanoi',
        '08:00 AM: Journey to Ha Long Bay, a UNESCO World Heritage Site via Expressway',
        '11:30 AM: Embark on an overnight cruise on the 5-Star Ambassador Cruise to discover the emerald waters and majestic limestone karsts of Ha Long Bay',
        'Check-in to your Deluxe Balcony Cabin and enjoy a sumptuous welcome buffet lunch as the cruise sails past scenic islands',
        'Enjoy onboard activities, sightseeing at Sung Sot (Surprise) Cave / Titop Island beach & viewpoint',
        'Enjoy sunset party on the sundeck over the bay, cooking demonstration, and gourmet dinner onboard',
        'Overnight on cruise'
      ],
      sections: [
        {
          title: '5-Star Ambassador Cruise Package:',
          items: [
            'Deluxe Balcony Oceanview Cabin on 5-Star Ambassador Cruise.',
            'Full Board Meals onboard: Lunch, Gourmet Dinner, Light Breakfast & Brunch.',
            'Cave excursions, island visits, sunset party, and evening squid fishing.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'On Cruise (Ambassador Cruise Ha Long Bay)',
      image: '/images/banner-vietnam-cruise.png',
      meals: 'Breakfast, Lunch & Gourmet Dinner (B/L/D)'
    },
    {
      day: 15,
      date: '08 Nov',
      title: 'Day 15 | 08 Nov Sunrise Tai Chi, Farewell Brunch & Flight Departure',
      route: 'Ha Long Bay → Noi Bai Airport Hanoi (Driver)',
      durationNote: 'Cruise Disembarkation & Airport Transfer',
      intro: 'Witness the morning sun over Ha Long Bay karsts, enjoy a delicious farewell brunch, and transfer to Noi Bai Airport for your flight back home.',
      timeline: [
        'Morning Tai Chi session on the cruise sundeck and light morning refreshments',
        'Cruising past iconic limestone karsts as the ship returns toward harbor',
        '11:30 AM: Disembark the cruise after brunch',
        'Afternoon: Transfer to Noi Bai Airport in Hanoi for your flight to your country (recommended flight after 17:30)',
        'Board your return flight home carrying unforgettable lifetime memories of Vietnam'
      ],
      stayLocation: 'Flight / Home',
      image: '/images/vietnam.png',
      meals: 'Brunch'
    }
  ],
  inclusions: [
    'Transfer on private comfortable AC Van throughout the tour',
    'Daily breakfast at the hotel (except Day 1)',
    'Ho Chi Minh City Tour (War Remnants Museum, Reunification Palace, Notre Dame Cathedral & Central Post Office)',
    'Cu Chi Tunnels historic underground excursion',
    'VinWonders & Vinpearl Safari full day passes in Phu Quoc',
    'Grand World visit (note: Tinh Hoa Show, Venice boat trip and Teddy Bear Museum are not included)',
    '3 Islands Tour by speed boat (Gam Ghi, Xuong & May Rut Islands - JOINING speed boat)',
    'Hon Thom Cable Car with Aquatopia Water Park & Kiss Bridge in Sunset Town',
    'Ba Na Hills round-trip cable car ticket & Fantasy Park admission',
    'Cam Thanh Coconut Forest bamboo basket boat ride',
    'Hoi An Ancient Town guided walking tour',
    'Romantic lantern boat ride on Hoai River in Hoi An',
    'Ha Noi City Tour (Ba Dinh Square, Ho Chi Minh Mausoleum outside, One Pillar Pagoda, Temple of Literature & Old Quarter)',
    'Ninh Binh tour with Tam Coc bamboo boat ride, Bich Dong Pagoda & Hoa Lu ancient temple',
    'Cat Cat Village ethnic trek in Sapa',
    'Fansipan Legend Peak excursion including 2-way Muong Hoa Train, cable car, and 1-way funicular to the summit of Fansipan (Roof of Indochina)',
    '2D1N Ha Long Bay 5-Star Luxury Overnight Cruise (Ambassador Cruise) with full board meals',
    'Professional English-speaking local tour guides as mentioned in the itinerary',
    'Complimentary drinking water on tour (2 bottles/pax/day)',
    'All government taxes & service charges'
  ],
  exclusions: [
    'All Flight tickets (International & Domestic flights) and meals NOT mentioned in the itinerary',
    'Compulsory tipping for driver and guide: 5 USD / 1 PAX / 1 DAY WITH TOUR GUIDE',
    'Lunches and Dinners (except where mentioned on cruise)',
    'Dinner with transfer',
    'Vietnam E-Visa fees',
    'Personal expenses, laundry, telephone calls, mini-bar, alcoholic drinks',
    'Optional shows & attractions (Tinh Hoa Show, Venice boat trip, Teddy Bear Museum in Grand World)',
    'Any other items or services not mentioned in the inclusions'
  ],
  thingsToCarry: [
    'Original Passport (min. 6 months validity) & Printed E-Visa',
    'Universal Travel Adapter & High-Capacity Power Bank',
    'Comfortable Walking Shoes & Flip Flops / Sandals',
    'Light Summer Clothes for South/Central Vietnam',
    'Warm Jacket / Fleece Layer for Sapa & Fansipan Peak (3,143m)',
    'Swimwear & Beach Towel for Phu Quoc & Cruise',
    'Sunscreen (SPF 50+), Sunglasses & Sun Hat',
    'Personal First Aid & Travel Medicines',
    'Vietnam Dong (VND) / USD & Forex Cards'
  ]
};

export const manualItinerariesRegistry: Record<string, ManualItinerary> = {
  'himachal-explorer': himachalExplorerManualItinerary,
  'wanderphilia-signature-himachal-explorer': himachalExplorerManualItinerary,
  'wp-himachal-explorer': himachalExplorerManualItinerary,
  'vietnam-aneesh': vietnamAneeshManualItinerary,
  'vietnam-signature-luxury-expedition': vietnamAneeshManualItinerary,
  'mr-aneesh-vietnam': vietnamAneeshManualItinerary,
  'mr-aneesh-vietnam-trip': vietnamAneeshManualItinerary,
  'mr-aneesh-x4-vietnam-trip': vietnamAneeshManualItinerary,
  'mr-aneesh-x5-vietnam-trip': vietnamAneeshManualItinerary,
  'vietnam-aneesh-x4': vietnamAneeshManualItinerary,
  'vietnam-aneesh-x5': vietnamAneeshManualItinerary,
  'wp-vietnam-aneesh': vietnamAneeshManualItinerary
};

export function getManualItinerary(idOrSlug: string): ManualItinerary | null {
  if (!idOrSlug) return null;
  const key = idOrSlug.toLowerCase().trim();
  return manualItinerariesRegistry[key] || Object.values(manualItinerariesRegistry).find(
    it => it.id.toLowerCase() === key || it.slug.toLowerCase() === key
  ) || null;
}

export function getAllManualItineraries(): ManualItinerary[] {
  return [himachalExplorerManualItinerary, vietnamAneeshManualItinerary];
}

/**
 * Helper to convert a ManualItinerary into an ItineraryDocument format
 */
export function manualItineraryToDocument(manual: ManualItinerary): ItineraryDocument {
  const isVietnam = manual.destination.toLowerCase().includes('vietnam');
  const defaultHighlights = isVietnam ? [
    'Ho Chi Minh City Highlights & Cu Chi Underground Tunnels',
    'Phu Quoc Island: 3 Islands Speedboat, VinWonders & Vinpearl Safari',
    'Hon Thom World’s Longest Over-Sea Cable Car & Sunset Town Kiss Bridge',
    'Ba Na Hills French Village & Iconic Giant Hands Golden Bridge',
    'Cam Thanh Coconut Forest Basket Boat & Hoi An Lantern River Cruise',
    'Hanoi 1000-Year Heritage & Ninh Binh Tam Coc Karst Caves',
    'Sapa Valley H’mong Cat Cat Village & Fansipan Legend Peak (3,143m)',
    '2D1N Ha Long Bay 5-Star Luxury Overnight Cruise (Ambassador Cruise)'
  ] : [
    'Scenic drive through Kangra Valley & McLeod Ganj',
    'Dalai Lama Temple & Bhagsu Waterfall',
    'Colonial Charm & Cafés of Dalhousie',
    'Khajjiar - The Mini Switzerland of Himachal',
    'Bir Tibetan Colony & Sunset Paragliding',
    'Snow Activities in Solang Valley & New Year Party in Manali',
    'River Rafting Experience in Manali',
    'Kasol & Parvati Valley Exploration'
  ];

  return {
    id: manual.id,
    slug: manual.slug,
    title: manual.title,
    subTitle: manual.subtitle || `${manual.numNights} Nights / ${manual.numDays} Days Signature Experience`,
    description: `Custom ${manual.duration} expedition exploring ${manual.route}`,
    destination: manual.destination,
    stateOrCountry: isVietnam ? 'Vietnam' : 'Himachal Pradesh, India',
    travelStyle: manual.travelStyle || 'Signature Tour',
    tripType: manual.tripType || 'Customised Trip',
    vehicleType: manual.vehicleType || 'Private AC Van with Dedicated Driver',
    noOfDays: manual.numDays,
    noOfNights: manual.numNights,
    leadDetails: {
      name: manual.leadName || 'Valued Traveler',
      firstName: (manual.leadName || 'Valued Traveler').split(' ')[0],
      duration: manual.duration,
      noOfDays: manual.numDays,
      noOfNights: manual.numNights,
      travelStyle: manual.travelStyle,
      tripType: manual.tripType,
      vehicleType: manual.vehicleType,
      mealPlan: manual.mealPlan
    },
    stay: {
      hotelName: manual.accommodations?.[0]?.hotelName || '5-Star Deluxe Property',
      roomCategory: manual.accommodations?.[0]?.roomCategory || 'Deluxe Room',
      mealPlan: manual.mealPlan
    },
    hotelName: manual.accommodations?.[0]?.hotelName || '5-Star Deluxe Property',
    roomCategory: manual.accommodations?.[0]?.roomCategory || 'Deluxe Room',
    mealPlan: manual.mealPlan,
    finalQuotationAmount: manual.finalQuotationAmount,
    perAdultPrice: manual.perAdultPrice,
    perKidPrice: manual.perKidPrice,
    adults: manual.adults || 5,
    kids: manual.kids || 0,
    baseAmount: manual.baseAmount,
    gstPercentage: manual.gstPercentage,
    gstAmount: manual.gstAmount,
    tcsPercentage: manual.tcsPercentage,
    tcsAmount: manual.tcsAmount,
    dayPlans: manual.dayPlans.map(dp => {
      // Flatten all bullet points for backward compatibility while preserving details
      const allBullets: string[] = [...(dp.timeline || [])];
      if (dp.sections) {
        dp.sections.forEach(sec => {
          if (sec.title) {
            allBullets.push(`**${sec.title.replace(/:$/, '')}**`);
          }
          if (sec.note) {
            allBullets.push(sec.note);
          }
          if (sec.items) {
            allBullets.push(...sec.items);
          }
        });
      }
      return {
        day: dp.day,
        title: dp.title,
        description: dp.intro || dp.title,
        stayLocation: dp.stayLocation,
        activities: allBullets,
        timeline: allBullets,
        image: dp.image,
        meals: dp.meals
      };
    }),
    highlights: defaultHighlights,
    inclusions: manual.inclusions,
    exclusions: manual.exclusions,
    packingTips: manual.thingsToCarry,
    heroImage: manual.heroImage,
    galleryImages: manual.galleryImages,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
