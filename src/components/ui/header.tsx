import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TypographyHeading3 } from "@/components/ui/typography";
import { SearchInput } from "./search-input";

type HeaderProps = {
  searchValue?: string;
  setSearchValue?: (value: string) => void;
};

export default function Header({ searchValue, setSearchValue }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-safe-top">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-2 px-4 min-w-0 overflow-hidden">
        {searchValue !== undefined && setSearchValue !== undefined ? (
          <>
            {/* 🆕 Mobile search bar */}
            <SearchInput
              value={searchValue || ""}
              onChange={setSearchValue || (() => {})}
              onCancel={() => {
                setSearchValue?.("");
                // Optionally: you might want to navigate or reset something here later
              }}
            />
          </>
        ) : (
          <>
            {/* 🧹 Default Header: Brand and Search Button */}
            <Link href="/library" className="truncate text-center">
              <TypographyHeading3>YogaBlocks</TypographyHeading3>
            </Link>

            <div className="flex-1" />

            {/* Mobile search icon */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Search"
              onClick={() => {
                // Maybe later toggle mobile search open
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
