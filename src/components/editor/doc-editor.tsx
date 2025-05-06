// src/components/editor/doc-editor.tsx

"use client";

import type { Editor } from "@tiptap/react";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation"; // — Link Management —
import { KeyboardToolbar } from "@/components/editor/keyboard-toolbar";
import { PageContainer } from "@/components/layouts/page-container";
import { RichTextEditor } from "./rich-text-editor";
import { useHeader } from "@/hooks/useHeader";
import { markdownToHtml } from "@/lib/utils"; // Markdown → HTML
import { upsertLink } from "@/lib/linking"; // — Link Management —

/** Props for the DocEditor component */
type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string; // stored as Markdown
  onSave: (title: string, content: string) => Promise<void>;
  saving?: boolean;
};

/**
 * DocEditor
 * — Renders a TipTap-based editor with header save integration
 * — Converts between Markdown and HTML for storage
 * — **NEW:** Syncs any inserted/edited links to the backend
 */
export function DocEditor({
  initialTitle = "Untitled Asana",
  initialContent = "",
  onSave,
}: DocEditorProps) {
  // — TipTap expects HTML; this is the value we feed it
  const [documentContent, setDocumentContent] = useState<string>("");

  // — Header context for save button and title
  const { setTitle: setHeaderTitle, setOnSave } = useHeader();

  // — Holds the TipTap editor instance once ready
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null);

  // — Link Management: get current document’s ID from the URL
  const params = useParams();
  const sourceId = params.id as string | undefined;

  // ─── Initialize editor with HTML converted from Markdown ─────────────────
  useEffect(() => {
    async function initContent() {
      const bodyHtml = await markdownToHtml(initialContent);
      const fullHtml = `<h1>${initialTitle}</h1>${bodyHtml}`;
      setDocumentContent(fullHtml);
      setHeaderTitle(initialTitle);
    }
    initContent();
  }, [initialContent, initialTitle, setHeaderTitle]);

  /**
   * extractTitleAndBody
   * — Pulls out the first heading (or paragraph) as title
   * — Returns { title, body } where body is innerHTML without the title element
   */
  function extractTitleAndBody(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const heading = doc.querySelector("h1, h2, h3, h4, h5, h6");

    let title = "Untitled Asana";
    if (heading) {
      title = (heading.textContent || "").trim();
      heading.remove();
    } else {
      const firstPara = doc.querySelector("p");
      if (firstPara) {
        title = (firstPara.textContent || "").trim();
        firstPara.remove();
      }
    }

    return {
      title: title || "Untitled Asana",
      body: doc.body.innerHTML.trim(),
    };
  }

  /**
   * handleSubmit
   * — Converts the current HTML back to Markdown and calls onSave
   * — Set as the header’s save handler via setOnSave
   */
  const handleSubmit = useCallback(async () => {
    const { title, body: htmlBody } = extractTitleAndBody(documentContent);

    const TurndownService = (await import("turndown")).default;
    const turndownService = new TurndownService({ headingStyle: "atx" });
    turndownService.addRule("heading2", {
      filter: (node) => node.nodeName === "H2",
      replacement: (content) => `\n\n## ${content}\n\n`,
    });
    turndownService.addRule("heading3", {
      filter: (node) => node.nodeName === "H3",
      replacement: (content) => `\n\n### ${content}\n\n`,
    });

    const markdown = turndownService.turndown(htmlBody);
    await onSave(title, markdown);
  }, [documentContent, onSave]);

  // Register the save handler with the header
  useEffect(() => {
    setOnSave(handleSubmit);
  }, [handleSubmit, setOnSave]);

  // ─── Link Management: watch for link insertions/updates and persist them ───
  useEffect(() => {
    if (!editorInstance || !sourceId) return;

    const handleLinkUpdate = async () => {
      // Get the full editor document as JSON
      const json = editorInstance.getJSON();
      // Extract all link nodes with their href and label text
      const links = collectLinks(json);
      // Upsert each link in order
      for (let i = 0; i < links.length; i++) {
        const { href, text } = links[i];
        const targetId = href.split("/").pop()!;
        await upsertLink({
          source_id: sourceId,
          target_id: targetId,
          label: text,
          position: i,
        });
      }
    };

    // TipTap fires 'update' on every doc change
    editorInstance.on("update", handleLinkUpdate);
    return () => {
      editorInstance.off("update", handleLinkUpdate);
    };
  }, [editorInstance, sourceId]);

  return (
    <PageContainer className="py-6 px-4">
      <RichTextEditor
        initialContent={documentContent}
        editable
        onChange={(updatedContent, extractedTitle) => {
          setDocumentContent(updatedContent);
          setHeaderTitle(extractedTitle ?? "Untitled Asana");
        }}
        onReady={(editor) => setEditorInstance(editor)}
      />
      <KeyboardToolbar editor={editorInstance} />
    </PageContainer>
  );
}

/**
 * collectLinks
 * — Traverses a TipTap JSON document to find all 'link' nodes
 * — Returns an array of { href, text } for each link found
 */
function collectLinks(doc: any): { href: string; text: string }[] {
  const links: { href: string; text: string }[] = [];

  function traverse(node: any) {
    if (node.type === "link" && node.attrs?.href) {
      const text = node.content?.map((c: any) => c.text).join("") || "";
      links.push({ href: node.attrs.href, text });
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(traverse);
    }
  }

  if (Array.isArray(doc.content)) {
    doc.content.forEach(traverse);
  }
  return links;
}
