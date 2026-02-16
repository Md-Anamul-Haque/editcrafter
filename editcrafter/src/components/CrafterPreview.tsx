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
        "editcrafter editcrafter-wrapper editcrafter-content prose ",
        className
      )}
    >
      <div className=" tiptap ProseMirror editcrafter ">{parse(value)}</div>
    </div>
  );
};

export { CrafterPreview };
