// src/components/drawer/library-drawer.tsx
"use client";

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
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
  const [searchValue, setSearchValue] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Failed to insert link:", error.message);
      } else {
        console.error("Failed to insert link:", error);
      }
    }
  }

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <Drawer open={isLibraryDrawerOpen} onOpenChange={setIsLibraryDrawerOpen}>
      <DrawerContent className="max-w-screen-sm mx-auto bg-background p-0">
        <motion.div
          drag="y"
          dragDirectionLock
          dragElastic={0.2}
          onDragEnd={(_, info) => {
            if (info.offset.y > 100) setIsLibraryDrawerOpen(false);
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          style={{ touchAction: "none" }}
          className="flex h-full flex-col"
        >
          <DrawerHeader className="relative flex items-center justify-center h-12 px-4 pb-2">
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
                <DrawerTitle className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base font-medium text-foreground">
                  Add from library
                </DrawerTitle>

                {/* Right-aligned search icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    aria-label="Open search"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-6 w-6" />
                  </Button>
                </div>
              </>
            )}
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4 pb-6 ">
            {!sourceId ? (
              <div className="text-center text-sm text-muted-foreground mt-6">
                Save your document first to insert links.
              </div>
            ) : (
              filtered.map((doc) => (
                <DocCard
                  key={doc.id}
                  title={doc.title?.trim() || "Untitled Asana"}
                  preview={getPreview(doc.content)}
                  showPlusIcon
                  onPlusClick={() => handleInsert(doc)}
                />
              ))
            )}
          </div>
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
}
