import { useNavigate } from 'react-router-dom';
import { Folder, Megaphone, UserFocus, Compass } from '@phosphor-icons/react';
import { getCurrentUser } from '../../lib/currentUser.js';
import { Logo } from './Logo.jsx';
export function Sidebar({ onList }) {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const path = window.location.pathname;
  return (
    <aside className="sidebar">
      <Logo />
      <nav className="side-nav">
        <div className="nav-label">Business Website</div>
        <button
          className={path === '/' || path.startsWith('/projects') ? 'active' : ''}
          onClick={() => navigate('/')}
        >
          <Folder
            size={19}
            weight={path === '/' || path.startsWith('/projects') ? 'fill' : 'regular'}
          />{' '}
          Projects
        </button>
        <div className="nav-section">
          <div className="nav-label">KOL discovery &gt; Find Influencers</div>
          <button className={path.startsWith('/discovery') ? 'active' : ''} onClick={() => {}}>
            <UserFocus size={19} weight={path.startsWith('/discovery') ? 'fill' : 'regular'} />{' '}
            Discovery
          </button>
          <button
            className={path.startsWith('/briefs') ? 'active' : ''}
            onClick={() => navigate('/briefs')}
          >
            <Megaphone size={19} weight={path.startsWith('/briefs') ? 'fill' : 'regular'} />{' '}
            ประกาศหานักรีวิว
          </button>
          <button className={path.startsWith('/explore') ? 'active' : ''} onClick={() => {}}>
            <Compass size={19} weight={path.startsWith('/explore') ? 'fill' : 'regular'} /> Explore
          </button>
        </div>
      </nav>
      <div className="account">
        <span>{currentUser.email[0].toUpperCase()}</span>
        <div>
          <strong>{currentUser.email}</strong>
          <small>{currentUser.role}</small>
        </div>
      </div>
    </aside>
  );
}
