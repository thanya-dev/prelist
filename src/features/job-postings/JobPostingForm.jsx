import { JobPostingSaveModal } from './JobPostingSaveModal.jsx';
import { ConfidentialInformationFields } from './ConfidentialInformationFields.jsx';

import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarBlank,
  CaretRight,
  Check,
  Copy,
  LinkSimple,
} from '@phosphor-icons/react';
import { getJobPostingById, createJobPosting, updateJobPosting } from './jobPostingApi.js';
import { Field } from '../../components/ui/Field.jsx';
import { CampaignBasicInformationFields } from './CampaignBasicInformationFields.jsx';
import { CampaignTypeFields } from './CampaignTypeFields.jsx';
import { getBriefById } from '../briefs/briefApi.js';
import { getCurrentUser } from '../../lib/currentUser.js';
import {
  CreatorCriteriaFields,
  CONTENT_SCOPE_GROUPS,
  CREATOR_PLATFORM_CONTENT_TYPES,
} from './CreatorCriteriaFields.jsx';
import { CompensationFields } from './CompensationFields.jsx';
import { DAY_MS, parseDay } from '../../utils/formatDate.js';

const POSTING_STEPS = ['Setting', 'Creator Criteria', 'Job Information', 'Compensation'];
const POSTING_STEP_DESCRIPTIONS = [
  'ตั้งค่าบรีฟ',
  'ระบุ Creator ที่ต้องการสำหรับงานนี้',
  'ระบุข้อมูลประกาศและรายละเอียดงาน',
  'กำหนดค่าตอบแทน',
];

const normalizeFormDate = (value) => {
  const day = parseDay(value);
  return day === null ? '' : new Date(day * DAY_MS).toISOString().slice(0, 10);
};

