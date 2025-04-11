import {
  TypographyHeading4,
  TypographyCaption,
} from "@/components/ui/typography";
import { Triangle } from "lucide-react"; // placeholder for asana

type DocCardProps = {
  title: string;
  preview: string;
};
export function DocCard({ title, preview }: DocCardProps) {
  return (
    <div className="w-full py-3 flex items-start gap-4">
      {/* Left Icon */}
      <div className="w-10 h-10 flex items-center justify-center">
        <Triangle className="w-5 h-5 text-foreground" />
      </div>

      {/* Title and Preview */}
      <div className="flex-1 flex flex-col items-start gap-0.5">
        <TypographyHeading4 className="w-full">{title}</TypographyHeading4>
        <TypographyCaption className="w-full line-clamp-2 text-muted-foreground">
          {preview}
        </TypographyCaption>
      </div>
    </div>
  );
}
