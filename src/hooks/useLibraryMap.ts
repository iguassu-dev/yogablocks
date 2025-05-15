// src/hooks/useLibraryMap.ts
"use client";

import { useLibrary } from "./useLibrary";
import { useMemo } from "react";

/**
 * Creates a map of { title → document id } from all asanas.
 * Useful for resolving titles to links (e.g. preparatory poses).
 */
export function useLibraryMap(): Record<string, string> {
  const docs = useLibrary();

  return useMemo(() => {
    const map: Record<string, string> = {};
    for (const doc of docs) {
      map[doc.title.trim().toLowerCase()] = doc.id;
    }
    return map;
  }, [docs]);
}
