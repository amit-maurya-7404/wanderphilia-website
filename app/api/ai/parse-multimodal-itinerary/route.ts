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

CRITICAL RULES:
1. SIGHTSEEING & DAY PLANS:
   - Construct full Day 1 to Day N plans.
   - For each day:
     - "day": integer (1, 2, ...)
     - "title": e.g. "Day 1 | Arrival in Singapore & Marina Bay Sands Check-In"
     - "fromCity": starting city
     - "toCity": destination or stay city
     - "route": e.g. "Singapore Airport → Marina Bay Sands"
     - "durationNote": e.g. "Private Mercedes V-Class Airport Transfer"
     - "stayLocation": city or area name
     - "enRouteStops": string array of any en-route stops
     - "meals": { "breakfast": boolean, "lunch": boolean, "dinner": boolean }
     - "guidedTour": boolean
     - "sightseeingPoints": detailed array of string bullets describing morning, afternoon, evening activities and experiences in full luxury polish.

2. FLIGHT DETAILS (IF PRESENT IN SCREENSHOT OR TEXT):
   - If airline, flight number, airport codes, cabin class (e.g. Business Class Stretch Plus, Economy, Premium), timings or prices are present:
     - Populate "flightQuotations" array with:
       - "optionTitle": e.g. "Business Class Stretch Plus Flight (Mumbai ↔ Singapore Round-Trip)"
       - "totalPrice": total flight quotation amount
       - "perPersonPrice": per person airfare if mentioned
       - "paxDetails": e.g. "3 Adults, 2 Children (Round-Trip Return Airfare)"
       - "note": baggage info or refund policy
       - "sectors": array of flight legs with { "fromCity", "toCity", "fromCode", "toCode", "airline", "flightNumber", "departureDate", "departureTime", "arrivalDate", "arrivalTime", "duration", "stops", "cabinClass", "baggage", "journeyType" }

3. DEDICATED HOTEL COST (IF SEPARATE OR SPECIFIED):
   - If the user or voucher mentions a separate hotel cost (e.g. Marina Bay Sands luxury stay):
     - Populate "hotelCostDetails" with:
       - "hotelName": e.g. "Marina Bay Sands Singapore"
       - "rating": "5-Star Luxury"
       - "checkIn", "checkOut", "nights", "roomsCount", "roomCategory" (e.g. "Sands Premier Room Harbour View")
       - "totalCost": number (e.g. 544000)
       - "inclusions": string array (e.g. ["Daily Breakfast at RISE Restaurant", "SkyPark Infinity Pool Access"])
       - "note": string

4. PAX & PRICING BREAKDOWN:
   - Detect number of adults and kids with their ages (e.g. "1 kid 11 yr", "1 kid 2 yr complimentary free").
   - Populate "pricing":
     - "adults": number
     - "kids": number
     - "perAdultPrice": number
     - "perKidPrice": number
     - "baseAmount": number (adults * perAdult + kids * perKid)
     - "gstPercentage": number (default 5 if international or specified)
     - "tcsPercentage": number (default 2 or 5 if international)
     - "gstAmount": number
     - "tcsAmount": number
     - "finalQuotationAmount": number
     - "childPricingNote": e.g. "1 Kid (11 Years): ₹66,500 | 1 Infant (2 Years): Complimentary Free"
   - Populate "kidsDetails": array of { "age": number, "notes": string, "isComplimentary": boolean, "price": number }

5. VEHICLE & MEAL PLAN:
   - Identify vehicle: e.g. "Private Mercedes-Benz V Class with Chauffeur", "AC Innova Crysta", "Private AC Luxury Van"
   - Identify meal plan: e.g. "Breakfast & Dinner", "Daily Breakfast", "All Meals"

6. INCLUSIONS & EXCLUSIONS:
   - Comprehensive inclusions matching the luxury itinerary (transfers, flights if included, hotel stays, guided experiences, entrance tickets, chauffeur, taxes).
   - Standard exclusions (personal expenses, GST/TCS if excluded, optional activities).

7. DESTINATION & METADATA:
   - "destination": primary destination (e.g. "Singapore", "Rajasthan", "Vietnam")
   - "destinationType": "India" or "International"
   - "travelStyle": e.g. "Family Luxury Getaway", "Couple Honeymoon", "Heritage & Culture"
   - "noOfDays": number
   - "noOfNights": number
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

