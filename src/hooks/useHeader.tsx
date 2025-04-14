"use client";

import { createContext, useContext, useState } from "react";

// ─────────────────────────────────────────────
// 1. Define TypeScript types for the header context
// ─────────────────────────────────────────────
type HeaderContextType = {
  mode: "library" | "docView" | "docEdit";
  setMode: (mode: "library" | "docView" | "docEdit") => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isLibraryDrawerOpen: boolean;
  setIsLibraryDrawerOpen: (isOpen: boolean) => void;
};

// ─────────────────────────────────────────────
// 2. Create the context (initially undefined)
// ─────────────────────────────────────────────
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// ─────────────────────────────────────────────
// 3. Create the Provider component to wrap the app
// ─────────────────────────────────────────────
export function HeaderProvider({ children }: { children: React.ReactNode }) {
  // Define all shared state
  const [mode, setMode] = useState<"library" | "docView" | "docEdit">(
    "library"
  );
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("YogaBlocks");
  const [isLibraryDrawerOpen, setIsLibraryDrawerOpen] = useState(false);

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
