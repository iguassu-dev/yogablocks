// ─────────────────────────────────────────────────────
// Utility: Parse Asana Markdown Content into Structure
// ─────────────────────────────────────────────────────

export type ParsedAsana = {
  title: string;
  sanskrit?: string;
  category?: string;
  benefits?: string[];
  contraindications?: string[];
  modifications?: string[];
  preparatory_poses?: string[];
  remainingText?: string; // fallback content if parsing fails
};

/**
 * Parses a markdown string into structured asana fields
 * @param content Full markdown content of an asana document
 */
export function parseAsanaContent(content: string): ParsedAsana {
  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 3) {
    return {
      title: lines[0] || "Untitled",
      remainingText: content,
    };
  }

  const result: ParsedAsana = {
    title: "",
  };

  // Define the allowed section keys
  type SectionKey =
    | "sanskrit"
    | "category"
    | "benefits"
    | "contraindications"
    | "modifications"
    | "preparatory_poses";

  let currentSection: SectionKey | null = null;

  // Store lines that don't match any section
  const unmatchedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cleanLine = line.replace(/^\*\*(.+?)\*\*/, "$1").trim();

    const kvMatch = cleanLine.match(/^(Sanskrit Name|Category):\s*(.*)$/i);
    if (kvMatch) {
      const key = kvMatch[1].toLowerCase();
      const value = kvMatch[2];
      if (key === "sanskrit name") result.sanskrit = value;
      if (key === "category") result.category = value;
      continue;
    }

    const sectionMatch = cleanLine.match(
      /^(Benefits|Contraindications|Modifications|Preparatory Poses):$/i
    );
    if (sectionMatch) {
      const sectionName = sectionMatch[1].toLowerCase().replace(/\s+/g, "_");

      // Type guard to ensure sectionName is a valid SectionKey
      if (
        sectionName === "benefits" ||
        sectionName === "contraindications" ||
        sectionName === "modifications" ||
        sectionName === "preparatory_poses"
      ) {
        currentSection = sectionName;
        // Initialize the array if it doesn't exist
        result[currentSection] = result[currentSection] || [];
      }
      continue;
    }

    if (line.startsWith("-") && currentSection) {
      // Handle the case where the array might not be initialized
      if (!result[currentSection]) {
        result[currentSection] = [];
      }
      // Add the item to the array
      (result[currentSection] as string[]).push(line.replace(/^-+/, "").trim());
      continue;
    }

    // If line doesn't match any other pattern, collect it
    unmatchedLines.push(line);
  }

  // If we have unmatched lines, join them as remainingText
  if (unmatchedLines.length > 0) {
    result.remainingText = unmatchedLines.join("\n");
  }

  // ✅ Fixed log
  console.log("[🧠 Parsed RemainingText]", result.remainingText);

  return result;
}
