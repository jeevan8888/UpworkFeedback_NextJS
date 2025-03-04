import { NextRequest, NextResponse } from 'next/server';
import { getAllFeedback, getFeedbackDetails } from '@/lib/db';

// Add this export to mark the route as dynamic
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const password = searchParams.get('password');
    
    if (password !== 'upwork') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const detailed = searchParams.get('detailed') === 'true';
    
    if (detailed) {
      const feedbackDetails = await getFeedbackDetails();
      return NextResponse.json({ success: true, data: feedbackDetails });
    } else {
      const feedbackSummary = await getAllFeedback();
      return NextResponse.json({ success: true, data: feedbackSummary });
    }
  } catch (error) {
    console.error('Error fetching feedback data:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch feedback data' },
      { status: 500 }
    );
  }
}