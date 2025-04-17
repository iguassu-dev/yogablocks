"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageContainer } from "@/components/layouts/page-container";
import { Button } from "../ui/button";

type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => Promise<void>;
  saving?: boolean;
  mode?: "create" | "edit";
};

export function DocEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  saving = false,
  mode = "create",
}: DocEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    await onSave(title.trim(), content.trim());
  };

  return (
    <PageContainer className="flex flex-col gap-4 pt-4 pb-24">
      {/* ── Title Input ── */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter document title..."
        className="text-2xl font-semibold text-primary outline-none border-b border-muted pb-2"
        disabled={saving}
      />

      {/* ── TipTap placeholder (Textarea) ── */}
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your content here..."
        className="min-h-[300px] w-full border border-muted rounded-lg p-3 text-base font-normal resize-none"
        disabled={saving}
      />
      {/* ── Save Button ── */}
      <div className="flex justify-end pt-2">
        <Button
          onClick={handleSubmit}
          disabled={saving || !title.trim() || !content.trim()}
        >
          {saving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create"}
        </Button>
      </div>
    </PageContainer>
  );
}
