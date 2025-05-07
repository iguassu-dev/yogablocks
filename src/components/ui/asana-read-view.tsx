// src/components/ui/asana-read-view.tsx

"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // — Link Parsing & Rendering for sourceId —
import Link from "next/link"; // — Link Parsing & Rendering —
import { parseAsanaContent } from "@/lib/parseAsanaContent"; // parses structured fields
import { markdownToHtml } from "@/lib/utils"; // fallback markdown renderer
import type { DocumentLink } from "@/lib/linking"; // our link row type :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
import { fetchLinksForDocument } from "@/lib/linking"; // fetches relational links :contentReference[oaicite:2]{index=2}:contentReference[oaicite:3]{index=3}
import type { LibraryDoc } from "@/hooks/useLibrary"; // our array of { id, title }

/**
 * Component: Displays an asana’s structured metadata and fallback markdown,
 * and renders Preparatory Poses as clickable links when possible.
 */
type AsanaReadViewProps = {
  title: string;
  content: string;
  docs: LibraryDoc[]; // list of all asanas for lookup
};

export function AsanaReadView({ title, content, docs }: AsanaReadViewProps) {
  // — Link Parsing & Rendering: get current document ID from the URL
  const params = useParams();
  const sourceId = params.id as string | undefined;

  // — Parse out structured fields from content
  const parsed = parseAsanaContent(content);
  // — Fallback HTML for any remaining markdown
  const [fallbackHtml, setFallbackHtml] = useState("");
  // — Link Parsing & Rendering: store fetched links
  const [links, setLinks] = useState<DocumentLink[]>([]);

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

  // ─────────────────────────────────────────────
  // — Link Parsing & Rendering —
  // Fetch relational links for this asana and sort by position
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (!sourceId) return;
    async function loadLinks() {
      try {
        const data = await fetchLinksForDocument(sourceId as string);
        setLinks(data ?? []);
      } catch (err) {
        console.error("Failed to load links for asana", err);
      }
    }
    loadLinks();
  }, [sourceId]);

  /**
   * — Renders a heading + paragraph or list for structured fields
   */
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

      {/* Structured fields except prep poses*/}
      {renderField("Sanskrit", parsed.sanskrit)}
      {renderField("Category", parsed.category)}
      {renderField("Benefits", parsed.benefits)}
      {renderField("Contraindications", parsed.contraindications)}
      {renderField("Modifications", parsed.modifications)}

      {/* ── New: Preparatory Poses as links ── */}
      {parsed.preparatory_poses && parsed.preparatory_poses.length > 0 && (
        <>
          <h2>Preparatory Poses</h2>
          <ul className="!pl-0 list-none !ml-0 p-0 m-0">
            {parsed.preparatory_poses.map((pose, i) => {
              const match = docs.find((d) => d.title === pose);
              return (
                <li key={i} className="mb-1 pl-0">
                  {match ? (
                    <Link
                      href={`/library/${match.id}`}
                      className="inline underline text-purple-700 font-normal"
                    >
                      {pose}
                    </Link>
                  ) : (
                    <span className="font-normal">{pose}</span>
                  )}
                </li>
              );
            })}
          </ul>
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
