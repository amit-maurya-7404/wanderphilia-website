import fs from 'fs';
import { MongoClient } from 'mongodb';
import { singaporeDeepakRevisedManualItinerary, manualItineraryToDocument } from '../data/manual-itineraries';

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
if (!uriLine) throw new Error('MONGODB_URI not found');
const uri = uriLine.replace('MONGODB_URI=', '').trim().replace(/^["']|["']$/g, '');

async function main() {
  console.log('Seeding Singapore Deepak Revised into MongoDB...');
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');
  
  // 1. Upsert into 'itineraries' collection
  const itinerariesColl = db.collection('itineraries');
  const doc = {
    ...singaporeDeepakRevisedManualItinerary,
    id: 'singapore-deepak-revised',
    slug: 'singapore-deepak-revised',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  await itinerariesColl.updateOne(
    { $or: [{ id: 'singapore-deepak-revised' }, { slug: 'singapore-deepak-revised' }] },
    { $set: doc },
    { upsert: true }
  );
  console.log('Successfully upserted into itineraries collection: singapore-deepak-revised');

  await client.close();
}

main().catch(err => {
  console.error('Error seeding revised itinerary:', err);
  process.exit(1);
});
