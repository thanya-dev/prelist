import { DAY_MS, parseDay, getBangkokToday } from '../../utils/formatDate.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarBlank,
  CaretRight,
  Eye,
  List,
  MagnifyingGlass,
  NotePencil,
  Plus,
  Users,
  CopySimple,
  Check,
} from '@phosphor-icons/react';
import { useCopy } from '../../hooks/useCopy.js';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { getJobPostings } from './jobPostingApi.js';
import { getRecruitmentPeriod } from './recruitmentStatuses.js';
const POSTINGS_PAGE_SIZE = 10;

export function PostingCalendarList({ briefId, tableOnly = false, onCreate }) {
  const navigate = useNavigate();
  const { copiedId, copy } = useCopy();
  const [view, setView] = useState(tableOnly ? 'table' : 'calendar');
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('ทั้งหมด');
  const todayString = getBangkokToday();
  const today = parseDay(todayString);
  const [month, setMonth] = useState(() => new Date(today * DAY_MS));
  const statuses = ['ทั้งหมด', 'ร่าง', 'เปิดรับสมัคร', 'ปิดรับสมัคร'];
  const jobs = getJobPostings()
    .filter((job) => !briefId || job.brief === briefId)
    .map((saved) => {
      const job = {
        ...SEED_JOB_POSTINGS.find((seed) => seed.id === saved.id),
        ...saved,
      };
      const { start, end, validPeriod, state } = getRecruitmentPeriod(job, today);
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
  const drafts = filtered.filter((job) => !job.validPeriod);
  const dated = filtered.filter((job) => job.validPeriod);
  const first = Date.UTC(month.getUTCFullYear(), month.getUTCMonth(), 1) / DAY_MS;
  const last = Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + 1, 0) / DAY_MS;
  const gridStart = first - ((new Date(first * DAY_MS).getUTCDay() + 6) % 7);
  const weekCount = Math.ceil((last - gridStart + 1) / 7);
  const formatDay = (day) =>
    new Intl.DateTimeFormat('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }).format(new Date(day * DAY_MS));
  const period = (job) =>
    job.validPeriod ? `${formatDay(job.start)} – ${formatDay(job.end)}` : 'ยังไม่กำหนดช่วงรับสมัคร';
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
  const changeMonth = (offset) =>
    setMonth(new Date(Date.UTC(month.getUTCFullYear(), month.getUTCMonth() + offset, 1)));
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
          {!tableOnly && (
            <div className="posting-view-toggle">
              {[
                ['calendar', 'ปฏิทิน', CalendarBlank],
                ['table', 'ตาราง', List],
              ].map(([value, label, Icon]) => (
                <button
                  key={value}
                  aria-pressed={view === value}
                  className={view === value ? 'active' : ''}
                  onClick={() => setView(value)}
                >
                  <Icon />
                  {label}
                </button>
              ))}
            </div>
          )}
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
      ) : view === 'table' ? (
        <>
          <div className="posting-table-wrap mt-6">
            <table className="posting-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>No.</th>
                  <th>ประกาศ</th>
                  <th>สถานะ</th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Eye size={18} /> เปิดดูประกาศ
                    </div>
                  </th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={18} /> ผู้สมัคร
                    </div>
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedJobs.map((job, index) => {
                  const isActive =
                    job.status !== 'Draft' &&
                    job.status !== 'แบบร่าง' &&
                    job.announcementStatus !== 'inactive';
                  return (
                    <tr key={job.id}>
                      <td>{pageOffset + index + 1}</td>
                      <td>
                        <button
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
                      </td>
                      <td>{badge(job)}</td>
                      <td>
                        {job.viewerCount == null
                          ? '0 คน'
                          : `${job.viewerCount.toLocaleString('th-TH')} คน`}
                      </td>
                      <td>{(job.applicants || 0).toLocaleString('th-TH')} คน</td>
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
      ) : (
        <>
          {drafts.length > 0 && (
            <button
              className="posting-drafts"
              onClick={() => {
                setView('table');
                setStatus('ทั้งหมด');
              }}
            >
              <NotePencil /> ประกาศไม่ระบุวัน {drafts.length} รายการ <CaretRight />
            </button>
          )}
          <div className="posting-month-header">
            <h2>
              {new Intl.DateTimeFormat('th-TH', {
                month: 'long',
                year: 'numeric',
                timeZone: 'UTC',
              }).format(month)}
            </h2>
            <div>
              <button
                className="secondary-button"
                onClick={() => setMonth(new Date(today * DAY_MS))}
              >
                วันนี้
              </button>
              <button
                className="secondary-button"
                aria-label="เดือนก่อนหน้า"
                onClick={() => changeMonth(-1)}
              >
                <ArrowLeft />
              </button>
              <button
                className="secondary-button"
                aria-label="เดือนถัดไป"
                onClick={() => changeMonth(1)}
              >
                <CaretRight />
              </button>
            </div>
          </div>
          <div className="posting-calendar-scroll">
            <div className="posting-calendar">
              <div className="posting-weekdays">
                {['จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
              {Array.from(
                {
                  length: weekCount,
                },
                (_, week) => {
                  const weekStart = gridStart + week * 7;
                  const segments = dated
                    .filter((job) => job.start <= weekStart + 6 && job.end >= weekStart)
                    .map((job) => ({
                      job,
                      left: Math.max(job.start, weekStart) - weekStart,
                      right: Math.min(job.end, weekStart + 6) - weekStart,
                    }))
                    .sort(
                      (a, b) =>
                        a.left - b.left || b.right - a.right || a.job.id.localeCompare(b.job.id),
                    );
                  const lanes = [];
                  for (const segment of segments) {
                    let lane = lanes.findIndex((end) => end < segment.left);
                    if (lane < 0) lane = lanes.length;
                    lanes[lane] = segment.right;
                    segment.lane = lane;
                  }
                  return (
                    <div className="posting-week" key={weekStart}>
                      <div className="posting-week-days">
                        {Array.from(
                          {
                            length: 7,
                          },
                          (_, column) => {
                            const day = weekStart + column;
                            return (
                              <div
                                className={`${day < first || day > last ? 'outside' : ''} ${day === today ? 'today' : ''}`}
                                key={day}
                              >
                                <span aria-label={formatDay(day)}>
                                  {new Date(day * DAY_MS).getUTCDate()}
                                </span>
                              </div>
                            );
                          },
                        )}
                      </div>
                      <div
                        className="posting-week-events"
                        style={{
                          gridTemplateRows: `repeat(${Math.max(lanes.length, 1)}, 148px)`,
                        }}
                      >
                        {segments.map(({ job, left, right, lane }) => (
                          <button
                            key={job.id}
                            className={`posting-event ${tone(job)} ${job.start < weekStart ? 'continues-left' : ''} ${job.end > weekStart + 6 ? 'continues-right' : ''}`}
                            style={{
                              gridColumn: `${left + 1} / ${right + 2}`,
                              gridRow: lane + 1,
                            }}
                            onClick={() => openJob(job)}
                            title={`${job.name} · ${job.campaign} · ${period(job)} · ${job.state} · เปิดดูประกาศ ${job.viewerCount == null ? '0 คน' : `${job.viewerCount} คน`} · ผู้สมัคร ${job.applicants || 0} คน`}
                          >
                            <strong style={{ color: 'var(--color-primary)' }}>{job.name}</strong>
                            <small>{job.campaign}</small>
                            <small>{period(job)}</small>
                            <div className="posting-event-footer">
                              {badge(job)}
                              <span className="posting-event-counts">
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Eye size={14} /> เปิดดูประกาศ{' '}
                                  {job.viewerCount == null
                                    ? '0 คน'
                                    : `${job.viewerCount.toLocaleString('th-TH')} คน`}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <Users size={14} /> สมัคร{' '}
                                  {(job.applicants || 0).toLocaleString('th-TH')} คน
                                </span>
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>
          {!dated.some(
            (job) => job.start <= gridStart + weekCount * 7 - 1 && job.end >= gridStart,
          ) && <p className="posting-month-empty">ไม่มีประกาศในเดือนนี้</p>}
        </>
      )}
    </section>
  );
}
