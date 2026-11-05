export interface ItinerarySeoMetadata {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
}

/**
 * Clean & format SEO Title (under 60 chars)
 */
function cleanSeoTitle(title: string, destination?: string): string {
  let cleaned = title.trim();
  // Remove duplicate mentions
  if (destination && !cleaned.toLowerCase().includes(destination.toLowerCase())) {
    cleaned = `${cleaned} - ${destination}`;
  }
  if (!cleaned.toLowerCase().includes('wanderphilia')) {
    cleaned = `${cleaned} | Wanderphilia`;
  }
  return cleaned;
}

/**
 * Generate AI-crafted or smart heuristic SEO metadata for any tour itinerary
 */
export async function generateItinerarySeo(trip: {
  title: string;
  destination?: string;
  category?: string;
  duration?: number;
  nights?: number;
  staySummary?: string;
  route?: string;
  description?: string;
  price?: number;
}): Promise<ItinerarySeoMetadata> {
  const dest = trip.destination || trip.category || 'India';
  const durationText = trip.nights ? `${trip.nights}N/${(trip.duration || trip.nights + 1)}D` : (trip.duration ? `${trip.duration} Days` : '');
  const routeText = trip.staySummary || trip.route || '';

  // Smart algorithmic default
  const defaultTitle = cleanSeoTitle(
    `${durationText ? durationText + ' ' : ''}${trip.title}`,
    dest
  );

  const defaultDescription = trip.description
    ? trip.description.slice(0, 155).replace(/\s+[^\s]*$/, '...')
    : `Book handcrafted ${durationText} ${dest} tour package with Wanderphilia. Covering ${routeText || dest}. Transparent pricing, luxury stays, and private transfers.`;

  const defaultKeywords = [
    `${dest} tour package 2026`,
    `${dest} customized itinerary`,
    `${dest} holiday trip`,
    `${dest} group tour`,
    `best tour operator for ${dest}`,
    'Wanderphilia luxury travels',
    ...(routeText ? routeText.split(/[-•|,]/).map((s) => s.trim().replace(/\d+N\s*/i, '') + ' tour').filter(Boolean) : [])
  ].slice(0, 10);

  // Try Groq AI if API key is present
  const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return {
      title: defaultTitle,
      description: defaultDescription,
      keywords: defaultKeywords,
      ogTitle: defaultTitle,
      ogDescription: defaultDescription,
    };
  }

  try {
    const prompt = `You are a world-class travel SEO specialist for luxury & experiential travel company "Wanderphilia".
Generate high-converting, high-CTR Google SEO metadata for this tour package:

Tour Title: ${trip.title}
Destination: ${dest}
Duration: ${durationText}
Route / Cities: ${routeText}
Overview: ${trip.description || ''}

REQUIREMENTS:
1. "title": Catchy, click-worthy browser tab / Google search title (Strictly 50 to 60 characters). MUST end with " | Wanderphilia".
2. "description": Engaging meta description (Strictly 140 to 160 characters) summarizing key sights, duration, and Wanderphilia booking advantage.
3. "keywords": Array of 6-8 high search volume keywords (e.g. "Meghalaya tour packages 2026", "Cherrapunji trip").
4. "ogTitle": Catchy title for WhatsApp and social link previews.
5. "ogDescription": Compelling social share description.

Return ONLY valid JSON with this exact schema:
{
  "title": "string",
  "description": "string",
  "keywords": ["string"],
  "ogTitle": "string",
  "ogDescription": "string"
}`;

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: 'You are an expert travel SEO metadata generator. Respond ONLY with valid JSON.' },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' }
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        if (parsed.title && parsed.description) {
          return {
            title: parsed.title.includes('Wanderphilia') ? parsed.title : `${parsed.title} | Wanderphilia`,
            description: parsed.description,
            keywords: Array.isArray(parsed.keywords) ? parsed.keywords : defaultKeywords,
            ogTitle: parsed.ogTitle || parsed.title,
            ogDescription: parsed.ogDescription || parsed.description,
          };
        }
      }
    }
  } catch (err) {
    console.error('Groq SEO Generation Error:', err);
  }

  // Fallback
  return {
    title: defaultTitle,
    description: defaultDescription,
    keywords: defaultKeywords,
    ogTitle: defaultTitle,
    ogDescription: defaultDescription,
  };
}

