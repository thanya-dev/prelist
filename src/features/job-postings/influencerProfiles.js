/**
 * Prototype Influencer profiles: one person can apply to an announcement with several socials.
 * Socials map to a profile by reviewer id; reviewers without a profile fall into the shared
 * NO_PROFILE_GROUP_ID group. Age/gender live on the profile. Bank/address data is never stored here.
 */
export const INFLUENCER_PROFILE_URL = 'https://business.buddyreview.co/app/influencer/PaACRc00Ey';
export const NO_PROFILE_GROUP_ID = 'no-profile';

export const SEED_INFLUENCER_PROFILES = [
  {
    id: 'IP-001',
    name: 'Fix Wongsapat',
    gender: 'MALE',
    age: 29,
    reviewerIds: [1, 3, 11],
  },
  {
    id: 'IP-002',
    name: 'Aommy Chanya',
    gender: 'FEMALE',
    age: 24,
    reviewerIds: [2, 10, 12],
  },
  {
    id: 'IP-003',
    name: 'Sweet Cake',
    gender: 'FEMALE',
    age: 26,
    reviewerIds: [4, 14],
  },
  {
    id: 'IP-004',
    name: 'Mint Pimchanok',
    gender: 'FEMALE',
    age: 27,
    reviewerIds: [16, 18],
  },
  {
    id: 'IP-005',
    name: 'Nina Review',
    gender: 'FEMALE',
    age: 30,
    reviewerIds: [20, 22],
  },
  {
    id: 'IP-006',
    name: 'Ploy Daily',
    gender: 'FEMALE',
    age: 23,
    reviewerIds: [24],
  },
];

const PROFILE_BY_REVIEWER_ID = new Map(
  SEED_INFLUENCER_PROFILES.flatMap((profile) =>
    profile.reviewerIds.map((reviewerId) => [String(reviewerId), profile]),
  ),
);

// Returns the reviewer's Influencer profile, or null when the social has no profile.
export function getReviewerProfile(reviewer) {
  return PROFILE_BY_REVIEWER_ID.get(String(reviewer.id)) || null;
}

const getGroupId = (reviewer) => getReviewerProfile(reviewer)?.id || NO_PROFILE_GROUP_ID;

/**
 * Groups reviewers by Influencer profile, sorted by profile name A → Z (case-insensitive),
 * with the shared "no profile" group last. `allReviewers` lets a group know its socials in
 * other tabs.
 */
export function groupReviewersByProfile(visibleReviewers, allReviewers) {
  const groups = new Map();
  visibleReviewers.forEach((reviewer) => {
    const groupId = getGroupId(reviewer);
    if (!groups.has(groupId)) {
      groups.set(groupId, {
        id: groupId,
        profile: getReviewerProfile(reviewer),
        reviewers: [],
        allSocials: allReviewers.filter((item) => getGroupId(item) === groupId),
      });
    }
    groups.get(groupId).reviewers.push(reviewer);
  });
  return [...groups.values()].sort((a, b) => {
    if (!a.profile || !b.profile) return Number(!a.profile) - Number(!b.profile);
    return a.profile.name.localeCompare(b.profile.name, 'en', { sensitivity: 'base' });
  });
}
