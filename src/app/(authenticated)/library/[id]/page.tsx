// Document detail page
// import { FAB } from "@/components/ui/FAB";
// <FAB variant="edit" href={`/library/edit/${docId}`} />

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; //useParams() grabs id from URL like /library/abcd-1234
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { TypographyHeading1, TypographyBody } from "@/components/ui/typography";
import { useHeader } from "@/hooks/useHeader";

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
      const supabase = createClientComponentClient();
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setDocument(data);
        setTitle(data.title); // <-- SET THE HEADER TITLE TO DOCUMENT TITLE
      }
      setLoading(false);
    }

    if (id) {
      fetchDocument();
      setMode("docView"); // Make sure Header switches to docView mode
    }

    return () => {
      setTitle("YogaBlocks"); // Cleanup: when leaving the page, reset title
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
    <main className="p-4 flex flex-col gap-4">
      <TypographyHeading1>{document.title}</TypographyHeading1>
      <TypographyBody>{document.content}</TypographyBody>
    </main>
  );
}
