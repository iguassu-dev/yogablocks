// Overlay for inserting links
"use client";

// ─────────────────────────────────────────────
// 1. Import dependencies
// ─────────────────────────────────────────────
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/hooks/useHeader";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

// ─────────────────────────────────────────────
// 2. Define the Document type
// ─────────────────────────────────────────────
type Document = {
  id: string;
  title: string;
  content: string;
};

// ─────────────────────────────────────────────
// 3. Define the LibraryDrawer component
// ─────────────────────────────────────────────
export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen } = useHeader();
  const supabase = createClientComponentClient();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // ─────────────────────────────────────────────
  // 4. Fetch documents when the drawer is opened
  // ─────────────────────────────────────────────
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

  // ─────────────────────────────────────────────
  // 5. Filter documents based on search query
  // ─────────────────────────────────────────────
  const filteredDocuments = documents.filter((doc) =>
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ─────────────────────────────────────────────
  // 6. Render the component
  // ─────────────────────────────────────────────
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
            // If documents exist → render each one as a ghost Button.
            filteredDocuments.map((doc) => (
              <Button
                key={doc.id}
                variant="ghost"
                className="w-full justify-start"
              >
                {doc.title}
              </Button>
            ))
          ) : (
            // If no documents exist → render a message.
            <div className="text-center text-muted-foreground mt-10">
              No documents found.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
