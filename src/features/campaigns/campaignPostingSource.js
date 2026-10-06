import { DAY_MS, parseDay } from '../../utils/formatDate.js';
import { CONTENT_SCOPE_GROUPS } from '../job-postings/CreatorCriteriaFields.jsx';

// Only matching campaign fields are inherited. OP, Group, workflow and points stay independent.
export const POSTING_CAMPAIGN_FIELDS = [
  'campaignType',
  'subtitle',
  'cover',
  'target',
  'targetPost',
  'targetGroup',
  'genders',
  'ageMin',
  'ageMax',
  'followerMin',
  'followerMax',
  'platforms',
  'contentScope',
  'applicationStart',
  'applicationEnd',
  'campaignStart',
  'campaignEnd',
  'brief',
  'reward',
  'products',
];
function normalizeDate(value) {
  const day = parseDay(value);
  return day === null ? '' : new Date(day * DAY_MS).toISOString().slice(0, 10);
}
export function getCampaignPostingFields(postings) {
  const sourcePostings = Array.isArray(postings) ? postings : postings ? [postings] : [];
  if (sourcePostings.length === 0) return {};

  const first = sourcePostings[0];

  return {
    ...(Array.isArray(first.products) ? { products: first.products } : {}),
    campaignType: first.campaignType ?? '',
    name: first.name ?? '',
    subtitle: first.subtitle ?? '',
    cover: first.image ?? '',
    target: sourcePostings.reduce((sum, p) => sum + (Number(p.reviewers) || 0), 0) || '',
    targetPost: sourcePostings.reduce((sum, p) => sum + (Number(p.targetPost) || 0), 0) || '',
    targetGroup: first.targetGroup ?? '',
    genders: [
      ...new Set(
        sourcePostings.flatMap(
          (p) =>
            p.genders ?? (p.gender === 'ทุกเพศ' ? ['ชาย', 'หญิง'] : p.gender ? [p.gender] : []),
        ),
      ),
    ],
    ageMin:
      Math.min(
        ...sourcePostings.map((p) => Number(p.ageMin) || Infinity).filter((n) => n !== Infinity),
      ) || '',
    ageMax:
      Math.max(...sourcePostings.map((p) => Number(p.ageMax) || 0).filter((n) => n !== 0)) || '',
    followerMin:
      Math.min(
        ...sourcePostings
          .map((p) => Number(p.followerMin) || Infinity)
          .filter((n) => n !== Infinity),
      ) || '',
    followerMax:
      Math.max(...sourcePostings.map((p) => Number(p.followerMax) || 0).filter((n) => n !== 0)) ||
      '',
    platforms: [...new Set(sourcePostings.flatMap((p) => p.platforms || []))],
    contentScope:
      first.contentScope ??
      CONTENT_SCOPE_GROUPS.find((scope) =>
        first.contentTypes?.some((type) => scope.types.includes(type)),
      )?.label ??
      '',
    applicationStart: normalizeDate(first.applyStartDate),
    applicationEnd: normalizeDate(first.deadline),
    campaignStart: normalizeDate(first.startDate),
    campaignEnd: normalizeDate(first.endDate),
    brief: first.shortBrief ?? '',
    reward: first.benefit ?? '',
  };
}
export function applyCampaignPostingSource(campaign) {
  // Support legacy sourcePosting or new sourcePostings array
  const postings =
    campaign.sourcePostings || (campaign.sourcePosting ? [campaign.sourcePosting] : []);

  return postings.length > 0
    ? {
        ...campaign,
        ...getCampaignPostingFields(postings),
        sourcePostings: postings,
        name: campaign.name ?? postings[0].name ?? '',
      }
    : { ...campaign, sourcePostings: [] };
}
