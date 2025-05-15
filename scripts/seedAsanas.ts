/**
 * scripts/seedAsanas.ts
 *
 * Converts structured asanas from JSON into markdown.
 * Prep poses are stored as markdown links using UUIDs.
 *
 * Usage: npx tsx scripts/seedAsanas.ts
 */

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import asanas from "../data/asanas.json";

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);

const SYSTEM_USER_ID = "cdbdccbc-9125-4d58-bf12-58fbb889c8c6";

// 1. Fetch all existing asanas to build a title → UUID map
const { data: allDocs, error: fetchError } = await supabase
  .from("documents")
  .select("id, title")
  .eq("doc_type", "asana");

if (fetchError || !allDocs) {
  console.error("❌ Failed to fetch existing asanas:", fetchError);
  process.exit(1);
}

const titleToIdMap: Record<string, string> = {};
for (const doc of allDocs) {
  titleToIdMap[doc.title.trim().toLowerCase()] = doc.id;
}

// 2. Utility to wrap markdown sections
function section(label: string, values?: string[]): string | undefined {
  if (!values?.length) return;
  return [`## ${label}`, ...values.map((item) => `- ${item}`)].join("\n");
}

// 3. Seed each asana
(async function seedAsanas() {
  for (const asana of asanas) {
    // Convert preparatory poses to markdown links (or fallback to plain text)
    const linkedPrepPoses = (asana.preparatory_poses || []).map(
      (title: string) => {
        const normalized = title.trim().toLowerCase();
        const id = titleToIdMap[normalized];
        return id ? `[${title}](/library/${id})` : title;
      }
    );

    // Compose full markdown body
    const parts = [
      `## Sanskrit Name\n${asana.sanskrit_name}`,
      `## Category\n${asana.category}`,
      section("Benefits", asana.benefits),
      section("Contraindications", asana.contraindications),
      section("Modifications", asana.modifications),
      section("Preparatory Poses", linkedPrepPoses),
    ];

    const contentBlock = parts.filter(Boolean).join("\n\n");

    // Insert document
    const { error } = await supabase.from("documents").insert({
      doc_type: "asana",
      title: asana.english_name,
      content: contentBlock,
      created_by: SYSTEM_USER_ID,
    });

    if (error) {
      console.error(`❌ Error inserting ${asana.english_name}:`, error);
    } else {
      console.log(`✅ Inserted: ${asana.english_name}`);
    }
  }

  console.log("🎉 Seeding complete!");
})();
