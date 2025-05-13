// src/components/editor/doc-editor.tsx
// title/content sync, link injection, save logic
"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useCallback, useState } from "react";
import { KeyboardToolbar } from "@/components/editor/keyboard-toolbar";
import { PageContainer } from "@/components/layouts/page-container";
import { RichTextEditor } from "./rich-text-editor";
import { useHeader } from "@/hooks/useHeader";
import { markdownToHtml } from "@/lib/utils";
import { collectLinks } from "@/lib/link-utils";
import { fetchLinksForDocument, upsertLink, deleteLink } from "@/lib/linking";
import { useParams } from "next/navigation";

/** Props for DocEditor */
export type DocEditorProps = {
  initialTitle?: string; // Markdown’s first heading
  initialContent?: string; // Markdown body
  onSave: (title: string, content: string) => Promise<void>;
  saving?: boolean;
};

/**
 * DocEditor
 *
 * Renders a TipTap-based editor with:
 *  • Markdown ↔ HTML conversion
 *  • “Save” integration via header context
 *  • Link-insertion hook (for Library Drawer)
 */
export function DocEditor({
  initialTitle = "Untitled Asana",
  initialContent = "",
  onSave,
}: DocEditorProps) {
  // ──────────────────────────────────────────────────────────────────────
  // State & Context
  // ──────────────────────────────────────────────────────────────────────
  const [documentContent, setDocumentContent] = useState<string>("");
  const { setTitle: setHeaderTitle, setOnSave, setOnInsertLink } = useHeader();
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);
  const params = useParams();
  const sourceId = params?.id as string | undefined;

  // ──────────────────────────────────────────────────────────────────────
  // 1. Initialize editor with HTML converted from Markdown
  // ──────────────────────────────────────────────────────────────────────
  useEffect(() => {
    async function initContent() {
      // Convert Markdown → HTML
      const bodyHtml = await markdownToHtml(initialContent);
      // Prepend an <h1> for the title
      const fullHtml = `<h1>${initialTitle}</h1>${bodyHtml}`;
      setDocumentContent(fullHtml);
      setHeaderTitle(initialTitle);
    }
    initContent();
  }, [initialContent, initialTitle, setHeaderTitle]);

  // ──────────────────────────────────────────────────────────────────────
  // 2. Extract title & body from the editor’s HTML
  // ──────────────────────────────────────────────────────────────────────
  const extractTitleAndBody = useCallback((html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    // Find first heading or paragraph
    const heading = doc.querySelector("h1, h2, h3, h4, h5, h6");
    let title = "Untitled Asana";

    if (heading) {
      title = heading.textContent?.trim() || title;
      heading.remove();
    } else {
      const p = doc.querySelector("p");
      if (p) {
        title = p.textContent?.trim() || title;
        p.remove();
      }
    }

    return {
      title,
      body: doc.body.innerHTML.trim(),
    };
  }, []);

  // ──────────────────────────────────────────────────────────────────────
  // 3. Save handler: Markdown conversion + onSave callback
  // ──────────────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    const { title, body: htmlBody } = extractTitleAndBody(documentContent);

    // Dynamically load Turndown (so it’s only run in-browser)
    const TurndownService = (await import("turndown")).default;
    const turndown = new TurndownService({ headingStyle: "atx" });

    // Preserve H2/H3 styling
    turndown.addRule("heading2", {
      filter: (node) => node.nodeName === "H2",
      replacement: (content) => `\n\n## ${content}\n\n`,
    });
    turndown.addRule("heading3", {
      filter: (node) => node.nodeName === "H3",
      replacement: (content) => `\n\n### ${content}\n\n`,
    });

    const markdown = turndown.turndown(htmlBody);
    await onSave(title, markdown);

    // 🔗 Extract and persist document links
    if (sourceId) {
      const newLinks = collectLinks(markdown);

      // Delete all old links for this doc
      const existing = await fetchLinksForDocument(sourceId);
      if (existing) {
        for (const link of existing) {
          await deleteLink(link.id);
        }
      }

      // Upsert new links
      for (const link of newLinks) {
        await upsertLink({
          source_id: sourceId,
          target_id: link.target_id,
          label: link.label,
          position: link.position,
        });
      }
    }
  }, [documentContent, extractTitleAndBody, onSave, sourceId]);

  // Register “Save” in header (runs only once per handleSubmit change)
  useEffect(() => {
    setOnSave(handleSubmit);
  }, [handleSubmit, setOnSave]);

  // ──────────────────────────────────────────────────────────────────────
  // 4. Link-Insertion Handler: register once when editor is ready
  // ──────────────────────────────────────────────────────────────────────
  const handleReady = useCallback(
    (editor: Editor) => {
      setEditorInstance(editor);
      // Tell the header context how to insert a link
      setOnInsertLink((doc) => {
        editor
          .chain()
          .focus()
          .insertContent(`<a href="/library/${doc.id}">${doc.title}</a>`)
          .run();
      });
    },
    [setOnInsertLink]
  );

  // ──────────────────────────────────────────────────────────────────────
  // Render
  // ──────────────────────────────────────────────────────────────────────
  return (
    <PageContainer className="py-6 px-4">
      <RichTextEditor
        initialContent={documentContent}
        editable
        onReady={handleReady} // register insert-link here
        onChange={(html, extractedTitle) => {
          // live update title
          setDocumentContent(html);
          setHeaderTitle(extractedTitle ?? "Untitled Asana");
        }}
      />

      {/* KeyboardToolbar remains available for text formatting */}
      <KeyboardToolbar editor={editorInstance} />
    </PageContainer>
  );
}
