import * as React from "react";
import "./styles/index.css";

import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Content, Editor } from "@tiptap/react";
import { EditorContent } from "@tiptap/react";
import { LinkBubbleMenu } from "./components/bubble-menu/link-bubble-menu";
import { MeasuredContainer } from "./components/measured-container";
import { SectionFive } from "./components/section/five";
import { SectionFour } from "./components/section/four";
import { SectionOne } from "./components/section/one";
import SectionSix from "./components/section/six";
import { SectionThree } from "./components/section/three";
import { SectionTwo } from "./components/section/two";
import { CustomImageUploaderType, ToolbarProvider } from "./context/toolBarContext";
import type { UseEditCrafterEditorProps } from "./hooks/use-editCrafter";
import { useEditCrafterEditor } from "./hooks/use-editCrafter";

export interface EditCrafterProps
  extends Omit<UseEditCrafterEditorProps, "onUpdate"> {
  value?: Content;
  onChange?: (value: Content) => void;
  className?: string;
  editorContentClassName?: string;
  CustomImageUploader?: CustomImageUploaderType;
}

const Toolbar = ({ editor }: { editor: Editor }) => (
  <div className="shrink-0 overflow-x-auto border-b border-border p-2">
    <div className="flex w-max items-center gap-px">
      <SectionOne editor={editor} activeLevels={[1, 2, 3, 4, 5, 6]} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionTwo
        editor={editor}
        activeActions={[
          "bold",
          "italic",
          "underline",
          "strikethrough",
          "code",
          "clearFormatting",
        ]}
        mainActionCount={3}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionThree editor={editor} />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFour
        editor={editor}
        activeActions={["orderedList", "bulletList"]}
        mainActionCount={0}
      />

      <Separator orientation="vertical" className="mx-2 h-7" />

      <SectionFive
        editor={editor}
        activeActions={["codeBlock", "blockquote", "horizontalRule"]}
        mainActionCount={0}
      />
      <SectionSix editor={editor} />
    </div>
  </div>
);

export const EditCrafterEditor = React.forwardRef<
  HTMLDivElement,
  EditCrafterProps
>(({ value, onChange, className, CustomImageUploader, editorContentClassName, ...props }, ref) => {
  const editor = useEditCrafterEditor({
    value,
    onUpdate: onChange,
    ...props,
  });

  if (!editor) {
    return null;
  }

  return (
    <TooltipProvider>
      <MeasuredContainer
        as="div"
        name="editor"
        ref={ref}
        className={cn(
          "flex h-auto min-h-72 w-full flex-col rounded-md border border-input shadow-sm focus-within:border-primary",
          className
        )}
      >
        <ToolbarProvider CustomImageUploader={CustomImageUploader}>
          <Toolbar editor={editor} />
        </ToolbarProvider>
        <EditorContent
          editor={editor}
          className={cn("editcrafter edit-crafter", editorContentClassName)}
        />
        <LinkBubbleMenu editor={editor} />
      </MeasuredContainer>
    </TooltipProvider>
  );
});

EditCrafterEditor.displayName = "EditCrafterEditor";

export default EditCrafterEditor;
