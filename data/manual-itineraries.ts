import { ManualItinerary } from '@/types/manual-itinerary';
import { ItineraryDocument } from '@/types/itinerary';
import { getRouteTransitInfo } from '@/lib/ai-itinerary';

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

export const rajasthanRoyalEscapeManualItinerary: ManualItinerary = {
  id: 'rajasthan-royal-experience',
  slug: 'rajasthan-royal-experience',
  title: 'Royal Rajasthan Experience – 9 Nights / 10 Days',
  subtitle: 'Wanderphilia Exclusive | Family Trip',
  duration: '9 Nights / 10 Days | 30 October – 8 November 2026',
  numNights: 9,
  numDays: 10,
  dates: '30 October – 8 November 2026',
  route: 'Jaipur 2 Nights → Jaisalmer 1 Night → Jodhpur 2 Nights → Jawai 1 Night → Mount Abu 1 Night → Udaipur 2 Nights',
  routeSummary: '2N Jaipur | 1N Jaisalmer | 2N Jodhpur | 1N Jawai | 1N Mount Abu | 2N Udaipur',
  destination: 'Rajasthan',
  travelStyle: 'Family Trip',
  tripType: 'Customised Trip',
  leadName: 'Valued Traveler',
  vehicleType: 'Private AC Vehicle with Dedicated Tour Chauffeur',
  mealPlan: 'Breakfast & Dinner (MAP Plan) (Breakfast except Day 1 & Dinner on last day)',
  heroImage: '/images/Rajasthan/rajasthan1.jpeg',
  galleryImages: [
    '/images/Rajasthan/rajasthan1.jpeg',
    '/images/Rajasthan/rajasthan2.jpeg',
    '/images/Rajasthan/rajasthan3.jpeg',
    '/images/Rajasthan/rajasthan4.jpeg',
    '/images/Rajasthan/rajasthan5.jpg',
    '/images/Rajasthan/rajasthan6.jpg'
  ],
  accommodations: [
    { city: 'Jaipur', nights: 2, hotelName: 'Hotel Kalyan', roomCategory: 'Deluxe Room' },
    { city: 'Jaisalmer', nights: 1, hotelName: 'Lakhmana Dessert Camp', roomCategory: 'Luxury Swiss Desert Tent' },
    { city: 'Jodhpur', nights: 2, hotelName: 'Krishna Prakash Heritage Haveli', roomCategory: 'Heritage Deluxe Room' },
    { city: 'Jawai', nights: 1, hotelName: 'Thar Resort', roomCategory: 'Deluxe Safari Resort' },
    { city: 'Mount Abu', nights: 1, hotelName: 'Hotel Rock Regency', roomCategory: 'Deluxe Room' },
    { city: 'Udaipur', nights: 2, hotelName: 'Mewar haveli', roomCategory: 'Heritage Lake View Room' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '30 Oct',
      title: 'DAY 1 | Friday, 30th October – Arrival in Jaipur | Kisan Bagh & Nahargarh Sunset Dining',
      route: 'Jaipur Arrival',
      intro: 'Arrive in Jaipur and meet your private driver. Proceed towards the city and begin your Rajasthan journey.\n\nVisit Kisan Bagh, a beautifully landscaped destination showcasing Rajasthan’s natural beauty, traditional landscape and serene surroundings.\n\nLater, proceed towards Nahargarh Fort, located on the Aravalli Hills and offering spectacular panoramic views of Jaipur.\n\nAs the sun sets, enjoy a memorable sunset experience overlooking the Pink City, followed by a special dining experience at RTDC Durg Cafeteria at Nahargarh Fort.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      timeline: [
        'Arrival in Jaipur & Private Chauffeur Meet',
        'Kisan Bagh Landscape & Traditional Nature Walk',
        'Nahargarh Fort Panoramic Viewpoint atop Aravalli Hills',
        'Pink City Sunset Experience',
        'Sunset Dining at RTDC Durg Cafeteria'
      ],
      stayLocation: 'Hotel Kalyan, Jaipur',
      image: '/images/Rajasthan/rajasthan1.jpeg',
      meals: 'Dinner Only'
    },
    {
      day: 2,
      date: '31 Oct',
      title: 'DAY 2 | Saturday, 31st October – Jaipur Heritage Tour | Hawa Mahal, City Palace, Amber Fort & Maota Lake Experience',
      route: 'Jaipur Heritage & Amber Fort',
      intro: 'After breakfast, proceed for a full-day sightseeing tour of Jaipur, exploring the city’s rich royal heritage and architectural landmarks.\n\nBegin with a visit to Hawa Mahal, one of Jaipur’s most iconic landmarks, known for its distinctive honeycomb-style façade.\n\nContinue to City Palace, a magnificent royal complex showcasing Jaipur’s royal history, architecture and cultural heritage.\n\nLater, proceed towards Amber Fort, one of Rajasthan’s most impressive hill forts, known for its grand courtyards, palaces and beautiful artistic architecture.\n\nEnjoy a unique experience at Maota Lake with a luxury boat ride accompanied by a traditional Rajasthani folk dance experience.\n\nIn the evening, visit The Stag Rooftop Restaurant for a special dining experience overlooking Amber Fort, followed by a Sound & Light Show.\n\nLater, return to the hotel and relax.',
      timeline: [
        'Hawa Mahal Honeycomb Façade',
        'City Palace Royal Heritage Complex',
        'Amber Fort Grand Courtyards & Palaces',
        'Maota Lake Luxury Boat Ride',
        'Traditional Rajasthani Folk Dance Performance',
        'Special Dining at The Stag Rooftop Restaurant',
        'Sound & Light Show overlooking Amber Fort'
      ],
      stayLocation: 'Hotel Kalyan, Jaipur',
      image: '/images/Rajasthan/rajasthan2.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      date: '01 Nov',
      title: 'DAY 3 | Sunday, 1st November – Jaipur → Jaisalmer | Thar Desert Camp, Camel Safari & Cultural Evening',
      route: 'Jaipur → Jaisalmer',
      intro: 'After breakfast, check out from the hotel and proceed towards Jaisalmer, travelling through the scenic landscapes of Rajasthan and the Thar Desert.\n\nOn arrival in Jaisalmer, proceed towards Sam Sand Dunes and check in to your desert camp.\n\nIn the evening, enjoy a memorable camel safari across the golden sand dunes and experience the spectacular sunset over the Thar Desert.\n\nLater, enjoy a traditional Rajasthani cultural evening featuring folk music and dance performances.\n\nExperience the authentic desert atmosphere with traditional Rajasthani dinner and cultural entertainment under the desert sky.',
      timeline: [
        'Scenic Drive towards Jaisalmer & Thar Desert',
        'Sam Sand Dunes & Desert Camp Check-in',
        'Camel Safari across Golden Sand Dunes',
        'Spectacular Sunset over Thar Desert',
        'Rajasthani Folk Music & Dance Performance',
        'Traditional Rajasthani Dinner under Desert Sky'
      ],
      stayLocation: 'Lakhmana Dessert Camp, Jaisalmer',
      image: '/images/Rajasthan/rajasthan3.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      date: '02 Nov',
      title: 'DAY 4 | Monday, 2nd November – Jaisalmer Heritage Tour → Jodhpur | Golden Fort, Havelis, Bada Bagh & Gadisar Lake',
      route: 'Jaisalmer → Jodhpur',
      intro: 'After breakfast, check out from the desert camp and proceed towards Jaisalmer city.\n\nBegin your sightseeing with a visit to the magnificent Jaisalmer Fort, also known as the Golden Fort, rising dramatically from the golden desert landscape.\n\nContinue to Patwon Ki Haveli, one of Jaisalmer’s finest examples of traditional Rajasthani architecture and craftsmanship.\n\nLater, visit Bada Bagh, famous for its impressive royal cenotaphs set against the desert landscape.\n\nProceed towards Gadisar Lake, a historic water reservoir surrounded by temples, shrines and traditional architecture.\n\nAfter completing the sightseeing, proceed towards Jodhpur, the famous Blue City of Rajasthan.\n\nOn arrival, check in to your hotel and relax after the journey.',
      timeline: [
        'Jaisalmer Fort (Golden Fort) Exploration',
        'Patwon Ki Haveli Architecture & Craftsmanship',
        'Bada Bagh Royal Cenotaphs',
        'Gadisar Lake Historic Reservoirs & Temples',
        'Transfer: Jaisalmer → Jodhpur (Blue City)',
        'Check-in & Relaxation in Jodhpur'
      ],
      stayLocation: 'Krishna Prakash Heritage Haveli, Jodhpur',
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      date: '03 Nov',
      title: 'DAY 5 | Tuesday, 3rd November – Jodhpur Heritage Tour | Mehrangarh Fort, Blue City & Panchatiya Hills Sunset',
      route: 'Jodhpur Sightseeing',
      intro: 'After breakfast, proceed for a full-day sightseeing tour of Jodhpur, exploring the city’s rich royal heritage and famous Blue City landscapes.\n\nVisit the magnificent Mehrangarh Fort & Museum, one of Rajasthan’s most iconic forts, offering spectacular views of the historic Blue City.\n\nContinue with a Blue City Tour, exploring the traditional blue-painted houses, narrow lanes and historic neighbourhoods of Jodhpur.\n\nLater, proceed towards Panchatiya Hills for a beautiful sunset experience overlooking the Blue City.\n\nEnjoy the evening atmosphere and panoramic views before returning to the hotel.',
      timeline: [
        'Mehrangarh Fort & Royal Museum',
        'Historic Blue City Walking Tour',
        'Traditional Blue-Painted Lanes of Jodhpur',
        'Panchatiya Hills Viewpoint',
        'Panoramic Sunset over Blue City'
      ],
      stayLocation: 'Krishna Prakash Heritage Haveli, Jodhpur',
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      date: '04 Nov',
      title: 'DAY 6 | Wednesday, 4th November – Jodhpur → Jawai | Umaid Bhawan Palace, Jaswant Thada & Wildlife Safari',
      route: 'Jodhpur → Jawai',
      intro: 'After breakfast, proceed for a visit to Umaid Bhawan Palace, one of India’s grandest palace residences and an important symbol of Jodhpur’s royal heritage.\n\nContinue to Jaswant Thada, an elegant white-marble memorial surrounded by peaceful gardens and scenic surroundings.\n\nLater, check out from the hotel and proceed towards Jawai.\n\nOn arrival, check in to your Jawai accommodation and relax.\n\nIn the evening, embark on an exciting Jawai Wildlife Safari, exploring the unique granite landscape and natural habitat of the famous Jawai leopards.\n\nEnjoy a spectacular sunset wildlife experience amidst the Jawai hills before returning to the accommodation.',
      timeline: [
        'Umaid Bhawan Palace Royal Residence',
        'Jaswant Thada White-Marble Memorial',
        'Transfer: Jodhpur → Jawai Granite Region',
        'Check-in & Relaxation at Thar Resort',
        '4x4 Open Gypsy Jawai Leopard Safari',
        'Spectacular Sunset Safari in Granite Hills'
      ],
      stayLocation: 'Thar Resort, Jawai',
      image: '/images/Rajasthan/rajasthan7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      date: '05 Nov',
      title: 'DAY 7 | Thursday, 5th November – Jawai → Mount Abu | Dilwara Temples, Market & Nakki Lake Sunset',
      route: 'Jawai → Mount Abu',
      intro: 'After breakfast, check out from your Jawai accommodation and proceed towards Mount Abu, Rajasthan’s only hill station.\n\nOn arrival, check in to the hotel and relax.\n\nLater, visit the magnificent Dilwara Temples, renowned for their intricate marble carvings and extraordinary craftsmanship.\n\nExplore Mount Abu Market and enjoy some leisure time exploring the local surroundings.\n\nIn the evening, proceed towards Nakki Lake for a relaxing boat ride and beautiful sunset experience.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      timeline: [
        'Drive: Jawai → Mount Abu Hill Station',
        'Check-in at Hotel Rock Regency',
        'Dilwara Temples Exquisite Marble Carvings',
        'Mount Abu Market Leisure Stroll',
        'Nakki Lake Relaxing Sunset Boat Ride'
      ],
      stayLocation: 'Hotel Rock Regency, Mount Abu',
      image: '/images/Rajasthan/rajasthan7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      date: '06 Nov',
      title: 'DAY 8 | Friday, 6th November – Mount Abu → Kumbhalgarh → Udaipur | Fort & Lake Pichola Experience',
      route: 'Mount Abu → Kumbhalgarh → Udaipur',
      intro: 'After breakfast, check out from the hotel and proceed towards Udaipur.\n\nEn route, visit the magnificent Kumbhalgarh Fort, famous for its massive fortifications, historic architecture and spectacular Aravalli surroundings.\n\nContinue the journey towards Udaipur, the beautiful City of Lakes.\n\nOn arrival, check in to your hotel and relax.\n\nIn the evening, enjoy a memorable Lake Pichola Boat Ride, surrounded by Udaipur’s beautiful palaces, historic ghats and scenic lake views.\n\nDuring the boat ride, enjoy views of the magnificent Jag Mandir Palace, located on an island in Lake Pichola.\n\nLater, return to the hotel and relax.',
      timeline: [
        'En-route Visit to Kumbhalgarh Fort & Great Wall',
        'Scenic Drive to Udaipur (City of Lakes)',
        'Check-in at Mewar Haveli & Relaxation',
        'Sunset Boat Ride on Lake Pichola',
        'Views of Jag Mandir Palace & Historic Ghats'
      ],
      stayLocation: 'Mewar haveli, Udaipur',
      image: '/images/Rajasthan/rajasthan5.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      date: '07 Nov',
      title: 'DAY 9 | Saturday, 7th November – Udaipur Heritage Tour | City Palace, Saheliyon Ki Bari, Monsoon Palace & Shilpgram',
      route: 'Udaipur Sightseeing',
      intro: 'After breakfast, proceed for a full-day sightseeing tour of Udaipur.\n\nVisit the magnificent City Palace, one of Rajasthan’s most impressive royal complexes, overlooking the beautiful Lake Pichola.\n\nContinue to Saheliyon Ki Bari, a historic garden known for its fountains, marble structures, lush greenery and peaceful surroundings.\n\nLater, proceed towards Sajjangarh Monsoon Palace, dramatically positioned on a hilltop overlooking Udaipur and its surrounding lakes.\n\nEnd the day with a visit to Shilpgram, a cultural village showcasing traditional Rajasthani arts, crafts, rural life and cultural heritage.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      timeline: [
        'City Palace Grand Royal Complex',
        'Saheliyon Ki Bari Historic Fountains & Gardens',
        'Sajjangarh Monsoon Palace Hilltop Panorama',
        'Shilpgram Traditional Arts & Rural Crafts Village',
        'Relaxed Heritage Evening at Mewar Haveli'
      ],
      stayLocation: 'Mewar haveli, Udaipur',
      image: '/images/Rajasthan/rajasthan6.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      date: '08 Nov',
      title: 'DAY 10 | Sunday, 8th November – Udaipur | Jagdish Temple → Departure',
      route: 'Udaipur Departure',
      intro: 'After breakfast, visit the historic Jagdish Temple, one of Udaipur’s most important temples and a fine example of Indo-Aryan architecture.\n\nLater, return to the hotel and complete the check-out formalities.\n\nAfter check-out, proceed towards Udaipur Railway Station / Airport for your onward journey.\n\nTour Ends with beautiful memories of Royal Rajasthan. 🧡',
      timeline: [
        'Jagdish Temple Indo-Aryan Architectural Visit',
        'Hotel Check-out Formalities',
        'Departure Transfer to Udaipur Railway Station / Airport',
        'Tour Ends with beautiful memories of Royal Rajasthan 🧡'
      ],
      stayLocation: 'Departure Transfer',
      image: '/images/Rajasthan/rajasthan5.jpg',
      meals: 'Breakfast Only'
    }
  ],
  inclusions: [
    'Private AC Vehicle with Dedicated Tour Chauffeur for all 10 Days (including all transfers, inter-city drives & sightseeing)',
    'Accommodation for 9 Nights across Handpicked Properties (Hotel Kalyan, Lakhmana Dessert Camp, Krishna Prakash Heritage Haveli, Thar Resort, Hotel Rock Regency, Mewar Haveli)',
    'Daily Buffet Breakfast & Dinner (MAP Plan) as per the detailed day-wise itinerary',
    'Thar Desert Safari with Camel Ride, Sunset at Sand Dunes, Cultural Folk Dance & Campfire in Jaisalmer',
    '4x4 Open Gypsy Wildlife & Leopard Safari in Jawai Hills',
    'Sunset Boat Ride on Nakki Lake in Mount Abu',
    'Scenic Sunset Boat Ride on Lake Pichola & Views of Jag Mandir Palace in Udaipur',
    'All Driver Allowances, Toll Taxes, State Border Permits, Parking Fees & Fuel Charges',
    'Assistance during all hotel check-ins and check-outs',
    '5% GST Included in the Total Package Quotation'
  ],
  exclusions: [
    'Airfare / Train fare to Jaipur and from Udaipur',
    'Monument entry tickets, camera fees, or audio guides unless specifically mentioned in inclusions',
    'Any personal expenses (laundry, room service, telephone calls, alcoholic beverages)',
    'Any meals or snacks other than the specified Breakfast & Dinner plan',
    'Early check-in (before standard 2:00 PM) or late check-out (after 11:00 AM) subject to hotel policies',
    'Any cost arising due to unforeseen circumstances like flight cancellations, landslides, or natural calamities'
  ],
  thingsToCarry: [
    'Valid Government-Issued Photo ID Cards (Aadhaar / Passport / Driving License)',
    'Comfortable cotton clothing for daytime sightseeing & light woollens / shawls for desert evenings',
    'Comfortable walking shoes & sandals for fort and temple exploration',
    'Sunglasses, Sunscreen Lotion & Sun Hat for daytime excursions',
    'Camera / Smartphone with extra battery packs for desert and wildlife photography',
    'Personal medicines and basic travel first-aid kit'
  ],
  finalQuotationAmount: 139020,
  baseAmount: 132400,
  gstPercentage: 5,
  gstAmount: 6620,
  tcsPercentage: 0,
  tcsAmount: 0,
  adults: 3,
  kids: 0,
  perAdultPrice: 46340
};

