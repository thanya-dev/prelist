import { DAY_MS, parseDay, getBangkokToday } from '../../utils/formatDate.js';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarBlank,
  CaretRight,
  List,
  MagnifyingGlass,
  NotePencil,
  Plus,
} from '@phosphor-icons/react';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { getJobPostings } from './jobPostingApi.js';
import { getRecruitmentPeriod } from './recruitmentStatuses.js';
export function PostingCalendarList({ briefId }) {
  const navigate = useNavigate();
  const [view, setView] = useState('calendar');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('ทั้งหมด');
  const todayString = getBangkokToday();
  const today = parseDay(todayString);
  const [month, setMonth] = useState(() => new Date(today * DAY_MS));
  const statuses = ['ทั้งหมด', 'แบบร่าง', 'รอเปิดรับ', 'เปิดรับสมัคร', 'ปิดรับสมัคร'];
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
      แบบร่าง: 'draft',
      รอเปิดรับ: 'scheduled',
      เปิดรับสมัคร: 'open',
      ปิดรับสมัคร: 'closed',
    })[job.state];
  const badge = (job) => <span className={`posting-badge ${tone(job)}`}>{job.state}</span>;
  const openJob = (job) => navigate(`/job-postings/${job.id}`);
  const clear = () => {
    setQuery('');
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
            navigate(
              briefId
                ? `/job-postings/create?briefId=${encodeURIComponent(briefId)}`
                : '/job-postings/create',
            )
          }
        >
          <Plus /> สร้างประกาศ
        </button>
      </div>
      <div className="posting-controls">
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
        <label className="search">
          <MagnifyingGlass />
          <input
            aria-label="ค้นหาชื่อประกาศหรือชื่อแคมเปญ"
            placeholder="ค้นหาชื่อประกาศ / ชื่อแคมเปญ"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <div className="posting-status-filters">
        {statuses.map((value) => (
          <button
            key={value}
            aria-pressed={status === value}
            className={status === value ? 'active' : ''}
            onClick={() => setStatus(value)}
          >
            <span
              aria-hidden="true"
              className={`posting-status-dot ${
                value === 'ทั้งหมด'
                  ? 'all'
                  : tone({
                      state: value,
                    })
              }`}
            />
            {value} ({statusCounts[value]})
          </button>
        ))}
      </div>
      {!filtered.length ? (
        <div className="empty-state posting-search-empty">
          <MagnifyingGlass size={36} />
          <h3>ไม่พบประกาศที่ตรงกับการค้นหา</h3>
          <button className="secondary-button" onClick={clear}>
            ล้างตัวกรอง
          </button>
        </div>
      ) : view === 'table' ? (
        <div className="posting-table-wrap">
          <table className="posting-table">
            <thead>
              <tr>
                <th>ประกาศ / แคมเปญ</th>
                <th>ช่วงรับสมัคร</th>
                <th>สถานะ</th>
                <th>เปิดดูประกาศ</th>
                <th>ผู้สมัคร</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id}>
                  <td>
                    <button onClick={() => openJob(job)}>{job.name}</button>
                    <small>{job.campaign}</small>
                  </td>
                  <td>{period(job)}</td>
                  <td>{badge(job)}</td>
                  <td>
                    {job.viewerCount == null
                      ? '0 คน'
                      : `${job.viewerCount.toLocaleString('th-TH')} คน`}
                  </td>
                  <td>{(job.applicants || 0).toLocaleString('th-TH')} คน</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          {drafts.length > 0 && (
            <button
              className="posting-drafts"
              onClick={() => {
                setView('table');
                setStatus('แบบร่าง');
              }}
            >
              <NotePencil /> แบบร่าง {drafts.length} รายการ <CaretRight />
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
                            <strong>{job.name}</strong>
                            <small>{job.campaign}</small>
                            <small>{period(job)}</small>
                            <div className="posting-event-footer">
                              {badge(job)}
                              <span className="posting-event-counts">
                                <span>
                                  เปิดดูประกาศ{' '}
                                  {job.viewerCount == null
                                    ? '0 คน'
                                    : `${job.viewerCount.toLocaleString('th-TH')} คน`}
                                </span>
                                <span>
                                  สมัคร {(job.applicants || 0).toLocaleString('th-TH')} คน
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
