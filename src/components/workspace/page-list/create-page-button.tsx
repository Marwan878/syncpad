import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type CreatePageButtonProps = {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CreatePageButton({
  setIsAddModalOpen,
}: Readonly<CreatePageButtonProps>) {
  return (
    <button
      className="bg-white border border-gray-200 rounded-lg p-2 h-40 w-35 flex items-center justify-center hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => setIsAddModalOpen(true)}
      aria-label="Create Page"
      title="Create Page"
    >
      <Plus className="w-16 h-16" aria-hidden />
    </button>
  );
}
