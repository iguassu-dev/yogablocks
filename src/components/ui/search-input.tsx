"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
};

export function SearchInput({ value, onChange, onCancel }: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex items-center gap-2 w-full max-w-screen-lg px-4 pt-2 pb-2 mx-auto transition-all duration-300 ease-in-out transform animate-fade-slide">
      {/* ───── Search Field ───── */}
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          placeholder="Search..."
          onChange={(e) => onChange(e.target.value)}
          className="pl-4 pr-10 py-2 rounded-6 border border-input bg-background focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
        />
        {/* ───── Clear (X) Button ───── */}
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ───── Cancel Button ───── */}
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="text-sm font-medium"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
