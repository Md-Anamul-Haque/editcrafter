import GridSelector from "@/components/GridSelector";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Editor } from "@tiptap/core";
import { Table } from "lucide-react";
import React from "react";

type SectionSixProps = {
  editor: Editor;
};

const SectionSix: React.FC<SectionSixProps> = ({ editor }) => {
  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Toggle
            className={cn("size-8 p-0", {
              "bg-accent": editor.isActive("table"),
            })}
          >
            <Table />
          </Toggle>
        </PopoverTrigger>
        <PopoverContent align="start">
          <GridSelector
            onSelect={({ rows, cols }) => {
              editor.chain().focus().insertTable({ rows, cols }).run();
            }}
          />
        </PopoverContent>
      </Popover>
    </>
  );
};

export default SectionSix;
