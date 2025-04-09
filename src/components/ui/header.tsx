"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyHeading3 } from "@/components/ui/typography";
import { SearchInput } from "@/components/ui/search-input"; // new import
import { useState } from "react";

export default function Header() {
  const [searchActive, setSearchActive] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-safe-top">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-2 px-4 min-w-0 overflow-hidden">
        {searchActive ? (
          <>
            {/* ───── Mobile Search Active ───── */}
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              onCancel={() => {
                setSearchValue("");
                setSearchActive(false);
              }}
            />
          </>
        ) : (
          <>
            {/* ───── Normal Header Mode ───── */}
            <Link href="/library" className="truncate text-center">
              <TypographyHeading3>YogaBlocks</TypographyHeading3>
            </Link>

            <div className="flex-1" />

            {/* ───── Desktop Search (hidden for now) ───── */}
            <div className="hidden w-full max-w-sm md:block">
              {/* you can add desktop search input later */}
            </div>

            {/* ───── Mobile Search Icon ───── */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="md:hidden"
              onClick={() => setSearchActive(true)}
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
