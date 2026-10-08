import { ANNOUNCEMENT_STATUS_OPTIONS } from '../../features/job-postings/announcementStatuses.js';

export function AnnouncementStatus({ value }) {
  const status = ANNOUNCEMENT_STATUS_OPTIONS.find((option) => option.value === value);
  if (!status) return 'ยังไม่ระบุ';
  return <span className={`posting-badge ${status.tone}`}>{status.label}</span>;
}
