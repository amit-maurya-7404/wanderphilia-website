import fs from 'fs';
import { MongoClient } from 'mongodb';
import { trips } from '../lib/data';
import { generateItinerarySeo } from '../lib/seo-generator';
import {
  himachalExplorerManualItinerary,
  vietnamAneeshManualItinerary,
  vietnamYashManualItinerary,
  vietnamNaushadManualItinerary,
  vietnamNaushadUpdatedManualItinerary,
  rajasthanRoyalEscapeManualItinerary,
  winterSpitiYatinManualItinerary,
  rajasthanJignaManualItinerary,
  rajasthanJignaNewManualItinerary,
  rajasthanJignaUpdatedManualItinerary,
  rajasthanSachinManualItinerary,
  alibaugCorporateEscapeManualItinerary,
  lakshadweepParekhManualItinerary,
  lakshadweepParekhWithFlightsManualItinerary,
  srilankaShravyaManualItinerary,
  vietnamShravyaManualItinerary,
  meghalayaShravyaManualItinerary,
  singaporeDeepakManualItinerary,
  manualItinerariesRegistry
} from '../data/manual-itineraries';

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!uriLine) throw new Error('MONGODB_URI not found in .env.local');
const uri = uriLine.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');

async function seedAll() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas: wanderphilia');
    const db = client.db('wanderphilia');

    // ==========================================
    // 1. SEED ALL WEBSITE TOURS (trips collection)
    // ==========================================
    console.log('\n--- Seeding Website Tour Packages (trips collection) ---');
    const tripsCollection = db.collection('trips');
    await tripsCollection.createIndex({ slug: 1 }, { unique: true });
    await tripsCollection.createIndex({ id: 1 });

    let tripsInserted = 0;
    for (const trip of trips) {
      const cleanSlug = trip.slug.trim().toLowerCase();
      const seo = await generateItinerarySeo(trip);

      const tripAny = trip as any;
      const defaultPlacements = {
        homepage: tripAny.featured !== false,
        indiaTrips: !trip.destination?.toLowerCase().includes('international') &&
          !['bali', 'vietnam', 'dubai', 'singapore', 'thailand', 'japan', 'europe'].some(c => (trip.destination || trip.category || '').toLowerCase().includes(c)),
        internationalTrips: ['bali', 'vietnam', 'dubai', 'singapore', 'thailand', 'japan', 'europe'].some(c => (trip.destination || trip.category || '').toLowerCase().includes(c)),
        upcomingTours: true,
        honeymoon: (trip.category || '').toLowerCase().includes('honeymoon') || (trip.title || '').toLowerCase().includes('couple'),
        christmasNewYear: (trip.title || '').toLowerCase().includes('winter') || (trip.title || '').toLowerCase().includes('new year'),
        destinationPage: true,
        destinationCategory: trip.category || trip.destination || '',
        sections: {
          available: true,
          family: (trip.category || '').toLowerCase().includes('family'),
          custom: trip.tourType === 'Customized',
          related: true,
        }
      };

      const doc = {
        ...trip,
        slug: cleanSlug,
        seo,
        placements: tripAny.placements || defaultPlacements,
        updatedAt: new Date().toISOString(),
      };

      await tripsCollection.updateOne(
        { slug: cleanSlug },
        {
          $set: doc,
          $setOnInsert: { createdAt: new Date().toISOString() }
        },
        { upsert: true }
      );
      tripsInserted++;
    }
    const totalTripsInDb = await tripsCollection.countDocuments();
    console.log(`Successfully synced ${tripsInserted} website trips! Total trips in DB: ${totalTripsInDb}`);

    // ==========================================
    // 2. SEED ALL CLIENT ITINERARIES (itineraries collection)
    // ==========================================
    console.log('\n--- Seeding Client / Manual Itineraries (itineraries collection) ---');
    const itinerariesCollection = db.collection('itineraries');
    await itinerariesCollection.createIndex({ slug: 1 });
    await itinerariesCollection.createIndex({ id: 1 });

    const manualList = [
      himachalExplorerManualItinerary,
      vietnamAneeshManualItinerary,
      vietnamYashManualItinerary,
      vietnamNaushadManualItinerary,
      vietnamNaushadUpdatedManualItinerary,
      rajasthanRoyalEscapeManualItinerary,
      winterSpitiYatinManualItinerary,
      rajasthanJignaManualItinerary,
      rajasthanJignaNewManualItinerary,
      rajasthanJignaUpdatedManualItinerary,
      rajasthanSachinManualItinerary,
      alibaugCorporateEscapeManualItinerary,
      lakshadweepParekhManualItinerary,
      lakshadweepParekhWithFlightsManualItinerary,
      srilankaShravyaManualItinerary,
      vietnamShravyaManualItinerary,
      meghalayaShravyaManualItinerary,
      singaporeDeepakManualItinerary,
      ...Object.values(manualItinerariesRegistry)
    ];

    // Filter unique by ID or Slug
    const uniqueManualMap = new Map<string, any>();
    for (const item of manualList) {
      if (item && (item.id || item.slug)) {
        const key = (item.id || item.slug).toLowerCase();
        if (!uniqueManualMap.has(key)) {
          uniqueManualMap.set(key, item);
        }
      }
    }

    let manualInserted = 0;
    for (const item of uniqueManualMap.values()) {
      const doc = {
        ...item,
        updatedAt: new Date().toISOString(),
      };

      await itinerariesCollection.updateOne(
        { $or: [{ id: item.id }, { slug: item.slug }] },
        {
          $set: doc,
          $setOnInsert: { createdAt: new Date().toISOString() }
        },
        { upsert: true }
      );
      manualInserted++;
      console.log(`Synced manual itinerary: "${item.title}" (${item.slug || item.id})`);
    }

    const totalItinerariesInDb = await itinerariesCollection.countDocuments();
    console.log(`Successfully synced ${manualInserted} manual itineraries! Total itineraries in DB: ${totalItinerariesInDb}`);

    console.log('\n==========================================');
    console.log('ALL ITINERARIES HAVE BEEN SEEDED INTO MONGODB!');
    console.log('==========================================');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding itineraries:', error);
    process.exit(1);
  } finally {
    await client.close();
  }
}

seedAll();

