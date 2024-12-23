import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Arrow } from "@radix-ui/react-tooltip";
import { Editor } from "@tiptap/core";
import { Table, TableOptions } from "@tiptap/extension-table";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";

import {
  mergeAttributes,
  NodeViewContent,
  NodeViewProps,
  NodeViewWrapper,
  ReactNodeViewRenderer,
} from "@tiptap/react";
import { MinusIcon, PlusIcon, TableIcon, TypeIcon } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const CustomTableCell = TableCell.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

const CustomTableRow = TableRow.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "tr",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});

interface TableComponentProps extends NodeViewProps {
  editor: Editor;
}

const TableComponent: React.FC<TableComponentProps> = ({
  node,
  updateAttributes,
  deleteNode,
  editor,
}) => {
  const addColumnBefore = () => editor.chain().focus().addColumnBefore().run();
  const addColumnAfter = () => editor.chain().focus().addColumnAfter().run();
  const deleteColumn = () => editor.chain().focus().deleteColumn().run();
  const addRowBefore = () => editor.chain().focus().addRowBefore().run();
  const addRowAfter = () => editor.chain().focus().addRowAfter().run();
  const deleteRow = () => editor.chain().focus().deleteRow().run();
  const toggleHeaderRow = () =>
    updateAttributes({ withHeaderRow: !node.attrs.withHeaderRow });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const tableRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tableRef.current &&
        !tableRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTableClick = useCallback(() => {
    setIsPopoverOpen(true);
  }, []);
  return (
    <NodeViewWrapper
      className="table_wp"
      ref={tableRef}
      onClick={handleTableClick}
    >
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <div className="wp-table-popover-trigger" />
        </PopoverTrigger>
        <PopoverContent
          // sideOffset={-90}
          side="top"
          className="wp-table-popover h-10 w-full p-0"
          // align="start"
        >
          <TooltipProvider>
            <div className="flex gap-1 px-3 ring h-10 w-full overflow-auto">
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    onClick={toggleHeaderRow}
                  >
                    <TypeIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Header</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    onClick={addColumnBefore}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Col Before</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    onClick={addColumnAfter}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p> Col After</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    variant="destructive"
                    onClick={deleteColumn}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Col</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    onClick={addRowBefore}
                  >
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Row Before</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button size="icon" className="w-8 h-8" onClick={addRowAfter}>
                    <PlusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Row After</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    className="w-8 h-8"
                    variant="destructive"
                    onClick={deleteRow}
                  >
                    <MinusIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Row</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="w-8 h-8"
                    onClick={deleteNode}
                  >
                    <TableIcon className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Delete Table</p>
                  <Arrow className="fill-purple-500" />
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </PopoverContent>
      </Popover>
      <NodeViewContent as="table" className="table_wp" tabIndex={0} />
    </NodeViewWrapper>
  );
};

interface CustomTableOptions extends TableOptions {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  HTMLAttributes: Record<string, any>;
}

export const CustomTable = Table.extend<CustomTableOptions>({
  addAttributes() {
    return {
      ...this.parent?.(),
      withHeaderRow: {
        default: true,
        parseHTML: (element) => element.querySelector("thead") !== null,
        renderHTML: (attributes) => {
          if (!attributes.withHeaderRow) {
            return {};
          }
          return {};
        },
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(TableComponent, {
      contentDOMElementTag: "tbody",
    });
  },
});

export { CustomTableCell, CustomTableRow, TableHeader };