export const winterSpitiYatinManualItinerary: ManualItinerary = {
  id: 'spiti-yatin',
  slug: 'winter-spiti-kinnaur-yatin',
  title: 'Wanderphilia Signature Winter Spiti Specially Curated for Mr Yatin Sir & Family',
  subtitle: 'Signature Winter Spiti & Kinnaur Himalayan Expedition',
  duration: '10 Nights / 11 Days | 20th – 30th November',
  numNights: 10,
  numDays: 11,
  dates: '20th – 30th November',
  route: 'Chandigarh → Narkanda → Sangla / Chitkul → Nako → Tabo → Kaza → Kalpa → Shimla → Chandigarh',
  routeSummary: '1N Narkanda | 2N Sangla / Chitkul | 2N Tabo | 2N Kaza | 2N Kalpa | 1N Shimla',
  destination: 'Spiti Valley & Kinnaur',
  travelStyle: 'Signature Winter Expedition',
  tripType: 'Specially Curated Family Tour',
  leadName: 'Mr Yatin Sir & Family',
  vehicleType: 'Private Toyota Innova Crysta',
  mealPlan: 'Daily Breakfast & Dinner at the respective hotels (MAP Plan) + Curated Local Himachali Food Experience',
  heroImage: '/images/spiti-valley.jpg',
  galleryImages: [
    '/images/spiti-valley.jpg',
    '/images/spiti1.JPG',
    '/images/spiti2.JPG',
    '/images/spiti3.jpg',
    '/images/spiti5.JPG',
    '/images/himachal.jpg',
    '/images/himachal2.jpg',
    '/images/himachal3.jpg',
    '/images/himachal7.jpg',
    '/images/himachal8.jpg',
    '/images/himachal9.jpg'
  ],
  accommodations: [
    { city: 'Narkanda', nights: 1, hotelName: 'Snow Valley Resort / Similar', roomCategory: 'Deluxe Mountain View Room' },
    { city: 'Sangla / Chitkul', nights: 2, hotelName: 'Hotel Mount Kailash / Banjara Valley Retreat / Similar', roomCategory: 'Valley View Deluxe Cottage / Room' },
    { city: 'Tabo', nights: 2, hotelName: 'Maitreya Mud House / Similar', roomCategory: 'Traditional Deluxe Mud Room' },
    { city: 'Kaza', nights: 2, hotelName: 'Baspa Mud House / Spiti Village Resort Mud House / Similar', roomCategory: 'Super Deluxe Heated Room' },
    { city: 'Kalpa', nights: 2, hotelName: 'Kinner Villa / Similar', roomCategory: 'Kinner Kailash View Deluxe Room' },
    { city: 'Shimla', nights: 1, hotelName: 'Snow Valley Heights / Similar', roomCategory: 'Luxury Valley View Room' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '20 Nov',
      title: '20 Nov: The Himalayan Journey Begins & Sunset Bonfire',
      route: 'Chandigarh → Narkanda',
      durationNote: 'Approx. 5–6 hrs | 175 km',
      timeline: [
        'Scenic drive from Chandigarh towards Narkanda, surrounded by cedar forests & mountain landscapes',
        'Arrive at your mountain retreat in Narkanda and check-in',
        'Spend the evening slowing down with a warm cup of chai and Himalayan sunset views',
        'Cosy evening bonfire under the mountains',
        'Warm and relaxed mountain dinner'
      ],
      stayLocation: 'Narkanda (Snow Valley Resort / Similar)',
      image: '/images/himachal.jpg',
      meals: 'Dinner'
    },
    {
      day: 2,
      date: '21 Nov',
      title: '21 Nov: Into the Baspa Valley & Dramatic Kinnauri Gorges',
      route: 'Narkanda → Sangla / Chitkul',
      durationNote: 'Approx. 6–7 hrs | 160 km',
      timeline: [
        'Journey deeper into Kinnaur as the landscape transforms into dramatic valleys',
        'Scenic drive through traditional Himalayan mountain villages',
        'Arrive in the beautiful Baspa Valley and settle into your stay',
        'Spend the evening at leisure, enjoying valley views and peaceful surroundings',
        'Warm local Kinnauri dinner'
      ],
      stayLocation: 'Sangla / Chitkul (Hotel Mount Kailash / Banjara Valley Retreat / Similar)',
      image: '/images/himachal2.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      date: '22 Nov',
      title: '22 Nov: Exploring Chitkul, India’s Last Village & Baspa Riverside',
      route: 'Chitkul & Baspa Valley',
      durationNote: 'Leisure Day Excursion',
      timeline: [
        'Explore Chitkul, one of Kinnaur’s most beautiful and remote villages',
        'Take a slow village walk and discover traditional wooden homes',
        'Visit the local village temple and interact with locals',
        'Enjoy the magnificent Baspa Valley and Baspa River surroundings',
        'Return to your stay for a relaxed afternoon and evening'
      ],
      stayLocation: 'Sangla / Chitkul (Hotel Mount Kailash / Banjara Valley Retreat / Similar)',
      image: '/images/himachal3.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      date: '23 Nov',
      title: '23 Nov: Kinnaur to Spiti Cold Desert via Sacred Nako Lake',
      route: 'Sangla / Chitkul → Nako → Tabo',
      durationNote: 'Approx. 6–7 hrs | 150 km',
      timeline: [
        'Leave the lush valleys of Kinnaur behind as the landscape transforms into the cold desert',
        'Scenic stop at Nako with time to explore the village',
        'Visit the tranquil and sacred Nako Lake',
        'Enjoy a warm local lunch in Nako',
        'Continue towards Tabo through dramatic Trans-Himalayan landscapes',
        'Arrive in Tabo and settle into your mountain stay'
      ],
      stayLocation: 'Tabo (Maitreya Mud House / Similar)',
      image: '/images/spiti-valley.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      date: '24 Nov',
      title: '24 Nov: Ancient Spiti & 1000-Year-Old UNESCO Tabo Monastery',
      route: 'Tabo & Heritage Valley',
      durationNote: 'Unrushed Cultural Day',
      timeline: [
        'Wake up to a peaceful Himalayan morning in Tabo',
        'Spend the morning exploring ancient Tabo Monastery and its historical complex',
        'Discover ancient temples, Buddhist artwork and peaceful surroundings',
        'Take a slow walk through traditional Tabo village',
        'Deliberately relaxed afternoon enjoying the stay and surrounding mountains',
        'Warm local dinner'
      ],
      stayLocation: 'Tabo (Maitreya Mud House / Similar)',
      image: '/images/spiti1.JPG',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      date: '25 Nov',
      title: '25 Nov: Cliff-Hanging Dhankar Monastery & Scenic Drive to Kaza',
      route: 'Tabo → Dhankar → Kaza',
      durationNote: 'Approx. 3–4 hrs | 65 km',
      timeline: [
        'After breakfast, begin your journey towards spectacular Dhankar',
        'Explore the ancient monastery dramatically perched above the Spiti Valley',
        'Enjoy magnificent panoramic views across the mountains and river valley',
        'Continue towards Kaza travelling through some of Spiti’s most dramatic landscapes',
        'Arrive in Kaza and enjoy a relaxed evening'
      ],
      stayLocation: 'Kaza (Baspa Mud House / Spiti Village Resort Mud House / Similar)',
      image: '/images/spiti3.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      date: '26 Nov',
      title: '26 Nov: Key Monastery, High-Altitude Kibber & Asia’s Highest Chicham Bridge',
      route: 'Kaza → Key → Kibber → Chicham → Kaza',
      durationNote: 'Full Day Spiti Sightseeing Circuit',
      timeline: [
        'Begin your day with Key Monastery, one of Spiti’s most iconic landmarks',
        'Continue towards Kibber and experience remote Spitian mountain village life',
        'Visit Chicham and cross the spectacular suspension bridge enjoying vast vistas',
        'Optional extension to Langza, Hikkim & Komic (subject to weather, road and daylight conditions)',
        'Return to Kaza for a warm local dinner and relaxed evening'
      ],
      stayLocation: 'Kaza (Baspa Mud House / Spiti Village Resort Mud House / Similar)',
      image: '/images/spiti2.JPG',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      date: '27 Nov',
      title: '27 Nov: Scenic Descent to Kinnaur & Sacred Kinner Kailash Sunset',
      route: 'Kaza → Kalpa',
      durationNote: 'Approx. 6–7 hrs | 200 km',
      timeline: [
        'Begin the beautiful descent from Spiti towards Kinnaur',
        'Watch the landscape gradually transform from stark cold desert to softer Himalayan valleys',
        'Arrive in Kalpa and check-in to your stay',
        'Spend the evening unwinding with magnificent Kinner Kailash views',
        'Enjoy sunset from your stay followed by a relaxed dinner'
      ],
      stayLocation: 'Kalpa (Kinner Villa / Similar)',
      image: '/images/himachal7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      date: '28 Nov',
      title: '28 Nov: The Art of Doing Nothing, Roghi Village & Farewell Bonfire',
      route: 'Kalpa & Roghi Village',
      durationNote: 'Leisurely Kinnauri Immersion',
      timeline: [
        'Leisurely Himalayan morning and breakfast overlooking the mountains',
        'Explore the charming lanes of Kalpa and traditional Kinnauri architecture',
        'Visit Roghi Village for beautiful mountain views and photography (subject to weather/road conditions)',
        'Return to your stay for a relaxed afternoon embracing the art of doing nothing',
        'Mountain sunset, cosy bonfire and special local dinner'
      ],
      stayLocation: 'Kalpa (Kinner Villa / Similar)',
      image: '/images/himachal8.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      date: '29 Nov',
      title: '29 Nov: The Final Stretch, Colonial Mall Road Walk & Farewell Dinner',
      route: 'Kalpa → Shimla',
      durationNote: 'Approx. 6–7 hrs | 220 km',
      timeline: [
        'After breakfast, journey towards Shimla through the changing landscapes of Himachal',
        'Arrive in Shimla and check-in to your hotel',
        'Spend your final evening with a leisurely walk around The Ridge & Mall Road',
        'Stop at a cosy café and enjoy bakery treats',
        'End the journey with a beautiful farewell dinner'
      ],
      stayLocation: 'Shimla (Snow Valley Heights / Similar)',
      image: '/images/himachal9.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 11,
      date: '30 Nov',
      title: '30 Nov: Homeward Bound with Mountain Memories & Chandigarh Drop-off',
      route: 'Shimla → Chandigarh',
      durationNote: 'Approx. 3–4 hrs | 115 km',
      timeline: [
        'Breakfast in Shimla with final morning hill views',
        'Scenic drive from Shimla down to Chandigarh in your Private Toyota Innova Crysta',
        'Safe drop-off at Chandigarh Airport / Railway Station to board your evening flight / train',
        'Depart with unforgettable Himalayan memories of Winter Spiti & Kinnaur'
      ],
      stayLocation: 'Departure',
      signOff: 'Until the next Himalayan adventure — Wanderphilia style!',
      image: '/images/himachal1.jpg',
      meals: 'Breakfast'
    }
  ],
  inclusions: [
    'Private Toyota Innova Crysta at your disposal from Chandigarh to Chandigarh for 11 Days, including all sightseeing and transfers as per the itinerary.',
    'Experienced local driver throughout the journey.',
    'Accommodation as per the selected hotels/properties and itinerary (10 Nights / 11 Days).',
    'Daily Breakfast & Dinner at the respective hotels (MAP Plan).',
    'All sightseeing and experiences mentioned in the itinerary.',
    'One special Bonfire Evening during the journey.',
    'Himalayan Stargazing Experience in Spiti, subject to clear weather conditions.',
    'Curated Local Himachali Food Experience to experience the authentic flavours of the mountains.',
    'All applicable tolls, parking charges, driver allowances and driver-related expenses for the vehicle as per the itinerary.',
    'Inner Line / Route Permits wherever required for the planned journey.',
    'All vehicle-related expenses including fuel and applicable interstate taxes for the confirmed itinerary.',
    'Dedicated Wanderphilia trip coordination and assistance throughout the journey.',
    'Important: The vehicle’s air conditioning will not be operated in the hill regions, as it is not recommended/required due to the prevailing temperatures and terrain. AC may be used during suitable plains/low-altitude stretches as operationally feasible.'
  ],
  exclusions: [
    'GST @ 5% is applicable extra.',
    'Any meals, beverages or food items not specifically mentioned under inclusions, including alcoholic beverages, mineral water, snacks, refreshments and lunches, including highway meals.',
    'Any personal expenses, including tips/gratuities to drivers or hotel staff, laundry, telephone calls, room service, shopping, etc.',
    'Entry fees to monuments, monasteries, museums, temples or other attractions, wherever applicable.',
    'Any additional cost arising due to weather conditions, snowfall, landslides, roadblocks, road closures, natural calamities, government restrictions or unforeseen circumstances. Such additional expenses, if any, will be borne directly by the customer on the spot.',
    'Any expenses arising from changes or delays caused by the customer.',
    'Anything not specifically mentioned under the Inclusions.'
  ],
  thingsToCarry: [
    'Heavy woollens, thermal innerwear (top & bottom), fleece jackets, windproof & waterproof down jackets',
    'Warm woolen beanies/caps, mufflers/neck gaiters, insulated gloves/mittens, woolen socks (multiple pairs)',
    'Sturdy walking / trekking shoes with good grip and waterproof properties',
    'UV-protection sunglasses (essential for high-altitude snow glare) & high-SPF sunscreen & lip balm',
    'Thermos flask / insulated water bottle for hot drinking water during drives',
    'Personal medications, Altitude Sickness (Diamox) if advised, cold/headache medication, basic first aid kit',
    'Power banks (batteries discharge rapidly in sub-zero temperatures) & extra camera memory cards',
    'Moisturizers, cold cream & body lotion (high-altitude cold climate is very dry)',
    'Original Government-Issued Photo ID Cards (Aadhaar Card / Passport) for permits & hotel check-ins'
  ],
  finalQuotationAmount: 129665,
  baseAmount: 123490,
  gstPercentage: 5,
  gstAmount: 6175,
  tcsPercentage: 0,
  tcsAmount: 0,
  adults: 2,
  kids: 0,
  perAdultPrice: 61745
};


