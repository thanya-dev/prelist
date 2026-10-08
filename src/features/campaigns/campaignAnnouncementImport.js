import { PRELIST_REVIEWERS } from '../projects/prelistSeeds.js';
import { SEED_JOB_POSTINGS } from '../job-postings/jobPostingSeeds.js';

export function getAnnouncementReviewers(posting) {
  let added = [],
    decisions = {};
  try {
    added = JSON.parse(localStorage.getItem(`buddy-reviewers-${posting.id}`)) || [];
    decisions = JSON.parse(localStorage.getItem('buddy-reviewer-decisions')) || {};
  } catch {
    /* Use available sample applicants. */
  }
  const seed = SEED_JOB_POSTINGS.some((entry) => entry.id === posting.id)
    ? PRELIST_REVIEWERS.slice(0, Math.max(0, Number(posting.applicants) || 0))
    : [];
  return [...seed, ...added]
    .filter((reviewer) => decisions[`${posting.id}:${reviewer.id}`]?.status !== 'Reject')
    .map((reviewer) => ({
      id: `${posting.id}:${reviewer.id}`,
      name: reviewer.username,
      platform:
        { instagram: 'Instagram', tiktok: 'TikTok', youtube: 'YouTube', facebook: 'Facebook' }[
          reviewer.platform
        ] || reviewer.platform,
      via: [],
      campaignName: posting.name,
      campaignPlatforms: posting.platforms || [],
      reviewerType: null,
      status: 'buyer-review',
      campaignCode: null,
      announcementId: posting.id,
      image: reviewer.images?.[0] || '',
      followers: reviewer.followers,
    }));
}
export function getCampaignAnnouncementReviewers(campaignId) {
  try {
    return JSON.parse(localStorage.getItem(`buddy-campaign-influencers-${campaignId}`)) || [];
  } catch {
    return [];
  }
}
export function importAnnouncementReviewers(campaignId, reviewers) {
  const existing = getCampaignAnnouncementReviewers(campaignId);
  const keys = new Set(
    existing.map((reviewer) => `${reviewer.platform.toLowerCase()}:${reviewer.name.toLowerCase()}`),
  );
  const added = reviewers.filter((reviewer) => {
    const key = `${reviewer.platform.toLowerCase()}:${reviewer.name.toLowerCase()}`;
    if (keys.has(key)) return false;
    keys.add(key);
    return true;
  });
  const next = [...existing, ...added];
  localStorage.setItem(`buddy-campaign-influencers-${campaignId}`, JSON.stringify(next));
  return { reviewers: next, added: added.length };
}
