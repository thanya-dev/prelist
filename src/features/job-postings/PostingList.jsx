import { preloadRoute } from '../../app/routePages.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, MagnifyingGlass, Plus, Users, CopySimple, Check } from '@phosphor-icons/react';
import { useCopy } from '../../hooks/useCopy.js';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { getJobPostings } from './jobPostingApi.js';
import { getRecruitmentPeriod } from './recruitmentStatuses.js';
import { getAnnouncementCriteria } from './announcementForm.js';
import { PlatformIcons } from '../../components/shared/PlatformIcons.jsx';

const POSTINGS_PAGE_SIZE = 10;

export function PostingList({ briefId, onCreate }) {
  const navigate = useNavigate();
  const { copiedId, copy } = useCopy();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('ทั้งหมด');
  const statuses = ['ทั้งหมด', 'ร่าง', 'เปิดรับสมัคร', 'ปิดรับสมัคร'];
  const jobs = getJobPostings()
    .filter((job) => !briefId || job.brief === briefId)
    .map((saved) => {
      const job = {
        ...SEED_JOB_POSTINGS.find((seed) => seed.id === saved.id),
        ...saved,
      };
      const { start, end, validPeriod, state } = getRecruitmentPeriod(job);
      return {
        ...job,
        campaign: job.campaignName || job.brand || 'ยังไม่ระบุแคมเปญ',
        start,
        end,
        validPeriod,
        state,
      };
    });
  const searchMatchedJobs = jobs.filter((job) =>
    `${job.name} ${job.campaign}`.toLowerCase().includes(query.trim().toLowerCase()),
  );
  const statusCounts = Object.fromEntries(
    statuses.map((value) => [
      value,
      searchMatchedJobs.filter((job) => value === 'ทั้งหมด' || job.state === value).length,
    ]),
  );
  const filtered = searchMatchedJobs.filter((job) => status === 'ทั้งหมด' || job.state === status);
  const totalPages = Math.ceil(filtered.length / POSTINGS_PAGE_SIZE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const pageOffset = (activePage - 1) * POSTINGS_PAGE_SIZE;
  const paginatedJobs = filtered.slice(pageOffset, pageOffset + POSTINGS_PAGE_SIZE);
  const tone = (job) =>
    ({
      ร่าง: 'draft',
      เปิดรับสมัคร: 'open',
      ปิดรับสมัคร: 'closed',
    })[job.state];
  const badge = (job) => <span className={`posting-badge ${tone(job)}`}>{job.state}</span>;
  const openJob = (job) => navigate(`/job-postings/${job.id}`);
  const clear = () => {
    setQuery('');
    setCurrentPage(1);
    setStatus('ทั้งหมด');
  };
  return (
    <section className="brief-posting-calendar">
      <div className="posting-page-heading">
        <div>
          <h1>ประกาศหานักรีวิว</h1>
          <p>จัดการประกาศและติดตามช่วงรับสมัครนักรีวิว</p>
        </div>
        <button
          className="primary"
          onClick={() =>
            onCreate
              ? onCreate()
              : navigate(
                  briefId
                    ? `/job-postings/create?briefId=${encodeURIComponent(briefId)}`
                    : '/job-postings/create',
                )
          }
        >
          <Plus /> สร้างประกาศ
        </button>
      </div>
      <div className="posting-controls" style={{ flexWrap: 'wrap', gap: '16px' }}>
        <div className="posting-status-filters" style={{ margin: 0, flex: 1 }}>
          {statuses.map((value) => (
            <button
              key={value}
              aria-pressed={status === value}
              className={status === value ? 'active' : ''}
              onClick={() => {
                setStatus(value);
                setCurrentPage(1);
              }}
            >
              <span
                className={`posting-badge ${
                  value === 'ทั้งหมด'
                    ? 'all'
                    : tone({
                        state: value,
                      })
                }`}
              >
                {value}
              </span>
              <span>({statusCounts[value]})</span>
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <label className="search" style={{ margin: 0 }}>
            <MagnifyingGlass />
            <input
              aria-label="ค้นหาชื่อประกาศหรือชื่อแคมเปญ"
              placeholder="ค้นหาชื่อประกาศ / ชื่อแคมเปญ"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setCurrentPage(1);
              }}
            />
          </label>
        </div>
      </div>

      {!filtered.length ? (
        <div className="empty-state posting-search-empty mt-6">
          <MagnifyingGlass size={36} />
          <h3>ไม่พบประกาศที่ตรงกับการค้นหา</h3>
          <button className="secondary-button" onClick={clear}>
            ล้างตัวกรอง
          </button>
        </div>
      ) : (
        <>
          <div className="posting-table-wrap mt-6">
            <table className="posting-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>ประกาศ</th>
                  <th>Special Criteria</th>
                  <th>สถานะ</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job, index) => {
                  const criteria = getAnnouncementCriteria(job)
                    .flatMap((criterion) => criterion.split(/\s*·\s*|\r?\n/))
                    .map((criterion) => criterion.trim())
                    .filter(Boolean);
                  const isActive =
                    job.status !== 'Draft' &&
                    job.status !== 'แบบร่าง' &&
                    job.announcementStatus !== 'inactive';
                  return (
                    <tr key={job.id}>
                      <td>{pageOffset + index + 1}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <button
                            onMouseEnter={() => preloadRoute('jobPosting')}
                            onFocus={() => preloadRoute('jobPosting')}
                            onClick={() => openJob(job)}
                            style={{
                              textAlign: 'left',
                              fontWeight: 'bold',
                              color: 'var(--color-primary)',
                              padding: 0,
                              margin: 0,
                            }}
                          >
                            {job.name}
                          </button>
                          <PlatformIcons platforms={job.platforms} />
                        </div>
                        <small style={{ display: 'block', color: '#64748b', marginBottom: '8px' }}>
                          {job.subtitle || job.brand}
                        </small>
                        <button
                          type="button"
                          className="id-pill inline-flex items-center gap-2 hover:bg-slate-50"
                          onClick={() => {
                            copy(job.id, `job-id-${job.id}`, `คัดลอก Job ID: ${job.id} สำเร็จ`);
                          }}
                        >
                          <strong>Job ID:</strong> {job.id}{' '}
                          {copiedId === `job-id-${job.id}` ? (
                            <Check size={12} weight="bold" className="text-emerald-500" />
                          ) : (
                            <CopySimple size={12} weight="bold" />
                          )}
                        </button>
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm leading-5 text-[#64748b]">
                          <span className="inline-flex items-center gap-2">
                            <Eye size={16} /> เปิดดูประกาศ:{' '}
                            {(job.viewerCount ?? 0).toLocaleString('th-TH')} คน
                          </span>
                          <span className="inline-flex items-center gap-2">
                            <Users size={16} /> ผู้สมัคร:{' '}
                            {(job.applicants ?? 0).toLocaleString('th-TH')} คน
                          </span>
                        </div>
                      </td>
                      <td className="posting-table-criteria">
                        <div className="flex flex-col gap-2">
                          {criteria.length ? (
                            <ul className="m-0 flex list-none flex-col gap-2 p-0">
                              {criteria.map((criterion, criterionIndex) => (
                                <li key={`${criterion}-${criterionIndex}`}>{criterion}</li>
                              ))}
                            </ul>
                          ) : (
                            '-'
                          )}
                        </div>
                      </td>
                      <td>{badge(job)}</td>
                      <td>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '8px',
                            alignItems: 'stretch',
                          }}
                        >
                          <div
                            className="relative group inline-block w-full"
                            style={{ cursor: !isActive ? 'not-allowed' : 'pointer' }}
                          >
                            <button
                              className="posting-row-action flex items-center justify-center gap-1.5 w-full border border-slate-300 text-[#64748b] hover:border-[#3b82f6] hover:text-[#3b82f6] hover:bg-slate-50 rounded-md transition-colors"
                              style={{
                                padding: '4px 10px',
                                ...(!isActive ? { opacity: 0.5, pointerEvents: 'none' } : {}),
                              }}
                              disabled={!isActive}
                              onClick={() => {
                                if (isActive) {
                                  const link = `https://buddyreview.co/apply/${job.id}`;
                                  copy(link, `link-${job.id}`, `คัดลอกลิ้งสมัคร ${link} เรียบร้อย`);
                                }
                              }}
                            >
                              {copiedId === `link-${job.id}` ? (
                                <Check size={16} className="text-emerald-500" />
                              ) : (
                                <CopySimple size={16} />
                              )}{' '}
                              คัดลอกลิงก์สมัคร
                            </button>
                            {!isActive && (
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-slate-800 text-white text-xs rounded py-1.5 px-2.5 z-10 shadow-lg whitespace-nowrap">
                                ต้องเปิดรับสมัครแคมเปญก่อน
                                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                              </div>
                            )}
                          </div>
                          <button
                            className="posting-row-action flex items-center justify-center w-full border border-[#3b82f6] text-[#3b82f6] hover:bg-[#eff6ff] rounded-md font-medium transition-colors"
                            style={{ padding: '4px 10px' }}
                            onClick={() => openJob(job)}
                          >
                            ดูรายละเอียดงาน ↗
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="m-0 text-sm text-[#64748b]" role="status">
              แสดง {pageOffset + 1}–{Math.min(pageOffset + POSTINGS_PAGE_SIZE, filtered.length)} จาก{' '}
              {filtered.length} ประกาศ
            </p>
            {totalPages > 1 && (
              <nav className="pagination flex flex-wrap" aria-label="หน้ารายการประกาศ">
                <button
                  aria-label="หน้าก่อนหน้า"
                  disabled={activePage === 1}
                  onClick={() => setCurrentPage(activePage - 1)}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <button
                    key={page}
                    aria-label={`หน้า ${page}`}
                    aria-current={activePage === page ? 'page' : undefined}
                    className={activePage === page ? 'selected' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                <button
                  aria-label="หน้าถัดไป"
                  disabled={activePage === totalPages}
                  onClick={() => setCurrentPage(activePage + 1)}
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </>
      )}
    </section>
  );
}
