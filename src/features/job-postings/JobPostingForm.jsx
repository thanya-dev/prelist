import { validateAnnouncement } from './validateAnnouncement.js';
import { useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Field } from '../../components/ui/Field.jsx';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { SpecialCriteriaSelect } from './SpecialCriteriaSelect.jsx';
import { AnnouncementRichTextEditor } from './AnnouncementRichTextEditor.jsx';
import { JobPostingSaveModal } from './JobPostingSaveModal.jsx';
import { getJobPostingById, createJobPosting, updateJobPosting } from './jobPostingApi.js';
import { getBriefById } from '../briefs/briefApi.js';
import { getCurrentUser } from '../../lib/currentUser.js';
import { AnnouncementStatus } from '../../components/shared/AnnouncementStatus.jsx';
import { ANNOUNCEMENT_STATUS_OPTIONS } from './announcementStatuses.js';
import {
  ANNOUNCEMENT_PLATFORMS,
  SPECIAL_CRITERIA_OPTIONS,
  getAnnouncementCriteria,
} from './announcementForm.js';

export function JobPostingForm({ postingId: id, briefId, copyFromId, onClose, onSave }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const original = getJobPostingById(id || copyFromId || params.get('copyFrom'));
  const isEditing = Boolean(id && original);
  const job = original || {};
  const parentBriefId = job.brief || briefId || params.get('briefId') || '';
  const parentBrief = getBriefById(parentBriefId);
  const backPath = isEditing
    ? `/job-postings/${id}`
    : parentBriefId
      ? `/briefs/${parentBriefId}`
      : '/briefs';
  const [values, setValues] = useState(() => ({
    name: job.name ? `${job.name}${!id ? ' (สำเนา)' : ''}` : parentBrief?.name || '',
    subtitle: job.subtitle || '',
    owner: job.owner || getCurrentUser().email,
    announcementStatus:
      job.status === 'Draft' || job.status === 'แบบร่าง'
        ? 'draft'
        : job.announcementStatus || 'active',
    specialCriteriaOptions: getAnnouncementCriteria(job),
    platforms: job.platforms || [],
    followerMin: job.followerMin ?? '',
    followerMax: job.followerMax ?? '',
    shortBrief: job.shortBrief || '',
    shortBriefHtml: job.shortBriefHtml || '',
    wage: job.wage ?? (job.budgetMin !== undefined ? job.budgetMin : ''),
    productValue: job.productValue ?? '',
    benefit: job.benefit || '',
  }));
  const formRef = useRef(null);
  const [errors, setErrors] = useState({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const handleChange = (key, value) => {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: '' }));
  };
  const canSave = Object.keys(validateAnnouncement(values)).length === 0;
  const handleSave = (forceDraft = false) => {
    const isDraft = forceDraft || values.announcementStatus === 'draft';
    setIsSaveModalOpen(false);
    const nextErrors = validateAnnouncement(values, isDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      requestAnimationFrame(() => {
        const firstInvalid = formRef.current?.querySelector('[aria-invalid="true"], .field-error');
        firstInvalid?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid?.focus();
      });
      return;
    }
    const saved = {
      ...job,
      ...values,
      specialCriteria: values.specialCriteriaOptions.join(' · '),
      followerMin: values.followerMin === '' ? '' : Number(values.followerMin),
      followerMax: values.followerMax === '' ? '' : Number(values.followerMax),
      id: isEditing ? id : `JOB${Date.now()}`,
      brief: parentBriefId,
      name: values.name.trim(),
      campaignType: 'confidential',
      announcementVersion: 2,
      status: isDraft ? 'Draft' : 'Published',
      announcementStatus: isDraft ? 'draft' : values.announcementStatus,
      recruitmentMode: 'manual',
      confidentialTitle: values.name.trim(),
      confidentialSubtitle: values.subtitle.trim(),
      brand: job.brand || parentBrief?.brand || '',
      wage: values.wage === '' ? '' : Number(values.wage),
      productValue: values.productValue === '' ? '' : Number(values.productValue),
      budgetMin: values.wage,
      budgetMax: values.wage,
      compensation: Number(values.productValue) > 0 ? 'ค่าจ้าง + สินค้า / Benefit' : 'มีค่าจ้าง',
      applicants: isEditing ? (job.applicants ?? 0) : 0,
      viewerCount: isEditing ? (job.viewerCount ?? 0) : 0,
    };
    if (isEditing) updateJobPosting(id, saved);
    else createJobPosting(saved);
    if (onSave) {
      onSave(saved, isDraft);
      return;
    }
    navigate(
      isDraft && !isEditing
        ? parentBriefId
          ? `/briefs/${parentBriefId}`
          : '/briefs'
        : `/job-postings/${saved.id}`,
    );
  };
  const renderInput = (key, label, props = {}) => (
    <Field label={label} required error={errors[key]}>
      <input
        {...props}
        aria-invalid={Boolean(errors[key])}
        value={values[key]}
        onChange={(event) => handleChange(key, event.target.value)}
      />
    </Field>
  );
  const renderMoneyInput = (key, label) => {
    const [integer, fraction] = String(values[key]).split('.');
    const formattedValue =
      integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',') +
      (fraction !== undefined ? `.${fraction}` : '');
    return (
      <Field label={label} required error={errors[key]}>
        <input
          type="text"
          inputMode="decimal"
          aria-invalid={Boolean(errors[key])}
          value={formattedValue}
          onChange={(event) => {
            const amount = event.target.value.replaceAll(',', '');
            if (/^\d*(\.\d*)?$/.test(amount)) handleChange(key, amount);
          }}
        />
      </Field>
    );
  };
  return (
    <div className="form-page lifecycle-form-page job-posting-form">
      {isSaveModalOpen && (
        <JobPostingSaveModal
          isEditing={isEditing}
          onClose={() => setIsSaveModalOpen(false)}
          onConfirm={() => handleSave()}
        />
      )}
      <main ref={formRef} className="form-wrap lifecycle-form gap-6">
        <>
          <section className="form-card grid gap-6">
            <Field label="Owner / Assign Buyer" required>
              <select
                aria-invalid={Boolean(errors.owner)}
                value={values.owner}
                onChange={(event) => handleChange('owner', event.target.value)}
              >
                {[
                  ...new Set([
                    values.owner,
                    getCurrentUser().email,
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
          </section>
          <section className="form-card flex flex-wrap items-center justify-between gap-4">
            <div className="grid gap-1">
              <h3 id="announcement-status-heading" className="announcement-section-title">
                สถานะประกาศ
              </h3>
              <p id="announcement-status-help" className="m-0 text-sm text-muted">
                เปิดหรือปิดรับสมัครด้วยสถานะ
              </p>
            </div>
            <fieldset
              className="m-0 min-w-0 border-0 p-0 max-[480px]:w-full"
              aria-labelledby="announcement-status-heading"
              aria-describedby="announcement-status-help"
            >
              <div className="flex flex-wrap gap-2 max-[480px]:flex-col">
                {ANNOUNCEMENT_STATUS_OPTIONS.map(({ value }) => (
                  <label
                    key={value}
                    className={`flex cursor-pointer items-center gap-2 rounded-md border border-solid px-3 py-2 ${values.announcementStatus === value ? 'border-[#3b82f6] bg-[#eff6ff]' : 'border-[#dce4ee]'}`}
                  >
                    <input
                      type="radio"
                      name="announcementStatus"
                      value={value}
                      checked={values.announcementStatus === value}
                      onChange={() => handleChange('announcementStatus', value)}
                    />
                    <AnnouncementStatus value={value} />
                  </label>
                ))}
              </div>
            </fieldset>
          </section>
        </>
        <>
          <section className="form-card grid gap-6">
            <h3 className="announcement-section-title">คุณสมบัตินักรีวิว</h3>
            <div className="grid gap-2">
              <span id="announcement-platform-label" className="announcement-field-label">
                Platform <b className="text-[#f05b60]">*</b>
              </span>
              <div
                role="group"
                aria-labelledby="announcement-platform-label"
                className="grid grid-cols-2 gap-4 max-[500px]:grid-cols-1"
              >
                {ANNOUNCEMENT_PLATFORMS.map((platform) => (
                  <label
                    key={platform}
                    className={`flex items-center gap-3 border rounded-md p-3 ${values.platforms.includes(platform) ? 'border-[#3b82f6] bg-[#eff6ff]' : 'border-[#dce4ee] bg-white'}`}
                  >
                    <input
                      type="checkbox"
                      checked={values.platforms.includes(platform)}
                      onChange={() =>
                        handleChange(
                          'platforms',
                          values.platforms.includes(platform)
                            ? values.platforms.filter((entry) => entry !== platform)
                            : [...values.platforms, platform],
                        )
                      }
                    />
                    <PlatformLogo platform={platform} />
                    {platform}
                  </label>
                ))}
              </div>
              {errors.platforms && <p className="field-error">{errors.platforms}</p>}
            </div>
            <div className="grid gap-2">
              <span className="announcement-field-label">
                Follower Range <b className="text-[#f05b60]">*</b>
              </span>
              <div className="grid grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-start gap-2">
                {['followerMin', 'followerMax'].map((key, index) => (
                  <div key={key} className={index === 1 ? 'col-start-3 row-start-1' : ''}>
                    <Field label={index === 0 ? 'MIN' : 'MAX'} required error={errors[key]}>
                      <input
                        type="text"
                        inputMode="numeric"
                        aria-invalid={Boolean(errors[key])}
                        value={
                          values[key] === '' ? '' : Number(values[key]).toLocaleString('en-US')
                        }
                        onChange={(event) => {
                          const number = event.target.value.replaceAll(',', '');
                          if (
                            /^\d*$/.test(number) &&
                            (number === '' || Number.isSafeInteger(Number(number)))
                          )
                            handleChange(key, number);
                        }}
                      />
                    </Field>
                  </div>
                ))}
                <span aria-hidden="true" className="col-start-2 row-start-1 mt-9 text-center">
                  –
                </span>
              </div>
            </div>
            <SpecialCriteriaSelect
              values={values.specialCriteriaOptions}
              options={SPECIAL_CRITERIA_OPTIONS}
              onChange={(selected) => handleChange('specialCriteriaOptions', selected)}
            />
          </section>
        </>
        <section className="form-card grid gap-6">
          <div className="grid gap-2">
            <h3 className="announcement-section-title">รายละเอียดค่าตอบแทน</h3>
            <p className="text-sm text-muted">
              ระบุค่าจ้างรวมค่าเดินทาง และมูลค่าสินค้าสปอนเซอร์ให้ชัดเจน หากไม่มีให้ระบุ 0
            </p>
          </div>
          {renderMoneyInput('wage', 'ค่าจ้างรวมค่าเดินทาง (บาท)')}
          {renderMoneyInput('productValue', 'ค่าสินค้า (บาท)')}
        </section>
        <section className="form-card grid gap-6">
          <h3 className="announcement-section-title">ข้อมูลประกาศ</h3>
          {renderInput('name', 'ชื่อประกาศ (Announcement Title)')}
          {renderInput('subtitle', 'คำอธิบายประกาศ (Subtitle)')}
          <div className="grid gap-2">
            <span className="announcement-field-label">
              รายละเอียดงาน <b className="text-[#f05b60]">*</b>
            </span>
            <AnnouncementRichTextEditor
              html={values.shortBriefHtml}
              text={values.shortBrief}
              onChange={({ html, text }) => {
                handleChange('shortBriefHtml', html);
                handleChange('shortBrief', text);
              }}
            />
          </div>
        </section>
      </main>
      <footer className="prelist-sticky">
        <div>
          <p>สถานะประกาศ ร่าง / เปิดรับสมัคร / ปิดรับสมัคร</p>
        </div>
        <div className="flex gap-2!">
          <button className="secondary-button" onClick={onClose || (() => navigate(backPath))}>
            ยกเลิก
          </button>
          <button
            className="primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            disabled={!canSave}
            onClick={() => canSave && setIsSaveModalOpen(true)}
          >
            {isEditing ? 'บันทึกการแก้ไข' : 'สร้างประกาศ'}
          </button>
        </div>
      </footer>
    </div>
  );
}
