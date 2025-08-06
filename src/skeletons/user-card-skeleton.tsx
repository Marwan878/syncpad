export default function UserCardSkeleton() {
  return (
    <div className="flex items-center gap-2 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div>
        <div className="w-22 h-3 bg-gray-200 mb-2" />
        <div className="w-28 h-2 bg-gray-200" />
      </div>
    </div>
  );
}
