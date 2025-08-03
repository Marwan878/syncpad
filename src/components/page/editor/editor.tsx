import { UploadDropzone, useUploadThing } from "@/lib/uploadthing";
import { EditorContent, Editor as EditorType } from "@tiptap/react";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmDeleteTableModal from "./confirm-delete-table-modal";
import ProgressToast from "./progress-toast";
import TextOptionsBar from "./text-options-bar";

type EditorProps = {
  editor: EditorType;
  confirmDeleteTableOpen: boolean;
  setConfirmDeleteTableOpen: Dispatch<SetStateAction<boolean>>;
  textOptionsBarVisible: boolean;
};

export default function Editor({
  editor,
  confirmDeleteTableOpen,
  setConfirmDeleteTableOpen,
  textOptionsBarVisible,
}: Readonly<EditorProps>) {
  const [uploadZoneVisible, setUploadZoneVisible] = useState(false);

  const { current: failedUploadsImagesIds } = useRef<Set<string>>(new Set());

  const { startUpload } = useUploadThing("imageUploader", {
    onUploadBegin: (fileName) => {
      toast.custom(() => <ProgressToast progress={0} />, {
        id: "upload-progress",
        duration: Infinity,
      });

      // Insert a paragraph if the cursor is not in an empty block
      const { selection, doc } = editor.state;
      const $from = doc.resolve(selection.from);
      const node = $from.parent;

      if (node.textContent !== "") {
        editor.commands.insertContent({ type: "paragraph" });
      }

      // Display a placeholder while the image uploads
      editor.commands.insertContent({
        type: "skeleton",
        attrs: { id: fileName },
      });

      // TODO: Add a paragraph after the skeleton
      // editor.commands.insertContent({ type: "paragraph" });
    },

    onClientUploadComplete: (uploadedImagesData) => {
      toast.dismiss("upload-progress");
      toast.success("Upload Completed.");

      // TODO: Allow users to retry uploading the image if upload fails
      uploadedImagesData.forEach((image) => {
        editor.commands.command(({ tr, state }) => {
          state.doc.descendants((node, pos) => {
            if (node.type.name === "skeleton") {
              tr.setNodeMarkup(pos, editor.schema.nodes.image, {
                src: image.ufsUrl,
                alt: "Uploading...",
              });
            }
          });
          return true;
        });
      });
    },

    onUploadProgress(p) {
      toast.custom(() => <ProgressToast progress={p} />, {
        id: "upload-progress",
        duration: Infinity,
      });
    },

    onUploadError(error) {
      toast.dismiss("upload-progress");
      toast.error("Upload Failed, please try again.");

      editor.commands.command(({ tr, state }) => {
        state.doc.descendants((node, pos) => {
          if (
            node.type.name === "skeleton" &&
            failedUploadsImagesIds.has(node.attrs.id)
          ) {
            tr.delete(pos, pos + node.nodeSize);
            failedUploadsImagesIds.delete(node.attrs.id);
          }
        });
        return true;
      });

      console.error(error);
    },
  });

  // Drag Counter to solve the issue of dragging flickering (When moving the mouse across
  // children drag enter and leave events are triggered)
  const dragCounter = useRef(0);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevents the browser from opening the dropped file
    e.preventDefault();
  };

  const handleDragEnter = () => {
    dragCounter.current++;
    if (dragCounter.current === 1) {
      setUploadZoneVisible(true);
    }
  };

  const handleDragLeave = () => {
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setUploadZoneVisible(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    // Prevents the browser from opening the dropped file
    e.preventDefault();

    setUploadZoneVisible(false);
  };

  return (
    <div
      className="relative"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <EditorContent editor={editor} className="mt-12 min-h-[1200px]" />
      {confirmDeleteTableOpen && (
        <ConfirmDeleteTableModal
          editor={editor}
          setConfirmDeleteTableOpen={setConfirmDeleteTableOpen}
        />
      )}
      {textOptionsBarVisible && <TextOptionsBar editor={editor} />}
      <UploadDropzone
        className={`absolute inset-0 [&_button]:hidden ${
          uploadZoneVisible ? "block" : "hidden"
        }`}
        endpoint={(routeRegistry) => routeRegistry.imageUploader}
        onChange={async (files) => {
          setUploadZoneVisible(false);

          const newFiles = files.map((file) => {
            const newFile = new File([file], crypto.randomUUID(), {
              type: file.type,
            });

            return newFile;
          });

          for (const file of newFiles) {
            try {
              await startUpload([file]);
            } catch (error) {
              failedUploadsImagesIds.add(file.name);
            }
          }
        }}
      />
    </div>
  );
}
