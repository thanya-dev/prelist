import { SEED_JOB_POSTINGS } from '../job-postings/jobPostingSeeds.js';

const STORAGE_KEY = 'buddy-review-campaigns-v1';
export const DEFAULT_CAMPAIGN = {
  id: 'page-promotion-facebook',
  projectId: 'PRJ2026090022',
  projectName: 'Page Promotion Sale Here',
  name: 'Page Promotion Sale Here',
  subtitle: 'Facebook Page',
  assignOp: 'thanya@buddyreview.co',
  group: 'Group1',
  status: 'active',
  campaignType: 'normal',
  applicationStart: '2026-09-28',
  applicationEnd: '2026-09-30',
  campaignStart: '2026-10-01',
  campaignEnd: '2026-10-30',
  workflow: 'post',
  demographics: [],
  target: 3,
  targetPost: 3,
  targetGroup: '',
  genders: ['ชาย', 'หญิง'],
  ageMin: 0,
  ageMax: 100,
  followerMin: 0,
  followerMax: 1000000,
  platforms: ['Facebook Page'],
  contentScope: 'Post / Reels',
  cover:
    'https://s3.ap-southeast-1.amazonaws.com/bdb-parse-file/public/project/profile/cbvpbV1FtT-1790576864553.jpg',
  shipping: 'none',
  brief: '',
  briefLink: '',
  briefFiles: [],
  dos: [''],
  donts: [''],
  exampleImages: [],
  exampleVideos: [],
  reward: '',
  // Prototype sample: this campaign already uses JOB20260901 as its source announcement.
  sourcePostings: SEED_JOB_POSTINGS.filter((posting) => posting.id === 'JOB20260901').map(
    (posting) => structuredClone(posting),
  ),
};
// Prototype sample campaigns that already use announcements from NRI202609058, so the
// source picker can demonstrate announcements taken by other campaigns.
const SEED_CAMPAIGNS = [
  {
    id: 'ktc-instagram-travel',
    name: 'KTC Travel Instagram Review',
    sourcePostings: [{ id: 'JOB20260902', brief: 'NRI202609058' }],
  },
  {
    id: 'ktc-tiktok-foodie',
    name: 'KTC Foodie TikTok Review',
    sourcePostings: [{ id: 'JOB20260903', brief: 'NRI202609058' }],
  },
].map((campaign) => ({
  ...DEFAULT_CAMPAIGN,
  subtitle: '',
  ...campaign,
}));
function getCampaigns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
function getAllCampaigns() {
  const savedCampaigns = getCampaigns();
  const seeds = [DEFAULT_CAMPAIGN, ...SEED_CAMPAIGNS].filter(
    (campaign) => !savedCampaigns[campaign.id],
  );
  return [...seeds, ...Object.values(savedCampaigns)];
}
export function getCampaignById(id) {
  return (
    getCampaigns()[id] ||
    (id === DEFAULT_CAMPAIGN.id ? DEFAULT_CAMPAIGN : null) ||
    SEED_CAMPAIGNS.find((campaign) => campaign.id === id) ||
    null
  );
}
// Maps posting ID → the other campaign already using it as its source posting.
export function getPostingCampaignUsage(excludeCampaignId) {
  const usage = new Map();
  getAllCampaigns().forEach((campaign) => {
    if (!campaign?.id || campaign.id === excludeCampaignId) return;
    const postings =
      campaign.sourcePostings || (campaign.sourcePosting ? [campaign.sourcePosting] : []);
    postings.forEach((posting) => {
      if (posting?.id && !usage.has(posting.id)) usage.set(posting.id, campaign);
    });
  });
  return usage;
}
export function saveCampaign(campaign) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...getCampaigns(), [campaign.id]: campaign }));
}
