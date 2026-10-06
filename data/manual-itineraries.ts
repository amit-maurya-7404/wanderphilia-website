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
  tripType: 'Customised Private Tour (4 Adults)',
  leadName: 'Aneesh',
  adults: 4,
  kids: 0,
  perAdultPrice: 170772,
  baseAmount: 638400,
  gstPercentage: 5,
  gstAmount: 31920,
  tcsPercentage: 2,
  tcsAmount: 12768,
  finalQuotationAmount: 683088,
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

export const vietnamYashManualItinerary: ManualItinerary = {
  id: 'vietnam-yash',
  slug: 'vietnam-luxury-honeymoon-expedition',
  title: 'Grand Vietnam & Ha Long Bay Luxury Honeymoon Expedition',
  subtitle: '4-Star Luxury Hotels & 5-Star Cruise Honeymoon Expedition • North to South Vietnam',
  duration: '10 Nights / 11 Days | 25 November – 05 December',
  numNights: 10,
  numDays: 11,
  dates: '25 November – 05 December',
  route: 'Ha Noi → Ha Long Bay → Ninh Binh → Sapa → Fansipan → Da Nang → Ba Na Hills → Hoi An → Phu Quoc',
  routeSummary: '1N Cruise | 1N Ha Noi | 1N Sleeper Train | 2N Sapa | 2N Da Nang | 1N Ba Na Hills | 2N Phu Quoc',
  destination: 'Vietnam',
  travelStyle: '4-Star Luxury Private Honeymoon Tour',
  tripType: 'Customised Private Honeymoon Tour (2 Adults)',
  leadName: 'Yash',
  adults: 2,
  kids: 0,
  perAdultPrice: 127890,
  baseAmount: 255780,
  gstPercentage: 5,
  gstAmount: 12789,
  tcsPercentage: 2,
  tcsAmount: 5116,
  finalQuotationAmount: 273685,
  vehicleType: 'Private 7-Seater AC Car / Van with Dedicated Chauffeurs & English-Speaking Tour Guides',
  mealPlan: 'Daily Breakfast at Hotels (except Day 1) & Full Board Meals (B/L/D) on Ha Long Bay Cruise',
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
    { city: 'Ha Long Bay', nights: 1, hotelName: 'AURORA CRUISE (5-Star Luxury)', roomCategory: 'Executive Cabin' },
    { city: 'Ha Noi', nights: 1, hotelName: 'FTE HOTEL (4-Star Superior)', roomCategory: 'Superior Room' },
    { city: 'Overnight Train', nights: 1, hotelName: 'Hanoi to Sapa AC Sleeper Train', roomCategory: 'Comfortable Sleeper Berth' },
    { city: 'Sapa', nights: 2, hotelName: 'DE SAPA HOTEL (4-Star Luxury)', roomCategory: 'Premier Deluxe Room' },
    { city: 'Da Nang', nights: 2, hotelName: 'CANVAS HOTEL (4-Star Beachfront)', roomCategory: 'Classic King Room' },
    { city: 'Ba Na Hills', nights: 1, hotelName: 'Mercure Danang French Village Bana Hills (4-Star Superior)', roomCategory: 'Standard Room' },
    { city: 'Phu Quoc', nights: 2, hotelName: 'TAHITI BEACH HOTEL (4-Star Beachfront)', roomCategory: 'Deluxe Partial Sea View Room' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '25 Nov',
      title: 'Day 1 | 25 Nov Ha Noi Arrival → Ha Long Bay 5-Star Luxury Overnight Cruise',
      route: 'Noi Bai Airport / Ha Noi → Ha Long Bay',
      durationNote: 'Arrival Day (Driver + Cruise)',
      intro: 'Welcome to Vietnam! Arrive early morning in Hanoi, where your driver meets you to transfer directly to Ha Long Bay, a UNESCO World Heritage Site, to board your luxury overnight cruise.',
      timeline: [
        'Early morning flight arrival at Noi Bai International Airport in Ha Noi',
        'Warm airport welcome by your private chauffeur and scenic transfer to Ha Long Bay',
        'Embark on the 5-Star Aurora Cruise to discover emerald waters, towering limestone karsts, and tranquil hidden lagoons',
        'Check-in to your Executive Cabin with private ocean view',
        'Sumptuous welcome buffet lunch served onboard while cruising past scenic limestone karsts',
        'Afternoon cave exploration, kayaking / bamboo boat ride, and swimming at Titop Island beach',
        'Romantic sunset party on the sundeck with panoramic bay views',
        'Gourmet multi-course dinner onboard, followed by evening squid fishing and relaxation'
      ],
      sections: [
        {
          title: 'Ha Long Bay Cruise Inclusions:',
          items: [
            '1 Night Executive Cabin on 5-Star Aurora Cruise with full board gourmet meals (L/D).',
            'Guided cave excursions, island viewpoint climb & sunset deck party.',
            'Private comfortable 7-seater transfer from Hanoi to Ha Long Bay.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Ha Long Bay (On Cruise)',
      image: '/images/banner-vietnam-cruise.png',
      meals: 'Lunch & Gourmet Dinner (L/D)'
    },
    {
      day: 2,
      date: '26 Nov',
      title: 'Day 2 | 26 Nov Ha Long Bay Cruise Disembarkation → Hanoi City Heritage Tour & 30-Min Cyclo Ride',
      route: 'Ha Long Bay → Ha Noi City Sightseeing',
      durationNote: 'Cruise + Hanoi City Tour (Driver + Guide)',
      intro: 'Wake up to serene bay waters, enjoy morning Tai Chi and a farewell brunch onboard before traveling back to Hanoi for an immersive cultural city tour and traditional cyclo ride.',
      timeline: [
        'Morning sunrise Tai Chi session on the sundeck and light refreshments',
        '11:30 AM: Disembark from Aurora Cruise after delicious brunch and transfer back to Hanoi in your private vehicle',
        'Meet your dedicated local English-speaking guide upon arrival in Hanoi',
        'Visit the sacred Temple of Literature (Van Mieu), Vietnam’s first royal university dating back to 1070',
        'Stroll around scenic Hoan Kiem Lake and cross the scarlet bridge to Ngoc Son Temple',
        'Experience an authentic 30-minute traditional Cyclo Tour weaving through the bustling 36 Guild Streets of Hanoi Old Quarter',
        'Check-in at FTE Hotel Hanoi (Superior Room) and enjoy the evening at leisure exploring street cafés and night markets'
      ],
      sections: [
        {
          title: 'Hanoi Highlights Included:',
          items: [
            'Temple of Literature, Hoan Kiem Lake & Ngoc Son Temple entry tickets.',
            'Authentic 30-Minute Cyclo Tour through Hanoi Old Quarter.',
            'Private comfortable 7-seater transfer & dedicated English-speaking tour guide.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Ha Noi',
      image: '/images/vietnam.png',
      meals: 'Brunch (B)'
    },
    {
      day: 3,
      date: '27 Nov',
      title: 'Day 3 | 27 Nov Full-Day Ninh Binh Tour (Hoa Lu, Tam Coc Caves & Mua Cave) → Overnight Train to Sapa',
      route: 'Ha Noi ↔ Ninh Binh (Hoa Lu, Tam Coc, Mua Cave) → Sapa Sleeper Train',
      durationNote: 'Full Day Tour (SIC Tour + Overnight Train)',
      intro: 'Explore the "Ha Long Bay on Land" in Ninh Binh with ancient royal temples, scenic rural cycling, Tam Coc boat ride, and Mua Cave viewpoint before boarding the overnight train to Sapa.',
      timeline: [
        'Breakfast at FTE Hotel Hanoi; check out and leave luggage safely with hotel reception',
        '07:00 – 07:45 AM: Guide meets you for the 110km scenic journey through lush countryside to Ninh Binh',
        '10:30 AM: Visit Hoa Lu Ancient Royal Citadel with historic Dinh King Temple and Le King Temple',
        '11:30 AM: Leisure cycling on rural country roads alongside scenic canals and limestone mountain backdrops',
        '12:00 PM: Enjoy a delicious buffet lunch at a local restaurant featuring authentic regional dishes',
        '13:30 PM: Board a traditional sampan rowboat to cruise Tam Coc ("Three Caves" 1.5-hr ride) through karst caves and emerald rice paddies',
        '15:30 PM: Arrive at Mua Cave and hike up Ngoa Long Mountain (Dragon Peak) for breathtaking panoramic views of the entire valley',
        '16:30 PM: Board bus and return to Hanoi (drop-off around 18:30 PM); collect luggage and relax at hotel lobby / café',
        'Late evening: Private driver transfer to Hanoi Railway Station to board the AC Overnight Sleeper Train to Lao Cai / Sapa'
      ],
      sections: [
        {
          title: 'Ninh Binh Inclusions & Note:',
          note: 'Hotel room in Hanoi is not included for this night as you will be sleeping aboard the overnight AC sleeper train to Sapa.',
          items: [
            'Hoa Lu Ancient Citadel, Tam Coc 1.5-Hr Sampan Rowboat ride & Mua Cave Dragon Peak entry.',
            'Rural village cycling experience & authentic Vietnamese buffet lunch.',
            'Hanoi to Sapa Overnight AC Sleeper Train Ticket.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'On Overnight Sleeper Train (Hanoi → Lao Cai / Sapa)',
      image: '/images/vietnam-wonders.png',
      meals: 'Breakfast (B) & Local Buffet Lunch'
    },
    {
      day: 4,
      date: '28 Nov',
      title: 'Day 4 | 28 Nov Sapa Arrival → Rong May Glass Bridge, Swing Sapa, Alpine Coaster & Cat Cat Village',
      route: 'Lao Cai Station → Sapa Town → Glass Bridge & Cat Cat',
      durationNote: 'Full Day Tour (Driver + Guide)',
      intro: 'Arrive early morning in misty Sapa, marvel at thrilling glass bridge views and alpine coasters made for couples, and immerse in ethnic Black H’mong culture at Cat Cat Village.',
      timeline: [
        'Early morning arrival at Lao Cai Railway Station; private chauffeur meets you and drives up the mountain pass to Sapa',
        'Arrive at De Sapa Hotel to freshen up and leave luggage (early check-in subject to room readiness)',
        'Meet your local guide and head to Rong May Sapa Glass Bridge suspended high above the misty mountain pass',
        'Experience the thrilling Swing Sapa with Rainbow Slide and Ban Mong Alpine Coaster ride',
        'Continue to picturesque Cat Cat Village, a traditional Black H’mong settlement with cascading streams, wooden houses, and waterwheels',
        'Check in to De Sapa Hotel (Premier Deluxe Room) and enjoy an evening at leisure sampling hot pot and strolling through misty Sapa town'
      ],
      sections: [
        {
          title: 'Sapa Adventure Inclusions:',
          items: [
            'Rong May Sapa Glass Bridge & Ban Mong Alpine Coaster experience.',
            'Swing Sapa photo experience with Rainbow Slide.',
            'Cat Cat Village cultural entry and guided ethnic walking tour.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Sapa',
      image: '/images/vietnam-sapa.png',
      meals: 'Breakfast on own / In-town'
    },
    {
      day: 5,
      date: '29 Nov',
      title: 'Day 5 | 29 Nov Fansipan Legend Peak ("Roof of Indochina") & Sapa City Tour',
      route: 'Sapa Town ↔ Fansipan Legend Summit (3,143m)',
      durationNote: 'Peak Excursion (Driver + Guide)',
      intro: 'Ascend to the highest peak in Indochina via mountain funicular and world-record cable car, touch the summit milestone, and explore Sapa’s cultural landmarks.',
      timeline: [
        'Breakfast at De Sapa Hotel',
        'Board the scenic 2-Way Muong Hoa Mountain Train through terraced flower valleys',
        'Glide across the clouds on the 2-Way Fansipan Legend High-Altitude Cable Car over Hoang Lien Son mountain range',
        'Take the 1-Way Summit Funicular Train to the top of Fansipan Peak (3,143m) above the sea of clouds',
        'Touch the iconic summit milestone and admire the monumental Grand Buddha statue on the sacred mountain',
        'In the afternoon, enjoy a Sapa City Tour including the iconic Gothic Stone Church and central cultural square',
        'Return to De Sapa Hotel for leisure and relaxation'
      ],
      sections: [
        {
          title: 'Fansipan Highlights Included:',
          items: [
            '2-Way Muong Hoa Funicular Mountain Train Ticket.',
            '2-Way Fansipan Legend Cable Car Ticket.',
            '1-Way Summit Funicular to the peak of Fansipan (3,143m).',
            'Sapa Stone Church & Central Square heritage tour.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Sapa',
      image: '/images/vietnam-highlights.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 6,
      date: '30 Nov',
      title: 'Day 6 | 30 Nov Sapa to Hanoi Airport by Sleeper Bus → Flight to Da Nang',
      route: 'Sapa → Hanoi Noi Bai Airport (Sleeper Bus) ✈ Flight to Da Nang',
      durationNote: 'Transfer Day (Sleeper Bus + Driver)',
      intro: 'Descend from the highlands on a comfortable sleeper bus to Hanoi Airport, and fly to the coastal city of Da Nang for beachfront relaxation.',
      timeline: [
        'Breakfast at De Sapa Hotel and leisurely morning packing',
        'Transfer to Sapa bus station and board comfortable AC Sleeper Bus back to Hanoi Noi Bai Airport',
        'Board domestic flight to Da Nang (recommended flight after 17:30 PM - flight ticket not included)',
        'Upon arrival at Da Nang Airport, private chauffeur warmly welcomes you and transfers to Canvas Hotel Da Nang',
        'Check-in to your Classic King Room and spend a romantic evening walking along My Khe Beach'
      ],
      sections: [
        {
          title: 'Highland to Coast Transfer:',
          items: [
            'Comfortable AC Sleeper Bus ticket from Sapa to Hanoi Airport.',
            'Private Da Nang Airport pickup and hotel transfer.',
            'Overnight at 4-Star Canvas Hotel Da Nang.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Da Nang',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 7,
      date: '01 Dec',
      title: 'Day 7 | 01 Dec Ba Na Hills Cable Car, Golden Bridge & Romantic French Village Overnight Stay',
      route: 'Da Nang → Ba Na Hills Mountain Resort',
      durationNote: 'Mountain Resort Stay (Driver)',
      intro: 'Journey up Ba Na Hills on a scenic cable car, walk hand-in-hand across the iconic Golden Bridge held by giant stone hands, and enjoy an enchanting overnight stay in the European French Village.',
      timeline: [
        'Breakfast at Canvas Hotel Da Nang and check-out',
        'Private driver transfer from Da Nang to Ba Na Hills station',
        'Take the world-renowned scenic cable car ride offering breathtaking waterfall and mountain views',
        'Walk across the world-famous Golden Bridge (Cau Vang) held by giant stone hands surrounded by clouds',
        'Stroll through the romantic cobblestone lanes and Gothic architecture of the French Village',
        'Enjoy exciting amusement rides, 4D/5D cinema, and games at Fantasy Park',
        'Check-in at Mercure Danang French Village Bana Hills (Standard Room) for a magical evening high above the clouds'
      ],
      sections: [
        {
          title: 'Ba Na Hills Inclusions:',
          items: [
            'Round-trip Ba Na Hills Cable Car Ticket & Fantasy Park amusement access.',
            'Golden Bridge (Cau Vang) giant hands walk.',
            'Overnight stay atop Ba Na Hills at Mercure French Village.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Ba Na Hills',
      image: '/images/vietnam-best.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 8,
      date: '02 Dec',
      title: 'Day 8 | 02 Dec Ba Na Hills → Cam Thanh Coconut Basket Boat → Hoi An Lantern Town & Lantern Boat Ride',
      route: 'Ba Na Hills → Cam Thanh → Hoi An Ancient Town → Da Nang',
      durationNote: 'Full Day Tour (Driver + Guide)',
      intro: 'Descend Ba Na Hills and journey to Cam Thanh Coconut Forest for a thrilling basket boat ride, followed by a walking tour through lantern-lit Hoi An Ancient Town and a lantern boat ride on the Hoai River.',
      timeline: [
        'Breakfast at Mercure French Village Bana Hills and leisure morning photography',
        'Check-out, descend by cable car, and meet your private guide and chauffeur',
        'Head to Cam Thanh Coconut Forest for a fun bamboo basket boat ride with traditional spinning',
        'Arrive in UNESCO World Heritage Hoi An Ancient Town for a guided walking tour through historic lantern-lit streets, Japanese Covered Bridge, and ancient Chinese assembly halls',
        'Board a wooden boat for a romantic candle-lit lantern boat ride on the Hoai River, releasing floating paper lanterns for good fortune',
        'Evening transfer back to Da Nang; check in at Canvas Hotel and enjoy the rest of the evening at leisure'
      ],
      sections: [
        {
          title: 'Hoi An Highlights Included:',
          items: [
            'Cam Thanh Coconut Forest bamboo basket boat adventure.',
            'Hoi An Ancient Town UNESCO World Heritage walking tour ticket.',
            'Romantic Hoai River lantern boat ride with floating paper lanterns.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Da Nang',
      image: '/images/vietnam-mesmerising.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 9,
      date: '03 Dec',
      title: 'Day 9 | 03 Dec Flight to Tropical Phu Quoc Island & Sunset Beachfront Relaxation',
      route: 'Da Nang Airport ✈ Flight to Phu Quoc Island',
      durationNote: 'Flight & Island Transfer (Driver)',
      intro: 'Fly to Vietnam’s premier tropical island, Phu Quoc, check-in to your beachfront resort, and unwind with white sands, swaying palms, and golden sunsets.',
      timeline: [
        'Breakfast at Canvas Hotel Da Nang and check-out',
        'Private driver transfer to Da Nang Airport for your flight to Phu Quoc Island (flight ticket not included)',
        'Warm airport greeting by your private driver upon landing in Phu Quoc',
        'Transfer to Tahiti Beach Hotel and check in to your Deluxe Partial Sea View Room',
        'Spend a romantic afternoon swimming in crystal-clear waters or enjoying tropical cocktails by the beach',
        'Evening at leisure to explore the vibrant Phu Quoc Night Market with fresh grilled seafood'
      ],
      sections: [
        {
          title: 'Tropical Island Gateway:',
          items: [
            'Private Da Nang Airport departure transfer & Phu Quoc Airport arrival transfer.',
            'Deluxe Partial Sea View Room at Tahiti Beach Hotel.',
            'Sunset beachfront relaxation & night market exploration.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Phu Quoc Island',
      image: '/images/vietnam-exotic.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 10,
      date: '04 Dec',
      title: 'Day 10 | 04 Dec VinWonders Theme Park & Grand World ("The Sleepless City") Phu Quoc',
      route: 'Phu Quoc Resort ↔ VinWonders & Grand World',
      durationNote: 'Full Day Theme Park Excursion (Driver)',
      intro: 'Enjoy an exhilarating day of world-class rides, giant waterpark slides, and Neptune Aquarium at VinWonders, followed by colorful evening strolls in Grand World.',
      timeline: [
        'Breakfast at Tahiti Beach Hotel',
        'Set out for a full day of excitement at VinWonders Phu Quoc, the island’s largest world-class theme park',
        'Explore 6 themed zones: Typhoon World waterpark, Adventure World rollercoasters, European Avenue, and Giant Turtle Sea Shell Aquarium',
        'In the afternoon/evening, continue to Grand World ("The Sleepless City"), the vibrant entertainment and cultural complex with European canals and colorful architecture',
        '(Note: Tinh Hoa Show, Venice boat trip, and Teddy Bear Museum are optional on own)',
        'Return to Tahiti Beach Hotel for a restful overnight stay'
      ],
      sections: [
        {
          title: 'Phu Quoc Theme Park Inclusions:',
          items: [
            'VinWonders Phu Quoc Full-Day All-Access Entry Ticket.',
            'Grand World European complex visit & entertainment.',
            'Private comfortable vehicle transfer with dedicated chauffeur.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Phu Quoc Island',
      image: '/images/vietnam-dreamy.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 11,
      date: '05 Dec',
      title: 'Day 11 | 05 Dec Vinpearl Safari Adventure & Airport Departure Flight',
      route: 'Phu Quoc Island → Vinpearl Safari → Airport Departure',
      durationNote: 'Safari & Airport Departure (Driver)',
      intro: 'Experience Vietnam’s premier semi-wildlife open safari park with over 150 species from around the world, before transferring to the airport for your flight home.',
      timeline: [
        'Breakfast at Tahiti Beach Hotel and check-out (luggage stored securely in vehicle)',
        'Embark on an adventure at Vinpearl Safari, Vietnam’s largest semi-wildlife conservation park',
        'Board a specialized safari tram through open habitats where lions, giraffes, rhinos, zebras, and tigers roam freely',
        'Watch the live animal conservation presentation and take memorable photos with exotic birds and animals',
        'Afternoon transfer to Phu Quoc / Hanoi Noi Bai Airport for your flight back home (recommended flight after 17:30 PM)',
        'Board your flight home carrying unforgettable honeymoon memories of Vietnam!'
      ],
      sections: [
        {
          title: 'Safari & Departure Inclusions:',
          items: [
            'Vinpearl Safari Open Conservation Park Entry & Tram Tour Ticket.',
            'Private chauffeur transfer from safari to airport.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Departure',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    }
  ],
  inclusions: [
    'Transfer on private comfortable 07-seater AC car/van throughout the tour',
    'Transfer from Ha Noi to Sapa by overnight AC sleeper train',
    'Transfer from Sapa to Ha Noi Airport by comfortable AC sleeper bus',
    'Daily breakfast at the hotel (except Day 1)',
    '2D1N Ha Long Bay 5-Star Luxury Overnight Cruise (Aurora Cruise - Executive Cabin) with full board meals (Lunch, Gourmet Dinner, Brunch)',
    'Ha Noi City Tour (Temple of Literature, Hoan Kiem Lake, Ngoc Son Temple)',
    '30-Minute Traditional Cyclo Tour in Hanoi Old Quarter',
    'Ninh Binh Full Day SIC Tour (Hoa Lu Ancient Citadel, Tam Coc 1.5-Hr Boat Ride, Mua Cave Dragon Peak & Buffet Lunch)',
    'Rong May Sapa Glass Bridge Experience',
    'Swing Sapa with Rainbow Slide',
    'Ban Mong Alpine Coaster',
    'Fansipan Legend Peak including 2-Way Muong Hoa Train, 2-Way Cable Car & 1-Way Summit Funicular to the top of Fansipan (3,143m)',
    'Sapa City Tour (Gothic Stone Church & Central Square)',
    'Ba Na Hills Cable Car Ticket & Fantasy Park Admission',
    'Overnight stay atop Ba Na Hills at Mercure Danang French Village',
    'Cam Thanh Coconut Forest traditional bamboo basket boat ride',
    'Hoi An Ancient Town UNESCO World Heritage guided walking tour',
    'Romantic Hoai River candle-lit lantern boat ride',
    'VinWonders Phu Quoc Full-Day Theme Park Ticket',
    'Vinpearl Safari Phu Quoc Semi-Wildlife Park Ticket',
    'Professional English-speaking tour guides as mentioned in the itinerary',
    'Complimentary drinking water on tour (2 bottles/pax/day)',
    'All government taxes & service charges'
  ],
  exclusions: [
    'All Flight tickets (International flights & Domestic flights: Hanoi → Da Nang, Da Nang → Phu Quoc) and meals NOT mentioned in the itinerary',
    'Compulsory tipping for driver and guide: 5 USD / 1 PAX / 1 DAY WITH TOUR GUIDE',
    'Lunches and Dinners (except where mentioned on cruise and Ninh Binh tour)',
    'Dinner with transfer',
    'Vietnam E-Visa fees',
    'Personal expenses, laundry, telephone calls, mini-bar, alcoholic drinks',
    'Optional shows & attractions (Tinh Hoa Show, Venice boat trip, Teddy Bear Museum in Grand World)',
    'Any other items or services not mentioned in the inclusions'
  ],
  thingsToCarry: [
    'Passports with at least 6 months validity & printed Vietnam E-Visas',
    'Light Summer Clothes for Phu Quoc, Da Nang & Hoi An',
    'Warm Jacket / Fleece Layer for Sapa & Fansipan Peak (3,143m)',
    'Swimwear & Beach Towel for Ha Long Bay Cruise & Phu Quoc',
    'Comfortable Walking Shoes / Sneakers for trekking and temples',
    'Sunscreen (SPF 50+), Sunglasses & Sun Hat',
    'Personal First Aid & Travel Medicines',
    'Power Bank, Universal Travel Adapter & Phone Chargers',
    'Vietnam Dong (VND) / USD & Forex Cards'
  ]
};

export const vietnamNaushadManualItinerary: ManualItinerary = {
  id: 'vietnam-naushad',
  slug: 'vietnam-danang-phuquoc-luxury-family-holiday',
  title: 'Grand Vietnam, Ba Na Hills & Tropical Phu Quoc Luxury Family Holiday',
  subtitle: '4-Star Luxury Private Family Vacation • Da Nang, Ba Na Hills & Phu Quoc Island',
  duration: '8 Nights / 9 Days | 2 Adults + 2 Kids',
  numNights: 8,
  numDays: 9,
  dates: 'Custom Family Dates | 8N / 9D',
  route: 'Da Nang → Hoi An → Ba Na Hills → Phu Quoc Island',
  routeSummary: '2N Da Nang | 1N Ba Na Hills | 5N Phu Quoc Island',
  destination: 'Vietnam',
  travelStyle: '4-Star Luxury Private Family Tour',
  tripType: 'Customised Private Family Tour (2 Adults + 2 Kids)',
  leadName: 'Naushad Chaudhary',
  adults: 2,
  kids: 2,
  kidsDetails: '1 Child (5 Yrs) + 1 Infant/Toddler (2.5 Yrs)',
  perAdultPrice: 105459,
  perKidPrice: 34459,
  childPricingNote: '5 Yrs Child: ₹34,459/- (Without Extra Bed) • 2.5 Yrs Child: FREE',
  baseAmount: 245377,
  gstPercentage: 5,
  gstAmount: 12269,
  tcsPercentage: 2,
  tcsAmount: 4908,
  finalQuotationAmount: 262554,
  vehicleType: 'Private Comfortable AC Van with Dedicated Chauffeur & English-Speaking Tour Guide',
  mealPlan: 'Daily Breakfast at Hotels (except Day 1)',
  heroImage: '/images/vietnam.png',
  galleryImages: [
    '/images/vietnam.png',
    '/images/vietnam-wonders.png',
    '/images/vietnam-highlights.png',
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png',
    '/images/vietnam-mesmerising.png',
    '/images/vietnam-exotic.png',
    '/images/vietnam-dreamy.png'
  ],
  accommodations: [
    { city: 'Da Nang', nights: 2, hotelName: 'PHUC LONG HOTEL (4-Star)', roomCategory: 'Premier Deluxe Oceanview Balcony Double' },
    { city: 'Ba Na Hills', nights: 1, hotelName: 'Mercure Danang French Village Bana Hills (4-Star Superior)', roomCategory: 'Standard Room' },
    { city: 'Phu Quoc', nights: 5, hotelName: 'VinHolidays Fiesta Phu Quoc (4-Star Resort)', roomCategory: 'Standard Twin Joining Bed' }
  ],
  dayPlans: [
    {
      day: 1,
      title: 'Day 1 | Da Nang Arrival & Coastal Welcome',
      route: 'Da Nang Airport → Hotel Check-in',
      durationNote: 'Arrival Day (Private Chauffeur)',
      intro: 'Welcome to Vietnam! Arrive at Da Nang International Airport where your private chauffeur warmly welcomes your family and transfers you to Phuc Long Hotel overlooking the ocean.',
      timeline: [
        'Warm airport greeting by your private driver upon arrival at Da Nang Airport',
        'Private comfortable transfer to Phuc Long Hotel along My Khe beachfront',
        'Check-in to your Premier Deluxe Oceanview Balcony Double Room (early check-in not included)',
        'Rest, refresh, and unwind after your flight',
        'Evening at leisure to stroll along the white sand beach, view the illuminated Dragon Bridge, or explore the local night market'
      ],
      sections: [
        {
          title: 'Arrival Highlights:',
          items: [
            'Private comfortable AC Van airport transfer.',
            'Premier Deluxe Oceanview Balcony Room at Phuc Long Hotel.',
            'Relaxing first evening in coastal Da Nang.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Da Nang (Phuc Long Hotel)',
      image: '/images/vietnam.png',
      meals: 'On own / In-flight'
    },
    {
      day: 2,
      title: 'Day 2 | Lady Buddha, Coconut Forest Basket Boat, Hoi An Lantern Making Workshop & Hoai River Lantern Boat Ride',
      route: 'Da Nang → Son Tra Peninsula → Cam Thanh Coconut Forest → Hoi An Ancient Town → Da Nang',
      durationNote: 'Full Day Guided Tour (Driver + Guide)',
      intro: 'Embark on an unforgettable cultural and family adventure exploring Son Tra Peninsula, traditional coconut basket boats, hands-on lantern making, and Hoi An’s magical lantern river cruise.',
      timeline: [
        'Delicious breakfast at Phuc Long Hotel',
        'Visit the serene Linh Ung Pagoda on Son Tra Peninsula, featuring the majestic 67-meter Lady Buddha statue overlooking the East Sea',
        'Journey to Cam Thanh Coconut Forest and board traditional bamboo basket boats with fun spinning performances amidst lush waterways',
        'Transfer to UNESCO World Heritage Hoi An Ancient Town for a guided walking tour through lantern-lit lanes, the 400-year-old Japanese Covered Bridge, and Chinese assembly halls',
        'Join a special family-friendly Lantern Making Workshop — design and craft your own authentic silk lantern to take home as a meaningful handmade souvenir',
        'Board a wooden boat on the Hoai River for a magical evening lantern cruise, lighting and releasing floating paper lanterns for good luck',
        'In the evening, return to Da Nang and enjoy the rest of the night at leisure'
      ],
      sections: [
        {
          title: 'Hoi An & Coconut Forest Inclusions:',
          items: [
            'Linh Ung Pagoda & Lady Buddha Son Tra exploration.',
            'Cam Thanh Coconut Forest bamboo basket boat adventure with fun boat spinning.',
            'Hoi An UNESCO Ancient Town guided walking tour & entrance ticket.',
            'Hands-on Traditional Lantern Making Workshop with customized handmade lantern souvenir.',
            'Romantic candle-lit Hoai River lantern boat ride with floating wishing lanterns.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Da Nang (Phuc Long Hotel)',
      image: '/images/vietnam-highlights.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 3,
      title: 'Day 3 | Ba Na Hills Cable Car, Giant Hands Golden Bridge, Fantasy Park & Overnight in French Village',
      route: 'Da Nang → Ba Na Hills Mountain Resort',
      durationNote: 'Mountain Resort Stay (Private Driver)',
      intro: 'Following breakfast, ascend to the fairytale mountaintop of Ba Na Hills via a scenic cable car, walk across the world-famous Golden Bridge, enjoy thrilling family rides at Fantasy Park, and experience an overnight stay in the European French Village.',
      timeline: [
        'Breakfast at Phuc Long Hotel and check-out',
        'Private transfer to Ba Na Hills station',
        'Take the world-record scenic cable car offering panoramic mountain vistas and cascading waterfalls',
        'Walk across the iconic Golden Bridge (Cau Vang) held aloft by giant stone hands emerging from the mountain clouds',
        'Explore the charming French Village featuring Gothic castles, cobblestone plazas, and Le Jardin D’Amour flower gardens',
        'Enjoy unlimited family entertainment and games at Fantasy Park (indoor amusement park with rides and 4D/5D cinema)',
        'Check in at Mercure Danang French Village Bana Hills (Standard Room)',
        'Experience the magical, quiet European atmosphere atop the mountain after daytime visitors depart'
      ],
      sections: [
        {
          title: 'Ba Na Hills Highlights:',
          items: [
            '2-Way Ba Na Hills Cable Car tickets.',
            'Golden Bridge (Cau Vang) giant hands walk.',
            'Fantasy Park amusement park admission & rides (no lunch).',
            'Overnight mountaintop stay at Mercure Danang French Village Bana Hills.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Ba Na Hills (Mercure Danang French Village)',
      image: '/images/vietnam-best.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 4,
      title: 'Day 4 | Ba Na Hills Morning Leisure → Flight to Tropical Phu Quoc Island',
      route: 'Ba Na Hills → Da Nang Airport ✈ Flight to Phu Quoc Island',
      durationNote: 'Transfer & Domestic Flight (Private Driver)',
      intro: 'Savor a leisurely morning amidst the mountain clouds before descending by cable car and flying to Vietnam’s premier tropical island, Phu Quoc, for beachfront resort relaxation.',
      timeline: [
        'Buffet breakfast at Mercure French Village and leisure morning for photos above the clouds',
        'Check-out, descend by cable car, and meet your private chauffeur',
        'Transfer to Da Nang International Airport for your afternoon flight to Phu Quoc (recommended flight after 12:00 PM; flight ticket not included)',
        'Warm airport welcome by your private driver upon landing at Phu Quoc Airport',
        'Transfer to VinHolidays Fiesta Phu Quoc and check-in to your Standard Twin Joining Bed Room (early check-in not included)',
        'Unwind by the resort’s massive 800m² outdoor swimming pool or explore the surrounding tropical grounds'
      ],
      sections: [
        {
          title: 'Island Transfer & Resort:',
          items: [
            'Private Da Nang airport departure transfer & Phu Quoc airport arrival transfer.',
            '5-Night stay at 4-Star VinHolidays Fiesta Phu Quoc.',
            'Complimentary resort pool and amenities access.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Phu Quoc (VinHolidays Fiesta Phu Quoc)',
      image: '/images/vietnam-wonders.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 5,
      title: 'Day 5 | Hon Thom Longest Over-Sea Cable Car, Aquatopia Water Park, Kiss Bridge & Kiss of the Sea Fireworks Show',
      route: 'Resort → Hon Thom Island → Sunset Town',
      durationNote: 'Full Day Island & Show Tour (Private Driver)',
      intro: 'Ride the world’s longest over-sea cable car to Hon Thom Island, enjoy a day of water park family fun, stroll Sunset Town & Kiss Bridge, and watch the spectacular "Kiss of the Sea" multimedia fireworks show.',
      timeline: [
        'Breakfast at VinHolidays Fiesta Phu Quoc',
        'Board the Hon Thom Cable Car — the longest over-sea 3-wire cable car in the world (7,899.9m) with 360° turquoise sea vistas',
        'Have a blast at Aquatopia Water Park on Hon Thom Island with over 20 modern water slides, family lagoons, and kid-friendly splash zones',
        'Return to the main island and explore Mediterranean-inspired Sunset Town with colorful seaside facades',
        'Walk onto the architectural wonder Kiss Bridge (Cau Hon) with panoramic sunset views across the sea',
        'In the evening, witness the breathtaking "Kiss of the Sea" multimedia show combining water screens, lasers, music, and an extraordinary grand fireworks pyrotechnic display',
        'Private transfer back to the hotel for a restful night'
      ],
      sections: [
        {
          title: 'Hon Thom & Fireworks Package:',
          items: [
            'Hon Thom 2-Way Over-Sea Cable Car Ticket.',
            'Aquatopia Water Park all-access admission.',
            'Kiss Bridge & Sunset Town promenade.',
            '"Kiss of the Sea" Multimedia Show Ticket with live fireworks.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Phu Quoc (VinHolidays Fiesta Phu Quoc)',
      image: '/images/vietnam-dreamy.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 6,
      title: 'Day 6 | Grand World ("The Sleepless City") Exploration & Venetian Gondola Canal Boat Ride',
      route: 'Resort ↔ Grand World Phu Quoc',
      durationNote: 'Leisure Day (Driver / Hotel Shuttle)',
      intro: 'Explore Grand World Phu Quoc, "The Sleepless City", filled with European-style canals, grand architecture, and cultural wonders, highlighted by a romantic Venetian Gondola boat ride.',
      timeline: [
        'Breakfast at VinHolidays Fiesta Phu Quoc',
        'Set out to explore the vibrant Grand World entertainment complex',
        'Admire the monumental Bamboo Legend structure crafted from over 42,000 bamboo poles',
        'Stroll through colorful European-style shopping streets and Urban Park',
        'Board an authentic Venetian Gondola for a relaxing boat ride along the grand canal',
        '(Note: Tinh Hoa Vietnam cultural live show and Teddy Bear Museum are optional on own)',
        'Afterwards, return to the hotel to relax and enjoy the resort pool'
      ],
      sections: [
        {
          title: 'Grand World Inclusions:',
          items: [
            'Grand World Phu Quoc complex exploration.',
            'Venetian Gondola Canal Boat Ride included.',
            'Flexible time for family relaxation and shopping.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Phu Quoc (VinHolidays Fiesta Phu Quoc)',
      image: '/images/vietnam-beauty.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 7,
      title: 'Day 7 | Full Day at VinWonders Phu Quoc Theme Park, Water Park & Giant Turtle Aquarium',
      route: 'Resort ↔ VinWonders Phu Quoc',
      durationNote: 'Full Day Theme Park Excursion (Private Driver / Shuttle)',
      intro: 'Dive into non-stop family adventure at VinWonders Phu Quoc, Southeast Asia’s largest theme park, featuring world-class rollercoasters, water park slides, live fairy-tale shows, and the Giant Turtle Aquarium.',
      timeline: [
        'Buffet breakfast at VinHolidays Fiesta Phu Quoc',
        'Full day of excitement at VinWonders Phu Quoc spanning 6 themed zones:',
        'European Avenue — charming Renaissance architecture and shopping',
        'Typhoon World — Southeast Asia’s largest water park with thrilling wave pools and family slides',
        'Adventure World — exhilarating rollercoasters and Mayan/Greek ancient worlds',
        'The Sea Shell — giant turtle-shaped ocean aquarium with thousands of exotic marine creatures',
        'Fantasy World & Mysterious Viking Village — magical fairy-tale quests and kid-friendly attractions',
        'Spectacular live performances and Once Show in the afternoon/evening',
        'Return to the hotel for a relaxed overnight stay'
      ],
      sections: [
        {
          title: 'VinWonders Inclusions:',
          items: [
            'VinWonders Phu Quoc Full-Day All-Access Pass for the entire family.',
            'Typhoon World waterpark, Adventure World rides & Giant Turtle Aquarium.',
            'Live street shows and interactive family entertainment.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Phu Quoc (VinHolidays Fiesta Phu Quoc)',
      image: '/images/vietnam-wonders.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 8,
      title: 'Day 8 | Full Day Adventure at Vinpearl Safari Open Conservation Park',
      route: 'Resort ↔ Vinpearl Safari Phu Quoc',
      durationNote: 'Full Day Wildlife Safari (Private Driver / Shuttle)',
      intro: 'Get up close with wild animals in open habitats at Vinpearl Safari, Vietnam’s premier semi-wild conservation park home to over 150 species from around the world.',
      timeline: [
        'Breakfast at VinHolidays Fiesta Phu Quoc',
        'Head to Vinpearl Safari — Vietnam’s first and largest open semi-wild conservation zoo',
        'Board a specialized safari vehicle through open habitats where Bengal tigers, African lions, white rhinos, giraffes, zebras, and antelopes roam freely',
        'Explore the Open Zoo area with flamingos, lemurs, elephants, and exotic tropical birds',
        'Visit the Kid Zoo where children can interact with and feed gentle farm animals',
        'Watch the live animal conservation presentation',
        'Return to the hotel in the afternoon to unwind, swim in the resort pool, and pack leisurely'
      ],
      sections: [
        {
          title: 'Vinpearl Safari Inclusions:',
          items: [
            'Vinpearl Safari Full Entry Ticket for the family.',
            'Specialized Safari vehicle guided open-habitat tour.',
            'Open Zoo walking tour and live animal conservation presentation.'
          ],
          type: 'signature'
        }
      ],
      stayLocation: 'Phu Quoc (VinHolidays Fiesta Phu Quoc)',
      image: '/images/vietnam-exotic.png',
      meals: 'Breakfast (B)'
    },
    {
      day: 9,
      title: 'Day 9 | Phu Quoc Leisure & Departure Flight',
      route: 'VinHolidays Fiesta → Phu Quoc International Airport',
      durationNote: 'Departure Transfer (Private Driver)',
      intro: 'Enjoy a leisurely final breakfast at the resort before checking out and transferring to Phu Quoc Airport for your return flight home carrying unforgettable family memories.',
      timeline: [
        'Breakfast at VinHolidays Fiesta Phu Quoc',
        'Leisure time for morning swimming, photography, or packing',
        'Check-out at the hotel (late check-out not included; luggage stored safely with driver)',
        'Private transfer to Phu Quoc International Airport for your departure flight',
        'Board your return flight home carrying cherishable family holiday memories of Vietnam!'
      ],
      sections: [
        {
          title: 'Departure Service:',
          items: [
            'Private chauffeur transfer from hotel to Phu Quoc Airport.',
            'Warm farewell from the Wanderphilia team.'
          ],
          type: 'normal'
        }
      ],
      stayLocation: 'Departure / Flight Home',
      image: '/images/vietnam.png',
      meals: 'Breakfast (B)',
      signOff: 'Until your next family adventure — Wanderphilia style.'
    }
  ],
  inclusions: [
    'Transfer on private comfortable AC Van throughout the tour',
    'Daily breakfast at the hotels (except Day 1)',
    'Linh Ung Pagoda & Lady Buddha on Son Tra Peninsula',
    'Coconut Forest traditional bamboo basket boat ride with boat spinning',
    'Hoi An Ancient Town UNESCO World Heritage guided walking tour & entrance ticket',
    'Hands-on Traditional Lantern Making Workshop in Hoi An (with custom handmade lantern souvenir)',
    'Candle-lit lantern boat ride on Hoai River',
    'Ba Na Hills round-trip Cable Car ticket & Fantasy Park admission (no lunch)',
    'Overnight mountaintop stay at Mercure Danang French Village Bana Hills',
    'Hon Thom 2-Way Over-Sea Cable Car ticket & Aquatopia Water Park admission',
    'Kiss Bridge and Sunset Town promenade',
    '"Kiss of the Sea" multimedia show ticket (Light, Sound, Lasers & Fireworks)',
    'Venice Gondola canal boat ride in Grand World Phu Quoc',
    'VinWonders Phu Quoc full-day all-access theme park & waterpark pass',
    'Vinpearl Safari open conservation park entry & specialized safari vehicle tour',
    'Professional English-speaking tour guide as mentioned (Day 2 in Hoi An)',
    'Complimentary drinking water on tour (2 bottles/pax/day)',
    'All government taxes & service charges'
  ],
  exclusions: [
    'All Flight tickets (International flights & Domestic flight: Da Nang → Phu Quoc) and meals NOT mentioned in the itinerary',
    'Compulsory tipping for driver and guide: 5 USD / 1 PAX / 1 DAY WITH TOUR GUIDE',
    'Lunch & Dinner (except where mentioned)',
    'Dinner with transfer',
    'Vietnam E-Visa fees',
    'Personal expenses, laundry, telephone calls, mini-bar, alcoholic drinks',
    'Optional shows & attractions (Tinh Hoa Show, Teddy Bear Museum in Grand World)',
    'Any other items or services not mentioned in the inclusions'
  ],
  thingsToCarry: [
    'Original Passports (min. 6 months validity) & Printed Vietnam E-Visas',
    'Lightweight Breathable Clothes for Phu Quoc, Da Nang & Hoi An',
    'Light Jacket / Cardigan for evening atop Ba Na Hills',
    'Swimwear, Beach Hats & Goggles for Aquatopia, VinWonders & Beach',
    'Comfortable Walking Shoes & Water Sandals / Crocs for basket boat & waterparks',
    'High-Protection Sunscreen (SPF 50+), Sunglasses & Baby Essentials',
    'Personal First Aid & Family/Child Travel Medicines',
    'Universal Travel Adapter & High-Capacity Power Bank',
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
  'wp-vietnam-aneesh': vietnamAneeshManualItinerary,
  'vietnam-yash': vietnamYashManualItinerary,
  'vietnam-honeymoon': vietnamYashManualItinerary,
  'vietnam-luxury-honeymoon': vietnamYashManualItinerary,
  'vietnam-luxury-honeymoon-expedition': vietnamYashManualItinerary,
  'vietnam-honeymoon-yash': vietnamYashManualItinerary,
  'mr-yash-vietnam': vietnamYashManualItinerary,
  'mr-yash-x2-vietnam-trip': vietnamYashManualItinerary,
  'mr-yash-x2-vietnam-honeymoon-trip': vietnamYashManualItinerary,
  'mr-yash-x2-vietnam-honeymoon-trip-8-days': vietnamYashManualItinerary,
  'vietnam-yash-honeymoon': vietnamYashManualItinerary,
  'wp-vietnam-yash': vietnamYashManualItinerary,
  'vietnam-naushad': vietnamNaushadManualItinerary,
  'vietnam-danang-phuquoc-luxury-family-holiday': vietnamNaushadManualItinerary,
  'vietnam-family-naushad': vietnamNaushadManualItinerary,
  'mr-naushad-chaudhary-vietnam': vietnamNaushadManualItinerary,
  'mr-naushad-chaudhary-x4-vietnam-trip': vietnamNaushadManualItinerary,
  'mr-naushad-vietnam': vietnamNaushadManualItinerary,
  'naushad-vietnam': vietnamNaushadManualItinerary,
  'vietnam-family-tour': vietnamNaushadManualItinerary,
  'wp-vietnam-naushad': vietnamNaushadManualItinerary
};

export function getManualItinerary(idOrSlug: string): ManualItinerary | null {
  if (!idOrSlug) return null;
  const key = idOrSlug.toLowerCase().trim();
  return manualItinerariesRegistry[key] || Object.values(manualItinerariesRegistry).find(
    it => it.id.toLowerCase() === key || it.slug.toLowerCase() === key
  ) || null;
}

export function getAllManualItineraries(): ManualItinerary[] {
  return [himachalExplorerManualItinerary, vietnamAneeshManualItinerary, vietnamYashManualItinerary, vietnamNaushadManualItinerary];
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
      startDate: manual.dates ? manual.dates.split('–')[0]?.trim() : '25 Oct 2026',
      endDate: manual.dates ? manual.dates.split('–')[1]?.trim() : '08 Nov 2026',
      guests: (manual.adults || 4) + (manual.kids || 0),
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
    adults: manual.adults || 4,
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
