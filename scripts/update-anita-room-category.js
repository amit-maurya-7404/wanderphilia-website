const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const doc = await db.collection('itineraries').findOne({
    $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }]
  });

  if (!doc) {
    console.error('Doc not found');
    await client.close();
    return;
  }

  const updatedHotels = (doc.hotels || []).map((h) => ({
    ...h,
    roomCategory: 'Deluxe Room'
  }));

  const updateFields = {
    roomCategory: 'Deluxe Room',
    preferredRoomCategory: 'Deluxe Room',
    hotels: updatedHotels,
    'stay.roomCategory': 'Deluxe Room',
    'leadDetails.preferredRoomCategory': 'Deluxe Room',
    'leadDetails.hotels': updatedHotels,
    'rawZohoData.Preferred_Room_Category': 'Deluxe Room',
    'rawZohoData.hotels': updatedHotels,
    updatedAt: new Date()
  };

  const result = await db.collection('itineraries').updateOne(
    { $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }] },
    { $set: updateFields }
  );

  console.log('Update result:', result);
  await client.close();
}

run().catch(console.error);

