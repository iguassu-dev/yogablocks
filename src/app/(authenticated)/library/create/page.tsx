"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useUser from "@/hooks/useUser";
import { createDoc } from "@/lib/documents/createDoc";

/**
 * CreateDocPage
 *
 * Immediately creates an empty document draft (with created_by = user.id),
 * then redirects to the editor. Works only once user is fully loaded.
 */
export default function CreateDocPage() {
  const { user, loading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Don't run until user is fully loaded and defined
    if (loading || !user) return;

    createDoc(user.id)
      .then(([success, newId]) => {
        if (!success || !newId) {
          console.error("❌ Failed to create draft");
          return;
        }
        router.replace(`/library/edit/${newId}`);
      })
      .catch((err) => {
        console.error("❌ Unexpected error in createDoc:", err);
      });
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-pulse h-6 w-32 bg-muted rounded" />
    </div>
  );
}
