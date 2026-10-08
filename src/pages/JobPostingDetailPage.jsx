import { useState, useEffect } from 'react';
import { JobPostingDetail } from '../features/job-postings/JobPostingDetail.jsx';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';

export function JobPostingDetailPage(props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (isLoading) {
    return (
      <div className="app-shell">
        <Sidebar onList={props.onBack} />
        <main className="list-main lifecycle-detail">
          <div className="space-y-6 mt-4">
            <div className="flex gap-2">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Skeleton className="w-20 h-8 mt-2" />
            
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="w-40 h-8" />
              <div className="flex gap-2">
                <Skeleton className="w-24 h-10 rounded" />
                <Skeleton className="w-24 h-10 rounded" />
              </div>
            </div>

            <article className="project-card p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-3">
                  <Skeleton className="w-64 h-8" />
                  <Skeleton className="w-32 h-6" />
                </div>
                <Skeleton className="w-24 h-6 rounded-full" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="w-32 h-8 rounded-full" />
                <Skeleton className="w-32 h-8 rounded-full" />
              </div>
            </article>

            <div className="flex gap-6">
              <div className="flex-1 space-y-4">
                <Skeleton className="w-full h-12" />
                <Skeleton className="w-full h-[300px]" />
              </div>
              <div className="w-[300px] shrink-0 space-y-4">
                <Skeleton className="w-full h-[200px]" />
                <Skeleton className="w-full h-[200px]" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return <JobPostingDetail {...props} />;
}
