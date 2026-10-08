import { Skeleton } from '../../components/ui/Skeleton.jsx';

export function ReviewerListSkeleton({ viewMode, count = 6 }) {
  return (
    <div role="status" aria-live="polite" aria-label="กำลังโหลดรายชื่อนักรีวิว">
      <span className="sr-only">กำลังโหลดรายชื่อนักรีวิว</span>
      <div
        aria-hidden="true"
        className={
          viewMode === 'card'
            ? 'grid gap-6 grid-cols-[repeat(auto-fill,minmax(min(100%,320px),1fr))]'
            : 'overflow-x-auto rounded-xl border border-[#dfe5ed] bg-white'
        }
      >
        {Array.from({ length: count }, (_, index) =>
          viewMode === 'card' ? (
            <div
              key={index}
              className="rounded-xl border border-[#dfe5ed] bg-white overflow-hidden"
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-4 w-4/5" />
                <div className="grid grid-cols-3 gap-2">
                  {[0, 1, 2].map((image) => (
                    <Skeleton key={image} className="aspect-square" />
                  ))}
                </div>
                {[0, 1, 2, 3].map((line) => (
                  <Skeleton key={line} className="h-4 w-3/4" />
                ))}
              </div>
              <div className="flex justify-between border-t border-[#dfe5ed] p-4">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ) : (
            <div
              key={index}
              className="flex min-w-[960px] items-center gap-6 border-b border-[#dfe5ed] p-4 last:border-b-0"
            >
              <Skeleton className="h-5 w-5 shrink-0" />
              <div className="flex w-52 flex-col gap-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex flex-1 flex-col gap-3">
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
              <Skeleton className="h-12 w-36" />
              <Skeleton className="h-9 w-24" />
              <Skeleton className="h-9 w-24" />
            </div>
          ),
        )}
      </div>
    </div>
  );
}
