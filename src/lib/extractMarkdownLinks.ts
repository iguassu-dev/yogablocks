// src/lib/extractMarkdownLinks.ts
/**
 * Extracts all links of the form [Label](/library/target_id)
 * from a markdown string.
 *
 * Returns an array of:
 *  - target_id: the document ID being linked
 *  - label: the visible link text
 *  - position: order in which the link appears
 */
export function collectLinks(content: string): {
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
