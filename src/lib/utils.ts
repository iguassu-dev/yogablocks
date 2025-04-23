import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getPreview(content: string) {
  const lines = content.split("\n").filter(Boolean);
  if (lines.length === 0) return "";
  if (lines.length === 1) return lines[0];
  return `${lines[0]}\n${lines[1]}`;
}
/**
 * Remove common Markdown syntax so we display plain text.
 */
export function stripMarkdown(input: string): string {
  return (
    input
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
