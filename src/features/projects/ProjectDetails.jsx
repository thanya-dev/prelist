import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  CheckCircle,
  CurrencyDollar,
  FileText,
  Gauge,
  Megaphone,
  NotePencil,
  Plus,
  Storefront,
  User,
  WarningCircle,
} from '@phosphor-icons/react';
import { ProjectInformation } from './ProjectInformation.jsx';
import { BrandMark } from '../../components/shared/BrandMark.jsx';
import { Sidebar } from '../../components/layout/Sidebar.jsx';
export function ProjectDetails({ project, onBack, onEdit }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState('Project details');
  const [prelistFilter, setPrelistFilter] = useState('All');
  const isLightProject = ['Draft', 'Prelist'].includes(project.status);
  const handleTabClick = (label) => {
    if (label === 'Expense report') {
      window.open('https://manage.buddyreview.co/project/uGvkPwRGps', '_blank');
    } else if (label === 'Report') {
      window.open('https://business.buddyreview.co/app/report/uGvkPwRGps?tab=report', '_blank');
    } else if (label === 'Campaign Dashboard') {
      window.open(
        'https://dashboard.buddyreview.co/dashboard/projects/uGvkPwRGps/campaign/IlQZqO7Khx?pw=39p9vk',
        '_blank',
      );
    } else {
      setTab(label);
    }
  };
  return (
    <div className="app-shell">
      <Sidebar onList={onBack} />
      <main className="list-main lifecycle-detail">
        <div className="breadcrumbs">
          Management <CaretRight />{' '}
          <Link to="/projects" className="hover:text-[#5135ff] hover:underline transition-colors">
            Projects
          </Link>{' '}
          <CaretRight /> <b>{project.name}</b>
        </div>
        <div className="detail-heading">
          <button className="back-inline" onClick={onBack}>
            <ArrowLeft /> กลับ
          </button>
          <div className="detail-heading-actions">
            <button className="secondary-button" onClick={() => onEdit(project)}>
              <NotePencil /> แก้ไข
            </button>
          </div>
        </div>
        <section className="project-summary">
          <BrandMark project={project} large />
          <div>
            <div className="project-title-row">
              <h1>{project.name}</h1>
              <span
                className={`lifecycle-status ${project.status.toLowerCase().replaceAll(' ', '-')}`}
              >
                {project.status}
              </span>
            </div>
            <p>
              <Storefront /> {project.brand} &nbsp;•&nbsp; <User /> {project.owner}
            </p>
            <span className="id-pill">{project.id}</span>
          </div>
        </section>
        <div className="detail-tabs">
          {[
            {
              label: 'Project details',
              icon: FileText,
            },
            {
              label: 'Campaign List',
              icon: Megaphone,
            },
            {
              label: 'Report',
              icon: ChartLineUp,
            },
            {
              label: 'Expense report',
              icon: CurrencyDollar,
            },
            {
              label: 'Campaign Dashboard',
              icon: Gauge,
            },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={tab === label ? 'active' : ''}
              onClick={() => handleTabClick(label)}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>
        {tab === 'Project details' && (
          <>
            <div className="not-project-banner">
              {isLightProject ? (
                <>
                  <WarningCircle weight="fill" />
                  <div>
                    <b>{'Project นี้ยังเป็นฉบับร่าง'}</b>
                    <span>
                      ยังไม่ถือเป็น Project ที่เริ่มดำเนินงาน จนกว่าจะเปลี่ยนสถานะเป็น On Going
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <CheckCircle weight="fill" />
                  <div>
                    <b>
                      {project.status === 'Complete'
                        ? 'Project เสร็จสิ้นแล้ว'
                        : 'Project กำลังดำเนินงาน'}
                    </b>
                    <span>ข้อมูล Project Setup ถูกเปิดใช้งานแล้ว</span>
                  </div>
                </>
              )}
            </div>
            <ProjectInformation project={project} />
          </>
        )}
        {tab === 'Campaign List' && (
          <div
            style={{
              marginTop: '24px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px',
              }}
            >
              <h2>Campaign List</h2>
              <button
                className="primary"
                onClick={() =>
                  window.open(
                    'https://manage.buddyreview.co/campaign/create?projectId=uGvkPwRGps',
                    '_blank',
                  )
                }
              >
                <Plus size={16} weight="bold" /> Create Campaign
              </button>
            </div>
            <input
              type="text"
              placeholder="ค้นหาด้วยชื่อกลุ่มหรือแคมเปญ"
              style={{
                width: '100%',
                padding: '14px 18px',
                borderRadius: '6px',
                border: '1px solid #dfe5ed',
                marginBottom: '20px',
                fontSize: '15px',
                outline: 'none',
                color: '#4a5568',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
              }}
            />
            <div
              onClick={() => navigate('/campaigns/page-promotion-facebook')}
              style={{
                cursor: 'pointer',
                border: '1px solid #dfe5ed',
                borderRadius: '8px',
                padding: '18px',
                background: 'white',
                marginBottom: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '12px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '18px',
                    color: '#1a202c',
                    fontWeight: '600',
                  }}
                >
                  Page Promotion Sale Here:
                </h3>
                <span
                  style={{
                    background: '#c6f6d5',
                    color: '#22543d',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: '#38a169',
                    }}
                  ></span>
                  ACTIVE
                </span>
              </div>
              <p
                style={{
                  margin: '0 0 16px',
                  color: '#4a5568',
                  fontSize: '15px',
                }}
              >
                Facebook Page
              </p>
              <div
                style={{
                  display: 'flex',
                  gap: '20px',
                  color: '#8793a5',
                  fontSize: '14px',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CalendarBlank size={16} /> 28/9/69
                </span>
                <span
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <User size={16} /> nattaya@buddyreview.co
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
