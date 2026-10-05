import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretRight, ListMagnifyingGlass, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { getBriefs } from '../features/briefs/briefApi.js';
import { BrandMark } from '../components/shared/BrandMark.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { getJobPostings } from '../features/job-postings/jobPostingApi.js';
import {
  getRecruitmentPeriod,
  RECRUITMENT_STATUSES,
} from '../features/job-postings/recruitmentStatuses.js';

export function BriefListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const postings = getJobPostings();
  const briefs = getBriefs().filter((brief) =>
    `${brief.name} ${brief.title || ''} ${brief.brand} ${brief.id}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="list-main briefs-main">
        <div className="breadcrumbs">
          Management <CaretRight /> <b>รายการ Brief</b>
        </div>
        <div className="page-actions gap-6 mt-6 mb-8 max-[760px]:gap-3">
          <h1>รายการ Brief</h1>
          <label className="search">
            <MagnifyingGlass size={20} />
            <input
              aria-label="ค้นหาชื่อบรีฟหรือ Brief ID"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ค้นหาด้วยชื่อบรีฟ หรือ Brief ID"
            />
          </label>
          <button className="primary" onClick={() => navigate('/briefs/create')}>
            <Plus size={18} /> สร้างบรีฟ
          </button>
        </div>
        <section className="project-list grid gap-5" aria-label="รายการ Brief">
          {briefs.length ? (
            briefs.map((brief) => {
              const linkedPostings = postings.filter((posting) => posting.brief === brief.id);
              const statusCounts = linkedPostings.reduce((counts, posting) => {
                const { state } = getRecruitmentPeriod(posting);
                counts[state] = (counts[state] || 0) + 1;
                return counts;
              }, {});
              return (
                <article
                  key={brief.id}
                  className="project-card brief-card gap-6 pt-5 pr-8 pb-5 pl-5 max-[760px]:gap-4 max-[760px]:p-3"
                >
                  <div className="thumb-wrap">
                    <BrandMark project={brief} />
                  </div>
                  <div className="project-info">
                    <h2>
                      <button
                        className="brief-title"
                        onClick={() => navigate(`/briefs/${brief.id}`)}
                      >
                        {brief.title || brief.name}
                      </button>
                    </h2>
                    <p>{brief.name}</p>
                    <span className="id-pill">{brief.id}</span>
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
                  </div>
                  <button
                    className="brief-open"
                    aria-label="เปิด Brief"
                    onClick={() => navigate(`/briefs/${brief.id}`)}
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
      </main>
    </div>
  );
}
