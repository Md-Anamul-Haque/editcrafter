import { cn } from "@/lib/utils";
import parse from "html-react-parser";
import { FC } from "react";
import { MeasuredContainer } from "./components/measured-container";
import "./styles/index.css";

export type CrafterPreviewProps = {
  value: string;
  className?: string;
};

const CrafterPreview: FC<CrafterPreviewProps> = ({ value, className }) => {
  return (
    <MeasuredContainer
      as="div"
      name="editor-preview"
      className={cn(
        "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
        className
      )}
    >
      <div className={cn("editcrafter", className)}>{parse(value)}</div>
    </MeasuredContainer>
  );
};

export { CrafterPreview };

