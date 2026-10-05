import { SEED_PROJECTS } from '../projects/projectSeeds.js';

const SEED_BRIEFS = [
  {
    id: 'NRI202609058',
    name: SEED_PROJECTS[0].name,
    title: 'เข้าร่วมกิจกรรมและโพสต์คลิปวิดีโอ 1 คลิป',
    brand: SEED_PROJECTS[0].brand,
    image: SEED_PROJECTS[0].image,
    tone: SEED_PROJECTS[0].tone,
  },
];

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
  return [
    ...SEED_BRIEFS,
    ...savedBriefs.filter((brief) => !SEED_BRIEFS.some((seed) => seed.id === brief.id)),
  ].map((brief) => {
    try {
      const overrides = JSON.parse(localStorage.getItem(`buddy-brief-${brief.id}`));
      return { ...brief, ...overrides, title: overrides?.name || brief.title || brief.name };
    } catch {
      return brief;
    }
  });
}

export function getBriefById(briefId) {
  return getBriefs().find((brief) => brief.id === briefId);
}

export function createBrief(brief) {
  localStorage.setItem('buddy-briefs', JSON.stringify([...getSavedBriefs(), brief]));
}

export function updateBrief(briefId, changes) {
  const brief = getBriefById(briefId);
  if (!brief) return;
  localStorage.setItem(`buddy-brief-${briefId}`, JSON.stringify({ ...brief, ...changes }));
}
