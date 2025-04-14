// Edit existing document page
"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function EditAsanaPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientComponentClient();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const documentId = params.id as string; // 'id' comes from URL

  useEffect(() => {
    async function fetchDocument() {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", documentId)
        .single();

      if (data) {
        setTitle(data.title);
        setContent(data.content);
      } else {
        console.error(error);
      }
    }

    fetchDocument();
  }, [documentId, supabase]);

  async function handleSave() {
    const { error } = await supabase
      .from("documents")
      .update({
        title,
        content,
      })
      .eq("id", documentId);

    if (error) {
      console.error(error);
      return;
    }

    router.push("/library"); // after saving, go back to Library
  }

  return (
    <main className="p-4 flex flex-col gap-4">
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
      />
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="h-80"
      />
      <Button onClick={handleSave}>Save</Button>
    </main>
  );
}
