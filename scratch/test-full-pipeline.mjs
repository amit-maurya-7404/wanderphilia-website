import { MongoClient } from 'mongodb';
import { fetchZohoLeadById } from '../lib/zoho-fetch.ts';
import { generateItineraryContentWithAI, generateLuxuryFallback } from '../lib/ai-itinerary.ts';

async function main() {
  console.log('Fetching live Zoho CRM lead WNDPQ353...');
  const lead = await fetchZohoLeadById('WNDPQ353');
  if (!lead) {
    console.error('Lead WNDPQ353 not found in Zoho CRM');
    return;
  }

  console.log('Lead Name:', lead.leadName);
  console.log('Destination:', lead.destinations, '| Type:', lead.destinationType);
  console.log('Hotels mapped:', lead.hotels.length);
  console.log('Subform Day Activities mapped:', lead.dayActivities.length);

  const itineraryContent = await generateItineraryContentWithAI(lead);

  console.log('\n=== GENERATED ITINERARY TITLE & SUBTITLE ===');
  console.log('Title:', itineraryContent.title);
  console.log('SubTitle:', itineraryContent.subTitle);
  console.log('Description:', itineraryContent.description);

  console.log('\n=== GENERATED DAY PLANS WITH NEW CONDITIONS ===');
  console.log(JSON.stringify(itineraryContent.dayPlans, null, 2));

  // Save/Update in MongoDB as wp-wndpq353
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db();
  const collection = db.collection('itineraries');

  await collection.updateOne(
    { id: 'wp-wndpq353' },
    {
      $set: {
        id: 'wp-wndpq353',
        slug: 'wp-wndpq353',
        title: itineraryContent.title,
        subTitle: itineraryContent.subTitle,
        description: itineraryContent.description,
        destination: lead.destinations,
        leadDetails: {
          name: lead.leadName,
          firstName: lead.firstName,
          lastName: lead.lastName,
          email: lead.email,
          phone: lead.mobile,
          guests: lead.numberOfGuests
        },
        stay: {
          hotelName: lead.hotels[0]?.hotelName || 'Selected Resort',
          roomCategory: lead.preferredRoomCategory,
          mealPlan: lead.mealPlan
        },
        dayPlans: itineraryContent.dayPlans,
        highlights: itineraryContent.highlights,
        inclusions: itineraryContent.inclusions,
        exclusions: itineraryContent.exclusions,
        amenities: itineraryContent.amenities,
        rawZohoData: lead,
        updatedAt: new Date()
      }
    },
    { upsert: true }
  );

  console.log('\nSaved wp-wndpq353 to MongoDB successfully!');
  await client.close();
}

main().catch(console.error);
