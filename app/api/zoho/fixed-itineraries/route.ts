import { NextRequest, NextResponse } from 'next/server';
import { getZohoAccessToken, getZohoApiUrl } from '@/lib/zoho';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function parseDateInput(raw: any, explicitYear?: number): { day: number; monthIndex: number; year: number } | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;

  const now = new Date();
  const curY = now.getFullYear();
  const curM = now.getMonth();

  const getYearForMonth = (mIdx: number): number => {
    if (explicitYear) return explicitYear;
    // If month is before current month minus 1 (e.g. Jan when we are in Nov), it belongs to next year
    if (mIdx < curM - 1) return curY + 1;
    return curY;
  };

  // 1. ISO YYYY-MM-DD
  const isoMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
  if (isoMatch) {
    const y = parseInt(isoMatch[1], 10);
    const m = parseInt(isoMatch[2], 10) - 1;
    const d = parseInt(isoMatch[3], 10);
    return { day: d, monthIndex: m, year: y };
  }

  // 2. DD/MM/YYYY or DD-MM-YYYY (with full 4-digit year)
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10) - 1;
    const y = parseInt(dmyMatch[3], 10);
    return { day: d, monthIndex: m, year: y };
  }

  // 3. DD-Month or DD Month or DD-Month-YYYY or DD Month YYYY (e.g. "15-Nov", "15 Nov", "15-November", "15th Nov", "15-Nov-2026")
  // Separator can be hyphen (-), dash (–, —), space, slash (/), dot (.)
  const dMonthMatch = str.match(/^(\d{1,2})(?:st|nd|rd|th)?[-/\s.–—]+([A-Za-z]+)(?:[-/\s.–—]+(\d{4}))?/i);
  if (dMonthMatch) {
    const d = parseInt(dMonthMatch[1], 10);
    const mName = dMonthMatch[2].toLowerCase();
    const m = MONTH_NAMES.findIndex(mn => mn.toLowerCase().startsWith(mName.slice(0, 3)));
    if (m !== -1) {
      const y = dMonthMatch[3] ? parseInt(dMonthMatch[3], 10) : getYearForMonth(m);
      return { day: d, monthIndex: m, year: y };
    }
  }

  // 4. Month-DD or Month DD or Month-DD-YYYY or Month DD, YYYY (e.g. "Nov-15", "Nov 15", "November 15 2026")
  const mFirstMatch = str.match(/^([A-Za-z]+)[-/\s.–—]+(\d{1,2})(?:st|nd|rd|th)?(?:[-/,\s.–—]+(\d{4}))?/i);
  if (mFirstMatch) {
    const mName = mFirstMatch[1].toLowerCase();
    const d = parseInt(mFirstMatch[2], 10);
    const m = MONTH_NAMES.findIndex(mn => mn.toLowerCase().startsWith(mName.slice(0, 3)));
    if (m !== -1) {
      const y = mFirstMatch[3] ? parseInt(mFirstMatch[3], 10) : getYearForMonth(m);
      return { day: d, monthIndex: m, year: y };
    }
  }

  // 5. Numeric DD-MM or DD/MM (e.g. "15-11" or "15/11")
  const numDmMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})$/);
  if (numDmMatch) {
    const d = parseInt(numDmMatch[1], 10);
    const m = parseInt(numDmMatch[2], 10) - 1;
    if (m >= 0 && m < 12 && d >= 1 && d <= 31) {
      return { day: d, monthIndex: m, year: getYearForMonth(m) };
    }
  }

  return null;
}

