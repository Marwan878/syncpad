import useClickOutside from "@/hooks/use-click-outside";
import { Trash2, Users } from "lucide-react";
import { useRef } from "react";

type OptionMenuProps = {
  onClose: () => void;
  onDeleteButtonClick: () => void;
  onManageAccessButtonClick: () => void;
};

export default function OptionsMenu({
  onClose,
  onDeleteButtonClick,
  onManageAccessButtonClick,
}: Readonly<OptionMenuProps>) {
  const menuRef = useRef<HTMLUListElement>(null);
  useClickOutside(menuRef, onClose);

  return (
    <ul
      ref={menuRef}
      className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 px-2 py-2 space-y-1"
    >
      <li>
        <button
          onClick={onManageAccessButtonClick}
          className="w-full h-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-background-muted transition-all duration-200 rounded-md flex items-center gap-2"
        >
          <Users className="w-5 h-5" aria-hidden="true" />
          <span>Manage Access</span>
        </button>
      </li>
      <li>
        <button
          onClick={onDeleteButtonClick}
          className="w-full h-full px-3 py-2 text-left text-sm text-gray-700 hover:text-red-500 hover:bg-red-50 transition-all duration-200 rounded-md flex items-center gap-2"
        >
          <Trash2 className="w-5 h-5" aria-hidden="true" />
          <span>Delete Workspace</span>
        </button>
      </li>
    </ul>
  );
}
