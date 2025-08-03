import PageGrid from "@/components/workspace/page-list/page-grid";
import PageCardSkeleton from "./page-card";

export default function PageListSkeleton() {
  return (
    <PageGrid>
      {Array.from({ length: 6 }).map(() => (
        <PageCardSkeleton key={crypto.randomUUID()} />
      ))}
    </PageGrid>
  );
}
