import { preloadRoute } from '../app/routePages.js';
import { JobPostingFormModal } from '../features/job-postings/JobPostingFormModal.jsx';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CaretRight, ListMagnifyingGlass, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { BriefFormModal } from '../features/briefs/BriefFormModal.jsx';
import { getBriefs } from '../features/briefs/briefApi.js';
import { BriefSummary } from '../components/shared/BriefSummary.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { getJobPostings } from '../features/job-postings/jobPostingApi.js';
import {
  getRecruitmentPeriod,
  RECRUITMENT_STATUSES,
} from '../features/job-postings/recruitmentStatuses.js';

export function BriefListPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isCreateOpen, setIsCreateOpen] = useState(searchParams.get('create') === '1');
  const [isCreatePostingOpen, setIsCreatePostingOpen] = useState(
    searchParams.get('createPosting') === '1',
  );
  const handleClosePosting = () => {
    setIsCreatePostingOpen(false);
    const next = new URLSearchParams(searchParams);
    next.delete('createPosting');
    next.delete('copyFrom');
    setSearchParams(next, { replace: true });
  };
  const handleCloseCreate = () => {
    setIsCreateOpen(false);
    if (searchParams.has('create')) {
      const next = new URLSearchParams(searchParams);
      next.delete('create');
      setSearchParams(next, { replace: true });
    }
  };
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const postings = getJobPostings();
  const briefs = getBriefs().filter((brief) =>
    `${brief.name} ${brief.title || ''} ${brief.brand} ${brief.id} ${(brief.briefNumbers || []).join(' ')}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  const totalPages = Math.ceil(briefs.length / pageSize);
  const validCurrentPage = Math.min(currentPage, Math.max(1, totalPages));

  const paginatedBriefs = briefs.slice(
    (validCurrentPage - 1) * pageSize,
    validCurrentPage * pageSize,
  );

  return (
    <div className="app-shell">
      {isCreatePostingOpen && (
        <JobPostingFormModal
          onClose={handleClosePosting}
          onSave={(saved, isDraft) => {
            handleClosePosting();
            if (!isDraft) navigate(`/job-postings/${saved.id}`);
          }}
        />
      )}
      {isCreateOpen && (
        <BriefFormModal
          onClose={handleCloseCreate}
          onSave={(briefId) => {
            handleCloseCreate();
            navigate(`/briefs/${briefId}`);
          }}
        />
      )}
      <Sidebar />
      <main className="list-main briefs-main">
        <div className="breadcrumbs">
          ประกาศหานักรีวิว <CaretRight /> <b>รายการบรีฟ</b>
        </div>
        <div className="page-actions gap-6 mt-6 mb-8 max-[760px]:gap-3">
          <h1>รายการ Brief</h1>
          <label className="search">
            <MagnifyingGlass size={20} />
            <input
              aria-label="ค้นหาชื่อบรีฟหรือ Brief ID"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="ค้นหาด้วยชื่อบรีฟ หรือ Brief ID"
            />
          </label>
          <button className="primary" onClick={() => setIsCreateOpen(true)}>
            <Plus size={18} /> สร้างบรีฟ
          </button>
        </div>
        <section className="project-list grid gap-5" aria-label="รายการ Brief">
          {paginatedBriefs.length ? (
            paginatedBriefs.map((brief) => {
              const linkedPostings = postings.filter((posting) => posting.brief === brief.id);
              const statusCounts = linkedPostings.reduce((counts, posting) => {
                const { state } = getRecruitmentPeriod(posting);
                counts[state] = (counts[state] || 0) + 1;
                return counts;
              }, {});
              return (
                <article
                  key={brief.id}
                  className="project-card brief-card gap-6 pt-5 pr-8 pb-5 pl-5 max-[760px]:gap-4 max-[760px]:p-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onMouseEnter={() => preloadRoute('briefDetail')}
                  onFocus={() => preloadRoute('briefDetail')}
                  onClick={() => navigate(`/briefs/${brief.id}`)}
                >
                  <BriefSummary brief={brief} onOpen={() => navigate(`/briefs/${brief.id}`)}>
                    <div
                      className="mt-4 flex flex-wrap items-center gap-3"
                      aria-label="จำนวนประกาศแยกตามสถานะ"
                    >
                      <strong className="text-sm">
                        ประกาศทั้งหมด {linkedPostings.length} ประกาศ
                      </strong>
                      <div className="flex flex-wrap gap-2">
                        {RECRUITMENT_STATUSES.map(({ label, tone }) => (
                          <span key={label} className={`posting-badge ${tone}`}>
                            {label} ({statusCounts[label] || 0})
                          </span>
                        ))}
                      </div>
                    </div>
                  </BriefSummary>
                  <button
                    className="brief-open"
                    aria-label="เปิด Brief"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/briefs/${brief.id}`);
                    }}
                  >
                    <CaretRight size={22} />
                  </button>
                </article>
              );
            })
          ) : (
            <div className="empty-state brief-empty" role="status">
              <ListMagnifyingGlass size={44} />
              <h2>ไม่พบบรีฟ</h2>
              <p>ลองค้นหาด้วยชื่อบรีฟหรือ Brief ID อื่น</p>
              <button className="secondary" onClick={() => setQuery('')}>
                ล้างคำค้นหา
              </button>
            </div>
          )}
        </section>

        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '32px' }}>
            <button
              disabled={validCurrentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              ‹
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i + 1}
                className={validCurrentPage === i + 1 ? 'selected' : ''}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={validCurrentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
