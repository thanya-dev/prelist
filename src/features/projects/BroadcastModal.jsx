import { X } from '@phosphor-icons/react';
export function BroadcastModal({ message, onMessageChange, onClose, onConfirm }) {
  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="broadcast-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="broadcast-title"
      >
        <button className="broadcast-close" onClick={onClose} aria-label="ปิด">
          <X size={22} />
        </button>
        <h2 id="broadcast-title">Broadcast งาน</h2>
        <p className="broadcast-subtitle">ตรวจสอบรายละเอียดและข้อความก่อนส่งประกาศงาน</p>
        <div className="broadcast-summary">
          <span>ส่งผ่าน</span>
          <b>LINE OA Buddy Review</b>
        </div>
        <label className="broadcast-field">
          <span>ข้อความที่จะส่ง (แก้ไขได้)</span>
          <textarea value={message} onChange={(event) => onMessageChange(event.target.value)} />
        </label>
        <footer className="broadcast-actions">
          <button className="secondary-button" onClick={onClose}>
            ยกเลิก
          </button>
          <button className="broadcast-confirm" onClick={onConfirm}>
            ยืนยัน Broadcast
          </button>
        </footer>
      </section>
    </div>
  );
}
