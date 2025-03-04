import { NextResponse } from 'next/server';
import { createFeedbackTable, saveFeedback } from '@/lib/db';

const sampleData = [
  {
    email: "client1@example.com",
    freelancerName: "John Smith",
    profileUrl: "https://www.upwork.com/freelancers/johnsmith",
    communicationRating: 5,
    qualityRating: 4,
    valueRating: 5,
    timelinessRating: 4,
    expertiseRating: 5,
    overallRating: 5,
    comments: "John was excellent to work with. Very responsive and delivered high-quality work."
  },
  {
    email: "client2@example.com",
    freelancerName: "John Smith",
    profileUrl: "https://www.upwork.com/freelancers/johnsmith",
    communicationRating: 4,
    qualityRating: 5,
    valueRating: 4,
    timelinessRating: 3,
    expertiseRating: 5,
    overallRating: 4,
    comments: "Great expertise, but sometimes took a bit longer to respond."
  },
  {
    email: "client3@example.com",
    freelancerName: "Sarah Johnson",
    profileUrl: "https://www.upwork.com/freelancers/sarahjohnson",
    communicationRating: 5,
    qualityRating: 5,
    valueRating: 4,
    timelinessRating: 5,
    expertiseRating: 4,
    overallRating: 5,
    comments: "Sarah was amazing! She delivered the project ahead of schedule."
  }
];

export async function GET() {
  try {
    // Create table if it doesn't exist
    await createFeedbackTable();
    
    // Insert sample data
    for (const data of sampleData) {
      await saveFeedback(data);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: "Sample data seeded successfully" 
    });
  } catch (error) {
    console.error('Error seeding data:', error);
    return NextResponse.json(
      { success: false, message: "Failed to seed data" },
      { status: 500 }
    );
  }
}