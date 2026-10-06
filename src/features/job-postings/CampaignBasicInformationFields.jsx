import { ImageSquare, X } from '@phosphor-icons/react';
import { Field } from '../../components/ui/Field.jsx';

export function CampaignBasicInformationFields({
  isConfidential = false,
  name,
  subtitle,
  cover,
  onChange,
  errors,
  onCoverError,
}) {
  const handleUploadCover = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      onCoverError('กรุณาเลือกภาพ PNG, JPG, JPEG ขนาดไม่เกิน 3 MB');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange('cover', reader.result);
    reader.readAsDataURL(file);
    event.target.value = '';
    onCoverError('');
  };
  return (
    <section className="form-card campaign-basic-panel" aria-label="Basic Information">
      {isConfidential && (
        <h2 className="m-0 mb-6 text-lg font-semibold leading-relaxed">
          ข้อมูลที่แสดงสำหรับ <span className="text-[#3186d7]">นักรีวิวที่ผ่านการคัดเลือก</span>
          เท่านั้น
        </h2>
      )}
      <div className="campaign-logo-field">
        <label htmlFor="campaign-logo-upload">
          โลโก้แบรนด์ <b>*</b>
        </label>
        <div className="campaign-logo-preview">
          <label htmlFor="campaign-logo-upload" className="campaign-logo-upload">
            {cover ? (
              <img src={cover} alt="โลโก้แบรนด์" />
            ) : (
              <span>
                <ImageSquare size={32} />
                อัปโหลดโลโก้
              </span>
            )}
          </label>
          {cover && (
            <button
              type="button"
              className="campaign-logo-remove"
              aria-label="ลบโลโก้แบรนด์"
              onClick={() => onChange('cover', '')}
            >
              <X size={20} />
            </button>
          )}
        </div>
        <input
          id="campaign-logo-upload"
          className="sr-only"
          type="file"
          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
          onChange={handleUploadCover}
        />
        {!cover && <small>PNG, JPG, JPEG ขนาดไม่เกิน 3 MB</small>}
        {errors.cover && (
          <small className="field-error" role="alert">
            {errors.cover}
          </small>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <Field label={isConfidential ? 'Confidential campaign Title' : 'Campaign Title'} required>
          <input
            value={name}
            onChange={(event) => onChange('name', event.target.value)}
            placeholder="ระบุชื่อแคมเปญ"
          />
          {errors.name && (
            <small className="field-error" role="alert">
              {errors.name}
            </small>
          )}
        </Field>
        <Field
          label={isConfidential ? 'Confidential Campaign Subtitle' : 'Campaign Subtitle'}
          required
        >
          <input
            value={subtitle}
            onChange={(event) => onChange('subtitle', event.target.value)}
            placeholder="เช่น Facebook (Follower 3K-1M)"
          />
          {errors.subtitle && (
            <small className="field-error" role="alert">
              {errors.subtitle}
            </small>
          )}
        </Field>
      </div>
    </section>
  );
}
