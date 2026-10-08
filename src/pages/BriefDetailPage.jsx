import { JobPostingFormModal } from '../features/job-postings/JobPostingFormModal.jsx';
import { BriefFormModal } from '../features/briefs/BriefFormModal.jsx';
import { useState } from 'react';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, CaretRight } from '@phosphor-icons/react';
import { getBriefById } from '../features/briefs/briefApi.js';
import { BriefSummary } from '../components/shared/BriefSummary.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { PostingList } from '../features/job-postings/PostingList.jsx';
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
            <PostingList briefId={brief?.id || id} onCreate={() => setIsCreatePostingOpen(true)} />
          </div>
        </>
      </main>
    </div>
  );
}
