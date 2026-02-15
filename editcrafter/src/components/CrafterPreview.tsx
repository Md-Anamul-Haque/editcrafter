import { cn } from "@/lib/tiptap-utils";
import parse from "html-react-parser";
import { type FC } from "react";

export type CrafterPreviewProps = {
  value: string;
  className?: string;
};

const CrafterPreview: FC<CrafterPreviewProps> = ({ value, className }) => {
  return (
    <div
      className={cn(
        "editcrafter flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
        className
      )}
    >
      {parse(value)}
    </div>
  );
};

export { CrafterPreview };
