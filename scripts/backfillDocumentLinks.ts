// scripts/backfillDocumentLinks.ts

import "dotenv/config"; // Load .env variables for CLI use
import { createClient } from "@supabase/supabase-js";
import { extractMarkdownLinks } from "@/lib/extractMarkdownLinks";
import { isValidUUID } from "@/lib/markdownHelpers";

// Setup Supabase client for CLI use
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
console.log("✅ Loaded Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log(
  "✅ Loaded Supabase Key:",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + "..."
);

// Fetch all existing links for a given document
async function fetchLinksForDocument(source_id: string) {
  const { data, error } = await supabase
    .from("document_links")
    .select("*")
    .eq("source_id", source_id);
  if (error) throw error;
  return data;
}

// Upsert one link into the document_links table
async function upsertLink({
  source_id,
  target_id,
  label,
  position,
}: {
  source_id: string;
  target_id: string;
  label: string;
  position: number;
}) {
  const { error } = await supabase.from("document_links").upsert([
    {
      source_id,
      target_id,
      label,
      position,
    },
  ]);
  if (error) throw error;
}

async function backfillLinks() {
  // Step 1: Fetch all documents
  const { data: documents, error } = await supabase
    .from("documents")
    .select("id, content");

  if (error) {
    console.error("❌ Error fetching documents:", error.message);
    return;
  }
  if (!documents || documents.length === 0) {
    console.warn("⚠️ No documents found in Supabase.");
    return;
  }

  console.log(`📦 Fetched ${documents.length} documents from Supabase.`);

  // Step 2: Loop through each document
  for (const doc of documents) {
    const source_id = doc.id;
    const markdown = doc.content ?? "";

    if (!markdown.trim()) {
      console.warn(`⚠️ Skipping empty document ${source_id}`);
      continue;
    }

    console.log(`📄 Processing document: ${source_id}`);

    // Step 3: Extract all links
    const allLinks = extractMarkdownLinks(markdown);
    console.log(`   ↳ Raw extracted links:`, allLinks);

    const links = allLinks.filter((link) => isValidUUID(link.target_id));
    console.log(`   ↳ Valid links: ${links.length}`);

    // Optional: Fetch and remove stale links (not shown here)
    try {
      const existing = await fetchLinksForDocument(source_id);

      // Step 4: Upsert each link
      for (const link of links) {
        await upsertLink({ source_id, ...link });
      }

      console.log(`✅ Synced ${links.length} links for document ${source_id}`);
    } catch (err) {
      console.error(`❌ Failed syncing for ${source_id}`, err);
    }
  }

  console.log("🎉 Finished backfilling document_links.");
}

backfillLinks();
