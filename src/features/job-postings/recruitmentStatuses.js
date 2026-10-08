import { getBangkokToday, parseDay } from '../../utils/formatDate.js';

export const RECRUITMENT_STATUSES = [
  { label: 'ร่าง', tone: 'draft' },
  { label: 'เปิดรับสมัคร', tone: 'open' },
  { label: 'ปิดรับสมัคร', tone: 'closed' },
];

export function getRecruitmentPeriod(job, today = parseDay(getBangkokToday())) {
  const start = parseDay(job.applyStartDate);
  const end = parseDay(job.deadline);
  const validPeriod = start !== null && end !== null && start <= end;
  if (job.recruitmentMode === 'manual') {
    const state =
      job.status === 'Draft' || job.status === 'แบบร่าง'
        ? 'ร่าง'
        : job.announcementStatus === 'inactive'
          ? 'ปิดรับสมัคร'
          : 'เปิดรับสมัคร';
    return { start: null, end: null, validPeriod: false, state };
  }
  const isDraft = job.status === 'Draft' || job.status === 'แบบร่าง' || !validPeriod;
  const state = isDraft ? 'ร่าง' : today > end ? 'ปิดรับสมัคร' : 'เปิดรับสมัคร';
  return { start, end, validPeriod, state };
}
