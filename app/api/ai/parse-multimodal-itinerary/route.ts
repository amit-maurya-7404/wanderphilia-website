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
    const formData = await req.formData();
    const prompt = String(formData.get('prompt') || '').trim();
    const fileEntries = formData.getAll('files');

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
            temperature: 0.2,
            max_tokens: 8192
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

    // Heuristic Day Parser to guarantee 100% days extraction if AI truncated or missed days
    const parseDaysFromTextFallback = (text: string) => {
      const daySections = text.split(/(?:^|\n)\s*(?=Day\s*\d+)/i);
      const results: any[] = [];
      let autoDayNum = 1;

      for (const sec of daySections) {
        const trimmed = sec.trim();
        const headerMatch = trimmed.match(/^Day\s*(\d+)?[\s:–—-]*(.*)/i);
        if (!headerMatch) continue;

        const dayNum = headerMatch[1] ? parseInt(headerMatch[1], 10) : autoDayNum;
        autoDayNum = dayNum + 1;

        const lines = trimmed.split('\n').map(l => l.trim()).filter(Boolean);
        const titleLine = lines[0] || `Day ${dayNum}`;

        let toCity = '';
        const stayMatch = trimmed.match(/NIGHT\s*STAY\s*:\s*([A-Za-z\s\/]+)/i);
        if (stayMatch) {
          toCity = stayMatch[1].trim();
        }

        let fromCity = '';
        const arrowMatch = titleLine.match(/(.+?)\s*(?:→|->|to)\s*(.+)/i);
        if (arrowMatch) {
          fromCity = arrowMatch[1].replace(/^Day\s*\d+\s*[–—:-]*\s*/i, '').trim();
          if (!toCity) toCity = arrowMatch[2].replace(/\|.*/, '').trim();
        }

        const points: string[] = [];
        lines.slice(1).forEach(l => {
          if (/^(approx|night stay|from apple|welcome to|a day straight|every journey|start early|wake up|\*?Stay Details|\*?Inclusions|\*?Costing|\*?Hotels)/i.test(l)) return;
          if (l.length > 8) {
            points.push(l.replace(/^[-*•\d\.\)]\s*/, '').trim());
          }
        });

        results.push({
          day: dayNum,
          title: titleLine.replace(/^Day\s*\d+\s*[–—:-]*\s*/i, `Day ${dayNum} – `),
          fromCity: fromCity || (dayNum === 1 ? 'Chandigarh' : ''),
          toCity: toCity || 'Destination',
          enRouteStops: [],
          meals: {
            breakfast: /breakfast/i.test(trimmed),
            lunch: /lunch/i.test(trimmed),
            dinner: /dinner|overnight/i.test(trimmed)
          },
          guidedTour: true,
          sightseeingPoints: points.length > 0 ? points : [titleLine]
        });
      }

      return results;
    };

    if (!parsedResult) {
      const fallbackDays = parseDaysFromTextFallback(compiledInputText);
      if (fallbackDays.length > 0) {
        parsedResult = {
          destination: 'Himalayan Tour',
          dayPlans: fallbackDays,
          noOfDays: fallbackDays.length,
          noOfNights: Math.max(1, fallbackDays.length - 1)
        };
      } else {
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
    }

    if (parsedResult) {
      // 1. Normalize and guarantee dayPlans / dayItineraries / days
      const textFallbackDays = parseDaysFromTextFallback(compiledInputText);
      let rawDayPlans: any[] = parsedResult.dayPlans || parsedResult.dayItineraries || parsedResult.days || parsedResult.dayWiseItinerary || parsedResult.itinerary || [];

      // If AI days are fewer than what was found in the text, merge to preserve all days
      if (textFallbackDays.length > 0 && rawDayPlans.length < textFallbackDays.length) {
        const mergedDays: any[] = [];
        for (let i = 1; i <= textFallbackDays.length; i++) {
          const existing = rawDayPlans.find((d: any) => Number(d.day || d.dayNumber) === i);
          if (existing && Array.isArray(existing.sightseeingPoints) && existing.sightseeingPoints.length > 0) {
            mergedDays.push(existing);
          } else {
            const fallback = textFallbackDays.find((d: any) => d.day === i);
            if (fallback) mergedDays.push(fallback);
            else if (existing) mergedDays.push(existing);
          }
        }
        rawDayPlans = mergedDays;
      } else if (rawDayPlans.length === 0 && textFallbackDays.length > 0) {
        rawDayPlans = textFallbackDays;
      }

      parsedResult.dayPlans = rawDayPlans;
      parsedResult.dayItineraries = rawDayPlans;
      parsedResult.days = rawDayPlans;
      if (rawDayPlans.length > 0) {
        parsedResult.noOfDays = rawDayPlans.length;
        parsedResult.noOfNights = Math.max(1, rawDayPlans.length - 1);
      }

      // 2. Post-process and ensure Moments are strictly pure experiences (no transit/logistics)
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
            if (s && s.length > 8 && !isLogistical(s) && !cleanMoments.includes(s) && !extracted.includes(s)) {
              extracted.push(s);
            }
          });
        });
        cleanMoments = [...cleanMoments, ...extracted].slice(0, 8);
      }
      parsedResult.moments = cleanMoments;

      // 3. Ensure Pricing is fully synchronized whether nested in pricing or flat at root
      const rawPerAdult = Number(parsedResult.pricing?.perAdultPrice || parsedResult.perAdultPrice) || 0;
      const rawPerKid = Number(parsedResult.pricing?.perKidPrice || parsedResult.perKidPrice) || 0;
      const adults = Number(parsedResult.pricing?.adults || parsedResult.adults || 3);
      const kids = Number(parsedResult.pricing?.kids || parsedResult.kids || 0);
      const baseCalc = rawPerAdult * adults;
      const finalCalc = Number(parsedResult.pricing?.finalQuotationAmount || parsedResult.finalQuotationAmount) || baseCalc;
      const advCalc = Number(parsedResult.pricing?.advanceAmount || parsedResult.advanceAmount) || (finalCalc > 0 ? Math.round(finalCalc * 0.1) : 0);

      parsedResult.pricing = {
        adults,
        kids,
        perAdultPrice: rawPerAdult > 0 ? rawPerAdult : null,
        perKidPrice: rawPerKid > 0 ? rawPerKid : null,
        baseAmount: baseCalc > 0 ? baseCalc : null,
        finalQuotationAmount: finalCalc > 0 ? finalCalc : null,
        advanceAmount: advCalc > 0 ? advCalc : null,
        kidsDetails: parsedResult.kidsDetails || []
      };
      parsedResult.perAdultPrice = rawPerAdult;
      parsedResult.baseAmount = baseCalc;
      parsedResult.finalQuotationAmount = finalCalc;

      // 4. Fallback for hotelStays if AI missed it
      if (!Array.isArray(parsedResult.hotelStays) || parsedResult.hotelStays.length === 0) {
        const stayRegex = /(?:Stay Details|Hotels)\s*:?\s*([\s\S]*?)(?=(?:Costing|Inclusions|Exclusions|\$))/i;
        const stayMatch = compiledInputText.match(stayRegex);
        if (stayMatch) {
          const lines = stayMatch[1].split('\n').map(l => l.trim()).filter(Boolean);
          const parsedStays: any[] = [];
          lines.forEach(l => {
            const colonMatch = l.match(/([^:]+)\s*:\s*(.+)/);
            if (colonMatch) {
              const city = colonMatch[1].replace(/^[-*•]\s*/, '').trim();
              const hotelName = colonMatch[2].replace(/^[-*•]\s*/, '').trim();
              if (city && hotelName) {
                parsedStays.push({
                  hotelName,
                  city,
                  nights: 1,
                  roomCategory: 'Deluxe Room',
                  category: 'Deluxe'
                });
              }
            }
          });
          if (parsedStays.length > 0) {
            parsedResult.hotelStays = parsedStays;
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

