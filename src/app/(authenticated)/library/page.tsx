"use client";

import { useState, useEffect } from "react"; //fetch data from Supabase
import useUser from "@/hooks/useUser"; //check user authentication
import { useRouter } from "next/navigation"; //navigate to login page if not authenticated
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DocCard } from "@/components/ui/doc-card";

export default function LibraryPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  type Asana = {
    id: string;
    title: string;
    content: string;
  };

  const [asanas, setAsanas] = useState<Asana[]>([]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user) {
      const fetchAsanas = async () => {
        const supabase = createClientComponentClient();
        const { data, error } = await supabase.from("documents").select("*");

        console.log("Fetched asanas:", data);
        console.log("Supabase error:", error);

        if (error) {
          setError(error.message);
        } else {
          setAsanas(data || []);
        }
        setLoading(false);
      };

      fetchAsanas();
    }
  }, [user]);

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
  );
}

// Helper to extract a preview line from content
function getPreview(content: string) {
  const lines = content.split("\n").filter(Boolean);
  return lines[1] || lines[0] || "";
}
