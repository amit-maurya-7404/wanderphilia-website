import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const maxDuration = 60; // 60 seconds timeout for processing OCR & PDF

interface ExtractedFile {
  name: string;
  type: string;
  size: number;
  extractedText: string;
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';
    let prompt = '';
    const fileEntries: any[] = [];

    if (contentType.includes('application/json')) {
      const jsonBody = await req.json().catch(() => ({}));
      prompt = String(jsonBody.prompt || '').trim();
    } else {
      const formData = await req.formData();
      prompt = String(formData.get('prompt') || '').trim();
      fileEntries.push(...formData.getAll('files'));
    }

    const extractedFiles: ExtractedFile[] = [];
    const errors: string[] = [];

    // 1. Process all attached files (PDFs and Images)
    for (const entry of fileEntries) {
      if (!entry || !(entry instanceof Blob)) continue;

      const file = entry as File;
      const fileName = file.name || 'unnamed-file';
      const fileType = file.type || '';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // A) Handle PDF Documents
      if (fileType.includes('pdf') || fileName.toLowerCase().endsWith('.pdf')) {
        try {
          const { PDFParse } = await import('pdf-parse');
          const parser = new PDFParse({ data: buffer });
          const textResult = await parser.getText();
          await parser.destroy();

          const cleanPdfText = (textResult.text || '').trim();
          if (cleanPdfText) {
            extractedFiles.push({
              name: fileName,
              type: 'PDF',
              size: file.size,
              extractedText: cleanPdfText
            });
          } else {
            errors.push(`PDF ${fileName} had no selectable text.`);
          }
        } catch (pdfErr: any) {
          console.error(`[PDF Extract Error for ${fileName}]:`, pdfErr);
          errors.push(`Failed to parse PDF ${fileName}: ${pdfErr?.message || pdfErr}`);
        }
      }
      // B) Handle Images / Screenshots (OCR via Tesseract.js)
      else if (
        fileType.startsWith('image/') ||
        /\.(png|jpe?g|webp|bmp|tiff)$/i.test(fileName)
      ) {
        try {
          const { createWorker } = await import('tesseract.js');
          const worker = await createWorker('eng');
          const ret = await worker.recognize(buffer);
          await worker.terminate();

          const ocrText = (ret.data.text || '').trim();
          if (ocrText) {
            extractedFiles.push({
              name: fileName,
              type: 'Image (OCR)',
              size: file.size,
              extractedText: ocrText
            });
          } else {
            errors.push(`Could not read clear text from image ${fileName}.`);
          }
        } catch (imgErr: any) {
          console.error(`[OCR Error for ${fileName}]:`, imgErr);
          errors.push(`Failed OCR on image ${fileName}: ${imgErr?.message || imgErr}`);
        }
      }
      // C) Handle Plain Text / Docx / CSV
      else if (fileType.includes('text') || fileName.toLowerCase().endsWith('.txt')) {
        const rawText = buffer.toString('utf-8').trim();
        if (rawText) {
          extractedFiles.push({
            name: fileName,
            type: 'Text',
            size: file.size,
            extractedText: rawText
          });
        }
      }
    }

