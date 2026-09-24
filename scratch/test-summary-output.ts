import { fetchZohoLeadById } from '../lib/zoho-fetch';

async function test() {
  const lead = await fetchZohoLeadById('WNDPQ353');
  const experiencesSummary = lead?.dayActivities && lead.dayActivities.length > 0
    ? lead.dayActivities.map((d: any) => {
        const expList = (d.experiences || []).map((e: any) => {
          const expName = e.name || e.experienceName || '';
          const desc = e.inclusionDescription || e.description || e.subTitle || '';
          return desc && desc.toLowerCase() !== expName.toLowerCase() ? `${expName} (${desc})` : expName;
        }).filter(Boolean);

        const expStr = expList.length > 0 ? expList.join(' | ') : (d.pdfDescription || 'Leisure & Sightseeing');
        return `[${d.dayText}${d.city ? ` - ${d.city}` : ''}]: ${expStr}`;
      }).join('\n')
    : '';

  console.log('=== EXPERIENCES SUMMARY FOR WNDPQ353 ===');
  console.log(experiencesSummary);
}

test().catch(console.error);
