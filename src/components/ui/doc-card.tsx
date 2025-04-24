"use client";

import { Triangle, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripMarkdown } from "@/lib/utils";

type DocCardProps = {
  title: string;
  preview: string; // markdown snippet
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
      <div className="flex-1">
        {/* — Document title */}
        <h4 className="m-0 text-lg font-semibold text-primary">{title}</h4>
        {/* Plain-text preview (markdown stripped) clamped to 2 lines */}
        <p className="mt-1 text-sm text-muted-foreground overflow-hidden line-clamp-2">
          {stripMarkdown(preview)}
        </p>
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
