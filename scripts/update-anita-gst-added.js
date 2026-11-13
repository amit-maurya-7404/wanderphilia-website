const fs = require('fs');
const { MongoClient } = require('mongodb');

const env = fs.readFileSync('.env.local', 'utf-8');
const uriLine = env.split('\n').find(l => l.startsWith('MONGODB_URI='));
const uri = uriLine.replace('MONGODB_URI=', '').trim();

async function run() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db('wanderphilia');

  const perAdultPrice = 49500;
  const adults = 6;
  const baseAmount = perAdultPrice * adults; // 297,000
  const gstPercentage = 5;
  const gstAmount = Math.round(baseAmount * (gstPercentage / 100)); // 14,850
  const tcsPercentage = 0;
  const tcsAmount = 0;
  const finalQuotationAmount = baseAmount + gstAmount; // 311,850

  const updateFields = {
    baseAmount: baseAmount,
    baseQuotationAmount: baseAmount,
    gstPercentage: gstPercentage,
    gstAmount: gstAmount,
    tcsPercentage: tcsPercentage,
    tcsAmount: tcsAmount,
    finalQuotationAmount: finalQuotationAmount,
    perAdultPrice: perAdultPrice,
    'leadDetails.baseAmount': baseAmount,
    'leadDetails.baseQuotationAmount': baseAmount,
    'leadDetails.gstPercentage': gstPercentage,
    'leadDetails.gstAmount': gstAmount,
    'leadDetails.tcsPercentage': tcsPercentage,
    'leadDetails.tcsAmount': tcsAmount,
    'leadDetails.finalQuotationAmount': finalQuotationAmount,
    'leadDetails.perAdultPrice': perAdultPrice,
    'rawZohoData.Base_Amount': baseAmount,
    'rawZohoData.baseAmount': baseAmount,
    'rawZohoData.GST_Amount': gstAmount,
    'rawZohoData.gstAmount': gstAmount,
    'rawZohoData.TCS_Amount': 0,
    'rawZohoData.tcsAmount': 0,
    'rawZohoData.Total_Package_Cost': finalQuotationAmount,
    'rawZohoData.Final_Quotation_Amount': finalQuotationAmount,
    'rawZohoData.Quotation_Amount': finalQuotationAmount,
    updatedAt: new Date()
  };

  const result = await db.collection('itineraries').updateOne(
    { $or: [{ id: 'anita-cac7a4d' }, { slug: 'anita-cac7a4d' }] },
    { $set: updateFields }
  );

  console.log('Update result (GST Added to 49,500 base):', result);
  await client.close();
}

run().catch(console.error);

