// src/app/(authenticated)/library/edit/[id]/page.tsx

"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { DocEditor } from "@/components/editor/doc-editor";
import { getDocById } from "@/lib/documents/getDocById";
import { updateDoc } from "@/lib/documents/updateDoc";

/**
 * EditDocPage
 *
 * Loads a document by ID, passes its data into the editor,
 * and wires up the save functionality for updates.
 */
export default function EditDocPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [initialTitle, setInitialTitle] = useState<string>("");
  const [initialContent, setInitialContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          const success = await updateDoc(documentId, { title, content });

          if (!success) {
            toast.error("Failed to save changes");
            return;
          }

          toast.success("Changes saved successfully");
          router.replace(`/library/${documentId}?from=edit`);

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
