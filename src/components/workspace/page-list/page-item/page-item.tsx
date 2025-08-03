import formatDateString from "@/lib/utils/formatDateString";
import { Page } from "@/types/page";
import { Clock, FileText } from "lucide-react";
import Link from "next/link";

type PageItemProps = {
  page: Page;
};

export default function PageItem({ page }: Readonly<PageItemProps>) {
  return (
    <Link
      href={`/pages/${page.id}`}
      className={`flex flex-col gap-y-4 items-center`}
    >
      <div className="flex items-center justify-center w-35 h-40 cursor-pointer bg-white hover:shadow-sm transition-all duration-200 rounded-lg border border-gray-200 p-4">
        <FileText className="w-16 h-16" aria-hidden />
      </div>
      <div className="text-center flex flex-col items-center">
        <p>{page.title}</p>
        {page.updated_at && (
          <div className="flex items-center justify-between">
            <Clock aria-hidden className="w-8 h-8" />
            <p>{`Last updated: ${formatDateString(page.updated_at)}`}</p>
          </div>
        )}
        <p className="font-bold text-2xl">{page.order}</p>
      </div>
    </Link>
  );
}
