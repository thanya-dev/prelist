import { NotePencil, Users, Eye, Copy, Check } from '@phosphor-icons/react';
import { AnnouncementStatus } from './AnnouncementStatus.jsx';
import { useCopy } from '../../hooks/useCopy.js';
import { PlatformIcons } from './PlatformIcons.jsx';

export function JobPostingSummary({ job, onEdit }) {
  const { copiedId, copy } = useCopy();
  return (
    <article
      className={`project-card posting-summary gap-6 p-6 mb-6 max-[760px]:gap-4 max-[760px]:p-3 ${onEdit ? 'posting-summary-editable' : ''}`}
    >
      {onEdit && (
        <button
          className="edit-chip posting-summary-edit"
          aria-label="แก้ไขประกาศ"
          onClick={onEdit}
        >
          <NotePencil size={15} /> แก้ไข
        </button>
      )}
      <div className="project-info">
        <div className="project-title-row">
          <div className="flex min-w-0 items-center gap-2">
            <h1
              className="posting-summary-title"
              style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            >
              {job.name?.trim() || '-'}
            </h1>
            <PlatformIcons platforms={job.platforms} />
          </div>
          <AnnouncementStatus
            value={
              job.status === 'Draft' || job.status === 'แบบร่าง'
                ? 'draft'
                : job.announcementStatus === 'inactive'
                  ? 'inactive'
                  : 'active'
            }
          />
        </div>
        <small>{job.subtitle?.trim() || '-'}</small>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2" aria-label="รหัสประกาศ">
          {[
            { label: 'Brief', value: job.brief },
            { label: 'Job ID', value: job.id },
          ].map(({ label, value }) => (
            <button
              key={label}
              type="button"
              className="id-pill inline-flex items-center gap-2 hover:bg-slate-50 disabled:cursor-default"
              disabled={!value}
              aria-label={`คัดลอก ${label}: ${value || '-'}`}
              onClick={() => copy(value, value, `คัดลอก ${label}: ${value} สำเร็จ`)}
            >
              {label}: {value || '-'}
              {value &&
                (copiedId === value ? (
                  <Check size={14} className="text-emerald-500" />
                ) : (
                  <Copy size={14} aria-hidden="true" />
                ))}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="owner" aria-label="จำนวนผู้เข้าชมประกาศ">
            <Eye size={16} /> เปิดดูประกาศ: {(job.viewerCount || 0).toLocaleString('th-TH')} คน
          </span>
          <span className="owner">
            <Users size={16} /> ผู้สมัคร: {(job.applicants || 0).toLocaleString('th-TH')} คน
          </span>
        </div>
        <span className="sr-only" role="status" aria-live="polite"></span>
      </div>
    </article>
  );
}
