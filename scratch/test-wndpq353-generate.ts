import { fetchZohoLeadById } from '../lib/zoho-fetch';
import { generateItineraryContentWithAI } from '../lib/ai-itinerary';

async function test() {
  const lead = await fetchZohoLeadById('WNDPQ353');
  const result = await generateItineraryContentWithAI(lead!);
  console.log('=== GENERATED DAY PLANS FOR WNDPQ353 ===');
  result.dayPlans.forEach(d => {
    console.log(`\n[DAY ${d.day}] ${d.title}`);
    console.log(`  Description: ${d.description}`);
    console.log(`  Stay: ${d.stayLocation}`);
    console.log(`  Activities:`, d.activities);
    console.log(`  Timeline Milestones:`);
    d.timeline?.forEach(m => console.log(`    - ${m}`));
  });
}

test().catch(console.error);
