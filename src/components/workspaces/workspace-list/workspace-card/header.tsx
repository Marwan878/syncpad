import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

type HeaderProps = {
  name: string;
  description?: string;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Header({
  name,
  description,
  setIsDeleteModalOpen,
}: Readonly<HeaderProps>) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-text-primary truncate">
          {name}
        </h3>
        {description && (
          <p className="text-sm text-text-secondary mt-1 line-clamp-2">
            {description}
          </p>
        )}
      </div>

      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="p-2 rounded-md text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 disabled:opacity-50 shrink-0"
        aria-label="Delete workspace"
      >
        <Trash2 className="w-5 h-5" aria-hidden="true" />
      </button>
    </div>
  );
}
