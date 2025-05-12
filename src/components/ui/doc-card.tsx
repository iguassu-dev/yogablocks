"use client";

import { Triangle, CirclePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { stripMarkdown } from "@/lib/utils";
import { TypographyHeading4 } from "./typography";

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
    <div className="w-full bg-card text-card-foreground p-4 flex items-start gap-4">
      {/* Left Icon */}
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-muted">
        <Triangle className="w-5 h-5 text-foreground" />
      </div>

      {/* Title, Preview, and optional Plus Button */}
      <div className="flex-1">
        {/* Document title */}
        <TypographyHeading4>{title}</TypographyHeading4>
        {/* Plain-text preview (markdown stripped) clamped to 2 lines */}
        <p className="mt-1 text-sm text-muted-foreground overflow-hidden line-clamp-2">
          {stripMarkdown(preview)}
        </p>
      </div>

      {/* Right Plus Icon (visible only if showPlusIcon = true) */}
      {showPlusIcon && (
        <Button
          size="icon"
          variant="ghost"
          onClick={onPlusClick}
          aria-label={`Insert link to ${title}`}
        >
          <CirclePlus className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
}
