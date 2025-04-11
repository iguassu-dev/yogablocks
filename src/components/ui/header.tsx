// When in library mode and isSearchOpen = false, Show brand title + search icon
// When in library mode and isSearchOpen = true, Show full search input
// When in docView mode, Show brand title
// When in docEdit mode, Show "Editing..." title

"use client";

import Link from "next/link";
import { Search, ArrowLeft, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyHeading3 } from "@/components/ui/typography";
import { useHeader } from "@/hooks/useHeader";
import { SearchInput } from "@/components/ui/search-input";
import { useRouter } from "next/navigation";
export default function Header() {
  const {
    mode,
    isSearchOpen,
    setIsSearchOpen,
    searchValue,
    setSearchValue,
    title,
  } = useHeader();
  const router = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-safe-top">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-2 px-4 min-w-0 overflow-hidden">
        {/* Handle Library Mode */}
        {mode === "library" && (
          <>
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

                <div className="flex-1" />

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  aria-label="Open search"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </>
            )}
          </>
        )}

        {/* Handle Doc View Mode */}
        {mode === "docView" && (
          <>
            {/* Back button */}
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            {/* Title */}
            <div className="flex-1 truncate text-center">
              <TypographyHeading3>{title}</TypographyHeading3>
            </div>

            {/* Options ("...") button */}
            <Button variant="ghost" size="icon" className="shrink-0">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Handle Doc Edit Mode */}
        {mode === "docEdit" && (
          <Link href="/library" className="truncate text-center">
            <TypographyHeading3>Editing...</TypographyHeading3>
          </Link>
        )}
      </div>
    </header>
  );
}
