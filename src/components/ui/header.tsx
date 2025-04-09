"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyHeading3 } from "@/components/ui/typography";
import { SearchInput } from "./search-input";

// Either both searchValue + setSearchValue are provided, or neither
type HeaderProps =
  | {
      searchValue: string;
      setSearchValue: (value: string) => void;
    }
  | Record<string, never>;

export default function Header(props: HeaderProps) {
  const hasSearch = "searchValue" in props && "setSearchValue" in props;

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-safe-top">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-2 px-4 min-w-0 overflow-hidden">
        {hasSearch ? (
          <>
            {/* Mobile Search Bar */}
            <SearchInput
              value={props.searchValue}
              onChange={props.setSearchValue}
              onCancel={() => {
                props.setSearchValue("");
              }}
            />
          </>
        ) : (
          <>
            {/* Default Header: Brand and Search Button */}
            <Link href="/library" className="truncate text-center">
              <TypographyHeading3>YogaBlocks</TypographyHeading3>
            </Link>

            <div className="flex-1" />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
              onClick={() => {
                // TODO: Add mobile search toggle behavior
              }}
            >
              <Search className="h-5 w-5" />
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
