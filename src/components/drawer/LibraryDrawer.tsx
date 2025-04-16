"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useHeader } from "@/hooks/useHeader";
import supabase from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { DocCard } from "@/components/ui/doc-card";
import { getPreview } from "@/lib/utils";

type Document = {
  id: string;
  title: string;
  content: string;
};

export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen } = useHeader();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchDocuments() {
      const { data, error } = await supabase
        .from("documents")
        .select("id, title, content")
        .eq("doc_type", "asana")
        .order("title", { ascending: true });

      if (data) {
        setDocuments(data);
      } else {
        console.error(error);
      }
    }

    if (isLibraryDrawerOpen) {
      fetchDocuments();
    }
  }, [isLibraryDrawerOpen, supabase]);

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
                showPlusIcon={true} // Show Plus Icon inside Drawer
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
