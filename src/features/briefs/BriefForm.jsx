import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CaretRight } from '@phosphor-icons/react';
import { BasicInformationFields } from '../../components/shared/BasicInformationFields.jsx';
import { createBrief, getBriefById, updateBrief } from './briefApi.js';

export function BriefForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const brief = id ? getBriefById(id) : null;
  const isEditing = Boolean(brief);
  const backPath = isEditing ? `/briefs/${id}` : '/briefs';
  const title = isEditing ? 'แก้ไขบรีฟ' : 'สร้างบรีฟ';
  const [name, setName] = useState(brief?.name ?? '');
  const [brand, setBrand] = useState(brief?.brand ?? '');
  const [cover, setCover] = useState(brief?.image ?? '');
  const [errors, setErrors] = useState({});
  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = 'กรุณาระบุชื่อโปรเจกต์';
    if (!brand) nextErrors.brand = 'กรุณาเลือก Brand';
    if (errors.cover) nextErrors.cover = errors.cover;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const briefId = brief?.id || `NRI${Date.now()}`;
    const values = { name: name.trim(), brand, image: cover };
    if (isEditing) updateBrief(briefId, values);
    else createBrief({ id: briefId, ...values, tone: 'new' });
    navigate(`/briefs/${briefId}`);
    window.scrollTo(0, 0);
  }
  return (
    <form className="form-page lifecycle-form-page" onSubmit={handleSubmit}>
      <header className="form-head">
        <div className="breadcrumbs">
          รายการ Brief <CaretRight /> <b>{title}</b>
        </div>
        <button type="button" className="back-link" onClick={() => navigate(backPath)}>
          <ArrowLeft /> Back
        </button>
        <h1>{title}</h1>
        <p className="form-subtitle">ข้อมูลพื้นฐานสำหรับเริ่มสร้างประกาศหานักรีวิว</p>
      </header>
      <main className="form-wrap lifecycle-form gap-6 max-[760px]:gap-4">
        <section className="form-card prelist-section">
          <div className="section-heading gap-3 mb-6">
            <span className="section-number">1</span>
            <div>
              <h2>Basic Information</h2>
              <p>ข้อมูลพื้นฐานสำหรับระบุโปรเจกต์และผู้รับผิดชอบ</p>
            </div>
          </div>
          <div className="form-grid gap-6 max-[760px]:gap-4">
            <BasicInformationFields
              name={name}
              setName={setName}
              brand={brand}
              setBrand={setBrand}
              cover={cover}
              setCover={setCover}
              errors={errors}
              onClearError={(field) => setErrors((current) => ({ ...current, [field]: '' }))}
              onCoverError={(message) => setErrors((current) => ({ ...current, cover: message }))}
            />
          </div>
        </section>
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
