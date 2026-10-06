import { NotePencil } from '@phosphor-icons/react';
import { BrandMark } from '../../components/shared/BrandMark.jsx';

export function BriefSummary({ brief, onOpen, onEdit, children }) {
  const Heading = onOpen ? 'h2' : 'h1';
  const briefNumbers = [
    ...new Set(brief?.briefNumbers?.length ? brief.briefNumbers : [brief?.id]),
  ].filter(Boolean);
  return (
    <>
      <div className="thumb-wrap brief-summary-avatar">
        <BrandMark project={brief || { tone: 'new' }} />
        {onEdit && (
          <button className="edit-chip" aria-label="แก้ไขบรีฟ" onClick={onEdit}>
            <NotePencil size={15} /> แก้ไข
          </button>
        )}
      </div>
      <div className="project-info min-w-0">
        <Heading className="brief-summary-title">
          {onOpen ? (
            <button
              className="brief-title"
              onClick={(e) => {
                e.stopPropagation();
                onOpen(e);
              }}
            >
              {brief?.name || 'ยังไม่ระบุชื่อโปรเจกต์'}
            </button>
          ) : (
            brief?.name || 'ยังไม่ระบุชื่อโปรเจกต์'
          )}
        </Heading>
        <p className="brief-summary-brand">{brief?.brand || 'ยังไม่ระบุ Brand'}</p>
        <div className="flex flex-wrap gap-2" aria-label="เลขบรีฟ">
          {briefNumbers.map((number) => (
            <span className="id-pill" key={number}>
              {number}
            </span>
          ))}
        </div>
        {children}
      </div>
    </>
  );
}
