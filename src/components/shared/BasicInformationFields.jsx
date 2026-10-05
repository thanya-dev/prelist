import { useState } from 'react';
import { CaretDown, Check, ImageSquare, Storefront } from '@phosphor-icons/react';
import { Field } from '../ui/Field.jsx';
import { BRANDS } from '../../lib/brands.js';

export function BasicInformationFields({
  name,
  setName,
  brand,
  setBrand,
  cover,
  setCover,
  errors,
  onClearError,
  onCoverError,
}) {
  const [brandSearch, setBrandSearch] = useState(brand);
  const [brandOpen, setBrandOpen] = useState(false);
  const filteredBrands = BRANDS.filter((brand) =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );
  const chooseBrand = (item) => {
    setBrand(item.name);
    setBrandSearch(item.name);
    setBrandOpen(false);
    onClearError('brand');
  };
  const uploadCover = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!['image/png', 'image/jpeg'].includes(file.type) || file.size > 3 * 1024 * 1024) {
      onCoverError('กรุณาเลือกภาพ PNG, JPG, JPEG ขนาดไม่เกิน 3 MB');
      event.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
    onClearError('cover');
  };
  return (
    <>
      <Field label="Project Name" required>
        <input
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            onClearError('name');
          }}
          placeholder="เช่น Dyson On The Go University Roadshow"
        />
        {errors.name && <small className="field-error">{errors.name}</small>}
      </Field>
      <Field label="Brand" required>
        <div className="autocomplete">
          <div className="input-with-icon">
            <Storefront />
            <input
              value={brandSearch}
              onFocus={() => setBrandOpen(true)}
              onChange={(event) => {
                setBrandSearch(event.target.value);
                setBrand('');
                setBrandOpen(true);
              }}
              placeholder="ค้นหา Brand ในระบบ"
            />
            <CaretDown />
          </div>
          {brandOpen && (
            <div className="autocomplete-menu">
              {filteredBrands.length ? (
                filteredBrands.map((item) => (
                  <button
                    type="button"
                    key={item.name}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => chooseBrand(item)}
                  >
                    {item.image ? <img src={item.image} alt="" /> : <Storefront />}
                    <span>{item.name}</span>
                    {brand === item.name && <Check />}
                  </button>
                ))
              ) : (
                <div className="no-result">ไม่พบ Brand</div>
              )}
            </div>
          )}
        </div>
        {errors.brand && <small className="field-error">{errors.brand}</small>}
      </Field>
      <Field label="Cover Image" hint="PNG, JPG, JPEG ขนาดไม่เกิน 3 MB">
        <label className={`cover-upload ${cover ? 'has-image' : ''}`}>
          {cover ? (
            <img src={cover} alt="Cover preview" />
          ) : (
            <>
              <ImageSquare />
              <span>อัปโหลดภาพหน้าปก</span>
              <small>คลิกเพื่อเลือกไฟล์</small>
            </>
          )}
          <input type="file" accept=".png,.jpg,.jpeg,image/png,image/jpeg" onChange={uploadCover} />
        </label>
        {errors.cover && <small className="field-error">{errors.cover}</small>}
      </Field>
    </>
  );
}
