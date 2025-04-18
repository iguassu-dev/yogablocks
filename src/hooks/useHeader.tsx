// src/hooks/useHeader.tsx

"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// ─────────────────────────────────────────────
// 1. Define TypeScript types for the header context
// ─────────────────────────────────────────────
type HeaderContextType = {
  mode: "library" | "docView" | "docEdit" | "docCreate";
  setMode: (mode: "library" | "docView" | "docEdit" | "docCreate") => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isLibraryDrawerOpen: boolean;
  setIsLibraryDrawerOpen: (isOpen: boolean) => void;

  // ✅ NEW: track whether user landed on detail page from edit
  backToLibrary: boolean;
  setBackToLibrary: (val: boolean) => void;
};

// ─────────────────────────────────────────────
// 2. Create the context (initially undefined)
// ─────────────────────────────────────────────
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// 3. Create the Provider component to wrap the app
// ─────────────────────────────────────────────
export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<HeaderContextType["mode"]>("library");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("YogaBlocks");
  const [isLibraryDrawerOpen, setIsLibraryDrawerOpen] = useState(false);

  // ✅ NEW state to track edit → view nav
  const [backToLibrary, setBackToLibrary] = useState(false);

  const pathname = usePathname();

  // Set mode based on pathname
  useEffect(() => {
    if (pathname.startsWith("/library/edit/")) {
      setMode("docEdit");
    } else if (pathname.startsWith("/library/create")) {
      setMode("docCreate");
    } else if (
      pathname.startsWith("/library/") &&
      pathname.split("/").length === 3
    ) {
      setMode("docView");
    } else {
      setMode("library");
    }
  }, [pathname]);

  return (
    <HeaderContext.Provider
      value={{
        mode,
        setMode,
        isSearchOpen,
        setIsSearchOpen,
        searchValue,
        setSearchValue,
        title,
        setTitle,
        isLibraryDrawerOpen,
        setIsLibraryDrawerOpen,
        backToLibrary,
        setBackToLibrary, // ✅ expose setter
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

// ─────────────────────────────────────────────
// 4. Create a custom hook to consume the context
// ─────────────────────────────────────────────
export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
