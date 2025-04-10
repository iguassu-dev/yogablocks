//This is where your sticky Header, main, and general app layout structure lives.
// It should be used inside authenticated layouts, NOT directly under /app/layout.tsx, because /login and /signup pages don’t need the sticky header.

import Header from "@/components/ui/header";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* --- sticky header (to be fully built in Task 3) --- */}
      <Header />

      {/* --- page‑specific content --- */}
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
