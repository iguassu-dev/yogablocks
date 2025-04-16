"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
// import { cn } from "@/lib/utils";

// 🔧 Props shape for reusable Create/Edit experience
type DocEditorProps = {
  initialTitle?: string;
  initialContent?: string;
  onSave: (title: string, content: string) => Promise<void>; // Save handler injected by parent
  saving?: boolean; // optional loading state
  mode?: "create" | "edit"; // optional display mode
};

export function DocEditor({
  initialTitle = "",
  initialContent = "",
  onSave,
  saving = false,
  mode = "create",
}: DocEditorProps) {
  const router = useRouter();

  // ── Local editable state ─────────────────────
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);

  // 🧼 Sync state if props change (e.g., on route refresh)
  useEffect(() => {
    setTitle(initialTitle);
    setContent(initialContent);
  }, [initialTitle, initialContent]);

  // ── Submit Logic ─────────────────────────────
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;
    await onSave(title.trim(), content.trim());
  };

  return (
    <div className="p-4 flex flex-col gap-4 max-w-screen-md mx-auto">
      {/* ── Title Input ── */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter document title..."
        className="text-2xl font-semibold text-primary outline-none border-b border-muted pb-2"
        disabled={saving}
      />

      {/* ── Placeholder for TipTap (for now use Textarea) ── */}
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
    </div>
  );
}
