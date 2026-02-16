"use client";

import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

// --- Tiptap Core Extensions ---
import { BubbleMenu } from "@tiptap/extension-bubble-menu";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { TextStyle } from "@tiptap/extension-text-style";

import { EnhancedImage } from "@/components/tiptap-extension/enhanced-image-extension";
import { NodeAlignment } from "@/components/tiptap-extension/node-alignment-extension";
import { NodeBackground } from "@/components/tiptap-extension/node-background-extension";

import { TableHandleExtension } from "@/components/tiptap-node/table-node/extensions/table-handle";
import { TableKit } from "@/components/tiptap-node/table-node/extensions/table-node-extension";

import { TableCellHandleMenu } from "@/components/tiptap-node/table-node/ui/table-cell-handle-menu";
import { TableExtendRowColumnButtons } from "@/components/tiptap-node/table-node/ui/table-extend-row-column-button";
import { TableHandle } from "@/components/tiptap-node/table-node/ui/table-handle/table-handle";
import { TableSelectionOverlay } from "@/components/tiptap-node/table-node/ui/table-selection-overlay";
import { TableTriggerButton } from "@/components/tiptap-node/table-node/ui/table-trigger-button";

// --- Tiptap Node ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// Import required styles
import "@/components/tiptap-node/table-node/styles/prosemirror-table.scss";
import "@/components/tiptap-node/table-node/styles/table-node.scss";

// --- Tiptap UI ---
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
  ColorHighlightPopover,
  ColorHighlightPopoverButton,
  ColorHighlightPopoverContent,
} from "@/components/tiptap-ui/color-highlight-popover";
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import {
  LinkButton,
  LinkContent,
  LinkPopover,
} from "@/components/tiptap-ui/link-popover";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useWindowSize } from "@/hooks/use-window-size";

// --- Components ---
import { ThemeToggle } from "@/components/edit-crafter/theme-toggle";

// --- Lib ---
import { cn, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import "./editor.scss";

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  imageUploaderConfig,
}: {
  onHighlighterClick: () => void;
  onLinkClick: () => void;
  isMobile: boolean;
  imageUploaderConfig?: EditCrafterProps["imageUploaderConfig"];
}) => {
  const { editor } = useTiptapEditor();
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action="undo" />
        <UndoRedoButton action="redo" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu levels={[1, 2, 3, 4]} portal={isMobile} />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
        />
        <BlockquoteButton />
        <CodeBlockButton />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="bold" />
        <MarkButton type="italic" />
        <MarkButton type="strike" />
        <MarkButton type="code" />
        <MarkButton type="underline" />
        {!isMobile ? (
          <ColorHighlightPopover />
        ) : (
          <ColorHighlightPopoverButton onClick={onHighlighterClick} />
        )}
        {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <MarkButton type="superscript" />
        <MarkButton type="subscript" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <TextAlignButton align="left" />
        <TextAlignButton align="center" />
        <TextAlignButton align="right" />
        <TextAlignButton align="justify" />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        {imageUploaderConfig?.enabledefault ? (
          <ImageUploadButton text="Add" />
        ) : (
          imageUploaderConfig?.CustomToolbarButton && (
            <imageUploaderConfig.CustomToolbarButton
              addImage={(url: string) => {
                editor?.chain().focus().setImage({ src: url }).run();
              }}
            />
          )
        )}
        <div className="toolbar">
          <TableTriggerButton />
        </div>
      </ToolbarGroup>

      <Spacer />

      {isMobile && <ToolbarSeparator />}

      <ToolbarGroup>
        <ThemeToggle />
      </ToolbarGroup>
    </>
  );
};
const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link";
  onBack: () => void;
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
);

export type ImageUploaderType =
  | {
      enabledefault: true;
      CustomToolbarButton?: React.ComponentType<{
        addImage: (file: string) => void;
      }>;
      defaultUploadHandler: (
        file: File,
        onProgress?: (event: { progress: number }) => void,
        abortSignal?: AbortSignal
      ) => Promise<string>;
    }
  | {
      enabledefault?: false;
      CustomToolbarButton: React.ComponentType<{
        addImage: (file: string) => void;
      }>;
      defaultUploadHandler?: undefined;
    };

export type EditCrafterProps = {
  initialValue?: string;
  onContentChange?: (value: string) => void;
  imageUploaderConfig?: ImageUploaderType;
  placeholder?: string;
  classNames?: {
    wrapper?: string;
    content?: string;
  };
};

export function EditCrafter({
  initialValue,
  onContentChange,
  imageUploaderConfig,
  placeholder,
  classNames: { wrapper: wrapperClassName, content: contentClassName } = {},
}: EditCrafterProps) {
  const isMobile = useIsBreakpoint();
  const { height } = useWindowSize();
  const [mobileView, setMobileView] = useState<"main" | "highlighter" | "link">(
    "main"
  );
  const [toolbarHeight, setToolbarHeight] = useState(0);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onContentChange?.(html);
    },

    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "prose",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      TableKit.configure({
        table: {
          resizable: true, // Enable column resizing
        },
      }),
      TableHandleExtension,
      NodeAlignment,
      NodeBackground, // For cell background colors
      TextStyle, // For text styling
      Highlight.configure({ multicolor: true }), // For highlighting
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      BubbleMenu,
      EnhancedImage,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ...(imageUploaderConfig?.enabledefault
        ? [
            ImageUploadNode.configure({
              accept: "image/*",
              maxSize: MAX_FILE_SIZE,
              limit: 3,
              upload: imageUploaderConfig.defaultUploadHandler,
              onError: (error) => console.error("Upload failed:", error),
            }),
          ]
        : []),
    ],
    content: initialValue?.trim() || "",
  });

  useLayoutEffect(() => {
    if (!toolbarRef.current) return;

    const updateHeight = () => {
      setToolbarHeight(toolbarRef.current!.getBoundingClientRect().height);
    };

    updateHeight();

    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(toolbarRef.current);

    return () => resizeObserver.disconnect();
  }, []);
  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarHeight,
  });

  useEffect(() => {
    if (!(!isMobile && mobileView !== "main")) {
      return;
    }
    const timer = setTimeout(() => {
      setMobileView("main");
    }, 300);
    return () => clearTimeout(timer);
  }, [isMobile, mobileView]);

  useEffect(() => {
    return () => {
      editor?.destroy();
    };
  }, [editor]);
  return (
    <div
      className={cn("editcrafter prose editcrafter-wrapper", wrapperClassName)}
    >
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
              imageUploaderConfig={imageUploaderConfig}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>
        {/* Add table button to your toolbar */}

        <EditorContent
          editor={editor}
          role="presentation"
          placeholder={placeholder || "Start writing here..."}
          className={cn("editcrafter-content prose", contentClassName)}
        />
        {/* Add these components outside EditorContent for proper positioning */}
        <TableHandle />
        <TableSelectionOverlay
          showResizeHandles={true}
          cellMenu={(props) => (
            <TableCellHandleMenu
              editor={props.editor}
              onMouseDown={(e) => props.onResizeStart?.("br")(e)}
            />
          )}
        />
        <TableExtendRowColumnButtons />
      </EditorContext.Provider>
    </div>
  );
}