export const rajasthanJignaManualItinerary: ManualItinerary = {
  id: 'rajasthan-jigna',
  slug: 'royal-rajasthan-jigna',
  title: 'Wanderphilia Royal Rajasthan Escape Specially Curated for Mrs. Jigna Mam & Family',
  subtitle: 'Royal Rajasthan Escape • 11 Days / 10 Nights',
  duration: '10 Nights / 11 Days | 30 October – 9 November 2026',
  numNights: 10,
  numDays: 11,
  dates: '30 October – 9 November 2026',
  route: 'Udaipur → Mount Abu → Jawai → Jodhpur → Jaisalmer → Jaipur',
  routeSummary: '2N Udaipur | 1N Mount Abu | 1N Jawai | 2N Jodhpur | 1N Jaisalmer | 3N Jaipur',
  destination: 'Rajasthan',
  travelStyle: 'Royal Heritage, Desert & Wildlife Expedition',
  tripType: 'Specially Curated Family Tour',
  leadName: 'Mrs. Jigna Mam & Family',
  vehicleType: 'Private AC Innova Crysta / Luxury Vehicle with Dedicated Chauffeur',
  mealPlan: 'Daily Breakfast at all hotels + Dinners as per itinerary plan',
  heroImage: '/images/Rajasthan/rajasthan1.jpeg',
  galleryImages: [
    '/images/Rajasthan/rajasthan1.jpeg',
    '/images/Rajasthan/rajasthan2.jpeg',
    '/images/Rajasthan/rajasthan3.jpeg',
    '/images/Rajasthan/rajasthan4.jpeg',
    '/images/Rajasthan/rajasthan5.jpg',
    '/images/Rajasthan/rajasthan6.jpg',
    '/images/Rajasthan/rajasthan7.jpg'
  ],
  moments: [
    'Peaceful mornings around Lake Pichola',
    'Royal palaces & magnificent forts',
    'Historic temples & spiritual experiences',
    'Golden Aravalli sunsets',
    'Jawai wildlife & leopard safari',
    "Jodhpur's iconic Blue City",
    'Golden Thar Desert dunes & camping',
    'Desert experiences under the evening sky',
    'Rajasthani culture, music & dining',
    'Colourful Jaipur bazaars & shopping',
    'A beautifully paced family journey through Rajasthan'
  ],
  accommodations: [
    { city: 'Udaipur', nights: 2, hotelName: 'Mewar Palace / Similar', roomCategory: 'Deluxe Heritage Room' },
    { city: 'Mount Abu', nights: 1, hotelName: 'Hotel Rock Residency / Similar', roomCategory: 'Deluxe Mountain View Room' },
    { city: 'Jawai', nights: 1, hotelName: 'Jawai Thar Resort / Similar', roomCategory: 'Luxury Wilderness Cottage' },
    { city: 'Jodhpur', nights: 2, hotelName: 'The Heritage Bagh / Similar', roomCategory: 'Royal Heritage Deluxe Room' },
    { city: 'Jaisalmer', nights: 1, hotelName: 'KK Groups Camps / Similar', roomCategory: 'Luxury Swiss Desert Camp' },
    { city: 'Jaipur', nights: 3, hotelName: 'Hotel Sarang Palace / Similar', roomCategory: 'Executive Heritage Room' }
  ],
  dayPlans: [
    {
      day: 1,
      date: '30 Oct',
      title: '30 Oct: The Journey Begins – City of Lakes',
      route: 'Udaipur',
      durationNote: 'Arrival & Lake Pichola Cruise',
      timeline: [
        'Welcome to Udaipur, the enchanting City of Lakes.',
        'Begin your Rajasthan journey with a visit to the beautiful Jagdish Mandir, an important historic temple located in the heart of the old city.',
        'Later, experience the magic of Lake Pichola Boat Ride, cruising across the serene waters while enjoying views of Udaipur’s magnificent palaces and surrounding Aravalli hills.',
        'Visit Jag Mandir Palace, the beautiful island palace rising from the middle of Lake Pichola.',
        'End your first evening surrounded by the royal charm of Udaipur.'
      ],
      stayLocation: 'Udaipur (Mewar Palace / Similar)',
      image: '/images/Rajasthan/rajasthan1.jpeg',
      meals: 'Dinner'
    },
    {
      day: 2,
      date: '31 Oct',
      title: '31 Oct: Royal Heritage, Gardens & Living Culture',
      route: 'Udaipur',
      durationNote: 'Full Day Royal Heritage Circuit',
      timeline: [
        'After breakfast, begin your exploration of Udaipur’s royal heritage with the magnificent City Palace.',
        'Discover its grand courtyards, royal chambers and beautiful views overlooking Lake Pichola.',
        'Continue to Saheliyon Ki Bari, the elegant garden created for the royal ladies of Mewar.',
        'Later, drive towards Monsoon Palace, perched high above Udaipur and offering spectacular panoramic views of the city and surrounding countryside.',
        'Complete the day with a visit to Shilpgram, a vibrant arts and crafts village showcasing the traditional culture, handicrafts and artistic heritage of Rajasthan.'
      ],
      stayLocation: 'Udaipur (Mewar Palace / Similar)',
      image: '/images/Rajasthan/rajasthan2.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      date: '01 Nov',
      title: '01 Nov: From Mewar’s Fortresses to the Hills',
      route: 'Udaipur → Kumbhalgarh Fort → Mount Abu',
      durationNote: 'Approx. 5–6 hrs | 185 km',
      timeline: [
        'After breakfast, leave Udaipur and begin your journey towards the majestic Kumbhalgarh Fort.',
        'Explore the magnificent fortress surrounded by the Aravalli hills and discover its impressive architecture, history and legendary fortifications.',
        'Continue your scenic drive towards Mount Abu, Rajasthan’s beautiful hill station.',
        'Upon arrival, head towards Guru Shikhar, the highest point of the Aravalli Range, for spectacular mountain views.',
        'Later, enjoy a peaceful Nakki Lake Boat Ride, surrounded by the hills of Mount Abu.',
        'Relax and enjoy the cool mountain evening.'
      ],
      stayLocation: 'Mount Abu (Hotel Rock Residency / Similar)',
      image: '/images/Rajasthan/rajasthan3.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      date: '02 Nov',
      title: '02 Nov: Temples, Markets & Into the Wild',
      route: 'Mount Abu → Jawai',
      durationNote: 'Approx. 3–4 hrs | 110 km',
      timeline: [
        'Begin your morning with a visit to the magnificent Dilwara Temples, renowned for their extraordinary marble craftsmanship and intricate architectural details.',
        'Later, explore the lively Mount Abu Market, with time to browse local handicrafts, souvenirs and traditional products.',
        'After lunch, depart for Jawai as the landscape changes into rugged granite hills and open countryside.',
        'Arrive at your wildlife retreat in the heart of Jawai.',
        'In the evening, head out for an exciting Jawai Wildlife Safari, searching for leopards among the dramatic rocky terrain.',
        'Return to your stay for a relaxed evening and dinner under the stars.'
      ],
      stayLocation: 'Jawai (Jawai Thar Resort / Similar)',
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      date: '03 Nov',
      title: '03 Nov: Royal Jodhpur Begins',
      route: 'Jawai → Jodhpur',
      durationNote: 'Approx. 3–4 hrs | 150 km',
      timeline: [
        'Enjoy a peaceful morning in Jawai before continuing towards Jodhpur, the famous Blue City.',
        'Upon arrival, begin your exploration with the magnificent Umaid Bhawan Palace, one of India’s grandest royal residences.',
        'Continue to Jaswant Thada, the beautiful marble memorial surrounded by peaceful gardens and overlooking the Blue City.',
        'In the evening, visit Mandore Garden and experience its atmospheric Sound & Light Show, bringing the history and legends of Marwar to life.',
        'Return to your hotel after a memorable evening.'
      ],
      stayLocation: 'Jodhpur (The Heritage Bagh / Similar)',
      image: '/images/Rajasthan/rajasthan5.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      date: '04 Nov',
      title: '04 Nov: Fortresses, Blue Streets & Sunset',
      route: 'Jodhpur',
      durationNote: 'Blue City Walking & Sunset',
      timeline: [
        'After breakfast, discover the magnificent Mehrangarh Fort, dramatically rising above Jodhpur and offering spectacular views of the Blue City.',
        'Continue to Toorji Ka Jhalra, the beautifully restored historic stepwell located in the heart of the old city.',
        'Later, experience a guided Blue City Tour, walking through the colourful blue-painted lanes and discovering the local character of Jodhpur.',
        'As evening approaches, head towards Panchatiya Hills for a beautiful sunset experience overlooking the city.',
        'Return to your hotel for a relaxed evening.'
      ],
      stayLocation: 'Jodhpur (The Heritage Bagh / Similar)',
      image: '/images/Rajasthan/rajasthan6.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      date: '05 Nov',
      title: '05 Nov: Into the Golden Sands',
      route: 'Jodhpur → Jaisalmer City → Thar Desert',
      durationNote: 'Approx. 5–6 hrs | 280 km',
      timeline: [
        'After breakfast, depart Jodhpur and travel towards Jaisalmer, where the landscape gradually transforms into the golden desert of western Rajasthan.',
        'Begin your Jaisalmer exploration with the magnificent Jaisalmer Fort, one of India’s most remarkable living forts.',
        'Continue to Patwon Ki Haveli, followed by the historic Bada Bagh, known for its beautiful royal cenotaphs.',
        'Later, visit Gadisar Lake, a peaceful oasis surrounded by historic temples and architecture.',
        'As the afternoon fades, continue towards the Thar Desert dunes.',
        'Settle into your desert retreat and experience the magic of the dunes, followed by a traditional desert evening with folk music, Kalbeliya dance and dinner under the starlit sky.'
      ],
      stayLocation: 'Jaisalmer (KK Groups Camps / Similar)',
      image: '/images/Rajasthan/rajasthan7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      date: '06 Nov',
      title: '06 Nov: From the Golden City to the Pink City',
      route: 'Jaisalmer → Jaipur',
      durationNote: 'Approx. 8–9 hrs | 560 km',
      timeline: [
        'After breakfast, begin your journey from Jaisalmer towards Jaipur.',
        'The long road journey allows you to watch Rajasthan’s landscape change from the golden Thar Desert towards the colourful heart of the state.',
        'Arrive in Jaipur and check into your hotel.',
        'The evening is kept relaxed, allowing the family to rest after the journey or enjoy some leisure time at the hotel.'
      ],
      stayLocation: 'Jaipur (Hotel Sarang Palace / Similar)',
      image: '/images/Rajasthan/rajasthan1.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      date: '07 Nov',
      title: '07 Nov: The Royal Pink City',
      route: 'Jaipur',
      durationNote: 'Full Day Heritage & Fort Circuit',
      timeline: [
        'Begin your Jaipur experience with the iconic Hawa Mahal, one of the city’s most recognisable landmarks.',
        'Continue to the magnificent City Palace and explore the royal heritage of Jaipur.',
        'Visit Jantar Mantar, the remarkable astronomical observatory built by Maharaja Sawai Jai Singh II.',
        'Later, proceed towards Amer Fort, one of Rajasthan’s most impressive hilltop forts.',
        'At the base of Amer, enjoy a Maota Lake Boat Ride, creating a beautiful setting around the historic fort.',
        'As the sun begins to set, experience the beauty of Amer during the golden hour.',
        'End the day with a special Rooftop Dining Experience, combined with a Sound & Light Show, bringing Jaipur’s royal stories and culture to life.'
      ],
      stayLocation: 'Jaipur (Hotel Sarang Palace / Similar)',
      image: '/images/Rajasthan/rajasthan2.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      date: '08 Nov',
      title: '08 Nov: Museums, Forts & A Royal Sunset',
      route: 'Jaipur',
      durationNote: 'Forts & Sunset Dining',
      timeline: [
        'Begin the morning with a visit to Albert Hall Museum, Jaipur’s magnificent historic museum and an architectural landmark.',
        'Continue towards Jal Mahal, the beautiful palace surrounded by the waters of Man Sagar Lake.',
        'Later, explore the impressive Jaigarh Fort, known for its massive fortifications and panoramic views over the Aravalli landscape.',
        'As evening approaches, head towards Nahargarh Fort for spectacular views over Jaipur.',
        'End your Rajasthan journey with a memorable Sunset Dining Experience at RTDC Durg Cafeteria, enjoying the city lights and a beautiful final evening in the Pink City.'
      ],
      stayLocation: 'Jaipur (Hotel Sarang Palace / Similar)',
      image: '/images/Rajasthan/rajasthan3.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 11,
      date: '09 Nov',
      title: '09 Nov: The Final Chapter',
      route: 'Jaipur → Jaipur Railway Station Drop',
      durationNote: 'Johari Bazaar & Station Drop',
      timeline: [
        'Enjoy a relaxed final morning with breakfast at the hotel.',
        'Before leaving Jaipur, spend some time exploring Johari Bazaar, one of the city’s most famous shopping destinations.',
        'Browse traditional Rajasthani jewellery, textiles, handicrafts and souvenirs — the perfect opportunity to take a little piece of Rajasthan home with you.',
        'Later, transfer to Jaipur Railway Station for your onward journey.',
        'As the journey comes to an end, carry with you memories of serene lakes, royal palaces, ancient forts, desert sunsets, wildlife encounters, colourful markets and unforgettable family moments.'
      ],
      stayLocation: 'Departure (Trip Ends: Jaipur Railway Station)',
      signOff: 'Until your next royal adventure — Wanderphilia style! 🧡',
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast'
    }
  ],
  inclusions: [
    'Private dedicated air-conditioned vehicle for 11 Days for all transfers, sightseeing and intercity travel as per the confirmed itinerary.',
    'Experienced, courteous and verified professional chauffeur throughout the journey.',
    '10 Nights accommodation in handpicked quality heritage hotels, wildlife resort and luxury desert camp as specified (2N Udaipur, 1N Mount Abu, 1N Jawai, 2N Jodhpur, 1N Jaisalmer, 3N Jaipur).',
    'Daily Breakfast at all hotels + Dinners as specified under the itinerary.',
    'Lake Pichola boat ride in Udaipur & Jag Mandir Palace visit.',
    'Nakki Lake boat ride in Mount Abu.',
    'Jawai Wildlife & Leopard Safari in open 4x4 Gypsy.',
    'Thar Desert experience in Jaisalmer including camel safari, cultural folk dance, Kalbeliya performance and traditional dinner.',
    'Maota Lake boat ride at Amer Fort in Jaipur.',
    'Sound & Light Show experiences at Mandore Garden (Jodhpur) and Jaipur.',
    'Special Sunset Dining Experience at RTDC Durg Cafeteria at Nahargarh Fort in Jaipur.',
    'All toll taxes, parking fees, interstate permits, fuel charges and driver allowances included.',
    'Dedicated Wanderphilia 24x7 trip coordination and concierge assistance throughout the journey.'
  ],
  exclusions: [
    'GST @ 5% is applicable extra on total package cost.',
    'Monument entry tickets, museum entry fees and camera charges not explicitly listed.',
    'Lunches and personal beverages/refreshments.',
    'Any personal expenses like laundry, room service, telephone calls, tips or gratuities.',
    'Any costs arising due to unexpected road closures, weather conditions, or circumstances beyond control.',
    'Anything not explicitly mentioned under Inclusions.'
  ],
  thingsToCarry: [
    'Valid Government photo ID proofs for all travelers (Aadhaar / Passport / Driving License).',
    'Comfortable walking shoes or sandals for fort and palace walking tours.',
    'Light cotton clothing for daytime sightseeing with sunglasses, hat and sunscreen.',
    'Light jacket / shawl for cool evenings in Mount Abu, Jawai and Thar Desert.',
    'Camera with extra memory cards to capture Rajasthan\'s magnificent heritage and wildlife.'
  ],
  finalQuotationAmount: 132782,
  baseAmount: 126459,
  gstPercentage: 5,
  gstAmount: 6323,
  tcsPercentage: 0,
  tcsAmount: 0,
  adults: 3,
  kids: 0,
  perAdultPrice: 42153
};