export function JobPostingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const searchParams = new URLSearchParams(window.location.search);
  const sourcePosting =
    !id && searchParams.get('copyFrom') ? getJobPostingById(searchParams.get('copyFrom')) : null;
  const job = id
    ? getJobPostingById(id)
    : sourcePosting
      ? {
          ...sourcePosting,
          id: undefined,
          name: `${sourcePosting.name} (สำเนา)`,
          applicants: 0,
          viewerCount: 0,
          status: 'Draft',
        }
      : null;
  const isEditing = Boolean(id && job);
  const hasInitialValues = Boolean(job);
  const parentBriefId = job?.brief || new URLSearchParams(window.location.search).get('briefId');
  const parentBrief = getBriefById(parentBriefId);
  const currentUser = getCurrentUser();
  const backPath = isEditing
    ? `/job-postings/${id}`
    : parentBriefId
      ? `/briefs/${parentBriefId}`
      : '/briefs';
  const [name, setName] = useState(hasInitialValues ? (job.name ?? '') : (parentBrief?.name ?? ''));
  const [campaignType, setCampaignType] = useState(job?.campaignType ?? 'normal');
  const [subtitle, setSubtitle] = useState(job?.subtitle ?? '');
  const [confidentialTitle, setConfidentialTitle] = useState(job?.confidentialTitle ?? '');
  const [confidentialSubtitle, setConfidentialSubtitle] = useState(job?.confidentialSubtitle ?? '');
  const [brand, setBrand] = useState(
    hasInitialValues ? (job.brand ?? '') : (parentBrief?.brand ?? ''),
  );
  const [cover, setCover] = useState(
    hasInitialValues ? (job.image ?? '') : (parentBrief?.image ?? ''),
  );
  const [owner, setOwner] = useState(job?.owner ?? currentUser.email);
  const [platforms, setPlatforms] = useState(job?.platforms ?? []);
  const [contentTypes, setContentTypes] = useState(job?.contentTypes ?? []);
  const [target, setTarget] = useState(job?.reviewers ?? 1);
  const [genders, setGenders] = useState(
    job?.genders ?? (job?.gender === 'ทุกเพศ' ? ['ชาย', 'หญิง'] : job?.gender ? [job.gender] : []),
  );
  const [targetPost, setTargetPost] = useState(job?.targetPost ?? 0);
  const [targetGroup, setTargetGroup] = useState(job?.targetGroup ?? '');
  const [contentScope, setContentScope] = useState(
    job?.contentScope ??
      CONTENT_SCOPE_GROUPS.find((scope) =>
        job?.contentTypes?.some((type) => scope.types.includes(type)),
      )?.label ??
      '',
  );
  const [ageMin, setAgeMin] = useState(job?.ageMin ?? '');
  const [ageMax, setAgeMax] = useState(job?.ageMax ?? '');
  const [followerMin, setFollowerMin] = useState(job?.followerMin ?? '');
  const [followerMax, setFollowerMax] = useState(job?.followerMax ?? '');
  const [brief, setBrief] = useState(job?.shortBrief ?? '');
  const [startDate, setStartDate] = useState(normalizeFormDate(job?.startDate));
  const [endDate, setEndDate] = useState(normalizeFormDate(job?.endDate));
  const [applyStartDate, setApplyStartDate] = useState(normalizeFormDate(job?.applyStartDate));
  const [deadline, setDeadline] = useState(normalizeFormDate(job?.deadline));
  const [compensation, setCompensation] = useState(job?.compensation ?? '');
  const [budgetMin, setBudgetMin] = useState(job?.budgetMin ?? '');
  const [budgetMax, setBudgetMax] = useState(job?.budgetMax ?? '');
  const [benefit, setBenefit] = useState(job?.benefit ?? '');
  const [benefitSource, setBenefitSource] = useState(job?.benefitSource ?? 'other');
  const [benefitProduct, setBenefitProduct] = useState(job?.benefitProduct ?? null);
  const [briefLink, setBriefLink] = useState(job?.briefLink ?? '');
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const handleStep = (nextStep) => {
    setStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const togglePlatform = (platform) => {
    const next = platforms.includes(platform)
      ? platforms.filter((item) => item !== platform)
      : [...platforms, platform];
    const validTypes = new Set(next.flatMap((item) => CREATOR_PLATFORM_CONTENT_TYPES[item] || []));
    setPlatforms(next);
    const scope = CONTENT_SCOPE_GROUPS.find((scope) => scope.label === contentScope);
    if (scope && !scope.types.some((type) => validTypes.has(type))) setContentScope('');
    setContentTypes((current) =>
      scope
        ? scope.types.filter((type) => validTypes.has(type))
        : current.filter((item) => validTypes.has(item)),
    );
    setErrors((current) => ({
      ...current,
      platforms: '',
      contentTypes: '',
    }));
  };
  const handleSelectScope = (scope) => {
    const available = new Set(
      platforms.flatMap((platform) => CREATOR_PLATFORM_CONTENT_TYPES[platform] || []),
    );
    setContentScope(scope.label);
    setContentTypes(scope.types.filter((type) => available.has(type)));
    setErrors((current) => ({ ...current, contentTypes: '' }));
  };
  const handleCriteriaChange = (key, value) => {
    const setters = {
      target: setTarget,
      targetPost: setTargetPost,
      targetGroup: setTargetGroup,
      genders: setGenders,
      ageMin: setAgeMin,
      ageMax: setAgeMax,
      followerMin: setFollowerMin,
      followerMax: setFollowerMax,
    };
    setters[key](value);
    setErrors((current) => ({ ...current, [key]: '', gender: '', age: '', follower: '' }));
  };
  const handleBasicInformationChange = (field, value) => {
    const setters = {
      name: setName,
      subtitle: setSubtitle,
      brand: setBrand,
      cover: setCover,
      owner: setOwner,
    };
    setters[field](value);
    setErrors((current) => ({ ...current, [field]: '' }));
  };
  const handleSubmit = (isDraft = false) => {
    setIsSaveModalOpen(false);
    if (!name.trim()) {
      setErrors({ name: 'กรุณาระบุชื่อประกาศ' });
      handleStep(1);
      return;
    }
    if (!isDraft) {
      const nextErrors = {};
      if (campaignType === 'confidential') {
        if (!confidentialTitle.trim()) nextErrors.confidentialTitle = 'กรุณากรอก Campaign title';
        if (!confidentialSubtitle.trim())
          nextErrors.confidentialSubtitle = 'กรุณากรอก Campaign subtitle';
      }
      if (!owner.trim()) nextErrors.owner = 'กรุณาเลือก Owner / Assign Buyer';
      if (!compensation) nextErrors.compensation = 'กรุณาเลือก Compensation Type';
      if (!cover) nextErrors.cover = 'กรุณาอัปโหลดโลโก้แบรนด์';
      if (!subtitle.trim()) nextErrors.subtitle = 'กรุณาระบุ Campaign Subtitle';
      if (!target || Number(target) < 1 || !Number.isInteger(Number(target)))
        nextErrors.target = 'ระบุจำนวนนักรีวิวอย่างน้อย 1 คน';
      if (targetPost === '' || Number(targetPost) < 0 || !Number.isInteger(Number(targetPost)))
        nextErrors.targetPost = 'ระบุจำนวนโพสต์ตั้งแต่ 0 ขึ้นไป';
      if (!genders.length) nextErrors.gender = 'กรุณาเลือกเพศ';
      if (ageMin === '' || ageMax === '' || Number(ageMin) < 0 || Number(ageMax) < Number(ageMin))
        nextErrors.age = 'ระบุช่วงอายุ MIN และ MAX ให้ถูกต้อง';
      if (
        followerMin === '' ||
        followerMax === '' ||
        Number(followerMin) < 0 ||
        Number(followerMax) < Number(followerMin)
      )
        nextErrors.follower = 'ระบุช่วงผู้ติดตาม MIN และ MAX ให้ถูกต้อง';
      if (!platforms.length) nextErrors.platforms = 'เลือกอย่างน้อย 1 ช่องทางรีวิว';
      if (!contentTypes.length) nextErrors.contentTypes = 'กรุณาเลือกสโคปงาน';
      if (Object.keys(nextErrors).length) {
        setErrors(nextErrors);
        const errorStep = nextErrors.owner
          ? 0
          : ['target', 'targetPost', 'gender', 'age', 'follower', 'platforms', 'contentTypes'].some(
                (key) => nextErrors[key],
              )
            ? 1
            : nextErrors.cover ||
                nextErrors.subtitle ||
                nextErrors.confidentialTitle ||
                nextErrors.confidentialSubtitle
              ? 1
              : 3;
        handleStep(errorStep);
        return;
      }
    }
    const saved = {
      ...job,
      id: job?.id || `JOB${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim(),
      campaignType,
      confidentialTitle: confidentialTitle.trim(),
      confidentialSubtitle: confidentialSubtitle.trim(),
      brand,
      image: cover,
      owner,
      platforms,
      contentTypes,
      reviewers: Number(target),
      gender: genders.length === 2 ? 'ทุกเพศ' : genders[0] || '',
      genders,
      targetPost: targetPost === '' ? '' : Number(targetPost),
      targetGroup,
      contentScope,
      ageMin,
      ageMax,
      followerMin,
      followerMax,
      shortBrief: brief,
      startDate,
      endDate,
      applyStartDate,
      deadline,
      compensation,
      budgetMin,
      budgetMax,
      benefit,
      benefitSource,
      benefitProduct,
      briefLink,
      applicants: job?.applicants ?? 0,
      viewerCount: job?.viewerCount ?? 0,
      brief: parentBriefId ?? '',
      status: isDraft
        ? 'Draft'
        : job?.status === 'Draft' || job?.status === 'แบบร่าง'
          ? 'Published'
          : job?.status || 'Published',
      tone: job?.tone ?? 'new',
    };
    if (isDraft) {
      createJobPosting(saved);
      navigate(`/job-postings/${saved.id}`);
      return;
    }
    if (isEditing) updateJobPosting(id, saved);
    else createJobPosting(saved);
    navigate(`/job-postings/${saved.id}`);
  };
  return (
    <div className="form-page lifecycle-form-page job-posting-form">
      {isSaveModalOpen && (
        <JobPostingSaveModal
          isEditing={isEditing}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={() => handleSubmit()}
        />
      )}
      <header className="form-head">
        {isEditing && (
          <button
            type="button"
            className="posting-copy-button"
            onClick={() =>
              window.open(
                `/job-postings/create?copyFrom=${encodeURIComponent(id)}&briefId=${encodeURIComponent(parentBriefId || '')}`,
                '_blank',
                'noopener,noreferrer',
              )
            }
          >
            <Copy size={18} /> คัดลอกประกาศ
          </button>
        )}
        <div className="breadcrumbs">
          <Link to="/briefs" className="hover:text-[#5135ff] hover:underline transition-colors">
            ประกาศหานักรีวิว
          </Link>{' '}
          <CaretRight />{' '}
          {parentBriefId && (
            <>
              <Link
                to={`/briefs/${parentBriefId}`}
                className="hover:text-[#5135ff] hover:underline transition-colors"
              >
                {parentBriefId}
              </Link>{' '}
              <CaretRight />{' '}
            </>
          )}
          <b>{isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศ'}</b>
        </div>
        <button className="back-link" onClick={() => navigate(backPath)}>
          <ArrowLeft /> Back
        </button>
        <h1>{isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศ'}</h1>
        <p className="form-subtitle">
          ข้อมูลการรับสมัครงานที่ Influencer จะมองเห็นเมื่อเข้ามาที่ลิงก์นี้
        </p>
      </header>
      <ol className="cw-stepper posting-stepper" aria-label="ขั้นตอนสร้างประกาศ">
        {POSTING_STEPS.map((title, index) => (
          <li key={title} className={index <= step ? 'active' : ''}>
            <button
              type="button"
              onClick={() => handleStep(index)}
              aria-current={index === step ? 'step' : undefined}
            >
              <span className="cw-step-number">{index < step ? <Check /> : index + 1}</span>
              <span>{title}</span>
            </button>
          </li>
        ))}
      </ol>
      <div className="cw-step-title" aria-live="polite">
        <h2>
          Step {step + 1}: {POSTING_STEPS[step]}
        </h2>
        <p>{POSTING_STEP_DESCRIPTIONS[step]}</p>
      </div>
      <main className="form-wrap lifecycle-form gap-6 max-[760px]:gap-4">
        <div className="posting-wizard-step" hidden={step !== 0}>
          <section className="form-card prelist-section" aria-label="Setting ตั้งค่าบรีฟ">
            <div className="grid gap-6">
              <Field label="Owner / Assign Buyer" required>
                <select
                  value={owner}
                  onChange={(event) => handleBasicInformationChange('owner', event.target.value)}
                >
                  {[
                    ...new Set([
                      owner,
                      currentUser.email,
                      'thanya@buddyreview.co',
                      'nattaya@buddyreview.co',
                      'itsariya@buddyreview.co',
                    ]),
                  ]
                    .filter(Boolean)
                    .map((email) => (
                      <option key={email}>{email}</option>
                    ))}
                </select>
              </Field>
            </div>
          </section>
          <CampaignTypeFields value={campaignType} onChange={setCampaignType} />
        </div>
        <div className="posting-wizard-step" hidden={step !== 1}>
          <section className="posting-criteria-sections">
            <CreatorCriteriaFields
              values={{
                target,
                targetPost,
                targetGroup,
                genders,
                ageMin,
                ageMax,
                followerMin,
                followerMax,
                platforms,
                contentScope,
              }}
              onChange={handleCriteriaChange}
              onTogglePlatform={togglePlatform}
              onSelectScope={handleSelectScope}
              errors={errors}
            />
          </section>
          {campaignType === 'confidential' && (
            <ConfidentialInformationFields
              title={confidentialTitle}
              subtitle={confidentialSubtitle}
              errors={errors}
              onChange={(field, value) => {
                if (field === 'confidentialTitle') setConfidentialTitle(value);
                else setConfidentialSubtitle(value);
                setErrors((current) => ({ ...current, [field]: '' }));
              }}
            />
          )}
          <CampaignBasicInformationFields
            isConfidential={campaignType === 'confidential'}
            name={name}
            subtitle={subtitle}
            cover={cover}
            onChange={handleBasicInformationChange}
            errors={errors}
            onCoverError={(message) => setErrors((current) => ({ ...current, cover: message }))}
          />
        </div>
        <div className="posting-wizard-step" hidden={step !== 2}>
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
          </section>
          <section className="form-card prelist-section">
            <h3 className="mb-2 text-lg font-semibold">Reference Brief</h3>
            <p className="mb-4 text-sm text-muted">
              แนบลิงก์ข้อมูลเพิ่มเติมได้โดยยังไม่ต้องอัปโหลด Full Brief
            </p>
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
          <section className="form-card prelist-section posting-period-section">
            <h3 className="text-xl font-semibold">ระยะเวลาของแคมเปญ</h3>
            {campaignType !== 'private' && (
              <p className="mt-2 text-base text-[#7889a4]">
                ช่วงเวลาทำแคมเปญต้องเริ่มหลังจากวันที่ปิดรับสมัครเป็นต้นไป
              </p>
            )}
            <div className="mt-6 grid gap-6 max-[760px]:gap-4">
              {campaignType !== 'private' && (
                <CampaignDateRange
                  title="ระยะเวลารับสมัคร"
                  startLabel="วันที่เปิดรับสมัคร"
                  endLabel="วันที่ปิดรับสมัคร"
                  startValue={applyStartDate}
                  endValue={deadline}
                  onStartChange={setApplyStartDate}
                  onEndChange={setDeadline}
                  error={errors.deadline}
                />
              )}
              <CampaignDateRange
                title="ระยะเวลาทำแคมเปญ"
                startLabel="วันที่เริ่มทำแคมเปญ"
                endLabel="วันสุดท้ายของแคมเปญ"
                startValue={startDate}
                endValue={endDate}
                onStartChange={setStartDate}
                onEndChange={setEndDate}
                error={errors.date}
              />
            </div>
          </section>
        </div>
        <div className="posting-wizard-step" hidden={step !== 3}>
          <section className="form-card prelist-section" aria-label="Compensation">
            <div className="section-heading gap-3 mb-6">
              <span className="section-number">4</span>
              <div>
                <h2>Compensation</h2>
                <p>สิ่งที่ Creator จะได้รับจากการร่วมงาน</p>
              </div>
            </div>
            <CompensationFields
              compensation={compensation}
              onCompensationChange={(value) => {
                setCompensation(value);
                setErrors((current) => ({ ...current, compensation: '' }));
              }}
              error={errors.compensation}
              budgetMin={budgetMin}
              budgetMax={budgetMax}
              onBudgetMinChange={setBudgetMin}
              onBudgetMaxChange={setBudgetMax}
              benefit={benefit}
              benefitSource={benefitSource}
              benefitProduct={benefitProduct}
              products={parentBrief?.products || []}
              onBenefitChange={setBenefit}
              onBenefitSourceChange={setBenefitSource}
              onBenefitProductChange={setBenefitProduct}
            />
          </section>
        </div>
      </main>
      <footer className="prelist-sticky">
        <div>
          <span className="lifecycle-status draft">Draft</span>
          <p>ข้อมูลเบื้องต้นสำหรับเริ่มหา Influencer</p>
        </div>
        <div className="flex gap-2!">
          <button className="secondary-button" onClick={() => navigate(backPath)}>
            ยกเลิก
          </button>
          {step > 0 && (
            <button className="secondary-button" onClick={() => handleStep(step - 1)}>
              ย้อนกลับ
            </button>
          )}
          {!isEditing && (
            <button className="secondary-button" onClick={() => handleSubmit(true)}>
              Save as Draft
            </button>
          )}
          <button
            className="primary"
            onClick={() => (step < 3 ? handleStep(step + 1) : setIsSaveModalOpen(true))}
          >
            {step < 3 ? (
              <>
                ถัดไป <CaretRight />
              </>
            ) : isEditing ? (
              'บันทึกการแก้ไข'
            ) : (
              'สร้างประกาศ (Public Link)'
            )}
          </button>
        </div>
      </footer>
    </div>
  );
}

function CampaignDateRange({
  title,
  startLabel,
  endLabel,
  startValue,
  endValue,
  onStartChange,
  onEndChange,
  error,
}) {
  return (
    <div>
      <h4 className="mb-4 text-lg font-medium">{title}</h4>
      <div className="grid grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-end gap-4 max-[760px]:gap-2">
        <CampaignDateInput label={startLabel} value={startValue} onChange={onStartChange} />
        <span className="flex h-12 items-center justify-center" aria-hidden="true">
          -
        </span>
        <CampaignDateInput label={endLabel} value={endValue} onChange={onEndChange} />
      </div>
      {error && <small className="field-error">{error}</small>}
    </div>
  );
}

function CampaignDateInput({ label, value, onChange }) {
  const [year, month, day] = value ? value.split('-') : [];
  const displayDate = value
    ? `${Number(day)} / ${Number(month)} / ${Number(year) + 543}`
    : 'วัน / เดือน / ปี';
  return (
    <label className="grid min-w-0 gap-2">
      <span className="text-base max-[760px]:text-sm">
        {label} <b className="text-red-500">*</b>
      </span>
      <div className="campaign-date-input">
        <span aria-hidden="true">{displayDate}</span>
        <span className="campaign-date-icon" aria-hidden="true">
          <CalendarBlank size={20} weight="bold" />
        </span>
        <input
          type="date"
          aria-label={label}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </label>
  );
}
