export const CREATOR_PLATFORM_CONTENT_TYPES = {
  TikTok: ['Post', 'Repost', 'Comment', 'Live'],
  Facebook: ['Post', 'Comment', 'Share'],
  'Facebook Page': ['Post', 'Reels', 'Live'],
  Instagram: ['Post', 'Reels', 'Story', 'Live', 'Comment'],
  YouTube: ['Post', 'Short Video', 'Live'],
  X: ['Post', 'Quote Tweet', 'Repost / Retweet', 'Reply'],
  Lemon8: ['Post'],
};

export const CONTENT_SCOPE_GROUPS = [
  { label: 'Post / Reels', types: ['Post', 'Reels', 'Video', 'Review'] },
  { label: 'Share / Quote tweet', types: ['Share', 'Quote Tweet'] },
  { label: 'Story / Short video / Live', types: ['Story', 'Short Video', 'Live'] },
  {
    label: 'Repost / Retweet / Reply / Comment',
    types: ['Repost', 'Repost / Retweet', 'Reply', 'Comment'],
  },
];
export const PLATFORM_ORDER = [
  'TikTok',
  'Facebook',
  'Facebook Page',
  'Instagram',
  'YouTube',
  'X',
  'Lemon8',
];
