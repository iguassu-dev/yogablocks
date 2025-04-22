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
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const { setTitle: setHeaderTitle, setOnSave } = useHeader();

  // ✅ useCallback stays
  const handleSubmit = useCallback(async () => {
    const cleanedTitle = title.trim() || "Untitled Asana";
    const cleanedContent = content.trim();
    if (!cleanedContent) return;
    await onSave(cleanedTitle, cleanedContent);
  }, [title, content, onSave]);
  // 1️⃣ Set title in header when it changes
  useEffect(() => {
    setHeaderTitle(title);
  }, [title, setHeaderTitle]);

  // 2️⃣ Set save handler in header only once per stabilized handleSubmit
  useEffect(() => {
    setOnSave(handleSubmit);
  }, [handleSubmit, setOnSave]);

  return (
    <PageContainer className="flex flex-col gap-4 pt-4 pb-24">
      <RichTextEditor
        initialContent={content}
        onChange={(updatedContent, parsedTitle) => {
          setContent(updatedContent);
          if (parsedTitle) setTitle(parsedTitle);
        }}
      />
    </PageContainer>
  );
}
