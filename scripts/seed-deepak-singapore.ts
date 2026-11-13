import fs from 'fs';
import path from 'path';
import { MongoClient } from 'mongodb';

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!uriLine) throw new Error('MONGODB_URI not found');
const uri = uriLine.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');

export const singaporeDeepakManualItinerary = {
  id: 'singapore-deepak',
  slug: 'singapore-deepak-family',
  title: '6 Days Trip to Singapore Specially Curated for Mr. Deepak & Family',
  subtitle: 'Singapore Luxury Family Experience',
  duration: '5 Nights / 6 Days | 12 Dec – 17 Dec 2026',
  numNights: 5,
  numDays: 6,
  dates: '12 Dec – 17 Dec 2026',
  route: 'Mumbai → Singapore → Sentosa → Mandai → Singapore → Mumbai',
  routeSummary: '4N Marina Bay Sands | 1N Shangri-La Sentosa',
  destination: 'Singapore',
  travelStyle: 'Family Curated Experience',
  tripType: 'Customised Luxury Tour',
  leadName: 'Mr. Deepak & Family',
  vehicleType: 'Private Mercedes-Benz V Class with Chauffeur',
  mealPlan: 'Daily Breakfast & Curated Vegetarian Dining Recommendations',
  heroImage: '/images/singapore.png',
  galleryImages: [
    '/images/singapore1.jpg',
    '/images/singapore2.jpg',
    '/images/singapore3.jpg',
    '/images/singapore4.jpg',
    '/images/singapore5.jpg',
    '/images/singapore.png'
  ],
  accommodations: [
    { city: 'Marina Bay Sands', nights: 1, hotelName: 'Marina Bay Sands (Night 1)', roomCategory: 'Luxury Room / Suite (Awaited)' },
    { city: 'Sentosa Island', nights: 1, hotelName: 'Shangri-La Rasa Sentosa (Night 2)', roomCategory: 'Luxury Resort Room (Awaited)' },
    { city: 'Marina Bay Sands', nights: 3, hotelName: 'Marina Bay Sands (Nights 3, 4, 5)', roomCategory: 'Luxury Room / Suite (Awaited)' }
  ],
  dayPlans: [
    {
      day: 1,
      date: 'Sat, 12 Dec 2026',
      title: 'Arrival in Singapore & Gardens by the Bay',
      route: 'Mumbai → Singapore',
      durationNote: '5h 40m Flight | Private V-Class Transfer',
      intro: 'Welcome to Singapore! Arrive at Changi Airport and transfer in comfort to your iconic hotel.',
      timeline: [
        'Arrival in Singapore (Changi Airport) at 10:15 AM',
        'Warm meet & greet assistance at airport',
        'Private Mercedes-Benz V Class transfer to hotel',
        'Check-in at: Marina Bay Sands',
        'Evening visit to Gardens by the Bay',
        'Explore Cloud Forest & Flower Dome',
        'Witness the magical Supertree Light Show (Garden Rhapsody)',
        'Overnight in Singapore at Marina Bay Sands',
        'Vegetarian Food Recommendations: Komala Vilas, Kailash Parbat'
      ],
      stayLocation: 'Marina Bay Sands, Singapore',
      image: '/images/singapore1.jpg',
      meals: 'Vegetarian Dining Recommendations'
    },
    {
      day: 2,
      date: 'Sun, 13 Dec 2026',
      title: 'Universal Studios Full Day with Express Pass',
      route: 'Marina Bay → Sentosa Island',
      intro: 'A day of thrills and excitement at Southeast Asia’s only Universal Studios theme park.',
      timeline: [
        'Relaxing morning breakfast at hotel',
        'Morning transfer to Universal Studios in your premium Mercedes V Class',
        'Universal Studios Singapore Full Day with VIP Express Pass (Skip the lines)',
        'Experience Hollywood, Sci-Fi City, Ancient Egypt & The Lost World',
        'Evening spectacular Wings of Time Light & Sound Show by the sea',
        'Afterwards enjoy relaxing beachside dinner at Sentosa',
        'Overnight in Shangri-La Rasa Sentosa'
      ],
      stayLocation: 'Shangri-La Rasa Sentosa',
      image: '/images/singapore2.jpg',
      meals: 'Breakfast & Beach Dinner Options'
    },
    {
      day: 3,
      date: 'Mon, 14 Dec 2026',
      title: 'Sentosa Leisure • S.E.A. Aquarium • Beach Relaxation',
      route: 'Sentosa → Marina Bay',
      intro: 'Soak in the island vibes, ocean marvels, and exhilarating luge rides before heading back to Marina Bay.',
      timeline: [
        'Relaxed breakfast at Shangri-La Sentosa',
        'Beach leisure time & resort relaxation',
        'Later visit world-class S.E.A. Aquarium (Home to 100,000+ marine animals)',
        'Exciting Skyline Luge & Skyride experience',
        'Scenic Singapore Cable Car ride across the harbour',
        'Evening private Mercedes transfer back to Marina Bay',
        'Overnight in Singapore Marina Bay Sands'
      ],
      stayLocation: 'Marina Bay Sands, Singapore',
      image: '/images/singapore3.jpg',
      meals: 'Breakfast'
    },
    {
      day: 4,
      date: 'Tue, 15 Dec 2026',
      title: 'Singapore City Icons • Culture • Shopping & Singapore Flyer',
      route: 'Singapore City Exploration',
      intro: 'Discover the cultural depth and modern wonders of the Lion City in your private luxury chauffeur-driven Mercedes.',
      timeline: [
        'Morning after relaxing breakfast',
        'Relaxed City Exploration fully private in your Mercedes V Class',
        'Explore iconic Merlion Park, Civic District & Marina Bay',
        'Evening experience breathtaking sunset from the iconic Singapore Flyer',
        'Shopping & leisure at Orchard Road',
        'Marina Bay luxury shopping at The Shoppes',
        'Vegetarian Dinner Recommendations: Annalakshmi, MTR Singapore',
        'Overnight in Singapore Marina Bay Sands'
      ],
      stayLocation: 'Marina Bay Sands, Singapore',
      image: '/images/singapore4.jpg',
      meals: 'Breakfast & Vegetarian Dining Options'
    },
    {
      day: 5,
      date: 'Wed, 16 Dec 2026',
      title: 'Singapore Wildlife Luxury Experience (Zoo, River Wonders & Night Safari)',
      route: 'Mandai Wildlife Reserve',
      intro: 'An immersive wildlife journey through Singapore’s world-renowned open-concept zoo, river safari, and night safari.',
      timeline: [
        'Relaxed morning & enjoy hotel facilities & breakfast',
        'Afternoon wildlife experience at Singapore Zoo',
        'River Wonders exploration (Giant Panda Forest & Amazon Flooded Forest)',
        'Evening Night Safari with reserved Animal Presentation & guided tram ride',
        'Private Mercedes transfer back to hotel',
        'Overnight in Singapore Marina Bay Sands'
      ],
      stayLocation: 'Marina Bay Sands, Singapore',
      image: '/images/singapore5.jpg',
      meals: 'Breakfast'
    },
    {
      day: 6,
      date: 'Thu, 17 Dec 2026',
      title: 'Departure from Singapore',
      route: 'Singapore → Mumbai',
      durationNote: 'Private V-Class Airport Transfer | 5h 40m Flight',
      intro: 'Bid farewell to Singapore as you head to Changi Airport for your return Business Class flight.',
      timeline: [
        'Relaxed breakfast and morning leisure at Marina Bay Sands',
        'Private Mercedes V Class transfer to Singapore Changi Airport (SIN)',
        'Board IndiGo Flight 6E - 1164 departing at 19:40 to Mumbai',
        'Arrive at Mumbai (BOM) at 22:50',
        'Come back home with happy and cherished memories!'
      ],
      stayLocation: 'Mumbai',
      image: '/images/singapore.png',
      meals: 'Breakfast'
    }
  ],
  inclusions: [
    'Indigo Direct Flights – Stretch Plus Seats (Mumbai ↔ Singapore Round-Trip)',
    'Private Airport & Sightseeing Transfers in Mercedes-Benz V Class with Chauffeur',
    'Handpicked Premium Luxury Hotels (Marina Bay Sands & Shangri-La Sentosa)',
    'Daily Breakfast',
    'Gardens by the Bay – Flower Dome, Cloud Forest & Jurassic World Experience',
    'Universal Studios Singapore with Express Pass',
    'Wings of Time Show',
    'Skyline Luge & Sky Ride Experience',
    'Singapore Cable Car Experience',
    'Fully Private Premium Singapore City Exploration',
    'Sunset Singapore Flyer Experience',
    'Singapore Zoo & River Wonders',
    'Night Safari with Animal Presentation',
    'Relaxed & Comfort-Focused Touring Throughout',
    'Curated Vegetarian Dining Recommendations'
  ],
  exclusions: [
    'GST (5%) is applicable extra.',
    'Any kind of food or beverage that is not included in the package like alcoholic drinks, mineral water, meals/refreshments/lunches on the highway.',
    'Any personal expenses like a tip to the drivers, entry to monuments/monasteries, camera/video camera charges etc.',
    'Any cost arising due to natural calamities like landslides, roadblocks etc. (to be borne directly by the customer on the spot)',
    'Anything not mentioned in the inclusions.'
  ],
  flightQuotations: [
    {
      optionId: 'indigo-business-stretch-plus',
      optionTitle: 'Business Class Stretch Plus Flight',
      totalPrice: 735294,
      paxDetails: '4 Adults, 2 Children (Round-Trip Return Airfare)',
      isExcludedFromPackage: false,
      note: 'Stay costing is currently awaited from the hotel team due to a few special requirements and room preferences requested for the family. We shall share the final stay costing with you as soon as we receive the confirmation from the hotel for the same.',
      sectors: [
        {
          fromCity: 'MUM (Mumbai)',
          toCity: 'SIN (Singapore)',
          fromAirport: 'Chhatrapati Shivaji Maharaj International Airport (BOM)',
          toAirport: 'Singapore Changi Airport (SIN)',
          fromCode: 'MUM',
          toCode: 'SIN',
          airline: 'IndiGo',
          flightNumber: '6E - 1339',
          journeyType: 'Onward Journey',
          departureDate: 'Sat, 12 Dec 2026',
          departureTime: '02:05',
          arrivalDate: 'Sat, 12 Dec 2026',
          arrivalTime: '10:15',
          duration: '5h 40 m',
          stops: 'Non Stop',
          cabinClass: 'Business Class Stretch Plus',
          baggage: 'Baggage 12KGS Cabin | 40KGS Check-in'
        },
        {
          fromCity: 'SIN (Singapore)',
          toCity: 'MUM (Mumbai)',
          fromAirport: 'Singapore Changi Airport (SIN)',
          toAirport: 'Chhatrapati Shivaji Maharaj International Airport (BOM)',
          fromCode: 'SIN',
          toCode: 'MUM',
          airline: 'IndiGo',
          flightNumber: '6E - 1164',
          journeyType: 'Return Journey',
          departureDate: 'Thu, 17 Dec 2026',
          departureTime: '19:40',
          arrivalDate: 'Thu, 17 Dec 2026',
          arrivalTime: '22:50',
          duration: '5 h 40 m',
          stops: 'Non Stop',
          cabinClass: 'Business Class Stretch Plus',
          baggage: 'Baggage 12KGS Cabin | 40KGS Check-in'
        }
      ]
    }
  ],
  finalQuotationAmount: 423000,
  perAdultPrice: 72500,
  perKidPrice: 66500,
  adults: 4,
  kids: 2,
  childPricingNote: '₹72,500/- Per Adult | ₹66,500/- Per Child (Stay Cost is not included in this package)',
  notes: 'Kindly note Sir, as of now no flights or hotels have been blocked or booked yet. Airfare and hotel prices are dynamic in nature and are subject to availability at the time of confirmation. Once we finalise the itinerary, we will immediately secure the Hotels & Flights.\n\nTotal Land Package Cost: ₹72,500/- Per Adult | ₹66,500/- Per Child (Stay Cost is not included in this package).\nTotal cost for Business Class Stretch Plus Flight dated on 12/12/2026: ₹7,35,294.',
  importantNotes: [
    'Stay costing is currently awaited from the hotel team due to a few special requirements and room preferences requested for the family. We shall share the final stay costing with you as soon as we receive the confirmation from the hotel for the same.',
    'Total Land Package Cost: ₹72,500/- Per Adult | ₹66,500/- Per Child (Stay Cost is not included in this package).',
    'Total cost for Business Class Stretch Plus Flight dated on 12/12/2026: ₹7,35,294.',
    'Kindly note Sir, as of now no flights or hotels have been blocked or booked yet. Airfare and hotel prices are dynamic in nature and are subject to availability at the time of confirmation.'
  ],
  paymentPolicy: [
    'At Booking: 25% (non-refundable)',
    'Within 45 days: 50% (non-refundable)',
    'Within 30 days: 75% (non-refundable)',
    '20 days or less: 100% (forfeited)'
  ],
  cancellationPolicy: [
    'At booking: 25% booking advance is non-refundable',
    'Within 45 days: Minimum 50% deduction',
    'Within 30 days: Minimum 75% deduction',
    '20 days or less: 100% forfeited'
  ]
};

async function main() {
  console.log('Inserting/updating Singapore Deepak itinerary in MongoDB...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');
  const collection = db.collection('itineraries');

  const doc = {
    ...singaporeDeepakManualItinerary,
    id: 'singapore-deepak',
    slug: 'singapore-deepak',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await collection.updateOne(
    { $or: [{ id: 'singapore-deepak' }, { slug: 'singapore-deepak' }] },
    { $set: doc },
    { upsert: true }
  );

  console.log('MongoDB update complete for id: singapore-deepak');
}

main().then(() => process.exit(0)).catch(err => {
  console.error(err);
  process.exit(1);
});
