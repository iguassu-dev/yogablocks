// src/lib/documents/duplicateDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Duplicates a document by ID.
 *
 * @param documentId - UUID of the document to duplicate
 * @returns The new document ID if successful, otherwise null
 */
export async function duplicateDoc(documentId: string): Promise<string | null> {
  // 1. Get current user session
  const { data: userData, error: userError } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  if (userError || !userId) {
    console.error("[duplicateDoc] No valid user session found", userError);
    return null;
  }

  // 2. Fetch original document
  const { data: original, error: fetchError } = await supabase
    .from("documents")
    .select("title, content, doc_type")
    .eq("id", documentId)
    .single();

  if (fetchError || !original) {
    console.error(
      `[duplicateDoc] Failed to fetch original doc ${documentId}`,
      fetchError
    );
    return null;
  }

  const newTitle = original.title?.trim()
    ? `${original.title.trim()} (Copy)`
    : "Untitled (Copy)";

  // 3. Insert duplicated document
  const { data: inserted, error: insertError } = await supabase
    .from("documents")
    .insert({
      title: newTitle,
      content: original.content,
      doc_type: original.doc_type || null,
      created_by: userId,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error(
      `[duplicateDoc] Failed to insert duplicate for ${documentId}`,
      insertError
    );
    return null;
  }

  return inserted.id;
}
