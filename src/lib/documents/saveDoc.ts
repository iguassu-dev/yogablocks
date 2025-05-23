// src/lib/documents/saveDoc.ts

import { updateDoc } from "./updateDoc";
import { extractMarkdownLinks } from "@/lib/markdownLinkParser";
import {
  fetchLinkForDoc,
  upsertLink,
  deleteLink,
} from "@/lib/documentLinkStore";

/**
 * saveDoc
 *
 * Handles all steps needed to save a document after the user edits it.
 * This keeps UI and editor code clean, and centralizes the save logic.
 *
 * @param docId        - The ID of the document to update.
 * @param editorHtml   - The full HTML content from the editor.
 * @returns            - true if successful, false otherwise.
 */
export async function saveDoc({
  docId,
  editorHtml,
}: {
  docId: string;
  editorHtml: string;
}): Promise<boolean> {
  // Step 1: Extract the title and content/body from the HTML.
  // We'll use DOMParser to grab the first heading as the title.
  let title = "Untitled";
  let htmlBody = editorHtml;

  try {
    const doc = new DOMParser().parseFromString(editorHtml, "text/html");
    const heading = doc.querySelector("h1, h2, h3, h4, h5, h6");
    if (heading) {
      title = heading.textContent?.trim() || title;
      heading.remove();
    }
    htmlBody = doc.body.innerHTML.trim();
  } catch (err) {
    console.error("[saveDoc] Error saving document:", err);
    return false;
  }

  // Step 2: Convert HTML body to Markdown for storage.
  let markdown = "";
  try {
    const TurndownService = (await import("turndown")).default;
    const turndown = new TurndownService({ headingStyle: "atx" });

    // Optional: preserve H2/H3 styling if you want to keep subheadings clean
    turndown.addRule("heading2", {
      filter: (node) => node.nodeName === "H2",
      replacement: (content) => `\n\n## ${content}\n\n`,
    });
    turndown.addRule("heading3", {
      filter: (node) => node.nodeName === "H3",
      replacement: (content) => `\n\n### ${content}\n\n`,
    });

    markdown = turndown.turndown(htmlBody);
  } catch (err) {
    console.error("[saveDoc] Markdown conversion failed:", err);
    return false;
  }

  // Step 3: Update the document in the database.
  const updateSuccess = await updateDoc(docId, { title, content: markdown });
  if (!updateSuccess) {
    console.error("[saveDoc] Failed to update document in DB.");
    return false;
  }

  // Step 4: Sync links between documents (if any links present in markdown).
  try {
    // 4.1 Extract all links from the markdown content.
    const newLinks = extractMarkdownLinks(markdown);
    // 4.2 Get existing links from the database.
    const existingLinks = (await fetchLinkForDoc(docId)) ?? [];

    // 4.3 Delete links that were removed in this edit.
    for (const old of existingLinks) {
      if (!newLinks.some((l) => l.target_id === old.target_id)) {
        await deleteLink(old.id);
      }
    }

    // 4.4 Add or update any new or changed links.
    for (const link of newLinks) {
      const existingRow = existingLinks.find(
        (e) => e.target_id === link.target_id
      );
      await upsertLink({
        id: existingRow?.id, // Update if exists, else create new
        source_id: docId,
        target_id: link.target_id,
        label: link.label,
        position: link.position,
      });
    }
  } catch (err) {
    // If link syncing fails, we still save the doc, but log the error for later.
    console.error("[saveDoc] Link syncing failed:", err);
  }

  // Step 5: If we got here, saving was successful!
  return true;
}
