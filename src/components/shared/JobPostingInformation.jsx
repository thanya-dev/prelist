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
          <InformationField label="Special Criteria">
            {displayValue(getAnnouncementCriteria(job).join(' · '))}
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
              '-'
            )}
          </InformationField>
          <InformationField label="Follower Range">
            {formatRange(job.followerMin, job.followerMax, 'followers')}
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
            {job.id === 'JOB20260901' && (
              <div className="mt-6 border-0 border-t border-solid border-[#e2e8f0] pt-6 shadow-none">
                <p className="m-0 mb-3 text-sm font-semibold text-[#64748b]">
                  ตัวอย่างการจัดรูปแบบรายละเอียดงาน
                </p>
                <div className="announcement-rich-text text-base leading-6">
                  <p>
                    <strong>รับนักรีวิว 5 คน</strong> ทำวิดีโอแนวตั้ง 45–60 วินาที คนละ 1 คลิป ลง
                    TikTok หรือ Instagram Reels เล่าแนวทางวางแผนค่าใช้จ่ายและแนะนำ KTC Cash Card
                    ตามข้อมูลที่แบรนด์อนุมัติ
                  </p>
                  <p>
                    โพสต์คลิปพร้อม{' '}
                    <span style={{ color: '#6024ed' }}>
                      <strong>#KTCCashCard #โฆษณา</strong>
                    </span>
                  </p>
                  <p>
                    <em>ห้ามรับรองผลอนุมัติหรือแต่งประสบการณ์ใช้จริง</em> คงโพสต์อย่างน้อย 90
                    วันและส่งสถิติหลังเผยแพร่ 7 วัน
                  </p>
                  <p>
                    <a
                      href="https://www.buddyreview.co/campaign/EMr3CC9K56/preview"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ดูตัวอย่างหน้าประกาศ ↗
                    </a>
                  </p>
                  <img
                    src="https://manage.buddyreview.co/_next/static/media/logo-m-color.94a8241e.svg"
                    alt="ตัวอย่างรูปภาพ Buddy Review"
                    className="w-48"
                  />
                </div>
              </div>
            )}
          </div>
        </InformationSection>
      </div>
    </div>
  );
}
