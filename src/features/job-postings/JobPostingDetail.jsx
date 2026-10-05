import { useReviewerDecisions } from './useReviewerDecisions.js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CaretRight,
  Check,
  CheckCircle,
  Copy,
  CurrencyDollar,
  FileText,
  Eye,
  LinkSimple,
  List,
  NotePencil,
  Plus,
  SquaresFour,
  Storefront,
  User,
  Users,
  UsersThree,
  X,
  InstagramLogo,
  TiktokLogo,
  FacebookLogo,
  Heart,
  Cake,
  GenderMale,
  GenderFemale,
} from '@phosphor-icons/react';
import { SEED_JOB_POSTINGS } from './jobPostingSeeds.js';
import { getJobPostings } from './jobPostingApi.js';
import { JobPostingInformation } from './JobPostingInformation.jsx';
import { BrandMark } from '../../components/shared/BrandMark.jsx';
import { Sidebar } from '../../components/layout/Sidebar.jsx';
import { PRELIST_REVIEWERS } from '../projects/prelistSeeds.js';
export function JobPostingDetail() {
  const { id } = useParams();
  const job = getJobPostings().find((j) => j.id === id) || SEED_JOB_POSTINGS[0];
  const [mainTab, setMainTab] = useState('ข้อมูลประกาศ');
  const [activeTab, setActiveTab] = useState('สมัคร');
  const [viewMode, setViewMode] = useState('list');
  const navigate = useNavigate();
  const { decisions, setDecisions, decide, sendToSales, decisionFor } = useReviewerDecisions(
    job.id,
  );
  const matchesTab = (item, tab) => {
    const status = decisionFor(item)?.status;
    if (tab === 'สมัคร') return true;
    if (tab === 'Reject' || tab === 'Accept') return status === tab;
    if (status === 'Reject') return false;
    if (tab === 'ทีมงานเลือกแล้ว') return !status;
    if (tab === 'ลูกค้าเลือกแล้ว') return status === 'Accept';
    return false;
  };
  const [addedReviewers, setAddedReviewers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(`buddy-reviewers-${job.id}`)) || [];
    } catch {
      return [];
    }
  });
  const [addMode, setAddMode] = useState(null);
  const [newUsername, setNewUsername] = useState('');
  const [newPlatform, setNewPlatform] = useState('instagram');
  const [bulkText, setBulkText] = useState('');
  const [addError, setAddError] = useState('');
  const [uploadName, setUploadName] = useState('');
  const parseBulk = (text) => {
    const lines = text
      .replace(/^\uFEFF/, '')
      .trim()
      .split(/\r?\n/)
      .filter((line) => line.trim());
    if (!lines.length) return [];
    return lines
      .map((line) => line.split(/[\t,]/).map((value) => value.trim().replace(/^"|"$/g, '')))
      .filter((row, index) => !(index === 0 && row[0].toLowerCase() === 'username'))
      .map(([username, platform]) => ({
        username: (username || '').replace(/^@/, ''),
        platform: (platform || '').toLowerCase(),
      }));
  };
  const bulkRows = parseBulk(bulkText);
  const saveReviewers = () => {
    const rows =
      addMode === 'single'
        ? [
            {
              username: newUsername.trim().replace(/^@/, ''),
              platform: newPlatform,
            },
          ]
        : bulkRows;
    if (!rows.length) {
      setAddError('กรุณาเพิ่มข้อมูลนักรีวิวอย่างน้อย 1 คน');
      return;
    }
    const seen = new Set(
      [...PRELIST_REVIEWERS, ...addedReviewers].map(
        (item) => `${item.platform}:${item.username.toLowerCase()}`,
      ),
    );
    for (const [index, row] of rows.entries()) {
      if (
        !/^[a-zA-Z0-9._-]+$/.test(row.username) ||
        !['instagram', 'tiktok', 'facebook'].includes(row.platform)
      ) {
        setAddError(
          `แถว ${index + 1}: ระบุ Username และ Platform (instagram, tiktok, facebook) ให้ถูกต้อง`,
        );
        return;
      }
      const key = `${row.platform}:${row.username.toLowerCase()}`;
      if (seen.has(key)) {
        setAddError(`แถว ${index + 1}: ${row.username} มีอยู่ในรายชื่อแล้วหรือซ้ำในไฟล์`);
        return;
      }
      seen.add(key);
    }
    const next = [
      ...addedReviewers,
      ...rows.map((row, index) => ({
        ...row,
        id: `added-${Date.now()}-${index}`,
        sourceIndex: 1,
        followers: '—',
        likes: '—',
        age: '—',
        gender: '—',
        images: [],
        engageLv: '—',
        reviewed: '—',
        estReach: '—',
        province: '—',
      })),
    ];
    localStorage.setItem(`buddy-reviewers-${job.id}`, JSON.stringify(next));
    setAddedReviewers(next);
    setAddMode(null);
    setActiveTab('สมัคร');
    setNewUsername('');
    setBulkText('');
    setUploadName('');
    setAddError('');
  };
  const reviewers = [
    ...PRELIST_REVIEWERS.map((item, sourceIndex) => ({
      ...item,
      sourceIndex,
    })),
    ...addedReviewers,
  ];
  const visibleReviewers = reviewers.filter((item) => matchesTab(item, activeTab));
  const customerSelected = (item) => decisionFor(item)?.status === 'Accept';
  const [selectedReviewerIds, setSelectedReviewerIds] = useState([]);
  const canDecide = (item) => !decisionFor(item);
  const eligibleVisibleReviewers = visibleReviewers.filter(canDecide);
  const eligibleSelectedIds = selectedReviewerIds.filter((id) =>
    reviewers.some((item) => item.id === id && canDecide(item)),
  );
  const [bulkNotice, setBulkNotice] = useState('');
  const toggleReviewer = (reviewerId) => {
    if (!reviewers.some((item) => item.id === reviewerId && canDecide(item))) return;
    setSelectedReviewerIds((current) =>
      current.includes(reviewerId)
        ? current.filter((value) => value !== reviewerId)
        : [...current, reviewerId],
    );
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
  const bulkMakeDecision = (decisionStatus) => {
    const chosenIds = selectedReviewerIds.filter((id) =>
      reviewers.some((item) => item.id === id && canDecide(item)),
    );
    if (!chosenIds.length) return;
    const decisions = {
      ...JSON.parse(localStorage.getItem('buddy-reviewer-decisions') || '{}'),
    };
    chosenIds.forEach((id) => {
      decisions[`${job.id}:${id}`] = {
        status: decisionStatus,
        by: 'thanya@buddyreview.co',
        sentBy: null,
        date: new Date().toISOString(),
      };
    });
    localStorage.setItem('buddy-reviewer-decisions', JSON.stringify(decisions));
    setReviewerDecisions(decisions);
    setSelectedReviewerIds([]);
    setBulkNotice(`${decisionStatus} ${chosenIds.length} คนเรียบร้อยแล้ว`);
  };
  const decisionLabel = (item) => {
    const decision = decisionFor(item);
    return (
      <div className={`reviewer-decision ${decision?.status.toLowerCase() || 'pending'}`}>
        {decision ? (
          <>
            <strong>{decision.status}</strong>
            <small>
              {decision.status} โดย {decision.by}
            </small>
            {decision.sentBy && <small>ส่ง Sale แล้ว โดย {decision.sentBy}</small>}
          </>
        ) : (
          <span>รอ Accept / Reject</span>
        )}
      </div>
    );
  };
  const [profile, setProfile] = useState(null);
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
    if (decisionFor(item)) return null;
    return (
      <div className="reviewer-decision-actions">
        <button className="reviewer-reject" onClick={() => decide(item.id, 'Reject')}>
          <X /> Reject
        </button>
        <button className="reviewer-accept" onClick={() => decide(item.id, 'Accept')}>
          <Check /> Accept
        </button>
      </div>
    );
  };
  return (
    <div className="app-shell job-posting-detail">
      <Sidebar />
      <main
        className={`list-main lifecycle-detail ${mainTab === 'รายชื่อนักรีวิว' ? 'has-reviewer-toolbar' : ''}`}
      >
        <div className="breadcrumbs">
          ประกาศหานักรีวิว <CaretRight /> <b>{job.name}</b>
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
              onClick={() => alert('เปิดหน้าประกาศ (Public Link)')}
            >
              <Storefront /> ดูหน้าประกาศ
            </button>
            <button
              className="primary"
              onClick={() => {
                const shortlink = `https://bdy.link/${job.id.toLowerCase()}`;
                navigator.clipboard.writeText(shortlink);
                alert(`คัดลอก Shortlink สมัครงานแล้ว: ${shortlink}`);
              }}
            >
              <Copy /> คัดลอกลิงก์สมัคร
            </button>
          </div>
        </div>

        <article className="project-card posting-summary gap-6 p-6 mb-6 max-[760px]:gap-4 max-[760px]:p-3">
          <div className="thumb-wrap">
            <BrandMark project={job} />
            <button
              className="edit-chip"
              aria-label="แก้ไขประกาศ"
              onClick={() => navigate(`/job-postings/${job.id}/edit`)}
            >
              <NotePencil size={15} /> แก้ไข
            </button>
          </div>
          <div className="project-info">
            <div className="project-title-row">
              <h1 className="posting-summary-title">{job.name}</h1>
              <span className="id-pill">Brief: {job.brief}</span>
            </div>
            <div className="owner">
              <Users size={16} /> ผู้สมัคร: {(job.applicants || 0).toLocaleString('th-TH')} คน
              &nbsp;&nbsp;•&nbsp;&nbsp; นักรีวิว: {job.reviewers} คน
            </div>
            <div className="owner mt-2" aria-label="จำนวนผู้เข้าชมประกาศ">
              <Eye size={16} /> เปิดดูประกาศ:{' '}
              {job.viewerCount == null ? '0 คน' : `${job.viewerCount.toLocaleString('th-TH')} คน`}
            </div>
            <small>{job.subtitle || 'ยังไม่ระบุ Campaign Subtitle'}</small>
            <div className="prelist-meta">
              <span>{job.brand}</span>
            </div>
          </div>
        </article>

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
            <Users size={20} /> รายชื่อนักรีวิว ({job.reviewers})
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
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              <div
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
                <button
                  className="primary"
                  onClick={() => {
                    setAddMode('single');
                    setAddError('');
                  }}
                >
                  <Plus size={16} weight="bold" /> เพิ่มนักรีวิว
                </button>
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
              <span>เลือก {eligibleSelectedIds.length} คน</span>
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
                style={{
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <button
                  className="danger"
                  disabled={!eligibleSelectedIds.length}
                  onClick={() => bulkMakeDecision('Reject')}
                >
                  <X weight="bold" /> Reject ({eligibleSelectedIds.length})
                </button>
                <button
                  className="primary"
                  disabled={!eligibleSelectedIds.length}
                  onClick={() => bulkMakeDecision('Accept')}
                >
                  <Check weight="bold" /> Accept ({eligibleSelectedIds.length})
                </button>
              </div>
              <span role="status">{bulkNotice}</span>
            </div>
            {!visibleReviewers.length && (
              <div className="empty-state">
                <Users size={32} />
                <h3>ไม่มีนักรีวิวในสถานะนี้</h3>
              </div>
            )}
            {viewMode === 'list' ? (
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
                      โปรไฟล์นักรีวิว
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        color: '#64748b',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      ที่มา
                    </th>
                    <th
                      style={{
                        padding: '16px',
                        color: '#64748b',
                        fontWeight: '600',
                        fontSize: '14px',
                      }}
                    >
                      ผลเลือกลูกค้า
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
                  {visibleReviewers.map((item) => (
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
                      <td
                        style={{
                          padding: '16px',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
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
                          <div>
                            <button className="reviewer-username" onClick={() => setProfile(item)}>
                              {item.username}
                            </button>
                            {decisionLabel(item)}
                            <div
                              style={{
                                display: 'flex',
                                gap: '8px',
                                marginTop: '4px',
                              }}
                            >
                              {item.platform === 'instagram' && <InstagramLogo color="#E1306C" />}
                              {item.platform === 'tiktok' && <TiktokLogo />}
                              {item.platform === 'facebook' && <FacebookLogo color="#1877F2" />}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                        }}
                      >
                        <span
                          style={{
                            background: item.sourceIndex % 2 === 0 ? '#e0e7ff' : '#f1f5f9',
                            color: item.sourceIndex % 2 === 0 ? '#3730a3' : '#475569',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {item.sourceIndex % 2 === 0 ? 'สมัครเอง' : 'เพิ่มโดยทีมงาน'}
                        </span>
                      </td>
                      <td
                        style={{
                          padding: '16px',
                        }}
                      >
                        {decisionFor(item)?.status === 'Reject' ? (
                          <span
                            style={{
                              color: '#dc2626',
                              fontWeight: '600',
                            }}
                          >
                            Reject — ไม่ส่ง Sale
                          </span>
                        ) : customerSelected(item) ? (
                          <span
                            style={{
                              color: '#16a34a',
                              fontWeight: '600',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            <CheckCircle weight="fill" /> ลูกค้าเลือกแล้ว
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#64748b',
                              fontWeight: '500',
                            }}
                          >
                            รอส่งให้ Sale นำเสนอ
                          </span>
                        )}
                      </td>
                      <td
                        style={{
                          padding: '16px',
                        }}
                      >
                        {decisionActions(item)}
                        <div
                          style={{
                            display: 'flex',
                            gap: '8px',
                            marginTop: '8px',
                          }}
                        >
                          {decisionFor(item)?.status === 'Accept' && !decisionFor(item)?.sentBy && (
                            <button
                              className="primary"
                              style={{
                                padding: '6px 12px',
                                fontSize: '13px',
                              }}
                              onClick={() => sendToSales(item)}
                            >
                              เลือกส่ง Sale
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                  gap: '24px',
                }}
              >
                {visibleReviewers.map((item) => (
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
                        {item.platform === 'instagram' && (
                          <InstagramLogo size={20} weight="fill" color="#E1306C" />
                        )}
                        {item.platform === 'tiktok' && (
                          <TiktokLogo size={20} weight="fill" color="#000000" />
                        )}
                        {item.platform === 'facebook' && (
                          <FacebookLogo size={20} weight="fill" color="#1877F2" />
                        )}
                        <h3
                          style={{
                            margin: 0,
                            fontSize: '16px',
                          }}
                        >
                          <button className="reviewer-username" onClick={() => setProfile(item)}>
                            {item.username}
                          </button>
                        </h3>
                        <span
                          style={{
                            marginLeft: 'auto',
                            fontSize: '11px',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: item.sourceIndex % 2 === 0 ? '#e0e7ff' : '#f1f5f9',
                            color: item.sourceIndex % 2 === 0 ? '#3730a3' : '#475569',
                          }}
                        >
                          {item.sourceIndex % 2 === 0 ? 'สมัครเอง' : 'เพิ่มโดยทีมงาน'}
                        </span>
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
                          <User weight="fill" size={14} /> {item.followers}
                        </span>
                        <span
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Heart weight="fill" size={14} /> {item.likes}
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
                      {decisionLabel(item)}
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
                            REVIEWED :
                          </span>
                          <span
                            style={{
                              fontWeight: '700',
                            }}
                          >
                            {item.reviewed}
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
                            {item.estReach}
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
                            ผลเลือกลูกค้า :
                          </span>
                          <span
                            style={{
                              fontWeight: '700',
                              color: item.sourceIndex % 2 === 0 ? '#16a34a' : '#64748b',
                            }}
                          >
                            {decisionFor(item)?.status === 'Reject'
                              ? 'Reject — ไม่ส่ง Sale'
                              : decisionFor(item)?.sentBy
                                ? 'ส่ง Sale แล้ว'
                                : customerSelected(item)
                                  ? 'ลูกค้าเลือกแล้ว'
                                  : 'รอ Buyer / PM เลือก'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {(!decisionFor(item) ||
                      customerSelected(item) ||
                      decisionFor(item)?.status === 'Reject') && (
                      <div className="reviewer-card-footer reviewer-card-decision-footer">
                        {decisionActions(item)}
                      </div>
                    )}
                    {decisionFor(item)?.status === 'Accept' && !decisionFor(item)?.sentBy && (
                      <div className="reviewer-card-footer">
                        <button className="primary" onClick={() => sendToSales(item)}>
                          เลือกส่ง Sale
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      {addMode && (
        <div className="modal-backdrop" onClick={() => setAddMode(null)}>
          <section
            className="reviewer-profile-modal reviewer-add-modal"
            role="dialog"
            aria-modal="true"
            aria-label="เพิ่มนักรีวิว"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="secondary-button"
              onClick={() => setAddMode(null)}
              aria-label="ปิดเพิ่มนักรีวิว"
            >
              <X />
            </button>
            <h2>เพิ่มนักรีวิว</h2>
            <p>เลือกเพิ่มทีละคน หรืออัปโหลดรายชื่อหลายคนพร้อมกัน</p>
            <div className="reviewer-add-tabs">
              {[
                ['single', 'เพิ่มทีละคน'],
                ['bulk', 'Bulk Upload'],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  className={addMode === mode ? 'primary' : 'secondary-button'}
                  onClick={() => {
                    setAddMode(mode);
                    setAddError('');
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
            {addMode === 'single' ? (
              <div className="reviewer-add-fields">
                <label>
                  Platform
                  <select
                    value={newPlatform}
                    onChange={(event) => setNewPlatform(event.target.value)}
                  >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="facebook">Facebook</option>
                  </select>
                </label>
                <label>
                  Username
                  <input
                    value={newUsername}
                    onChange={(event) => setNewUsername(event.target.value)}
                    placeholder="เช่น creator.name"
                  />
                </label>
              </div>
            ) : (
              <div className="reviewer-add-fields">
                <p>อัปโหลด CSV ที่บันทึกจาก Excel หรือวางข้อมูล 2 คอลัมน์: username, platform</p>
                <a
                  download="reviewers-template.csv"
                  href={
                    'data:text/csv;charset=utf-8,' +
                    encodeURIComponent('username,platform\ncreator.name,instagram\n')
                  }
                >
                  ดาวน์โหลดไฟล์ตัวอย่าง CSV
                </a>
                <label>
                  ไฟล์รายชื่อ (.csv / .tsv)
                  <input
                    type="file"
                    accept=".csv,.tsv,text/csv,text/tab-separated-values"
                    onChange={async (event) => {
                      const file = event.target.files?.[0];
                      if (file) {
                        setBulkText(await file.text());
                        setUploadName(file.name);
                        setAddError('');
                      }
                    }}
                  />
                </label>
                {uploadName && <small>{uploadName}</small>}
                <label>
                  วางรายชื่อ
                  <textarea
                    value={bulkText}
                    onChange={(event) => {
                      setBulkText(event.target.value);
                      setAddError('');
                    }}
                    placeholder={'username,platform\ncreator.name,instagram'}
                  />
                </label>
                <small>Platform รองรับ instagram, tiktok, facebook</small>
                {bulkRows.length > 0 && (
                  <div className="reviewer-upload-preview">
                    <strong>ตัวอย่างรายชื่อ ({bulkRows.length} คน)</strong>
                    {bulkRows.slice(0, 5).map((row, index) => (
                      <p key={index}>
                        {row.username || 'ไม่มี Username'} · {row.platform || 'ไม่มี Platform'}
                      </p>
                    ))}
                    {bulkRows.length > 5 && <small>และอีก {bulkRows.length - 5} คน</small>}
                  </div>
                )}
              </div>
            )}
            {addError && (
              <p className="field-error" role="alert">
                {addError}
              </p>
            )}
            <div className="reviewer-add-tabs">
              <button className="secondary-button" onClick={() => setAddMode(null)}>
                ยกเลิก
              </button>
              <button className="primary" onClick={saveReviewers}>
                เพิ่ม{addMode === 'bulk' ? ` ${bulkRows.length} คน` : 'นักรีวิว'}
              </button>
            </div>
          </section>
        </div>
      )}
      {profile && (
        <div className="modal-backdrop" onClick={() => setProfile(null)}>
          <section
            className="reviewer-profile-modal"
            role="dialog"
            aria-modal="true"
            aria-label={`โปรไฟล์ ${profile.username}`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              className="secondary-button"
              onClick={() => setProfile(null)}
              aria-label="ปิดโปรไฟล์"
            >
              <X />
            </button>
            <h2>{profile.username}</h2>
            <p>
              {profile.platform} · ผู้ติดตาม {profile.followers} · Likes {profile.likes}
            </p>
            {decisionLabel(profile)}
            <div className="reviewer-profile-images">
              {profile.images.slice(0, 3).map((src) => (
                <img key={src} src={src} alt={`ผลงานของ ${profile.username}`} />
              ))}
            </div>
            <p>
              Engagement: {profile.engageLv} · Reviewed: {profile.reviewed} · Est. Reach:{' '}
              {profile.estReach}
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