export const manualItinerariesRegistry: Record<string, ManualItinerary> = {
  'rajasthan-jigna': rajasthanJignaManualItinerary,
  'royal-rajasthan-jigna': rajasthanJignaManualItinerary,
  'jigna': rajasthanJignaManualItinerary,
  'mrs-jigna': rajasthanJignaManualItinerary,
  'mrs-jigna-mam': rajasthanJignaManualItinerary,
  'jigna-mam': rajasthanJignaManualItinerary,
  'rajasthan-jigna-mam': rajasthanJignaManualItinerary,
  'wp-rajasthan-jigna': rajasthanJignaManualItinerary,
  'royal-rajasthan-escape-jigna': rajasthanJignaManualItinerary,

  'spiti-yatin': winterSpitiYatinManualItinerary,
  'winter-spiti-kinnaur-yatin': winterSpitiYatinManualItinerary,
  'winter-spiti-yatin': winterSpitiYatinManualItinerary,
  'yatin': winterSpitiYatinManualItinerary,
  'mr-yatin': winterSpitiYatinManualItinerary,
  'mr-yatin-sir': winterSpitiYatinManualItinerary,
  'mr-yatin-sir-family': winterSpitiYatinManualItinerary,
  'wanderphilia-signature-winter-spiti-yatin': winterSpitiYatinManualItinerary,
  'wp-winter-spiti-yatin': winterSpitiYatinManualItinerary,
  'wp-spiti-yatin': winterSpitiYatinManualItinerary,
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
  'wp-vietnam-naushad': vietnamNaushadManualItinerary,
  'wp-4002b3f4': rajasthanRoyalEscapeManualItinerary,
  'royal-rajasthan-experience': rajasthanRoyalEscapeManualItinerary,
  'royal-rajasthan-experience-9n-10d': rajasthanRoyalEscapeManualItinerary,
  'royal-rajasthan': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-royal-experience': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-royal-experience-9n-10d': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-royal-family-tour': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-family-tour': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-royal-escape': rajasthanRoyalEscapeManualItinerary,
  'wp-rajasthan-royal-escape': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-10-days': rajasthanRoyalEscapeManualItinerary,
  'rajasthan-10d9n': rajasthanRoyalEscapeManualItinerary
};

