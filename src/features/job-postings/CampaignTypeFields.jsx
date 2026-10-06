import { Circle, RadioButton } from '@phosphor-icons/react';

const CAMPAIGN_TYPES = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'แคมเปญทั่วไป นักรีวิวจะเห็นรายละเอียดแคมเปญตั้งแต่ขั้นตอนการสมัครเลย',
  },
  {
    value: 'confidential',
    label: 'Confidential campaign',
    description: 'เฉพาะนักรีวิวที่ผ่านการคัดเลือกเท่านั้น ที่เห็นรายละเอียดแคมเปญได้',
  },
  {
    value: 'private',
    label: 'Private campaign',
    description:
      'แคมเปญส่วนตัว ไม่เปิดรับสมัคร (ทีมงานต้องเป็นคนเลือกและจัดการงานแทนนักรีวิวเท่านั้น)',
  },
];

export function CampaignTypeFields({ value, onChange, embedded = false }) {
  return (
    <section className={embedded ? 'campaign-type-panel' : 'form-card campaign-type-panel'}>
      <h2>
        ประเภทแคมเปญ <b>*</b>
      </h2>
      <div className="grid grid-cols-1 gap-4">
        {CAMPAIGN_TYPES.map((type) => (
          <label
            key={type.value}
            className={`campaign-type-option ${value === type.value ? 'is-selected' : ''}`}
          >
            <input
              type="radio"
              name="campaign-type"
              value={type.value}
              checked={value === type.value}
              onChange={() => onChange(type.value)}
            />
            {value === type.value ? (
              <RadioButton aria-hidden="true" size={20} weight="fill" />
            ) : (
              <Circle aria-hidden="true" size={20} />
            )}
            <div>
              <span>{type.label}</span>
              <p>{type.description}</p>
            </div>
          </label>
        ))}
      </div>
    </section>
  );
}
