export const DAY_MS = 86400000;
export const parseDay = (value) => {
  if (!value) return null;
  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (iso) return Date.UTC(+iso[1], +iso[2] - 1, +iso[3]) / DAY_MS;
  const thai = /^(\d{1,2})\s+(\S+)\s+(\d{4})$/.exec(value);
  const months = [
    'ม.ค.',
    'ก.พ.',
    'มี.ค.',
    'เม.ย.',
    'พ.ค.',
    'มิ.ย.',
    'ก.ค.',
    'ส.ค.',
    'ก.ย.',
    'ต.ค.',
    'พ.ย.',
    'ธ.ค.',
  ];
  if (!thai || months.indexOf(thai[2]) < 0) return null;
  return (
    Date.UTC(+thai[3] > 2400 ? +thai[3] - 543 : +thai[3], months.indexOf(thai[2]), +thai[1]) /
    DAY_MS
  );
};
export function getBangkokToday() {
  return new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Bangkok',
  }).format(new Date());
}
