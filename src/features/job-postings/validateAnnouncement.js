export function validateAnnouncement(values, isDraft = values.announcementStatus === 'draft') {
  const nextErrors = {};
  if (!values.name.trim()) nextErrors.name = 'กรุณาระบุชื่อประกาศ';
  if (isDraft) return nextErrors;
  if (!values.subtitle.trim()) nextErrors.subtitle = 'กรุณาระบุคำอธิบายประกาศ';
  if (!values.shortBrief.trim()) nextErrors.shortBriefHtml = 'กรุณาระบุรายละเอียดงาน';
  if (!values.owner.trim()) nextErrors.owner = 'กรุณาเลือกผู้ดูแล';
  if (!values.platforms.length) nextErrors.platforms = 'เลือกอย่างน้อย 1 แพลตฟอร์ม';
  if (
    values.followerMin === '' ||
    values.followerMax === '' ||
    !Number.isFinite(Number(values.followerMin)) ||
    Number(values.followerMin) < 0 ||
    !Number.isFinite(Number(values.followerMax)) ||
    Number(values.followerMax) < Number(values.followerMin)
  )
    nextErrors.followerMin = 'ระบุช่วงผู้ติดตามให้ถูกต้อง';
  for (const key of ['wage', 'productValue'])
    if (values[key] === '' || !Number.isFinite(Number(values[key])) || Number(values[key]) < 0)
      nextErrors[key] = 'ระบุมูลค่าตั้งแต่ 0 บาท';
  return nextErrors;
}
