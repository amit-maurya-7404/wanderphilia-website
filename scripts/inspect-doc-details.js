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
  console.log('Adults:', doc.adults, 'Kids:', doc.kids, 'Guests:', doc.leadDetails?.guests);
  console.log('Quotation:', doc.finalQuotationAmount, 'Base:', doc.baseQuotationAmount, 'PerAdult:', doc.perAdultPrice);
  console.log('Lead Details:', doc.leadDetails);
  console.log('Raw Zoho Data summary:', {
    Full_Name: doc.rawZohoData?.Full_Name,
    Guests: doc.rawZohoData?.Number_Of_Guest || doc.rawZohoData?.Number_Of_Guests,
    Adults: doc.rawZohoData?.Adults,
    Vehicle: doc.rawZohoData?.Vehicle_Type,
    StartDate: doc.rawZohoData?.Preferred_Start_date,
    EndDate: doc.rawZohoData?.Travel_End_Date
  });
  await client.close();
}

run().catch(console.error);

