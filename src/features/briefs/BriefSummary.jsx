import { NotePencil, CopySimple, Check } from '@phosphor-icons/react';
import { useCopy } from '../../hooks/useCopy.js';
import { BrandMark } from '../../components/shared/BrandMark.jsx';

export function BriefSummary({ brief, onOpen, onEdit, children }) {
  const Heading = onOpen ? 'h2' : 'h1';
  const briefNumbers = [
    ...new Set(brief?.briefNumbers?.length ? brief.briefNumbers : [brief?.id]),
  ].filter(Boolean);
  const { copiedId, copy } = useCopy();
  return (
    <>

      <div className="project-info min-w-0">
        <Heading className="brief-summary-title" style={{ color: 'var(--color-primary)', fontWeight: 'bold' }}>
          {onOpen ? (
            <button
              className="brief-title"
              style={{ color: 'var(--color-primary)', fontWeight: 'bold', textAlign: 'left' }}
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
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2" aria-label="เลขบรีฟ">
          {briefNumbers.map((number) => (
            <button
              key={number}
              type="button"
              className="id-pill inline-flex items-center gap-1.5 hover:bg-slate-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                copy(number, number, `คัดลอก Brief ID: ${number} สำเร็จ`);
              }}
            >
              <strong>Brief ID:</strong> {number}{' '}
              {copiedId === number ? (
                <Check size={14} weight="bold" className="text-emerald-500" />
              ) : (
                <CopySimple size={14} weight="bold" className="text-[#64748b]" />
              )}
            </button>
          ))}
        </div>
        {children}
      </div>
      {onEdit && (
        <button
          className="secondary-button"
          aria-label="แก้ไขบรีฟ"
          onClick={onEdit}
          style={{ position: 'absolute', top: '24px', right: '24px' }}
        >
          <NotePencil size={15} /> แก้ไข
        </button>
      )}
    </>
  );
}
