import { fetchZohoLeadById } from '../lib/zoho-fetch.js';
import { generateItineraryContentWithAI } from '../lib/ai-itinerary.js';

async function main() {
  const leadId = '843125000010916169';
  console.log(`Fetching lead ${leadId} dynamically from Zoho CRM...`);
  const lead = await fetchZohoLeadById(leadId);
  
  if (!lead) {
    console.error('Lead not found in Zoho CRM');
    return;
  }

  console.log('--- FETCHED ZOHO LEAD ---');
  console.log('Lead Name:', lead.leadName);
  console.log('Destination:', lead.destinations);
  console.log('Days / Nights:', `${lead.noOfDays}D / ${lead.noOfNights}N`);
  console.log('Hotels:', lead.hotels);
  console.log('Day Activities Count:', lead.dayActivities.length);

  const itinerary = await generateItineraryContentWithAI(lead);
  console.log('\n--- DYNAMICALLY GENERATED ITINERARY ---');
  console.log('Title:', itinerary.title);
  console.log('SubTitle:', itinerary.subTitle);
  console.log('Description:', itinerary.description);
  console.log('\nDay Plans:');
  itinerary.dayPlans.forEach(d => {
    console.log(`\n[DAY ${d.day}] ${d.title}`);
    console.log(`  Stay: ${d.stayLocation}`);
    console.log(`  Meals: ${d.meals}`);
    console.log(`  Milestones:`);
    d.timeline?.forEach(m => console.log(`    • ${m}`));
  });
}

main().catch(console.error);
