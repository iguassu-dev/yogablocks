// src/lib/markdownHelpers.ts
/**
 * Utility functions for handling Markdown and HTML transformations in YogaBlocks.
 * - Convert Markdown to HTML and back
 * - Remove formatting and strip down to plain text for previews
 * - Validate UUIDs for link extraction
 *
 * Keeps all Markdown/HTML conversion and cleanup logic reusable and testable.
 */

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Remove common Markdown syntax so we display plain text.
 */
export function stripMarkdown(input: string): string {
  return (
    input
      // Remove any leftover pure-underline lines (e.g. "-----" or "=====")
      .replace(/^[-=]{2,}$/gm, "")
      // Remove image syntax: ![alt](url)
      .replace(/\!\[.*?\]\(.*?\)/g, "")
      // Convert links [text](url) → text
      .replace(/\[(.*?)\]\(.*?\)/g, "$1")
      // Strip code fences and inline code
      .replace(/`{1,3}(.*?)`{1,3}/g, "$1")
      // Remove list bullets, headings, blockquotes
      .replace(/(^|\s)[>*+#\-]\s?/gm, "$1")
      // Remove emphasis markers (*, _, ~)
      .replace(/[*_~]/g, "")
      .trim()
  );
}

/**
 * Strip all markdown and HTML; Truncate visible characters to simulate 2 lines
 */
export function getPreview(content: string): string {
  const stripped = stripMarkdown(content)
    .replace(/(<([^>]+)>)/gi, "") // Remove any HTML tags
    .replace(/\s+/g, " ") // Collapse whitespace
    .trim();
  return stripped.split(" ").slice(0, 25).join(" "); // ~2 lines worth of words
}

/**
 * Convert Markdown string → HTML string.
 */
export async function markdownToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}

export function isValidUUID(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}
