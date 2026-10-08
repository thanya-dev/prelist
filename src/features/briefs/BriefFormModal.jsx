import { useEffect, useRef, useState } from 'react';
import { X } from '@phosphor-icons/react';
import { Field } from '../../components/ui/Field.jsx';
import { getBriefNumberChecks } from './BriefNumbersField.jsx';
import { createBrief, getBriefById, updateBrief } from './briefApi.js';

export function BriefFormModal({ brief = null, onClose, onSave }) {
  const dialogRef = useRef(null);
  const isEditing = Boolean(brief);
  const title = isEditing ? 'แก้ไขบรีฟ' : 'สร้างบรีฟ';
  const [briefNumbers, setBriefNumbers] = useState([brief?.id ?? '']);
  const [name, setName] = useState(brief?.name ?? '');
  const [errors, setErrors] = useState({});
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    dialogRef.current?.querySelector('input')?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);
  const handleKeyDown = (event) => {
    if (event.key === 'Escape') onClose();
    if (event.key === 'Tab') {
      const controls = [...dialogRef.current.querySelectorAll('input, button')];
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };
  function validateBriefNumber(number) {
    if (!number) return 'กรุณาระบุเลขบรีฟ';
    if (!getBriefNumberChecks(number).every(Boolean))
      return 'เลขบรีฟต้องมี 12 ตัว: ตัวอักษรอังกฤษ 3 ตัว + ปี ค.ศ. 4 หลัก + เดือน 01–12 + ลำดับ 3 หลัก';
    const existingBrief = getBriefById(number);
    if (existingBrief && existingBrief.id !== brief?.id) return 'เลขบรีฟนี้ถูกใช้งานแล้ว';
    return '';
  }
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const cleanedBriefNumbers = briefNumbers.map((number) => number.trim());
    const numberErrors = cleanedBriefNumbers.map(validateBriefNumber);
    if (numberErrors.some(Boolean)) nextErrors.briefNumbers = numberErrors;
    const trimmedBriefId = cleanedBriefNumbers[0];
    if (!name.trim()) nextErrors.name = 'กรุณาระบุชื่อ Brief';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const values = {
      id: trimmedBriefId,
      briefNumbers: cleanedBriefNumbers,
      name: name.trim(),
    };
    setPendingValues(values);
    setIsConfirmOpen(true);
  }

  function handleConfirmSave() {
    if (isEditing) updateBrief(brief.id, pendingValues);
    else createBrief({ ...pendingValues, tone: 'new' });
    onSave(pendingValues.id);
  }
  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <form
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-modal-title"
        onKeyDown={handleKeyDown}
        onSubmit={handleSubmit}
        className="relative w-full max-w-[560px] max-h-[calc(100dvh-32px)] overflow-y-auto rounded-xl bg-white p-6 max-[500px]:p-4 shadow-xl"
      >
        <button type="button" className="broadcast-close" onClick={onClose} aria-label="ปิด">
          <X size={22} />
        </button>
        <h2 id="brief-modal-title" className="m-0 mb-6 pr-10 text-xl font-semibold">
          {title}
        </h2>
        <section className="grid grid-cols-1 gap-6 max-[760px]:gap-4">
          <Field
            label="เลขบรีฟ (Brief Number / Work Order ID)"
            required
            hint="รูปแบบ XXXYYYYMMNNN เช่น NRI202610001"
          >
            <input
              aria-label="Brief Number / Work Order ID"
              aria-invalid={Boolean(errors.briefNumbers?.[0])}
              aria-describedby="brief-number-validation"
              autoComplete="off"
              spellCheck={false}
              value={briefNumbers[0]}
              placeholder="NRI202610001"
              onChange={(event) => {
                const number = event.target.value.toUpperCase().trim();
                setBriefNumbers([number]);
                setErrors((current) => ({
                  ...current,
                  briefNumbers: [number ? validateBriefNumber(number) : ''],
                }));
              }}
              onBlur={() =>
                setErrors((current) => ({
                  ...current,
                  briefNumbers: [validateBriefNumber(briefNumbers[0])],
                }))
              }
            />
            <small
              id="brief-number-validation"
              aria-live="polite"
              className={errors.briefNumbers?.[0] ? 'field-error text-[#f05b60]' : 'text-muted'}
            >
              {errors.briefNumbers?.[0] ||
                'XXX: อังกฤษ 3 ตัว · YYYY: ปี ค.ศ. · MM: 01–12 · NNN: 000–999'}
            </small>
          </Field>
          <Field label="ชื่อบรีฟ (Brief Name)" required error={errors.name}>
            <input
              aria-label="Brief Name"
              aria-invalid={Boolean(errors.name)}
              value={name}
              placeholder="ระบุชื่อบรีฟ"
              onChange={(event) => {
                setName(event.target.value);
                setErrors((current) => ({ ...current, name: '' }));
              }}
            />
          </Field>
        </section>
        <footer className="flex items-center justify-between gap-3 border-t border-[#e5e7eb] mt-6 pt-4">
          <button type="button" className="secondary-button" onClick={onClose}>
            ยกเลิก
          </button>
          <button type="submit" className="primary">
            {isEditing ? 'บันทึกการแก้ไข' : 'สร้างบรีฟ'}
          </button>
        </footer>
      </form>
      {isConfirmOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => event.target === event.currentTarget && setIsConfirmOpen(false)}
          style={{ zIndex: 1000 }}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="posting-save-dialog relative w-full max-w-[400px] bg-white rounded-xl p-6 shadow-xl"
          >
            <button
              type="button"
              className="broadcast-close"
              onClick={() => setIsConfirmOpen(false)}
              aria-label="ปิด"
            >
              <X size={22} />
            </button>
            <h2 className="posting-save-title">
              {isEditing ? 'ยืนยันบันทึกการแก้ไข' : 'ยืนยันสร้างบรีฟ'}
            </h2>
            <div
              className="posting-save-preview"
              style={{ padding: '24px 0', textAlign: 'center' }}
            >
              <p>
                {isEditing
                  ? 'คุณต้องการบันทึกการแก้ไขบรีฟนี้ใช่หรือไม่?'
                  : 'คุณต้องการสร้างบรีฟใหม่ใช่หรือไม่?'}
              </p>
            </div>
            <footer className="posting-save-actions flex gap-3 justify-end mt-4">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setIsConfirmOpen(false)}
              >
                ยกเลิก
              </button>
              <button type="button" className="primary" onClick={handleConfirmSave}>
                ยืนยัน
              </button>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
}
