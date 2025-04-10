"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type HeaderMode = "library" | "docView" | "docEdit";

interface HeaderContextType {
  mode: HeaderMode;
  setMode: (mode: HeaderMode) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<HeaderMode>("docView");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <HeaderContext.Provider
      value={{
        mode,
        setMode,
        isSearchOpen,
        setIsSearchOpen,
        searchValue,
        setSearchValue,
      }}
    >
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
