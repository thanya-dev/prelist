import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowSquareOut,
  CalendarBlank,
  CaretRight,
  ChartLineUp,
  Check,
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
import { BrandMark } from '../../components/shared/BrandMark.jsx';
import { Sidebar } from '../../components/layout/Sidebar.jsx';
import { PROJECT_STATUS_FLOW } from './projectStatuses.js';
export function ProjectDetails({ project, onBack, onEdit, onStatusChange }) {
  const navigate = useNavigate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [tab, setTab] = useState('Project details');
  const [prelistFilter, setPrelistFilter] = useState('All');
  const isLightProject = project.status === 'Draft';
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
          Management <CaretRight /> Projects <CaretRight /> <b>{project.name}</b>
        </div>
        <div className="detail-heading">
          <button className="back-inline" onClick={onBack}>
            <ArrowLeft /> กลับ
          </button>
          <div className="detail-heading-actions">
            <button className="secondary-button" onClick={() => onEdit(project)}>
              <NotePencil /> แก้ไข
            </button>
            {isLightProject && (
              <button className="primary" onClick={() => setShowUpgrade(true)}>
                เปลี่ยนเป็น On Going <ArrowSquareOut />
              </button>
            )}
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
            <div className="detail-grid">
              <section className="detail-card">
                <h2>Creator Requirement</h2>
                <dl>
                  <div>
                    <dt>Platform</dt>
                    <dd>{project.platforms?.join(', ') || '—'}</dd>
                  </div>
                  <div>
                    <dt>Content Type</dt>
                    <dd>{project.contentTypes?.join(', ') || '—'}</dd>
                  </div>
                  <div>
                    <dt>Target Influencer</dt>
                    <dd>{project.target || '—'} คน</dd>
                  </div>
                </dl>
              </section>
              <section className="detail-card">
                <h2>Job Information</h2>
                <dl>
                  <div>
                    <dt>Short Brief</dt>
                    <dd>{project.brief || 'ยังไม่มีข้อมูล'}</dd>
                  </div>
                  <div>
                    <dt>Application Deadline</dt>
                    <dd>{project.deadline || 'ไม่ระบุ'}</dd>
                  </div>
                </dl>
              </section>
              <section className="detail-card">
                <h2>Compensation</h2>
                <dl>
                  <div>
                    <dt>Type</dt>
                    <dd>{project.compensation || 'ยังไม่ระบุ'}</dd>
                  </div>
                  <div>
                    <dt>Budget</dt>
                    <dd>
                      {project.budgetMin || project.budgetMax
                        ? `${project.budgetMin || 0} - ${project.budgetMax || 0} THB`
                        : 'ไม่ระบุ'}
                    </dd>
                  </div>
                </dl>
              </section>
              <section className="detail-card">
                <h2>Lifecycle</h2>
                <div className="mini-stepper">
                  {PROJECT_STATUS_FLOW.map((item) => (
                    <div
                      key={item}
                      className={
                        PROJECT_STATUS_FLOW.indexOf(item) <=
                        PROJECT_STATUS_FLOW.indexOf(project.status)
                          ? 'done'
                          : ''
                      }
                    >
                      <span>
                        {PROJECT_STATUS_FLOW.indexOf(item) <
                        PROJECT_STATUS_FLOW.indexOf(project.status) ? (
                          <Check />
                        ) : (
                          PROJECT_STATUS_FLOW.indexOf(item) + 1
                        )}
                      </span>
                      <b>{item}</b>
                    </div>
                  ))}
                </div>
              </section>
            </div>
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
        {showUpgrade && (
          <div className="modal-backdrop">
            <div className="upgrade-modal">
              <WarningCircle size={38} weight="fill" />
              <h2>ต้องกรอก Project Setup ก่อน</h2>
              <p>
                การเปลี่ยนสถานะเป็น On Going หมายถึง Project เริ่มดำเนินงานแล้ว กรุณากรอก Project
                ID, Quotation, Assign PM, Target Post และ Budget ให้ครบ
              </p>
              <div>
                <button className="secondary-button" onClick={() => setShowUpgrade(false)}>
                  ไว้ภายหลัง
                </button>
                <button
                  className="primary"
                  onClick={() => {
                    setShowUpgrade(false);
                    onEdit({
                      ...project,
                      status: 'On Going',
                    });
                  }}
                >
                  กรอกข้อมูลเพิ่มเติม
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
