type ProgressToastProps = {
  progress: number;
};

export default function ProgressToast({
  progress,
}: Readonly<ProgressToastProps>) {
  return (
    <div className="flex items-center gap-2 py-2 px-2.5 rounded-sm bg-white absolute top-0 shadow-sm z-50 overflow-hidden min-w-60">
      <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
      <p className="text-sm text-gray-500 mt-1 mb-2 mx-2.5">Uploading...</p>
      <progress
        value={progress}
        max={100}
        className="w-full absolute bottom-0 start-0 h-1 transition-all"
      />
    </div>
  );
}
