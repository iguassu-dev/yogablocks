import { Doc } from "@/types";
import supabase from "@/lib/supabaseClient";

/**
 * Fetches a single document by ID from Supabase.
 * Logs detailed console messages for debugging.
 */
export async function fetchDocById(id: string): Promise<Doc | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`[fetchDocById] Supabase error for ID ${id}:`, error.message);
    return null;
  }

  if (!data) {
    console.warn(`[fetchDocById] No document found for ID ${id}`);
    return null;
  }

  return data as Doc;
}
