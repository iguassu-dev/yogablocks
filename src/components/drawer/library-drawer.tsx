"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHeader } from "@/hooks/useHeader";
import { useParams } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/utils";
import { fetchLinksForDocument, upsertLink } from "@/lib/linking";

// Type for documents fetched from the library
type Document = {
  id: string;
  title: string;
  content: string;
};

export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen } = useHeader();
  const params = useParams();
  const sourceId = params.id as string; // Current document being edited

  // State: list of library documents
  const [documents, setDocuments] = useState<Document[]>([]);
  // State: existing links for the current document (to compute next position)
  const [links, setLinks] = useState<{ target_id: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

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
    if (!isLibraryDrawerOpen || !sourceId) return;
    fetchLinksForDocument(sourceId)
      .then((data) => {
        if (data) {
          setLinks(data.map((link) => ({ target_id: link.target_id })));
        } else {
          setLinks([]);
        }
      })
      .catch(console.error);
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
        {/* Search bar */}
        <Input
          placeholder="Search library..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full mb-4"
        />

        {/* Document List */}
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
            <div className="text-center text-muted-foreground mt-10">
              No documents found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
