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

export function formatFollowerCount(num) {
  if (num === '' || num === null || num === undefined) return '';
  const n = Number(num);
  if (isNaN(n)) return '';
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return n.toString();
}

export function generateSubtitle(specialCriteria) {
  return formatListThai(specialCriteria || []);
}

export function formatListThai(list) {
  if (!list || list.length === 0) return '';
  if (list.length === 1) return list[0];
  if (list.length === 2) return `${list[0]} และ ${list[1]}`;
  const last = list[list.length - 1];
  const rest = list.slice(0, -1);
  return `${rest.join(', ')} และ ${last}`;
}

export function generateTitle(platforms, followerMin, followerMax) {
  const platformText = formatListThai(platforms || []);

  let result = 'ตามหานักรีวิว';
  if (platformText) {
    result += `ช่องทาง ${platformText}`;
  }

  if (followerMin !== '' || followerMax !== '') {
    const minText = formatFollowerCount(followerMin) || '0';
    const maxText = formatFollowerCount(followerMax) || 'Max';
    result += ` ยอด Follower ${minText}-${maxText}`;
  }

  return result;
}

export function generateShortBrief(title, subtitle, wage) {
  const titlePart = title || '';
  const subtitlePart = subtitle ? ` - ${subtitle}` : '';
  const formattedWage =
    wage !== '' && wage !== undefined && wage !== null
      ? Number.isFinite(Number(wage))
        ? Number(wage).toLocaleString('en-US')
        : wage
      : '';

  const html = `<p>${titlePart}${subtitlePart}</p><p>SOW: Create VDO / Create Photo Album xxxx</p><p>BG: ${formattedWage} บาท รวมค่าเดินทาง</p><p><br></p><p><b>เงื่อนไข</b></p><ul><li>รับเงินในนามบุคคล/บริษัท หัก ณ ที่จ่าย เครดิต 45 วัน</li><li>เมื่อได้รับคัดเลือกแล้ว ยกเลิกไม่ได้ทุกกรณี</li><li>บริษัทขอใช้และเปิดเผยข้อมูลส่วนบุคคลตามเอกสาร <a href="https://bit.ly/BR_PDPA" target="_blank" rel="noopener noreferrer">https://bit.ly/BR_PDPA</a></li></ul>`;

  const text = `${titlePart}${subtitlePart}\nSOW: Create VDO / Create Photo Album xxxx\nBG: ${formattedWage} บาท รวมค่าเดินทาง\n\nเงื่อนไข\n- รับเงินในนามบุคคล/บริษัท หัก ณ ที่จ่าย เครดิต 45 วัน\n- เมื่อได้รับคัดเลือกแล้ว ยกเลิกไม่ได้ทุกกรณี\n- บริษัทขอใช้และเปิดเผยข้อมูลส่วนบุคคลตามเอกสาร https://bit.ly/BR_PDPA`;

  return { html, text };
}
