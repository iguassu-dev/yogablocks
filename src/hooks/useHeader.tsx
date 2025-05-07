// src/hooks/useHeader.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { usePathname } from "next/navigation";

export type HeaderContextType = {
  mode: "library" | "docView" | "docEdit" | "docCreate";
  setMode: (mode: HeaderContextType["mode"]) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  searchValue: string;
  setSearchValue: (value: string) => void;

  title: string;
  setTitle: (title: string) => void;

  isLibraryDrawerOpen: boolean;
  setIsLibraryDrawerOpen: (open: boolean) => void;

  backToLibrary: boolean;
  setBackToLibrary: (val: boolean) => void;

  // Save handler (e.g. your "Save" button)
  onSave: () => void;
  setOnSave: (fn: () => void) => void;

  // Link-insertion handler for your Library Drawer
  onInsertLink: (doc: { id: string; title: string }) => void;
  setOnInsertLink: (fn: (doc: { id: string; title: string }) => void) => void;
};

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  // ────────────────────────────────────────────────────────────────────
  // 1) Local state for each piece of context                        ⬇
  // ────────────────────────────────────────────────────────────────────
  const [mode, setMode] = useState<HeaderContextType["mode"]>("library");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [title, setTitle] = useState("YogaBlocks");
  const [isLibraryDrawerOpen, setIsLibraryDrawerOpen] = useState(false);
  const [backToLibrary, setBackToLibrary] = useState(false);

  // onSave callback (registered by DocEditor)
  const [onSave, _setOnSave] = useState<() => void>(() => () => {});
  // onInsertLink callback (registered by DocEditor)
  const [onInsertLink, _setOnInsertLink] = useState<
    (doc: { id: string; title: string }) => void
  >(() => () => {});

  // ────────────────────────────────────────────────────────────────────
  // 2) Derive `mode` from the pathname                              ⬇
  // ────────────────────────────────────────────────────────────────────
  const pathname = usePathname();
  useEffect(() => {
    if (pathname.startsWith("/library/edit/")) setMode("docEdit");
    else if (pathname.startsWith("/library/create")) setMode("docCreate");
    else if (
      pathname.startsWith("/library/") &&
      pathname.split("/").length === 3
    )
      setMode("docView");
    else setMode("library");
  }, [pathname]);

  // ────────────────────────────────────────────────────────────────────
  // 3) Stabilize your setters with `useCallback` so they never change⬇
  // ────────────────────────────────────────────────────────────────────
  const setOnSave = useCallback((fn: () => void) => {
    _setOnSave(() => fn);
  }, []);

  const setOnInsertLink = useCallback(
    (fn: (doc: { id: string; title: string }) => void) => {
      _setOnInsertLink(() => fn);
    },
    []
  );

  // ────────────────────────────────────────────────────────────────────
  // 4) Memoize the entire context `value` so it only updates on real changes
  // ────────────────────────────────────────────────────────────────────
  const value = useMemo<HeaderContextType>(
    () => ({
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
      setBackToLibrary,
      onSave,
      setOnSave,
      onInsertLink,
      setOnInsertLink,
    }),
    [
      mode,
      isSearchOpen,
      searchValue,
      title,
      isLibraryDrawerOpen,
      backToLibrary,
      onSave,
      onInsertLink,
      setOnSave,
      setOnInsertLink,
    ]
  );

  return (
    <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
  );
}

export function useHeader(): HeaderContextType {
  const ctx = useContext(HeaderContext);
  if (!ctx) throw new Error("useHeader must be used within HeaderProvider");
  return ctx;
}
