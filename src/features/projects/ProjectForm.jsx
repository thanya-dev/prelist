import { useState } from 'react';
import {
  ArrowLeft,
  CalendarBlank,
  CaretDown,
  CaretRight,
  Check,
  FileText,
  Folder,
  ImageSquare,
  LinkSimple,
  Storefront,
  TrendUp,
  UsersThree,
  WarningCircle,
} from '@phosphor-icons/react';
import { Field } from '../../components/ui/Field.jsx';
import { BRANDS } from '../../lib/brands.js';
import { PLATFORM_CONTENT_TYPES } from '../../lib/platformContentTypes.js';
import { PROJECT_STATUS_FLOW } from './projectStatuses.js';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { ChoiceButton } from '../../components/ui/ChoiceButton.jsx';
export function ProjectForm({ project, onBack, onSave }) {
  const isEditing = Boolean(project);
  const [status, setStatus] = useState(project?.status || 'Draft');
  const [name, setName] = useState(project?.name || '');
  const [brand, setBrand] = useState(project?.brand || '');
  const [brandSearch, setBrandSearch] = useState(project?.brand || '');
  const [brandOpen, setBrandOpen] = useState(false);
  const [cover, setCover] = useState(project?.image || '');
  const [owner, setOwner] = useState(project?.owner || 'thanya@buddyreview.co');
  const [platforms, setPlatforms] = useState(project?.platforms || []);
  const [contentTypes, setContentTypes] = useState(project?.contentTypes || []);
  const [target, setTarget] = useState(project?.target || 1);
  const [gender, setGender] = useState('');
  const [ageMin, setAgeMin] = useState('');
  const [ageMax, setAgeMax] = useState('');
  const [followerMin, setFollowerMin] = useState('');
  const [followerMax, setFollowerMax] = useState('');
  const [brief, setBrief] = useState(project?.brief || '');
  const [startDate, setStartDate] = useState(project?.startDate || '');
  const [endDate, setEndDate] = useState(project?.endDate || '');
  const [deadline, setDeadline] = useState(project?.deadline || '');
  const [compensation, setCompensation] = useState(project?.compensation || '');
  const [budgetMin, setBudgetMin] = useState(project?.budgetMin || '');
  const [budgetMax, setBudgetMax] = useState(project?.budgetMax || '');
  const [benefit, setBenefit] = useState(project?.benefit || '');
  const [briefLink, setBriefLink] = useState(project?.briefLink || '');
  const [projectId, setProjectId] = useState(
    project?.id || `PRJ20260900${Math.floor(Math.random() * 80 + 20)}`,
  );
  const [quotation, setQuotation] = useState(project?.quote || '');
  const [briefNumber, setBriefNumber] = useState('');
  const [group, setGroup] = useState('');
  const [assignPM, setAssignPM] = useState('aareeya@buddyreview.co');
  const [targetPost, setTargetPost] = useState('');
  const [targetReach, setTargetReach] = useState('');
  const [totalCost, setTotalCost] = useState('');
  const [contingencyCost, setContingencyCost] = useState('0');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(
    project?.status === 'On Going' || project?.status === 'Complete' ? 2 : 1,
  );
  const fullProject = status === 'On Going' || status === 'Complete';
  const paid = compensation === 'มีค่าจ้าง' || compensation === 'ค่าจ้าง + สินค้า / Benefit';
  const hasBenefit =
    compensation === 'สินค้า / Benefit เท่านั้น' || compensation === 'ค่าจ้าง + สินค้า / Benefit';
  const availableContentTypes = [
    ...new Set(platforms.flatMap((platform) => PLATFORM_CONTENT_TYPES[platform] || [])),
  ];
  const filteredBrands = BRANDS.filter((item) =>
    item.name.toLowerCase().includes(brandSearch.toLowerCase()),
  );
  const togglePlatform = (platform) => {
    const next = platforms.includes(platform)
      ? platforms.filter((item) => item !== platform)
      : [...platforms, platform];
    const validTypes = new Set(next.flatMap((item) => PLATFORM_CONTENT_TYPES[item] || []));
    setPlatforms(next);
    setContentTypes((current) => current.filter((item) => validTypes.has(item)));
    setErrors((current) => ({
      ...current,
      platforms: '',
      contentTypes: '',
    }));
  };
  const toggleContent = (content) => {
    setContentTypes((current) =>
      current.includes(content)
        ? current.filter((item) => item !== content)
        : [...current, content],
    );
    setErrors((current) => ({
      ...current,
      contentTypes: '',
    }));
  };
  const chooseBrand = (item) => {
    setBrand(item.name);
    setBrandSearch(item.name);
    setBrandOpen(false);
    setErrors((current) => ({
      ...current,
      brand: '',
    }));
  };
  const uploadCover = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (
      ![/image\/png/, /image\/jpeg/].some((pattern) => pattern.test(file.type)) ||
      file.size > 3 * 1024 * 1024
    ) {
      setErrors((current) => ({
        ...current,
        cover: 'รองรับเฉพาะ PNG, JPG, JPEG ขนาดไม่เกิน 3 MB',
      }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setCover(reader.result);
    reader.readAsDataURL(file);
    setErrors((current) => ({
      ...current,
      cover: '',
    }));
  };
  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = 'กรุณากรอกชื่อโปรเจกต์';
    if (!brand) next.brand = 'กรุณาเลือก Brand';
    if (!owner) next.owner = 'กรุณาเลือก Owner / Assign Buyer';
    if (!platforms.length) next.platforms = 'เลือกอย่างน้อย 1 Platform';
    if (!contentTypes.length) next.contentTypes = 'เลือกอย่างน้อย 1 Content Type';
    if (!target || Number(target) < 1) next.target = 'จำนวน Influencer ต้องอย่างน้อย 1 คน';
    if (!brief.trim()) next.brief = 'กรุณากรอก Short Brief';
    if (!compensation) next.compensation = 'กรุณาเลือก Compensation Type';
    if (startDate && endDate && endDate < startDate) next.date = 'End Date ต้องไม่ก่อน Start Date';
    if (deadline && startDate && deadline > startDate)
      next.deadline = 'Application Deadline ต้องไม่หลัง Working / Event Date';
    if (paid && budgetMin && budgetMax && Number(budgetMax) < Number(budgetMin))
      next.budget = 'Maximum ต้องมากกว่าหรือเท่ากับ Minimum';
    if (ageMin && ageMax && Number(ageMax) < Number(ageMin))
      next.age = 'Age Max ต้องมากกว่าหรือเท่ากับ Age Min';
    if (followerMin && followerMax && Number(followerMax) < Number(followerMin))
      next.follower = 'Follower Max ต้องมากกว่าหรือเท่ากับ Follower Min';
    if (fullProject) {
      if (!projectId.trim()) next.projectId = 'กรุณากรอก Project ID';
      if (!quotation.trim()) next.quotation = 'กรุณากรอกเลขที่ใบเสนอราคา';
      if (!assignPM) next.assignPM = 'กรุณาเลือก Assign PM';
      if (!targetPost || Number(targetPost) < 1) next.targetPost = 'กรุณากรอก Target Post';
      if (!totalCost) next.totalCost = 'กรุณากรอก Total Project Cost';
    }
    setErrors(next);
    if (Object.keys(next).length) {
      if (
        next.name ||
        next.brand ||
        next.owner ||
        next.platforms ||
        next.contentTypes ||
        next.target ||
        next.brief ||
        next.compensation ||
        next.date ||
        next.deadline ||
        next.budget ||
        next.age ||
        next.follower
      ) {
        setStep(1);
        setTimeout(
          () =>
            window.scrollTo({
              top: 90,
              behavior: 'smooth',
            }),
          50,
        );
      } else {
        setStep(2);
        setTimeout(
          () =>
            window.scrollTo({
              top: 90,
              behavior: 'smooth',
            }),
          50,
        );
      }
    }
    return !Object.keys(next).length;
  };
  const handleSubmit = () => {
    if (!validate()) return;
    onSave({
      ...project,
      id: projectId,
      quote: quotation,
      name,
      brand,
      owner,
      status,
      image: cover || '',
      tone: project?.tone || 'new',
      platforms,
      contentTypes,
      target: Number(target),
      brief,
      startDate,
      endDate,
      deadline,
      compensation,
      budgetMin,
      budgetMax,
      benefit,
      briefLink,
      fullData: fullProject,
      briefNumber,
      group,
      assignPM,
      targetPost,
      targetReach,
      totalCost,
      contingencyCost,
    });
  };
  return (
    <div className="form-page lifecycle-form-page">
      <header className="form-head">
        <div className="breadcrumbs">
          Projects <CaretRight /> <b>{isEditing ? 'Edit Project' : 'Create Project'}</b>
        </div>
        <button className="back-link" onClick={onBack}>
          <ArrowLeft /> Back
        </button>
        <h1>{isEditing ? 'Edit Project' : 'Create Project'}</h1>
        <p className="form-subtitle">
          เริ่มจากข้อมูลที่จำเป็น และเติมข้อมูล Project เต็มเมื่อพร้อมดำเนินงาน
        </p>
      </header>
      <main className="form-wrap lifecycle-form gap-6 max-[760px]:gap-4">
        <section className="form-card status-selector-card">
          <div className="section-heading gap-3 mb-6">
            <div>
              <span className="section-kicker">PROJECT LIFECYCLE</span>
              <h2>สถานะโปรเจกต์</h2>
              <p>ข้อมูลที่ต้องกรอกจะปรับตามสถานะที่เลือก</p>
            </div>
          </div>
          <div className="status-stepper">
            {PROJECT_STATUS_FLOW.map((item, index) => (
              <button
                type="button"
                key={item}
                className={status === item ? 'active' : ''}
                onClick={() => {
                  setStatus(item);
                  setStep(item === 'On Going' || item === 'Complete' ? 2 : 1);
                }}
              >
                <span>{index + 1}</span>
                <div>
                  <b>{item}</b>
                  <small>
                    {item === 'Draft'
                      ? 'ร่างข้อมูล'
                      : item === 'On Going'
                        ? 'เริ่มดำเนินงาน'
                        : 'เสร็จสิ้น'}
                  </small>
                </div>
              </button>
            ))}
          </div>
          {step === 2 && (
            <div className="status-notice">
              <WarningCircle weight="fill" />
              <div>
                <b>สถานะนี้ถือเป็น Project ที่เริ่มดำเนินงาน</b>
                <span>กรุณากรอกข้อมูล Project Setup เพิ่มเติมก่อนบันทึก</span>
              </div>
            </div>
          )}
        </section>

        {step === 1 && (
          <>
            <section className="form-card prelist-section">
              <div className="section-heading gap-3 mb-6">
                <span className="section-number">1</span>
                <div>
                  <h2>Basic Information</h2>
                  <p>ข้อมูลพื้นฐานสำหรับระบุโปรเจกต์และผู้รับผิดชอบ</p>
                </div>
              </div>
              <div className="form-grid gap-6 max-[760px]:gap-4">
                <Field label="Project Name" required>
                  <input
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        name: '',
                      }));
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
                              <img src={item.image} alt="" />
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
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                      onChange={uploadCover}
                    />
                  </label>
                  {errors.cover && <small className="field-error">{errors.cover}</small>}
                </Field>
                <Field label="Owner / Assign Buyer" required>
                  <select value={owner} onChange={(event) => setOwner(event.target.value)}>
                    <option>thanya@buddyreview.co</option>
                    <option>nattaya@buddyreview.co</option>
                    <option>itsariya@buddyreview.co</option>
                  </select>
                  {errors.owner && <small className="field-error">{errors.owner}</small>}
                </Field>
              </div>
            </section>

            <section className="form-card prelist-section">
              <div className="section-heading gap-3 mb-6">
                <span className="section-number">2</span>
                <div>
                  <h2>Creator Requirement</h2>
                  <p>ระบุ Creator ที่ต้องการสำหรับงานนี้</p>
                </div>
              </div>
              <Field label="Platform" required>
                <div className="choice-grid platform-grid gap-2">
                  {Object.keys(PLATFORM_CONTENT_TYPES).map((item) => (
                    <ChoiceButton
                      key={item}
                      ariaLabel={item}
                      selected={platforms.includes(item)}
                      onClick={() => togglePlatform(item)}
                    >
                      <PlatformLogo platform={item} />
                      {item}
                    </ChoiceButton>
                  ))}
                </div>
                {errors.platforms && <small className="field-error">{errors.platforms}</small>}
              </Field>
              <Field
                label="Content Type"
                required
                hint={
                  platforms.length
                    ? 'ตัวเลือกจะแสดงตาม Platform ที่เลือก'
                    : 'เลือก Platform ก่อนเพื่อดู Content Type'
                }
              >
                <div className="choice-grid content-grid gap-2">
                  {availableContentTypes.map((item) => (
                    <ChoiceButton
                      key={item}
                      selected={contentTypes.includes(item)}
                      onClick={() => toggleContent(item)}
                    >
                      {item}
                    </ChoiceButton>
                  ))}
                </div>
                {errors.contentTypes && (
                  <small className="field-error">{errors.contentTypes}</small>
                )}
              </Field>
              <Field
                label="Target Influencer"
                required
                hint="จำนวน Influencer ที่ต้องการสำหรับงานนี้"
              >
                <div className="input-with-unit">
                  <UsersThree />
                  <input
                    type="number"
                    min="1"
                    value={target}
                    onChange={(event) => setTarget(event.target.value)}
                  />
                  <span>คน</span>
                </div>
                {errors.target && <small className="field-error">{errors.target}</small>}
              </Field>
              <div className="criteria-box">
                <h3>
                  Creator Criteria <span>Optional</span>
                </h3>
                <div className="criteria-grid">
                  <Field label="Gender">
                    <select value={gender} onChange={(event) => setGender(event.target.value)}>
                      <option value="">ไม่ระบุ</option>
                      <option>หญิง</option>
                      <option>ชาย</option>
                      <option>ทุกเพศ</option>
                    </select>
                  </Field>
                  <Field label="Age Min / Max">
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={ageMin}
                        onChange={(event) => setAgeMin(event.target.value)}
                      />
                      <span>–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={ageMax}
                        onChange={(event) => setAgeMax(event.target.value)}
                      />
                    </div>
                    {errors.age && <small className="field-error">{errors.age}</small>}
                  </Field>
                  <Field label="Follower Min / Max">
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="Min"
                        value={followerMin}
                        onChange={(event) => setFollowerMin(event.target.value)}
                      />
                      <span>–</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={followerMax}
                        onChange={(event) => setFollowerMax(event.target.value)}
                      />
                    </div>
                    {errors.follower && <small className="field-error">{errors.follower}</small>}
                  </Field>
                </div>
              </div>
            </section>

            <section className="form-card prelist-section">
              <div className="section-heading gap-3 mb-6">
                <span className="section-number">3</span>
                <div>
                  <h2>Job Information</h2>
                  <p>ข้อมูลสั้นๆ ที่ Creator ต้องรู้ก่อนตัดสินใจ</p>
                </div>
              </div>
              <Field
                label="Short Brief"
                required
                hint="สรุปรายละเอียดงานที่ Influencer ต้องรู้ก่อนตัดสินใจว่าสนใจหรือไม่"
              >
                <div className="rich-field">
                  <div className="rich-toolbar">
                    <button type="button">
                      <b>B</b>
                    </button>
                    <button type="button">
                      <i>I</i>
                    </button>
                    <button type="button">• List</button>
                  </div>
                  <textarea
                    maxLength="500"
                    value={brief}
                    onChange={(event) => {
                      setBrief(event.target.value);
                      setErrors((current) => ({
                        ...current,
                        brief: '',
                      }));
                    }}
                    placeholder="เช่น เข้าร่วมกิจกรรม Dyson On The Go ที่มหาวิทยาลัยกรุงเทพ และโพสต์ TikTok Video 1 คลิป"
                  />
                  <span className="char-count">{brief.length}/500</span>
                </div>
                {errors.brief && <small className="field-error">{errors.brief}</small>}
              </Field>
              <div className="date-grid">
                <Field label="Working / Event Date">
                  <div className="date-pair">
                    <div>
                      <small>Start Date</small>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(event) => setStartDate(event.target.value)}
                      />
                    </div>
                    <div>
                      <small>End Date</small>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(event) => setEndDate(event.target.value)}
                      />
                    </div>
                  </div>
                  {errors.date && <small className="field-error">{errors.date}</small>}
                </Field>
                <Field label="Application Deadline" hint="วันที่ปิดรับ Influencer ที่สนใจ">
                  <div className="input-with-icon">
                    <CalendarBlank />
                    <input
                      type="date"
                      value={deadline}
                      onChange={(event) => setDeadline(event.target.value)}
                    />
                  </div>
                  {errors.deadline && <small className="field-error">{errors.deadline}</small>}
                </Field>
              </div>
            </section>

            <section className="form-card prelist-section">
              <div className="section-heading gap-3 mb-6">
                <span className="section-number">4</span>
                <div>
                  <h2>Compensation</h2>
                  <p>สิ่งที่ Creator จะได้รับจากการร่วมงาน</p>
                </div>
              </div>
              <Field label="Compensation Type" required>
                <div className="choice-grid compensation-grid gap-2">
                  {[
                    'มีค่าจ้าง',
                    'ไม่มีค่าจ้าง',
                    'สินค้า / Benefit เท่านั้น',
                    'ค่าจ้าง + สินค้า / Benefit',
                  ].map((item) => (
                    <ChoiceButton
                      key={item}
                      selected={compensation === item}
                      onClick={() => {
                        setCompensation(item);
                        setErrors((current) => ({
                          ...current,
                          compensation: '',
                        }));
                      }}
                    >
                      {item}
                    </ChoiceButton>
                  ))}
                </div>
                {errors.compensation && (
                  <small className="field-error">{errors.compensation}</small>
                )}
              </Field>
              {paid && (
                <Field label="Budget Range">
                  <div className="budget-range">
                    <div>
                      <small>Minimum</small>
                      <input
                        type="number"
                        placeholder="1,000"
                        value={budgetMin}
                        onChange={(event) => setBudgetMin(event.target.value)}
                      />
                    </div>
                    <span>–</span>
                    <div>
                      <small>Maximum</small>
                      <input
                        type="number"
                        placeholder="2,000"
                        value={budgetMax}
                        onChange={(event) => setBudgetMax(event.target.value)}
                      />
                    </div>
                    <b>THB</b>
                  </div>
                  {errors.budget && <small className="field-error">{errors.budget}</small>}
                </Field>
              )}
              {hasBenefit && (
                <Field label="Product / Benefit Detail">
                  <textarea
                    className="simple-textarea"
                    value={benefit}
                    onChange={(event) => setBenefit(event.target.value)}
                    placeholder="เช่น Dyson Airwrap มูลค่า 19,900 บาท"
                  />
                </Field>
              )}
            </section>

            <section className="form-card prelist-section">
              <div className="section-heading gap-3 mb-6">
                <span className="section-number">5</span>
                <div>
                  <h2>Reference Brief</h2>
                  <p>แนบลิงก์ข้อมูลเพิ่มเติมได้โดยยังไม่ต้องอัปโหลด Full Brief</p>
                </div>
              </div>
              <Field label="Brief Link">
                <div className="input-with-icon">
                  <LinkSimple />
                  <input
                    type="url"
                    value={briefLink}
                    onChange={(event) => setBriefLink(event.target.value)}
                    placeholder="https://..."
                  />
                </div>
                <small className="field-help">
                  รองรับ Google Docs, Google Slides และ External URL
                </small>
              </Field>
            </section>
          </>
        )}

        {step === 2 && (
          <section className="form-card prelist-section full-project-section">
            <div className="section-heading gap-3 mb-6">
              <span className="section-number full">
                <Folder weight="fill" />
              </span>
              <div>
                <span className="section-kicker">REQUIRED FOR {status.toUpperCase()}</span>
                <h2>Project Setup</h2>
                <p>ข้อมูลส่วนนี้จำเป็นเมื่อ Project เริ่มดำเนินงานหรือเสร็จสิ้น</p>
              </div>
            </div>
            <div className="form-grid gap-6 max-[760px]:gap-4">
              <Field label="Project ID" required>
                <input value={projectId} onChange={(event) => setProjectId(event.target.value)} />
                {errors.projectId && <small className="field-error">{errors.projectId}</small>}
              </Field>
              <Field label="Assign PM" required>
                <select value={assignPM} onChange={(event) => setAssignPM(event.target.value)}>
                  <option>aareeya@buddyreview.co</option>
                  <option>prin@buddyreview.co</option>
                  <option>itsariya@buddyreview.co</option>
                </select>
                {errors.assignPM && <small className="field-error">{errors.assignPM}</small>}
              </Field>
              <Field label="Quotation" required>
                <input
                  value={quotation}
                  onChange={(event) => setQuotation(event.target.value)}
                  placeholder="QO2026090023"
                />
                {errors.quotation && <small className="field-error">{errors.quotation}</small>}
              </Field>
              <Field label="Brief Number">
                <input
                  value={briefNumber}
                  onChange={(event) => setBriefNumber(event.target.value)}
                  placeholder="NRI202609058"
                />
              </Field>
              <Field label="Group">
                <input
                  value={group}
                  onChange={(event) => setGroup(event.target.value)}
                  placeholder="เช่น Q1, January, Phase 1"
                />
              </Field>
              <Field label="Target Post" required>
                <div className="input-with-unit">
                  <FileText />
                  <input
                    type="number"
                    min="1"
                    value={targetPost}
                    onChange={(event) => setTargetPost(event.target.value)}
                  />
                  <span>โพสต์</span>
                </div>
                {errors.targetPost && <small className="field-error">{errors.targetPost}</small>}
              </Field>
              <Field label="Target Reach">
                <div className="input-with-unit">
                  <TrendUp />
                  <input
                    type="number"
                    min="0"
                    value={targetReach}
                    onChange={(event) => setTargetReach(event.target.value)}
                  />
                  <span>Reach</span>
                </div>
              </Field>
              <Field label="Total Project Cost" required>
                <div className="input-with-unit no-leading">
                  <input
                    type="number"
                    min="0"
                    value={totalCost}
                    onChange={(event) => setTotalCost(event.target.value)}
                  />
                  <span>บาท</span>
                </div>
                {errors.totalCost && <small className="field-error">{errors.totalCost}</small>}
              </Field>
              <Field label="Contingency Cost">
                <div className="input-with-unit no-leading">
                  <input
                    type="number"
                    min="0"
                    value={contingencyCost}
                    onChange={(event) => setContingencyCost(event.target.value)}
                  />
                  <span>บาท</span>
                </div>
              </Field>
            </div>
          </section>
        )}
      </main>
      <footer className="prelist-sticky">
        <div>
          <span className={`lifecycle-status ${status.toLowerCase().replaceAll(' ', '-')}`}>
            {status}
          </span>
          <p>
            {step === 2
              ? 'บันทึกแล้ว Project จะอยู่ในสถานะดำเนินงาน'
              : 'ข้อมูลเบื้องต้นสำหรับเริ่มหา Influencer'}
          </p>
        </div>
        <div className="flex gap-2">
          {step === 1 ? (
            <>
              <button className="secondary-button" onClick={onBack}>
                ยกเลิก
              </button>
              <button
                className="secondary-button"
                onClick={handleSubmit}
                style={{
                  background: 'white',
                  borderColor: '#dfe5ed',
                  color: '#414141',
                }}
              >
                บันทึก {status}
              </button>
              <button
                className="primary"
                onClick={() => {
                  if (status === 'Draft') setStatus('On Going');
                  setStep(2);
                  window.scrollTo(0, 0);
                }}
              >
                ถัดไป (Project Setup)
              </button>
            </>
          ) : (
            <>
              <button
                className="secondary-button"
                onClick={() => {
                  setStep(1);
                  window.scrollTo(0, 0);
                }}
              >
                ย้อนกลับ
              </button>
              <button className="primary" onClick={handleSubmit}>
                {isEditing ? 'บันทึกการแก้ไข' : 'สร้างโปรเจกต์'}
              </button>
            </>
          )}
        </div>
      </footer>
    </div>
  );
}
