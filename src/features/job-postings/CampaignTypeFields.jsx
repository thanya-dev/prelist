import { Circle, RadioButton } from '@phosphor-icons/react';

const CAMPAIGN_TYPES = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'แคมเปญทั่วไป นักรีวิวจะเห็นรายละเอียดแคมเปญตั้งแต่ในตอนการสมัครเลย',
  },
  {
    value: 'confidential',
    label: 'Confidential campaign',
    description: 'เฉพาะนักรีวิวที่ผ่านการคัดเลือกเท่านั้น ที่เห็นรายละเอียดแคมเปญได้',
  },
];

export function CampaignTypeFields({ value, onChange }) {
  return (
    <section className="form-card campaign-type-panel">
      <h2>
        ประเภทแคมเปญ <b>*</b>
      </h2>
      <div className="grid grid-cols-2 gap-4 max-[760px]:grid-cols-1">
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
