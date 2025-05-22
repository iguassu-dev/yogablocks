// src/lib/documents/deleteDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Deletes a document from the `documents` table by ID.
 *
 * @param id - UUID of the document to delete
 * @returns boolean - true if successful, false if failed
 */
export async function deleteDocById(id: string): Promise<boolean> {
  if (!id) {
    console.error("[deleteDocById] Missing document ID");
    return false;
  }

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    console.error("[deleteDocById] Supabase delete error:", error);
    return false;
  }

  return true;
}
