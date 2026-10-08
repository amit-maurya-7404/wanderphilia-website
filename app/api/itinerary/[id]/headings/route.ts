import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';
import { generateDayHeadingsWithGroq } from '@/lib/ai-itinerary';
import { ItineraryDocument } from '@/types/itinerary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

/**
 * POST /api/itinerary/[id]/headings
 * Generates/updates ONLY the Day Headings (Titles) for the itinerary using Groq AI.
 * Leaves all other itinerary data (pricing, stays, dates, timeline, inclusions, exclusions) 100% untouched.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing itinerary ID' }, { status: 400 });
    }

    const db = await getDb();
    const collection = db.collection<ItineraryDocument>('itineraries');

    const itinerary = await collection.findOne({
      $or: [{ id: id }, { slug: id }]
    });

    if (!itinerary) {
      return NextResponse.json({ success: false, error: 'Itinerary not found' }, { status: 404 });
    }

    if (!itinerary.dayPlans || itinerary.dayPlans.length === 0) {
      return NextResponse.json({ success: false, error: 'Itinerary has no day plans' }, { status: 400 });
    }

    // Generate new day headings with Groq AI strictly based on day activities
    const aiHeadings = await generateDayHeadingsWithGroq(
      itinerary.destination || 'India',
      itinerary.dayPlans
    );

    if (Object.keys(aiHeadings).length === 0) {
      return NextResponse.json({
        success: false,
        error: 'Failed to generate headings with Groq AI. Check API key or connection.'
      }, { status: 500 });
    }

    // Update ONLY the day titles
    const updatedDayPlans = itinerary.dayPlans.map(dp => {
      const dayNum = dp.day;
      if (aiHeadings[dayNum]) {
        return {
          ...dp,
          title: aiHeadings[dayNum]
        };
      }
      return dp;
    });

    await collection.updateOne(
      { _id: itinerary._id },
      {
        $set: {
          dayPlans: updatedDayPlans,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Day headings successfully updated with Groq AI!',
      id: itinerary.id,
      dayHeadings: aiHeadings,
      dayPlans: updatedDayPlans.map(d => ({ day: d.day, title: d.title }))
    });
  } catch (error) {
    console.error('[Error updating day headings]:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}
