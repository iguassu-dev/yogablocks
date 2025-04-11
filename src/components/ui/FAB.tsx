import { cn } from "@/lib/utils";
import { CirclePlus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface FABProps {
  variant: "create" | "edit";
  href: string;
  className?: string;
}

export function FAB({ variant, href, className }: FABProps) {
  const isCreate = variant === "create";

  return (
    <Link
      href={href}
      aria-label={isCreate ? "Create new document" : "Edit document"}
    >
      <Button
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 rounded-6 shadow-lg p-4 h-14 w-14",
          isCreate
            ? "bg-purple-600 hover:bg-purple-700 text-white"
            : "bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-300",
          className
        )}
      >
        {isCreate ? (
          <CirclePlus className="h-6 w-6" />
        ) : (
          <Pencil className="h-6 w-6" />
        )}
      </Button>
    </Link>
  );
}

export default FAB;
