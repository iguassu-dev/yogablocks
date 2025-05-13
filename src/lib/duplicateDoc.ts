// src/lib/duplicateDoc.ts
import supabase from "@/lib/supabaseClient";

/**
 * Duplicates a document by ID.
 * Returns the new document ID on success, or null on failure.
 */
export async function duplicateDoc(documentId: string): Promise<string | null> {
  // 1. Fetch original doc
  const { data, error } = await supabase
    .from("documents")
    .select("title, content, doc_type, created_by")
    .eq("id", documentId)
    .single();

  if (error || !data) {
    console.error("Duplicate failed: unable to fetch document", error);
    return null;
  }

  const newTitle = data.title
    ? `${data.title} (Copy)`
    : "Untitled Asana (Copy)";

  // 2. Insert duplicated doc
  const { data: inserted, error: insertError } = await supabase
    .from("documents")
    .insert({
      title: newTitle,
      content: data.content,
      doc_type: data.doc_type,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error(
      "Duplicate failed: unable to insert new document",
      insertError
    );
    return null;
  }

  return inserted.id;
}
