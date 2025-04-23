"use client";

import { parseAsanaContent } from "@/lib/parseAsanaContent";
import {
  TypographyBody,
  TypographyBulletList,
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
      <TypographyBulletList>
        {items.map((item, i) => (
          <li key={i} className="text-primary">
            {item}
          </li>
        ))}
      </TypographyBulletList>
    );
  };

  // 🪛 Fallback: render HTML content if we couldn’t parse structure
  if (parsed.remainingText) {
    return (
      <div className="px-4 py-6 space-y-4 text-sm text-primary">
        {/* Always show the title */}
        <TypographyHeading1>{title}</TypographyHeading1>

        {/* Render the HTML string saved by the editor */}
        <div
          className="prose text-primary"
          dangerouslySetInnerHTML={{ __html: parsed.remainingText }}
        />
      </div>
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
          <TypographyBody>{parsed.sanskrit}</TypographyBody>
        </div>
      )}

      {/* ─────────── Category ─────────── */}
      {parsed.category && (
        <div>
          <TypographyHeading4>Category</TypographyHeading4>
          <TypographyBody>{parsed.category}</TypographyBody>
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
          <TypographyHeading4>Modifications</TypographyHeading4>
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
