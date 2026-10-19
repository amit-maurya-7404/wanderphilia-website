import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

/**
 * Extracts Google Sheet ID from full URL or bare ID
 */
function extractSheetId(input: string): string {
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match) return match[1];
  return trimmed;
}

/**
 * Normalizes header string to lowercase snake/clean identifier
 */
function cleanKey(header: string): string {
  return header
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .trim()
    .replace(/\s+/g, '_');
}

/**
 * Fetches and parses Google Visualization API table format
 */
async function fetchGvizTable(sheetId: string, sheetName?: string): Promise<{ headers: string[]; rows: Record<string, any>[] }> {
  const sheetParam = sheetName ? `&sheet=${encodeURIComponent(sheetName)}` : '';
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json${sheetParam}&_t=${Date.now()}`;

  const res = await fetch(url, {
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch Google Sheet (${res.status} ${res.statusText}). Make sure the sheet is shared as "Anyone with the link can view".`);
  }

  const text = await res.text();
  const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?/);
  if (!match) {
    throw new Error('Invalid Google Sheet response format. Ensure the sheet is publicly accessible.');
  }

  const json = JSON.parse(match[1]);
  if (!json.table) {
    throw new Error('Google Sheet table is empty or inaccessible.');
  }

  const cols = json.table.cols || [];
  const rawRows = json.table.rows || [];

  let headers: string[] = cols.map((c: any) => (c.label || '').trim());
  let startRowIdx = 0;

  const hasColLabels = headers.some(h => h.length > 0);
  if (!hasColLabels && rawRows.length > 0) {
    const firstRowCells = rawRows[0].c || [];
    headers = firstRowCells.map((cell: any) => (cell?.v !== undefined && cell?.v !== null ? String(cell.v).trim() : ''));
    startRowIdx = 1;
  }

  const rows: Record<string, any>[] = [];

  for (let r = startRowIdx; r < rawRows.length; r++) {
    const cells = rawRows[r].c || [];
    const rowObj: Record<string, any> = { _rowIndex: r + 1 };
    let hasData = false;

    headers.forEach((header, colIdx) => {
      if (!header) return;
      const cell = cells[colIdx];
      const val = cell?.v !== undefined && cell?.v !== null ? cell.v : (cell?.f || '');
      const strVal = typeof val === 'string' ? val.trim() : val;
      if (strVal !== '' && strVal !== undefined && strVal !== null) {
        hasData = true;
      }
      rowObj[header] = strVal;
      rowObj[cleanKey(header)] = strVal;
    });

    if (hasData) {
      rows.push(rowObj);
    }
  }

  return { headers, rows };
}

/**
 * Parses a boolean or checkbox value for guidedTour
 */
