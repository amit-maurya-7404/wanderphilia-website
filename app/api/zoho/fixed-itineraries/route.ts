import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoApiUrl } from '@/lib/zoho';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    const token = await getZohoAccessToken();
    const fetchHeaders = {
      'Authorization': `Zoho-oauthtoken ${token}`,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    };

    // If an ID is provided, fetch full details with the Day-wise subform
    if (id) {
      const url = getZohoApiUrl(`/crm/v3/Products/${id}`);
      const res = await fetch(url, {
        headers: fetchHeaders,
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      if (!res.ok) {
        return NextResponse.json(
          { success: false, error: `Failed to fetch itinerary from Zoho CRM (Status: ${res.status})` },
          { status: res.status }
        );
      }

      const json = await res.json();
      if (!json.data || !json.data[0]) {
        return NextResponse.json(
          { success: false, error: 'Itinerary not found in Zoho CRM.' },
          { status: 404 }
        );
      }

      const p = json.data[0];
      const rawSubform: any[] = p.Day_wise_detailed_itinerary || p.Activities_and_Experiences_1 || [];

      const dayRows = rawSubform.map((row: any, idx: number) => {
        const dayText = String(row.Days || `Day ${idx + 1}`).trim();
        const dayMatch = dayText.match(/\d+/);
        const dayNumber = dayMatch ? parseInt(dayMatch[0], 10) : idx + 1;
        const city = String(row.City || '').trim();

        const rawCity2 = row.City_2 ?? row.City2 ?? row.Transit_City ?? '';
        const city2 = typeof rawCity2 === 'object' && rawCity2 !== null ? rawCity2.name : String(rawCity2 || '').trim();

        const rawEnRoute = row.En_route_Experiences ?? row.En_route_experiences ?? '';
        const enRouteStr = typeof rawEnRoute === 'object' && rawEnRoute !== null ? rawEnRoute.name : String(rawEnRoute || '').trim();
        const enRouteSpots = enRouteStr ? [enRouteStr] : [];

        const guidedTour = row.Guided_Tour === true || String(row.Guided_Tour).toLowerCase() === 'true';

        // Experiences 1 to 4
        const exp1Obj = row.Experience_1 || row.Experiences_1 || row.Experiences_and_activities;
        const exp1 = typeof exp1Obj === 'object' && exp1Obj !== null ? exp1Obj.name : String(exp1Obj || '').trim();

        const exp2Obj = row.Experiences_2 || row.Experience_2;
        const exp2 = typeof exp2Obj === 'object' && exp2Obj !== null ? exp2Obj.name : String(exp2Obj || '').trim();

        const exp3Obj = row.Experiences_3 || row.Experience_3;
        const exp3 = typeof exp3Obj === 'object' && exp3Obj !== null ? exp3Obj.name : String(exp3Obj || '').trim();

        const exp4Obj = row.Experiences_4 || row.Experience_4;
        const exp4 = typeof exp4Obj === 'object' && exp4Obj !== null ? exp4Obj.name : String(exp4Obj || '').trim();

        // Optional Experiences
        const optObj = row.Optional_Experiences || row.Optional_Experience_1;
        const opt1 = typeof optObj === 'object' && optObj !== null ? optObj.name : String(optObj || '').trim();
        const opt2Obj = row.Optional_Experience_2;
        const opt2 = typeof opt2Obj === 'object' && opt2Obj !== null ? opt2Obj.name : String(opt2Obj || '').trim();

        // Descriptions (supports multiple naming conventions from Zoho CRM subforms)
        const desc1 = String(row.Inclusions_Description_1 || row.Description_for_template_1 || row.Description_1 || row.Descriptions_1 || row.PDF_Description || row.Description || '').trim();
        const desc2 = String(row.Inclusions_Description_2 || row.Description_for_template_2 || row.Description_2 || row.Descriptions_2 || '').trim();
        const desc3 = String(row.Inclusions_Description_3 || row.Description_for_template_3 || row.Description_3 || row.Descriptions_3 || '').trim();
        const desc4 = String(row.Inclusions_Description_4 || row.Description_for_template_4 || row.Description_4 || row.Descriptions_4 || '').trim();

        // Optional Descriptions
        const optDesc1 = String(row.Optional_Inclusions_Description_1 || row.Optional_Description_1 || row.Optional_Descriptions_1 || '').trim();
        const optDesc2 = String(row.Optional_Inclusions_Description_2 || row.Optional_Description_2 || row.Optional_Descriptions_2 || '').trim();

        return {
          dayNumber,
          dayText,
          guidedTour,
          city,
          city2,
          enRouteExperiences: enRouteSpots.length > 0 ? enRouteSpots : [''],
          enRouteSpots: enRouteSpots.length > 0 ? enRouteSpots : [''],
          experiences: [exp1, exp2, exp3, exp4],
          optionalExperiences: [opt1, opt2],
          descriptions: [desc1, desc2, desc3, desc4],
          optionalDescriptions: [optDesc1, optDesc2],
          experienceCosts: [0, 0, 0, 0],
          optionalExperienceCosts: [0, 0]
        };
      });

      // Sort by day number
      dayRows.sort((a: any, b: any) => a.dayNumber - b.dayNumber);

      const calculatedDays = dayRows.length || Number(p.No_of_Days) || 1;
      const calculatedNights = Number(p.No_of_Nights) || Math.max(1, calculatedDays - 1);
      const destination = p.Event_Category || p.Destinations || p.Destination_State || p.Product_Category || '';
      const destinationType = p.Destination_Type || 'India';

      return NextResponse.json({
        success: true,
        itinerary: {
          id: p.id,
          name: p.Product_Name || 'Untitled Itinerary',
          destination,
          destinationType,
          category: p.Itinerary_Category || p.Product_Category || '',
          noOfDays: calculatedDays,
          noOfNights: calculatedNights,
          dayRows
        }
      });
    }

    // Otherwise, return full list of available fixed itineraries from Zoho CRM (across all pages)
    const rawList: any[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      const listUrl = getZohoApiUrl(`/crm/v3/Products?fields=id,Product_Name,Event_Category,Product_Category,No_of_Days,No_of_Nights,Destination_Type,Destinations,Itinerary_Category,Destination_State,City&page=${page}&per_page=200`);
      const listRes = await fetch(listUrl, {
        headers: fetchHeaders,
        cache: 'no-store',
        next: { revalidate: 0 }
      });

      if (!listRes.ok) {
        if (page === 1) {
          return NextResponse.json(
            { success: false, error: `Failed to fetch itineraries list from Zoho CRM (Status: ${listRes.status})` },
            { status: listRes.status }
          );
        }
        break;
      }

      const listJson = await listRes.json();
      const pageData = listJson.data || [];
      rawList.push(...pageData);
      hasMore = Boolean(listJson.info?.more_records);
      page++;
      if (pageData.length === 0) break;
    }

    const itineraries = rawList.map((item: any) => ({
      id: item.id,
      name: item.Product_Name || 'Untitled Itinerary',
      destination: item.Event_Category || item.Destinations || item.Destination_State || item.City || item.Product_Category || '',
      destinationType: item.Destination_Type || 'India',
      category: item.Itinerary_Category || item.Product_Category || '',
      noOfDays: item.No_of_Days || null,
      noOfNights: item.No_of_Nights || null
    }));

    return new NextResponse(
      JSON.stringify({
        success: true,
        itineraries
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('[Zoho Fixed Itineraries API Error]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
