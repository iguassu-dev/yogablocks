// src/components/ui/header.tsx

// mode = library:   [← Back]     [Doc Title]            [ ... ]
// mode = docView:   [← Back]     [Doc Title]            [ ... ]
// mode = docEdit:   [✔ Save]     [Doc Title]          [📚  ...]
// mode = docCreate: [✔ Save]     ["Untitled"]   [📚  ...]

"use client";

import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Library,
  MoreVertical,
  Trash2,
  Copy,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyHeading3 } from "@/components/ui/typography";
import { SearchInput } from "@/components/ui/search-input";
import { PageContainer } from "@/components/layouts/page-container";
import { LibraryDrawer } from "@/components/drawer/library-drawer";
import { useHeader } from "@/hooks/useHeader";
import { deleteDocById } from "@/lib/documents/deleteDoc";
import { duplicateDoc } from "@/lib/documents/duplicateDoc";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export default function Header() {
  const {
    mode,
    isSearchOpen,
    setIsSearchOpen,
    searchValue,
    setSearchValue,
    title,
    setIsLibraryDrawerOpen,
    onSave,
  } = useHeader();

  const router = useRouter();
  const { id } = useParams();
  const documentId = id as string;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDelete = async () => {
    const success = await deleteDocById(documentId);
    if (success) {
      router.push("/library");
    } else {
      console.error("❌ Document deletion failed");
      // optionally add a toast here
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-background supports-[backdrop-filter]:bg-background border-b pt-safe-top">
        <PageContainer className="flex h-14 items-center gap-2 px-0 overflow-hidden">
          {/* ───── Library Mode ───── */}
          {mode === "library" && (
            <>
              <div className="flex-1" />
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
                  <Link href="/library" className="truncate text-center">
                    <TypographyHeading3 className="m-0 align-middle">
                      YogaBlocks
                    </TypographyHeading3>
                  </Link>
                  <div className="flex-1 flex justify-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="shrink-0 h-10 w-10"
                      aria-label="Open search"
                      onClick={() => setIsSearchOpen(true)}
                    >
                      <Search className="h-6 w-6" />
                    </Button>
                  </div>
                </>
              )}
            </>
          )}

          {/* ───── Doc View Mode ───── */}
          {mode === "docView" && (
            <>
              {/* Back button */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => {
                  router.push("/library");
                }}
                aria-label="Go back"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>

              {/* Title */}
              <div className="flex-1 truncate text-left">
                <motion.div
                  key={title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="truncate"
                >
                  <TypographyBody className="m-0 align-middle">
                    {title}
                  </TypographyBody>
                </motion.div>
              </div>

              {/* More options */}
              <MoreOptionsMenu onDelete={() => setIsDialogOpen(true)} />
            </>
          )}

          {/* ───── Doc Edit/Create Modes ───── */}
          {(mode === "docEdit" || mode === "docCreate") && (
            <>
              {/* Save button on the left */}
              {onSave && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-10 w-10"
                  onClick={onSave}
                  aria-label="Save document"
                >
                  <Check className="h-6 w-6 text-purple-700" />
                </Button>
              )}

              {/* Title (dynamic) */}
              <div className="flex-1 truncate text-left">
                <motion.div
                  key={mode === "docCreate" ? "new-document" : title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="truncate"
                >
                  <TypographyBody className="m-0 align-middle">
                    {mode === "docCreate" ? "Untitled" : title}
                  </TypographyBody>
                </motion.div>
              </div>

              {/* Library Drawer toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => setIsLibraryDrawerOpen(true)}
                aria-label="Open library"
              >
                <Library className="h-6 w-6" />
              </Button>

              {/* More options */}
              <MoreOptionsMenu onDelete={() => setIsDialogOpen(true)} />
            </>
          )}
        </PageContainer>
      </header>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={async () => {
                await handleDelete();
                setIsDialogOpen(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <LibraryDrawer />
    </>
  );
}
// More options menu
function MoreOptionsMenu({ onDelete }: { onDelete: () => void }) {
  const router = useRouter();
  const { id } = useParams(); // get current doc ID
  const documentId = id as string;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="shrink-0 h-10 w-10">
          <MoreVertical className="h-6 w-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        {/* Duplicate */}
        <DropdownMenuItem
          onClick={async () => {
            const newId = await duplicateDoc(documentId);
            if (newId) {
              router.push(`/library/edit/${newId}`);
            }
          }}
        >
          <Copy className="mr-2 h-4 w-4" /> Duplicate
        </DropdownMenuItem>
        {/* Delete */}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
