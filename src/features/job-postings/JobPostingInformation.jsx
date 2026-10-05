import { FileText, Users, CalendarBlank, Gift, LinkSimple, Info } from '@phosphor-icons/react';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { CONTENT_SCOPE_GROUPS } from './CreatorCriteriaFields.jsx';
import { DAY_MS, parseDay } from '../../utils/formatDate.js';

const displayValue = (value) =>
  value === undefined || value === null || value === '' ? 'ยังไม่ระบุ' : value;
const formatDate = (value) => {
  const day = parseDay(value);
  return day === null
    ? 'ยังไม่ระบุ'
    : new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(day * DAY_MS));
};
const formatRange = (min, max, unit) => `${displayValue(min)} – ${displayValue(max)} ${unit}`;

function InformationField({ label, children }) {
  return (
    <div className="posting-information-field min-w-0">
      <dt className="mb-2 text-sm font-semibold text-[#64748b]">{label}</dt>
      <dd className="m-0 whitespace-pre-wrap break-words text-base leading-relaxed">{children}</dd>
    </div>
  );
}
function InformationSection({ title, icon: Icon, children }) {
  return (
    <section className="form-card posting-information-section">
      <header className="posting-information-heading">
        <span>
          <Icon size={20} />
        </span>
        <h2>{title}</h2>
      </header>
      <dl className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1 max-[760px]:gap-4">
        {children}
      </dl>
    </section>
  );
}

export function JobPostingInformation({ job }) {
  const hasBudget = ['มีค่าจ้าง', 'ค่าจ้าง + สินค้า / Benefit'].includes(job.compensation);
  const hasBenefit = ['สินค้า / Benefit เท่านั้น', 'ค่าจ้าง + สินค้า / Benefit'].includes(
    job.compensation,
  );
  const contentScope =
    job.contentScope ||
    CONTENT_SCOPE_GROUPS.find((scope) =>
      job.contentTypes?.some((type) => scope.types.includes(type)),
    )?.label;
  return (
    <div className="posting-information mt-6 grid gap-6 max-[760px]:gap-4">
      <InformationSection title="ประเภทแคมเปญ" icon={FileText}>
        <InformationField label="Campaign Type">
          {job.campaignType === 'confidential' ? 'Confidential campaign' : 'Normal'}
        </InformationField>
      </InformationSection>
      <InformationSection title="Creator Criteria" icon={Users}>
        <InformationField label="Target influencer">
          {displayValue(job.reviewers)} คน
        </InformationField>
        <InformationField label="Target post">{displayValue(job.targetPost)}</InformationField>
        <InformationField label="Target group">{displayValue(job.targetGroup)}</InformationField>
        <InformationField label="เพศ">
          {displayValue(job.genders?.join(', ') || job.gender)}
        </InformationField>
        <InformationField label="อายุ MIN / MAX">
          {formatRange(job.ageMin, job.ageMax, 'ปี')}
        </InformationField>
        <InformationField label="ผู้ติดตาม MIN / MAX">
          {formatRange(job.followerMin, job.followerMax, 'คน')}
        </InformationField>
        <InformationField label="Platform">
          {job.platforms?.length ? (
            <div className="flex flex-wrap gap-3">
              {job.platforms.map((platform) => (
                <span key={platform} className="inline-flex items-center gap-2">
                  <PlatformLogo platform={platform} />
                  {platform}
                </span>
              ))}
            </div>
          ) : (
            'ยังไม่ระบุ'
          )}
        </InformationField>
        <InformationField label="สโคปงาน">
          {displayValue(contentScope)}
          {job.contentTypes?.length > 0 && (
            <p className="mt-2 text-sm text-[#64748b]">{job.contentTypes.join(', ')}</p>
          )}
        </InformationField>
      </InformationSection>
      <InformationSection title="Job Information" icon={CalendarBlank}>
        <div className="col-span-full">
          <InformationField label="Short Brief">{displayValue(job.shortBrief)}</InformationField>
        </div>
        <div className="col-span-full">
          <h3 className="text-base">ระยะเวลาของแคมเปญ</h3>
        </div>
        <InformationField label="ระยะเวลารับสมัคร">
          {formatDate(job.applyStartDate)} – {formatDate(job.deadline)}
        </InformationField>
        <InformationField label="ระยะเวลาทำแคมเปญ">
          {formatDate(job.startDate)} – {formatDate(job.endDate)}
        </InformationField>
      </InformationSection>
      <InformationSection title="Compensation" icon={Gift}>
        <InformationField label="Compensation Type">
          {displayValue(job.compensation)}
        </InformationField>
        {hasBudget && (
          <InformationField label="Budget Range">
            {formatRange(job.budgetMin, job.budgetMax, 'THB')}
          </InformationField>
        )}
        {hasBenefit && (
          <div className="col-span-full">
            <InformationField label="Product / Benefit Detail">
              {displayValue(job.benefit)}
            </InformationField>
          </div>
        )}
      </InformationSection>
      <InformationSection title="Reference Brief" icon={LinkSimple}>
        <InformationField label="Brief Link">
          {/^https?:\/\//i.test(job.briefLink || '') ? (
            <a className="text-[#3b28cc]" href={job.briefLink} target="_blank" rel="noreferrer">
              {job.briefLink}
            </a>
          ) : (
            displayValue(job.briefLink)
          )}
        </InformationField>
      </InformationSection>
      <InformationSection title="Basic Information" icon={Info}>
        <InformationField label="Campaign Title">{displayValue(job.name)}</InformationField>
        <InformationField label="Campaign Subtitle">{displayValue(job.subtitle)}</InformationField>
        <InformationField label="Brand">{displayValue(job.brand)}</InformationField>
        <InformationField label="Owner / Assign Buyer">{displayValue(job.owner)}</InformationField>
      </InformationSection>
    </div>
  );
}
