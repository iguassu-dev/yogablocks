"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/ui/search-input";
import { Search } from "lucide-react";
import { useHeader } from "@/hooks/useHeader";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/utils";
import { fetchLinksForDocument, upsertLink } from "@/lib/linking";

// Type for documents fetched from the library
interface Document {
  id: string;
  title: string;
  content: string;
}

// LibraryDrawer: displays a swipe-in drawer with a searchable list of documents to link
export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen } = useHeader();
  const params = useParams();
  const sourceId = params.id as string; // Current document being edited

  const [documents, setDocuments] = useState<Document[]>([]);
  const [links, setLinks] = useState<{ target_id: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Fetch all asana documents when drawer opens
  useEffect(() => {
    async function fetchDocuments() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, content")
        .eq("doc_type", "asana")
        .order("title", { ascending: true });
      if (data) setDocuments(data as Document[]);
      else console.error(error);
    }
    if (isLibraryDrawerOpen) fetchDocuments();
  }, [isLibraryDrawerOpen]);

  // Load existing links when drawer opens or sourceId changes
  useEffect(() => {
    async function loadLinks() {
      try {
        const data = await fetchLinksForDocument(sourceId);
        setLinks(data ? data.map((l) => ({ target_id: l.target_id })) : []);
      } catch (err) {
        console.error(err);
      }
    }
    if (isLibraryDrawerOpen && sourceId) loadLinks();
  }, [isLibraryDrawerOpen, sourceId]);

  // Handler: insert or update a link for the current document
  async function handleInsert(doc: Document) {
    try {
      const nextPosition = links.length;
      await upsertLink({
        source_id: sourceId,
        target_id: doc.id,
        label: doc.title,
        position: nextPosition,
      });
      setLinks((prev) => [...prev, { target_id: doc.id }]);
    } catch (error) {
      console.error("Failed to insert link", error);
    }
  }

  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isLibraryDrawerOpen} onOpenChange={setIsLibraryDrawerOpen}>
      <DialogContent className="h-full w-full max-w-screen-sm flex flex-col p-4">
        {/* Drag handle */}
        <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted" />

        <DialogHeader className="!flex-row items-center justify-between !gap-0 !text-center sm:!text-center">
          {!isSearchActive ? (
            <>
              {/* left spacer */}
              <div className="flex-1" />
              {/* centered title */}
              <DialogTitle className="truncate text-center flex-shrink-0">
                Add from library
              </DialogTitle>
              {/* right action */}
              <div className="flex-1 flex justify-end">
                <button
                  type="button"
                  aria-label="Open search"
                  onClick={() => setIsSearchActive(true)}
                  className="p-2 rounded hover:bg-muted"
                >
                  <Search className="w-6 h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onCancel={() => {
                  setSearchQuery("");
                  setIsSearchActive(false);
                }}
              />
            </div>
          )}
        </DialogHeader>

        {/* Document list */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {filteredDocuments.length > 0 ? (
            filteredDocuments.map((doc) => (
              <DocCard
                key={doc.id}
                title={doc.title}
                preview={getPreview(doc.content)}
                showPlusIcon
                onPlusClick={() => handleInsert(doc)}
              />
            ))
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              No documents found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
