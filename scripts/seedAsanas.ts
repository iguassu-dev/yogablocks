/**
 * scripts/seedAsanas.ts
 *
 * Use this script to insert asanas from asanas.json
 * into the documents table.
 *
 * Usage: npx ts-node scripts/seedAsanas.ts
 */
import "dotenv/config";
import { config } from "dotenv";
config({ path: ".env.local" }); // This ensures variables from .env.local are loaded
import { createClient } from "@supabase/supabase-js";
import asanas from "../data/asanas.json";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const SYSTEM_USER_ID = "cdbdccbc-9125-4d58-bf12-58fbb889c8c6";

async function seedAsanas() {
  try {
    for (const asana of asanas) {
      // Compose a string or markdown version of the asana details
      // that you’ll store in `content`.
      const contentBlock = `
**Sanskrit Name**: ${asana.sanskrit_name}
**Category**: ${asana.category}

**Benefits**:
- ${asana.benefits.join("\n- ")}

**Contraindications**:
- ${asana.contraindications.join("\n- ")}

**Modifications**:
- ${asana.modifications.join("\n- ")}

**Preparatory Poses**:
- ${asana.preparatory_poses.join("\n- ")}
      `.trim();

      // Insert into documents
      const { error } = await supabase.from("documents").insert({
        doc_type: "asana",
        title: asana.english_name,
        content: contentBlock,
        created_by: SYSTEM_USER_ID,
      });

      if (error) {
        console.error(`Error inserting ${asana.english_name}`, error);
      } else {
        console.log(`Inserted asana: ${asana.english_name}`);
      }
    }

    console.log("Seeding complete!");
  } catch (err) {
    console.error("Seeding error:", err);
  }
}

seedAsanas().then(() => {
  console.log("All done!");
  process.exit(0);
});
