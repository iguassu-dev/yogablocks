// src/components/ui/asana-read-view.tsx

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { parseAsanaContent } from "@/lib/parseAsanaContent"; // parses structured fields
import { markdownToHtml } from "@/lib/utils"; // fallback markdown renderer
import { TypographyHeading3, TypographyLink } from "@/components/ui/typography";
import { useLibraryMap } from "@/hooks/useLibraryMap"; // fetches all asanas

/**
 * Displays an asana’s structured metadata and fallback markdown,
 * and renders Preparatory Poses as clickable links when possible.
 */
export function AsanaReadView({
  title,
  content,
}: {
  title: string;
  content: string;
}) {
  // ─────────────────────────────────────────────
  // 1. Parse out structured fields from content
  // ─────────────────────────────────────────────
  const parsed = parseAsanaContent(content);

  // ─────────────────────────────────────────────
  // 2. Convert leftover markdown (remainingText) to HTML
  // ─────────────────────────────────────────────
  const [fallbackHtml, setFallbackHtml] = useState("");
  useEffect(() => {
    async function convert() {
      if (parsed.remainingText) {
        const html = await markdownToHtml(parsed.remainingText);
        setFallbackHtml(html);
      }
    }
    convert();
  }, [parsed.remainingText]);

  // ─────────────────────────────────────────────
  // 3. Build title → id lookup for link matching
  // ─────────────────────────────────────────────
  const linkMap = useLibraryMap();

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

      {/* Structured fields except prep poses */}
      {renderField("Sanskrit", parsed.sanskrit)}
      {renderField("Category", parsed.category)}
      {renderField("Benefits", parsed.benefits)}
      {renderField("Contraindications", parsed.contraindications)}
      {renderField("Modifications", parsed.modifications)}

      {/* Preparatory Poses as links */}
      {Array.isArray(parsed.preparatory_poses) &&
        parsed.preparatory_poses.length > 0 && (
          <>
            <section className="mt-6">
              <TypographyHeading3>Preparatory Poses</TypographyHeading3>
              <div className="prose prose-sm prose-primary mt-2">
                <ul className="!pl-0 list-none !ml-0 p-0 m-0">
                  {parsed.preparatory_poses.map((pose, i) => {
                    const normalizedPose = pose.trim().toLowerCase();
                    const id = linkMap[normalizedPose];
                    console.log("🧭 linkMap", linkMap);
                    console.log("🧭 pose being rendered", pose);
                    return (
                      <li key={i} className="mb-1">
                        {id ? (
                          <TypographyLink href={`/library/${id}`}>
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
