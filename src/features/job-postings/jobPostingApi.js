import { getBriefById } from '../briefs/briefApi.js';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
export function getJobPostings() {
  try {
    const savedPostings = JSON.parse(localStorage.getItem('buddy-job-postings')) || [];
    const customPostings = savedPostings.filter(
      (posting) => !SEED_JOB_POSTINGS.find((seedPosting) => seedPosting.id === posting.id),
    );
    const mergedSeedPostings = SEED_JOB_POSTINGS.map((seedPosting) => ({
      ...seedPosting,
      ...savedPostings.find((posting) => posting.id === seedPosting.id),
    }));
    return [...mergedSeedPostings, ...customPostings].map(resolvePostingBrief);
  } catch {
    return SEED_JOB_POSTINGS.map(resolvePostingBrief);
  }
}
export function getJobPostingById(jobPostingId) {
  return getJobPostings().find((posting) => posting.id === jobPostingId);
}
export function createJobPosting(posting) {
  localStorage.setItem('buddy-job-postings', JSON.stringify([...getJobPostings(), posting]));
}
export function updateJobPosting(jobPostingId, posting) {
  const postings = getJobPostings().map((existingPosting) =>
    existingPosting.id === jobPostingId ? posting : existingPosting,
  );
  localStorage.setItem('buddy-job-postings', JSON.stringify(postings));
}

function resolvePostingBrief(posting) {
  const brief = getBriefById(posting.brief);
  let applicants = posting.applicants;
  if (posting.announcementVersion === 2) {
    try {
      applicants = Math.max(
        Number(posting.applicants) || 0,
        (JSON.parse(localStorage.getItem(`buddy-reviewers-${posting.id}`)) || []).length,
      );
    } catch {
      /* Keep saved count. */
    }
  }
  return {
    ...posting,
    applicants,
    brief: brief?.id || posting.brief,
  };
}
