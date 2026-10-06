import { normalizeProducts, validateProducts } from './productOptions.js';
import { ProductOptionFields } from './ProductOptionFields.jsx';
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CaretRight } from '@phosphor-icons/react';
import { BasicInformationFields } from '../../components/shared/BasicInformationFields.jsx';
import { BriefNumbersField, getBriefNumberChecks } from './BriefNumbersField.jsx';
import { BriefLogoField } from './BriefLogoField.jsx';
import { createBrief, getBriefById, updateBrief } from './briefApi.js';

export function BriefForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const brief = id ? getBriefById(id) : null;
  const isEditing = Boolean(brief);
  const backPath = isEditing ? `/briefs/${id}` : '/briefs';
  const title = isEditing ? 'แก้ไขบรีฟ' : 'สร้างบรีฟ';
  const [briefNumbers, setBriefNumbers] = useState(
    brief?.briefNumbers?.length ? brief.briefNumbers : [brief?.id ?? ''],
  );
  const [name, setName] = useState(brief?.name ?? '');
  const [brand, setBrand] = useState(brief?.brand ?? '');
  const [cover, setCover] = useState(brief?.image ?? '');
  const [products, setProducts] = useState(() => normalizeProducts(brief?.products));
  const [errors, setErrors] = useState({});
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    const cleanedBriefNumbers = briefNumbers.map((number) => number.trim());
    const numberErrors = cleanedBriefNumbers.map((number, index) => {
      if (!getBriefNumberChecks(number).every(Boolean))
        return 'กรุณาระบุหมายเลขรูปแบบ XXXYYYYMMNNN';
      if (cleanedBriefNumbers.indexOf(number) !== index) return 'หมายเลขบรีฟซ้ำในรายการ';
      const existingBrief = getBriefById(number);
      if (existingBrief && existingBrief.id !== brief?.id) return 'Brief ID นี้ถูกใช้งานแล้ว';
      return '';
    });
    if (numberErrors.some(Boolean)) nextErrors.briefNumbers = numberErrors;
    const trimmedBriefId = cleanedBriefNumbers[0];
    const productErrors = validateProducts(products);
    if (productErrors.some((error) => error.name || error.image))
      nextErrors.products = productErrors;
    if (!name.trim()) nextErrors.name = 'กรุณาระบุชื่อโปรเจกต์';
    if (!brand.trim()) nextErrors.brand = 'กรุณาระบุชื่อ Brand';
    if (!cover) nextErrors.cover = 'กรุณาเพิ่มรูป';
    if (errors.cover) nextErrors.cover = errors.cover;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const values = {
      id: trimmedBriefId,
      briefNumbers: cleanedBriefNumbers,
      name: name.trim(),
      brand: brand.trim(),
      image: cover,
      products,
    };
    if (isEditing) updateBrief(brief.id, values);
    else createBrief({ ...values, tone: 'new' });
    navigate(`/briefs/${trimmedBriefId}`);
    window.scrollTo(0, 0);
  }
  return (
    <form className="form-page lifecycle-form-page brief-reference-form" onSubmit={handleSubmit}>
      <header className="form-head">
        <div className="breadcrumbs">
          <Link to="/briefs" className="hover:text-[#5135ff] hover:underline transition-colors">
            รายการ Brief
          </Link>{' '}
          <CaretRight /> <b>{title}</b>
        </div>
        <button type="button" className="back-link" onClick={() => navigate(backPath)}>
          <ArrowLeft /> Back
        </button>
        <h1>{title}</h1>
      </header>
      <main className="form-wrap lifecycle-form max-w-[800px] gap-6 max-[760px]:gap-4">
        <section className="form-card prelist-section">
          <div className="grid grid-cols-1 gap-6 max-[760px]:gap-4">
            <BriefLogoField
              value={cover}
              error={errors.cover}
              onChange={(image) => {
                setCover(image);
                setErrors((current) => ({ ...current, cover: '' }));
              }}
              onError={(message) => setErrors((current) => ({ ...current, cover: message }))}
            />
            <BasicInformationFields
              isBrandFreeText
              name={name}
              setName={setName}
              brand={brand}
              setBrand={setBrand}
              cover={cover}
              setCover={setCover}
              errors={errors}
              coverField={<></>}
              onClearError={(field) => setErrors((current) => ({ ...current, [field]: '' }))}
              onCoverError={(message) => setErrors((current) => ({ ...current, cover: message }))}
            />
          </div>
        </section>
        <BriefNumbersField
          values={briefNumbers}
          errors={errors.briefNumbers}
          onChange={(numbers) => {
            setBriefNumbers(numbers);
            setErrors((current) => ({ ...current, briefNumbers: undefined }));
          }}
        />
        <ProductOptionFields
          products={products}
          errors={errors.products}
          onChange={(nextProducts) => {
            setProducts(nextProducts);
            setErrors((current) => ({ ...current, products: undefined }));
          }}
        />
      </main>
      <footer className="prelist-sticky">
        <div>
          <p>บันทึกบรีฟเพื่อใช้เป็นข้อมูลเริ่มต้นของประกาศ</p>
        </div>
        <div className="flex gap-2!">
          <button type="button" className="secondary-button" onClick={() => navigate(backPath)}>
            ยกเลิก
          </button>
          <button type="submit" className="primary">
            {isEditing ? 'บันทึกการแก้ไข' : 'สร้างบรีฟ'}
          </button>
        </div>
      </footer>
    </form>
  );
}
