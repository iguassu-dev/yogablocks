// Document detail page
// import { FAB } from "@/components/ui/FAB";
// <FAB variant="edit" href={`/library/edit/${docId}`} />

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { TypographyHeading1, TypographyBody } from "@/components/ui/typography";
import { useHeader } from "@/hooks/useHeader";

export default function DocumentDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setMode, setTitle } = useHeader();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timestamp, setTimestamp] = useState(Date.now());

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
        // Update timestamp to force re-render
        setTimestamp(Date.now());
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
    <main
      className="p-4 flex flex-col gap-4"
      key={`${document.id}-${timestamp}`}
    >
      <TypographyHeading1>{document.title}</TypographyHeading1>
      <TypographyBody>{document.content}</TypographyBody>
    </main>
  );
}
