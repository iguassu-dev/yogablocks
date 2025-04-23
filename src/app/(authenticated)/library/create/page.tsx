// Create new document page
// src/app/(authenticated)/library/create/page.tsx
"use client";

import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import { createAsana } from "@/lib/createAsana";
import { DocEditor } from "@/components/editor/doc-editor";
import { useState } from "react";

export default function CreateAsanaPage() {
  const { user } = useUser();
  const router = useRouter();
  const [saving, setSaving] = useState(false);

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
      <DocEditor onSave={handleCreate} saving={saving} />
    </main>
  );
}
