import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CaretDown, Copy, MagnifyingGlass, Plus } from '@phosphor-icons/react';
import { SEED_PROJECTS } from '../features/projects/projectSeeds.js';
import { BrandMark } from '../components/shared/BrandMark.jsx';
import { Logo } from '../components/layout/Logo.jsx';
import { InfluencerList } from '../features/campaigns/InfluencerList.jsx';
export function CampaignDetailPage({ onBack }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState('INFLUENCER LIST');
  const stages = [
    ['31', 'INFLUENCER LIST'],
    ['0', 'CONTENT IDEA'],
    ['0', 'DRAFTING'],
    ['0', 'POSTS'],
  ];
  return (
    <div className="campaign-page">
      <header className="campaign-top">
        <Logo />
        <nav>
          <button>Campaigns</button>
          <button>Discover</button>
          <button>Briefs</button>
          <button onClick={() => navigate('/')}>Projects</button>
          <button>User Search</button>
          <button>External Profiles</button>
          <button>OTP History</button>
          <button>Management</button>
        </nav>
        <span>Hi, thanya@buddyreview.co</span>
      </header>
      <div className="campaign-switcher">
        <button onClick={onBack}>Project</button>
        <button>
          Page Promotion Sale Here : Facebook Page <CaretDown />
        </button>
        <button className="campaign-create">
          <Plus /> Create new campaign
        </button>
      </div>
      <section className="campaign-hero">
        <div className="campaign-identity">
          <BrandMark project={SEED_PROJECTS[0]} large />
          <div>
            <h1>Page Promotion Sale Here</h1>
            <b>Facebook Page</b>
          </div>
        </div>
        <div className="campaign-live">
          <span></span>
          <b>ON GOING</b>
          <small>28 SEP - 30 OCT</small>
        </div>
        <div className="campaign-tools">
          <button>EDIT</button>
          <button>RESET ALL SELECTION</button>
          <button className="danger">HARD RESET</button>
          <button>PASSWORD ◉ &nbsp;••••••</button>
          <button>
            <Copy />
          </button>
        </div>
        <div className="campaign-tabs">
          {[
            'Campaign Task',
            'Approve Content',
            'Report',
            'Contract Report',
            'External Payment',
          ].map((item, index) => (
            <button className={index === 0 ? 'active' : ''} key={item}>
              {item}
            </button>
          ))}
        </div>
      </section>
      <main className="campaign-content">
        <div className="campaign-stages">
          {stages.map(([count, label], index) => (
            <button
              className={stage === label ? 'active' : ''}
              onClick={() => setStage(label)}
              key={label}
            >
              <b>{label === 'INFLUENCER LIST' ? '31' : count}</b> {label}
            </button>
          ))}
        </div>
        <div className="campaign-secondary-stages">
          {[
            ['0', 'ADMIN IGNORED'],
            ['0', 'BRAND IGNORED'],
            ['1', 'CANCELED'],
            ['0', 'RESERVED'],
          ].map(([count, label]) => (
            <button key={label}>
              <b>{count}</b> {label}
            </button>
          ))}
        </div>
        {stage === 'INFLUENCER LIST' ? (
          <InfluencerList />
        ) : (
          <>
            <section className="requirement-card">
              <h2>REQUIREMENT</h2>
              <p>
                (Estimated result number from selected account to participate this campaign which
                included waiting for brand approve, final approve, approved stage)
              </p>
              <div className="requirement-metrics">
                <div>
                  <strong>3</strong>
                  <span>POSTS</span>
                </div>
                <div>
                  <b>TOP LIFESTYLE</b>
                  <small>SUBTAG</small>
                  <p>promotion &nbsp;&nbsp; 100%</p>
                </div>
                <div className="mini-bars">
                  <i></i>
                  <i></i>
                  <i></i>
                  <small>NEW&nbsp; 100%</small>
                </div>
                <div>
                  <strong>22,825</strong>
                  <span>
                    / 1<br />
                    ESTIMATED REACH
                  </span>
                  <strong>10,154,815</strong>
                  <span>ESTIMATED FOLLOWERS</span>
                </div>
                <div>
                  <strong>2,650</strong>
                  <span>
                    / 1<br />
                    INFLUENCER BUDGET
                    <br />
                    <b>TOTAL BUDGET 1</b>
                  </span>
                </div>
              </div>
            </section>
            <section className="total-request">
              <div className="total-request-head">
                <h2>TOTAL REQUEST</h2>
                <div>
                  <button className="primary">⇧ &nbsp; Import Influencer</button>
                  <button>Auto Ignore</button>
                  <button>Add Request</button>
                </div>
              </div>
              <div className="request-totals">
                <div>
                  <strong>0</strong>
                  <span>
                    TOTAL
                    <br />
                    ACCOUNT
                  </span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>
                    TOTAL ESTIMATED
                    <br />
                    REACH
                  </span>
                </div>
                <div>
                  <strong>0</strong>
                  <span>
                    TOTAL ESTIMATED
                    <br />
                    FOLLOWER
                  </span>
                </div>
              </div>
              <label className="campaign-search">
                <input placeholder="Search by Username" />
                <MagnifyingGlass />
              </label>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
