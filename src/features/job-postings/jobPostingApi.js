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
    return [...mergedSeedPostings, ...customPostings];
  } catch {
    return SEED_JOB_POSTINGS;
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
