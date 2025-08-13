"use client";

// --- Icons ---
import { ChevronDownIcon } from "@/components/tiptap-icons/chevron-down-icon";
import { Clipboard, FileText, Share } from "lucide-react";

// --- UI Primitives ---
import { Button, ButtonGroup } from "@/components/tiptap-ui-primitive/button";
import { Card, CardBody } from "@/components/tiptap-ui-primitive/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/tiptap-ui-primitive/dropdown-menu";

// --- React ---
import * as React from "react";

// --- Types ---
import { Editor } from "@tiptap/react";

// --- Hooks ---
import { useTiptapEditor } from "@/hooks/use-tiptap-editor";
import { toast } from "react-hot-toast";

// --- Utils ---
import jsPDF from "jspdf";

type ShareDropdownMenuProps = {
  pageTitle: string;
  portal: boolean;
  providedEditor: Editor;
};

const ShareDropdownMenu = ({
  pageTitle,
  portal,
  providedEditor,
}: Readonly<ShareDropdownMenuProps>) => {
  const { editor } = useTiptapEditor(providedEditor);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOpenChange = React.useCallback(
    (open: boolean) => {
      if (!editor) return;
      setIsOpen(open);
    },
    [editor]
  );

  const EXPORT_ITEMS = [
    {
      label: "Download as PDF",
      icon: <FileText className="tiptap-button-icon" />,
      onClick: ({
        node,
        filename,
      }: {
        node: HTMLElement;
        filename: string;
      }) => {
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });

        pdf.html(node, {
          callback: (doc) => {
            doc.save(`${filename}.pdf`);
          },
          x: 10,
          y: 10,
          html2canvas: {
            scale: 2,
            scrollY: -window.scrollY,
          },
          windowWidth: node.scrollWidth,
        });
      },
    },
    {
      label: "Copy Link (Don't forget to give access to others)",
      icon: <Clipboard className="tiptap-button-icon" />,
      onClick: async () => {
        try {
          await navigator.clipboard.writeText(window.location.href);
          toast.success("Link copied to clipboard.");
        } catch (error) {
          console.error(error);
          toast.error(
            "Failed to copy link, please check your browser settings."
          );
        }
      },
    },
  ] as const;

  return (
    <DropdownMenu modal open={isOpen} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          data-style="ghost"
          role="button"
          tabIndex={-1}
          aria-label="Export page"
          tooltip="Export"
        >
          <Share className="tiptap-button-icon" />
          <ChevronDownIcon className="tiptap-button-dropdown-small" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" portal={portal}>
        <Card>
          <CardBody>
            <ButtonGroup className="">
              {EXPORT_ITEMS.map((item) => (
                <DropdownMenuItem key={item.label} asChild>
                  <Button
                    type="button"
                    data-style="ghost"
                    role="button"
                    onClick={() =>
                      item.onClick({
                        node: providedEditor.view.dom,
                        filename: pageTitle,
                      })
                    }
                    className="justify-start! gap-x-2!"
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Button>
                </DropdownMenuItem>
              ))}
            </ButtonGroup>
          </CardBody>
        </Card>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ShareDropdownMenu;
