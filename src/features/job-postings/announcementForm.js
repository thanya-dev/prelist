export const SPECIAL_CRITERIA_OPTIONS = [
  'คนมีผมหงอก',
  'คนมีสิว',
  'คนสายตาสั้น',
  'คนใส่รีเทนเนอร์',
  'คนอายุ 50+ คนสูงวัย',
  'ต้องย้อมผมจริง',
  'Blue Collar',
  'พนักงานราชการ / ข้าราชการ',
  'คนต่างจังหวัด',
  'คนเลี้ยงสุนัข / แมว',
  'คนเลี้ยงปลา / ปลาสวยงาม',
  'คนชอบเดินป่า',
  'คนชอบงาน Concert / Festival',
  'คนที่ชื่นชอบงานศิลปะ / แฟนอาร์ต / ผลงานออริจินอล / งานแฮนด์เมด / งานอีเวนต์อาร์ต',
  'Plus Size',
  'Review Beauty',
  'Before - After',
  'คนขับรถยนต์ไฟฟ้า / EV',
  'มีรถจักรยานยนต์',
  'Students / University Students',
  'นักศึกษา ป โท',
  'นักกีฬา ทั่วไป ไม่ใช่ทีมชาติ',
  'พ่อค้าแม่ค้า',
  'คน Look Premium',
  'Cooking',
  'Foodie',
  'React Series / MV',
  'Fandom',
  'Healthy',
  'Fitness / Sport',
  'Cover Dance',
  'Family',
  'Mom & Kids',
  'Home Decoration',
  'นัก Live / Affliiated นายหน้าขายของ',
  'IT / Gadget',
  'Travel',
  'คู่รัก',
  'ชาวสวน',
  'กลุ่มช่าง',
  'Dance Challenge',
  'รีวิว SKU ชิ้นต่อไป (ราคาต่อ SKU)',
].sort((a, b) => a.localeCompare(b, 'th'));

export const ANNOUNCEMENT_PLATFORMS = [
  'Instagram',
  'TikTok',
  'YouTube',
  'Facebook',
  'Facebook Page',
  'X',
  'Lemon8',
];
export function getAnnouncementCriteria(posting) {
  return (
    posting.specialCriteriaOptions ??
    [
      posting.specialCriteria ??
        [
          posting.targetGroup,
          posting.genders?.join(', ') || posting.gender,
          posting.ageMin !== undefined &&
          posting.ageMin !== null &&
          posting.ageMin !== '' &&
          posting.ageMax !== undefined &&
          posting.ageMax !== null &&
          posting.ageMax !== ''
            ? `อายุ ${posting.ageMin}–${posting.ageMax} ปี`
            : '',
        ]
          .filter(Boolean)
          .join(' · '),
    ].filter(Boolean)
  ).filter((criterion) => !/^อายุ\s*[-–]\s*ปี$/.test(criterion.trim()));
}
