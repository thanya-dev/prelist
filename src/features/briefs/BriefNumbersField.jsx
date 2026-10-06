import { useRef } from 'react';
import { DotsSixVertical, Trash, Plus, CheckCircle } from '@phosphor-icons/react';

export function getBriefNumberChecks(value) {
  return [
    /^[A-Z]{3}/.test(value),
    /^[0-9]{4}$/.test(value.slice(3, 7)),
    /^(0[1-9]|1[0-2])$/.test(value.slice(7, 9)),
    /^[0-9]{3}$/.test(value.slice(9)) && value.length === 12,
  ];
}

export function BriefNumbersField({ values, onChange, errors = [] }) {
  const draggedIndex = useRef(null);
  function moveBrief(from, to) {
    if (from === null || to < 0 || to >= values.length || from === to) return;
    const next = [...values];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
  }
  return (
    <section className="brief-numbers" aria-label="Brief">
      <h3>Brief</h3>
      <p>หมายเลขบรีฟจากแบรนด์</p>
      {values.map((value, index) => (
        <div
          className="brief-number-entry"
          key={index}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            moveBrief(draggedIndex.current, index);
            draggedIndex.current = null;
          }}
        >
          <div className="brief-number-row">
            <button
              type="button"
              className="brief-number-drag"
              draggable
              aria-label={`เรียงลำดับบรีฟ ${index + 1}`}
              title="ลากเพื่อเรียงลำดับ หรือใช้ปุ่มลูกศรขึ้น/ลง"
              onDragStart={() => {
                draggedIndex.current = index;
              }}
              onDragEnd={() => {
                draggedIndex.current = null;
              }}
              onKeyDown={(event) => {
                if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                  event.preventDefault();
                  moveBrief(index, index + (event.key === 'ArrowUp' ? -1 : 1));
                }
              }}
            >
              <DotsSixVertical size={20} />
            </button>
            <span>{index + 1}.</span>
            <input
              aria-label={`Brief ID ${index + 1}`}
              value={value}
              placeholder="XXXYYYYMMNNN"
              aria-invalid={Boolean(errors[index])}
              onChange={(event) =>
                onChange(
                  values.map((number, position) =>
                    position === index ? event.target.value.toUpperCase().trim() : number,
                  ),
                )
              }
            />
            <button
              type="button"
              className="brief-number-delete"
              aria-label={`ลบบรีฟ ${index + 1}`}
              onClick={() =>
                onChange(
                  values.length === 1 ? [''] : values.filter((_, position) => position !== index),
                )
              }
            >
              <Trash size={20} weight="fill" />
            </button>
          </div>
          <div className="brief-number-checks">
            {['XXX: ตัวอักษร', 'YYYY: ปี ค.ศ.', 'MM: 01–12', 'NNN: 000–999'].map(
              (label, position) => (
                <span
                  key={label}
                  className={
                    value ? (getBriefNumberChecks(value)[position] ? 'is-valid' : 'is-invalid') : ''
                  }
                >
                  <CheckCircle size={16} />
                  {label}
                </span>
              ),
            )}
          </div>
          {errors[index] && (
            <p className="field-error" role="alert">
              {errors[index]}
            </p>
          )}
        </div>
      ))}
      <div className="brief-number-row brief-number-add">
        <DotsSixVertical size={20} />
        <span>{values.length + 1}.</span>
        <button type="button" onClick={() => onChange([...values, ''])}>
          <Plus size={18} /> เพิ่มบรีฟ
        </button>
      </div>
    </section>
  );
}
