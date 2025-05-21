// library home page
// src/app/(authenticated)/library/page.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import useUser from "@/hooks/useUser";
import { useHeader } from "@/hooks/useHeader";
import { PageContainer } from "@/components/layouts/page-container";
import { useDebounce } from "use-debounce";
import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/markdownHelpers";
import { FAB } from "@/components/ui/FAB";

export default function LibraryPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { searchValue } = useHeader();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  type Doc = {
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
    async function fetchData() {
      let query = supabase.from("documents").select("*");

      if (debouncedSearchValue) {
        query = query.or(
          `title.ilike.%${debouncedSearchValue}%,content.ilike.%${debouncedSearchValue}%`
        );
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
      } else {
        setDocs(data || []);
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
        Error loading docs: {error}
      </p>
    );
  }

  return (
    <main className="relative min-h-screen">
      <PageContainer className="pt-6 px-4 pb-24">
        {docs.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No documents found.
          </p>
        ) : (
          docs.map((doc) => (
            <Link key={doc.id} href={`/library/${doc.id}`}>
              <DocCard
                title={doc.title}
                preview={getPreview(doc.content)}
                showPlusIcon={false}
              />
            </Link>
          ))
        )}
        {/* Floating Action Button */}
        <div className="flex justify-end mt-6">
          <FAB variant="create" href="/library/create" />
        </div>
      </PageContainer>
    </main>
  );
}
