// src/components/editor/doc-editor.tsx

"use client";

import { useCallback, useEffect, useState } from "react";
import { PageContainer } from "@/components/layouts/page-container";
import { RichTextEditor } from "./rich-text-editor";
import { useHeader } from "@/hooks/useHeader";
import { markdownToHtml } from "@/lib/utils"; // Markdown → HTML

// ─────────────────────────────────────────────
// Component props
// ─────────────────────────────────────────────
type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string; // stored as Markdown
  onSave: (title: string, content: string) => Promise<void>;
  saving?: boolean;
};

export function DocEditor({
  initialTitle = "Untitled Asana",
  initialContent = "",
  onSave,
}: DocEditorProps) {
  // — State: HTML content for TipTap
  const [documentContent, setDocumentContent] = useState<string>("");

  // — Header context
  const { setTitle: setHeaderTitle, setOnSave } = useHeader();

  // ─────────────────────────────────────────────
  // Load Markdown → HTML for the editor on mount
  // ─────────────────────────────────────────────
  useEffect(() => {
    async function initContent() {
      const bodyHtml = await markdownToHtml(initialContent);
      const fullHtml = `<h1>${initialTitle}</h1>${bodyHtml}`;
      setDocumentContent(fullHtml);
      setHeaderTitle(initialTitle);
    }
    initContent();
  }, [initialContent, initialTitle, setHeaderTitle]);

  // ─────────────────────────────────────────────
  // Extract <h1> title and body HTML
  // ─────────────────────────────────────────────
  function extractTitleAndBody(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const h1 = doc.querySelector("h1");
    const title = (h1?.textContent || "").trim() || "Untitled Asana";
    if (h1) h1.remove();
    return { title, body: doc.body.innerHTML.trim() };
  }

  // ─────────────────────────────────────────────
  // Save handler: convert HTML → Markdown, then onSave
  // ─────────────────────────────────────────────
  const handleSubmit = useCallback(async () => {
    // 1) Pull title & raw HTML body out of the editor content
    const { title, body: htmlBody } = extractTitleAndBody(documentContent);

    // 2) Instantiate TurndownService here (moved inside callback)
    //    — ensures dependencies won't change every render
    const TurndownService = (await import("turndown")).default;
    const turndownService = new TurndownService();

    // 3) Convert the HTML body back into Markdown
    const markdown = turndownService.turndown(htmlBody);

    // 4) Pass Markdown (not HTML) to onSave
    await onSave(title, markdown);

    // Dependencies: documentContent & onSave only
  }, [documentContent, onSave]);

  // ─────────────────────────────────────────────
  // Register save handler once
  // ─────────────────────────────────────────────
  useEffect(() => {
    setOnSave(handleSubmit);
  }, [handleSubmit, setOnSave]);

  // ─────────────────────────────────────────────
  // Render the editor
  // ─────────────────────────────────────────────
  return (
    <PageContainer className="py-6 px-4">
      <RichTextEditor
        initialContent={documentContent}
        editable
        onChange={(updatedContent, extractedTitle) => {
          setDocumentContent(updatedContent);
          setHeaderTitle(extractedTitle ?? "Untitled Asana");
        }}
      />
    </PageContainer>
  );
}
