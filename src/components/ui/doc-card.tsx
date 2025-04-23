"use client";

import { Triangle, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

type DocCardProps = {
  title: string;
  preview: string;
  showPlusIcon?: boolean;
};

export function DocCard({
  title,
  preview,
  showPlusIcon = false,
}: DocCardProps) {
  return (
    <div className="w-full bg-card text-card-foreground p-4 flex items-start gap-4">
      {/* Left Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
        <Triangle className="w-5 h-5 text-foreground" />
      </div>

      {/* Title, Preview, and optional Plus Button */}
      <div className="flex-1 prose prose-sm prose-primary">
        {/* Title as H4 in the same typographic scale */}
        <h4 className="m-0">{title}</h4>

        {/* Preview reuses prose paragraph styles */}
        <p className="mt-1 line-clamp-2">{preview}</p>
      </div>

      {/* Right Plus Icon (visible only if showPlusIcon = true) */}
      {showPlusIcon && (
        <Button size="icon" variant="ghost">
          <CirclePlus className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
