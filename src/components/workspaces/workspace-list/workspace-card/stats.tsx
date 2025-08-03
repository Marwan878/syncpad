import formatDateString from "@/lib/utils/formatDateString";
import handlePlural from "@/lib/utils/handlePlural";
import { Calendar, FileText } from "lucide-react";

type StatsProps = {
  pagesCount: number;
  updatedAt?: string;
};

export default function Stats({ pagesCount, updatedAt }: Readonly<StatsProps>) {
  return (
    <div className="flex items-center space-x-4 text-sm text-text-secondary">
      <div className="flex items-center space-x-1">
        <FileText className="w-4 h-4" aria-hidden="true" />
        <span>
          {pagesCount > 0
            ? `${pagesCount} ${handlePlural(pagesCount, "page", "pages")}`
            : "No pages yet"}
        </span>
      </div>
      {updatedAt && (
        <div className="flex items-center space-x-1">
          <Calendar className="w-4 h-4" aria-hidden="true" />
          <span>{`Updated ${formatDateString(updatedAt)}`}</span>
        </div>
      )}
    </div>
  );
}
