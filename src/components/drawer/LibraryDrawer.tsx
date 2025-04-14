// Overlay for inserting links
"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHeader } from "@/hooks/useHeader";

export function LibraryDrawer() {
  const { isLibraryDrawerOpen, setIsLibraryDrawerOpen } = useHeader();

  return (
    <Dialog open={isLibraryDrawerOpen} onOpenChange={setIsLibraryDrawerOpen}>
      <DialogContent className="h-full w-full max-w-screen-sm flex flex-col p-4">
        {/* Search bar */}
        <Input
          placeholder="Search library..."
          className="w-full mb-4"
          // Later we'll wire this up to search functionality
        />

        {/* Placeholder for document cards */}
        <div className="flex-1 overflow-y-auto">
          <div className="text-center text-muted-foreground mt-10">
            Library content will appear here.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
