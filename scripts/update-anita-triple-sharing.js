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

  const updatedInclusions = (doc?.inclusions || []).map((inc) => {
    return inc
      .replace(/double sharing basis in \d+ Rooms/i, 'triple sharing basis in 2 Rooms')
      .replace(/double sharing basis/i, 'triple sharing basis (2 Rooms)')
      .replace(/double sharing/i, 'triple sharing');
  });

  const updateFields = {
    roomsCount: 2,
    sharingType: 'Triple Sharing',
    subTitle: "Ms. Anita's Girls Trip | 8N/9D Bhutan Getaway (Triple Sharing • 2 Rooms)",
    inclusions: updatedInclusions,
    'stay.roomCategory': 'Deluxe Room',
    'leadDetails.roomsCount': 2,
    'leadDetails.sharingType': 'Triple Sharing',
    'rawZohoData.Rooms_Count': 2,
    'rawZohoData.Sharing_Type': 'Triple Sharing',
    'rawZohoData.inclusions': updatedInclusions,
    updatedAt: new Date()
  };

  const result = await db.collection('itineraries').updateOne(
    { $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }] },
    { $set: updateFields }
  );

  console.log('Update result (Triple Sharing • 2 Rooms):', result);
  await client.close();
}

run().catch(console.error);

