import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { PRELIST_REVIEWERS } from '../projects/prelistSeeds.js';
import { getBriefById } from '../briefs/briefApi.js';
import { getJobPostings } from './jobPostingApi.js';

// Seed announcements share the sample reviewer list; other announcements have no seed applicants.
export function getPostingReviewers(postingId) {
  return SEED_JOB_POSTINGS.some((posting) => posting.id === postingId) ? PRELIST_REVIEWERS : [];
}

const resolveBriefId = (briefId) => getBriefById(briefId)?.id || briefId;

// Other announcements under the same Brief, including closed ones (BR-01, BR-06).
export function getSiblingPostings(job) {
  if (!job?.brief) return [];
  const briefId = resolveBriefId(job.brief);
  return getJobPostings().filter(
    (posting) => posting.id !== job.id && resolveBriefId(posting.brief) === briefId,
  );
}

/**
 * Summarises one reviewer's status across sibling announcements.
 * Customer selection outranks team selection, which outranks a plain application (BR-02).
 * Rejections elsewhere are not shown yet (BR-05).
 */
export function getBriefSelectionSummary(reviewerId, siblingPostings, decisions) {
  const customer = [];
  const team = [];
  const applied = [];
  siblingPostings.forEach((posting) => {
    const decision = decisions[`${posting.id}:${reviewerId}`];
    const entry = { posting, date: decision?.date || '' };
    if (decision?.status === 'Accept') customer.push({ ...entry, status: 'Accept' });
    else if (decision?.status === 'TeamAccept') team.push({ ...entry, status: 'TeamAccept' });
    else if (
      decision?.status !== 'Reject' &&
      getPostingReviewers(posting.id).some((reviewer) => reviewer.id === reviewerId)
    )
      applied.push(entry);
  });
  const byLatest = (a, b) => (b.date || '').localeCompare(a.date || '');
  const selected = [...customer.sort(byLatest), ...team.sort(byLatest)];
  return { customer, team, applied, selected, isSelected: selected.length > 0 };
}
