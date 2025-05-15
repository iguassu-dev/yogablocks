// src/app/(authenticated)/library/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { DocEditor } from "@/components/editor/doc-editor";
import { toast } from "sonner";
import {
  fetchLinksForDocument,
  upsertLink,
  deleteLink,
} from "@/lib/linkPersistence";

/**
 * EditAsanaPage
 *
 * Fetches an existing Asana, displays it in the editor,
 * and handles saving updates back to Supabase.
 */
export default function EditAsanaPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  // State for initial values and UI feedback
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Load the document data on mount.
   */
  useEffect(() => {
    async function fetchDoc() {
      const { data, error } = await supabase
        .from("documents")
        .select("title, content")
        .eq("id", documentId)
        .single();

      if (data) {
        // Fallback to “Untitled Asana” when the stored title is empty
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

  /**
   * handleUpdate
   *
   * Called by DocEditor when user saves edits.
   * Updates the document record and provides feedback.
   */
  const handleUpdate = async (title: string, content: string) => {
    setSaving(true);
    setError(null);

    // Verify existence to handle potential RLS errors
    const { error: checkError } = await supabase
      .from("documents")
      .select("id")
      .eq("id", documentId)
      .single();

    if (checkError) {
      setError("Document not found or access denied.");
      toast.error("Document not found");
      setSaving(false);
      return;
    }

    // Perform the update
    const { error: updateError } = await supabase
      .from("documents")
      .update({ title, content, updated_at: new Date().toISOString() })
      .eq("id", documentId)
      .select();
    if (!updateError) {
      // 1. Extract all [Label](/library/{id}) matches from markdown
      const linkPattern = /\[([^\]]+)\]\(\/library\/([0-9a-fA-F-]{36})\)/g;
      const parsedLinks: { label: string; targetId: string }[] = [];
      let match;
      while ((match = linkPattern.exec(content)) !== null) {
        parsedLinks.push({ label: match[1], targetId: match[2] });
      }

      // 2. Fetch existing links
      const existing = (await fetchLinksForDocument(documentId)) || [];

      // 3. Delete removed links
      for (const row of existing) {
        if (!parsedLinks.some((p) => p.targetId === row.target_id)) {
          await deleteLink(row.id);
        }
      }

      // 4. Upsert (insert or update) current links in order
      for (let i = 0; i < parsedLinks.length; i++) {
        const { label, targetId } = parsedLinks[i];
        const existingRow = existing.find((r) => r.target_id === targetId);
        await upsertLink({
          id: existingRow?.id, // undefined for brand-new links
          source_id: documentId,
          target_id: targetId,
          label,
          position: i,
        });
      }

      // 5. Then navigate back (you already have your toast & router.replace here)
    }

    if (updateError) {
      setError(updateError.message);
      toast.error("Failed to save changes");
    } else {
      toast.success("Changes saved successfully");
      router.replace(`/library/${documentId}?from=edit`);
    }

    setSaving(false);
  };

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
        onSave={handleUpdate}
        saving={saving}
      />
    </main>
  );
}
