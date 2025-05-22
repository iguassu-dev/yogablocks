// src/lib/documents/getDocById.ts
import supabase from "@/lib/supabaseClient";
import type { Doc } from "@/lib/documents/types";

/**
 * Fetches a single document by UUID.
 *
 * @param id - The UUID of the document
 * @returns A `Doc` object if found, or `null` on error or not found
 */
export async function getDocById(id: string): Promise<Doc | null> {
  const { data, error } = await supabase
    .from("documents")
    .select("id, title, content")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`[getDocById] Supabase error for ID ${id}:`, error.message);
    return null;
  }

  if (!data) {
    console.warn(`[getDocById] No document found for ID ${id}`);
    return null;
  }

  return data as Doc;
}
