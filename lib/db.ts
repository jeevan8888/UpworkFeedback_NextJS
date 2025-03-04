import { sql } from '@vercel/postgres';
import { z } from 'zod';

// Schema for feedback validation
const feedbackSchema = z.object({
  email: z.string().email(),
  freelancerName: z.string(),
  profileUrl: z.string().url(),
  communicationRating: z.number().min(1).max(5),
  qualityRating: z.number().min(1).max(5),
  valueRating: z.number().min(1).max(5),
  timelinessRating: z.number().min(1).max(5),
  expertiseRating: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5),
  comments: z.string().optional(),
});

export type Feedback = z.infer<typeof feedbackSchema>;

// Create feedback table
export async function createFeedbackTable() {
  try {
    console.log('Creating feedback table...');
    await sql`
      CREATE TABLE IF NOT EXISTS feedback (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        freelancer_name VARCHAR(255) NOT NULL,
        profile_url TEXT NOT NULL,
        communication_rating INTEGER NOT NULL,
        quality_rating INTEGER NOT NULL,
        value_rating INTEGER NOT NULL,
        timeliness_rating INTEGER NOT NULL,
        expertise_rating INTEGER NOT NULL,
        overall_rating INTEGER NOT NULL,
        comments TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('Feedback table created successfully');
  } catch (error) {
    console.error('Error creating feedback table:', error);
    throw error;
  }
}

// Save feedback to database
export async function saveFeedback(feedback: Feedback) {
  try {
    const result = await sql`
      INSERT INTO feedback (
        email, 
        freelancer_name, 
        profile_url,
        communication_rating,
        quality_rating,
        value_rating,
        timeliness_rating,
        expertise_rating,
        overall_rating,
        comments
      ) VALUES (
        ${feedback.email},
        ${feedback.freelancerName},
        ${feedback.profileUrl},
        ${feedback.communicationRating},
        ${feedback.qualityRating},
        ${feedback.valueRating},
        ${feedback.timelinessRating},
        ${feedback.expertiseRating},
        ${feedback.overallRating},
        ${feedback.comments || null}
      )
      RETURNING id;
    `;
    return result.rows[0].id;
  } catch (error) {
    console.error('Error saving feedback:', error);
    throw error;
  }
}

// Get feedback summary for admin dashboard
export async function getAllFeedback() {
  try {
    const result = await sql`
      SELECT 
        freelancer_name,
        profile_url,
        ROUND(AVG(
          (communication_rating + quality_rating + value_rating + 
           timeliness_rating + expertise_rating + overall_rating) / 6.0
        ), 2) as avg_rating,
        MAX(GREATEST(
          communication_rating, quality_rating, value_rating,
          timeliness_rating, expertise_rating, overall_rating
        )) as highest_rating,
        MIN(LEAST(
          communication_rating, quality_rating, value_rating,
          timeliness_rating, expertise_rating, overall_rating
        )) as lowest_rating,
        COUNT(*) as feedback_count
      FROM feedback
      GROUP BY freelancer_name, profile_url
      ORDER BY avg_rating DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting feedback summary:', error);
    throw error;
  }
}

// Get detailed feedback for admin dashboard
export async function getFeedbackDetails() {
  try {
    const result = await sql`
      SELECT *
      FROM feedback
      ORDER BY created_at DESC;
    `;
    return result.rows;
  } catch (error) {
    console.error('Error getting feedback details:', error);
    throw error;
  }
}