// src/components/ui/doc-card.tsx
"use client";

import { Triangle, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripMarkdown } from "@/lib/utils";

export type DocCardProps = {
  title: string;
  preview: string; // markdown snippet
  showPlusIcon?: boolean;
  onPlusClick?: () => void;
};

export function DocCard({
  title,
  preview,
  showPlusIcon = false,
  onPlusClick,
}: DocCardProps) {
  return (
    <div className="w-full bg-card text-card-foreground py-4 flex items-start gap-4">
      {/* Left Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
        <Triangle className="w-5 h-5 text-foreground" />
      </div>

      {/* Title and preview */}
      <div className="flex-1">
        <h3 className="text-base font-medium text-foreground">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground overflow-hidden line-clamp-2">
          {stripMarkdown(preview)}
        </p>
      </div>

      {/* Optional plus button */}
      {showPlusIcon && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onPlusClick}
          aria-label={`Insert link to ${title}`}
        >
          <CirclePlus className="w-6 h-6" />
        </Button>
      )}
    </div>
  );
}
