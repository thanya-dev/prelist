import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from '@phosphor-icons/react';
import { JobPostingForm } from './JobPostingForm.jsx';

export function JobPostingFormModal({ postingId, briefId, copyFromId, onClose, onSave }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    const pageRoot = document.getElementById('root');
    const previousInert = pageRoot?.inert;
    if (pageRoot) pageRoot.inert = true;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      if (pageRoot) pageRoot.inert = previousInert;
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, []);
  const handleKeyDown = (event) => {
    if (event.target.closest('.posting-save-dialog')) return;
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
    if (event.key !== 'Tab') return;
    const controls = [
      ...dialogRef.current.querySelectorAll(
        'button, input, select, textarea, a[href], [contenteditable="true"], [tabindex="0"]',
      ),
    ].filter((control) => !control.disabled && control.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (
      event.shiftKey &&
      (document.activeElement === first || document.activeElement === dialogRef.current)
    ) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };
  return createPortal(
    <div
      className="modal-backdrop posting-form-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="posting-form-modal-title"
        className="posting-form-dialog"
        onKeyDown={handleKeyDown}
      >
        <header className="posting-form-modal-header">
          <h2 id="posting-form-modal-title">{postingId ? 'แก้ไขประกาศ' : (copyFromId ? 'ทำสำเนาประกาศ' : 'สร้างประกาศ')}</h2>
          <button className="icon-btn" type="button" aria-label="ปิดฟอร์มประกาศ" onClick={onClose}>
            <X size={22} />
          </button>
        </header>
        <JobPostingForm postingId={postingId} briefId={briefId} copyFromId={copyFromId} onClose={onClose} onSave={onSave} />
      </section>
    </div>,
    document.body,
  );
}
