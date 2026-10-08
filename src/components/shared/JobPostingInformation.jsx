import { Users, Gift, Info } from '@phosphor-icons/react';
import { sanitizeAnnouncementHtml } from '../../features/job-postings/announcementRichText.js';
import { PlatformLogo } from './PlatformLogo.jsx';
import { getAnnouncementCriteria } from '../../features/job-postings/announcementForm.js';

const isMissing = (value) => value == null || (typeof value === 'string' && !value.trim());
const displayValue = (value) => (isMissing(value) ? '-' : value);
const formatNumber = (value) =>
  isMissing(value)
    ? '-'
    : Number.isFinite(Number(value))
      ? Number(value).toLocaleString('en-US')
      : displayValue(value);
const formatRange = (min, max, unit) =>
  isMissing(min) && isMissing(max) ? '-' : `${formatNumber(min)} – ${formatNumber(max)} ${unit}`;

function InformationField({ label, children }) {
  return (
    <div className="posting-information-field min-w-0 flex flex-col gap-2">
      <dt className="text-base leading-6 font-medium text-[#64748b]">{label}</dt>
      <dd className="m-0 flex-1 whitespace-pre-wrap break-words text-base leading-6">{children}</dd>
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
      <dl className="grid grid-cols-1 gap-6 max-[760px]:gap-4">{children}</dl>
    </section>
  );
}

export function JobPostingInformation({ job }) {
  const shortBriefHtml = sanitizeAnnouncementHtml(job.shortBriefHtml || '');
  const hasShortBriefHtml =
    shortBriefHtml.includes('<img ') ||
    Boolean(
      shortBriefHtml
        .replace(/<[^>]*>/g, '')
        .replace(/&nbsp;/g, ' ')
        .trim(),
    );
  return (
    <div className="posting-information mt-6 grid md:grid-cols-2 gap-6 items-start">
      <div className="flex flex-col gap-6">
        <InformationSection title="คุณสมบัตินักรีวิว" icon={Users}>
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
              '-'
            )}
          </InformationField>
          <InformationField label="Follower Range">
            {formatRange(job.followerMin, job.followerMax, 'followers')}
          </InformationField>
          <InformationField label="Special Criteria">
            {displayValue(getAnnouncementCriteria(job).join(' · '))}
          </InformationField>
        </InformationSection>
        <InformationSection title="รายละเอียดค่าตอบแทน" icon={Gift}>
          <InformationField label="ค่าจ้างรวมค่าเดินทาง (บาท)">
            {formatNumber(job.wage ?? job.budgetMin)}
          </InformationField>
          <InformationField label="ค่าสินค้า (บาท)">
            {formatNumber(job.productValue)}
          </InformationField>
        </InformationSection>
      </div>
      <div className="flex flex-col gap-6">
        <InformationSection title="ข้อมูลประกาศ" icon={Info}>
          <div className="col-span-full">
            <InformationField label="รายละเอียดงาน">
              {hasShortBriefHtml ? (
                <div
                  className="announcement-rich-text"
                  dangerouslySetInnerHTML={{ __html: shortBriefHtml }}
                />
              ) : (
                displayValue(job.shortBrief)
              )}
            </InformationField>
          </div>
        </InformationSection>
      </div>
    </div>
  );
}
