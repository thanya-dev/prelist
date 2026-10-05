import { useState } from 'react';
import {
  CaretRight,
  ChartLineUp,
  Check,
  ClipboardText,
  Copy,
  CurrencyDollar,
  FileText,
  Gauge,
  Megaphone,
  Sparkle,
  TrendUp,
} from '@phosphor-icons/react';
import { BrandMark } from '../../components/shared/BrandMark.jsx';
import { DetailTopbar } from '../../components/layout/DetailTopbar.jsx';
export function ProjectSetupDetails({ project, onBack, onEdit }) {
  const [tab, setTab] = useState('Report');
  const [toast, setToast] = useState('');
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState(
    '📢 งานใหม่จาก Buddy Review\n\nโปรเจค: KTC First Choice Cash Card 2026\n• บัตรกดเงินสด_บัตรเครดิต First Choice 2026\n• บัตรกดเงินสด_First Choice Online Booster\n\nแคมเปญที่เปิดรับ:\n-\n\nสนใจรับงาน ตอบกลับข้อความนี้ได้เลย',
  );
  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2200);
  };
  return (
    <div className="detail-page">
      <DetailTopbar onBack={onBack} />
      <section className="hero">
        <div className="hero-main">
          <BrandMark project={project} large />
          <div>
            <h1>{project.name}</h1>
            <p>1 Campaigns</p>
          </div>
        </div>
        <div className="status">
          <span></span> ON GOING
        </div>
        <div className="hero-tools">
          <button onClick={() => onEdit(project)}>EDIT</button>
          <button onClick={() => notify('คัดลอกรหัสผ่านแล้ว')}>PASSWORD ◉ &nbsp;••••••</button>
          <button onClick={() => notify('คัดลอกแล้ว')} aria-label="Copy password">
            <Copy size={20} />
          </button>
        </div>
        <div className="hero-tabs">
          {[
            {
              label: 'Report',
              icon: ChartLineUp,
            },
            {
              label: 'Expense Report',
              icon: CurrencyDollar,
            },
            {
              label: 'Campaign Dashboard',
              icon: Gauge,
            },
            {
              label: 'Pre list',
              icon: ClipboardText,
            },
          ].map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={tab === label ? 'active' : ''}
              onClick={() => {
                if (label === 'Campaign Dashboard') {
                  window.open(
                    'https://dashboard.buddyreview.co/dashboard/projects/uGvkPwRGps/campaign/IlQZqO7Khx?pw=39p9vk',
                    '_blank',
                  );
                } else {
                  setTab(label);
                }
              }}
            >
              <Icon size={23} />
              {label}
            </button>
          ))}
        </div>
      </section>
      {tab === 'Pre list' ? (
        <main className="analytics">
          <div className="analytics-title">
            <h2>Pre list</h2>
            <button className="primary" onClick={() => setIsBroadcastOpen(true)}>
              <Megaphone size={18} /> Broadcast งาน
            </button>
          </div>
        </main>
      ) : (
        <main className="analytics">
          <div className="analytics-title">
            <h2>{tab === 'Report' ? 'Analytics' : tab}</h2>
            <button onClick={() => notify('เตรียมไฟล์รายงานเรียบร้อย')}>
              <FileText /> Export Report
            </button>
          </div>
          <div className="metrics-grid">
            <div className="metric reach">
              <span>Reach</span>
              <strong>0</strong>
              <p>
                <b>0%</b> of 1 Commit Reach
              </p>
            </div>
            <div className="goal-card">
              <div>
                <span>Goal</span>
                <strong>0%</strong>
              </div>
              <TrendUp size={54} weight="fill" />
              <div className="goal-line">
                <i></i>
              </div>
              <h3>0.00</h3>
              <small>CPR ⓘ</small>
              <h3>0.00</h3>
              <small>CPE ⓘ</small>
            </div>
            <div className="metric">
              <span>Contents</span>
              <strong>0</strong>
              <p>
                <b>0%</b> of 3 Commit Contents
              </p>
            </div>
            <div className="metric">
              <span>Followers</span>
              <strong>0</strong>
            </div>
            <div className="metric">
              <span>Engagement</span>
              <strong>0</strong>
            </div>
            <div className="metric">
              <span>Engagement Rate</span>
              <strong>0.00%</strong>
            </div>
          </div>
          <section className="empty-section">
            <h2>Quotation</h2>
            <div>
              <Sparkle size={34} />
              <span>ยังไม่มีข้อมูลใบเสนอราคาในรายงานนี้</span>
            </div>
          </section>
          <section className="empty-section">
            <h2>Top Contents</h2>
            <button>
              All Contents <CaretRight />
            </button>
          </section>
        </main>
      )}
      {toast && (
        <div className="toast">
          <Check size={18} weight="bold" />
          {toast}
        </div>
      )}
      {isBroadcastOpen && (
        <div className="modal-backdrop">
          <div
            className="upgrade-modal broadcast-modal"
            style={{
              textAlign: 'left',
              maxWidth: '500px',
              alignItems: 'stretch',
            }}
          >
            <h2>Broadcast งาน</h2>
            <p
              style={{
                marginBottom: '20px',
              }}
            >
              ตรวจสอบรายละเอียดและข้อความก่อนส่งประกาศงาน
            </p>
            <label className="field gap-2">
              <span>ข้อความที่จะส่ง (แก้ไขได้)</span>
              <textarea
                style={{
                  minHeight: '240px',
                  padding: '12px',
                  width: '100%',
                  borderRadius: '8px',
                  border: '1px solid #ddd',
                  fontSize: '14px',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  lineHeight: '1.5',
                }}
                value={broadcastMessage}
                onChange={(event) => setBroadcastMessage(event.target.value)}
              />
            </label>
            <div
              style={{
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '12px',
              }}
            >
              <button
                className="secondary-button"
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: '1px solid #ddd',
                  background: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => setIsBroadcastOpen(false)}
              >
                ยกเลิก
              </button>
              <button
                className="primary"
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  background: '#4A1A7D',
                  color: 'white',
                  cursor: 'pointer',
                }}
                onClick={() => {
                  setIsBroadcastOpen(false);
                  notify('ส่ง Broadcast เรียบร้อยแล้ว');
                }}
              >
                ส่งข้อความ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
