// src/app/(authenticated)/library/edit/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { DocEditor } from "@/components/editor/doc-editor";
import { getDocById } from "@/lib/documents/getDocById";
import { saveDoc } from "@/lib/documents/saveDoc";

/**
 * EditDocPage
 *
 * This page loads a document for editing.
 * - Loads the doc's initial data from the database (title/content)
 * - Renders the DocEditor, passing initial data and the save handler
 * - Handles UI for loading/error states and redirects after save
 */
export default function EditDocPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  // State for initial doc values and UI feedback
  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // On mount, load the document from the database
  useEffect(() => {
    async function loadDoc() {
      const doc = await getDocById(documentId);
      if (doc) {
        setInitialTitle(doc.title || "Untitled");
        setInitialContent(doc.content);
      } else {
        toast.error("Unable to load document");
        setError("Document not found");
        router.push("/library");
      }
      setLoading(false);
    }

    if (documentId) loadDoc();
  }, [documentId, router]);

  // While loading, show a loading message
  if (loading) {
    return (
      <p className="p-4 text-muted-foreground text-sm">Loading document...</p>
    );
  }

  // If there's an error, display a friendly message and a return link
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

  // Handle save: hand editorHtml off to saveDocument helper
  const handleSave = async (editorHtml: string) => {
    setSaving(true);
    const success = await saveDoc({
      docId: documentId,
      editorHtml,
    });
    setSaving(false);

    if (!success) {
      toast.error("Failed to save changes");
    } else {
      toast.success("Changes saved successfully");
      router.replace(`/library/${documentId}?from=edit`);
    }
  };

  // Render the editor with the loaded document data
  return (
    <main className="relative min-h-screen">
      <DocEditor
        initialTitle={initialTitle}
        initialContent={initialContent}
        onSave={handleSave}
        saving={saving}
      />
    </main>
  );
}
