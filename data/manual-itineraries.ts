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
  heroImage: '/images/himachal1.jpg',
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
      image: '/images/himachal1.jpg',
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
      image: '/images/himachal1.jpg',
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

export const manualItinerariesRegistry: Record<string, ManualItinerary> = {
  'himachal-explorer': himachalExplorerManualItinerary,
  'wanderphilia-signature-himachal-explorer': himachalExplorerManualItinerary,
  'wp-himachal-explorer': himachalExplorerManualItinerary
};

export function getManualItinerary(idOrSlug: string): ManualItinerary | null {
  if (!idOrSlug) return null;
  const key = idOrSlug.toLowerCase().trim();
  return manualItinerariesRegistry[key] || Object.values(manualItinerariesRegistry).find(
    it => it.id.toLowerCase() === key || it.slug.toLowerCase() === key
  ) || null;
}

export function getAllManualItineraries(): ManualItinerary[] {
  return [himachalExplorerManualItinerary];
}

/**
 * Helper to convert a ManualItinerary into an ItineraryDocument format
 */
export function manualItineraryToDocument(manual: ManualItinerary): ItineraryDocument {
  return {
    id: manual.id,
    slug: manual.slug,
    title: manual.title,
    subTitle: manual.subtitle || `${manual.numNights} Nights / ${manual.numDays} Days Signature Experience`,
    description: `Custom ${manual.duration} expedition exploring ${manual.route}`,
    destination: manual.destination,
    stateOrCountry: 'Himachal Pradesh, India',
    travelStyle: manual.travelStyle || 'Signature Tour',
    tripType: manual.tripType || 'Customised Trip',
    vehicleType: manual.vehicleType || '17 Seater Tempo Traveller',
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
      hotelName: manual.accommodations?.[0]?.hotelName || 'Deluxe Mountain Property',
      roomCategory: manual.accommodations?.[0]?.roomCategory || 'Triple Sharing Basis',
      mealPlan: manual.mealPlan
    },
    hotelName: manual.accommodations?.[0]?.hotelName || 'Deluxe Mountain Property',
    roomCategory: manual.accommodations?.[0]?.roomCategory || 'Triple Sharing Basis',
    mealPlan: manual.mealPlan,
    finalQuotationAmount: manual.finalQuotationAmount,
    perAdultPrice: manual.perAdultPrice,
    perKidPrice: manual.perKidPrice,
    adults: manual.adults || 2,
    kids: manual.kids || 0,
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
    highlights: [
      'Scenic drive through Kangra Valley & McLeod Ganj',
      'Dalai Lama Temple & Bhagsu Waterfall',
      'Colonial Charm & Cafés of Dalhousie',
      'Khajjiar - The Mini Switzerland of Himachal',
      'Bir Tibetan Colony & Sunset Paragliding',
      'Snow Activities in Solang Valley & New Year Party in Manali',
      'River Rafting Experience in Manali',
      'Kasol & Parvati Valley Exploration'
    ],
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
