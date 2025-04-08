// Server Component – no "use client" needed
import { ReactNode } from "react";
import AppShell from "@/components/layouts/AppShell";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

/**
 * Shared layout for all authenticated routes.
 * It injects the global AppShell (sticky header, etc.)
 * around the page-specific content.
 */
export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
