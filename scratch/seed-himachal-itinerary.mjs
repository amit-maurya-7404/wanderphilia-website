import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// Read .env.local
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri && fs.existsSync('.env.local')) {
  const envContent = fs.readFileSync('.env.local', 'utf-8');
  const match = envContent.match(/MONGODB_URI=(.+)/);
  if (match) {
    mongoUri = match[1].trim().replace(/^['"]|['"]$/g, '');
  }
}

async function seed() {
  if (!mongoUri) {
    console.log('No MONGODB_URI found, skipping mongo seed.');
    return;
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db();
  const collection = db.collection('itineraries');

  const himachalDoc = {
    id: 'wp-himachal-explorer',
    slug: 'himachal-explorer',
    title: 'Wanderphilia Signature Himachal Explorer',
    subTitle: '9 Nights / 10 Days | 25 December – 3 January',
    description: 'Custom 9 Nights / 10 Days expedition exploring Chandigarh → Dharamshala → Dalhousie → Bir → Manali → Kasol → Chandigarh.',
    destination: 'Himachal Pradesh',
    stateOrCountry: 'Himachal Pradesh, India',
    travelStyle: 'Signature Explorer Trip',
    tripType: 'Curated Group / Customised Tour',
    vehicleType: '17 Seater Tempo Traveller',
    noOfDays: 10,
    noOfNights: 9,
    leadDetails: {
      name: 'Valued Traveler',
      firstName: 'Valued',
      duration: '9 Nights / 10 Days | 25 December – 3 January',
      noOfDays: 10,
      noOfNights: 9,
      travelStyle: 'Signature Explorer Trip',
      tripType: 'Curated Group / Customised Tour',
      vehicleType: '17 Seater Tempo Traveller',
      mealPlan: 'Breakfast & Dinner (Breakfast except for Day 1 & Dinner for day 10)'
    },
    stay: {
      hotelName: 'Deluxe Property on Triple Sharing Basis',
      roomCategory: 'Triple Sharing Basis',
      mealPlan: 'Breakfast & Dinner (Breakfast except for Day 1 & Dinner for day 10)'
    },
    hotelName: 'Deluxe Property on Triple Sharing Basis',
    roomCategory: 'Triple Sharing Basis',
    mealPlan: 'Breakfast & Dinner (Breakfast except for Day 1 & Dinner for day 10)',
    dayPlans: [
      {
        day: 1,
        title: 'Day 1 | 25 Dec Chandigarh → Dharamshala',
        description: 'Your Himachal adventure begins with a scenic drive from Chandigarh towards the mountains.',
        stayLocation: 'Dharamshala',
        activities: [
          'Approx. 6–7 hrs scenic drive',
          'Pickup from Chandigarh',
          'Scenic drive through the Kangra Valley',
          'Check-in and freshen up',
          'Evening exploration of McLeod Ganj',
          'Discover local cafés and mountain streets',
          'Sunset at Naddi View Point',
          'Tibetan Market stroll'
        ],
        timeline: [
          'Pickup from Chandigarh',
          'Scenic drive through the Kangra Valley',
          'Check-in and freshen up',
          'Evening exploration of McLeod Ganj',
          'Discover local cafés and mountain streets',
          'Sunset at Naddi View Point',
          'Tibetan Market stroll'
        ],
        image: '/images/himachal1.jpg',
        meals: 'Dinner'
      },
      {
        day: 2,
        title: 'Day 2 | 26 Dec Dharamshala & McLeod Ganj — Culture, Cafés & Mountains',
        description: 'After breakfast, explore the cultural heart of Dharamshala.',
        stayLocation: 'Dharamshala',
        activities: [
          'Dalai Lama Temple Complex',
          'Namgyal Monastery',
          'Bhagsunag Temple',
          'Bhagsu Waterfall',
          'St. John in the Wilderness Church',
          'Evening: Café hopping in McLeod Ganj',
          'Local shopping & exploring charming lanes',
          'Optional: Half-day Triund hike, subject to weather, trail conditions and fitness.'
        ],
        timeline: [
          'Dalai Lama Temple Complex',
          'Namgyal Monastery',
          'Bhagsunag Temple',
          'Bhagsu Waterfall',
          'St. John in the Wilderness Church',
          'Evening: Café hopping in McLeod Ganj & Local shopping',
          'Optional: Half-day Triund hike, subject to weather, trail conditions and fitness.'
        ],
        image: '/images/himachal2.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 3,
        title: 'Day 3 | 27 Dec Dharamshala → Dalhousie',
        description: 'Leave the Kangra Valley behind and journey towards the colonial charm of Dalhousie.',
        stayLocation: 'Dalhousie',
        activities: [
          'Approx. 4–5 hrs scenic drive',
          'After check-in: Gandhi Chowk & Subhash Chowk',
          'Explore the local market',
          'Relaxed evening at a cosy café'
        ],
        timeline: [
          'Journey from Kangra Valley towards colonial Dalhousie',
          'Check-in at Dalhousie property',
          'Gandhi Chowk & Subhash Chowk exploration',
          'Explore the local market',
          'Relaxed evening at a cosy café'
        ],
        image: '/images/himachal3.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 4,
        title: 'Day 4 | 28 Dec Khajjiar — The Mini Switzerland of Himachal',
        description: 'A beautiful day exploring the forests and meadows surrounding Dalhousie.',
        stayLocation: 'Dalhousie',
        activities: [
          'Drive to Khajjiar',
          'Explore the famous Khajjiar Meadows',
          'Photography & leisure time',
          'Optional horse riding & adventure activities',
          'Kalatop Wildlife Sanctuary / nature walk, subject to time and conditions',
          'Return to Dalhousie by evening for a relaxed evening'
        ],
        timeline: [
          'Drive to Khajjiar',
          'Explore the famous Khajjiar Meadows',
          'Photography & leisure time',
          'Optional horse riding & adventure activities',
          'Kalatop Wildlife Sanctuary / nature walk',
          'Return to Dalhousie for relaxed evening at own pace'
        ],
        image: '/images/himachal4.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 5,
        title: 'Day 5 | 29 Dec Dalhousie → Bir',
        description: 'Today, the journey takes you towards one of Himachal’s most vibrant adventure towns.',
        stayLocation: 'Bir',
        activities: [
          'Approx. 5–6 hrs drive to Bir',
          'Check-in and relax',
          'Explore Bir Monastery',
          'Walk through the Tibetan Colony',
          'Sunset at Bir Landing Site',
          'Discover Bir’s independent cafés',
          'Signature Experience: Watch the paragliders soar over the valley at sunset',
          'Optional: Paragliding experience, subject to weather and operational conditions'
        ],
        timeline: [
          'Check-in and relax at Bir',
          'Explore Bir Monastery & Tibetan Colony',
          'Sunset at Bir Landing Site',
          'Discover Bir’s independent cafés',
          'Signature: Watch paragliders soar over the valley at sunset',
          'Optional: Paragliding experience'
        ],
        image: '/images/himachal5.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 6,
        title: 'Day 6 | 30 Dec Bir → Manali',
        description: 'A scenic journey deeper into the Himalayas. Enjoy the changing landscapes as you make your way towards Manali.',
        stayLocation: 'Manali',
        activities: [
          'Approx. 6–7 hrs scenic mountain drive',
          'On arrival: Check-in and unwind',
          'Explore Old Manali',
          'Café hopping',
          'Riverside / mountain-side stroll',
          'Live music in the evening',
          'Get ready — New Year celebrations are around the corner!'
        ],
        timeline: [
          'Scenic journey deeper into the Himalayas towards Manali',
          'Check-in and unwind',
          'Explore Old Manali & café hopping',
          'Riverside / mountain-side stroll',
          'Live music in the evening'
        ],
        image: '/images/himachal6.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 7,
        title: 'Day 7 | 31 Dec Manali — Snow, Adventure & New Year’s Eve 🎉',
        description: 'Solang Valley snow activities followed by grand New Year’s Eve mountain celebration.',
        stayLocation: 'Manali',
        activities: [
          'Solang Valley: Snow activities, Ropeway, ATV, Zipline, Paragliding',
          'Visit Nehru Kund, Vashisht Village & Hot Springs',
          'Return to hotel & dress up for New Year’s Eve',
          'New Year’s Eve Celebration: Music, entertainment, dinner, countdown & party'
        ],
        timeline: [
          'Solang Valley: Snow activities, Ropeway, ATV, Zipline, Paragliding',
          'Visit Nehru Kund, Vashisht Village & Vashisht Hot Springs',
          'Return to hotel and get ready for the evening',
          'New Year’s Eve Party: Music, dinner, countdown to midnight & mountain party'
        ],
        image: '/images/himachal7.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 8,
        title: 'Day 8 | 1 Jan Manali → Kasol',
        description: 'Wake up to the first morning of the new year and drive towards the laid-back charm of Parvati Valley.',
        stayLocation: 'Kasol',
        activities: [
          'Approx. 3–4 hrs scenic drive through Kullu Valley',
          'En-route Kullu Valley viewpoints & riverside cafés',
          'Check-in at Kasol',
          'Relax by the Parvati River',
          'Explore Kasol market & café hopping',
          'Easy evening in the valley'
        ],
        timeline: [
          'Drive towards Kasol through beautiful Kullu Valley',
          'En-route Kullu Valley viewpoints & riverside landscapes',
          'Check-in & relax by the Parvati River',
          'Explore Kasol market & café hopping',
          'Easy evening in the valley'
        ],
        image: '/images/himachal8.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 9,
        title: 'Day 9 | 2 Jan Parvati Valley — Kasol, Manikaran & Mountain Villages',
        description: 'A slow, immersive day in the Parvati Valley.',
        stayLocation: 'Kasol',
        activities: [
          'Explore Kasol & Chalal village trail / riverside walk',
          'Manikaran Sahib Gurudwara & natural hot springs',
          'Parvati Valley viewpoints',
          'Optional: Trek towards Tosh / café-and-village exploration day',
          'Evening soaking in unique mountain culture'
        ],
        timeline: [
          'Kasol & Chalal village trail / riverside walk',
          'Manikaran Sahib & natural hot springs',
          'Parvati Valley viewpoints',
          'Optional: Trek towards Tosh / café & village exploration',
          'Final evening soaking in Kasol mountain culture'
        ],
        image: '/images/himachal9.jpg',
        meals: 'Breakfast & Dinner'
      },
      {
        day: 10,
        title: 'Day 10 | 3 Jan Kasol → Chandigarh | Departure',
        description: 'Enjoy breakfast amidst the mountains before beginning your journey back to Chandigarh.',
        stayLocation: 'Trip Ends: Chandigarh',
        activities: [
          'Breakfast & Check-out',
          'Scenic drive through the Kullu Valley',
          'En-route mountain & riverside stops, subject to time',
          'Drop at Chandigarh — Until the next adventure, Wanderphilia style!'
        ],
        timeline: [
          'Breakfast & check-out',
          'Scenic drive through the Kullu Valley',
          'En-route mountain & riverside stops',
          'Drop at Chandigarh — Trip Ends'
        ],
        image: '/images/himachal1.jpg',
        meals: 'Breakfast'
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
    packingTips: [
      'Light Woollens/Jackets',
      'Comfortable Shoes',
      'Personal Medicines',
      'Sunscreen & Sunglasses',
      'Power Bank & Chargers',
      'Snacks & Essentials for Kids'
    ],
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
    rawZohoData: {
      Destinations: 'Himachal Pradesh',
      Destination: 'Himachal Pradesh',
      No_of_Days: 10,
      No_of_Nights: 9,
      Travel_Style: 'Signature Explorer Trip',
      Trip_Type: 'Curated Group / Customised Tour',
      Vehicle_Type: '17 Seater Tempo Traveller',
      Meal_Plan: 'Breakfast & Dinner (Breakfast except for Day 1 & Dinner for day 10)',
      hotels: [
        { city: 'Dharamshala', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
        { city: 'Dalhousie', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
        { city: 'Bir', nights: 1, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
        { city: 'Manali', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' },
        { city: 'Kasol', nights: 2, hotelName: 'Deluxe Property', roomCategory: 'Triple Sharing Basis' }
      ]
    },
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Upsert for both wp-himachal-explorer and himachal-explorer and wanderphilia-signature-himachal-explorer
  await collection.updateOne(
    { id: 'wp-himachal-explorer' },
    { $set: himachalDoc },
    { upsert: true }
  );

  await collection.updateOne(
    { slug: 'himachal-explorer' },
    { $set: { ...himachalDoc, id: 'himachal-explorer' } },
    { upsert: true }
  );

  await collection.updateOne(
    { slug: 'wanderphilia-signature-himachal-explorer' },
    { $set: { ...himachalDoc, id: 'wanderphilia-signature-himachal-explorer' } },
    { upsert: true }
  );

  console.log('Successfully seeded Himachal Explorer itinerary documents to MongoDB!');
  await client.close();
}

seed().catch(err => {
  console.error('Seed error:', err);
});
