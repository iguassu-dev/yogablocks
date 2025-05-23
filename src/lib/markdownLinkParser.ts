// src/lib/	markdownLinkParser.ts
/**
 * Extracts all links of the form [Label](/library/target_id) from a markdown string.
 * - Returns an array of link objects: { target_id, label, position }
 * - Used to sync editor content with document_links DB table
 * - Keeps link detection logic simple and consistent across the app
 */

export function extractMarkdownLinks(content: string): {
  target_id: string;
  label: string;
  position: number;
}[] {
  const linkRegex = /\[([^\]]+)\]\(\/library\/([^)]+)\)/g;

  const links: {
    target_id: string;
    label: string;
    position: number;
  }[] = [];

  let match;
  let index = 0;

  while ((match = linkRegex.exec(content)) !== null) {
    const [, label, target_id] = match;
    links.push({
      label,
      target_id,
      position: index++,
    });
  }

  return links;
}
