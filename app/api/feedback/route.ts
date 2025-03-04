import { NextRequest, NextResponse } from 'next/server';
import { createFeedbackTable, saveFeedback } from '@/lib/db';
import { z } from 'zod';

const feedbackSchema = z.object({
  email: z.string().email(),
  freelancerName: z.string().min(1),
  profileUrl: z.string().url(),
  communicationRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  valueRating: z.number().min(1).max(5),
  timelinessRating: z.number().min(1).max(5),
  expertiseRating: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5),
  comments: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Ensure table exists
    await createFeedbackTable();
    
    // Parse and validate request body
    const body = await request.json();
    const validatedData = feedbackSchema.parse(body);
    
    // Save feedback
    const id = await saveFeedback(validatedData);
    
    return NextResponse.json({ 
      success: true, 
      message: "Feedback submitted successfully",
      id 
    });
  } catch (error) {
    console.error('Error processing feedback:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: "Invalid feedback data", errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, message: "Failed to save feedback" },
      { status: 500 }
    );
  }
}