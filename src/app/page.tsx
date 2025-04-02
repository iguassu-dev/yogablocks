import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Home() {
  return (
    <main className="p-4">
      <Button className="flex items-center gap-2">
        <Plus className="w-4 h-4" />
        Create
      </Button>
    </main>
  );
}
