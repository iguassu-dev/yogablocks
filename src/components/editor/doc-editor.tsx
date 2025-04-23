"use client";

import { useCallback, useEffect, useState } from "react";
import { PageContainer } from "@/components/layouts/page-container";
import { RichTextEditor } from "./rich-text-editor";
import { useHeader } from "@/hooks/useHeader";

type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => Promise<void>;
  saving?: boolean;
};

export function DocEditor({
  initialTitle = "Untitled Asana",
  initialContent = "",
  onSave,
}: DocEditorProps) {
  const initialHTML = `
  <h1>${initialTitle.trim() || "Untitled Asana"}</h1>
  ${initialContent
    .split("\n\n")
    .map((p) => `<p>${p}</p>`)
    .join("")}
`;

  const [documentContent, setDocumentContent] = useState(initialHTML);

  const { setTitle: setHeaderTitle, setOnSave } = useHeader();

  // Helper to pull title/body out of our HTML
  function extractTitleAndBody(html: string) {
    const doc = new DOMParser().parseFromString(html, "text/html");
    const h1 = doc.querySelector("h1");
    const title = (h1?.textContent || "").trim() || "Untitled Asana";
    if (h1) h1.remove();
    return { title, body: doc.body.innerHTML.trim() };
  }

  // ✅ useCallback stays
  const handleSubmit = useCallback(async () => {
    const { title, body } = extractTitleAndBody(documentContent);
    await onSave(title, body);
  }, [documentContent, onSave]);

  // [Removed] redundant effect—header now updates from RichTextEditor’s parsed title

  // 2️⃣ Set save handler in header only once per stabilized handleSubmit
  useEffect(() => {
    setOnSave(handleSubmit);
  }, [handleSubmit, setOnSave]);

  return (
    <PageContainer className="py-6 px-4">
      <RichTextEditor
        initialContent={documentContent}
        onChange={(
          updatedContent,
          extractedTitle /* Tiptap gives us the H1 text */
        ) => {
          setDocumentContent(updatedContent);
          setHeaderTitle(extractedTitle ?? "Untitled Asana");
        }}
      />
    </PageContainer>
  );
}
