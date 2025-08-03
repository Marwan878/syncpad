import { FileText } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import CreatePageButton from "./create-page-button";
import CreatePageMessage from "./create-page-message";
import ContactOwnerMessage from "./contact-owner-message";

type EmptyMessageProps = {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
  canView: boolean;
  canEdit: boolean;
};

export default function EmptyMessage({
  setIsAddModalOpen,
  canView,
  canEdit,
}: Readonly<EmptyMessageProps>) {
  return (
    <div className="text-center py-12 flex flex-col items-center justify-center">
      <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" aria-hidden />
      <h3 className="text-lg font-medium text-text-primary mb-2">
        No pages yet
      </h3>
      {!canEdit && canView && <ContactOwnerMessage />}
      {canEdit && <CreatePageMessage />}
      {canEdit && <CreatePageButton setIsAddModalOpen={setIsAddModalOpen} />}
    </div>
  );
}
