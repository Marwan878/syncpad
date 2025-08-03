import { Button } from "@/components/ui";
import { Plus } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type CreatePageButtonProps = {
  setIsAddModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function CreatePageButton({
  setIsAddModalOpen,
}: Readonly<CreatePageButtonProps>) {
  return (
    <Button
      variant="primary"
      className="flex items-center gap-2"
      onClick={() => setIsAddModalOpen(true)}
    >
      <Plus className="w-4 h-4" aria-hidden />
      <span>Create Page</span>
    </Button>
  );
}
