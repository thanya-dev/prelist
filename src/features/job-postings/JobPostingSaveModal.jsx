import { useEffect, useRef } from 'react';
import { ArrowSquareOut, X } from '@phosphor-icons/react';

export function JobPostingSaveModal({ isEditing, onClose, onConfirm }) {
  const dialogRef = useRef(null);
  useEffect(() => {
    const previousFocus = document.activeElement;
    dialogRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
    }
    if (event.key === 'Tab') {
      const buttons = [...dialogRef.current.querySelectorAll('button')];
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (
        event.shiftKey &&
        (document.activeElement === first || document.activeElement === dialogRef.current)
      ) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className="posting-save-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="posting-save-title"
      >
        <button type="button" className="broadcast-close" onClick={onClose} aria-label="ปิด">
          <X size={22} />
        </button>
        <h2 id="posting-save-title" className="posting-save-title">
          {isEditing ? 'ยืนยันบันทึกการแก้ไข' : 'ยืนยันสร้างประกาศ'}
        </h2>
        <div className="posting-save-preview">
          <p style={{ marginBottom: '16px' }}>ตรวจสอบหน้าประกาศก่อนยืนยัน</p>
          <img
            src="/assets/preview.png"
            alt="Preview"
            style={{ width: '280px', maxWidth: '100%', height: 'auto', marginBottom: '16px' }}
          />
          <button
            type="button"
            className="primary posting-preview-button"
            onClick={() =>
              window.open(
                'https://www.buddyreview.co/campaign/EMr3CC9K56/preview',
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <ArrowSquareOut size={20} /> พรีวิวประกาศ
          </button>
          <small>เปิด Preview ในแท็บใหม่</small>
        </div>
        <footer className="posting-save-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            กลับไปแก้ไข
          </button>
          <button type="button" className="primary" onClick={onConfirm}>
            {isEditing ? 'ยืนยันบันทึกการแก้ไข' : 'ยืนยันสร้างประกาศ'}
          </button>
        </footer>
      </section>
    </div>
  );
}
