import { Field } from '../../components/ui/Field.jsx';

export function ConfidentialInformationFields({ title, subtitle, onChange, errors }) {
  return (
    <section
      className="form-card campaign-basic-panel"
      aria-label="ข้อมูลสำหรับนักรีวิวที่รอคัดเลือกหรือไม่ผ่านการคัดเลือก"
    >
      <h2 className="m-0 mb-6 text-lg font-semibold leading-relaxed">
        ข้อมูลที่แสดงสำหรับ{' '}
        <span className="text-[#dfa025]">นักรีวิวที่รอคัดเลือกหรือไม่ผ่านการคัดเลือก</span>
      </h2>
      <div className="mb-6 flex flex-col items-center gap-4">
        <span className="text-base font-medium">โลโก้แบรนด์</span>
        <img
          src="https://manage.buddyreview.co/_next/static/media/logo-m-color.94a8241e.svg"
          alt="Buddy Review"
          className="h-32 w-32 object-contain"
        />
      </div>
      <div className="grid gap-6">
        <Field label="Campaign Title" required error={errors.confidentialTitle}>
          <input
            aria-label="Campaign Title สำหรับนักรีวิวที่รอคัดเลือก"
            value={title}
            onChange={(event) => onChange('confidentialTitle', event.target.value)}
            placeholder="Title name"
            aria-invalid={Boolean(errors.confidentialTitle)}
          />
        </Field>
        <Field label="Campaign Subtitle" required error={errors.confidentialSubtitle}>
          <input
            aria-label="Campaign Subtitle สำหรับนักรีวิวที่รอคัดเลือก"
            value={subtitle}
            onChange={(event) => onChange('confidentialSubtitle', event.target.value)}
            placeholder="Subtitle name"
            aria-invalid={Boolean(errors.confidentialSubtitle)}
          />
        </Field>
      </div>
    </section>
  );
}
