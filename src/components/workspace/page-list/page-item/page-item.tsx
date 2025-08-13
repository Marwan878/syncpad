import { Button } from "@/components/ui";
import formatDateString from "@/lib/utils/formatDateString";
import { Page } from "@/types/page";
import { Clock, FileText, Trash2 } from "lucide-react";
import Link from "next/link";
import { Dispatch, SetStateAction } from "react";

type PageItemProps = {
  page: Page;
  index: number;
  setIsDeleteModalOpen: Dispatch<SetStateAction<boolean>>;
  setPageToBeDeleted: Dispatch<SetStateAction<Page | null>>;
};

export default function PageItem({
  page,
  index,
  setIsDeleteModalOpen,
  setPageToBeDeleted,
}: Readonly<PageItemProps>) {
  return (
    <div className="flex flex-col gap-y-2 items-center">
      <Link
        href={`/workspaces/${page.workspace_id}/pages/${page.id}`}
        className={`flex flex-col gap-y-4 items-center relative`}
      >
        <div className="flex items-center justify-center w-35 h-40 cursor-pointer bg-white hover:shadow-sm transition-all duration-200 rounded-lg border border-gray-200 p-4">
          <FileText className="w-16 h-16" aria-hidden />
        </div>
        <p className="font-bold text-xl">{page.title}</p>

        <Button
          variant="icon"
          className="absolute top-2 right-2 hover:text-state-error hover:bg-state-error-light"
          size="sm"
          onClick={(e) => {
            e.preventDefault();
            setPageToBeDeleted(page);
            setIsDeleteModalOpen(true);
          }}
        >
          <Trash2 className="w-4 h-4" aria-hidden />
        </Button>
      </Link>
      <div className="text-center flex flex-col items-center">
        {page.updated_at && (
          <div className="flex items-center justify-between text-xs gap-x-1">
            <Clock aria-hidden className="w-4 h-4 mt-1" />
            <p>{`Last updated: ${formatDateString(page.updated_at)}`}</p>
          </div>
        )}
        <p className="font-semibold text-lg">{index + 1}</p>
      </div>
    </div>
  );
}
