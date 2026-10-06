import { Field } from '../../components/ui/Field.jsx';
import { normalizeProducts } from '../briefs/productOptions.js';

const COMPENSATION_OPTIONS = [
  'มีค่าจ้าง',
  'ไม่มีค่าจ้าง',
  'สินค้า / Benefit เท่านั้น',
  'ค่าจ้าง + สินค้า / Benefit',
];

export function CompensationFields({
  compensation,
  onCompensationChange,
  budgetMin,
  budgetMax,
  onBudgetMinChange,
  onBudgetMaxChange,
  benefit,
  benefitSource,
  benefitProduct,
  products,
  onBenefitChange,
  onBenefitSourceChange,
  onBenefitProductChange,
  error,
}) {
  const briefProducts = normalizeProducts(products);
  const selectedProductIndex = briefProducts.findIndex(
    (product) => product.name === benefitProduct?.name && product.image === benefitProduct?.image,
  );
  const handleProductChange = (event) => {
    if (event.target.value === 'saved') return;
    if (event.target.value === 'other') {
      onBenefitSourceChange('other');
      onBenefitProductChange(null);
      onBenefitChange('');
      return;
    }
    const product = briefProducts[Number(event.target.value)];
    onBenefitSourceChange('brief');
    onBenefitProductChange(product);
    onBenefitChange([product.name, product.description].filter(Boolean).join('\n'));
  };
  return (
    <fieldset className="m-0 min-w-0 border-0 p-0">
      <legend className="mb-3 text-sm font-medium">
        Compensation Type <b className="text-red-500">*</b>
      </legend>
      {error && (
        <p className="field-error mb-3" role="alert">
          {error}
        </p>
      )}
      <div className="grid gap-4">
        {COMPENSATION_OPTIONS.map((option) => {
          const isSelected = compensation === option;
          const isPaid = option === 'มีค่าจ้าง' || option === 'ค่าจ้าง + สินค้า / Benefit';
          const hasBenefit =
            option === 'สินค้า / Benefit เท่านั้น' || option === 'ค่าจ้าง + สินค้า / Benefit';
          return (
            <section
              key={option}
              className={`overflow-hidden rounded-lg border border-solid ${isSelected ? 'border-[#80bfff] bg-[#f4faff]' : 'border-line bg-white'}`}
            >
              <label className="flex cursor-pointer items-center gap-3 p-4 text-base">
                <input
                  type="radio"
                  name="compensation"
                  value={option}
                  checked={isSelected}
                  onChange={() => onCompensationChange(option)}
                  className="accent-[#3296ed]"
                />
                {option}
              </label>
              {isSelected && (isPaid || hasBenefit) && (
                <div className="grid gap-6 border-0 border-t border-solid border-[#d9eafa] p-4 max-[760px]:gap-4">
                  {isPaid && (
                    <div className="grid gap-2">
                      <span className="text-sm font-medium">Budget Range</span>
                      <div className="grid grid-cols-[1fr_16px_1fr] items-end gap-2">
                        <label className="field grid gap-2 text-sm font-normal">
                          Minimum (THB)
                          <input
                            type="number"
                            min="0"
                            value={budgetMin}
                            onChange={(event) => onBudgetMinChange(event.target.value)}
                            placeholder="1,000"
                          />
                        </label>
                        <span className="pb-3 text-center">–</span>
                        <label className="field grid gap-2 text-sm font-normal">
                          Maximum (THB)
                          <input
                            type="number"
                            min="0"
                            value={budgetMax}
                            onChange={(event) => onBudgetMaxChange(event.target.value)}
                            placeholder="2,000"
                          />
                        </label>
                      </div>
                    </div>
                  )}
                  {hasBenefit && (
                    <div className="grid gap-4">
                      <Field label="Product / Benefit Detail">
                        <select
                          aria-label="เลือกสินค้า / Benefit"
                          value={
                            benefitSource === 'brief'
                              ? selectedProductIndex < 0
                                ? 'saved'
                                : String(selectedProductIndex)
                              : 'other'
                          }
                          onChange={handleProductChange}
                        >
                          <option value="other">อื่นๆ — กรอกรายละเอียดเอง</option>
                          {benefitSource === 'brief' && selectedProductIndex < 0 && (
                            <option value="saved">
                              {benefitProduct?.name || 'สินค้าที่บันทึกไว้'}
                            </option>
                          )}
                          {briefProducts.map((product, index) => (
                            <option key={index} value={index}>
                              {product.name || `สินค้า ${index + 1}`}
                            </option>
                          ))}
                        </select>
                      </Field>
                      {!briefProducts.length && (
                        <p className="m-0 text-sm text-muted">
                          บรีฟนี้ยังไม่มีรายการสินค้า สามารถกรอกอื่นๆ ได้
                        </p>
                      )}
                      {benefitSource === 'brief' ? (
                        <div className="flex items-start gap-4 rounded-lg border border-solid border-line bg-white p-4">
                          {benefitProduct?.image && (
                            <img
                              src={benefitProduct.image}
                              alt={benefitProduct.name}
                              className="h-16 w-16 shrink-0 object-contain"
                            />
                          )}
                          <div className="min-w-0">
                            <p className="m-0 font-medium break-words">{benefitProduct?.name}</p>
                            <p className="mt-2 mb-0 whitespace-pre-wrap break-words text-sm text-muted">
                              {benefitProduct?.description || 'ยังไม่ระบุรายละเอียด'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <Field label="รายละเอียดสินค้า / Benefit อื่นๆ">
                          <textarea
                            className="simple-textarea"
                            value={benefit}
                            onChange={(event) => onBenefitChange(event.target.value)}
                            placeholder="ระบุสินค้าหรือสิทธิประโยชน์ที่จะได้รับ"
                          />
                        </Field>
                      )}
                    </div>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </fieldset>
  );
}
