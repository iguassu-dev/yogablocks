// src/lib/linkPersistence.ts
import supabase from "./supabaseClient";

// (1) Keep a single source of truth for DocumentLink
export interface DocLink {
  id: string;
  source_id: string;
  target_id: string;
  label: string;
  position: number;
  created_at: string;
}

// (2) Drop the <Row,Insert> generics entirely
export async function fetchLinkForDoc(sourceId: string) {
  const { data, error } = await supabase
    .from("document_links") // no generics here
    .select("*")
    .eq("source_id", sourceId)
    .order("position", { ascending: true });

  if (error) throw error;
  // cast the result to your interface
  return data as DocLink[] | null;
}
// Upserts one or more document_links to Supabase
export async function upsertLink(link: Partial<DocLink>) {
  const { data, error } = await supabase
    .from("document_links")
    .upsert(link, { onConflict: "id" });
  if (error) throw error;
  return data as DocLink[] | null;
}

// Deletes one or more document_links if they were removed from the editor content.
export async function deleteLink(id: string) {
  const { error } = await supabase.from("document_links").delete().eq("id", id);
  if (error) throw error;
  return true;
}
