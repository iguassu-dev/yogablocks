// Edit existing document page
// src/app/(authenticated)/library/edit/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { DocEditor } from "@/components/editor/doc-editor";
import { toast } from "sonner";

export default function EditAsanaPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [initialTitle, setInitialTitle] = useState("");
  const [initialContent, setInitialContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ─── Load document on mount ───
  useEffect(() => {
    async function fetchDoc() {
      console.log("Fetching document:", documentId);
      const { data, error } = await supabase
        .from("documents")
        .select("title, content")
        .eq("id", documentId)
        .single();

      if (data) {
        console.log("Document fetched successfully:", { title: data.title });
        setInitialTitle(data.title);
        setInitialContent(data.content);
      } else {
        console.error("Error fetching doc:", error);
        setError(error?.message || "Failed to fetch document");
        router.push("/library");
      }

      setLoading(false);
    }

    if (documentId) fetchDoc();
  }, [documentId, router]);

  // ─── Update handler ───
  const handleUpdate = async (title: string, content: string) => {
    console.log("Starting update for document:", documentId);
    console.log("Update payload:", {
      title,
      content: content.slice(0, 100) + "...",
    });

    setSaving(true);
    setError(null);

    try {
      const { error: checkError } = await supabase
        .from("documents")
        .select("id")
        .eq("id", documentId)
        .single();

      if (checkError) {
        console.error("Error checking document existence:", checkError);
        setError("Document not found. It may have been deleted.");
        toast.error("Document not found");
        return;
      }

      // Proceed with update and log results
      const { data, error } = await supabase
        .from("documents")
        .update({
          title,
          content,
          updated_at: new Date().toISOString(),
        })
        .eq("id", documentId)
        .select();
      console.log("Update result:", { data, error });

      if (data?.length === 0) {
        console.warn("Update failed — possibly blocked by RLS");
      }

      if (error) {
        console.error("Supabase update error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        setError(error.message);
        toast.error("Failed to save changes");
        return;
      }

      console.log("Document updated successfully:", {
        id: documentId,
        title,
      });

      toast.success("Changes saved successfully");

      const viewUrl = `/library/${documentId}?from=edit`;
      router.replace(viewUrl);
    } catch (err) {
      console.error("Unexpected error during update:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
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
    <DocEditor
      initialTitle={initialTitle}
      initialContent={initialContent}
      onSave={handleUpdate}
      saving={saving}
    />
  );
}
