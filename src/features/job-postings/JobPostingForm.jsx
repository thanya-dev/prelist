import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CalendarBlank, CaretRight, LinkSimple } from '@phosphor-icons/react';
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
import { ChoiceButton } from '../../components/ui/ChoiceButton.jsx';
import { DAY_MS, parseDay } from '../../utils/formatDate.js';

const normalizeFormDate = (value) => {
  const day = parseDay(value);
  return day === null ? '' : new Date(day * DAY_MS).toISOString().slice(0, 10);
};

export function JobPostingForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const job = id ? getJobPostingById(id) : null;
  const isEditing = Boolean(job);
  const parentBriefId = job?.brief || new URLSearchParams(window.location.search).get('briefId');
  const parentBrief = getBriefById(parentBriefId);
  const currentUser = getCurrentUser();
  const backPath = isEditing
    ? `/job-postings/${id}`
    : parentBriefId
      ? `/briefs/${parentBriefId}`
      : '/briefs';
  const [name, setName] = useState(isEditing ? (job.name ?? '') : (parentBrief?.name ?? ''));
  const [campaignType, setCampaignType] = useState(job?.campaignType ?? 'normal');
  const [subtitle, setSubtitle] = useState(job?.subtitle ?? '');
  const [brand, setBrand] = useState(isEditing ? (job.brand ?? '') : (parentBrief?.brand ?? ''));
  const [cover, setCover] = useState(isEditing ? (job.image ?? '') : (parentBrief?.image ?? ''));
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
  const [briefLink, setBriefLink] = useState(job?.briefLink ?? '');
  const [errors, setErrors] = useState({});
  const paid = compensation === 'มีค่าจ้าง' || compensation === 'ค่าจ้าง + สินค้า / Benefit';
  const hasBenefit =
    compensation === 'สินค้า / Benefit เท่านั้น' || compensation === 'ค่าจ้าง + สินค้า / Benefit';
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
    if (!name.trim()) {
      setErrors({
        name: 'กรุณาระบุชื่อประกาศ',
      });
      return;
    }
    if (!isDraft) {
      const nextErrors = {};
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
        return;
      }
    }
    const saved = {
      ...job,
      id: job?.id || `JOB${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim(),
      campaignType,
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
    if (isEditing) updateJobPosting(id, saved);
    else createJobPosting(saved);
    navigate(backPath);
  };
  return (
    <div className="form-page lifecycle-form-page job-posting-form">
      <header className="form-head">
        <div className="breadcrumbs">
          ประกาศหานักรีวิว <CaretRight /> <b>{isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศ'}</b>
        </div>
        <button className="back-link" onClick={() => navigate(backPath)}>
          <ArrowLeft /> Back
        </button>
        <h1>{isEditing ? 'แก้ไขประกาศ' : 'สร้างประกาศ'}</h1>
        <p className="form-subtitle">
          ข้อมูลการรับสมัครงานที่ Influencer จะมองเห็นเมื่อเข้ามาที่ลิงก์นี้
        </p>
      </header>
      <main className="form-wrap lifecycle-form gap-6 max-[760px]:gap-4">
        <CampaignTypeFields value={campaignType} onChange={setCampaignType} />

        <section className="form-card prelist-section">
          <div className="section-heading gap-3 mb-6">
            <span className="section-number">1</span>
            <div>
              <h2>Creator Criteria</h2>
              <p>ระบุ Creator ที่ต้องการสำหรับงานนี้</p>
            </div>
          </div>
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

        <section className="form-card prelist-section">
          <div className="section-heading gap-3 mb-6">
            <span className="section-number">2</span>
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
          <section className="campaign-period mt-6 rounded-xl bg-white p-6 max-[760px]:p-3">
            <h3 className="text-xl font-semibold">ระยะเวลาของแคมเปญ</h3>
            <p className="mt-2 text-base text-[#7889a4]">
              ช่วงเวลาทำแคมเปญต้องเริ่มหลังจากวันที่ปิดรับสมัครเป็นต้นไป
            </p>
            <div className="mt-6 grid gap-6 max-[760px]:gap-4">
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
        </section>

        <section className="form-card prelist-section">
          <div className="section-heading gap-3 mb-6">
            <span className="section-number">3</span>
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
            {errors.compensation && <small className="field-error">{errors.compensation}</small>}
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
            <span className="section-number">4</span>
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
            <small className="field-help">รองรับ Google Docs, Google Slides และ External URL</small>
          </Field>
        </section>
        <CampaignBasicInformationFields
          name={name}
          subtitle={subtitle}
          brand={brand}
          cover={cover}
          owner={owner}
          currentUser={currentUser}
          onChange={handleBasicInformationChange}
          errors={errors}
          onCoverError={(message) => setErrors((current) => ({ ...current, cover: message }))}
        />
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
          {!isEditing && (
            <button className="secondary-button" onClick={() => handleSubmit(true)}>
              Save as Draft
            </button>
          )}
          <button className="primary" onClick={() => handleSubmit()}>
            {isEditing ? 'บันทึกการแก้ไข' : 'สร้างประกาศ (Public Link)'}
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
