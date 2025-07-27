export default function ImageSkeleton({ id }: { id: string }) {
  return (
    <div
      className="bg-gray-200 rounded-lg relative overflow-hidden w-100 h-62"
      id={id}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-shimmer -translate-x-full"></div>
    </div>
  );
}
