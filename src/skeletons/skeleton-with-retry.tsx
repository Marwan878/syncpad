"use client";

import { RefreshCcwIcon } from "lucide-react";

type SkeletonWithRetryProps = {
  id: string;
  onRetry: () => void;
};

export default function SkeletonWithRetry({
  id,
  onRetry,
}: Readonly<SkeletonWithRetryProps>) {
  return (
    <div
      className="bg-gray-200 rounded-lg w-100 h-62 flex items-center justify-center"
      id={id}
    >
      <button
        className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        aria-label="Retry upload"
        title="Retry upload"
        onClick={onRetry}
      >
        <RefreshCcwIcon className="w-4 h-4" aria-hidden />
      </button>
    </div>
  );
}
