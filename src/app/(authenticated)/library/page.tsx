// library home page
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useUser from "@/hooks/useUser";
import { useHeader } from "@/hooks/useHeader";
import { useDebounce } from "use-debounce";
import { DocCard } from "@/components/ui/doc-card";
import { FAB } from "@/components/ui/FAB";

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
    <main className="relative min-h-screen">
      <div className="p-4 flex flex-col gap-4 pb-24">
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

      {/* Floating Action Button now absolute, inside main */}
      <div className="absolute bottom-6 right-6">
        <FAB variant="create" href="/library/create" />
      </div>
    </main>
  );
}

// Helper
function getPreview(content: string) {
  const lines = content.split("\n").filter(Boolean);
  return lines[1] || lines[0] || "";
}
