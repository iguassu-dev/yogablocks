// src/lib/documents/updateDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Updates an existing document in the `documents` table.
 *
 * @param id - UUID of the document to update
 * @param updates - Partial update fields (e.g. title, content)
 * @returns `true` if successful, otherwise `false`
 */
export async function updateDoc(
  id: string,
  updates: {
    title?: string;
    content?: string;
  }
): Promise<boolean> {
  const { error } = await supabase
    .from("documents")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error(`[updateDoc] Failed to update doc ${id}:`, error.message);
    return false;
  }

  return true;
}