function parseBoolean(val: any): boolean {
  if (val === true || val === 1) return true;
  if (!val) return false;
  const s = String(val).toLowerCase().trim();
  return s === 'true' || s === 'yes' || s === 'y' || s === '1' || s === 'tick' || s === 'checked';
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rawSheetUrl = (searchParams.get('sheetUrl') || searchParams.get('url') || searchParams.get('sheetId') || '').trim();
    const packageQuery = (searchParams.get('package') || searchParams.get('query') || '').trim().toLowerCase();
    const sheetTab = (searchParams.get('tab') || '').trim();

    if (!rawSheetUrl) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid Google Sheet URL or Sheet ID.' },
        { status: 400 }
      );
    }

    const sheetId = extractSheetId(rawSheetUrl);
    if (!sheetId || sheetId.length < 10) {
      return NextResponse.json(
        { success: false, error: 'Could not extract a valid Google Sheet ID from the provided URL.' },
        { status: 400 }
      );
    }

    // Try fetching primary table and optional dedicated tabs
    const primaryTable = await fetchGvizTable(sheetId, sheetTab || undefined);

    let hotelsTable: { headers: string[]; rows: Record<string, any>[] } | null = null;
    let activitiesTable: { headers: string[]; rows: Record<string, any>[] } | null = null;
    let transportTable: { headers: string[]; rows: Record<string, any>[] } | null = null;

    try { hotelsTable = await fetchGvizTable(sheetId, 'Hotels'); } catch {}
    try { activitiesTable = await fetchGvizTable(sheetId, 'Activities'); } catch {}
    try { activitiesTable = activitiesTable || await fetchGvizTable(sheetId, 'Experiences'); } catch {}
    try { transportTable = await fetchGvizTable(sheetId, 'Transport'); } catch {}
    try { transportTable = transportTable || await fetchGvizTable(sheetId, 'Vehicles'); } catch {}

    // A. Parse Dedicated Hotels Tab (if present)
    const tabHotels: any[] = [];
    if (hotelsTable && hotelsTable.rows.length > 0) {
      hotelsTable.rows.forEach((hr, idx) => {
        const hName = String(hr.hotel_name || hr.property_name || hr.hotel || hr.name || '').trim();
        if (hName) {
          tabHotels.push({
            index: idx + 1,
            hotelName: hName,
            city: String(hr.city || hr.destination || hr.location || '').trim(),
            nights: parseInt(String(hr.nights || hr.no_of_nights || 1), 10) || 1,
            roomCategory: String(hr.room_category || hr.category || hr.room_type || 'Deluxe Room').trim(),
            stayDates: String(hr.stay_dates || hr.dates || '').trim()
          });
        }
      });
    }

    // B. Parse Dedicated Activities Tab (if present)
    const tabActivities: any[] = [];
    if (activitiesTable && activitiesTable.rows.length > 0) {
      activitiesTable.rows.forEach((ar, idx) => {
        const dayNum = parseInt(String(ar.day || ar.days || idx + 1).replace(/\D+/g, ''), 10) || idx + 1;
        const isGuided = parseBoolean(ar.guided_tour || ar.guided || ar.is_guided);
        const city = String(ar.city || '').trim();
        const city2 = String(ar.city_2 || ar.city2 || ar.transit_city || '').trim() || undefined;
        const enRoute = String(ar.en_route || ar.en_route_experiences || ar.enroute || '').trim() || undefined;

        const experiences: any[] = [];
        for (let e = 1; e <= 10; e++) {
          const expVal = String(ar[`experience_${e}`] || ar[`experience${e}`] || ar[`activity_${e}`] || ar[`activity${e}`] || (e === 1 ? (ar.experiences || ar.activities) : '') || '').trim();
          if (expVal) {
            // Check if multiple experiences separated by comma or pipe
            if (expVal.includes('|') || expVal.includes(',')) {
              const splitted = expVal.split(/[|,]/).map(s => s.trim()).filter(Boolean);
              splitted.forEach(s => experiences.push({ name: s, guidedTour: isGuided }));
            } else {
              experiences.push({ name: expVal, guidedTour: isGuided });
            }
          }
        }

        tabActivities.push({
          dayNumber: dayNum,
          dayText: `Day ${dayNum}`,
          city,
          city2,
          guidedTour: isGuided,
          enRouteExperiences: enRoute,
          experiences
        });
      });
    }

    // C. Parse Dedicated Transport Tab (if present)
    let tabVehicleType = '';
    if (transportTable && transportTable.rows.length > 0) {
      const firstRow = transportTable.rows[0];
      tabVehicleType = String(firstRow.vehicle_type || firstRow.vehicle || firstRow.transport || firstRow.cab || '').trim();
    }

    // D. Parse Row-based Itinerary Packages from Primary Table
    // Each row represents a package or circuit (e.g. "Rajasthan 5D Royal", "Kashmir 6D", etc.)
    const packages: any[] = [];

    primaryTable.rows.forEach((row, idx) => {
      const packageName = String(
        row.package_name || row.itinerary_name || row.itinerary || row.title || row.destination || `Package ${idx + 1}`
      ).trim();

      const destination = String(
        row.destination || row.destinations || row.city || packageName || 'Rajasthan'
      ).trim();

      const noOfDays = parseInt(String(row.no_of_days || row.days || row.num_days || 5), 10) || 5;
      const noOfNights = parseInt(String(row.no_of_nights || row.nights || (noOfDays > 1 ? noOfDays - 1 : 1)), 10) || 4;
      const vehicleType = String(row.vehicle_type || row.vehicle || row.transport || tabVehicleType || 'AC Sedan / Dzire').trim();
      const mealPlan = String(row.meal_plan || 'Breakfast & Dinner').trim();

      // Extract up to 6 hotels for this package
      const hotels: any[] = [];
      for (let h = 1; h <= 6; h++) {
        const hName = String(row[`hotel_${h}`] || row[`hotel${h}`] || row[`${h}th_hotel`] || '').trim();
        const hCity = String(row[`hotel_${h}_city`] || row[`hotel${h}_city`] || row[`${h}th_hotel_city`] || destination).trim();
        const hNights = parseInt(String(row[`hotel_${h}_nights`] || row[`hotel${h}_nights`] || 1), 10) || 1;
        const hCat = String(row[`hotel_${h}_category`] || row[`hotel${h}_category`] || row.hotel_category || 'Deluxe Room').trim();
        const hStayDates = String(row[`hotel_${h}_stay_dates`] || row[`hotel${h}_stay_dates`] || '').trim();

        if (hName) {
          hotels.push({
            index: h,
            hotelName: hName,
            city: hCity,
            nights: hNights,
            roomCategory: hCat,
            stayDates: hStayDates
          });
        }
      }

      // If no hotel columns were found in this row, check if tabHotels has data
      const finalHotels = hotels.length > 0 ? hotels : tabHotels;

      // Extract day-wise activities for this package
      const dayActivities: any[] = [];
      for (let d = 1; d <= noOfDays; d++) {
        const dCity = String(row[`day_${d}_city`] || row[`day${d}_city`] || destination).trim();
        const dEnRoute = String(row[`day_${d}_en_route`] || row[`day${d}_en_route`] || row[`day_${d}_enroute`] || '').trim();
        const isGuided = parseBoolean(row[`day_${d}_guided_tour`] ?? row[`day${d}_guided_tour`] ?? row[`day_${d}_guided`]);

        const experiences: any[] = [];
        for (let e = 1; e <= 10; e++) {
          const expVal = String(
            row[`day_${d}_experience_${e}`] ||
            row[`day${d}_experience_${e}`] ||
            row[`day_${d}_exp_${e}`] ||
            (e === 1 ? (row[`day_${d}_experiences`] || row[`day${d}_activities`]) : '') ||
            ''
          ).trim();

          if (expVal) {
            if (expVal.includes('|') || expVal.includes(',')) {
              const splitted = expVal.split(/[|,]/).map(s => s.trim()).filter(Boolean);
              splitted.forEach(s => experiences.push({ name: s, guidedTour: isGuided }));
            } else {
              experiences.push({ name: expVal, guidedTour: isGuided });
            }
          }
        }

        if (experiences.length > 0 || dEnRoute || row[`day_${d}_city`]) {
          dayActivities.push({
            dayNumber: d,
            dayText: `Day ${d}`,
            city: dCity,
            guidedTour: isGuided,
            enRouteExperiences: dEnRoute || undefined,
            experiences
          });
        }
      }

      // If no day activities columns found in this row, check tabActivities
      const finalActivities = dayActivities.length > 0 ? dayActivities : tabActivities;

      const baseQuote = Number(row.base_quotation_amount || row.base_quote || row.price || row.cost || 0) || undefined;
      const marginPct = Number(row.margin_percentage || row.margin || 0) || undefined;
      const finalQuote = Number(row.final_quotation_amount || row.final_quote || 0) || baseQuote;

      packages.push({
        id: `pkg-${idx + 1}`,
        packageName,
        destination,
        noOfDays,
        noOfNights,
        vehicleType,
        mealPlan,
        hotels: finalHotels,
        dayActivities: finalActivities,
        baseQuotationAmount: baseQuote,
        marginPercentage: marginPct,
        finalQuotationAmount: finalQuote,
        specialRequirements: String(row.inclusions_summary || row.notes || row.description || '').trim()
      });
    });

    // Aggregate Lookup Maps from all available Sheet tables & packages
    const citiesByDestination: Record<string, string[]> = {};
    const experiencesByCity: Record<string, {
      name: string;
      guidedTour?: boolean;
      ppCost?: number;
      fullCost?: number;
      duration?: string;
      description?: string;
      templateDescription?: string;
    }[]> = {};
    const hotelsByCity: Record<string, { hotelName: string; category?: string; roomCategory?: string }[]> = {};
    const allDestinationsSet = new Set<string>();

    const addCityToDest = (dest: string, city: string) => {
      const cleanDest = dest.trim();
      const cleanCity = city.trim();
      if (!cleanDest || !cleanCity) return;
      allDestinationsSet.add(cleanDest);
      const key = cleanDest.toLowerCase();
      if (!citiesByDestination[cleanDest]) {
        citiesByDestination[cleanDest] = [];
      }
      if (!citiesByDestination[cleanDest].includes(cleanCity)) {
        citiesByDestination[cleanDest].push(cleanCity);
      }
    };

    const addExpToCity = (city: string, expName: string, isGuided?: boolean, meta?: any) => {
      const cleanCity = city.trim();
      const cleanExp = expName.trim();
      if (!cleanCity || !cleanExp) return;
      const key = cleanCity.toLowerCase();
      if (!experiencesByCity[key]) {
        experiencesByCity[key] = [];
      }
      const existingIdx = experiencesByCity[key].findIndex(e => e.name.toLowerCase() === cleanExp.toLowerCase());
      const item = {
        name: cleanExp,
        guidedTour: Boolean(isGuided),
        ppCost: Number(meta?.ppCost ?? meta?.pp_cost ?? 0) || 0,
        fullCost: Number(meta?.fullCost ?? meta?.full_cost ?? 0) || 0,
        duration: meta?.duration || '',
        description: meta?.description || meta?.inclusions_description || meta?.description_for_template || '',
        templateDescription: meta?.templateDescription || meta?.description_for_template || meta?.inclusions_description || ''
      };
      if (existingIdx === -1) {
        experiencesByCity[key].push(item);
      } else {
        if (!experiencesByCity[key][existingIdx].description && item.description) {
          experiencesByCity[key][existingIdx] = { ...experiencesByCity[key][existingIdx], ...item };
        }
      }
    };

    const addHotelToCity = (city: string, hotelName: string, cat?: string, room?: string) => {
      const cleanCity = city.trim();
      const cleanH = hotelName.trim();
      if (!cleanCity || !cleanH) return;
      const key = cleanCity.toLowerCase();
      if (!hotelsByCity[key]) {
        hotelsByCity[key] = [];
      }
      if (!hotelsByCity[key].some(h => h.hotelName.toLowerCase() === cleanH.toLowerCase())) {
        hotelsByCity[key].push({ hotelName: cleanH, category: cat, roomCategory: room });
      }
    };

    // 1. Ingest from tabHotels
    tabHotels.forEach(h => {
      if (h.city) {
        addHotelToCity(h.city, h.hotelName, h.roomCategory);
      }
    });

    // 2. Ingest from tabActivities
    tabActivities.forEach(a => {
      if (a.city) {
        (a.experiences || []).forEach((exp: any) => {
          addExpToCity(a.city, exp.name, exp.guidedTour ?? a.guidedTour);
        });
      }
    });

    // Ingest directly from primaryTable (handles Activity Master sheets seamlessly)
    primaryTable.rows.forEach(r => {
      const rDest = String(r.destination || r.destinations || '').trim();
      const rCity = String(r.city || '').trim();
      const rExp = String(r.experience || r.activity || r.sightseeing || r.experience_name || '').trim();
      const rGuided = parseBoolean(r.guided_tour || r.guided);
      const ppCost = Number(r.pp_cost || r.ppcost || 0) || 0;
      const fullCost = Number(r.full_cost || r.fullcost || 0) || 0;
      const desc = String(r.inclusions_description || r.inclusions || r.description || '').trim();
      const templateDesc = String(r.description_for_template || r.template_description || '').trim();

      if (rDest && rCity) addCityToDest(rDest, rCity);
      if (rCity && rExp) {
        addExpToCity(rCity, rExp, rGuided, {
          ppCost,
          fullCost,
          duration: String(r.duration || '').trim(),
          description: desc || templateDesc,
          templateDescription: templateDesc || desc
        });
      }
    });

    // 4. Ingest raw rows from Activities tab if available (for standalone experience rows)
    if (activitiesTable && activitiesTable.rows.length > 0) {
      activitiesTable.rows.forEach(ar => {
        const rowDest = String(ar.destination || ar.destinations || '').trim();
        const rowCity = String(ar.city || '').trim();
        const expName = String(ar.experience || ar.experience_name || ar.activity || ar.sightseeing || '').trim();
        const isGuided = parseBoolean(ar.guided_tour || ar.guided);
        if (rowDest && rowCity) addCityToDest(rowDest, rowCity);
        if (rowCity && expName) addExpToCity(rowCity, expName, isGuided);
      });
    }

    // Select matched package or default first package
    let selectedPackage = packages[0] || null;
    if (packageQuery && packages.length > 0) {
      const match = packages.find(p =>
        p.packageName.toLowerCase().includes(packageQuery) ||
        p.destination.toLowerCase().includes(packageQuery) ||
        p.id === packageQuery
      );
      if (match) selectedPackage = match;
    }

    return NextResponse.json({
      success: true,
      sheetId,
      totalPackages: packages.length,
      allDestinations: Array.from(allDestinationsSet),
      citiesByDestination,
      experiencesByCity,
      hotelsByCity,
      packages: packages.map(p => ({
        id: p.id,
        packageName: p.packageName,
        destination: p.destination,
        noOfDays: p.noOfDays,
        noOfNights: p.noOfNights,
        vehicleType: p.vehicleType,
        hotelsCount: p.hotels?.length || 0,
        daysCount: p.dayActivities?.length || 0,
        quote: p.finalQuotationAmount || p.baseQuotationAmount
      })),
      selectedPackage,
      // Default direct data if tab based
      hotels: selectedPackage?.hotels || tabHotels,
      dayActivities: selectedPackage?.dayActivities || tabActivities,
      transport: {
        vehicleType: selectedPackage?.vehicleType || tabVehicleType || 'AC Sedan / Dzire'
      }
    });
  } catch (error: any) {
    console.error('[Google Sheet Data Fetch Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch itinerary data from Google Sheet.' },
      { status: 500 }
    );
  }
}
