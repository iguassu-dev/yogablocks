"use client";

import { parseAsanaContent } from "@/lib/parseAsanaContent";
import {
  TypographyHeading3,
  TypographyBody,
  TypographyHeading1,
  TypographyHeading4,
} from "@/components/ui/typography";

type AsanaReadViewProps = {
  title: string;
  content: string;
};

export function AsanaReadView({ title, content }: AsanaReadViewProps) {
  const parsed = parseAsanaContent(content);

  // 🧾 Optional rendering helper
  const renderList = (items?: string[]) => {
    if (!items || items.length === 0) return null;
    return (
      <ul className="list-disc pl-5 space-y-1 text-sm">
        {items.map((item, i) => (
          <li key={i} className="text-muted-foreground">
            {item}
          </li>
        ))}
      </ul>
    );
  };

  // 🪛 Fallback: render raw markdown if structure missing
  if (parsed.remainingText) {
    return (
      <TypographyBody className="whitespace-pre-wrap text-sm px-4 py-6">
        {parsed.remainingText}
      </TypographyBody>
    );
  }

  return (
    <div className="px-4 py-6 space-y-6 text-sm text-primary">
      {/* ─────────── Title ─────────── */}
      <div>
        <TypographyHeading1>{title}</TypographyHeading1>
      </div>

      {/* ─────────── Sanskrit ─────────── */}
      {parsed.sanskrit && (
        <div>
          <TypographyHeading4>Sanskrit</TypographyHeading4>
          <p>{parsed.sanskrit}</p>
        </div>
      )}

      {/* ─────────── Category ─────────── */}
      {parsed.category && (
        <div>
          <TypographyHeading4>Category</TypographyHeading4>
          <p>{parsed.category}</p>
        </div>
      )}

      {/* ─────────── Benefits ─────────── */}
      {parsed.benefits && (
        <div>
          <TypographyHeading4>Benefits</TypographyHeading4>
          {renderList(parsed.benefits)}
        </div>
      )}

      {/* ─────────── Contraindications ─────────── */}
      {parsed.contraindications && (
        <div>
          <TypographyHeading4>Contraindications</TypographyHeading4>
          {renderList(parsed.contraindications)}
        </div>
      )}

      {/* ─────────── Modifications ─────────── */}
      {parsed.modifications && (
        <div>
          <TypographyHeading3>Modifications</TypographyHeading3>
          {renderList(parsed.modifications)}
        </div>
      )}

      {/* ─────────── Preparatory Poses ─────────── */}
      {parsed.preparatory_poses && (
        <div>
          <TypographyHeading4>Preparatory Poses</TypographyHeading4>
          {renderList(parsed.preparatory_poses)}
        </div>
      )}
    </div>
  );
}
