"use client";

import { useState, useEffect } from "react";
import useUser from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocCard } from "@/components/ui/doc-card";
import { useDebounce } from "use-debounce";
import Header from "@/components/ui/header"; // bring back Header import

export default function LibraryPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [asanas, setAsanas] = useState<Asana[]>([]);

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  type Asana = {
    id: string;
    title: string;
    content: string;
  };

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      fetchAsanas(debouncedSearchValue);
    }
  }, [user, debouncedSearchValue]);

  async function fetchAsanas(searchTerm?: string) {
    const supabase = createClientComponentClient();
    let query = supabase.from("documents").select("*").eq("doc_type", "asana");

    if (searchTerm) {
      query = query.or(
        `title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`
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
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
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
