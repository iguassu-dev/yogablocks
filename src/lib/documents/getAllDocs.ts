// src/lib/documents/getAllDocs.ts
import supabase from "@/lib/supabaseClient";
import type { Doc } from "@/lib/documents/types";

/**
 * Fetches all documents from the Supabase `documents` table.
 * Optionally filters by a full-text search query.
 *
 * @param options - Optional config for fields and search term
 * @returns Array of Doc objects matching the query
 */
export async function getAllDocs({
  fields = "*",
  search,
}: {
  fields?: string;
  search?: string;
} = {}): Promise<Doc[]> {
  // Initialize query with optional fields (default "*")
  let query = supabase.from("documents").select(fields);

  // Apply full-text search if search term is provided
  if (search) {
    query = query.or(`title.ilike.%${search}%,content.ilike.%${search}%`);
  }

  // Execute query
  const { data, error } = await query;

  // Handle errors gracefully
  if (error || !data) {
    console.error("[getAllDocs] Supabase error:", error);
    return [];
  }

  // Cast and return result
  return data as unknown as Doc[];
}
