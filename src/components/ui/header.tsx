// src/components/ui/header.tsx
import Link from "next/link";
import { Menu, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b pt-safe-top">
      <div className="mx-auto flex h-14 max-w-screen-lg items-center gap-2 px-4">
        {/* ───── left: mobile menu button ───── */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* ───── brand / home link ───── */}
        <Link href="/library" className="text-lg font-semibold tracking-tight">
          YogaBlocks
        </Link>

        <div className="flex-1" />

        {/* ───── desktop search ───── */}
        <div className="hidden w-full max-w-sm md:block">
          <Input
            type="search"
            placeholder="Search asanas…"
            className="w-full"
          />
        </div>

        {/* ───── mobile search icon ───── */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </Button>

        {/* ───── user / avatar button (stub) ───── */}
        <Button variant="ghost" size="icon" aria-label="Account">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
}
