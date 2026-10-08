import { CheckCircle } from '@phosphor-icons/react';

export function getBriefNumberChecks(value) {
  return [
    /^[A-Z]{3}/.test(value),
    /^[0-9]{4}$/.test(value.slice(3, 7)),
    /^(0[1-9]|1[0-2])$/.test(value.slice(7, 9)),
    /^[0-9]{3}$/.test(value.slice(9)) && value.length === 12,
  ];
}

export function BriefNumbersField({ values, onChange, errors = [] }) {
  const value = values[0] || '';
  return (
    <section className="brief-numbers" aria-label="Brief ID">
      <h3>
        Brief ID <span className="text-red-500">*</span>
      </h3>
      <p>หมายเลขบรีฟจากแบรนด์</p>
      <input
        className="w-full min-h-10 rounded-md border border-[#dce4ee] bg-white px-3 py-2 text-base text-[#475569]"
        aria-label="Brief ID"
        value={value}
        placeholder="XXXYYYYMMNNN"
        aria-invalid={Boolean(errors[0])}
        onChange={(event) => onChange([event.target.value.toUpperCase().trim()])}
      />
      <div className="brief-number-checks">
        {['XXX: ตัวอักษร', 'YYYY: ปี ค.ศ.', 'MM: 01–12', 'NNN: 000–999'].map((label, position) => (
          <span
            key={label}
            className={
              value ? (getBriefNumberChecks(value)[position] ? 'is-valid' : 'is-invalid') : ''
            }
          >
            <CheckCircle size={16} />
            {label}
          </span>
        ))}
      </div>
      {errors[0] && (
        <p className="field-error" role="alert">
          {errors[0]}
        </p>
      )}
    </section>
  );
}
