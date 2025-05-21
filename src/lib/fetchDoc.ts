// src/lib/fetchDoc.ts
import supabase from "@/lib/supabaseClient";
import type { Doc } from "@/types"; //

export async function fetchDoc({
  fields = "*",
  search,
}: {
  fields?: string;
  search?: string;
}): Promise<Doc[]> {
  let query = supabase.from("documents").select(fields);

  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("Supabase error:", error);
    return [];
  }

  return data as unknown as Doc[];
}
