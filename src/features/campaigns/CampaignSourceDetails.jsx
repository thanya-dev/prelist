import { LockSimple } from '@phosphor-icons/react';
import { JobPostingSummary } from '../../components/shared/JobPostingSummary.jsx';
import { JobPostingInformation } from '../../components/shared/JobPostingInformation.jsx';

export function CampaignSourceDetails({ campaign, summaryLabel = 'ข้อมูลจากประกาศ' }) {
  const source = campaign.sourcePosting;
  if (!source) return null;
  return (
    <details className="mb-8 border border-[#e5e7eb] rounded-xl bg-white overflow-hidden shadow-sm">
      <summary className="flex items-center gap-2 p-4 bg-[#f8f9fa] border-b border-[#e5e7eb] font-semibold text-[#273348] cursor-pointer hover:bg-[#f1f3f5] transition-colors">
        <LockSimple size={18} className="text-[#6545ff]" /> {summaryLabel}
        {summaryLabel === 'ข้อมูลจากประกาศ' && ` · ${source.name}`}
      </summary>
      <div className="p-4 bg-[#fcfcfd] border-b border-[#e5e7eb] flex items-center justify-between text-sm">
        <span className="text-[#7f8ca4] font-medium">
          Brief ID: <span className="text-[#273348]">{source.brief}</span> · {source.id}
        </span>
        <a
          href={`/job-postings/${source.id}`}
          target="_blank"
          rel="noreferrer"
          className="text-[#6545ff] font-semibold hover:underline flex items-center gap-1"
        >
          ดูประกาศต้นทาง
        </a>
      </div>
      <div className="p-6 space-y-6">
        <JobPostingSummary job={source} />
        <JobPostingInformation job={source} />
      </div>
    </details>
  );
}
