// src/components/drawer/library-drawer.tsx
// src/components/drawer/library-drawer.tsx
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
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/utils";
import { fetchLinksForDocument, upsertLink } from "@/lib/linking";

// Type for each document row
interface Document {
  id: string;
  title: string;
  content: string;
}

/**
 * LibraryDrawer
 *
 * Shows a searchable list of asana docs.
 * – If there's no current document ID (i.e. on "create" page), we render a notice.
 * – Otherwise, clicking the "+" on a DocCard upserts the link and invokes onInsertLink.
 */
export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen, onInsertLink } =
    useHeader();

  // params.id is undefined on /library/create
  const params = useParams();
  const sourceId = params.id as string | undefined;

  const [documents, setDocuments] = useState<Document[]>([]);
  const [links, setLinks] = useState<{ target_id: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchActive, setIsSearchActive] = useState(false);

  // Fetch all asanas when drawer opens
  useEffect(() => {
    if (!isLibraryDrawerOpen) return;
    supabase
      .from("documents")
      .select("id, title, content")
      .eq("doc_type", "asana")
      .order("title", { ascending: true })
      .then(({ data, error }) => {
        if (error) console.error(error);
        else setDocuments(data as Document[]);
      });
  }, [isLibraryDrawerOpen]);

  // Load existing links if we have a sourceId
  useEffect(() => {
    if (!isLibraryDrawerOpen || !sourceId) return;
    fetchLinksForDocument(sourceId)
      .then((data) =>
        setLinks(data?.map((l) => ({ target_id: l.target_id })) || [])
      )
      .catch(console.error);
  }, [isLibraryDrawerOpen, sourceId]);

  // Insert handler: upsert in DB, then call editor callback
  async function handleInsert(doc: Document) {
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
    } catch (err) {
      console.error("Failed to insert link", {
        error: (err as any)?.message ?? err,
        details: (err as any)?.details,
      });
    }
  }

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isLibraryDrawerOpen} onOpenChange={setIsLibraryDrawerOpen}>
      <DialogContent asChild>
        <motion.div
          className="h-full w-full max-w-screen-sm flex flex-col p-4 bg-background"
          drag="y"
          dragDirectionLock
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) setIsLibraryDrawerOpen(false);
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ touchAction: "none" }}
        >
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-muted" />

          <DialogHeader>
            {isSearchActive ? (
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onCancel={() => {
                  setSearchQuery("");
                  setIsSearchActive(false);
                }}
              />
            ) : (
              <>
                <div className="flex-1" />
                <DialogTitle>Add from library</DialogTitle>
                <div className="flex-1 flex justify-end">
                  <button onClick={() => setIsSearchActive(true)}>
                    <Search />
                  </button>
                </div>
              </>
            )}
          </DialogHeader>

          <div className="flex-1 overflow-y-auto space-y-2">
            {!sourceId ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                Save your document first to insert links.
              </div>
            ) : (
              filtered.map((doc) => (
                <DocCard
                  key={doc.id}
                  title={doc.title}
                  preview={getPreview(doc.content)}
                  showPlusIcon
                  onPlusClick={() => handleInsert(doc)}
                />
              ))
            )}
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
