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

  let currentSection:
    | keyof Omit<ParsedAsana, "title" | "remainingText">
    | null = null;

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
      currentSection = sectionMatch[1]
        .toLowerCase()
        .replace(" ", "_") as keyof Omit<
        ParsedAsana,
        "title" | "remainingText"
      >;
      (result[currentSection] as string[]) = [];
      continue;
    }

    if (line.startsWith("-") && currentSection) {
      (result[currentSection] as string[]).push(line.replace(/^-+/, "").trim());
      continue;
    }

    if (!currentSection && !result.remainingText) {
      result.remainingText = line;
    }
  }

  // ✅ Fixed log
  console.log("[🧠 Parsed RemainingText]", result.remainingText);

  return result;
}
