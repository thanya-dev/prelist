import { toggleArrayValue } from '../../utils/array.js';
import { downloadCsv } from '../../utils/csv.js';
import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { JobPostingFormModal } from './JobPostingFormModal.jsx';
import { useReviewerDecisions } from './useReviewerDecisions.js';
import { useState, useEffect } from 'react';
import { useCopy } from '../../hooks/useCopy.js';
import { useNavigate, useParams, useSearchParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CaretRight,
  Check,
  CheckCircle,
  Copy,
  FileText,
  List,
  SquaresFour,
  Eye,
  User,
  Users,
  X,
  Heart,
  Cake,
  GenderMale,
  GenderFemale,
} from '@phosphor-icons/react';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { getJobPostings } from './jobPostingApi.js';
import { JobPostingSummary } from '../../components/shared/JobPostingSummary.jsx';
import { JobPostingInformation } from '../../components/shared/JobPostingInformation.jsx';
import { Sidebar } from '../../components/layout/Sidebar.jsx';
import { PRELIST_REVIEWERS } from '../projects/prelistSeeds.js';
export function JobPostingDetail() {
  const formatNumber = (val) => {
    if (val == null || val === '—') return val;
    const num = Number(String(val).replace(/,/g, ''));
    return isNaN(num) ? val : num.toLocaleString('en-US');
  };
  const { id } = useParams();
  const [params, setParams] = useSearchParams();
  const { copiedId, copy } = useCopy();
  const [isEditOpen, setIsEditOpen] = useState(params.get('edit') === '1');
  const [isCopyOpen, setIsCopyOpen] = useState(false);
  const handleCloseEdit = () => {
    setIsEditOpen(false);
    if (params.has('edit')) {
      const next = new URLSearchParams(params);
      next.delete('edit');
      setParams(next, { replace: true });
    }
  };
  const job = getJobPostings().find((j) => j.id === id) || SEED_JOB_POSTINGS[0];
  const [mainTab, setMainTab] = useState('ข้อมูลประกาศ');
  const [activeTab, setActiveTab] = useState('สมัคร');
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();
  const { setDecisions, decide, decisionFor } = useReviewerDecisions(job.id);
  const matchesTab = (item, tab) => {
    const status = decisionFor(item)?.status;
    if (tab === 'สมัคร') return !status || status === 'pending';
    if (tab === 'Reject') return status === 'Reject';
    if (tab === 'ทีมงานเลือกแล้ว') return status === 'TeamAccept';
    if (tab === 'ลูกค้าเลือกแล้ว') return status === 'Accept';
    return false;
  };
  const reviewers = [
    ...(SEED_JOB_POSTINGS.some((posting) => posting.id === job.id) ? PRELIST_REVIEWERS : []).map(
      (item, sourceIndex) => ({
        ...item,
        sourceIndex,
      }),
    ),
  ];
  const visibleReviewers = reviewers.filter((item) => matchesTab(item, activeTab));

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 24;

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const totalPages = Math.ceil(visibleReviewers.length / pageSize);
  const paginatedReviewers = visibleReviewers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const customerSelected = (item) => decisionFor(item)?.status === 'Accept';
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);
  const canDecide = (item) => !decisionFor(item) || decisionFor(item)?.status === 'TeamAccept';
  const canSelect = canDecide;
  const eligibleVisibleReviewers = paginatedReviewers.filter(canSelect);
  const eligibleSelectedIds = selectedReviewerIds.filter((id) =>
    reviewers.some((item) => item.id === id && canSelect(item)),
  );
  const [bulkNotice, setBulkNotice] = useState('');
  const toggleReviewer = (reviewerId) => {
    if (!reviewers.some((item) => item.id === reviewerId && canSelect(item))) return;
    setSelectedReviewerIds((current) => toggleArrayValue(current, reviewerId));
  };
  const exportSelectedCsv = () => {
    const selectedItems = reviewers.filter((item) => eligibleSelectedIds.includes(item.id));
    if (!selectedItems.length) return;

    const headers = ['Username', 'Platform', 'Followers', 'Est. Reach'];
    const rows = selectedItems.map((item) => [
      item.username,
      item.platform,
      item.followers,
      item.estReach,
    ]);

    downloadCsv(`reviewers-${job.id}.csv`, headers, rows);
    setSelectedReviewerIds([]);
    setBulkNotice(`Export ${selectedItems.length} คนเป็น CSV เรียบร้อย`);
  };
  const allVisibleSelected =
    eligibleVisibleReviewers.length > 0 &&
    eligibleVisibleReviewers.every((item) => selectedReviewerIds.includes(item.id));
  const toggleVisibleReviewers = () =>
    setSelectedReviewerIds((current) =>
      allVisibleSelected
        ? current.filter((value) => !eligibleVisibleReviewers.some((item) => item.id === value))
        : [...new Set([...current, ...eligibleVisibleReviewers.map((item) => item.id)])],
    );
  const [confirmDecision, setConfirmDecision] = useState(null);
  const executeBulkDecision = (decisionStatus) => {
    const chosenIds = selectedReviewerIds.filter((id) =>
      reviewers.some((item) => item.id === id && canDecide(item)),
    );
    if (!chosenIds.length) return;
    const decisions = {
      ...JSON.parse(localStorage.getItem('buddy-reviewer-decisions') || '{}'),
    };
    chosenIds.forEach((id) => {
      const currentStatus = decisions[`${job.id}:${id}`]?.status;
      let nextStatus = decisionStatus;
      if (decisionStatus === 'Accept') {
        nextStatus = !currentStatus || currentStatus === 'pending' ? 'TeamAccept' : 'Accept';
      }
      decisions[`${job.id}:${id}`] = {
        status: nextStatus,
        by: 'thanya@buddyreview.co',
        sentBy: null,
        date: new Date().toISOString(),
      };
    });
    localStorage.setItem('buddy-reviewer-decisions', JSON.stringify(decisions));
    setDecisions(decisions);
    setSelectedReviewerIds([]);
  };

  const decisionActions = (item) => {
    if (decisionFor(item)?.status === 'Reject')
      return (
        <div className="reviewer-footer-status rejected">
          <X weight="bold" /> ถูก Reject
        </div>
      );
    if (customerSelected(item))
      return (
        <div className="reviewer-footer-status selected">
          <CheckCircle weight="fill" /> ลูกค้าเลือกแล้ว
        </div>
      );
    return (
      <div className="reviewer-decision-actions">
        <button
          className="reviewer-reject"
          onClick={() => setConfirmDecision({ type: 'individual', id: item.id, action: 'Reject' })}
        >
          <X /> Reject
        </button>
        <button
          className="reviewer-accept"
          onClick={() => setConfirmDecision({ type: 'individual', id: item.id, action: 'Accept' })}
        >
          <Check /> Accept
        </button>
      </div>
    );
  };
  return (
    <div className="app-shell job-posting-detail">
      {isEditOpen && (
        <JobPostingFormModal
          postingId={job.id}
          onClose={handleCloseEdit}
          onSave={handleCloseEdit}
        />
      )}
      {isCopyOpen && (
        <JobPostingFormModal
          copyFromId={job.id}
          onClose={() => setIsCopyOpen(false)}
          onSave={(saved, isDraft) => {
            setIsCopyOpen(false);
            if (!isDraft) navigate(`/job-postings/${saved.id}`);
          }}
        />
      )}
      <Sidebar />
      <main
        className={`list-main lifecycle-detail ${mainTab === 'รายชื่อนักรีวิว' ? 'has-reviewer-toolbar' : ''}`}
      >
        <div className="breadcrumbs">
          ประกาศหานักรีวิว <CaretRight />{' '}
          <Link to="/briefs" className="hover:text-[#5135ff] hover:underline transition-colors">
            รายการบรีฟ
          </Link>{' '}
          <CaretRight />{' '}
          {job.brief && (
            <>
              <Link
                to={`/briefs/${job.brief}`}
                className="hover:text-[#5135ff] hover:underline transition-colors"
              >
                {job.brief}
              </Link>{' '}
              <CaretRight />{' '}
            </>
          )}
          <b>{job.name}</b>
        </div>
        <div className="detail-heading">
          <button
            className="back-inline"
            onClick={() => navigate(job.brief ? `/briefs/${job.brief}` : '/briefs')}
          >
            <ArrowLeft /> กลับ
          </button>
          <div className="detail-heading-actions">
            <button
              className="secondary-button"
              onClick={() => {
                window.open(
                  'https://www.buddyreview.co/campaign/EMr3CC9K56/preview',
                  '_blank',
                  'noopener,noreferrer',
                );
              }}
            >
              <Eye /> พรีวิวประกาศ
            </button>
            <button
              className="secondary-button border-[#bfdbfe]! bg-[#eff6ff]! text-[#2563eb]!"
              onClick={() => setIsCopyOpen(true)}
            >
              <Copy size={18} /> ทำสำเนาประกาศ
            </button>
            {(() => {
              const isActive =
                job.status !== 'Draft' &&
                job.status !== 'แบบร่าง' &&
                job.announcementStatus !== 'inactive';
              return (
                <div
                  className="relative group inline-block"
                  style={{ cursor: !isActive ? 'not-allowed' : 'pointer' }}
                >
                  <button
                    className="primary"
                    disabled={!isActive}
                    style={{ ...(!isActive ? { opacity: 0.5, pointerEvents: 'none' } : {}) }}
                    onClick={() => {
                      if (isActive) {
                        const shortlink = `https://bdy.link/${job.id.toLowerCase()}`;
                        copy(shortlink, `link-${job.id}`, `คัดลอกลิ้งสมัคร ${shortlink} เรียบร้อย`);
                      }
                    }}
                  >
                    {copiedId === `link-${job.id}` ? <Check /> : <Copy />} คัดลอกลิงก์สมัคร
                  </button>
                  {!isActive && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-slate-800 text-white text-xs rounded py-1.5 px-2.5 z-10 shadow-lg whitespace-nowrap">
                      ต้องเปิดรับสมัครแคมเปญก่อน
                      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        </div>

        <JobPostingSummary
          job={{ ...job, reviewers: reviewers.length }}
          onEdit={() => setIsEditOpen(true)}
        />

        <div className="detail-tabs">
          <button
            className={mainTab === 'ข้อมูลประกาศ' ? 'active' : ''}
            onClick={() => setMainTab('ข้อมูลประกาศ')}
          >
            <FileText size={20} /> ข้อมูลประกาศ
          </button>
          <button
            className={mainTab === 'รายชื่อนักรีวิว' ? 'active' : ''}
            onClick={() => setMainTab('รายชื่อนักรีวิว')}
          >
            <Users size={20} /> รายชื่อนักรีวิว ({reviewers.length})
          </button>
        </div>

        {mainTab === 'ข้อมูลประกาศ' ? (
          <JobPostingInformation job={job} />
        ) : (
          <div
            style={{
              marginTop: '24px',
            }}
          >
            <div
              className="reviewer-list-controls"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
                className="reviewer-status-tabs"
                style={{
                  display: 'flex',
                  gap: '8px',
                  background: '#f1f5f9',
                  padding: '4px',
                  borderRadius: '8px',
                }}
              >
                {['สมัคร', 'ทีมงานเลือกแล้ว', 'ลูกค้าเลือกแล้ว', 'Reject'].map((name) => {
                  const count = reviewers.filter((item) => matchesTab(item, name)).length;
                  return (
                    <button
                      key={name}
                      onClick={() => setActiveTab(name)}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        background: activeTab === name ? 'white' : 'transparent',
                        boxShadow: activeTab === name ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                        color: activeTab === name ? '#1a202c' : '#64748b',
                        fontWeight: activeTab === name ? '600' : '500',
                        cursor: 'pointer',
                      }}
                    >
                      {name} ({count})
                    </button>
                  );
                })}
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '4px',
                    background: '#f1f5f9',
                    padding: '4px',
                    borderRadius: '6px',
                  }}
                >
                  <button
                    aria-label="แสดงรายชื่อนักรีวิวแบบตาราง"
                    onClick={() => setViewMode('list')}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      background: viewMode === 'list' ? 'white' : 'transparent',
                      boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      color: viewMode === 'list' ? '#1a202c' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    <List size={18} weight={viewMode === 'list' ? 'bold' : 'regular'} />
                  </button>
                  <button
                    aria-label="แสดงรายชื่อนักรีวิวแบบการ์ด"
                    onClick={() => setViewMode('card')}
                    style={{
                      padding: '6px',
                      borderRadius: '4px',
                      border: 'none',
                      background: viewMode === 'card' ? 'white' : 'transparent',
                      boxShadow: viewMode === 'card' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
                      color: viewMode === 'card' ? '#1a202c' : '#64748b',
                      cursor: 'pointer',
                    }}
                  >
                    <SquaresFour size={18} weight={viewMode === 'card' ? 'bold' : 'regular'} />
                  </button>
                </div>
              </div>
            </div>

            <div className="reviewer-selection-toolbar">
              <label>
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  disabled={!eligibleVisibleReviewers.length}
                  onChange={toggleVisibleReviewers}
                />{' '}
                เลือกทั้งหมดในแท็บนี้
              </label>
              <span>(เลือก {eligibleSelectedIds.length} คน)</span>
              {eligibleSelectedIds.length > 0 && (
                <button
                  className="secondary-button"
                  onClick={() => {
                    setSelectedReviewerIds([]);
                    setBulkNotice('');
                  }}
                >
                  ล้างการเลือก
                </button>
              )}
              <div
                className="reviewer-selection-actions"
                style={{ flexGrow: 1, display: 'flex', gap: '8px', justifyContent: 'flex-end' }}
              >
                {activeTab === 'ทีมงานเลือกแล้ว' && (
                  <button
                    className="secondary-button"
                    disabled={!eligibleSelectedIds.length}
                    onClick={exportSelectedCsv}
                  >
                    Export CSV ({eligibleSelectedIds.length})
                  </button>
                )}
                <button
                  className="danger"
                  disabled={!eligibleSelectedIds.length}
                  onClick={() => setConfirmDecision({ type: 'bulk', action: 'Reject' })}
                >
                  <X weight="bold" /> Reject ({eligibleSelectedIds.length})
                </button>
                <button
                  className="primary"
                  disabled={!eligibleSelectedIds.length}
                  onClick={() => setConfirmDecision({ type: 'bulk', action: 'Accept' })}
                >
                  <Check weight="bold" /> Accept ({eligibleSelectedIds.length})
                </button>
              </div>
              <span role="status">{bulkNotice}</span>
            </div>
            {!visibleReviewers.length ? (
              <div className="empty-state">
                <Users size={32} />
                <h3>ไม่มีนักรีวิวในสถานะนี้</h3>
              </div>
            ) : viewMode === 'list' ? (
              <div className="reviewer-table-scroll">
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    background: 'white',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                >
                  <thead
                    style={{
                      background: '#f8fafc',
                      borderBottom: '1px solid #e2e8f0',
                      textAlign: 'left',
                    }}
                  >
                    <tr>
                      <th
                        style={{
                          width: '44px',
                          padding: '16px',
                        }}
                      >
                        <input
                          type="checkbox"
                          aria-label="เลือกนักรีวิวทั้งหมดในแท็บนี้"
                          checked={allVisibleSelected}
                          disabled={!eligibleVisibleReviewers.length}
                          onChange={toggleVisibleReviewers}
                        />
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        นักรีวิว
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ข้อมูลผู้ติดตาม
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ข้อมูลเชิงลึก
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ข้อมูลส่วนตัว
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        ผลงาน
                      </th>
                      <th
                        style={{
                          padding: '16px',
                          color: '#64748b',
                          fontWeight: '600',
                          fontSize: '14px',
                        }}
                      >
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedReviewers.map((item) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #e2e8f0',
                        }}
                      >
                        <td
                          style={{
                            padding: '16px',
                          }}
                        >
                          <input
                            type="checkbox"
                            aria-label={`เลือก ${item.username}`}
                            checked={eligibleSelectedIds.includes(item.id)}
                            disabled={!canDecide(item)}
                            onChange={() => toggleReviewer(item.id)}
                          />
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <a
                              href="https://www.facebook.com/buddyreview"
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{
                                position: 'relative',
                                display: 'inline-block',
                                width: '40px',
                                height: '40px',
                              }}
                            >
                              <img
                                src={item.images[0]}
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  objectFit: 'cover',
                                }}
                                alt=""
                              />
                              <div
                                style={{
                                  position: 'absolute',
                                  bottom: '-2px',
                                  right: '-2px',
                                  background: 'white',
                                  borderRadius: '50%',
                                  padding: '2px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                }}
                              >
                                <PlatformLogo platform={item.platform} size={14} />
                              </div>
                            </a>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <a
                                  href="https://www.facebook.com/buddyreview"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="reviewer-username"
                                >
                                  {item.username}
                                </a>
                              </div>
                              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                                สมัครเมื่อ 12/09/2026 14:
                                {(10 + ((item.sourceIndex || 0) % 50)).toString().padStart(2, '0')}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            color: '#414141',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <User weight="fill" size={14} /> {formatNumber(item.followers)}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Heart weight="fill" size={14} /> {formatNumber(item.likes)}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            color: '#414141',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ display: 'flex', gap: '4px' }}>
                              <span style={{ color: '#8793a5' }}>Engage Lv:</span> {item.engageLv}
                            </span>
                            <span style={{ display: 'flex', gap: '4px' }}>
                              <span style={{ color: '#8793a5' }}>Est. Reach:</span>{' '}
                              {formatNumber(item.estReach)}
                            </span>
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '16px',
                            color: '#414141',
                            fontSize: '13px',
                            fontWeight: '600',
                          }}
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {item.gender === 'MALE' ? (
                                <GenderMale weight="bold" size={14} />
                              ) : (
                                <GenderFemale weight="bold" size={14} />
                              )}{' '}
                              {item.gender}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Cake weight="fill" size={14} /> {item.age} ปี
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', gap: '2px' }}>
                              {item.images.slice(0, 3).map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt=""
                                  style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                />
                              ))}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '16px' }}>{decisionActions(item)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))',
                  gap: '24px',
                }}
              >
                {paginatedReviewers.map((item) => (
                  <div
                    key={item.id}
                    className={`job-reviewer-card ${selectedReviewerIds.includes(item.id) ? 'is-selected' : ''}`}
                    style={{
                      background: 'white',
                      borderRadius: '12px',
                      border: '1px solid #dfe5ed',
                      overflow: 'hidden',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                    }}
                  >
                    <div
                      style={{
                        padding: '16px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '12px',
                        }}
                      >
                        <input
                          type="checkbox"
                          aria-label={`เลือก ${item.username}`}
                          checked={eligibleSelectedIds.includes(item.id)}
                          disabled={!canDecide(item)}
                          onChange={() => toggleReviewer(item.id)}
                        />
                        <PlatformLogo platform={item.platform} size={20} />
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '16px',
                          }}
                        >
                          <a
                            href="https://www.facebook.com/buddyreview"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="reviewer-username"
                          >
                            {item.username}
                          </a>
                        </h3>
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: '16px',
                          color: '#414141',
                          fontSize: '13px',
                          fontWeight: '600',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <User weight="fill" size={14} /> {formatNumber(item.followers)}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Heart weight="fill" size={14} /> {formatNumber(item.likes)}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Cake weight="fill" size={14} /> {item.age}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          {item.gender === 'MALE' ? (
                            <GenderMale weight="bold" size={14} />
                          ) : (
                            <GenderFemale weight="bold" size={14} />
                          )}{' '}
                          {item.gender}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr 1fr',
                        gap: '2px',
                      }}
                    >
                      {item.images.slice(0, 3).map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt=""
                          style={{
                            width: '100%',
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                          }}
                        />
                      ))}
                    </div>
                    <div
                      style={{
                        padding: '16px',
                        fontSize: '13px',
                        color: '#414141',
                        lineHeight: '1.7',
                      }}
                    >
                      <div
                        style={{
                          marginBottom: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                          }}
                        >
                          <span
                            style={{
                              color: '#8793a5',
                              width: '110px',
                            }}
                          >
                            ENGAGE LV.
                          </span>
                          <span
                            style={{
                              color:
                                item.engageLv === 'GOOD' || item.engageLv === 'EXCELLENT'
                                  ? '#2bae6b'
                                  : '#f5a623',
                              fontWeight: '700',
                            }}
                          >
                            {item.engageLv}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                          }}
                        >
                          <span
                            style={{
                              color: '#8793a5',
                              width: '110px',
                            }}
                          >
                            Est. REACH :
                          </span>
                          <span
                            style={{
                              fontWeight: '700',
                            }}
                          >
                            {formatNumber(item.estReach)}
                          </span>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            gap: '6px',
                          }}
                        >
                          <span
                            style={{
                              color: '#8793a5',
                              width: '110px',
                            }}
                          >
                            สมัครเมื่อ :
                          </span>
                          <span
                            style={{
                              fontWeight: '500',
                            }}
                          >
                            12/09/2026 14:
                            {(10 + ((item.sourceIndex || 0) % 50)).toString().padStart(2, '0')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="reviewer-card-footer reviewer-card-decision-footer">
                      {decisionActions(item)}
                    </div>
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="pagination" style={{ marginTop: '32px' }}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i + 1}
                    className={currentPage === i + 1 ? 'selected' : ''}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {confirmDecision && (
        <div className="modal-backdrop" onClick={() => setConfirmDecision(null)}>
          <section
            className="posting-save-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-decision-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="broadcast-close"
              onClick={() => setConfirmDecision(null)}
              aria-label="ปิด"
            >
              <X size={22} />
            </button>
            <h2 id="confirm-decision-title" className="posting-save-title">
              ยืนยันการทำรายการ
            </h2>
            <div className="posting-save-preview">
              <p>
                คุณต้องการ <strong>{confirmDecision.action}</strong> นักรีวิว
                {confirmDecision.type === 'bulk'
                  ? ` จำนวน ${eligibleSelectedIds.length} คน`
                  : ` จำนวน 1 คน`}{' '}
                ใช่หรือไม่?
              </p>
            </div>
            <footer className="posting-save-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setConfirmDecision(null)}
              >
                ยกเลิก
              </button>
              <button
                type="button"
                className="primary"
                onClick={() => {
                  if (confirmDecision.type === 'bulk') {
                    executeBulkDecision(confirmDecision.action);
                  } else {
                    decide(confirmDecision.id, confirmDecision.action);
                  }
                  setConfirmDecision(null);
                }}
              >
                ยืนยัน
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}
