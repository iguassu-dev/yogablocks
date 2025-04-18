// src/components/ui/header.tsx

// When in library mode and isSearchOpen = false, Show brand title + search icon
// When in library mode and isSearchOpen = true, Show full search input
// When in docView mode, Show brand title
// When in docEdit mode, Show "Editing..." title

// src/components/ui/header.tsx

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useState } from "react";
import {
  Search,
  ArrowLeft,
  Library,
  MoreVertical,
  Trash2,
  Copy,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyHeading3 } from "@/components/ui/typography";
import { SearchInput } from "@/components/ui/search-input";
import { PageContainer } from "@/components/layouts/page-container";
import { LibraryDrawer } from "@/components/drawer/library-drawer";

import { useHeader } from "@/hooks/useHeader";
import { useParams } from "next/navigation";

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

import { deleteDocById } from "@/lib/deleteDoc";

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function Header() {
  const {
    mode,
    isSearchOpen,
    setIsSearchOpen,
    searchValue,
    setSearchValue,
    title,
    setIsLibraryDrawerOpen,
  } = useHeader();
  const router = useRouter();
  const { id } = useParams();
  const documentId = id as string;

  // 🔴 Local state for modal
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 🔴 Handler for deletion
  const handleDelete = async () => {
    try {
      await deleteDocById(documentId);
      router.push("/library");
    } catch (err) {
      console.error(err);
      // optionally show toast here later
    }
  };
  return (
    <>
      <header className="sticky top-0 z-50 bg-background supports-[backdrop-filter]:bg-background border-b pt-safe-top">
        <PageContainer className="flex h-14 items-center gap-2 min-w-0 overflow-hidden">
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
                    <TypographyHeading3>YogaBlocks</TypographyHeading3>
                  </Link>
                  <div className="flex-1 flex justify-end">
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
            </>
          )}

          {/* ───── Doc View / Edit Mode ───── */}
          {(mode === "docView" || mode === "docEdit") && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => {
                  const backToLibrary =
                    sessionStorage.getItem("backToLibrary") === "true";
                  if (backToLibrary) {
                    router.push("/library");
                  } else {
                    router.back();
                  }
                }}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex-1 truncate text-left">
                <motion.div
                  key={title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-left"
                >
                  <TypographyBody>{title}</TypographyBody>
                </motion.div>
              </div>

              {/* Dropdown menu with Delete option */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 h-10 w-10"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end">
                  <DropdownMenuItem onClick={() => console.log("Duplicate")}>
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Delete Confirmation Modal */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Delete Document?</DialogTitle>
                    <DialogDescription>
                      This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() => setIsDialogOpen(false)}
                    >
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
            </>
          )}

          {/* ───── Doc Create Mode ───── */}
          {mode === "docCreate" && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => router.back()}
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="flex-1 truncate text-left">
                <motion.div
                  key="new-document"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="truncate text-left"
                >
                  <TypographyBody>New Document</TypographyBody>
                </motion.div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => setIsLibraryDrawerOpen(true)}
              >
                <Library className="h-6 w-6" />
              </Button>
            </>
          )}
        </PageContainer>
      </header>

      <LibraryDrawer />
    </>
  );
}
