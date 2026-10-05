import { AppRoutes } from './AppRoutes.jsx';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from '@phosphor-icons/react';
import { useProjects } from '../features/projects/useProjects.js';
import { PRELIST_REVIEWERS } from '../features/projects/prelistSeeds.js';
import { BroadcastModal } from '../features/projects/BroadcastModal.jsx';
export function App() {
  const { projects, saveProject } = useProjects();
  const [notice, setNotice] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const navigate = useNavigate();
  const exportPrelist = () => {
    const headers = [
      'Username',
      'Platform',
      'Followers',
      'Likes',
      'Age',
      'Gender',
      'Engagement Level',
      'Reviewed',
      'Estimated Reach',
      'Shipping Province',
      'Status',
    ];
    const rows = PRELIST_REVIEWERS.map((item) => [
      item.username,
      item.platform,
      item.followers,
      item.likes,
      item.age,
      item.gender,
      item.engageLv,
      item.reviewed,
      item.estReach,
      item.province,
      item.status,
    ]);
    const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
    const csv = `\uFEFF${[headers, ...rows].map((row) => row.map(escapeCell).join(',')).join('\r\n')}`;
    const url = URL.createObjectURL(
      new Blob([csv], {
        type: 'text/csv;charset=utf-8',
      }),
    );
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prelist-influencers.csv';
    link.click();
    URL.revokeObjectURL(url);
    setNotice('Export รายชื่อสำหรับ Excel เรียบร้อยแล้ว');
    window.setTimeout(() => setNotice(''), 2500);
  };
  const handleGlobalAction = (event) => {
    const button = event.target.closest('button');
    if (button?.textContent.trim() === 'Filter') {
      exportPrelist();
      return;
    }
    if (button?.textContent.includes('Broadcast งาน')) {
      const projectId = window.location.pathname.split('/')[2];
      const project = projects.find((item) => item.id === projectId) || projects[0];
      setBroadcastMessage(
        `📢 งานใหม่จาก Buddy Review\n\nโปรเจค: ${project.name}\n\nแคมเปญที่เปิดรับ:\n-\n\nสนใจรับงาน ตอบกลับข้อความนี้ได้เลย`,
      );
      setIsBroadcastOpen(true);
      return;
    }
    let campaignCard = event.target;
    while (campaignCard && campaignCard !== event.currentTarget) {
      const title = campaignCard.querySelector?.(':scope > div > h3');
      if (title?.textContent.includes('Page Promotion Sale Here')) {
        navigate('/campaigns/page-promotion-facebook');
        window.scrollTo(0, 0);
        return;
      }
      campaignCard = campaignCard.parentElement;
    }
  };
  const handleOpenProject = (project) => {
    navigate(`/projects/${project.id}`);
    window.scrollTo(0, 0);
  };
  const handleOpenProjectForm = (project = null) => {
    if (project) {
      navigate(`/projects/${project.id}/edit`);
    } else {
      navigate('/projects/create');
    }
    window.scrollTo(0, 0);
  };
  const handleSave = (project, isEditing) => {
    saveProject(project, isEditing);
    setNotice(isEditing ? 'แก้ไขโปรเจกต์เรียบร้อย' : 'สร้างโปรเจกต์เรียบร้อย');
    navigate(`/projects/${project.id}`);
    window.scrollTo(0, 0);
    window.setTimeout(() => setNotice(''), 2500);
  };
  return (
    <>
      <div onClickCapture={handleGlobalAction}>
        <AppRoutes
          projects={projects}
          navigate={navigate}
          onOpenProject={handleOpenProject}
          onEditProject={handleOpenProjectForm}
          onSaveProject={handleSave}
        />
      </div>
      {notice && (
        <div className="toast">
          <Check size={18} weight="bold" />
          {notice}
        </div>
      )}
      {isBroadcastOpen && (
        <BroadcastModal
          message={broadcastMessage}
          onMessageChange={setBroadcastMessage}
          onClose={() => setIsBroadcastOpen(false)}
          onConfirm={() => {
            setIsBroadcastOpen(false);
            setNotice('Broadcast งานเรียบร้อยแล้ว');
            window.setTimeout(() => setNotice(''), 2500);
          }}
        />
      )}
    </>
  );
}
