// src/app/(authenticated)/library/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { createAsana } from "@/lib/createAsana";
import { DocEditor } from "@/components/editor/doc-editor";

/**
 * CreateAsanaPage
 *
 * Renders the editor for creating a new Asana.
 * Manages the saving state and navigation after creation.
 */
export default function CreateAsanaPage() {
  const { user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  /**
   * handleCreate
   *
   * Called by DocEditor when the user taps “Save.”
   * • Flips the `saving` flag
   * • Calls Supabase via `createAsana`
   * • On success, navigates to the new asana’s detail page
   */
  const handleCreate = async (title: string, content: string) => {
    if (!user?.id) return;

    setSaving(true);

    const result = await createAsana({
      title,
      content,
      userId: user.id,
    });

    setSaving(false);

    if (result.success) {
      router.push(`/library/${result.id}`);
    }
  };

  return (
    <main className="relative min-h-screen">
      <DocEditor
        initialTitle="Untitled Asana"
        initialContent=""
        onSave={handleCreate}
        saving={saving}
      />
    </main>
  );
}
