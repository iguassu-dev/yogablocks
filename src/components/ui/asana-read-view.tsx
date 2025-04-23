"use client";

import * as React from "react";
import { parseAsanaContent } from "@/lib/parseAsanaContent";

type AsanaReadViewProps = {
  title: string;
  content: string;
};

export function AsanaReadView({ title, content }: AsanaReadViewProps) {
  const parsed = parseAsanaContent(content);

  // Render a heading + either a single string or bullet list
  function renderField(
    label: string,
    value?: string | string[]
  ): React.ReactNode {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return null;
    }

    return (
      <>
        <h2>{label}</h2>
        {typeof value === "string" ? (
          <p>{value}</p>
        ) : (
          <ul>
            {value.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )}
      </>
    );
  }

  return (
    <article className="prose prose-sm prose-primary max-w-none">
      {/* Title */}
      <h1>{title}</h1>

      {/* Structured fields */}
      {renderField("Sanskrit", parsed.sanskrit)}
      {renderField("Category", parsed.category)}
      {renderField("Benefits", parsed.benefits)}
      {renderField("Contraindications", parsed.contraindications)}
      {renderField("Modifications", parsed.modifications)}
      {renderField("Preparatory Poses", parsed.preparatory_poses)}

      {/* Fallback */}
      {parsed.remainingText && (
        <div
          className="prose prose-sm prose-primary"
          dangerouslySetInnerHTML={{ __html: parsed.remainingText }}
        />
      )}
    </article>
  );
}
