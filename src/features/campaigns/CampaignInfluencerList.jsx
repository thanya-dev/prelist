import { useState } from 'react';
import { ArrowSquareOut, Copy, User } from '@phosphor-icons/react';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { CAMPAIGN_INFLUENCERS, CAMPAIGN_INFLUENCER_STATUSES } from './campaignInfluencerSeeds.js';

export function CampaignInfluencerList({ reviewers = CAMPAIGN_INFLUENCERS }) {
  const [statusFilter, setStatusFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const filters = [{ value: 'all', label: 'ทั้งหมด' }, ...CAMPAIGN_INFLUENCER_STATUSES];
  const visibleInfluencers = reviewers.filter(
    (influencer) => statusFilter === 'all' || influencer.status === statusFilter,
  );
  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      setNotice(`คัดลอกรหัส ${code} แล้ว`);
    } catch {
      setNotice('คัดลอกไม่สำเร็จ กรุณาเลือกรหัสเพื่อคัดลอก');
    }
  };
  return (
    <section className="campaign-influencer-list" aria-label="Influencer List">
      <div className="flex flex-wrap gap-2 mb-6" aria-label="กรองสถานะนักรีวิว">
        {filters.map((filter) => {
          const count = reviewers.filter(
            (influencer) => filter.value === 'all' || influencer.status === filter.value,
          ).length;
          return (
            <button
              key={filter.value}
              aria-pressed={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`rounded-full border px-3 py-2 text-base font-semibold transition-colors ${statusFilter === filter.value ? 'border-[#6024ed] bg-[#6024ed] text-white' : 'border-[#dce5f2] bg-white text-[#35445b] hover:bg-[#f0e9ff]'}`}
            >
              {filter.label}: {count}
            </button>
          );
        })}
      </div>
      <div className="overflow-x-auto rounded-[20px] border border-[#dce5f2] bg-white">
        <table className="w-full min-w-[1050px] border-collapse text-left text-base">
          <colgroup>
            <col className="w-[24%]" />
            <col className="w-[22%]" />
            <col className="w-[15%]" />
            <col className="w-[18%]" />
            <col className="w-[21%]" />
          </colgroup>
          <thead className="text-sm text-[#657795]">
            <tr>
              {['นักรีวิว', 'แคมเปญ', 'ประเภทนักรีวิว', 'สถานะ', 'รหัสแคมเปญ'].map(
                (label, index) => (
                  <th
                    key={label}
                    scope="col"
                    className={`px-6 py-3 font-semibold border-b border-[#dce5f2] ${index === 0 ? 'border-r' : ''}`}
                  >
                    {label}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {visibleInfluencers.map((influencer) => {
              const status = CAMPAIGN_INFLUENCER_STATUSES.find(
                (entry) => entry.value === influencer.status,
              );
              return (
                <tr key={influencer.id} className="border-b border-[#dce5f2] last:border-b-0">
                  <td className="px-6 py-4 border-r border-[#dce5f2]">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          influencer.image ||
                          `https://api.dicebear.com/9.x/notionists/svg?seed=${influencer.id}&backgroundColor=e1eaff,ffe9d1,def5e9`
                        }
                        alt=""
                        className="h-11 w-11 rounded-full shrink-0"
                      />
                      <div>
                        <button
                          className="inline-flex items-center gap-1 font-semibold text-[#080e36]"
                          onClick={() => setSelectedInfluencer(influencer)}
                        >
                          {influencer.name}
                          <ArrowSquareOut size={13} />
                        </button>
                        <div className="flex items-center gap-1 text-[#657795] text-sm mt-1">
                          <PlatformLogo platform={influencer.platform} />
                          {influencer.platform}
                        </div>
                        {influencer.via.length > 0 && (
                          <div className="text-sm text-[#657795] mt-1">
                            via {influencer.via.join(', ')}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#080e36]">{influencer.campaignName}</div>
                    <div className="mt-1 text-sm text-[#657795]">
                      {influencer.campaignPlatforms.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {influencer.reviewerType ? (
                      <span className="inline-flex items-center gap-2 rounded-full border border-[#cbd7e9] bg-[#f7f9fc] px-3 py-1 text-sm font-semibold text-[#35445b]">
                        <User size={13} />
                        {influencer.reviewerType}
                      </span>
                    ) : (
                      <span className="text-[#657795]">ยังไม่ระบุ</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-2 py-1 text-sm font-medium whitespace-nowrap ${status.className}`}
                    >
                      <span className="h-2 w-2 rounded-full bg-current" />
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {influencer.campaignCode ? (
                      <button
                        onClick={() => handleCopyCode(influencer.campaignCode)}
                        aria-label={`คัดลอกรหัส ${influencer.campaignCode}`}
                        className="inline-flex items-center gap-2 rounded-full border border-[#cbd7e9] bg-[#f7f9fc] px-3 py-1 text-sm font-semibold tracking-wide text-[#35445b]"
                      >
                        {influencer.campaignCode}
                        <Copy size={13} />
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-2 text-sm text-[#657795]">
                        <span className="h-2 w-2 rounded-full bg-[#94a3b8]" />
                        ยังไม่ยืนยัน
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {selectedInfluencer && (
        <div className="modal-backdrop" onClick={() => setSelectedInfluencer(null)}>
          <section
            className="reviewer-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-label="ข้อมูลนักรีวิว"
            onClick={(event) => event.stopPropagation()}
          >
            <h2>{selectedInfluencer.name}</h2>
            <p>
              {selectedInfluencer.platform}
              {selectedInfluencer.via.length ? ` · via ${selectedInfluencer.via.join(', ')}` : ''}
            </p>
            <p>{selectedInfluencer.campaignName}</p>
            <p>
              {
                CAMPAIGN_INFLUENCER_STATUSES.find(
                  (status) => status.value === selectedInfluencer.status,
                ).label
              }
            </p>
            <button className="secondary-button" onClick={() => setSelectedInfluencer(null)}>
              ปิด
            </button>
          </section>
        </div>
      )}
      <p role="status" className="text-sm text-[#657795] mt-3">
        {notice}
      </p>
    </section>
  );
}
