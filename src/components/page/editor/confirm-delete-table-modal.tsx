import {
  Modal,
  ModalBody,
  ModalButton,
  ModalFooter,
} from "@/components/ui/modal";
import { Editor } from "@tiptap/react";
import { Dispatch, SetStateAction } from "react";

type ConfirmDeleteTableModalProps = {
  editor: Editor;
  setConfirmDeleteTableOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ConfirmDeleteTableModal({
  editor,
  setConfirmDeleteTableOpen,
}: Readonly<ConfirmDeleteTableModalProps>) {
  return (
    <Modal
      title="Confirm Delete Table"
      onClose={() => setConfirmDeleteTableOpen(false)}
    >
      <ModalBody>
        <p>
          Are you sure you want to delete this table? This action cannot be
          undone.
        </p>
      </ModalBody>
      <ModalFooter>
        <ModalButton
          onClick={() => setConfirmDeleteTableOpen(false)}
          variant="primary"
        >
          Cancel
        </ModalButton>

        <ModalButton
          onClick={() => {
            editor.chain().focus().deleteTable().run();
            setConfirmDeleteTableOpen(false);
          }}
          variant="danger"
        >
          Delete
        </ModalButton>
      </ModalFooter>
    </Modal>
  );
}
