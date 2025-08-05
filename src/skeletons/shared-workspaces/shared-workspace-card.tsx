export default function SharedWorkspaceCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border border-background-muted p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-5 bg-background-muted rounded mb-2 w-3/4"></div>
          <div className="h-4 bg-background-muted rounded w-full"></div>
        </div>
        <div className="ml-4 w-16 h-6 bg-background-muted rounded-md"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-background-muted rounded w-20"></div>
          <div className="h-4 bg-background-muted rounded w-16"></div>
        </div>
        <div className="h-4 bg-background-muted rounded w-24"></div>
      </div>
    </div>
  );
}
