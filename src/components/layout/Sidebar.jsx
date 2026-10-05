import { useNavigate } from 'react-router-dom';
import { Folder, Megaphone } from '@phosphor-icons/react';
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
        <button
          className={path.startsWith('/briefs') ? 'active' : ''}
          onClick={() => navigate('/briefs')}
        >
          <Megaphone size={19} weight={path.startsWith('/briefs') ? 'fill' : 'regular'} />{' '}
          ประกาศหานักรีวิว
        </button>
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