    if (!prompt && extractedFiles.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide instructions or upload at least one PDF/Image file.'
        },
        { status: 400 }
      );
    }

    // 2. Synthesize all extracted content into AI Prompt
    const contentBlocks: string[] = [];

    if (prompt) {
      contentBlocks.push(`### USER INSTRUCTIONS & REQUIREMENTS:\n${prompt}\n`);
    }

    if (extractedFiles.length > 0) {
      contentBlocks.push(`### EXTRACTED CONTENT FROM ATTACHED DOCUMENTS & SCREENSHOTS:`);
      extractedFiles.forEach((f, idx) => {
        contentBlocks.push(`\n--- DOCUMENT ${idx + 1}: ${f.name} (${f.type}, ${Math.round(f.size / 1024)} KB) ---\n${f.extractedText}\n`);
      });
    }

    const compiledInputText = contentBlocks.join('\n');

    // 3. AI Parsing System Prompt
    const systemPrompt = `You are the Lead Luxury Travel Itinerary Architect for Wanderphilia Experiences (premium experiential travel agency).
Your mission is to parse the user's uploaded travel documents, flight screenshots, rate vouchers, supplier write-ups, and natural language instructions into a 100% structured, production-ready Luxury Itinerary JSON.

CRITICAL EXTRACTION REQUIREMENTS:
1. SIGHTSEEING & DAY PLANS:
   - Extract every day from Day 1 to Day N (do NOT skip or merge any days!).
   - For each day:
     - "day": integer (1, 2, ...)
     - "title": Narrative day title (e.g. "Day 1 — Arrive in Manali | Mountains & Old Manali", "Day 4 — Kullu River Rafting | Kasol")
     - "fromCity": starting city
     - "toCity": destination or night stay city
     - "enRouteStops": string array of stops en route
     - "meals": { "breakfast": boolean, "lunch": boolean, "dinner": boolean }
     - "guidedTour": boolean
     - "sightseeingPoints": detailed array of string bullets describing the day's sightseeing and activities.

2. HOTEL STAYS (CRITICAL - EXTRACT EVERY PROPERTY AND NIGHTS):
   - Extract all accommodation properties into "hotelStays" array:
     - "hotelName": exact property name (e.g. "Hotel Conifer / Similar", "Royal Castle / Similar", "Dragon Mud House / Similar")
     - "city": city location (e.g. "Manali", "Kasol", "Bir Billing", "Kaza")
     - "nights": number of nights (integer)
     - "roomCategory": room type or sharing basis (e.g. "Triple Sharing Deluxe", "Mountain View Room")
     - "category": "Deluxe" | "Luxury" | "Premium" | "Boutique" | "Budget"

3. WANDERPHILIA MOMENTS (CRITICAL - PURE AUTHENTIC EXPERIENCES ONLY):
   - Return "moments": an array of 6 to 8 evocative, pure travel experiences ONLY.
   - ABSOLUTE PROHIBITION: NO transit sentences! NO "Arrive in Manali from Chandigarh", NO "Check into hotel", NO "Relax and enjoy lunch", NO "Overnight in...", NO "Check out and drive to...".
   - Only high-value authentic experiences, e.g.:
     - "Tandem Paragliding Flight from World-Renowned Billing Takeoff Site"
     - "Exploring Sissu Lake and Roaring Waterfall via the Iconic Atal Tunnel"
     - "Visiting Ancient Hadimba Devi Temple Surrounded by Himalayan Cedar Forests"
     - "Scenic Forest Walk Along the Parvati River to Serene Chalal Village"
     - "Spiritual Visit to Sacred Manikaran Sahib Gurudwara and Natural Hot Springs"

4. FLIGHT DETAILS (IF PRESENT IN SCREENSHOT OR TEXT):
   - If airline, flight number, airport codes, cabin class, timings or prices are present:
     - Populate "flightQuotations" array with:
       - "optionTitle": e.g. "Round-Trip Flights (Delhi ↔ Chandigarh)"
       - "totalPrice": total flight quotation amount
       - "perPersonPrice": per person airfare if mentioned
       - "paxDetails": string
       - "note": string
       - "sectors": array of flight legs with { "fromCity", "toCity", "fromCode", "toCode", "airline", "flightNumber", "departureDate", "departureTime", "arrivalDate", "arrivalTime", "duration", "stops", "cabinClass", "baggage", "journeyType" }

5. DEDICATED HOTEL COST (IF SEPARATE OR SPECIFIED):
   - If the user or voucher mentions a separate hotel cost:
     - Populate "hotelCostDetails" with:
       - "hotelName", "rating", "checkIn", "checkOut", "nights", "roomsCount", "roomCategory", "totalCost", "inclusions", "note"

6. PAX & PRICING BREAKDOWN:
   - Accurately detect pricing:
     - If "22,250/- per person" or "Costing Per Person: 28,590/-" is given:
       - "perAdultPrice": number (e.g. 28590)
       - "perKidPrice": number or null
       - "baseAmount": perAdultPrice * adults (e.g. 85770)
       - "finalQuotationAmount": total package price without GST (e.g. 85770)
       - "advanceAmount": number or null
   - "adults": number (e.g. 3)
   - "kids": number (e.g. 0)
   - "kidsDetails": array of { "age": number, "notes": string, "isComplimentary": boolean, "price": number }

7. VEHICLE & MEAL PLAN:
   - "vehicleType": Exact vehicle (e.g. "Comfortable Sedan Swift Dzire for the whole trip from Chandigarh - Chandigarh", "Dedicated Private Mountain Vehicle")
   - "mealPlan": Exact meal plan (e.g. "Jain Breakfast & Dinner (Except Day 1 Breakfast & Day 7 Dinner)", "Daily Breakfast & Dinner")

8. INCLUSIONS & EXCLUSIONS:
   - "inclusions": Comprehensive string array matching the package
   - "exclusions": Standard string array of exclusions

9. DESTINATION & METADATA:
   - "destination": primary destination (e.g. "Himachal Pradesh", "Spiti Valley", "Rajasthan", "Sri Lanka", "Vietnam")
   - "destinationType": "India" or "International"
   - "travelStyle": e.g. "Adventure & Leisure Escape", "Family Luxury Getaway", "Customised Tour"
   - "noOfDays": number (e.g. 7)
   - "noOfNights": number (e.g. 6)
   - "startDate": string or ""
   - "endDate": string or ""

10. LEAD TRAVELER NAME & CONTACT:
   - "leadTraveler": { "name": string, "phone": string, "email": string, "departureCity": string }
   - If the user provides a client/guest name (e.g. "client name heer", "Heer Himachal", "Guest: Amit Maurya", "Heer"), extract the person's name (e.g. "Heer", "Amit Maurya") into "leadTraveler.name". Do NOT leave it empty if a name is mentioned!
   - Extract departure city (e.g. "Chandigarh", "Delhi", "Mumbai") if given.
   - "leadTraveler": { "name": string, "phone": string, "email": string, "departureCity": string }

Respond ONLY with a valid, clean JSON object matching this schema. Do not wrap in markdown quotes if possible, or use standard JSON.`;

    const userPrompt = `Process this multimodal travel booking data into full Luxury Itinerary JSON:\n\n${compiledInputText}`;

    let parsedResult: any = null;
    let lastError: string | null = null;

    // 4. Send to Groq AI
    const groqApiKey = process.env.GROQ_API_KEY || '';
    const groqModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];

    for (const model of groqModels) {
      try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${groqApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.2
          })
        });

        if (res.ok) {
          const data = await res.json();
          const content = data.choices?.[0]?.message?.content || '';
          if (content) {
            try {
              parsedResult = JSON.parse(content);
              if (parsedResult) break;
            } catch (pErr) {
              // Try regex cleanup if JSON parsing failed
              const match = content.match(/\{[\s\S]*\}/);
              if (match) {
                parsedResult = JSON.parse(match[0]);
                if (parsedResult) break;
              }
            }
          }
        } else {
          lastError = await res.text();
          console.warn(`Groq model ${model} failed:`, lastError);
        }
      } catch (callErr: any) {
        lastError = callErr?.message || String(callErr);
        console.warn(`Groq model ${model} error:`, lastError);
      }
    }

    if (!parsedResult) {
      return NextResponse.json(
        {
          success: false,
          error: `AI processing failed. ${lastError || 'Please try again with clearer files or prompt.'}`,
          extractedFilesCount: extractedFiles.length,
          fileErrors: errors
        },
        { status: 500 }
      );
    }

    if (parsedResult) {
      // Normalize dayPlans / dayItineraries
      if (!parsedResult.dayPlans && parsedResult.dayItineraries) {
        parsedResult.dayPlans = parsedResult.dayItineraries;
      }
      if (!parsedResult.dayItineraries && parsedResult.dayPlans) {
        parsedResult.dayItineraries = parsedResult.dayPlans;
      }

      // 1. Post-process and ensure Moments are strictly pure experiences (no transit/logistics)
      const isLogistical = (text: string) => {
        const lower = String(text || '').toLowerCase().trim();
        return /^(arrive|arrival|pickup|drop|transfer|drive|check[\s-]?in|check[\s-]?out|reach|overnight|morning breakfast|after breakfast|evening at leisure|dinner and overnight|proceed to)/i.test(lower) ||
               /(hotel|resort|homestay|station|airport)\s*(check-in|checkout|transfer|stay)/i.test(lower) ||
               /^(relax and enjoy lunch|evening at leisure|breakfast at|dinner and sleep)/i.test(lower);
      };

      let cleanMoments: string[] = [];
      if (Array.isArray(parsedResult.moments)) {
        cleanMoments = parsedResult.moments.filter((m: any) => typeof m === 'string' && m.trim() && !isLogistical(m));
      }

      if (cleanMoments.length < 5 && Array.isArray(parsedResult.dayPlans)) {
        const extracted: string[] = [];
        parsedResult.dayPlans.forEach((dp: any) => {
          const pts = Array.isArray(dp.sightseeingPoints) ? dp.sightseeingPoints : [];
          pts.forEach((pt: any) => {
            const s = String(pt || '').replace(/^\d+[\.\)]\s*/, '').replace(/^[-*•]\s*/, '').trim();
            if (s && !isLogistical(s) && !cleanMoments.includes(s) && !extracted.includes(s)) {
              extracted.push(s);
            }
          });
        });
        cleanMoments = [...cleanMoments, ...extracted].slice(0, 8);
      }
      parsedResult.moments = cleanMoments;

      // 2. Ensure Pricing is fully synchronized
      if (parsedResult.pricing) {
        const adults = Number(parsedResult.adults || parsedResult.pricing.adults || 1);
        const perAdult = Number(parsedResult.pricing.perAdultPrice) || 0;
        if (perAdult > 0) {
          const baseCalc = perAdult * adults;
          if (!parsedResult.pricing.baseAmount) {
            parsedResult.pricing.baseAmount = baseCalc;
          }
          if (!parsedResult.pricing.finalQuotationAmount) {
            parsedResult.pricing.finalQuotationAmount = baseCalc;
          }
        }
      }

      // 3. Fallback for hotelStays if AI missed it
      if ((!Array.isArray(parsedResult.hotelStays) || parsedResult.hotelStays.length === 0) && Array.isArray(parsedResult.dayPlans)) {
        const derived: any[] = [];
        parsedResult.dayPlans.forEach((dp: any) => {
          const city = dp.toCity || dp.stayLocation || dp.fromCity;
          if (city && !derived.some(h => h.city.toLowerCase() === city.toLowerCase())) {
            derived.push({
              hotelName: `Deluxe Hotel / Similar`,
              city: city,
              nights: 1,
              roomCategory: 'Deluxe Room',
              category: 'Deluxe'
            });
          } else if (city) {
            const existing = derived.find(h => h.city.toLowerCase() === city.toLowerCase());
            if (existing) existing.nights += 1;
          }
        });
        if (derived.length > 0) parsedResult.hotelStays = derived;
      }
    }

    return NextResponse.json({
      success: true,
      data: parsedResult,
      fileStats: extractedFiles.map(f => ({ name: f.name, type: f.type, size: f.size })),
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error: any) {
    console.error('[Multimodal Itinerary Parse Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while processing itinerary.' },
      { status: 500 }
    );
  }
}

