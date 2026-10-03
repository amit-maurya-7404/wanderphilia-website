import { MongoClient } from 'mongodb';

async function seed() {
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  
  await client.db().collection('itineraries').updateOne(
    { id: 'wp-sample-live' },
    {
      $set: {
        finalQuotationAmount: 75000,
        perAdultPrice: 37500,
        adults: 2,
        kids: 0,
        leadDetails: {
          name: 'Amit Maurya',
          firstName: 'Amit',
          lastName: 'Maurya',
          email: 'wanderphiliaexperiences@gmail.com',
          mobile: '9217664099',
          guests: 2,
          startDate: '2026-10-15',
          endDate: '2026-10-20',
          travelStyle: 'Family Trip',
          tripType: 'Customised Trip'
        },
        rawZohoData: {
          id: '843125000011565444',
          Inquiry_ID: 'WNDPQ418',
          Full_Name: 'Amit Maurya 4',
          First_Name: 'Amit',
          Last_Name: 'Maurya 4',
          Email: 'amit.maurya7404@gmail.com',
          Mobile: '9137290903',
          Destinations: 'Rajasthan',
          Final_Quotation_Amount: 10514,
          Per_Adult_Price: 5257,
          Adults: 2,
          No_of_Days: 5,
          No_of_Nights: 4
        }
      }
    },
    { upsert: true }
  );

  console.log('Sample itinerary wp-sample-live updated with full test data!');
  await client.close();
}

seed().catch(console.error);
