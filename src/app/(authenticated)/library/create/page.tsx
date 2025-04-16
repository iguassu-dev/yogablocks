// Create new document page
// src/app/(authenticated)/library/create/page.tsx

"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import useUser from "@/hooks/useUser";
import { createAsana } from "@/lib/createAsana";

export default function CreateAsanaPage() {
  const { user } = useUser();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!title.trim() || !content.trim() || !user?.id) return;

    setLoading(true);

    const result = await createAsana({
      title,
      content,
      userId: user.id,
    });

    setLoading(false);
    if (result.success) router.push(`/library/${result.id}`);
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="text-3xl font-semibold text-primary outline-none border-b border-muted pb-2"
      />

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="min-h-[300px] w-full border border-muted rounded-lg p-3 text-base font-normal resize-none"
        placeholder="Start typing your content here..."
      />

      <Button
        onClick={handleSave}
        disabled={loading || !title.trim() || !content.trim()}
        className="fixed bottom-6 right-6 z-50"
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
