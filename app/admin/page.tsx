import { PasswordForm } from "@/components/admin/password-form";

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Admin Dashboard</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Access the feedback management system
          </p>
        </div>
        
        <PasswordForm />
      </div>
    </main>
  );
}