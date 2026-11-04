import { NextRequest, NextResponse } from 'next/server';
import { generateDayHeadingsWithGroq } from '@/lib/ai-itinerary';
import { ItineraryDayPlan } from '@/types/itinerary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/ai/day-headings
 * Generates catchy, luxury day headlines for the provided day plans using Groq AI.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { destination, dayPlans } = body;

    if (!Array.isArray(dayPlans) || dayPlans.length === 0) {
      return NextResponse.json(
        { success: false, error: 'dayPlans array is required.' },
        { status: 400 }
      );
    }

    // Adapt incoming dayPlans to ItineraryDayPlan format for Groq AI
    const adaptedPlans: ItineraryDayPlan[] = dayPlans.map((dp: any, idx: number) => ({
      day: dp.day || idx + 1,
      title: dp.title || `Day ${dp.day || idx + 1}`,
      description: Array.isArray(dp.timeline) ? dp.timeline.join('. ') : (dp.description || ''),
      stayLocation: dp.stayHotel || '',
      meals: dp.meals ? (typeof dp.meals === 'string' ? dp.meals : 'Breakfast & Dinner') : 'Breakfast & Dinner',
      activities: Array.isArray(dp.timeline) ? dp.timeline : [],
      timeline: Array.isArray(dp.timeline) ? dp.timeline : []
    }));

    const headings = await generateDayHeadingsWithGroq(
      destination || 'India',
      adaptedPlans
    );

    return NextResponse.json({
      success: true,
      headings: headings || {}
    });
  } catch (error: any) {
    console.error('[AI Day Headings Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to generate AI day headings.' },
      { status: 500 }
    );
  }
}

