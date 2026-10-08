import { SEED_JOB_POSTINGS } from '../job-postings/jobPostingSeeds.js';

const SEED_BRIEFS = [
  {
    id: 'NRI202609058',
    name: 'KTC Creator Campaign — ไลฟ์สไตล์ กิน เที่ยว และวางแผนค่าใช้จ่าย',
    title: 'รับ Lifestyle Creator ร่วมสร้างคอนเทนต์สำหรับแคมเปญ KTC',
    brand: 'KTC',
    tone: 'ktc',
  },
  {
    id: 'NRI202609044',
    name: 'Boots Thailand — THE ORDINARY Skincare Review',
    title: 'รับ Beauty Creator รีวิวสกินแคร์ THE ORDINARY',
    brand: 'Boots',
    image: '/assets/boots-ordinary.png',
    tone: 'boots',
    products: [
      {
        name: 'The Ordinary Niacinamide 10% + Zinc 1% — 30 ml',
        image: '/assets/ordinary-niacinamide.png',
        description:
          'ตัวเลือกที่ 1: เซรั่ม Niacinamide สำหรับคอนเทนต์รูทีนดูแลผิว\nนักรีวิวที่ได้รับเลือกจะได้รับสินค้า 1 ขวด เพื่อทดลองและถ่ายทอดประสบการณ์จริงในคลิปรีวิว 1 คลิป',
      },
      {
        name: 'The Ordinary Hyaluronic Acid 2% + B5 (with Ceramides) — 30 ml',
        image: '/assets/ordinary-hyaluronic.png',
        description:
          'ตัวเลือกที่ 2: เซรั่ม Hyaluronic Acid สำหรับคอนเทนต์รูทีนเติมความชุ่มชื้น\nเลือกสินค้าได้ 1 รายการหลังตอบรับแคมเปญ ทีมงานยืนยันตัวเลือกและจัดส่งก่อนเริ่มงาน (เงื่อนไขแคมเปญตัวอย่าง)',
      },
    ],
  },
];

const MOCKED_BRIEFS = Array.from({ length: 25 }).map((_, i) => ({
  id: `NRI202610${String(i + 1).padStart(3, '0')}`,
  name: `Sample Campaign Title ${i + 1}`,
  title: `Sample Campaign ${i + 1} for review`,
  brand: i % 2 === 0 ? 'Brand A' : 'Brand B',
  tone: 'new',
}));

const SEED_BRIEFS_ALL = [...SEED_BRIEFS, ...MOCKED_BRIEFS];

function getSavedBriefs() {
  try {
    const briefs = JSON.parse(localStorage.getItem('buddy-briefs'));
    return Array.isArray(briefs) ? briefs : [];
  } catch {
    return [];
  }
}

export function getBriefs() {
  const savedBriefs = getSavedBriefs();
  let linkedPostings;
  return [
    ...SEED_BRIEFS_ALL,
    ...savedBriefs.filter((brief) => !SEED_BRIEFS_ALL.some((seed) => seed.id === brief.id)),
  ].map((brief) => {
    try {
      const overrides = JSON.parse(localStorage.getItem(`buddy-brief-${brief.id}`));
      const mergedBrief = {
        ...brief,
        ...overrides,
        title: overrides?.name || brief.title || brief.name,
      };
      if (!Array.isArray(mergedBrief.products)) {
        if (!linkedPostings) {
          let savedPostings = [];
          try {
            savedPostings = JSON.parse(localStorage.getItem('buddy-job-postings')) || [];
          } catch {
            /* Keep seed fallback. */
          }
          linkedPostings = [
            ...SEED_JOB_POSTINGS.map((posting) => ({
              ...posting,
              ...savedPostings.find((saved) => saved.id === posting.id),
            })),
            ...savedPostings.filter(
              (posting) => !SEED_JOB_POSTINGS.some((seed) => seed.id === posting.id),
            ),
          ];
        }
        const linkedIds = [brief.id, mergedBrief.id, ...(mergedBrief.briefNumbers || [])];
        mergedBrief.products = [
          ...new Set(
            linkedPostings
              .filter((posting) => linkedIds.includes(posting.brief))
              .flatMap((posting) => posting.products || [])
              .filter((product) => typeof product === 'string' && product.trim()),
          ),
        ];
      }
      return mergedBrief;
    } catch {
      return brief;
    }
  });
}

export function getBriefById(briefId, briefs = getBriefs()) {
  let currentId = briefId;
  const visitedIds = new Set();
  while (currentId && !visitedIds.has(currentId)) {
    const exactBrief = briefs.find(
      (brief) => brief.id === currentId || brief.briefNumbers?.includes(currentId),
    );
    if (exactBrief) return exactBrief;
    visitedIds.add(currentId);
    try {
      currentId = JSON.parse(localStorage.getItem(`buddy-brief-${currentId}`))?.id;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export function createBrief(brief) {
  if ([brief.id, ...(brief.briefNumbers || [])].some((number) => getBriefById(number)))
    throw new Error('Brief ID นี้ถูกใช้งานแล้ว');
  localStorage.setItem('buddy-briefs', JSON.stringify([...getSavedBriefs(), brief]));
}

export function updateBrief(briefId, changes) {
  const brief = getBriefById(briefId);
  if (!brief) return;
  const updatedBrief = { ...brief, ...changes };
  const originalBrief = [...SEED_BRIEFS, ...getSavedBriefs()].find(
    (entry) => getBriefById(entry.id)?.id === brief.id,
  );
  if (!originalBrief) return;
  const hasConflict = [updatedBrief.id, ...(updatedBrief.briefNumbers || [])].some((number) => {
    const existing = getBriefById(number);
    return existing && existing.id !== brief.id;
  });
  if (hasConflict) throw new Error('Brief ID นี้ถูกใช้งานแล้ว');
  localStorage.setItem(`buddy-brief-${originalBrief.id}`, JSON.stringify(updatedBrief));
  for (const number of [brief.id, ...(brief.briefNumbers || [])]) {
    if (number !== updatedBrief.id && number !== originalBrief.id) {
      localStorage.setItem(`buddy-brief-${number}`, JSON.stringify({ id: updatedBrief.id }));
    }
  }
}
