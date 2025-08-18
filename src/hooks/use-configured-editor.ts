// --- Tiptap Core Extensions ---
import { Collaboration } from "@tiptap/extension-collaboration";
import { Highlight } from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TableKit } from "@tiptap/extension-table";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Selection } from "@tiptap/extensions";
import { StarterKit } from "@tiptap/starter-kit";

// --- Lib ---
import { MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Hooks ---
import { useEditor } from "@tiptap/react";

// --- Components ---
import toast from "react-hot-toast";

// --- Yjs ---
import * as Y from "yjs";

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
import { useEdgeStore } from "@/lib/edgestore";
import { useEffect } from "react";

export default function useConfiguredEditor(ydoc: Y.Doc, canEdit: boolean) {
  const { edgestore } = useEdgeStore();
  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
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
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: async (file, onProgress) => {
          const result = await edgestore.publicFiles.upload({
            file,
            onProgressChange: (progress) => {
              onProgress?.({ progress });
            },
          });

          return result.url;
        },
        onError: () => toast.error("Upload failed, please try again."),
        onSuccess: () => toast.success("Image's been uploaded successfully."),
      }),

      TableKit.configure({
        table: {
          resizable: true,
          cellMinWidth: 100,
          allowTableNodeSelection: true,
        },
      }),
      Collaboration.configure({ document: ydoc }),
    ],
    content: ``,
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(canEdit);
    }
  }, [editor, canEdit]);

  return editor;
}
