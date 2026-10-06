import { useRef, useState } from 'react';
import { Plus, Trash, Camera, DotsSixVertical, X } from '@phosphor-icons/react';
export function ProductOptionFields({ products, onChange, errors = [] }) {
  const draggedIndex = useRef(null);
  const [uploadErrors, setUploadErrors] = useState({});
  function updateProduct(index, changes) {
    onChange(
      products.map((product, position) =>
        position === index ? { ...product, ...changes } : product,
      ),
    );
  }
  function moveProduct(from, to) {
    if (from === null || to < 0 || to >= products.length || from === to) return;
    const next = [...products];
    next.splice(to, 0, next.splice(from, 1)[0]);
    onChange(next);
    setUploadErrors({});
  }
  function uploadProduct(event, index) {
    const file = event.target.files?.[0];
    if (!file) return;
    event.target.value = '';
    if (
      !['image/png', 'image/jpeg', 'image/avif'].includes(file.type) ||
      file.size > 3 * 1024 * 1024
    ) {
      setUploadErrors((current) => ({
        ...current,
        [index]: 'รองรับ PNG, JPG, AVIF, JPEG ขนาดไม่เกิน 3 MB',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      updateProduct(index, { image: reader.result });
      setUploadErrors((current) => ({ ...current, [index]: '' }));
    };
    reader.onerror = () =>
      setUploadErrors((current) => ({
        ...current,
        [index]: 'อ่านรูปภาพไม่สำเร็จ กรุณาลองอีกครั้ง',
      }));
    reader.readAsDataURL(file);
  }
  return (
    <section className="form-card posting-product-options">
      <h2>Product option</h2>
      <p>
        รายการสินค้าที่นักรีวิวจะใช้เพื่อทำการรีวิว (นักรีวิวสามารถกดเลือกได้หลังจากกดสมัครแคมเปญ)
      </p>
      {products.map((product, index) => (
        <div
          className="brief-product-row"
          key={index}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            moveProduct(draggedIndex.current, index);
            draggedIndex.current = null;
          }}
        >
          <button
            type="button"
            draggable
            className="brief-product-drag"
            aria-label={`เรียงลำดับสินค้า ${index + 1}`}
            onDragStart={() => {
              draggedIndex.current = index;
            }}
            onDragEnd={() => {
              draggedIndex.current = null;
            }}
            onKeyDown={(event) => {
              if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
                event.preventDefault();
                moveProduct(index, index + (event.key === 'ArrowUp' ? -1 : 1));
              }
            }}
          >
            <DotsSixVertical size={18} />
          </button>
          <span>{index + 1}.</span>
          <div className="brief-product-card">
            <button
              type="button"
              className="brief-product-delete"
              aria-label={`ลบสินค้า ${index + 1}`}
              onClick={() => {
                onChange(products.filter((_, position) => position !== index));
                setUploadErrors({});
              }}
            >
              <Trash size={20} weight="fill" />
            </button>
            <div className="brief-product-image-field">
              <label htmlFor={`product-image-${index}`}>
                รูปสินค้า <em>*</em>
              </label>
              <div className="brief-product-image">
                <label htmlFor={`product-image-${index}`} className="brief-product-upload">
                  {product.image ? (
                    <img src={product.image} alt={product.name || 'รูปสินค้า'} />
                  ) : (
                    <>
                      <span className="brief-logo-camera">
                        <Camera size={28} weight="fill" />
                        <Plus size={16} weight="bold" />
                      </span>
                      <span>
                        รองรับไฟล์รูปภาพ
                        <br />
                        <b>PNG, JPG, AVIF, JPEG</b>
                        <br />
                        ขนาดไม่เกิน 3 MB
                      </span>
                    </>
                  )}
                </label>
                {product.image && (
                  <button
                    type="button"
                    className="brief-product-image-remove"
                    aria-label={`ลบรูปสินค้า ${index + 1}`}
                    onClick={() => updateProduct(index, { image: '' })}
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              {(uploadErrors[index] || errors[index]?.image) && (
                <small className="field-error" role="alert">
                  {uploadErrors[index] || errors[index].image}
                </small>
              )}
              {product.isLegacy && !product.image && (
                <small className="text-muted">สินค้าเดิมยังไม่มีรูป</small>
              )}
              <input
                className="sr-only"
                id={`product-image-${index}`}
                type="file"
                accept=".png,.jpg,.jpeg,.avif,image/png,image/jpeg,image/avif"
                onChange={(event) => uploadProduct(event, index)}
              />
            </div>
            <div className="brief-product-fields">
              <label className="field">
                <span>
                  ชื่อสินค้า <em>*</em>
                </span>
                <input
                  aria-label={`ชื่อสินค้า ${index + 1}`}
                  value={product.name}
                  placeholder="เช่น LUNA ลำโพงพกพา, ข้าวโอ๊ตแผ่นอบ 400 กรัม"
                  aria-invalid={Boolean(errors[index]?.name)}
                  onChange={(event) => updateProduct(index, { name: event.target.value })}
                />
                {errors[index]?.name && (
                  <small className="field-error" role="alert">
                    {errors[index].name}
                  </small>
                )}
              </label>
              <label className="field">
                <span>รายละเอียด</span>
                <textarea
                  aria-label={`รายละเอียดสินค้า ${index + 1}`}
                  rows={4}
                  value={product.description}
                  placeholder="รายละเอียดสินค้า"
                  onChange={(event) => updateProduct(index, { description: event.target.value })}
                />
              </label>
            </div>
          </div>
        </div>
      ))}
      <div className="brief-product-row brief-product-add">
        <DotsSixVertical size={18} />
        <span>{products.length + 1}.</span>
        <button
          type="button"
          onClick={() => onChange([...products, { name: '', image: '', description: '' }])}
        >
          <Plus size={18} /> เพิ่ม product
        </button>
      </div>
    </section>
  );
}
