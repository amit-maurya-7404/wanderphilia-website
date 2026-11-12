const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const startDate = '2027-02-25';
  const endDate = '2027-03-05';
  const duration = '2027-02-25 to 2027-03-05';
  const dates = '25th Feb to 5th Mar 2027';

  const doc = await db.collection('itineraries').findOne({
    $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }]
  });

  const updatedHotels = (doc?.hotels || []).map((h, idx) => {
    let stayDates = '';
    if (idx === 0) stayDates = '25 Feb - 26 Feb (1 Nt)';
    else if (idx === 1) stayDates = '26 Feb - 28 Feb (2 Nts)';
    else if (idx === 2) stayDates = '28 Feb - 2 Mar (2 Nts)';
    else if (idx === 3) stayDates = '2 Mar - 4 Mar (2 Nts)';
    else if (idx === 4) stayDates = '4 Mar - 5 Mar (1 Nt)';

    return {
      ...h,
      stayDates
    };
  });

  const updateFields = {
    startDate: startDate,
    endDate: endDate,
    duration: duration,
    dates: dates,
    hotels: updatedHotels,
    'leadDetails.startDate': startDate,
    'leadDetails.endDate': endDate,
    'leadDetails.duration': duration,
    'leadDetails.hotels': updatedHotels,
    'rawZohoData.Preferred_Start_date': startDate,
    'rawZohoData.Travel_End_Date': endDate,
    'rawZohoData.Start_Date': startDate,
    'rawZohoData.End_Date': endDate,
    'rawZohoData.hotels': updatedHotels,
    updatedAt: new Date()
  };

  const result = await db.collection('itineraries').updateOne(
    { $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }] },
    { $set: updateFields }
  );

  console.log('Update result (Dates updated to 25th Feb):', result);
  await client.close();
}

run().catch(console.error);

