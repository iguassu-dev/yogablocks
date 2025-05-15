// src/components/layouts/page-container.tsx
import { cn } from "@/lib/markdownHelpers";

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("w-full max-w-screen-sm px-4 mx-auto", className)}>
      {children}
    </div>
  );
}
