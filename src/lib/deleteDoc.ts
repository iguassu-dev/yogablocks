// src/lib/deleteDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Deletes a document from Supabase by ID.
 * @param id - The UUID of the document to delete.
 * @returns Promise<void>, throws error if deletion fails
 */
export async function deleteDocById(id: string): Promise<void> {
  const { error } = await supabase.from("documents").delete().eq("id", id);
  if (error) {
    console.error("❌ Supabase delete error:", error);
    throw new Error("Failed to delete document");
  }
}
