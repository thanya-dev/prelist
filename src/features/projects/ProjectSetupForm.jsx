import { useState } from 'react';
import { ArrowLeft, CaretRight, Check, FileText, TrendUp, Users, X } from '@phosphor-icons/react';
import { BrandMark } from '../../components/shared/BrandMark.jsx';
import { Field } from '../../components/ui/Field.jsx';
import { Repeater } from '../../components/shared/Repeater.jsx';
export function ProjectSetupForm({ project, onBack, onSave }) {
  const isEditing = Boolean(project);
  const [name, setName] = useState(project?.name || '');
  const [id, setId] = useState(project?.id || 'PRJ2026090023');
  const [pm, setPm] = useState(project?.owner || 'aareeya@buddyreview.co');
  const [quotes, setQuotes] = useState([project?.quote || 'QO2026090023']);
  const [briefs, setBriefs] = useState(['NRI202609058']);
  const [groups, setGroups] = useState(['']);
  const [influencers, setInfluencers] = useState('1');
  const [posts, setPosts] = useState('3');
  const [reach, setReach] = useState('0');
  const [cost, setCost] = useState('43000');
  const [contingency, setContingency] = useState('0');
  const [error, setError] = useState('');
  const handleSubmit = () => {
    if (!name.trim()) {
      setError('กรุณากรอกชื่อโปรเจกต์');
      document.querySelector('#project-name')?.focus();
      return;
    }
    onSave({
      id,
      quote: quotes[0],
      name,
      owner: pm,
      tone: isEditing ? project.tone : 'new',
      brand: name.slice(0, 12),
    });
  };
  return (
    <div className="form-page">
      <header className="form-head">
        <div className="breadcrumbs">
          Projects <CaretRight /> <b>{isEditing ? 'Edit Project' : 'Create Project'}</b>
        </div>
        <button className="back-link" onClick={onBack}>
          <ArrowLeft /> Back
        </button>
        <h1>{isEditing ? 'Edit Project' : 'Create Project'}</h1>
      </header>
      <main className="form-wrap">
        <section className="form-card identity-card">
          <Field label="โลโก้แบรนด์" required>
            <div className="upload">
              <BrandMark
                project={
                  project || {
                    tone: 'mascot',
                  }
                }
                large
              />
              <button>
                <X />
              </button>
            </div>
          </Field>
          <Field label="ชื่อโปรเจกต์" required>
            <input
              id="project-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError('');
              }}
              placeholder="เช่น Page Promotion Sale Here"
            />
            {error && <small className="error">{error}</small>}
          </Field>
          <Field label="Project ID" required>
            <input value={id} onChange={(event) => setId(event.target.value)} />
            <div className="validation">
              <Check /> YYYY: ปี ค.ศ. <Check /> MM: 01-12 <Check /> NNNN: 0000-8999
            </div>
          </Field>
          <Field label="Assign PM" required>
            <select value={pm} onChange={(event) => setPm(event.target.value)}>
              <option>aareeya@buddyreview.co</option>
              <option>prin@buddyreview.co</option>
              <option>itsariya@buddyreview.co</option>
            </select>
          </Field>
        </section>
        <Repeater
          title="ใบเสนอราคาของโปรเจกต์"
          subtitle="หมายเลขใบเสนอราคาที่ใช้ในการเสนอขายให้แบรนด์"
          value={quotes}
          setValue={setQuotes}
          placeholder="QO2026090023"
        />
        <Repeater
          title="Brief"
          subtitle="หมายเลขบรีฟจากแบรนด์"
          value={briefs}
          setValue={setBriefs}
          placeholder="NRI202609058"
          validation
        />
        <Repeater
          title="Group"
          subtitle="สำหรับโปรเจกต์แบบ Year Plan หรือโปรเจกต์ที่ต้องการจัดกลุ่มแคมเปญ"
          value={groups}
          setValue={setGroups}
          placeholder="เช่น Q1, January, Phase 1"
        />
        <h2 className="form-section-title">Goal & Budget</h2>
        <section className="form-card goals">
          <h3>Goal</h3>
          <p>เป้าหมายของโปรเจกต์ทั้งจำนวนอินฟลูเอนเซอร์ จำนวนโพสต์ และจำนวนการเข้าถึง</p>
          <Field label="Target Influencer" required>
            <div className="unit-input">
              <Users />
              <input
                type="number"
                value={influencers}
                onChange={(event) => setInfluencers(event.target.value)}
              />
              <span>คน</span>
            </div>
          </Field>
          <Field label="Target Post" required>
            <div className="unit-input">
              <FileText />
              <input
                type="number"
                value={posts}
                onChange={(event) => setPosts(event.target.value)}
              />
              <span>โพสต์</span>
            </div>
          </Field>
          <Field label="Target Reach">
            <div className="unit-input">
              <TrendUp />
              <input
                type="number"
                value={reach}
                onChange={(event) => setReach(event.target.value)}
              />
              <span>เข้าถึง</span>
            </div>
          </Field>
        </section>
        <section className="form-card goals">
          <h3>Budget</h3>
          <p>
            งบประมาณที่แบรนด์กำหนดสำหรับโปรเจกต์นี้ ครอบคลุมค่าใช้จ่ายต่างๆ เช่น ค่าอินฟลูเอนเซอร์
            ค่า Production และค่าโฆษณา
          </p>
          <Field label="Total project cost" required>
            <div className="unit-input no-icon">
              <input type="number" value={cost} onChange={(event) => setCost(event.target.value)} />
              <span>บาท</span>
            </div>
          </Field>
          <Field label="Contingency cost" required>
            <div className="unit-input no-icon">
              <input
                type="number"
                value={contingency}
                onChange={(event) => setContingency(event.target.value)}
              />
              <span>บาท</span>
            </div>
          </Field>
        </section>
      </main>
      <footer className="form-footer">
        <div className="audit-note">
          <span>สร้างเมื่อ 28/9/69 13:32</span> โดย aareeya@buddyreview.co{' '}
          <span>แก้ไขล่าสุด 28/9/69 14:47</span> โดย nattaya@buddyreview.co
        </div>
        <button className="primary save" onClick={handleSubmit}>
          {isEditing ? 'ยืนยันการแก้ไข' : 'สร้างโปรเจกต์'}
        </button>
      </footer>
    </div>
  );
}
