const fs = require('fs');
const {
  generateTitle,
  generateSubtitle,
  generateShortBrief,
} = require('./src/features/job-postings/announcementForm.js');

let content = fs.readFileSync('./src/features/job-postings/jobPostingSeeds.js', 'utf8');

// We will modify the file to import the generators and map the array.
const newContent = `import { generateTitle, generateSubtitle, generateShortBrief, getAnnouncementCriteria } from './announcementForm.js';

const RAW_POSTINGS = [
  {
    id: 'JOB20260901',
    brief: 'NRI202609058',
    reviewers: 0,
    applicants: 0,
    viewerCount: 0,
    tone: 'mascot',
    brand: 'KTC',
    status: 'Draft',
    owner: 'admin@buddyreview.co',
    platforms: ['Facebook', 'TikTok'],
    followerMin: 10000,
    followerMax: 50000,
    wage: 3500,
    specialCriteriaOptions: ['พนักงานราชการ / ข้าราชการ'],
  },
  {
    id: 'JOB20260902',
    brief: 'NRI202609058',
    reviewers: 20,
    applicants: 150,
    viewerCount: 1500,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '1 ก.ย. 2026',
    deadline: '30 ก.ย. 2026',
    owner: 'marketing@buddyreview.co',
    platforms: ['Instagram', 'Facebook'],
    followerMin: 50000,
    followerMax: 300000,
    wage: 8000,
    specialCriteriaOptions: ['Travel'],
  },
  {
    id: 'JOB20260903',
    brief: 'NRI202609058',
    reviewers: 10,
    applicants: 80,
    viewerCount: 800,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '15 ก.ย. 2026',
    deadline: '30 ก.ย. 2026',
    owner: 'content@buddyreview.co',
    platforms: ['TikTok'],
    followerMin: 100000,
    followerMax: 1000000,
    wage: 10000,
    productValue: 1500,
    specialCriteriaOptions: ['Foodie'],
  },
  {
    id: 'JOB20261001',
    brief: 'NRI202609058',
    reviewers: 5,
    applicants: 12,
    viewerCount: 120,
    tone: 'mascot',
    brand: 'KTC',
    campaignType: 'normal',
    owner: 'thanya@buddyreview.co',
    targetPost: 5,
    targetGroup:
      'Lifestyle Creator วัยทำงาน เน้นชีวิตประจำวันและการวางแผนค่าใช้จ่าย มีผู้ติดตามชาวไทยเป็นหลัก',
    genders: ['ชาย', 'หญิง'],
    gender: 'ทุกเพศ',
    ageMin: 25,
    ageMax: 40,
    followerMin: 10000,
    followerMax: 100000,
    platforms: ['TikTok', 'Instagram'],
    contentScope: 'Post / Reels',
    contentTypes: ['Post', 'Reels'],
    applyStartDate: '2026-10-01',
    deadline: '2026-10-10',
    wage: 4500,
    productValue: 0,
    specialCriteriaOptions: ['Students / University Students'],
  },
  {
    id: 'JOB20261002',
    brief: 'NRI202609058',
    reviewers: 0,
    applicants: 4,
    viewerCount: 40,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '2 ต.ค. 2026',
    deadline: '12 ต.ค. 2026',
    owner: 'thanya@buddyreview.co',
    platforms: ['Facebook'],
    followerMin: 5000,
    followerMax: 20000,
    wage: 2500,
    specialCriteriaOptions: ['คนวัยทำงาน'],
  },
  {
    id: 'JOB20261003',
    brief: 'NRI202609058',
    reviewers: 0,
    applicants: 1,
    viewerCount: 10,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '3 ต.ค. 2026',
    deadline: '15 ต.ค. 2026',
    owner: 'tech@buddyreview.co',
    platforms: ['YouTube'],
    followerMin: 100000,
    followerMax: 500000,
    wage: 20000,
    specialCriteriaOptions: ['IT / Gadget'],
  },
  {
    id: 'JOB20261004',
    brief: 'NRI202609044',
    reviewers: 10,
    applicants: 45,
    viewerCount: 450,
    tone: 'boots',
    brand: 'Boots',
    applyStartDate: '1 ต.ค. 2026',
    deadline: '15 ต.ค. 2026',
    owner: 'beauty@buddyreview.co',
    platforms: ['Instagram', 'TikTok'],
    followerMin: 20000,
    followerMax: 100000,
    wage: 6000,
    productValue: 2500,
    specialCriteriaOptions: ['Review Beauty'],
  },
  {
    id: 'JOB20261005',
    brief: 'NRI202609058',
    reviewers: 0,
    applicants: 0,
    viewerCount: 0,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '15 ต.ค. 2026',
    deadline: '31 ต.ค. 2026',
    owner: 'finance@buddyreview.co',
    platforms: ['Facebook'],
    followerMin: 100000,
    followerMax: 1000000,
    wage: 15000,
    specialCriteriaOptions: ['พนักงานราชการ / ข้าราชการ'],
  },
  {
    id: 'JOB20261101',
    brief: 'NRI202609058',
    reviewers: 0,
    applicants: 0,
    viewerCount: 0,
    tone: 'mascot',
    brand: 'KTC',
    applyStartDate: '1 พ.ย. 2026',
    deadline: '11 พ.ย. 2026',
    owner: 'marketing@buddyreview.co',
    platforms: ['TikTok', 'Facebook'],
    followerMin: 50000,
    followerMax: 500000,
    wage: 12000,
  },
];

export const SEED_JOB_POSTINGS = RAW_POSTINGS.map((job) => {
  const criteria = getAnnouncementCriteria(job);
  const generatedName = generateTitle(job.platforms || [], job.followerMin ?? '', job.followerMax ?? '');
  const generatedSubtitle = generateSubtitle(criteria);
  const generatedBrief = generateShortBrief(generatedName, generatedSubtitle, job.wage ?? '');
  
  return {
    ...job,
    name: generatedName,
    subtitle: generatedSubtitle,
    shortBrief: generatedBrief.text,
    shortBriefHtml: generatedBrief.html,
  };
});

// Additional prototype announcements for browsing multiple result pages.
SEED_JOB_POSTINGS.push(
  ...Array.from({ length: 24 }, (_, index) => {
    const isDraft = index % 3 === 0;
    const applicants = isDraft ? 0 : (index + 1) * 2;
    const platforms = ['TikTok', 'Instagram'];
    const followerMin = 10000;
    const followerMax = 100000;
    const wage = 3500;
    const specialCriteriaOptions = [['Lifestyle'], ['Travel'], ['Foodie']][index % 3];
    
    const generatedName = generateTitle(platforms, followerMin, followerMax);
    const generatedSubtitle = generateSubtitle(specialCriteriaOptions);
    const generatedBrief = generateShortBrief(generatedName, generatedSubtitle, wage);

    return {
      id: \`JOB202610\${String(101 + index)}\`,
      brief: 'NRI202609058',
      name: generatedName,
      subtitle: generatedSubtitle,
      brand: 'KTC',
      announcementVersion: 2,
      recruitmentMode: 'manual',
      announcementStatus: index % 3 === 2 ? 'inactive' : 'active',
      status: isDraft ? 'Draft' : 'Published',
      campaignType: 'confidential',
      applicants,
      viewerCount: applicants * 10,
      owner: 'thanya@buddyreview.co',
      platforms,
      followerMin,
      followerMax,
      wage,
      productValue: 0,
      specialCriteriaOptions,
      shortBrief: generatedBrief.text,
      shortBriefHtml: generatedBrief.html,
    };
  })
);
`;

fs.writeFileSync('./src/features/job-postings/jobPostingSeeds.js', newContent);
