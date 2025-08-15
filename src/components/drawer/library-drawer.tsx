// src/components/drawer/library-drawer.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose, //
} from "@/components/ui/sheet";

import { useEffect, useState } from "react";
import { useHeader } from "@/hooks/useHeader";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

import { useParams } from "next/navigation";

import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/markdownHelpers";
import { fetchLinkForDoc, upsertLink } from "@/lib/documentLinkStore";
import type { Doc } from "@/lib/documents/types";
import { getAllDocs } from "@/lib/documents/getAllDocs";

/**
 * LibraryDrawer
 *
 * Persistent side-sheet on right (mobile + desktop).
 * No overlay, users can interact with primary content.
 * Shows a searchable list of docs.
 * If there's no current document ID (i.e. on "create" page), we render a notice.
 * Otherwise, clicking the "+" on a DocCard upserts the link and invokes onInsertLink.
 */
export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen, onInsertLink } =
    useHeader();

  // params.id is undefined on /library/create
  const params = useParams();
  const sourceId = params.id as string | undefined;

  const [documents, setDocuments] = useState<Doc[]>([]);
  const [links, setLinks] = useState<{ target_id: string }[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Fetch all docs when drawer opens
  useEffect(() => {
    if (!isLibraryDrawerOpen) return;
    getAllDocs({ fields: "id, title, content" })
      .then(setDocuments)
      .catch(console.error);
  }, [isLibraryDrawerOpen]);

  // Load existing links if we have a sourceId
  useEffect(() => {
    if (!isLibraryDrawerOpen || !sourceId) return;
    fetchLinkForDoc(sourceId)
      .then((data) =>
        setLinks(data?.map((l) => ({ target_id: l.target_id })) || [])
      )
      .catch(console.error);
  }, [isLibraryDrawerOpen, sourceId]);

  // Insert handler: upsert in DB, then call editor callback
  async function handleInsert(doc: Doc) {
    if (!sourceId) {
      // No-op if we're on "create" page
      console.warn("Cannot link: document not saved yet.");
      return;
    }
    try {
      const position = links.length;
      await upsertLink({
        source_id: sourceId,
        target_id: doc.id,
        label: doc.title,
        position,
      });
      setLinks((prev) => [...prev, { target_id: doc.id }]);
      // Tell the editor to insert the link HTML
      onInsertLink({ id: doc.id, title: doc.title });
    } catch (error: unknown) {
      console.error("Failed to insert link:", error);
    }
  }

  const filtered = documents
    .filter(
      (d) =>
        d.id !== sourceId &&
        // Prevent a document from seeing itself in the drawer
        d.title.toLowerCase().includes(searchValue.toLowerCase())
    )
    // ✅ Keep alphabetical order after filtering
    .sort((a, b) => a.title.localeCompare(b.title));

  return (
    <Sheet open={isLibraryDrawerOpen} onOpenChange={setIsLibraryDrawerOpen}>
      <SheetContent
        side="right"
        onInteractOutside={(e) => e.preventDefault()} // ✅ Prevent auto-close
        className="fixed right-0 top-0 h-full w-[320px] sm:w-[400px] border-l bg-background pointer-events-auto"
      >
        <SheetHeader className="relative flex items-center justify-center h-14 px-4 py-3">
          {isSearchOpen ? (
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onCancel={() => {
                setSearchValue("");
                setIsSearchOpen(false);
              }}
            />
          ) : (
            <>
              {/* Centered title */}
              <SheetTitle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium text-foreground">
                Add from library
              </SheetTitle>

              {/* Right: Search + Close */}
              <div className="absolute right-2 top-1/2 -translate-y-1/2 space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-10 w-10"
                  aria-label="Open search"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-6 w-6" />
                </Button>
                <SheetClose asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10"
                    aria-label="Close library"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                </SheetClose>
              </div>
            </>
          )}
        </SheetHeader>

        {/* ✅ List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 ">
          {!sourceId ? (
            <div className="text-center text-sm text-muted-foreground mt-6">
              Save your document first to insert links.
            </div>
          ) : (
            filtered.map((doc) => (
              <DocCard
                key={doc.id}
                title={doc.title?.trim() || "Untitled"}
                preview={getPreview(doc.content)}
                showPlusIcon
                onPlusClick={() => handleInsert(doc)}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
