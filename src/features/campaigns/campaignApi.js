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
};
function getCampaigns() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}
export function getCampaignById(id) {
  return getCampaigns()[id] || (id === DEFAULT_CAMPAIGN.id ? DEFAULT_CAMPAIGN : null);
}
