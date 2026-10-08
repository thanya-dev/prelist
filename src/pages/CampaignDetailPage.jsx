import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CaretDown, Copy, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { getCampaignById } from '../features/campaigns/campaignApi.js';
import { SEED_PROJECTS } from '../features/projects/projectSeeds.js';
import { BrandMark } from '../components/shared/BrandMark.jsx';
import { Logo } from '../components/layout/Logo.jsx';
import { CampaignSourceDetails } from '../features/campaigns/CampaignSourceDetails.jsx';
import { AnnouncementReviewerImport } from '../features/campaigns/AnnouncementReviewerImport.jsx';
import { getCampaignAnnouncementReviewers } from '../features/campaigns/campaignAnnouncementImport.js';
import { CampaignInfluencerList } from '../features/campaigns/CampaignInfluencerList.jsx';
import { CAMPAIGN_INFLUENCERS } from '../features/campaigns/campaignInfluencerSeeds.js';
import { InfluencerList } from '../features/campaigns/InfluencerList.jsx';
export function CampaignDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const campaign = getCampaignById(id);
  const [importedReviewers, setImportedReviewers] = useState(() =>
    getCampaignAnnouncementReviewers(id),
  );
  useEffect(() => {
    setImportedReviewers(getCampaignAnnouncementReviewers(id));
  }, [id]);
  const influencers = [
    ...(id === 'page-promotion-facebook' ? CAMPAIGN_INFLUENCERS : []),
    ...importedReviewers,
  ];
  const [stage, setStage] = useState('INFLUENCER LIST');
  if (!campaign)
    return (
      <main className="p-8">
        <h1>ไม่พบแคมเปญ</h1>
        <button onClick={() => navigate('/')}>กลับหน้า Projects</button>
      </main>
    );
  const stages = [
    [String(influencers.length), 'INFLUENCER LIST'],
    ['31', 'CONFIRM LIST'],
    ['0', 'CONTENT IDEA'],
    ['0', 'DRAFTING'],
    ['0', 'POSTS'],
  ];
  return (
    <div className="min-h-screen bg-[#f7f7f7] text-[#424242]">
      <header className="h-16 flex items-center gap-6 px-6 bg-white shadow-sm relative z-10">
        <Logo />
        <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold">
          <button className="hover:text-primary">Campaigns</button>
          <button className="hover:text-primary">Discover</button>
          <button className="hover:text-primary">Briefs</button>
          <button onClick={() => navigate('/')} className="hover:text-primary">
            Projects
          </button>
          <button className="hover:text-primary">User Search</button>
          <button className="hover:text-primary">External Profiles</button>
          <button className="hover:text-primary">OTP History</button>
          <button className="hover:text-primary">Management</button>
        </nav>
        <span className="ml-auto text-sm text-[#8290a6]">Hi, thanya@buddyreview.co</span>
      </header>
      <div className="h-16 flex items-center gap-4 px-4 lg:px-8 bg-[#f4f4f5] border-b border-[#e5e7eb]">
        <button
          onClick={() => navigate(`/projects/${campaign.projectId}`)}
          className="h-10 px-4 flex items-center gap-2 border border-[#b8c1cf] rounded-md bg-white text-sm font-semibold hover:bg-gray-50"
        >
          Project
        </button>
        <button className="h-10 px-4 flex items-center gap-2 border border-[#b8c1cf] rounded-md bg-white text-sm font-semibold hover:bg-gray-50 max-w-[55%] truncate">
          <span className="truncate">
            {campaign.name} : {campaign.subtitle}
          </span>{' '}
          <CaretDown />
        </button>
        <button
          className="ml-auto h-10 px-4 flex items-center gap-2 rounded-md bg-[#eeedff] text-[#4035da] text-sm font-semibold hover:bg-[#e4e2ff]"
          onClick={() => navigate(`/campaigns/create?projectId=${campaign.projectId}`)}
        >
          <Plus /> <span className="hidden sm:inline">Create new campaign</span>
        </button>
      </div>
      <section className="flex flex-col gap-6 pt-8 px-4 sm:px-6 lg:px-12 bg-[#6545ff] text-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="campaign-identity flex items-center gap-4 min-w-0">
            <BrandMark
              project={{
                ...SEED_PROJECTS[0],
                name: campaign.name,
                image: campaign.cover,
                tone: campaign.sourcePosting ? 'new' : SEED_PROJECTS[0].tone,
              }}
              large
            />
            <div className="min-w-0">
              <h1 className="m-0 mb-2 text-2xl font-bold break-words">{campaign.name}</h1>
              <b className="text-base font-medium opacity-90">{campaign.subtitle}</b>
            </div>
          </div>
          <div className="grid shrink-0 grid-cols-[12px_1fr] items-center gap-x-2 gap-y-1 text-sm font-semibold">
            <span className="w-3 h-3 rounded-full bg-[#a6e64d]"></span>
            <b className="uppercase">
              {{ draft: 'DRAFT', active: 'ON GOING', completed: 'COMPLETED' }[campaign.status]}
            </b>
            <small className="col-start-2 opacity-80 text-xs">
              {campaign.campaignStart || 'ยังไม่ระบุ'} – {campaign.campaignEnd || 'ยังไม่ระบุ'}
            </small>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-bold">
          <button className="hover:opacity-80" onClick={() => navigate(`/campaigns/${id}/edit`)}>
            EDIT
          </button>
          <button className="hover:opacity-80">RESET ALL SELECTION</button>
          <button className="text-[#ff3855] hover:opacity-80">HARD RESET</button>
          <button className="hover:opacity-80 flex items-center">PASSWORD ◉ &nbsp;••••••</button>
          <button className="hover:opacity-80 p-1">
            <Copy size={16} />
          </button>
        </div>
        <div className="flex gap-2 sm:gap-4 overflow-x-auto w-full">
          {[
            'Campaign Task',
            'Approve Content',
            'Report',
            'Contract Report',
            'External Payment',
          ].map((item, index) => (
            <button
              className={`min-h-[48px] px-5 text-base font-semibold whitespace-nowrap transition-colors ${
                index === 0
                  ? 'bg-[#4932c7] text-white rounded-t-lg'
                  : 'text-[#d8d2ff] hover:text-white'
              }`}
              key={item}
            >
              {item}
            </button>
          ))}
        </div>
      </section>
      <main className="pt-6 px-4 sm:px-6 lg:px-12 pb-20">
        <CampaignSourceDetails campaign={campaign} />
        <div className="flex flex-wrap gap-3">
          {stages.map(([count, label], index) => (
            <button
              className={`min-w-[150px] min-h-12 py-3 pl-4 pr-8 text-sm font-bold text-left transition-colors relative ${
                stage === label
                  ? 'bg-[#6545ff] text-white'
                  : 'bg-[#eceaea] text-[#999] hover:bg-[#e0e0e0]'
              }`}
              style={{ clipPath: 'polygon(0 0, 90% 0, 100% 50%, 90% 100%, 0 100%)' }}
              onClick={() => setStage(label)}
              key={label}
            >
              <b className="mr-2">{count}</b> {label}
            </button>
          ))}
        </div>
        {stage !== 'INFLUENCER LIST' && (
          <div className="flex flex-wrap gap-3 mt-4 mb-6">
            {[
              ['0', 'ADMIN IGNORED'],
              ['0', 'BRAND IGNORED'],
              ['1', 'CANCELED'],
              ['0', 'RESERVED'],
            ].map(([count, label]) => (
              <button
                key={label}
                className="min-w-[160px] min-h-10 py-2 px-4 border-2 border-[#d4d4d4] rounded-lg text-[#aaa] text-sm font-bold text-left hover:border-[#bbb] hover:text-[#888] transition-colors"
              >
                <b className="mr-2">{count}</b> {label}
              </button>
            ))}
          </div>
        )}
        {stage === 'INFLUENCER LIST' ? (
          <div className="mt-6">
            <AnnouncementReviewerImport
              campaign={campaign}
              project={SEED_PROJECTS.find((project) => project.id === campaign.projectId)}
              onImport={setImportedReviewers}
            />
            <CampaignInfluencerList reviewers={influencers} />
          </div>
        ) : stage === 'CONFIRM LIST' ? (
          <InfluencerList />
        ) : (
          <div className="space-y-6">
            <section className="p-6 rounded-xl bg-white shadow-sm border border-[#e5e7eb]">
              <h2 className="m-0 text-xl font-bold text-[#273348]">REQUIREMENT</h2>
              <p className="mt-1 mb-6 text-xs text-[#7f8ca4]">
                (Estimated result number from selected account to participate this campaign which
                included waiting for brand approve, final approve, approved stage)
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 items-center">
                <div>
                  <strong className="block text-3xl font-bold text-[#273348]">3</strong>
                  <span className="text-sm font-semibold text-[#7f8ca4]">POSTS</span>
                </div>
                <div>
                  <b className="block text-sm font-bold text-[#273348]">TOP LIFESTYLE</b>
                  <small className="text-xs text-[#7f8ca4]">SUBTAG</small>
                  <p className="m-0 text-sm font-medium text-[#4034dc]">
                    promotion &nbsp;&nbsp; 100%
                  </p>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex gap-1 h-2">
                    <i className="w-1/3 bg-[#4034dc] rounded-full"></i>
                    <i className="w-1/3 bg-[#e5e7eb] rounded-full"></i>
                    <i className="w-1/3 bg-[#e5e7eb] rounded-full"></i>
                  </div>
                  <small className="text-xs font-bold text-[#7f8ca4] mt-1">NEW&nbsp; 100%</small>
                </div>
                <div>
                  <strong className="block text-2xl font-bold text-[#273348]">22,825</strong>
                  <span className="text-xs font-semibold text-[#7f8ca4] block mb-2">
                    / 1<br />
                    ESTIMATED REACH
                  </span>
                  <strong className="block text-2xl font-bold text-[#273348]">10,154,815</strong>
                  <span className="text-xs font-semibold text-[#7f8ca4]">ESTIMATED FOLLOWERS</span>
                </div>
                <div>
                  <strong className="block text-2xl font-bold text-[#273348]">2,650</strong>
                  <span className="text-xs font-semibold text-[#7f8ca4] block">
                    / 1<br />
                    INFLUENCER BUDGET
                    <br />
                    <b className="text-[#273348] mt-1 block">TOTAL BUDGET 1</b>
                  </span>
                </div>
              </div>
            </section>
            <section className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h2 className="m-0 text-xl font-bold text-[#273348]">TOTAL REQUEST</h2>
                <div className="flex flex-wrap items-center gap-3">
                  <button className="primary shadow-sm hover:shadow-md transition-shadow">
                    ⇧ &nbsp; Import Influencer
                  </button>
                  <button className="px-4 py-2 bg-white border border-[#dce4ee] rounded-md text-sm font-semibold text-[#273348] hover:bg-gray-50">
                    Auto Ignore
                  </button>
                  <button className="px-4 py-2 bg-white border border-[#dce4ee] rounded-md text-sm font-semibold text-[#273348] hover:bg-gray-50">
                    Add Request
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { count: '0', label: 'TOTAL\nACCOUNT' },
                  { count: '0', label: 'TOTAL ESTIMATED\nREACH' },
                  { count: '0', label: 'TOTAL ESTIMATED\nFOLLOWER' },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 bg-white border border-[#dce4ee] rounded-xl flex items-center gap-4"
                  >
                    <strong className="text-4xl font-bold text-[#273348]">{stat.count}</strong>
                    <span className="text-sm font-semibold text-[#7f8ca4] whitespace-pre-line leading-tight">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
              <label className="flex items-center gap-2 p-3 bg-white border border-[#dce4ee] rounded-lg focus-within:border-[#6545ff] focus-within:ring-2 focus-within:ring-[#6545ff]/20 transition-all">
                <input
                  className="flex-1 border-none outline-none text-[#273348] placeholder-[#7f8ca4] text-sm"
                  placeholder="Search by Username"
                />
                <MagnifyingGlass className="text-[#7f8ca4]" size={20} />
              </label>
            </section>
          </div>
        )}
      </main>
    </div>
  );
}
