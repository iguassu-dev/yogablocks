// src/lib/editorLinkUtils.ts

import type { Editor } from "@tiptap/react";

/**
 * Inserts a link to a library document into the editor.
 *
 * @param editor - The TipTap editor instance where the link should be inserted.
 * @param doc - The document to link. Must have `id` and `title`.
 *
 * This function moves the editor cursor to the right spot and inserts a clickable link
 * like <a href="/library/123">Document Title</a> at the current position.
 */
export function insertLibraryLink(
  editor: Editor,
  doc: { id: string; title: string }
) {
  if (!editor || !doc?.id || !doc?.title) return;
  editor
    .chain()
    .focus()
    .insertContent(`<a href="/library/${doc.id}">${doc.title}</a>`)
    .run();
}
