import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { CaretDown, CaretRight, CaretUp, CheckCircle } from '@phosphor-icons/react';

const SELECTION_LABELS = { Accept: 'ลูกค้าเลือก', TeamAccept: 'ทีมงานเลือก' };

function formatSelectionDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('th-TH', {
    timeZone: 'Asia/Bangkok',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function BriefSelectionSummary({ summary }) {
  const buttonRef = useRef(null);
  const popoverRef = useRef(null);
  const [position, setPosition] = useState(null);
  const [isAppliedOpen, setIsAppliedOpen] = useState(false);
  const { customer, team, applied, selected } = summary;

  useEffect(() => {
    if (!position) return undefined;
    const close = () => setPosition(null);
    const handlePointer = (event) => {
      if (!popoverRef.current?.contains(event.target) && !buttonRef.current?.contains(event.target))
        close();
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        close();
        buttonRef.current?.focus();
      }
    };
    const handleScroll = (event) => {
      if (!popoverRef.current?.contains(event.target)) close();
    };
    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', close);
    };
  }, [position]);

  if (!selected.length) {
    return applied.length ? (
      <p className="brief-selection-applied">สมัครประกาศอื่นในบรีฟนี้ {applied.length} งาน</p>
    ) : null;
  }

  const handleToggle = () => {
    if (position) return setPosition(null);
    const rect = buttonRef.current.getBoundingClientRect();
    const width = Math.min(360, window.innerWidth - 32);
    const left = Math.max(16, Math.min(rect.left, window.innerWidth - width - 16));
    const spaceBelow = window.innerHeight - rect.bottom - 22;
    const spaceAbove = rect.top - 22;
    // Open upward when there is little room below, and keep the popover inside the viewport.
    setPosition(
      spaceBelow < 280 && spaceAbove > spaceBelow
        ? { bottom: window.innerHeight - rect.top + 6, left, width, maxHeight: spaceAbove }
        : { top: rect.bottom + 6, left, width, maxHeight: spaceBelow },
    );
    setIsAppliedOpen(false);
  };

  return (
    <div className="brief-selection">
      <button
        ref={buttonRef}
        type="button"
        className={`brief-selection-badge ${customer.length ? 'is-customer' : 'is-team'}`}
        aria-expanded={Boolean(position)}
        aria-haspopup="dialog"
        aria-label={`ถูกเลือกแล้วใน ${selected.length} ประกาศ: ลูกค้าเลือก ${customer.length}, ทีมงานเลือก ${team.length}`}
        onClick={handleToggle}
      >
        <CheckCircle size={16} weight="fill" aria-hidden="true" />
        ถูกเลือกแล้วใน {selected.length} ประกาศ
        <CaretRight size={12} weight="bold" aria-hidden="true" />
      </button>
      {position &&
        createPortal(
          <div
            ref={popoverRef}
            className="brief-selection-popover"
            role="dialog"
            aria-label="ประกาศที่ถูกเลือกแล้วในบรีฟนี้"
            style={position}
          >
            <h4>ถูกเลือกแล้วในบรีฟนี้</h4>
            <ul className="brief-selection-list">
              {selected.map(({ posting, status, date }) => (
                <li key={posting.id}>
                  <div>
                    <Link to={`/job-postings/${posting.id}`} target="_blank" rel="noreferrer">
                      {posting.id}
                    </Link>
                    <span className={`brief-selection-status is-${status.toLowerCase()}`}>
                      {SELECTION_LABELS[status]}
                    </span>
                  </div>
                  <p title={posting.name}>{posting.name}</p>
                  <small>ถูกเลือกเมื่อ {formatSelectionDate(date)}</small>
                </li>
              ))}
            </ul>
            {applied.length > 0 && (
              <>
                <button
                  type="button"
                  className="brief-selection-more"
                  aria-expanded={isAppliedOpen}
                  onClick={() => setIsAppliedOpen((current) => !current)}
                >
                  ดูงานที่สมัครอีก {applied.length} งาน
                  {isAppliedOpen ? <CaretUp size={12} /> : <CaretDown size={12} />}
                </button>
                {isAppliedOpen && (
                  <ul className="brief-selection-list is-applied">
                    {applied.map(({ posting }) => (
                      <li key={posting.id}>
                        <Link to={`/job-postings/${posting.id}`} target="_blank" rel="noreferrer">
                          {posting.id}
                        </Link>
                        <p title={posting.name}>{posting.name}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>,
          document.body,
        )}
    </div>
  );
}
