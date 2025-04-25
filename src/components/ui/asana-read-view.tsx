"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { parseAsanaContent } from "@/lib/parseAsanaContent";
import { markdownToHtml } from "@/lib/utils";

type AsanaReadViewProps = {
  title: string;
  content: string;
};

export function AsanaReadView({ title, content }: AsanaReadViewProps) {
  const parsed = parseAsanaContent(content);
  const [fallbackHtml, setFallbackHtml] = useState("");

  useEffect(() => {
    async function convert() {
      // Always attempt to convert remaining text if it exists
      if (parsed.remainingText) {
        const html = await markdownToHtml(parsed.remainingText);
        console.log("[🧾 Final fallback HTML]", html);
        setFallbackHtml(html);
      }
    }
    convert();
  }, [parsed.remainingText]);

  function renderField(
    label: string,
    value?: string | string[]
  ): React.ReactNode {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
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
      <h1>{title}</h1>

      {/* Always show structured fields if available */}
      {renderField("Sanskrit", parsed.sanskrit)}
      {renderField("Category", parsed.category)}
      {renderField("Benefits", parsed.benefits)}
      {renderField("Contraindications", parsed.contraindications)}
      {renderField("Modifications", parsed.modifications)}
      {renderField("Preparatory Poses", parsed.preparatory_poses)}

      {/* Always show remaining text if available */}
      {parsed.remainingText && (
        <div
          className="prose prose-sm prose-primary mt-4"
          dangerouslySetInnerHTML={{ __html: fallbackHtml }}
        />
      )}
    </article>
  );
}
