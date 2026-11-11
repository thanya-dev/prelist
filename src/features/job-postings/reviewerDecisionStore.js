import { readStoredJson } from '../../utils/storage.js';

export const REVIEWER_DECISIONS_STORAGE_KEY = 'buddy-reviewer-decisions';

/**
 * Prototype sample decisions so JOB20260901 shows reviewers already selected in other
 * announcements of Brief NRI202609058, both in its สมัคร and ลูกค้าเลือกแล้ว tabs.
 * Saved decisions override these samples per `${jobId}:${reviewerId}` key.
 */
export const SEED_REVIEWER_DECISIONS = {
  // สมัคร tab of JOB20260901: selected elsewhere only.
  'JOB20260902:1': { status: 'Accept', by: 'yanisa@buddyreview.co', date: '2026-11-06T03:00:00Z' },
  'JOB20260903:1': {
    status: 'TeamAccept',
    by: 'yanisa@buddyreview.co',
    date: '2026-11-08T03:00:00Z',
  },
  'JOB20261001:3': {
    status: 'TeamAccept',
    by: 'yanisa@buddyreview.co',
    date: '2026-11-07T03:00:00Z',
  },
  'JOB20261002:10': { status: 'Accept', by: 'yanisa@buddyreview.co', date: '2026-11-09T03:00:00Z' },
  // ลูกค้าเลือกแล้ว tab of JOB20260901: customer-selected here and selected elsewhere.
  'JOB20260901:2': { status: 'Accept', by: 'thanya@buddyreview.co', date: '2026-11-10T03:00:00Z' },
  'JOB20260902:2': {
    status: 'TeamAccept',
    by: 'yanisa@buddyreview.co',
    date: '2026-11-05T03:00:00Z',
  },
  'JOB20260901:4': { status: 'Accept', by: 'thanya@buddyreview.co', date: '2026-11-10T04:00:00Z' },
  'JOB20260903:4': { status: 'Accept', by: 'yanisa@buddyreview.co', date: '2026-11-09T05:00:00Z' },
};

export function getStoredReviewerDecisions() {
  return { ...SEED_REVIEWER_DECISIONS, ...readStoredJson(REVIEWER_DECISIONS_STORAGE_KEY, {}) };
}

export function saveReviewerDecisions(decisions) {
  localStorage.setItem(REVIEWER_DECISIONS_STORAGE_KEY, JSON.stringify(decisions));
}
