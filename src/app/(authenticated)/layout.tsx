// Authenticated user layout — wraps only authenticated routes.Useful to inject AppShell or protected UI only for logged-in users. Server Component – no "use client" needed
import { ReactNode } from "react";
import AppShell from "@/components/layouts/AppShell";

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  return <AppShell>{children}</AppShell>;
}
