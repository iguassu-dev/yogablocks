// src/components/editor/rich-text-editor.tsx
// TipTap setup, H1 enforcement, title protection

"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import type { Editor } from "@tiptap/react";
import { KeyboardToolbar } from "@/components/editor/keyboard-toolbar";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";
import { cn } from "@/lib/markdownHelpers";
import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state"; // Missing import

// ─────────────────────────────────────────────
// 1. Props for reusability
// ─────────────────────────────────────────────
type RichTextEditorProps = {
  initialContent?: string;
  onChange: (htmlContent: string, extractedTitle?: string) => void;
  onReady?: (editor: Editor) => void;
  editable?: boolean;
};

// Create title protection extension before using it
const TitleProtection = Extension.create({
  name: "titleProtection",

  addKeyboardShortcuts() {
    return {
      "Mod-b": ({ editor }) => {
        const { from } = editor.state.selection;
        const isInTitle =
          editor.isActive("heading", { level: 1 }) &&
          editor.state.doc.resolve(from).start() === 1;

        return isInTitle ? true : false;
      },
      "Mod-i": ({ editor }) => {
        const { from } = editor.state.selection;
        const isInTitle =
          editor.isActive("heading", { level: 1 }) &&
          editor.state.doc.resolve(from).start() === 1;

        return isInTitle ? true : false;
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      new Plugin({
        props: {
          handleDOMEvents: {
            keydown: (view, event) => {
              if (
                event.key === "#" &&
                view.state.selection.$from.parent.type.name === "heading"
              ) {
                const { from } = view.state.selection;
                const isInTitle = view.state.doc.resolve(from).start() === 1;

                if (isInTitle) {
                  return true;
                }
              }
              return false;
            },
          },
        },
      }),
    ];
  },
});

export function RichTextEditor({
  initialContent = "",
  onChange,
  onReady,
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
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
      }),
      Link.configure({
        openOnClick: false,
      }),
      // Configure placeholder text for different node types
      Placeholder.configure({
        placeholder: ({ node }) => {
          // Show specific placeholder for h1 (title)
          if (node.type.name === "heading" && node.attrs.level === 1) {
            return "Untitled Asana";
          }

          // Default placeholder for other content
          return "Start typing content here...";
        },
        // Only show placeholder when node is empty
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
        includeChildren: false, // Don't include placeholders in child nodes
      }),
      // Add the title protection extension
      TitleProtection,
      // Add a handler to ensure the first heading is always H1
      Extension.create({
        name: "enforceH1Title",
        addProseMirrorPlugins() {
          return [
            new Plugin({
              appendTransaction(transactions, oldState, newState) {
                if (!transactions.some((tr) => tr.docChanged)) return null;

                const tr = newState.tr;

                let foundHeading = false;
                newState.doc.descendants((node, pos) => {
                  if (foundHeading) return false;

                  if (node.type.name === "heading" && node.attrs.level !== 1) {
                    tr.setNodeMarkup(pos, undefined, { level: 1 });
                    foundHeading = true;
                    return false;
                  } else if (node.type.name === "heading") {
                    foundHeading = true;
                    return false;
                  }

                  return true;
                });

                return tr.steps.length ? tr : null;
              },
            }),
          ];
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: cn(
          "prose prose-sm prose-primary",
          "min-h-[300px]",
          "outline-none focus:outline-none"
        ),
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const match = html.match(/<h1[^>]*>(.*?)<\/h1>/i);
      const extractedTitle =
        match?.[1]?.replace(/<[^>]+>/g, "").trim() || "Untitled Asana";
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

  useEffect(() => {
    if (editor && onReady) {
      onReady(editor);
    }
  }, [editor, onReady]);

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
      <KeyboardToolbar editor={editor} />
    </article>
  );
}
