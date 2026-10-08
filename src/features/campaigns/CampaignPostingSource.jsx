import { getBriefById } from '../briefs/briefApi.js';
import { useState } from 'react';
import {
  LinkSimple,
  ArrowSquareOut,
  MagnifyingGlass,
  X,
  CaretLeft,
  CaretRight,
  CheckCircle,
} from '@phosphor-icons/react';
import { getJobPostings } from '../job-postings/jobPostingApi.js';
import { getBriefs } from '../briefs/briefApi.js';

import { Field } from '../../components/ui/Field.jsx';

const PAGE_SIZE = 6;

export function CampaignPostingSource({
  project,
  sourcePostings = [],
  onSelect,
  briefId,
  onBriefChange,
  error,
  selectRef,
}) {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const postings = getJobPostings();
  const briefs = getBriefs();
  const briefIds = [
    ...new Set(
      (project.briefNumbers || [project.briefNumber])
        .filter(Boolean)
        .map((briefId) => getBriefById(briefId)?.id || briefId),
    ),
  ];
  const linkedPostings = postings.filter((posting) => posting.brief === briefId);
  const selectedIds = new Set(sourcePostings.map((posting) => posting.id));
  const search = query.trim().toLocaleLowerCase();
  const filteredPostings = linkedPostings.filter((posting) =>
    [posting.name, posting.id, posting.brand, posting.brief].some((value) =>
      String(value || '')
        .toLocaleLowerCase()
        .includes(search),
    ),
  );
  const pageCount = Math.max(1, Math.ceil(filteredPostings.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visiblePostings = filteredPostings.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleToggle(posting) {
    onSelect(
      selectedIds.has(posting.id)
        ? sourcePostings.filter((selectedPosting) => selectedPosting.id !== posting.id)
        : [...sourcePostings, posting],
    );
  }

  return (
    <section className="cw-panel cw-source-panel">
      <h3>
        <LinkSimple size={20} /> ข้อมูลจากประกาศ
      </h3>
      <p>เลือกได้หลายประกาศจาก Brief ที่ PM กำหนดไว้ในโปรเจกต์นี้</p>
      {!briefIds.length && (
        <p>โปรเจกต์นี้ยังไม่มี Brief ID กรุณาให้ PM เพิ่ม Brief ID ในโปรเจกต์ก่อนเลือกประกาศ</p>
      )}
      {briefIds.length > 0 && (
        <Field label="Brief ID">
          <select
            value={briefId}
            onChange={(event) => {
              onBriefChange(event.target.value);
              setQuery('');
              setPage(1);
            }}
          >
            <option value="">เลือก Brief ID</option>
            {briefIds.map((id) => (
              <option key={id} value={id}>
                {id}
                {briefs.find((brief) => brief.id === id)?.name
                  ? ` — ${briefs.find((brief) => brief.id === id).name}`
                  : ''}
              </option>
            ))}
          </select>
        </Field>
      )}

      {(briefId || sourcePostings.length > 0) && (
        <div ref={selectRef} className="cw-posting-picker">
          <div className="flex items-center justify-between gap-3 mb-2">
            <span className="text-sm font-medium" id="posting-picker-label">
              เลือกประกาศ <em>*</em>
            </span>
            <span className="cw-picker-count" aria-live="polite">
              <CheckCircle size={16} /> เลือกแล้ว {sourcePostings.length}
            </span>
          </div>
          <div className="cw-picker-box">
            <div className="cw-picker-search">
              <MagnifyingGlass size={18} aria-hidden="true" />
              <input
                aria-label="ค้นหาประกาศ"
                placeholder="ค้นหาชื่อประกาศ หรือ Job ID"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setPage(1);
                }}
              />
              {query && (
                <button
                  type="button"
                  aria-label="ล้างคำค้น"
                  onClick={() => {
                    setQuery('');
                    setPage(1);
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="cw-picker-tabs">
              <div className="flex items-center gap-3 py-2">
                <label className="flex items-center gap-2 cursor-pointer font-medium hover:text-[#1a202c]">
                  <input
                    type="checkbox"
                    className="m-0 h-4 w-4 shrink-0"
                    style={{ accentColor: '#3286d3', marginTop: '2px' }}
                    checked={
                      visiblePostings.length > 0 &&
                      visiblePostings.every((p) => selectedIds.has(p.id))
                    }
                    onChange={() => {
                      const visibleIds = new Set(visiblePostings.map((p) => p.id));
                      const allVisibleSelected = visiblePostings.every((p) =>
                        selectedIds.has(p.id),
                      );
                      if (allVisibleSelected) {
                        onSelect(sourcePostings.filter((p) => !visibleIds.has(p.id)));
                      } else {
                        const newSelections = visiblePostings.filter((p) => !selectedIds.has(p.id));
                        onSelect([...sourcePostings, ...newSelections]);
                      }
                    }}
                  />
                  เลือกหน้านี้
                </label>
                <span className="text-muted border-l border-gray-300 pl-3">
                  ทั้งหมด {linkedPostings.length} ประกาศ
                </span>
              </div>
              {sourcePostings.length > 0 && (
                <button type="button" className="cw-picker-clear" onClick={() => onSelect([])}>
                  ล้างที่เลือก
                </button>
              )}
            </div>
            <div
              className="cw-picker-list"
              role="group"
              aria-labelledby="posting-picker-label"
              aria-describedby={error ? 'source-posting-error' : undefined}
            >
              {visiblePostings.map((posting) => (
                <div
                  key={posting.id}
                  className={`cw-picker-row ${selectedIds.has(posting.id) ? 'is-selected' : ''}`}
                >
                  <label className="cw-picker-option">
                    <input
                      type="checkbox"
                      checked={selectedIds.has(posting.id)}
                      onChange={() => handleToggle(posting)}
                    />

                    <span className="cw-picker-copy">
                      <span className="cw-picker-title">{posting.name}</span>
                      <span className="cw-picker-meta">
                        {posting.subtitle && <span className="block">{posting.subtitle}</span>}
                        {posting.id} · นักรีวิวที่ลูกค้าเลือก:{' '}
                        {posting.reviewers || Math.floor((posting.applicants || 0) * 0.4)} คน
                      </span>
                    </span>
                  </label>
                  <a
                    href={`/job-postings/${posting.id}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`ดูประกาศ ${posting.name}`}
                    title="ดูประกาศต้นทาง"
                  >
                    <ArrowSquareOut size={18} />
                  </a>
                </div>
              ))}
              {!visiblePostings.length && (
                <div className="cw-picker-empty">
                  <p>{query ? 'ไม่พบประกาศที่ตรงกับคำค้น' : 'ยังไม่มีประกาศใน Brief นี้'}</p>
                  {query && (
                    <button
                      type="button"
                      onClick={() => {
                        setQuery('');
                        setPage(1);
                      }}
                    >
                      ล้างคำค้น
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="cw-picker-pagination">
              <span>
                {filteredPostings.length
                  ? `${(currentPage - 1) * PAGE_SIZE + 1}–${Math.min(currentPage * PAGE_SIZE, filteredPostings.length)} จาก ${filteredPostings.length} ประกาศ`
                  : '0 ประกาศ'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="ประกาศหน้าก่อนหน้า"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <CaretLeft size={16} />
                </button>
                <span>
                  {currentPage} / {pageCount}
                </span>
                <button
                  type="button"
                  aria-label="ประกาศหน้าถัดไป"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <CaretRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <p className="cw-picker-hint">
            ข้อมูลจากประกาศที่เลือกจะถูกนำมาใช้ในแคมเปญ และแก้ไขได้จากประกาศต้นทาง
          </p>
          {error && (
            <small id="source-posting-error" className="field-error mt-2 block" role="alert">
              {error}
            </small>
          )}
        </div>
      )}
    </section>
  );
}
