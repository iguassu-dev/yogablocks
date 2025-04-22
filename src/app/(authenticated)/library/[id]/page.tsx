// Document detail page
// src/app/(authenticated)/library/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useHeader } from "@/hooks/useHeader";
import { PageContainer } from "@/components/layouts/page-container";
import { FAB } from "@/components/ui/FAB";
import { AsanaReadView } from "@/components/ui/asana-read-view";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { setTitle } = useHeader();

  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  type Document = {
    id: string;
    title: string;
    content: string;
  };

  useEffect(() => {
    async function fetchDocument() {
      console.log("Fetching document for viewing:", id);
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching document:", error);
        setError(error.message);
      } else {
        console.log("Document fetched for viewing:", data);
        setDocument(data);
        setTitle(data.title);
      }
      setLoading(false);
    }

    const cameFromEdit = searchParams.get("from") === "edit";
    if (id) {
      fetchDocument();

      if (cameFromEdit) {
        sessionStorage.setItem("backToLibrary", "true");
      } else {
        sessionStorage.removeItem("backToLibrary");
      }
    }

    return () => {
      setTitle("YogaBlocks");
    };
  }, [id, searchParams, setTitle]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading...</p>
    );
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
      <PageContainer className="flex flex-col gap-6 pb-24">
        {/* 🧠 Structured Read View replaces raw markdown */}
        <AsanaReadView title={document.title} content={document.content} />

        {/* ✏️ Edit Floating Action Button */}
        <div className="flex justify-end pt-4">
          <FAB variant="edit" href={`/library/edit/${document.id}`} />
        </div>
      </PageContainer>
    </main>
  );
}
