// src/hooks/useLibrary.ts
// Fetch/search documents
"use client";

import { useState, useEffect } from "react";
import supabase from "@/lib/supabaseClient";

export interface LibraryDoc {
  id: string;
  title: string;
}

/**
 * Fetches all documents and exposes an array of { id, title }
 */
export function useLibrary(): LibraryDoc[] {
  const [docs, setDocs] = useState<LibraryDoc[]>([]);

  useEffect(() => {
    async function fetchLibrary() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, created_by");

      if (error) {
        console.error("Error fetching library:", error);
        return;
      }

      setDocs(data as LibraryDoc[]);
    }

    fetchLibrary();
  }, []);

  return docs;
}
