const PLATFORM_DISPLAY_NAMES = {
  instagram: 'Instagram',
  tiktok: 'TikTok',
  facebook: 'Facebook',
  facebookpage: 'Facebook Page',
  fbpage: 'Facebook Page',
  youtube: 'YouTube',
  x: 'X',
  twitter: 'X',
  lemon8: 'Lemon 8',
};

const PROFILE_URL_BUILDERS = {
  instagram: (username) => `https://www.instagram.com/${username}`,
  tiktok: (username) => `https://www.tiktok.com/@${username}`,
  facebook: (username) => `https://www.facebook.com/${username}`,
  facebookpage: (username) => `https://www.facebook.com/${username}`,
  fbpage: (username) => `https://www.facebook.com/${username}`,
  youtube: (username) => `https://www.youtube.com/@${username}`,
  x: (username) => `https://x.com/${username}`,
  twitter: (username) => `https://x.com/${username}`,
  lemon8: (username) => `https://www.lemon8-app.com/@${username}`,
};

const COMPACT_MULTIPLIERS = { K: 1e3, M: 1e6, B: 1e9 };

export const PRE_LIST_HEADERS = ['No.', 'Account Name', 'Link Account', 'Platform', 'Followers'];

const normalizePlatformKey = (platform) =>
  String(platform || '')
    .toLowerCase()
    .replace(/[\s_-]/g, '');

export function getPlatformDisplayName(platform) {
  return PLATFORM_DISPLAY_NAMES[normalizePlatformKey(platform)] || String(platform || '');
}

export function getReviewerProfileUrl(reviewer) {
  if (reviewer.profileUrl) return reviewer.profileUrl;
  const buildUrl = PROFILE_URL_BUILDERS[normalizePlatformKey(reviewer.platform)];
  return buildUrl ? buildUrl(encodeURIComponent(reviewer.username)) : '';
}

export function parseFollowerCount(followers) {
  if (typeof followers === 'number') return Math.round(followers);
  const match = String(followers ?? '')
    .replace(/,/g, '')
    .trim()
    .match(/^(\d+(?:\.\d+)?)\s*([KMB])?$/i);
  if (!match) return '';
  return Math.round(Number(match[1]) * (COMPACT_MULTIPLIERS[match[2]?.toUpperCase()] || 1));
}

export function createPreListFilename({ briefId, briefName, jobId }) {
  const safeBriefName = String(briefName ?? '')
    .trim()
    .replace(/[\\/*?"<>|]/g, '-');
  return `Pre-List ${briefId} : ${safeBriefName} (${jobId}).csv`;
}

export function createPreListRows(reviewers) {
  return reviewers.map((reviewer, index) => [
    index + 1,
    reviewer.username,
    getReviewerProfileUrl(reviewer),
    getPlatformDisplayName(reviewer.platform),
    parseFollowerCount(reviewer.followers),
  ]);
}
