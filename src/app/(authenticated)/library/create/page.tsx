// src/app/(authenticated)/library/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/hooks/useUser";
import supabase from "@/lib/supabaseClient";

/**
 * CreateAsanaPage
 *
 * Immediately creates an empty "asana" draft (with
 * created_by stamped to the current user), then
 * redirects into the editor for that draft.
 */
export default function CreateAsanaPage() {
  const { user } = useUser();
  const router = useRouter();

  // Extract userId so we can narrow its type
  const userId = user?.id;

  useEffect(() => {
    // Don’t run until we have a valid userId
    if (!userId) return;

    async function createDraft() {
      const { data, error } = await supabase
        .from("documents")
        .insert({
          doc_type: "asana",
          title: "",
          content: "",
          created_by: userId, // safe: userId is non-null here
        })
        .select("id")
        .single();

      if (error || !data) {
        console.error("Failed to create draft", error);
        return;
      }

      // Replace so back-button doesn’t go back to /create
      router.replace(`/library/edit/${data.id}`);
    }

    createDraft();
  }, [userId, router]); // effect only re-runs when userId or router change

  return (
    <div className="flex items-center justify-center h-full">
      {/* Simple pulsing bar as a skeleton header */}
      <div className="animate-pulse h-6 w-32 bg-muted rounded" />
    </div>
  );
}
