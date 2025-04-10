// library home page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useUser from "@/hooks/useUser";
import { useDebounce } from "use-debounce";
import { DocCard } from "@/components/ui/doc-card";
import { useHeader } from "@/hooks/useHeader";

export default function LibraryPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { setMode, setIsSearchOpen, searchValue } = useHeader(); // <-- Destructure what you need

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asanas, setAsanas] = useState<Asana[]>([]);

  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  type Asana = {
    id: string;
    title: string;
    content: string;
  };

  // Force Library Mode on Mount
  useEffect(() => {
    setMode("library");
    setIsSearchOpen(false);
  }, [setMode, setIsSearchOpen]);

  // Protect route if no user
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // Fetch asanas
  useEffect(() => {
    async function fetchData() {
      const supabase = createClientComponentClient();
      let query = supabase
        .from("documents")
        .select("*")
        .eq("doc_type", "asana");

      if (debouncedSearchValue) {
        query = query.or(
          `title.ilike.%${debouncedSearchValue}%,content.ilike.%${debouncedSearchValue}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setAsanas(data || []);
      }
      setLoading(false);
    }

    if (user) {
      fetchData();
    }
  }, [user, debouncedSearchValue]);

  if (userLoading || loading) {
    return (
      <p className="text-center mt-10 text-muted-foreground">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center mt-10 text-destructive">
        Error loading asanas: {error}
      </p>
    );
  }

  return (
    <>
      <div className="p-4 flex flex-col gap-4">
        {asanas.length === 0 ? (
          <p className="text-center text-muted-foreground">No asanas found.</p>
        ) : (
          asanas.map((asana) => (
            <DocCard
              key={asana.id}
              title={asana.title}
              preview={getPreview(asana.content)}
            />
          ))
        )}
      </div>
    </>
  );
}

// Helper
function getPreview(content: string) {
  const lines = content.split("\n").filter(Boolean);
  return lines[1] || lines[0] || "";
}
