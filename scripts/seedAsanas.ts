// scripts/seedAsanas.ts
// Seeds the Supabase `documents` table with official asanas

// Ended up using normalizeLinkUUIDs.ts for a one-time fix to replace all [Title](/library/WRONG_UUID) links in asana content with correct UUIDs based on Supabase data.
// Seeded Supabase by importing /data/documents_rows.csv

import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

import { createClient } from "@supabase/supabase-js";
import fs from "fs/promises";
import { parse } from "csv-parse/sync";

const supabase = createClient(
  process.env.SUPABASE_URL || "",
  process.env.SUPABASE_ANON_KEY || ""
);
const SYSTEM_USER_ID = "cdbdccbc-9125-4d58-bf12-58fbb889c8c6"; // official asana author

// Type for official asanas in asanas.json
interface RawAsana {
  english_name: string;
  sanskrit_name: string;
  category: string;
  benefits?: string[];
  contraindications?: string[];
  modifications?: string[];
  preparatory_poses?: string[];
}

interface UUIDRow {
  id: string;
  title: string;
}
function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'") // normalize apostrophes
    .replace(/\s+/g, " ");
}

async function main() {
  // 1. Load official asana JSON
  const raw = await fs.readFile(
    path.join(process.cwd(), "data/asanas.json"),
    "utf-8"
  );
  const asanas: RawAsana[] = JSON.parse(raw);

  // 2. Load Supabase-exported UUID map
  const csv = await fs.readFile(
    path.join(process.cwd(), "data/documents_rows.csv"),
    "utf-8"
  );
  const rows: UUIDRow[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  const titleToId: Record<string, string> = {};
  rows.forEach((r) => {
    titleToId[normalizeTitle(r.title)] = r.id;
  });

  // 3. Loop over asanas and insert with proper markdown links
  for (const pose of asanas) {
    const lines: string[] = [];

    lines.push(`## Sanskrit Name ${pose.sanskrit_name}`);
    lines.push(`## Category ${pose.category}`);

    if (pose.benefits?.length) {
      lines.push(
        `## Benefits\n${pose.benefits.map((b) => `- ${b}`).join("\n")}`
      );
    }

    if (pose.contraindications?.length) {
      lines.push(
        `## Contraindications\n${pose.contraindications
          .map((c) => `- ${c}`)
          .join("\n")}`
      );
    }

    if (pose.modifications?.length) {
      lines.push(
        `## Modifications\n${pose.modifications
          .map((m) => `- ${m}`)
          .join("\n")}`
      );
    }
    console.log(
      `Prep poses for "${pose.english_name}":`,
      pose.preparatory_poses
    );

    if (pose.preparatory_poses?.length) {
      lines.push("## Preparatory Poses");
      for (const prep of pose.preparatory_poses) {
        const normalized = normalizeTitle(prep);
        const matchId = titleToId[normalized];

        if (matchId) {
          lines.push(`- [${prep}](/library/${matchId})`);
        } else {
          console.warn(`⚠️ Could not find ID for prep pose: "${prep}"`);
          lines.push(`- ${prep}`);
        }
      }
    }

    const markdownContent = lines.join("\n\n");

    const { error } = await supabase.from("documents").insert({
      doc_type: "asana",
      title: pose.english_name,
      content: markdownContent,
      created_by: SYSTEM_USER_ID,
    });

    if (error) {
      console.error(`❌ Failed to insert "${pose.english_name}"`, error);
    } else {
      console.log(`✅ Inserted "${pose.english_name}"`);
    }
  }
}

main();