export function getManualItinerary(idOrSlug: string): ManualItinerary | null {
  if (!idOrSlug) return null;
  const key = idOrSlug.toLowerCase().trim();
  return manualItinerariesRegistry[key] || Object.values(manualItinerariesRegistry).find(
    it => it.id.toLowerCase() === key || it.slug.toLowerCase() === key
  ) || null;
}

export function getAllManualItineraries(): ManualItinerary[] {
  return [
    himachalExplorerManualItinerary,
    winterSpitiYatinManualItinerary,
    vietnamAneeshManualItinerary,
    vietnamYashManualItinerary,
    vietnamNaushadManualItinerary,
    rajasthanRoyalEscapeManualItinerary,
    rajasthanJignaManualItinerary
  ];
}

/**
 * Helper to convert a ManualItinerary into an ItineraryDocument format
 */
export function manualItineraryToDocument(manual: ManualItinerary): ItineraryDocument {
  const isVietnam = manual.destination.toLowerCase().includes('vietnam');
  const isRajasthan = manual.destination.toLowerCase().includes('rajasthan') || manual.id.includes('4002b3f4');
  const isSpiti = manual.destination.toLowerCase().includes('spiti') || manual.id.includes('spiti') || manual.destination.toLowerCase().includes('kinnaur');
  const defaultHighlights = isVietnam ? [
    'Ho Chi Minh City Highlights & Cu Chi Underground Tunnels',
    'Phu Quoc Island: 3 Islands Speedboat, VinWonders & Vinpearl Safari',
    'Hon Thom World’s Longest Over-Sea Cable Car & Sunset Town Kiss Bridge',
    'Ba Na Hills French Village & Iconic Giant Hands Golden Bridge',
    'Cam Thanh Coconut Forest Basket Boat & Hoi An Lantern River Cruise',
    'Hanoi 1000-Year Heritage & Ninh Binh Tam Coc Karst Caves',
    'Sapa Valley H’mong Cat Cat Village & Fansipan Legend Peak (3,143m)',
    '2D1N Ha Long Bay 5-Star Luxury Overnight Cruise (Ambassador Cruise)'
  ] : (isRajasthan ? [
    'Pink City Heritage: Amber Fort, Hawa Mahal & City Palace',
    'Thar Desert Camping, Camel Safari & Rajasthani Folk Dance in Jaisalmer',
    'Colossal Mehrangarh Fort & White Marble Jaswant Thada in Jodhpur',
    'Exciting 4x4 Wildlife & Leopard Safari in Jawai Granite Hills',
    'Dilwara Marble Temples & Nakki Lake Sunset Boat Ride in Mount Abu',
    'UNESCO Kumbhalgarh Fort Wall & Lake Pichola Sunset Boating in Udaipur',
    'Grand Udaipur City Palace, Saheliyon Ki Bari & Sajjangarh Monsoon Palace'
  ] : (isSpiti ? [
    'Forest mornings in Narkanda surrounded by cedar valleys',
    'A slow afternoon in Chitkul – The Last Inhabited Village of Kinnaur',
    'Ancient 1000-year-old UNESCO Tabo & Cliffside Dhankar Monasteries',
    'High-altitude villages of Kibber, Chicham, Langza & Komic',
    'World’s Highest Post Office at Hikkim & Highest Suspension Bridge at Chicham',
    'Golden sunsets in Kalpa overlooking sacred Kinner Kailash range',
    'Warm local Kinnauri & Spitian traditional food experiences',
    'Cosy bonfires under the mountains & Himalayan Stargazing in Spiti'
  ] : [
    'Scenic drive through Kangra Valley & McLeod Ganj',
    'Dalai Lama Temple & Bhagsu Waterfall',
    'Colonial Charm & Cafés of Dalhousie',
    'Khajjiar - The Mini Switzerland of Himachal',
    'Bir Tibetan Colony & Sunset Paragliding',
    'Snow Activities in Solang Valley & New Year Party in Manali',
    'River Rafting Experience in Manali',
    'Kasol & Parvati Valley Exploration'
  ]));

  return {
    id: manual.id,
    slug: manual.slug,
    title: manual.title,
    subTitle: manual.subtitle || `${manual.numNights} Nights / ${manual.numDays} Days Signature Experience`,
    description: `Custom ${manual.duration} expedition exploring ${manual.route}`,
    destination: manual.destination,
    stateOrCountry: isVietnam ? 'Vietnam' : (isRajasthan ? 'Rajasthan, India' : (isSpiti ? 'Himachal Pradesh (Spiti & Kinnaur), India' : 'Himachal Pradesh, India')),
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

function parseAnyDate(str: any): Date | null {
  if (!str) return null;
  const s = String(str).trim();
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(s)) {
    const [y, m, d] = s.split('-').map(Number);
    return new Date(y, m - 1, d);
  }
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(s)) {
    const [d, m, y] = s.split(/[-\/]/).map(Number);
    return new Date(y, m - 1, d);
  }
  const parsed = new Date(s);
  return isNaN(parsed.getTime()) ? null : parsed;
}

function getOrdinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function formatDateRange(rawStart: any, rawEnd: any, numDays: number = 5): string {
  const startDate = parseAnyDate(rawStart);
  if (!startDate) return rawStart ? String(rawStart) : '';

  let endDate = parseAnyDate(rawEnd);
  if (!endDate && numDays > 0) {
    endDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (numDays - 1));
  }

  const startStr = `${getOrdinal(startDate.getDate())} ${MONTH_NAMES[startDate.getMonth()]}`;
  if (!endDate) return `${startStr} ${startDate.getFullYear()}`;

  const endStr = `${getOrdinal(endDate.getDate())} ${MONTH_NAMES[endDate.getMonth()]}`;
  const endYear = endDate.getFullYear();

  if (startDate.getFullYear() !== endDate.getFullYear()) {
    return `${startStr} ${startDate.getFullYear()} to ${endStr} ${endYear}`;
  }
  return `${startStr} to ${endStr} ${endYear}`;
}

export function formatDayDate(rawStart: any, dayIndex: number): string | undefined {
  const startDate = parseAnyDate(rawStart);
  if (!startDate) return undefined;
  const current = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + (dayIndex - 1));
  return `${getOrdinal(current.getDate())} ${MONTH_NAMES[current.getMonth()]}`;
}

export function itineraryDocumentToManualItinerary(itinerary: ItineraryDocument): ManualItinerary {
  const leadName = itinerary.leadDetails?.name || itinerary.rawZohoData?.Full_Name || (itinerary.rawZohoData?.First_Name ? `${itinerary.rawZohoData.First_Name} ${itinerary.rawZohoData.Last_Name || ''}`.trim() : '') || 'Valued Traveler';
  const destination = itinerary.destination || itinerary.rawZohoData?.Destinations || itinerary.rawZohoData?.Destination || 'Rajasthan';
  const numDays = itinerary.noOfDays || (itinerary.rawZohoData?.No_of_Days ? Number(itinerary.rawZohoData.No_of_Days) : (itinerary.dayPlans?.length || 5));
  const numNights = itinerary.noOfNights || (itinerary.rawZohoData?.No_of_Nights ? Number(itinerary.rawZohoData.No_of_Nights) : (numDays > 1 ? numDays - 1 : 1));
  const travelStyle = itinerary.travelStyle || itinerary.leadDetails?.travelStyle || itinerary.rawZohoData?.Travel_Style || 'Family Trip';
  const tripType = itinerary.tripType || itinerary.leadDetails?.tripType || itinerary.rawZohoData?.Trip_Type || 'Customised Trip';
  const guests = itinerary.leadDetails?.guests || itinerary.rawZohoData?.Number_Of_Guest || itinerary.rawZohoData?.Number_Of_Guests || 2;
  const heroImage = itinerary.heroImage || '/images/about_hero4.jpg';

  const rawStartDate = itinerary.leadDetails?.startDate || itinerary.rawZohoData?.Preferred_Start_date || itinerary.startDate || '';
  const rawEndDate = itinerary.leadDetails?.endDate || itinerary.rawZohoData?.Travel_End_Date || itinerary.endDate || '';
  const dates = formatDateRange(rawStartDate, rawEndDate, numDays);
  const duration = dates ? `${numNights} Nights / ${numDays} Days | ${dates}` : `${numNights} Nights / ${numDays} Days`;

  const vehicleType = itinerary.vehicleType || itinerary.leadDetails?.vehicleType || itinerary.rawZohoData?.Vehicle_Type || 'Private AC Sedan / SUV';
  const roomCategory = itinerary.roomCategory || itinerary.leadDetails?.preferredRoomCategory || itinerary.rawZohoData?.Preferred_Room_Category || 'Luxury';
  const mealPlan = itinerary.mealPlan || itinerary.leadDetails?.mealPlan || itinerary.rawZohoData?.Meal_Plan || 'Breakfast & Dinner';

  // 6 Collage images
  const isRajasthanDest = destination.toLowerCase().includes('rajasthan') || (itinerary.id && itinerary.id.toLowerCase().includes('rajasthan')) || (itinerary.id && itinerary.id.toLowerCase().includes('4002b3f4'));
  const isVietnamDest = destination.toLowerCase().includes('vietnam') || (itinerary.id && itinerary.id.toLowerCase().includes('vietnam'));

  const defaultCollagePool = isRajasthanDest ? [
    '/images/Rajasthan/rajasthan1.jpeg',
    '/images/Rajasthan/rajasthan2.jpeg',
    '/images/Rajasthan/rajasthan3.jpeg',
    '/images/Rajasthan/rajasthan4.jpeg',
    '/images/Rajasthan/rajasthan5.jpg',
    '/images/Rajasthan/rajasthan6.jpg'
  ] : (isVietnamDest ? [
    '/images/vietnam-beauty.png',
    '/images/vietnam-best.png',
    '/images/vietnam-couple.png',
    '/images/vietnam-dreamy.png',
    '/images/vietnam-exotic.png',
    '/images/vietnam-highlights.png'
  ] : [
    heroImage,
    '/images/himachal.jpg',
    '/images/himachal2.jpg',
    '/images/himachal3.jpg',
    '/images/himachal4.jpg',
    '/images/himachal5.jpg'
  ]);

  const collageImages = itinerary.galleryImages && itinerary.galleryImages.length >= 6
    ? itinerary.galleryImages.slice(0, 6)
    : defaultCollagePool;

  // Route & Route Summary
  const routeCities: string[] = [];
  const cityStaysMap: { [city: string]: number } = {};

  const cleanCityName = (c: string): string => {
    if (!c || typeof c !== 'string') return '';
    let clean = c.trim();
    clean = clean.replace(/^(?:Arrival\s+(?:in|at)\s+|Departure\s+(?:from\s+)?|Trip\s+Ends\s*:\s*|Stay\s*:\s*)/i, '');
    clean = clean.replace(/\s+(?:Airport|Railway Station|Station|Hotel|Resort|Heritage)$/i, '');
    clean = clean.replace(/\s*\([^)]*\)/g, '');
    clean = clean.replace(/\b\d+\s*(?:N|Nights?|D|Days?)\b/gi, '');
    clean = clean.replace(/\s+(?:City|District|Town)$/i, '');
    clean = clean.replace(/\s*\/\s*Similar$/i, '');
    clean = clean.replace(/\s{2,}/g, ' ').trim();
    return clean;
  };

  const addRouteCity = (city: string) => {
    const clean = cleanCityName(city);
    if (!clean || clean.length < 2) return;
    if (routeCities.length === 0 || routeCities[routeCities.length - 1].toLowerCase() !== clean.toLowerCase()) {
      routeCities.push(clean);
    }
  };

  // A. Check Zoho Subform rows (Activities_and_Experiences_1)
  const rawSubform = itinerary.rawZohoData?.rawLeadData?.Activities_and_Experiences_1 || itinerary.rawZohoData?.Activities_and_Experiences_1;
  if (Array.isArray(rawSubform) && rawSubform.length > 0) {
    rawSubform.forEach(row => {
      const rawC1 = typeof row.City === 'object' && row.City !== null ? row.City.name : String(row.City || '');
      const rawC2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? row.Transit_city ?? '';
      const c2 = typeof rawC2 === 'object' && rawC2 !== null ? rawC2.name : String(rawC2 || '');
      const c1 = String(rawC1 || '').trim();

      if (c1) addRouteCity(c1);
      if (c2 && c2.toLowerCase() !== c1.toLowerCase()) addRouteCity(c2);
    });
  }

  // B. Check dayActivities from rawZohoData
  if (routeCities.length <= 1 && Array.isArray(itinerary.rawZohoData?.dayActivities) && itinerary.rawZohoData.dayActivities.length > 0) {
    itinerary.rawZohoData.dayActivities.forEach((da: any) => {
      const c1 = String(da.city || '').trim();
      const c2 = String(da.city2 || '').trim();
      if (c1) addRouteCity(c1);
      if (c2 && c2.toLowerCase() !== c1.toLowerCase()) addRouteCity(c2);
    });
  }

  // C. Check dayPlans activities and titles
  if (routeCities.length <= 1 && Array.isArray(itinerary.dayPlans) && itinerary.dayPlans.length > 0) {
    itinerary.dayPlans.forEach((dp) => {
      (dp.activities || []).forEach(act => {
        const transferMatch = act.match(/Transfer\s+from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?:\s*\(|$)/i);
        if (transferMatch) {
          addRouteCity(transferMatch[1]);
          addRouteCity(transferMatch[2]);
        }
        const arrivalMatch = act.match(/Arrival\s+(?:in|at)\s+([A-Za-z\s]+?)(?:\s*&|$)/i);
        if (arrivalMatch) {
          addRouteCity(arrivalMatch[1]);
        }
      });
      if (dp.title) {
        const arrowMatch = dp.title.match(/(?:Journey|Drive|Transfer)\s+from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?:\s+with|\s*[|—–-]|$)/i);
        if (arrowMatch) {
          addRouteCity(arrowMatch[1]);
          addRouteCity(arrowMatch[2]);
        }
      }
      if (dp.stayLocation) {
        const parts = dp.stayLocation.split(',');
        const cityCandidate = cleanCityName(parts[parts.length - 1]);
        if (cityCandidate) addRouteCity(cityCandidate);
      }
    });
  }

  // D. Check rawHotels for night stays
  const rawHotels = itinerary.rawZohoData?.hotels || (Array.isArray(itinerary.stay) ? itinerary.stay : []);
  if (Array.isArray(rawHotels) && rawHotels.length > 0) {
    rawHotels.forEach((h: any) => {
      const c = cleanCityName(h.city || destination);
      const n = Number(h.nights) || 1;
      if (c) {
        if (routeCities.length <= 1) addRouteCity(c);
        cityStaysMap[c] = (cityStaysMap[c] || 0) + n;
      }
    });
  }

  if (routeCities.length === 0) {
    routeCities.push(destination);
  }

  const routeDisplay = routeCities.join(' → ');
  const routeSummary = Object.keys(cityStaysMap).length > 0
    ? Object.entries(cityStaysMap).map(([city, nights]) => `${nights}N ${city}`).join(' | ')
    : `${numNights}N ${destination}`;

  // Accommodations Table
  let accommodations: ManualAccommodation[] = [];
  if (Array.isArray(rawHotels) && rawHotels.length > 0) {
    accommodations = rawHotels.map((h: any) => {
      const hName = (h.hotelName || '').toLowerCase();
      let hRoomCat = (h.roomCategory || h.room || '').trim();

      if (!hRoomCat || hRoomCat === roomCategory || hRoomCat.includes('/')) {
        if (hName.includes('camp') || hName.includes('tent') || hName.includes('desert') || hName.includes('lakhmana')) {
          hRoomCat = 'Luxury Tent';
        } else if (roomCategory && !roomCategory.includes('/') && !roomCategory.includes('+')) {
          hRoomCat = roomCategory;
        } else {
          hRoomCat = 'Deluxe Room';
        }
      } else if (hRoomCat.toLowerCase().includes('luxury swiss tent') || hRoomCat.toLowerCase().includes('swiss tent')) {
        hRoomCat = 'Luxury Tent';
      }

      return {
        city: h.city || destination,
        nights: Number(h.nights) || 1,
        hotelName: h.hotelName || 'Handpicked Deluxe Property',
        roomCategory: hRoomCat || 'Deluxe Room'
      };
    });
  } else if (itinerary.hotelName || itinerary.stay?.hotelName) {
    const hName = (itinerary.hotelName || itinerary.stay?.hotelName || '').toLowerCase();
    const defaultCat = (hName.includes('camp') || hName.includes('tent') || hName.includes('desert')) ? 'Luxury Tent' : (roomCategory && !roomCategory.includes('/') ? roomCategory : 'Deluxe Room');
    accommodations = [{
      city: destination,
      nights: numNights,
      hotelName: itinerary.hotelName || itinerary.stay?.hotelName || 'Handpicked Deluxe Property',
      roomCategory: defaultCat
    }];
  } else {
    accommodations = [{
      city: destination,
      nights: numNights,
      hotelName: 'Curated Deluxe Property',
      roomCategory: roomCategory || 'Deluxe Room'
    }];
  }

  // Dynamic experiences for inclusions
  const dynamicExperiences: string[] = [];
  const seenExp = new Set<string>();

  if (Array.isArray(rawSubform)) {
    rawSubform.forEach(row => {
      const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? row.En_Route_Experiences ?? row.En_route ?? row.Enroute ?? row.en_route_experiences;
      const enRouteName = (typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : (typeof rawEnRoute === 'string' ? rawEnRoute : '')).trim();
      if (enRouteName && !seenExp.has(enRouteName.toLowerCase())) {
        seenExp.add(enRouteName.toLowerCase());
        dynamicExperiences.push(enRouteName.toLowerCase().startsWith('en-route') ? enRouteName : `En-route Experience: ${enRouteName}`);
      }

      for (let e = 1; e <= 10; e++) {
        const expKey = e === 1 ? (row.Experiences_and_activities || row.Experiences_1) : row[`Experiences_${e}`];
        if (!expKey) continue;
        const expName = (typeof expKey === 'object' && expKey !== null ? expKey.name : (typeof expKey === 'string' ? expKey : '')).trim();
        if (expName && !seenExp.has(expName.toLowerCase())) {
          seenExp.add(expName.toLowerCase());
          dynamicExperiences.push(expName);
        }
      }
    });
  }

  if (dynamicExperiences.length === 0 && itinerary.rawZohoData?.dayActivities && Array.isArray(itinerary.rawZohoData.dayActivities)) {
    itinerary.rawZohoData.dayActivities.forEach((da: any) => {
      if (da.enRouteExperiences) {
        const er = String(da.enRouteExperiences).trim();
        if (er && !seenExp.has(er.toLowerCase())) {
          seenExp.add(er.toLowerCase());
          dynamicExperiences.push(er.toLowerCase().startsWith('en-route') ? er : `En-route Experience: ${er}`);
        }
      }
      (da.experiences || []).forEach((exp: any) => {
        const name = (exp.name || '').trim();
        if (name && !seenExp.has(name.toLowerCase())) {
          seenExp.add(name.toLowerCase());
          dynamicExperiences.push(name);
        }
      });
    });
  }

  if (dynamicExperiences.length === 0 && Array.isArray(itinerary.dayPlans)) {
    itinerary.dayPlans.forEach((dp) => {
      (dp.activities || []).forEach(act => {
        let clean = act.replace(/^Transfer from.*$/i, '').replace(/^Arrival.*$/i, '').trim();
        clean = clean.replace(/\([^()]*\)/g, '').trim();
        if (clean && clean.length > 2 && !seenExp.has(clean.toLowerCase())) {
          seenExp.add(clean.toLowerCase());
          dynamicExperiences.push(clean);
        }
      });
    });
  }

  const rawLead = itinerary.rawZohoData?.rawLeadData || {};
  const hotelCategory = rawLead.Hotel_Category || rawLead.Preferred_Room_Category || itinerary.rawZohoData?.Hotel_Category || itinerary.rawZohoData?.Preferred_Room_Category || roomCategory || 'Deluxe';
  const cleanVehicle = (vehicleType || 'AC Vehicle').replace(/^Private\s+/i, '');

  const displayInclusions: string[] = [
    `Private ${cleanVehicle} for the complete ${destination} itinerary and Airport Transfers.`,
    `Accomodation in ${hotelCategory} Properties For ${numNights} Nights.`,
    `Meals ${mealPlan} ( Breakfast Except 1st Day , Dinner Last Day )`,
    `Driver allowance, fuel, toll taxes, parking charges and applicable road taxes.`,
    `All transfers and sightseeing as per the day-wise itinerary. Entry fees are excluded unless specifically mentioned.`,
    ...dynamicExperiences,
    `Assistance during hotel check-in and check-out.`,
    `Applicable taxes included in the quoted package, wherever applicable.`
  ];

  const displayExclusions: string[] = [
    `5% GST.`,
    `Early check-in (Before 1:00 PM) & Late Check-out (After 11:00 AM) at the hotel.`,
    `Any additional expenses of personal nature.`,
    `Additional accommodation/food costs incurred due to any delayed travel.`,
    `Any lunch and other meals not mentioned in Package Inclusions.`,
    `Any Airfare / Rail fare other than what is mentioned in "Inclusions" or any type of transportation.`,
    `Monument entry fees during Sightseeing.`
  ];

  const thingsToCarry = (itinerary.packingTips && itinerary.packingTips.length > 0)
    ? itinerary.packingTips
    : [
      'Original Government ID Proof (Aadhaar / Passport / Voter ID)',
      'Comfortable walking shoes & sunscreen / sunglasses',
      'Personal medications and first-aid essentials',
      'Camera / Mobile charger & Power Bank',
      'Warm layer / light jacket for travel & air-conditioning',
      'Rain jacket / Umbrella (as per season & terrain)'
    ];

  // Pricing
  const finalQuotationAmount = itinerary.finalQuotationAmount ?? itinerary.rawZohoData?.finalQuotationAmount ?? (itinerary.rawZohoData?.Final_Quotation_Amount ? Number(itinerary.rawZohoData.Final_Quotation_Amount) : (itinerary.rawZohoData?.Total_Package_Cost ? Number(itinerary.rawZohoData.Total_Package_Cost) : (itinerary.rawZohoData?.Quotation_Amount ? Number(itinerary.rawZohoData.Quotation_Amount) : (itinerary.rawZohoData?.Expected_Revenue ? Number(itinerary.rawZohoData.Expected_Revenue) : undefined))));

  const adults = Number(itinerary.adults ?? itinerary.rawZohoData?.adults ?? itinerary.rawZohoData?.Adults ?? guests) || 2;
  const kids = Number(itinerary.kids ?? itinerary.rawZohoData?.kids ?? itinerary.rawZohoData?.Kids ?? itinerary.rawZohoData?.Children ?? 0);

  const perAdultPrice = itinerary.perAdultPrice ?? itinerary.rawZohoData?.perAdultPrice ?? (itinerary.rawZohoData?.Per_Adult_Price ? Number(itinerary.rawZohoData.Per_Adult_Price) : (finalQuotationAmount && adults > 0 ? Math.round(finalQuotationAmount / adults) : undefined));
  const perKidPrice = itinerary.perKidPrice ?? itinerary.rawZohoData?.perKidPrice ?? (itinerary.rawZohoData?.Per_Kid_Price ? Number(itinerary.rawZohoData.Per_Kid_Price) : (itinerary.rawZohoData?.Per_Child_Price ? Number(itinerary.rawZohoData.Per_Child_Price) : undefined));

  const advanceAmountPaid = Number(
    itinerary.advanceAmountPaid ??
    itinerary.leadDetails?.advanceAmountPaid ??
    itinerary.rawZohoData?.Advance_Amount_Paid ??
    itinerary.rawZohoData?.advanceAmountPaid ??
    0
  );

  const balancePendingAmount = Number(
    itinerary.balancePendingAmount ??
    itinerary.leadDetails?.balancePendingAmount ??
    itinerary.rawZohoData?.Balance_Pending_Amount ??
    (finalQuotationAmount ? Math.max(0, finalQuotationAmount - advanceAmountPaid) : undefined)
  );

  const isIntl = (itinerary.destinationType || itinerary.rawZohoData?.Destination_Type || '').toLowerCase().includes('international');
  const gstPercentage = itinerary.gstPercentage !== undefined ? itinerary.gstPercentage : 5;
  const tcsPercentage = itinerary.tcsPercentage !== undefined ? itinerary.tcsPercentage : (isIntl ? 2 : 0);

  let baseAmount = itinerary.baseAmount ?? itinerary.rawZohoData?.Base_Amount;
  if (baseAmount === undefined && finalQuotationAmount) {
    const taxMultiplier = 1 + (gstPercentage + tcsPercentage) / 100;
    baseAmount = Math.round(finalQuotationAmount / taxMultiplier);
  }

  let gstAmount = itinerary.gstAmount ?? itinerary.rawZohoData?.GST_Amount;
  if (gstAmount === undefined && baseAmount) {
    gstAmount = Math.round(baseAmount * (gstPercentage / 100));
  }

  let tcsAmount = itinerary.tcsAmount ?? itinerary.rawZohoData?.TCS_Amount;
  if (tcsAmount === undefined && baseAmount && tcsPercentage > 0) {
    tcsAmount = Math.round(baseAmount * (tcsPercentage / 100));
  } else if (tcsPercentage === 0) {
    tcsAmount = 0;
  }

  const manualDayPlans: ManualDayPlan[] = (itinerary.dayPlans || []).map((dp, idx) => {
    let cleanTitle = dp.title || '';
    cleanTitle = cleanTitle.replace(/^Day\s*\d+\s*[|:–-]\s*/i, '');
    let prev = '';
    while (cleanTitle !== prev) {
      prev = cleanTitle;
      cleanTitle = cleanTitle.replace(/\([^()]*\)/g, '').replace(/\[[^[\]]*\]/g, '').trim();
    }
    cleanTitle = cleanTitle.replace(/\s{2,}/g, ' ').replace(/[.,:;–—\s]+$/g, '').trim();

    let dayRoute = '';
    let durationNote: string | undefined = dp.durationNote || undefined;

    // 1. Try from rawSubform
    const subRow = Array.isArray(rawSubform) ? rawSubform[idx] : null;
    if (subRow) {
      const rawC1 = typeof subRow.City === 'object' && subRow.City !== null ? subRow.City.name : String(subRow.City || '');
      const rawC2 = subRow.City_2 ?? subRow.City2 ?? subRow.Transit_City ?? subRow.Transit_city ?? '';
      const c1 = cleanCityName(String(rawC1 || ''));
      const c2 = cleanCityName(typeof rawC2 === 'object' && rawC2 !== null ? rawC2.name : String(rawC2 || ''));

      if (c2 && c1 && c2.toLowerCase() !== c1.toLowerCase()) {
        dayRoute = `${c1} → ${c2}`;
        const tInfo = getRouteTransitInfo(c1, c2);
        if (tInfo) {
          durationNote = `Approx. ${tInfo.distanceKm} KM | ${tInfo.duration} ${tInfo.mode}`;
        }
      } else if (c1) {
        dayRoute = c1;
      }
    }

    // 2. Try from rawZohoData.dayActivities
    if (!dayRoute && Array.isArray(itinerary.rawZohoData?.dayActivities) && itinerary.rawZohoData.dayActivities[idx]) {
      const da = itinerary.rawZohoData.dayActivities[idx];
      const c1 = cleanCityName(da.city || '');
      const c2 = cleanCityName(da.city2 || '');
      if (c2 && c1 && c2.toLowerCase() !== c1.toLowerCase()) {
        dayRoute = `${c1} → ${c2}`;
        const tInfo = getRouteTransitInfo(c1, c2);
        if (tInfo) {
          durationNote = `Approx. ${tInfo.distanceKm} KM | ${tInfo.duration} ${tInfo.mode}`;
        }
      } else if (c1) {
        dayRoute = c1;
      }
    }

    // 3. Try from activities / title
    if (!dayRoute) {
      for (const act of dp.activities || []) {
        const transferMatch = act.match(/Transfer\s+from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?:\s*\(|$)/i);
        if (transferMatch) {
          const from = cleanCityName(transferMatch[1]);
          const to = cleanCityName(transferMatch[2]);
          dayRoute = `${from} → ${to}`;
          const tInfo = getRouteTransitInfo(from, to);
          if (tInfo) {
            durationNote = `Approx. ${tInfo.distanceKm} KM | ${tInfo.duration} ${tInfo.mode}`;
          }
          break;
        }
      }
    }

    if (!dayRoute && dp.title) {
      const titleMatch = dp.title.match(/(?:Journey|Drive|Transfer)\s+from\s+([A-Za-z\s]+?)\s+to\s+([A-Za-z\s]+?)(?:\s+with|\s*[|—–-]|$)/i);
      if (titleMatch) {
        const from = cleanCityName(titleMatch[1]);
        const to = cleanCityName(titleMatch[2]);
        dayRoute = `${from} → ${to}`;
        const tInfo = getRouteTransitInfo(from, to);
        if (tInfo) {
          durationNote = `Approx. ${tInfo.distanceKm} KM | ${tInfo.duration} ${tInfo.mode}`;
        }
      }
    }

    // 4. Fallback for non-transit day: extract city from stayLocation or destination
    if (!dayRoute) {
      if (dp.stayLocation) {
        const parts = dp.stayLocation.split(',');
        dayRoute = cleanCityName(parts[parts.length - 1]);
      } else {
        dayRoute = destination;
      }
    }

    // Ensure durationNote is only present if there is inter-city travel (contains → or ->)
    if (!dayRoute.includes('→') && !dayRoute.includes('->')) {
      durationNote = undefined;
    }

    return {
      day: dp.day || idx + 1,
      date: dp.date || formatDayDate(rawStartDate, dp.day || idx + 1),
      title: cleanTitle || `Day ${dp.day || idx + 1} Highlights`,
      route: dayRoute || destination,
      durationNote,
      intro: undefined,
      timeline: (dp.timeline && dp.timeline.length > 0) ? dp.timeline : (dp.activities && dp.activities.length > 0 ? dp.activities : []),
      stayLocation: dp.stayLocation,
      image: dp.image || collageImages[idx % collageImages.length],
      meals: dp.meals
    };
  });

  const rawTitle = itinerary.title || `${numNights} Nights / ${numDays} Days ${destination} Tour Itinerary`;
  const cleanTitle = rawTitle
    .replace(/\b5[- ]?Star\b/gi, '')
    .replace(/\bLuxury\b/gi, '')
    .replace(/\bRoyal\s+/gi, '')
    .replace(/\bEscape\b/gi, 'Tour')
    .replace(/\bExclusive\b/gi, '')
    .replace(/\bCurated\b/gi, '')
    .replace(/\bPrivate Tour Quotation\b/gi, 'Tour Quotation')
    .replace(/\bPrivate Expedition\b/gi, 'Tour')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const finalTitle = cleanTitle && cleanTitle.toLowerCase() !== 'tour' && cleanTitle.toLowerCase() !== 'tour itinerary'
    ? cleanTitle
    : `${numNights} Nights / ${numDays} Days ${destination} Tour Itinerary`;

  const rawSubtitle = itinerary.subTitle || itinerary.travelStyle || `${destination.toUpperCase()} TOUR ITINERARY`;
  const cleanSub = rawSubtitle
    .replace(/—\s*EXCLUSIVE CURATED PRIVATE EXPEDITION/gi, 'TOUR ITINERARY')
    .replace(/EXCLUSIVE CURATED PRIVATE EXPEDITION/gi, 'TOUR ITINERARY')
    .replace(/\b5[- ]?Star\b/gi, '')
    .replace(/\bLuxury\b/gi, '')
    .replace(/\bRoyal\b/gi, '')
    .replace(/\bExclusive\b/gi, '')
    .replace(/\bCurated\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim();

  const finalSubtitle = cleanSub && cleanSub.length > 0 ? cleanSub : `${destination.toUpperCase()} TOUR ITINERARY`;

  const rawTravelStyle = itinerary.travelStyle || rawLead.Travel_Style || 'Customised Trip';
  const cleanTravelStyle = rawTravelStyle
    .replace(/\b5[- ]?Star\b/gi, '')
    .replace(/\bLuxury\b/gi, '')
    .replace(/\bExclusive\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Customised Trip';

  const rawTripType = itinerary.tripType || rawLead.Trip_Type || 'Customised Tour';
  const cleanTripType = rawTripType
    .replace(/\b5[- ]?Star\b/gi, '')
    .replace(/\bLuxury\b/gi, '')
    .replace(/\bExclusive\b/gi, '')
    .replace(/\s{2,}/g, ' ')
    .trim() || 'Customised Tour';

  return {
    id: itinerary.id,
    slug: itinerary.slug || itinerary.id,
    title: finalTitle,
    subtitle: finalSubtitle,
    duration,
    numNights,
    numDays,
    dates,
    route: routeDisplay,
    routeSummary,
    destination,
    travelStyle: cleanTravelStyle,
    tripType: cleanTripType,
    leadName,
    vehicleType,
    mealPlan,
    heroImage,
    galleryImages: collageImages,
    dayPlans: manualDayPlans,
    accommodations,
    inclusions: displayInclusions,
    exclusions: displayExclusions,
    thingsToCarry,
    finalQuotationAmount,
    perAdultPrice,
    perKidPrice,
    adults,
    kids,
    baseAmount,
    gstPercentage,
    tcsPercentage,
    gstAmount,
    tcsAmount,
    advanceAmountPaid,
    balancePendingAmount,
    paymentStage: itinerary.paymentStage || (advanceAmountPaid >= (finalQuotationAmount || 1) ? 'fully_paid' : (advanceAmountPaid > 0 ? 'token_paid' : 'unpaid')),
    payments: itinerary.payments || []
  };
}
