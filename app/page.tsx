import { FeedbackForm } from "@/components/feedback-form";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Freelancer Feedback</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your experience working with a freelancer. Your feedback helps others make informed decisions and helps freelancers improve their services.
          </p>
        </div>
        
        <FeedbackForm />
      </div>
    </main>
  );
}