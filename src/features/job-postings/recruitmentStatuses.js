import { getBangkokToday, parseDay } from '../../utils/formatDate.js';

export const RECRUITMENT_STATUSES = [
  { label: 'แบบร่าง', tone: 'draft' },
  { label: 'รอเปิดรับ', tone: 'scheduled' },
  { label: 'เปิดรับสมัคร', tone: 'open' },
  { label: 'ปิดรับสมัคร', tone: 'closed' },
];

export function getRecruitmentPeriod(job, today = parseDay(getBangkokToday())) {
  const start = parseDay(job.applyStartDate);
  const end = parseDay(job.deadline);
  const validPeriod = start !== null && end !== null && start <= end;
  const isDraft = job.status === 'Draft' || job.status === 'แบบร่าง' || !validPeriod;
  const state = isDraft
    ? 'แบบร่าง'
    : today < start
      ? 'รอเปิดรับ'
      : today > end
        ? 'ปิดรับสมัคร'
        : 'เปิดรับสมัคร';
  return { start, end, validPeriod, state };
}
