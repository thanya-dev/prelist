export const ANNOUNCEMENT_STATUS_OPTIONS = [
  { value: 'draft', label: 'ร่าง', tone: 'draft' },
  { value: 'active', label: 'เปิดรับสมัคร', tone: 'open' },
  { value: 'inactive', label: 'ปิดรับสมัคร', tone: 'closed' },
];

export function AnnouncementStatus({ value }) {
  const status = ANNOUNCEMENT_STATUS_OPTIONS.find((option) => option.value === value);
  if (!status) return 'ยังไม่ระบุ';
  return <span className={`posting-badge ${status.tone}`}>{status.label}</span>;
}
