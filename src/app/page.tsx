import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="p-8 space-y-4">
      {/* Tailwind Test */}
      <div className="bg-red-500 text-white p-4 rounded-lg">
        ✅ Tailwind is working
      </div>

      {/* Shadcn Button Test */}
      <Button variant="default" className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create Asana
      </Button>

      {/* Info Text */}
      <p className="text-muted-foreground text-sm">
        You should see a red box, a styled button, and a plus icon. If you do,
        you’re all set.
      </p>
    </main>
  );
}
