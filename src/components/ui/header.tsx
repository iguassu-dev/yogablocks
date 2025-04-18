// src/components/ui/header.tsx

// When in library mode and isSearchOpen = false, Show brand title + search icon
// When in library mode and isSearchOpen = true, Show full search input
// When in docView mode, Show brand title
// When in docEdit mode, Show "Editing..." title

"use client";

import Link from "next/link";
import { Search, ArrowLeft, Library, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyBody, TypographyHeading3 } from "@/components/ui/typography";
import { useHeader } from "@/hooks/useHeader";
import { SearchInput } from "@/components/ui/search-input";
import { LibraryDrawer } from "@/components/drawer/library-drawer";
import { PageContainer } from "@/components/layouts/page-container";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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

          {/* ───── Doc View Mode ───── */}
          {mode === "docView" && (
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
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
              >
                <MoreVertical className="h-6 w-6" />
              </Button>
            </>
          )}

          {/* ───── Doc Edit Mode ───── */}
          {mode === "docEdit" && (
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
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => setIsLibraryDrawerOpen(true)}
              >
                <Library className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => console.log("Open More Options Menu")}
              >
                <MoreVertical className="h-6 w-6" />
              </Button>
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
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 h-10 w-10"
                onClick={() => console.log("Open More Options Menu")}
              >
                <MoreVertical className="h-6 w-6" />
              </Button>
            </>
          )}
        </PageContainer>
      </header>
      <LibraryDrawer />
    </>
  );
}
