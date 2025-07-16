// src/components/layouts/page-container.tsx
// Goal: Expand container for desktop-first layout (max-w-4xl ~1024px)

import { cn } from "@/lib/markdownHelpers";

export function PageContainer({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        // ✅ Full width by default, but constrained to 1024px for readability
        "w-full max-w-4xl px-4 mx-auto ",
        className
      )}
    >
      {children}
    </div>
  );
}
