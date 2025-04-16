// Edit existing document page
// src/app/(authenticated)/library/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { DocEditor } from "@/components/editor/doc-editor";

export default function EditAsanaPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [initialTitle, setInitialTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Load document on mount ───
  useEffect(() => {
    async function fetchDoc() {
      const { data, error } = await supabase
        .from("documents")
        .select("title, content")
        .eq("id", documentId)
        .single();

      if (data) {
        setInitialTitle(data.title);
        setInitialContent(data.content);
      } else {
        console.error("Error fetching doc:", error);
        router.push("/library");
      }

      setLoading(false);
    }

    if (documentId) fetchDoc();
  }, [documentId, router]);

  // ─── Update handler ───
  const handleUpdate = async (title: string, content: string) => {
    setSaving(true);

    const { error } = await supabase
      .from("documents")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", documentId);

    setSaving(false);

    if (error) {
      console.error("Error saving changes:", error);
    } else {
      router.push(`/library/${documentId}`);
    }
  };

  if (loading) {
    return (
      <p className="p-4 text-muted-foreground text-sm">Loading document...</p>
    );
  }

  return (
    <DocEditor
      mode="edit"
      initialTitle={initialTitle}
      initialContent={initialContent}
      onSave={handleUpdate}
      saving={saving}
    />
  );
}
