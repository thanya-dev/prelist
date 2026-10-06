import { NotePencil, Users, Eye } from '@phosphor-icons/react';
import { BrandMark } from '../../components/shared/BrandMark.jsx';

export function JobPostingSummary({ job, onEdit }) {
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
      <div className="thumb-wrap">
        <BrandMark project={job} />
      </div>
      <div className="project-info">
        <div className="project-title-row">
          <h1 className="posting-summary-title">{job.name}</h1>
          <span className="id-pill">Brief: {job.brief}</span>
        </div>
        <div className="owner">
          <Users size={16} /> ผู้สมัคร: {(job.applicants || 0).toLocaleString('th-TH')} คน
          &nbsp;&nbsp;•&nbsp;&nbsp; นักรีวิว: {job.reviewers} คน
        </div>
        <div className="owner mt-2" aria-label="จำนวนผู้เข้าชมประกาศ">
          <Eye size={16} /> เปิดดูประกาศ:{' '}
          {job.viewerCount == null ? '0 คน' : `${job.viewerCount.toLocaleString('th-TH')} คน`}
        </div>
        <small>{job.subtitle || 'ยังไม่ระบุ Campaign Subtitle'}</small>
        <div className="prelist-meta">
          <span>{job.brand}</span>
        </div>
      </div>
    </article>
  );
}
