// src/lib/documents/createDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Creates a new document in the Supabase `documents` table.
 *
 * @param userId - UUID of the current user (used for `created_by`)
 * @param title - Optional document title (defaults to "")
 * @param content - Optional document content (defaults to "")
 * @returns A tuple: [success: boolean, id?: string]
 */
export async function createDoc(
  userId: string,
  title = "",
  content = ""
): Promise<[boolean, string?]> {
  if (!userId) {
    console.error("[createDoc] Missing userId");
    return [false];
  }

  const { data: sessionData } = await supabase.auth.getSession();
  console.log("[createDoc] Current session:", sessionData);

  const { data, error } = await supabase
    .from("documents")
    .insert({
      title,
      content,
      doc_type: "user",
      created_by: userId,
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createDoc] Failed to insert document:", {
      error,
      data,
      userId,
      title,
      content,
    });
    return [false];
  }

  return [true, data.id];
}