function formatRange(start: any, end: any, durationDays = 6): { monthKey: string; rangeStr: string } | null {
  const s = parseDateInput(start);
  if (!s) return null;

  let e = parseDateInput(end, s.year);
  if (!e) {
    // If end date is missing or invalid, auto-calculate from start + durationDays - 1
    const d = new Date(s.year, s.monthIndex, s.day + Math.max(1, durationDays - 1));
    e = { day: d.getDate(), monthIndex: d.getMonth(), year: d.getFullYear() };
  } else if (e.monthIndex < s.monthIndex) {
    // e.g. Start 28 Dec, End 04 Jan -> end is in next year
    e.year = s.year + 1;
  }

  const sMonth = MONTH_SHORT[s.monthIndex];
  const eMonth = MONTH_SHORT[e.monthIndex];

  // Standard website range format: "15 Nov - 22 Nov"
  const rangeStr = `${s.day} ${sMonth} - ${e.day} ${eMonth}`;
  const monthKey = `${MONTH_NAMES[s.monthIndex]} ${s.year}`;

  return { monthKey, rangeStr };
}

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

        const overnightJourney =
          row.Overnight_Journey_EOD === true ||
          String(row.Overnight_Journey_EOD).toLowerCase() === 'true' ||
          row.Overnight_Journey === true ||
          String(row.Overnight_Journey).toLowerCase() === 'true' ||
          row['Overnight Journey EOD'] === true ||
          String(row['Overnight Journey EOD']).toLowerCase() === 'true' ||
          Boolean(Object.entries(row).find(([k, v]) => /overnight.*journey/i.test(k) && (v === true || String(v).toLowerCase() === 'true')));

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
          overnightJourney: Boolean(overnightJourney),
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

      // Extract Group Departure Dates subform (e.g. "Group_Departure_Dates")
      const rawGroupSubform: any[] =
        p.Group_Departure_Dates ||
        p.Group_Departures ||
        p.Group_Dates ||
        p.Group_Details ||
        p.Batch_Dates ||
        (Object.entries(p).find(([k, v]) =>
          Array.isArray(v) &&
          k !== 'Day_wise_detailed_itinerary' &&
          k !== 'Activities_and_Experiences_1' &&
          k !== 'Tax' &&
          k !== 'Tag' &&
          (/group.*depart/i.test(k) || /group.*date/i.test(k) || /departure.*date/i.test(k) || /batch/i.test(k))
        )?.[1] as any[]) || [];

      const batchMap: Record<string, string[]> = {};
      let extractedGroupSize = Number(p.Group_Size) || Number(p.Max_Group_Size) || 0;

      if (Array.isArray(rawGroupSubform) && rawGroupSubform.length > 0) {
        rawGroupSubform.forEach((r: any) => {
          // Extract Group Size if present on row
          const rowSize = Number(
            r.Group_Size ||
            r.Group_size ||
            r['Group Size'] ||
            r.Size ||
            r.Max_Group_Size ||
            r.Batch_Size ||
            Object.entries(r).find(([k]) => /group.*size/i.test(k) || /batch.*size/i.test(k))?.[1]
          );
          if (rowSize > 0 && extractedGroupSize === 0) {
            extractedGroupSize = rowSize;
          }

          // Extract Start Date
          let rawStart = String(
            r.Start_Date_Month ||
            r.Start_Date_month ||
            r.Start_date_month ||
            r['Start Date-Month'] ||
            r['Start Date-month'] ||
            r['Start Date - Month'] ||
            r['Start Date - month'] ||
            r.Start_Date ||
            r.Start_date ||
            r.Start ||
            r.Date ||
            r.Departure_Date ||
            Object.entries(r).find(([k]) => /start.*date/i.test(k) || /start.*month/i.test(k))?.[1] ||
            ''
          ).trim();

          // Extract End Date
          let rawEnd = String(
            r.End_Date_month ||
            r.End_Date_Month ||
            r.End_date_month ||
            r['End Date-month'] ||
            r['End Date-Month'] ||
            r['End Date - month'] ||
            r['End Date - Month'] ||
            r.End_Date ||
            r.End_date ||
            r.End ||
            r.Return_Date ||
            Object.entries(r).find(([k]) => /end.*date/i.test(k) || /end.*month/i.test(k) || /return.*date/i.test(k))?.[1] ||
            ''
          ).trim();

          // If rawStart contains a combined range (e.g. "15-Nov to 22-Nov" or "15 - 22 Nov") and rawEnd is empty:
          if (!rawEnd) {
            if (rawStart.includes(' to ') || rawStart.includes(' TO ')) {
              const parts = rawStart.split(/\s+to\s+/i);
              rawStart = parts[0].trim();
              rawEnd = parts[1].trim();
            } else if (/\s+[-–—]\s+/.test(rawStart)) {
              const parts = rawStart.split(/\s+[-–—]\s+/);
              rawStart = parts[0].trim();
              rawEnd = parts[1].trim();
            } else if (/^\d{1,2}\s*[-–—]\s*\d{1,2}[-/\s.]+[A-Za-z]+/i.test(rawStart)) {
              // e.g. "15-22 Nov" or "15 - 22 Nov"
              const m = rawStart.match(/^(\d{1,2})\s*[-–—]\s*(\d{1,2})[-/\s.]+([A-Za-z]+)/i);
              if (m) {
                rawStart = `${m[1]}-${m[3]}`;
                rawEnd = `${m[2]}-${m[3]}`;
              }
            }
          }

          if (rawStart) {
            const parsed = formatRange(rawStart, rawEnd, calculatedDays);
            if (parsed) {
              if (!batchMap[parsed.monthKey]) batchMap[parsed.monthKey] = [];
              if (!batchMap[parsed.monthKey].includes(parsed.rangeStr)) {
                batchMap[parsed.monthKey].push(parsed.rangeStr);
              }
            }
          }
        });
      }

      const batchDates = Object.entries(batchMap).map(([month, ranges]) => ({
        month,
        ranges
      }));

      // Extract pricing info
      const doubleSharingPrice = Number(p.Double_Sharing_Price || p.Double_Sharing || p.Unit_Price || p.Price || 0) || undefined;
      const tripleSharingPrice = Number(p.Triple_Sharing_Price || p.Triple_Sharing || 0) || undefined;
      const quadSharingPrice = Number(p.Quad_Sharing_Price || p.Quad_Sharing || 0) || undefined;
      const soloRiderPrice = Number(p.Solo_Rider_Price || p.Single_Room_Price || p.Solo_Price || 0) || undefined;

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
          groupSize: extractedGroupSize > 0 ? extractedGroupSize : undefined,
          batchDates: batchDates.length > 0 ? batchDates : undefined,
          tourType: batchDates.length > 0 ? 'Group' : undefined,
          doubleSharingPrice,
          tripleSharingPrice,
          quadSharingPrice,
          soloRiderPrice,
          price: tripleSharingPrice || doubleSharingPrice,
          dayRows
        }
      });
    }

    // Otherwise, return full list of available fixed itineraries from Zoho CRM (across all pages)
    const rawList: any[] = [];
    let page = 1;
    let hasMore = true;
    while (hasMore && page <= 5) {
      // Query the "Active Itineraries" Custom View (cvid: 843125000000030026) so only active itineraries appear
      const cvidParam = 'cvid=843125000000030026&';
      const listUrl = getZohoApiUrl(`/crm/v3/Products?${cvidParam}fields=id,Product_Name,Event_Category,Product_Category,No_of_Days,No_of_Nights,Destination_Type,Destinations,Itinerary_Category,Destination_State,City,Product_Active&page=${page}&per_page=200`);
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
