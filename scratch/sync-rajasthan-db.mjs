import fs from 'fs';
import { MongoClient } from 'mongodb';

let uri = '';
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf8');
  for (const line of content.split('\n')) {
    if (line.trim().startsWith('MONGODB_URI=')) {
      uri = line.trim().substring('MONGODB_URI='.length).replace(/^['"]|['"]$/g, '').trim();
    }
  }
}

const docData = {
  id: 'rajasthan-royal-experience',
  slug: 'rajasthan-royal-experience',
  title: 'Royal Rajasthan Experience – 9 Nights / 10 Days',
  subTitle: 'Wanderphilia Exclusive | Family Trip',
  description: 'Custom 9 Nights / 10 Days expedition exploring Jaipur 2 Nights → Jaisalmer 1 Night → Jodhpur 2 Nights → Jawai 1 Night → Mount Abu 1 Night → Udaipur 2 Nights',
  destination: 'Rajasthan',
  stateOrCountry: 'Rajasthan, India',
  travelStyle: 'Family Trip',
  tripType: 'Customised Trip',
  vehicleType: 'Private AC Vehicle with Dedicated Tour Chauffeur',
  noOfDays: 10,
  noOfNights: 9,
  leadDetails: {
    name: 'Valued Traveler',
    firstName: 'Valued Traveler',
    duration: '9 Nights / 10 Days | 30 October – 8 November 2026',
    startDate: '30 October 2026',
    endDate: '08 November 2026',
    guests: 3,
    noOfDays: 10,
    noOfNights: 9,
    travelStyle: 'Family Trip',
    tripType: 'Customised Trip',
    vehicleType: 'Private AC Vehicle with Dedicated Tour Chauffeur',
    mealPlan: 'Breakfast & Dinner (MAP Plan) (Breakfast except Day 1 & Dinner on last day)'
  },
  stay: {
    hotelName: 'Hotel Kalyan (Jaipur, 2N), Lakhmana Dessert Camp (Jaisalmer, 1N), Krishna Prakash Heritage Haveli (Jodhpur, 2N), Thar Resort (Jawai, 1N), Hotel Rock Regency (Mount Abu, 1N), Mewar Haveli (Udaipur, 2N)',
    roomCategory: 'Deluxe & Luxury Heritage Rooms / Swiss Desert Tent',
    mealPlan: 'Breakfast & Dinner (MAP Plan)'
  },
  hotelName: 'Hotel Kalyan, Lakhmana Dessert Camp, Krishna Prakash Haveli, Thar Resort, Hotel Rock Regency, Mewar Haveli',
  roomCategory: 'Deluxe & Luxury Heritage Rooms / Swiss Desert Tent',
  mealPlan: 'Breakfast & Dinner (MAP Plan)',
  finalQuotationAmount: 139020,
  baseAmount: 132400,
  gstPercentage: 5,
  gstAmount: 6620,
  tcsPercentage: 0,
  tcsAmount: 0,
  adults: 3,
  kids: 0,
  perAdultPrice: 46340,
  heroImage: '/images/Rajasthan/rajasthan1.jpeg',
  galleryImages: [
    '/images/Rajasthan/rajasthan1.jpeg',
    '/images/Rajasthan/rajasthan2.jpeg',
    '/images/Rajasthan/rajasthan3.jpeg',
    '/images/Rajasthan/rajasthan4.jpeg',
    '/images/Rajasthan/rajasthan5.jpg',
    '/images/Rajasthan/rajasthan6.jpg'
  ],
  dayPlans: [
    {
      day: 1,
      title: 'DAY 1 | Friday, 30th October – Arrival in Jaipur | Kisan Bagh & Nahargarh Sunset Dining',
      description: 'Arrive in Jaipur and meet your private driver. Proceed towards the city and begin your Rajasthan journey.\n\nVisit Kisan Bagh, a beautifully landscaped destination showcasing Rajasthan’s natural beauty, traditional landscape and serene surroundings.\n\nLater, proceed towards Nahargarh Fort, located on the Aravalli Hills and offering spectacular panoramic views of Jaipur.\n\nAs the sun sets, enjoy a memorable sunset experience overlooking the Pink City, followed by a special dining experience at RTDC Durg Cafeteria at Nahargarh Fort.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      stayLocation: 'Hotel Kalyan, Jaipur',
      activities: [
        'Arrival in Jaipur & Private Chauffeur Meet',
        'Kisan Bagh Landscape & Traditional Nature Walk',
        'Nahargarh Fort Panoramic Viewpoint atop Aravalli Hills',
        'Pink City Sunset Experience',
        'Sunset Dining at RTDC Durg Cafeteria'
      ],
      timeline: [
        'Arrival in Jaipur & Private Chauffeur Meet',
        'Kisan Bagh Landscape & Traditional Nature Walk',
        'Nahargarh Fort Panoramic Viewpoint atop Aravalli Hills',
        'Pink City Sunset Experience',
        'Sunset Dining at RTDC Durg Cafeteria'
      ],
      image: '/images/Rajasthan/rajasthan1.jpeg',
      meals: 'Dinner Only'
    },
    {
      day: 2,
      title: 'DAY 2 | Saturday, 31st October – Jaipur Heritage Tour | Hawa Mahal, City Palace, Amber Fort & Maota Lake Experience',
      description: 'After breakfast, proceed for a full-day sightseeing tour of Jaipur, exploring the city’s rich royal heritage and architectural landmarks.\n\nBegin with a visit to Hawa Mahal, one of Jaipur’s most iconic landmarks, known for its distinctive honeycomb-style façade.\n\nContinue to City Palace, a magnificent royal complex showcasing Jaipur’s royal history, architecture and cultural heritage.\n\nLater, proceed towards Amber Fort, one of Rajasthan’s most impressive hill forts, known for its grand courtyards, palaces and beautiful artistic architecture.\n\nEnjoy a unique experience at Maota Lake with a luxury boat ride accompanied by a traditional Rajasthani folk dance experience.\n\nIn the evening, visit The Stag Rooftop Restaurant for a special dining experience overlooking Amber Fort, followed by a Sound & Light Show.\n\nLater, return to the hotel and relax.',
      stayLocation: 'Hotel Kalyan, Jaipur',
      activities: [
        'Hawa Mahal Honeycomb Façade',
        'City Palace Royal Heritage Complex',
        'Amber Fort Grand Courtyards & Palaces',
        'Maota Lake Luxury Boat Ride',
        'Traditional Rajasthani Folk Dance Performance',
        'Special Dining at The Stag Rooftop Restaurant',
        'Sound & Light Show overlooking Amber Fort'
      ],
      timeline: [
        'Hawa Mahal Honeycomb Façade',
        'City Palace Royal Heritage Complex',
        'Amber Fort Grand Courtyards & Palaces',
        'Maota Lake Luxury Boat Ride',
        'Traditional Rajasthani Folk Dance Performance',
        'Special Dining at The Stag Rooftop Restaurant',
        'Sound & Light Show overlooking Amber Fort'
      ],
      image: '/images/Rajasthan/rajasthan2.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 3,
      title: 'DAY 3 | Sunday, 1st November – Jaipur → Jaisalmer | Thar Desert Camp, Camel Safari & Cultural Evening',
      description: 'After breakfast, check out from the hotel and proceed towards Jaisalmer, travelling through the scenic landscapes of Rajasthan and the Thar Desert.\n\nOn arrival in Jaisalmer, proceed towards Sam Sand Dunes and check in to your desert camp.\n\nIn the evening, enjoy a memorable camel safari across the golden sand dunes and experience the spectacular sunset over the Thar Desert.\n\nLater, enjoy a traditional Rajasthani cultural evening featuring folk music and dance performances.\n\nExperience the authentic desert atmosphere with traditional Rajasthani dinner and cultural entertainment under the desert sky.',
      stayLocation: 'Lakhmana Dessert Camp, Jaisalmer',
      activities: [
        'Scenic Drive towards Jaisalmer & Thar Desert',
        'Sam Sand Dunes & Desert Camp Check-in',
        'Camel Safari across Golden Sand Dunes',
        'Spectacular Sunset over Thar Desert',
        'Rajasthani Folk Music & Dance Performance',
        'Traditional Rajasthani Dinner under Desert Sky'
      ],
      timeline: [
        'Scenic Drive towards Jaisalmer & Thar Desert',
        'Sam Sand Dunes & Desert Camp Check-in',
        'Camel Safari across Golden Sand Dunes',
        'Spectacular Sunset over Thar Desert',
        'Rajasthani Folk Music & Dance Performance',
        'Traditional Rajasthani Dinner under Desert Sky'
      ],
      image: '/images/Rajasthan/rajasthan3.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 4,
      title: 'DAY 4 | Monday, 2nd November – Jaisalmer Heritage Tour → Jodhpur | Golden Fort, Havelis, Bada Bagh & Gadisar Lake',
      description: 'After breakfast, check out from the desert camp and proceed towards Jaisalmer city.\n\nBegin your sightseeing with a visit to the magnificent Jaisalmer Fort, also known as the Golden Fort, rising dramatically from the golden desert landscape.\n\nContinue to Patwon Ki Haveli, one of Jaisalmer’s finest examples of traditional Rajasthani architecture and craftsmanship.\n\nLater, visit Bada Bagh, famous for its impressive royal cenotaphs set against the desert landscape.\n\nProceed towards Gadisar Lake, a historic water reservoir surrounded by temples, shrines and traditional architecture.\n\nAfter completing the sightseeing, proceed towards Jodhpur, the famous Blue City of Rajasthan.\n\nOn arrival, check in to your hotel and relax after the journey.',
      stayLocation: 'Krishna Prakash Heritage Haveli, Jodhpur',
      activities: [
        'Jaisalmer Fort (Golden Fort) Exploration',
        'Patwon Ki Haveli Architecture & Craftsmanship',
        'Bada Bagh Royal Cenotaphs',
        'Gadisar Lake Historic Reservoirs & Temples',
        'Transfer: Jaisalmer → Jodhpur (Blue City)',
        'Check-in & Relaxation in Jodhpur'
      ],
      timeline: [
        'Jaisalmer Fort (Golden Fort) Exploration',
        'Patwon Ki Haveli Architecture & Craftsmanship',
        'Bada Bagh Royal Cenotaphs',
        'Gadisar Lake Historic Reservoirs & Temples',
        'Transfer: Jaisalmer → Jodhpur (Blue City)',
        'Check-in & Relaxation in Jodhpur'
      ],
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 5,
      title: 'DAY 5 | Tuesday, 3rd November – Jodhpur Heritage Tour | Mehrangarh Fort, Blue City & Panchatiya Hills Sunset',
      description: 'After breakfast, proceed for a full-day sightseeing tour of Jodhpur, exploring the city’s rich royal heritage and famous Blue City landscapes.\n\nVisit the magnificent Mehrangarh Fort & Museum, one of Rajasthan’s most iconic forts, offering spectacular views of the historic Blue City.\n\nContinue with a Blue City Tour, exploring the traditional blue-painted houses, narrow lanes and historic neighbourhoods of Jodhpur.\n\nLater, proceed towards Panchatiya Hills for a beautiful sunset experience overlooking the Blue City.\n\nEnjoy the evening atmosphere and panoramic views before returning to the hotel.',
      stayLocation: 'Krishna Prakash Heritage Haveli, Jodhpur',
      activities: [
        'Mehrangarh Fort & Royal Museum',
        'Historic Blue City Walking Tour',
        'Traditional Blue-Painted Lanes of Jodhpur',
        'Panchatiya Hills Viewpoint',
        'Panoramic Sunset over Blue City'
      ],
      timeline: [
        'Mehrangarh Fort & Royal Museum',
        'Historic Blue City Walking Tour',
        'Traditional Blue-Painted Lanes of Jodhpur',
        'Panchatiya Hills Viewpoint',
        'Panoramic Sunset over Blue City'
      ],
      image: '/images/Rajasthan/rajasthan4.jpeg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 6,
      title: 'DAY 6 | Wednesday, 4th November – Jodhpur → Jawai | Umaid Bhawan Palace, Jaswant Thada & Wildlife Safari',
      description: 'After breakfast, proceed for a visit to Umaid Bhawan Palace, one of India’s grandest palace residences and an important symbol of Jodhpur’s royal heritage.\n\nContinue to Jaswant Thada, an elegant white-marble memorial surrounded by peaceful gardens and scenic surroundings.\n\nLater, check out from the hotel and proceed towards Jawai.\n\nOn arrival, check in to your Jawai accommodation and relax.\n\nIn the evening, embark on an exciting Jawai Wildlife Safari, exploring the unique granite landscape and natural habitat of the famous Jawai leopards.\n\nEnjoy a spectacular sunset wildlife experience amidst the Jawai hills before returning to the accommodation.',
      stayLocation: 'Thar Resort, Jawai',
      activities: [
        'Umaid Bhawan Palace Royal Residence',
        'Jaswant Thada White-Marble Memorial',
        'Transfer: Jodhpur → Jawai Granite Region',
        'Check-in & Relaxation at Thar Resort',
        '4x4 Open Gypsy Jawai Leopard Safari',
        'Spectacular Sunset Safari in Granite Hills'
      ],
      timeline: [
        'Umaid Bhawan Palace Royal Residence',
        'Jaswant Thada White-Marble Memorial',
        'Transfer: Jodhpur → Jawai Granite Region',
        'Check-in & Relaxation at Thar Resort',
        '4x4 Open Gypsy Jawai Leopard Safari',
        'Spectacular Sunset Safari in Granite Hills'
      ],
      image: '/images/Rajasthan/rajasthan7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 7,
      title: 'DAY 7 | Thursday, 5th November – Jawai → Mount Abu | Dilwara Temples, Market & Nakki Lake Sunset',
      description: 'After breakfast, check out from your Jawai accommodation and proceed towards Mount Abu, Rajasthan’s only hill station.\n\nOn arrival, check in to the hotel and relax.\n\nLater, visit the magnificent Dilwara Temples, renowned for their intricate marble carvings and extraordinary craftsmanship.\n\nExplore Mount Abu Market and enjoy some leisure time exploring the local surroundings.\n\nIn the evening, proceed towards Nakki Lake for a relaxing boat ride and beautiful sunset experience.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      stayLocation: 'Hotel Rock Regency, Mount Abu',
      activities: [
        'Drive: Jawai → Mount Abu Hill Station',
        'Check-in at Hotel Rock Regency',
        'Dilwara Temples Exquisite Marble Carvings',
        'Mount Abu Market Leisure Stroll',
        'Nakki Lake Relaxing Sunset Boat Ride'
      ],
      timeline: [
        'Drive: Jawai → Mount Abu Hill Station',
        'Check-in at Hotel Rock Regency',
        'Dilwara Temples Exquisite Marble Carvings',
        'Mount Abu Market Leisure Stroll',
        'Nakki Lake Relaxing Sunset Boat Ride'
      ],
      image: '/images/Rajasthan/rajasthan7.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 8,
      title: 'DAY 8 | Friday, 6th November – Mount Abu → Kumbhalgarh → Udaipur | Fort & Lake Pichola Experience',
      description: 'After breakfast, check out from the hotel and proceed towards Udaipur.\n\nEn route, visit the magnificent Kumbhalgarh Fort, famous for its massive fortifications, historic architecture and spectacular Aravalli surroundings.\n\nContinue the journey towards Udaipur, the beautiful City of Lakes.\n\nOn arrival, check in to your hotel and relax.\n\nIn the evening, enjoy a memorable Lake Pichola Boat Ride, surrounded by Udaipur’s beautiful palaces, historic ghats and scenic lake views.\n\nDuring the boat ride, enjoy views of the magnificent Jag Mandir Palace, located on an island in Lake Pichola.\n\nLater, return to the hotel and relax.',
      stayLocation: 'Mewar haveli, Udaipur',
      activities: [
        'En-route Visit to Kumbhalgarh Fort & Great Wall',
        'Scenic Drive to Udaipur (City of Lakes)',
        'Check-in at Mewar Haveli & Relaxation',
        'Sunset Boat Ride on Lake Pichola',
        'Views of Jag Mandir Palace & Historic Ghats'
      ],
      timeline: [
        'En-route Visit to Kumbhalgarh Fort & Great Wall',
        'Scenic Drive to Udaipur (City of Lakes)',
        'Check-in at Mewar Haveli & Relaxation',
        'Sunset Boat Ride on Lake Pichola',
        'Views of Jag Mandir Palace & Historic Ghats'
      ],
      image: '/images/Rajasthan/rajasthan5.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 9,
      title: 'DAY 9 | Saturday, 7th November – Udaipur Heritage Tour | City Palace, Saheliyon Ki Bari, Monsoon Palace & Shilpgram',
      description: 'After breakfast, proceed for a full-day sightseeing tour of Udaipur.\n\nVisit the magnificent City Palace, one of Rajasthan’s most impressive royal complexes, overlooking the beautiful Lake Pichola.\n\nContinue to Saheliyon Ki Bari, a historic garden known for its fountains, marble structures, lush greenery and peaceful surroundings.\n\nLater, proceed towards Sajjangarh Monsoon Palace, dramatically positioned on a hilltop overlooking Udaipur and its surrounding lakes.\n\nEnd the day with a visit to Shilpgram, a cultural village showcasing traditional Rajasthani arts, crafts, rural life and cultural heritage.\n\nLater, return to the hotel and enjoy a relaxed evening.',
      stayLocation: 'Mewar haveli, Udaipur',
      activities: [
        'City Palace Grand Royal Complex',
        'Saheliyon Ki Bari Historic Fountains & Gardens',
        'Sajjangarh Monsoon Palace Hilltop Panorama',
        'Shilpgram Traditional Arts & Rural Crafts Village',
        'Relaxed Heritage Evening at Mewar Haveli'
      ],
      timeline: [
        'City Palace Grand Royal Complex',
        'Saheliyon Ki Bari Historic Fountains & Gardens',
        'Sajjangarh Monsoon Palace Hilltop Panorama',
        'Shilpgram Traditional Arts & Rural Crafts Village',
        'Relaxed Heritage Evening at Mewar Haveli'
      ],
      image: '/images/Rajasthan/rajasthan6.jpg',
      meals: 'Breakfast & Dinner'
    },
    {
      day: 10,
      title: 'DAY 10 | Sunday, 8th November – Udaipur | Jagdish Temple → Departure',
      description: 'After breakfast, visit the historic Jagdish Temple, one of Udaipur’s most important temples and a fine example of Indo-Aryan architecture.\n\nLater, return to the hotel and complete the check-out formalities.\n\nAfter check-out, proceed towards Udaipur Railway Station / Airport for your onward journey.\n\nTour Ends with beautiful memories of Royal Rajasthan. 🧡',
      stayLocation: 'Departure Transfer',
      activities: [
        'Jagdish Temple Indo-Aryan Architectural Visit',
        'Hotel Check-out Formalities',
        'Departure Transfer to Udaipur Railway Station / Airport',
        'Tour Ends with beautiful memories of Royal Rajasthan 🧡'
      ],
      timeline: [
        'Jagdish Temple Indo-Aryan Architectural Visit',
        'Hotel Check-out Formalities',
        'Departure Transfer to Udaipur Railway Station / Airport',
        'Tour Ends with beautiful memories of Royal Rajasthan 🧡'
      ],
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
  packingTips: [
    'Valid Government-Issued Photo ID Cards (Aadhaar / Passport / Driving License)',
    'Comfortable cotton clothing for daytime sightseeing & light woollens / shawls for desert evenings',
    'Comfortable walking shoes & sandals for fort and temple exploration',
    'Sunglasses, Sunscreen Lotion & Sun Hat for daytime excursions',
    'Camera / Smartphone with extra battery packs for desert and wildlife photography',
    'Personal medicines and basic travel first-aid kit'
  ],
  status: 'active',
  updatedAt: new Date().toISOString()
};

async function syncDb() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');
  const collection = db.collection('itineraries');

  // Upsert for rajasthan-royal-experience
  await collection.updateOne(
    { id: 'rajasthan-royal-experience' },
    { $set: { ...docData, id: 'rajasthan-royal-experience', slug: 'rajasthan-royal-experience' } },
    { upsert: true }
  );

  // Upsert for royal-rajasthan-experience
  await collection.updateOne(
    { id: 'royal-rajasthan-experience' },
    { $set: { ...docData, id: 'royal-rajasthan-experience', slug: 'royal-rajasthan-experience' } },
    { upsert: true }
  );

  // Upsert for wp-4002b3f4
  await collection.updateOne(
    { id: 'wp-4002b3f4' },
    { $set: { ...docData, id: 'wp-4002b3f4', slug: 'wp-4002b3f4' } },
    { upsert: true }
  );

  console.log('Successfully synced MongoDB itineraries for rajasthan-royal-experience, royal-rajasthan-experience, and wp-4002b3f4!');
  await client.close();
}

syncDb();
