import fs from 'fs';
import path from 'path';

const filePath = path.resolve('data/manual-itineraries.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Check if already added
if (content.includes('rajasthanJignaManualItinerary')) {
  console.log('rajasthanJignaManualItinerary already exists in file. Cleaning up first...');
  // We can strip it if re-running
  const startIdx = content.indexOf('export const rajasthanJignaManualItinerary: ManualItinerary = {');
  if (startIdx !== -1) {
    const endMarker = 'export const manualItinerariesRegistry: Record<string, ManualItinerary> = {';
    const endIdx = content.indexOf(endMarker);
    if (endIdx !== -1) {
      content = content.slice(0, startIdx) + content.slice(endIdx);
    }
  }
}

const jignaItineraryCode = `
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
    'Camera with extra memory cards to capture Rajasthan\\'s magnificent heritage and wildlife.'
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
`;

// Insert before manualItinerariesRegistry
const registryMarker = 'export const manualItinerariesRegistry: Record<string, ManualItinerary> = {';
const registryIdx = content.indexOf(registryMarker);

if (registryIdx === -1) {
  console.error('registryMarker not found in data/manual-itineraries.ts');
  process.exit(1);
}

content = content.slice(0, registryIdx) + jignaItineraryCode + '\n' + content.slice(registryIdx);

// Add registry keys
const newKeys = `  'rajasthan-jigna': rajasthanJignaManualItinerary,
  'royal-rajasthan-jigna': rajasthanJignaManualItinerary,
  'jigna': rajasthanJignaManualItinerary,
  'mrs-jigna': rajasthanJignaManualItinerary,
  'mrs-jigna-mam': rajasthanJignaManualItinerary,
  'jigna-mam': rajasthanJignaManualItinerary,
  'rajasthan-jigna-mam': rajasthanJignaManualItinerary,
  'wp-rajasthan-jigna': rajasthanJignaManualItinerary,
  'royal-rajasthan-escape-jigna': rajasthanJignaManualItinerary,
`;

if (!content.includes("'rajasthan-jigna': rajasthanJignaManualItinerary")) {
  content = content.replace(registryMarker, registryMarker + '\n' + newKeys);
}

// Add to getAllManualItineraries
if (!content.includes('rajasthanJignaManualItinerary\n  ];') && !content.includes('rajasthanJignaManualItinerary\n];')) {
  content = content.replace(
    'rajasthanRoyalEscapeManualItinerary\n  ];',
    'rajasthanRoyalEscapeManualItinerary,\n    rajasthanJignaManualItinerary\n  ];'
  );
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Successfully added rajasthanJignaManualItinerary with moments to data/manual-itineraries.ts!');
