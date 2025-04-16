// src/lib/createAsana.ts

import supabase from "@/lib/supabaseClient";

export async function createAsana({
  title,
  content,
  userId,
}: {
  title: string;
  content: string;
  userId: string;
}): Promise<{ success: boolean; id?: string }> {
  const { data, error } = await supabase
    .from("documents")
    .insert([
      {
        doc_type: "asana",
        title,
        content,
        created_by: userId,
      },
    ])
    .select("id")
    .single();

  if (error || !data?.id) {
    console.error("insert error:", error);
    return { success: false };
  }

  return { success: true, id: data.id };
}
