import { useState } from 'react';
import { ImageSquare, X, Storefront, CaretDown, Check } from '@phosphor-icons/react';
import { BRANDS } from '../../lib/brands.js';
import { Field } from '../../components/ui/Field.jsx';

export function CampaignBasicInformationFields({
  name,
  subtitle,
  brand,
  cover,
  owner,
  currentUser,
  onChange,
  errors,
  onCoverError,
}) {
  const [brandSearch, setBrandSearch] = useState(brand);
  const [isBrandOpen, setIsBrandOpen] = useState(false);
  const filteredBrands = BRANDS.filter((entry) =>
    entry.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );
  const handleChooseBrand = (entry) => {
    onChange('brand', entry.name);
    setBrandSearch(entry.name);
    setIsBrandOpen(false);
  };
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
        <Field label="Campaign Title" required>
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
        <Field label="Campaign Subtitle" required>
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
      <div className="form-grid gap-6 mt-6 max-[760px]:gap-4">
        <Field label="Brand" required>
          <div className="autocomplete">
            <div className="input-with-icon">
              <Storefront />
              <input
                value={brandSearch}
                onFocus={() => setIsBrandOpen(true)}
                onChange={(event) => {
                  setBrandSearch(event.target.value);
                  onChange('brand', '');
                  setIsBrandOpen(true);
                }}
                placeholder="ค้นหา Brand ในระบบ"
              />
              <CaretDown />
            </div>
            {isBrandOpen && (
              <div className="autocomplete-menu">
                {filteredBrands.length ? (
                  filteredBrands.map((entry) => (
                    <button
                      type="button"
                      key={entry.name}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleChooseBrand(entry)}
                    >
                      {entry.image ? <img src={entry.image} alt="" /> : <Storefront />}
                      <span>{entry.name}</span>
                      {brand === entry.name && <Check />}
                    </button>
                  ))
                ) : (
                  <div className="no-result">ไม่พบ Brand</div>
                )}
              </div>
            )}
          </div>
        </Field>
        <Field label="Owner / Assign Buyer" required>
          <select value={owner} onChange={(event) => onChange('owner', event.target.value)}>
            {[
              ...new Set([
                owner,
                currentUser.email,
                'thanya@buddyreview.co',
                'nattaya@buddyreview.co',
                'itsariya@buddyreview.co',
              ]),
            ].map((email) => (
              <option key={email}>{email}</option>
            ))}
          </select>
        </Field>
      </div>
    </section>
  );
}
