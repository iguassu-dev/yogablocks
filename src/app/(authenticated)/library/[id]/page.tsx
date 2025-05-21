// src/app/(authenticated)/library/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useHeader } from "@/hooks/useHeader";
import { PageContainer } from "@/components/layouts/page-container";
import { FAB } from "@/components/ui/FAB";
import { DocReadView } from "@/components/ui/doc-read-view";

interface Document {
  id: string;
  title: string;
  content: string;
}

export default function DocumentDetailPage() {
  const { id } = useParams();
  const { setTitle } = useHeader();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, content")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        setError(error.message);
      } else if (data) {
        setDocument(data as Document);
        setTitle(data.title);
      } else {
        // data === null but no thrown error: still a failure
        setError("Document not found.");
      }
      setLoading(false);
    }

    if (id) fetchDocument();

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
  if (!document) {
    return (
      <p className="text-center mt-10 text-muted-foreground">
        Document not found.
      </p>
    );
  }

  return (
    <main className="relative min-h-screen">
      <PageContainer className="pt-6 px-4 pb-24">
        {/* Pass docs into the read view for link resolution */}
        <DocReadView title={document.title} content={document.content} />

        <div className="flex justify-end mt-4">
          <FAB variant="edit" href={`/library/edit/${document.id}`} />
        </div>
      </PageContainer>
    </main>
  );
}
