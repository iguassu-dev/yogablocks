"use client";

import {
  TypographyHeading4,
  TypographyCaption,
} from "@/components/ui/typography";
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
    <div className="w-full py-3 flex items-start gap-4">
      {/* Left Icon */}
      <div className="w-10 h-10 flex items-center justify-center">
        <Triangle className="w-5 h-5 text-foreground" />
      </div>

      {/* Title, Preview, and optional Plus Button */}
      <div className="flex-1 flex flex-col items-start gap-0.5">
        <TypographyHeading4 className="w-full">{title}</TypographyHeading4>
        <TypographyCaption className="w-full line-clamp-2 text-muted-foreground">
          {preview}
        </TypographyCaption>
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
