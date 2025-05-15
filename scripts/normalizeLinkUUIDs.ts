// scripts/normalizeLinkUUIDs.ts
//
// Rewrites prep pose links in content column using local title → uuid map.
// Outputs a corrected CSV: documents_rows_fixed.csv

import fs from "fs/promises";
import path from "path";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";

interface Row {
  id: string;
  title: string;
  content: string;
  doc_type?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;
}

function normalizeTitle(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'")
    .replace(/\s+/g, " ");
}

async function main() {
  // 1. Load the original CSV
  const inputPath = path.join(process.cwd(), "data/documents_rows.csv");
  const outputPath = path.join(process.cwd(), "data/documents_rows_fixed.csv");

  const csv = await fs.readFile(inputPath, "utf-8");
  const rows: Row[] = parse(csv, {
    columns: true,
    skip_empty_lines: true,
  });

  // 2. Build title → id map
  const titleToId: Record<string, string> = {};
  for (const row of rows) {
    titleToId[normalizeTitle(row.title)] = row.id;
  }

  // 3. Replace all markdown links in content
  const fixedRows = rows.map((row) => {
    if (!row.content) return row;

    const linkRegex = /\[([^\]]+)\]\(\/library\/([^)]+)\)/g;

    const fixedContent = row.content.replace(
      linkRegex,
      (match: string, label: string, oldId: string): string => {
        const normalized = normalizeTitle(label);
        const correctId = titleToId[normalized];
        if (!correctId) {
          console.warn(`⚠️ No match for label "${label}"`);
          return match;
        }

        if (oldId !== correctId) {
          return `[${label}](/library/${correctId})`;
        }

        return match;
      }
    );

    return { ...row, content: fixedContent };
  });

  // 4. Write new CSV
  const output = stringify(fixedRows, { header: true });
  await fs.writeFile(outputPath, output, "utf-8");

  console.log(`✅ Fixed CSV written to: ${outputPath}`);
}

main();
