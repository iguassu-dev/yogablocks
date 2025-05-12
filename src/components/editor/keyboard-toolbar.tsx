// src/components/editor/keyboard-toolbar.tsx
// mobile-only formatting UI
"use client";

import { Editor } from "@tiptap/react";
import { Bold, Italic, List, ListOrdered, Heading1 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = {
  editor: Editor | null;
};

export function KeyboardToolbar({ editor }: Props) {
  if (!editor) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-10 flex justify-around bg-background border-t border-border p-2 md:hidden">
      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={cn({ "text-primary": editor.isActive("bold") })}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={cn({ "text-primary": editor.isActive("italic") })}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={cn({
          "text-primary": editor.isActive("heading", { level: 1 }),
        })}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cn({ "text-primary": editor.isActive("bulletList") })}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cn({ "text-primary": editor.isActive("orderedList") })}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
    </div>
  );
}
