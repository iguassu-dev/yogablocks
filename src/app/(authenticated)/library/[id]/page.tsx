// Document detail page
// src/app/(authenticated)/library/[id]/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { TypographyHeading1, TypographyBody } from "@/components/ui/typography";
import { useHeader } from "@/hooks/useHeader";
import { PageContainer } from "@/components/layouts/page-container";
import { FAB } from "@/components/ui/FAB";
export default function DocumentDetailPage() {
  const { id } = useParams();
  const { setMode, setTitle } = useHeader();
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

    if (id) {
      fetchDocument();
      setMode("docView");
    }

    return () => {
      setTitle("YogaBlocks");
    };
  }, [id, setMode, setTitle]);

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
      <PageContainer className="flex flex-col gap-4 pb-24">
        <TypographyHeading1>{document.title}</TypographyHeading1>
        <TypographyBody>{document.content}</TypographyBody>
        {/* Floating Action Button */}
        <div className="flex justify-end pt-4">
          <FAB variant="edit" href={`/library/edit/${document.id}`} />
        </div>
      </PageContainer>
    </main>
  );
}
