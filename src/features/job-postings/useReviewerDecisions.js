import { readStoredJson } from '../../utils/storage.js';
import { useState } from 'react';
export function useReviewerDecisions(jobId) {
  const [decisions, setDecisions] = useState(() => readStoredJson('buddy-reviewer-decisions', {}));
  const decide = (reviewerId, status) => {
    const currentStatus = decisions[`${jobId}:${reviewerId}`]?.status;
    let nextStatus = status;
    if (status === 'Accept') {
      nextStatus = !currentStatus || currentStatus === 'pending' ? 'TeamAccept' : 'Accept';
    }
    const next = {
      ...decisions,
      [`${jobId}:${reviewerId}`]: {
        status: nextStatus,
        by: 'thanya@buddyreview.co',
      },
    };
    localStorage.setItem('buddy-reviewer-decisions', JSON.stringify(next));
    setDecisions(next);
  };
  const sendToSales = (item) => {
    const key = `${jobId}:${item.id}`;
    if (decisions[key]?.status !== 'Accept' || decisions[key]?.sentBy) return;
    const next = {
      ...decisions,
      [key]: {
        ...decisions[key],
        sentBy: 'thanya@buddyreview.co',
      },
    };
    localStorage.setItem('buddy-reviewer-decisions', JSON.stringify(next));
    setDecisions(next);
  };
  const decisionFor = (item) => decisions[`${jobId}:${item.id}`];
  return {
    decisions,
    setDecisions,
    decide,
    sendToSales,
    decisionFor,
  };
}
