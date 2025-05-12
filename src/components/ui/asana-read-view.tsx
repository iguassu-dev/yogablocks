// src/components/ui/asana-read-view.tsx

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import Link from "next/link"; // — Link Parsing & Rendering —
import { parseAsanaContent } from "@/lib/parseAsanaContent"; // parses structured fields
import { markdownToHtml } from "@/lib/utils"; // fallback markdown renderer
import { TypographyHeading3, TypographyLink } from "@/components/ui/typography";
import type { LibraryDoc } from "@/hooks/useLibrary"; // our array of { id, title }

/**
 * Component: Displays an asana’s structured metadata and fallback markdown,
 * and renders Preparatory Poses as clickable links when possible.
 */
export function AsanaReadView({
  title,
  content,
  docs,
}: {
  title: string;
  content: string;
  docs: LibraryDoc[];
}) {
  // — Parse out structured fields from content
  const parsed = parseAsanaContent(content);
  // — Fallback HTML for any remaining markdown
  const [fallbackHtml, setFallbackHtml] = useState("");

  // ─────────────────────────────────────────────
  // Fallback markdown → HTML converter
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function convert() {
      if (parsed.remainingText) {
        const html = await markdownToHtml(parsed.remainingText);
        setFallbackHtml(html);
      }
    }
    convert();
  }, [parsed.remainingText]);

  /**
   * — Renders a heading + paragraph or list for structured fields
   */
  function renderField(
    label: string,
    value?: string | string[]
  ): React.ReactNode {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;

    return (
      <section className="mt-6">
        <TypographyHeading3>{label}</TypographyHeading3>
        <div className="prose prose-sm prose-primary mt-2">
          {typeof value === "string" ? (
            <p>{value}</p>
          ) : (
            <ul>
              {value.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </section>
    );
  }

  return (
    <article className="prose prose-sm prose-primary max-w-none">
      <h1>{title}</h1>

      {/* Structured fields except prep poses*/}
      {renderField("Sanskrit", parsed.sanskrit)}
      {renderField("Category", parsed.category)}
      {renderField("Benefits", parsed.benefits)}
      {renderField("Contraindications", parsed.contraindications)}
      {renderField("Modifications", parsed.modifications)}

      {/* ── New: Preparatory Poses as links ── */}
      {parsed.preparatory_poses && parsed.preparatory_poses.length > 0 && (
        <>
          <section className="mt-6">
            <TypographyHeading3>Preparatory Poses</TypographyHeading3>
            <div className="prose prose-sm prose-primary mt-2">
              <ul className="!pl-0 list-none !ml-0 p-0 m-0">
                {parsed.preparatory_poses.map((pose, i) => {
                  const match = docs.find((d) => d.title === pose);
                  return (
                    <li key={i} className="mb-1 pl-0">
                      {match ? (
                        <TypographyLink href={`/library/${match.id}`}>
                          {pose}
                        </TypographyLink>
                      ) : (
                        <span className="font-normal">{pose}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        </>
      )}

      {/* Fallback raw markdown if anything leftover */}
      {parsed.remainingText && (
        <div
          className="prose prose-sm prose-primary mt-4"
          dangerouslySetInnerHTML={{ __html: fallbackHtml }}
        />
      )}
    </article>
  );
}
