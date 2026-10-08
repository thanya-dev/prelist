import { JobPostingFormModal } from '../features/job-postings/JobPostingFormModal.jsx';
import { BriefFormModal } from '../features/briefs/BriefFormModal.jsx';
import { useState, useEffect } from 'react';
import { Skeleton } from '../components/ui/Skeleton.jsx';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CaretRight } from '@phosphor-icons/react';
import { getBriefById } from '../features/briefs/briefApi.js';
import { BriefSummary } from '../features/briefs/BriefSummary.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { PostingCalendarList } from '../features/job-postings/PostingCalendarList.jsx';
export function BriefDetailPage({ onBack }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const brief = getBriefById(id);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isEditOpen, setIsEditOpen] = useState(searchParams.get('edit') === '1');
  const [isCreatePostingOpen, setIsCreatePostingOpen] = useState(
    searchParams.get('createPosting') === '1',
  );
  const handleClosePosting = () => {
    setIsCreatePostingOpen(false);
    if (searchParams.has('createPosting')) {
      const next = new URLSearchParams(searchParams);
      next.delete('createPosting');
      setSearchParams(next, { replace: true });
    }
  };
  const handleCloseEdit = () => {
    setIsEditOpen(false);
    if (searchParams.has('edit')) {
      const next = new URLSearchParams(searchParams);
      next.delete('edit');
      setSearchParams(next, { replace: true });
    }
  };
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="app-shell">
      {isEditOpen && brief && (
        <BriefFormModal
          brief={brief}
          onClose={handleCloseEdit}
          onSave={(briefId) => {
            handleCloseEdit();
            if (briefId !== id) navigate(`/briefs/${briefId}`, { replace: true });
          }}
        />
      )}
      {isCreatePostingOpen && (
        <JobPostingFormModal
          briefId={brief?.id || id}
          onClose={handleClosePosting}
          onSave={(saved, isDraft) => {
            handleClosePosting();
            if (!isDraft) navigate(`/job-postings/${saved.id}`);
          }}
        />
      )}
      <Sidebar />
      <main className="list-main lifecycle-detail brief-detail-page">
        {isLoading ? (
          <div className="space-y-6 mt-4">
            <div className="flex gap-2">
              <Skeleton className="w-24 h-6" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Skeleton className="w-20 h-8 mt-2" />
            <article className="project-card brief-card p-6">
              <div className="flex gap-4">
                <Skeleton className="w-24 h-24 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="w-1/4 h-6" />
                  <Skeleton className="w-1/2 h-8 rounded-full" />
                  <Skeleton className="w-full h-8" />
                </div>
              </div>
            </article>
            <div className="project-card p-6 space-y-4">
              <div className="flex justify-between">
                <Skeleton className="w-1/3 h-8" />
                <Skeleton className="w-24 h-8" />
              </div>
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
              <Skeleton className="w-full h-12" />
            </div>
          </div>
        ) : (
          <>
            <div className="breadcrumbs">
              ประกาศหานักรีวิว <CaretRight />{' '}
              <Link to="/briefs" className="hover:text-[#5135ff] hover:underline transition-colors">
                รายการบรีฟ
              </Link>{' '}
              <CaretRight /> <b>{id}</b>
            </div>
            <div className="detail-heading">
              <button className="back-inline" onClick={onBack}>
                <ArrowLeft /> กลับ
              </button>
            </div>
            <section className="project-summary brief-card">
              <BriefSummary brief={brief} onEdit={() => setIsEditOpen(true)} />
            </section>

            <div>
              <PostingCalendarList
                briefId={brief?.id || id}
                tableOnly
                onCreate={() => setIsCreatePostingOpen(true)}
              />
            </div>
          </>
        )}
      </main>
    </div>
  );
}
