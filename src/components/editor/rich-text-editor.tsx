// Tiptap-based WYSIWYG editor
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { cn } from "@/lib/utils"; // Tailwind merge helper

// ─────────────────────────────────────────────
// 1. Props for reusability
// ─────────────────────────────────────────────
type RichTextEditorProps = {
  initialContent?: string; // prefill editor (used for Edit mode)
  onChange: (htmlContent: string, extractedTitle?: string) => void;
  // live update to parent
  editable?: boolean; // optional toggle for read-only view
};

export function RichTextEditor({
  initialContent = "",
  onChange,
  editable = true,
}: RichTextEditorProps) {
  // ─────────────────────────────────────────────
  // 2. Initialize the TipTap editor instance
  // ─────────────────────────────────────────────
  const editor = useEditor({
    content: initialContent,
    editable,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] }, // Enable H1-H3
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: "Start with a title (H1)...",
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm prose-primary", // Use the same base typography
          "min-h-[300px]", // Preserve minimum height
          "outline-none focus:outline-none"
        ),
      },
    },
    // 🔄 Handle content updates
    onUpdate({ editor }) {
      const html = editor.getHTML();
      // ⛏️ Extract the first <h1> from the HTML
      const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const extractedTitle =
        match?.[1]?.replace(/<[^>]+>/g, "").trim() || "Untitled Asana";
      // Emit content and title
      onChange(html, extractedTitle);
    },
  });

  // ─────────────────────────────────────────────
  // 3. Sync content on prop change (for Edit mode)
  // ─────────────────────────────────────────────
  useEffect(() => {
    if (editor && initialContent && editor.getHTML() !== initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  // ─────────────────────────────────────────────
  // 4. Render the Editor
  // ─────────────────────────────────────────────
  return (
    <article
      className="
        prose prose-sm prose-primary
        max-w-none
        min-h-[300px]
        outline-none focus:outline-none
      "
    >
      <EditorContent editor={editor} />
    </article>
  );
}
