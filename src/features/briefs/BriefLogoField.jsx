import { Camera, Plus, X } from '@phosphor-icons/react';

export function BriefLogoField({ value, error, onChange, onError }) {
  function handleUpload(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      onError('กรุณาเลือกภาพ PNG, JPG, JPEG ขนาดไม่เกิน 3 MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => onChange(reader.result);
    reader.onerror = () => onError('ไม่สามารถอ่านรูปภาพได้ กรุณาลองอีกครั้ง');
    reader.readAsDataURL(file);
  }

  return (
    <div className="brief-logo-field">
      <label htmlFor="brief-logo-upload" className="brief-logo-label">
        โลโก้แบรนด์ <span>*</span>
      </label>
      <div className="brief-logo-preview">
        <label
          htmlFor="brief-logo-upload"
          className={`brief-logo-upload ${!value ? 'is-empty' : ''}`}
        >
          {value ? (
            <img src={value} alt="โลโก้แบรนด์" />
          ) : (
            <>
              <span className="brief-logo-camera" aria-hidden="true">
                <Camera size={28} weight="fill" />
                <Plus size={16} weight="bold" />
              </span>
              <span className="brief-logo-hint">รองรับรูปภาพแบบ PNG, JPG ขนาดไม่เกิน 3 MB</span>
            </>
          )}
        </label>
        {value && (
          <button
            type="button"
            className="brief-logo-remove"
            aria-label="ลบโลโก้แบรนด์"
            onClick={() => onChange('')}
          >
            <X size={16} />
          </button>
        )}
      </div>
      <input
        id="brief-logo-upload"
        className="sr-only"
        type="file"
        accept=".png,.jpg,.jpeg,image/png,image/jpeg"
        onChange={handleUpload}
        aria-invalid={Boolean(error)}
        aria-describedby={!value || error ? 'brief-logo-error' : undefined}
      />
      {(!value || error) && (
        <p id="brief-logo-error" className="brief-logo-error" role={error ? 'alert' : undefined}>
          {error || 'กรุณาเพิ่มรูป'}
        </p>
      )}
    </div>
  );
}
