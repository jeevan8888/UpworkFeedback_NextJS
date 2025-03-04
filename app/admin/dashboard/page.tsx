"use client"

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { FeedbackTable } from "@/components/admin/feedback-table";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "lucide-react";

// Create a separate component for the protected content
function DashboardContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const password = searchParams.get("password");

  useEffect(() => {
    if (!password || password !== "upwork") {
      router.push("/admin");
    }
  }, [password, router]);

  if (!password || password !== "upwork") {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push("/admin")}
            className="flex items-center"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Feedback Analytics</h1>
          <div className="w-24"></div> {/* Spacer for alignment */}
        </div>
        
        <FeedbackTable />
      </div>
    </main>
  );
}

// Main component with Suspense boundary
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}