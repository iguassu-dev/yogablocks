// src/components/editor/doc-editor.tsx

"use client";

import type { Editor } from "@tiptap/react";
import { useEffect, useCallback, useState } from "react";
import { PageContainer } from "@/components/layouts/page-container";
import { RichTextEditor } from "./rich-text-editor";
import { useHeader } from "@/hooks/useHeader";

/**
 * Props for DocEditor:
 * - initialTitle: (optional) Document title to prefill in the editor
 * - initialContent: (optional) Markdown body to prefill in the editor
 * - onSave: Callback when user hits save, receives HTML from the editor
 * - saving: (optional) Boolean flag for loading state
 */
export type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string;
  onSave: (editorHtml: string) => Promise<void>;
  saving?: boolean;
};

/**
 * DocEditor
 *
 * - Renders the TipTap rich text editor.
 * - Keeps document title synced to app header.
 * - Wires up the "Save" and "Insert Link" behaviors.
 */
export function DocEditor({
  initialTitle = "Untitled",
  initialContent = "",
  onSave,
  saving = false,
}: DocEditorProps) {
  const [documentContent, setDocumentContent] = useState<string>("");
  const { setTitle: setHeaderTitle, setOnSave, setOnInsertLink } = useHeader();

  // On mount, convert markdown to HTML and set up the header
  useEffect(() => {
    async function initContent() {
      const { markdownToHtml } = await import("@/lib/markdownHelpers");
      const bodyHtml = await markdownToHtml(initialContent);
      const fullHtml = `<h1>${initialTitle}</h1>${bodyHtml}`;
      setDocumentContent(fullHtml);
      setHeaderTitle(initialTitle);
    }
    initContent();
  }, [initialContent, initialTitle, setHeaderTitle]);

  // Wire up the "Save" action in the app header
  useEffect(() => {
    setOnSave(() => {
      onSave(documentContent);
    });
  }, [documentContent, onSave, setOnSave]);

  // Register link insertion logic (for Library Drawer)
  const handleReady = useCallback(
    (editor: Editor) => {
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

  // Sync title in app header when user types
  const handleEditorChange = (html: string, extractedTitle?: string) => {
    setDocumentContent(html);
    setHeaderTitle(extractedTitle ?? "Untitled");
  };

  return (
    <PageContainer className="py-6 px-4 relative">
      {/* Overlay spinner if saving is true */}
      {saving && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
        </div>
      )}

      <RichTextEditor
        initialContent={documentContent}
        editable
        onReady={handleReady}
        onChange={handleEditorChange}
        // ⬆️ REMOVED 'saving' prop; not needed in RichTextEditor itself
      />

      {/* KeyboardToolbar is already included in RichTextEditor */}
    </PageContainer>
  );
}
