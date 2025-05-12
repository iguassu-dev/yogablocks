// src/components/ui/search-input.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
  onCancel,
  className = "",
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`flex items-center gap-2 w-full px-4 py-2 ${className}`}>
      {/* ───── Search Field ───── */}
      <div className="relative flex-1">
        <Input
          ref={inputRef}
          type="text"
          value={value}
          placeholder="Search..."
          onChange={(e) => onChange(e.target.value)}
        />
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
      <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
