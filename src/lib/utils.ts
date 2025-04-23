import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getPreview(content: string) {
  return content.split("\n").slice(0, 3).join("\n");
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
/**
 * Convert Markdown string → HTML string.
 */
export async function markdownToHtml(md: string): Promise<string> {
  const file = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeStringify)
    .process(md);
  return String(file);
}
