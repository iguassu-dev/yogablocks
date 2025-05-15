// src/app/(authenticated)/library/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { DocEditor } from "@/components/editor/doc-editor";
import { toast } from "sonner";

/**
 * EditAsanaPage
 *
 * Fetches an existing Asana, displays it in the editor,
 * and delegates save logic (including linking) to DocEditor.
 */
export default function EditAsanaPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDoc() {
      const { data, error } = await supabase
        .from("documents")
        .select("title, content")
        .eq("id", documentId)
        .single();

      if (data) {
        setInitialTitle(data.title || "Untitled Asana");
        setInitialContent(data.content);
      } else {
        setError(error?.message || "Failed to fetch document");
        toast.error("Unable to load document");
        router.push("/library");
      }

      setLoading(false);
    }

    if (documentId) {
      fetchDoc();
    }
  }, [documentId, router]);

  if (loading) {
    return (
      <p className="p-4 text-muted-foreground text-sm">Loading document...</p>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">Error: {error}</p>
        <button
          onClick={() => router.push("/library")}
          className="mt-4 text-sm text-muted-foreground hover:text-foreground"
        >
          Return to Library
        </button>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen">
      <DocEditor
        initialTitle={initialTitle}
        initialContent={initialContent}
        onSave={async (title, content) => {
          const { error } = await supabase
            .from("documents")
            .update({ title, content, updated_at: new Date().toISOString() })
            .eq("id", documentId);

          if (error) {
            toast.error("Failed to save changes");
            return;
          }

          toast.success("Changes saved successfully");
          router.replace(`/library/${documentId}?from=edit`);
        }}
      />
    </main>
  );
}
