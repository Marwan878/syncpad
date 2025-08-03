import { FileText } from "lucide-react";

export default function PageCardSkeleton() {
  return (
    <div className="flex flex-col gap-y-4 items-center animate-pulse">
      <div className="flex items-center justify-center w-35 h-40 cursor-pointer bg-white hover:shadow-sm transition-all duration-200 rounded-lg border border-gray-200 p-4">
        <FileText className="w-16 h-16 animate-pulse" />
      </div>
      <div className="text-center flex flex-col items-center w-full">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}
