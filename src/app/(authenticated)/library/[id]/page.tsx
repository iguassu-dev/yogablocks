"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useHeader } from "@/hooks/useHeader";
import { PageContainer } from "@/components/layouts/page-container";
import { DocReadView } from "@/components/ui/doc-read-view";
import { FAB } from "@/components/ui/FAB";
import { fetchDocById } from "@/lib/fetchDocById";
import type { Doc } from "@/types";

/**
 * DocumentDetailPage
 *
 * Loads a document by ID and displays it in read-only format
 * with mobile-first styling and inline navigation.
 */
export default function DocDetailPage() {
  const { id } = useParams();
  const { setTitle } = useHeader();

  const [doc, setDoc] = useState<Doc | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDoc() {
      const result = await fetchDocById(id as string);
      if (result) {
        setDoc(result);
        setTitle(result.title);
      } else {
        setError("Document not found.");
      }
      setLoading(false);
    }

    if (id) loadDoc();

    return () => {
      setTitle("YogaBlocks");
    };
  }, [id, setTitle]);

  if (loading) {
    return <p className="text-center mt-10 text-muted-foreground">Loading…</p>;
  }

  if (error) {
    return <p className="text-center mt-10 text-destructive">Error: {error}</p>;
  }

  if (!doc) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Document not found.
      </p>
    );
  }

  return (
    <main className="relative min-h-screen">
      <PageContainer className="pt-6 px-4 pb-24">
        <DocReadView title={doc.title} content={doc.content} />

        <div className="flex justify-end mt-4">
          <FAB variant="edit" href={`/library/edit/${doc.id}`} />
        </div>
      </PageContainer>
    </main>
  );
}
