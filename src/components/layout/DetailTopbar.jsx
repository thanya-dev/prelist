import { CaretDown, Plus } from '@phosphor-icons/react';
import { Logo } from './Logo.jsx';
export function DetailTopbar({ onBack }) {
  return (
    <>
      <header className="detail-topbar">
        <Logo />
        <nav>
          <button>Campaigns</button>
          <button>Discover</button>
          <button>Briefs</button>
          <button>Projects</button>
          <button>User Search</button>
          <button>External Profiles</button>
          <button>OTP History</button>
          <button>Management</button>
        </nav>
        <div className="hello">
          Hi, <strong>thanya@buddyreview.co</strong>
          <span>T</span>
        </div>
      </header>
      <div className="detail-subbar">
        <button className="outline" onClick={onBack}>
          Project
        </button>
        <button className="select-button">
          Campaign <CaretDown />
        </button>
        <button className="soft-button">
          <Plus weight="bold" /> Create new campaign
        </button>
      </div>
    </>
  );
}
