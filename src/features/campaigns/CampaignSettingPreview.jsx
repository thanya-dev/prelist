import { Link } from 'react-router-dom';
import { DAY_MS, parseDay } from '../../utils/formatDate.js';
const formatDate = (value) => {
  const day = parseDay(value);
  return day === null
    ? 'ยังไม่ระบุ'
    : new Intl.DateTimeFormat('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        timeZone: 'UTC',
      }).format(new Date(day * DAY_MS));
};

export function CampaignSettingPreview({ campaign, project }) {
  const sourcePosting = campaign.sourcePostings?.[0] || campaign.sourcePosting;
  return (
    <aside className="cw-preview" aria-label="Preview campaign setting">
      <h3>Preview campaign setting</h3>
      <dl className="cw-preview-posting-section">
        <dt>ประกาศ</dt>
        <dd>
          {sourcePosting ? (
            <div className="cw-preview-posting">
              <h4>
                <Link to={`/job-postings/${sourcePosting.id}`}>{sourcePosting.name}</Link>
              </h4>
              <p>
                {sourcePosting.brief} · {sourcePosting.id}
              </p>
            </div>
          ) : (
            <p className="text-muted">ยังไม่ได้เลือกประกาศต้นทาง</p>
          )}
        </dd>
      </dl>
      <dl>
        <dt>โปรเจกต์</dt>
        <dd>
          <Link className="cw-link" to={`/projects/${project.id}`}>
            {project.name}
          </Link>
        </dd>
        <dt>Assign OP</dt>
        <dd>{campaign.assignOp || 'ยังไม่ระบุ'}</dd>
        <dt>Group</dt>
        <dd>{campaign.group || 'ยังไม่ระบุ'}</dd>
        <dt>สถานะแคมเปญ</dt>
        <dd>
          <span className={`cw-status ${campaign.status}`}>
            {{ draft: 'DRAFT', active: 'ACTIVE CAMPAIGN', completed: 'COMPLETED' }[
              campaign.status
            ] || 'ยังไม่ระบุ'}
          </span>
        </dd>
        <dt>ประเภทแคมเปญ</dt>
        <dd>
          {{ normal: 'Normal', confidential: 'Confidential campaign', private: 'Private campaign' }[
            campaign.campaignType
          ] || 'ยังไม่ระบุ'}
        </dd>
      </dl>
      <div className="cw-preview-period">
        <p>ระยะเวลาของแคมเปญ</p>
        <b>ระยะเวลารับสมัคร</b>
        <span>
          {formatDate(campaign.applicationStart)} – {formatDate(campaign.applicationEnd)}
        </span>
        <b>ระยะเวลาทำแคมเปญ</b>
        <span>
          {formatDate(campaign.campaignStart)} – {formatDate(campaign.campaignEnd)}
        </span>
      </div>
      <dl>
        <dt>ขั้นตอนการทำงาน</dt>
        <dd>
          {{
            post: 'ส่งโพสต์อย่างเดียว',
            'idea-draft-post': 'ส่งคอนเทนต์ไอเดีย, ดราฟต์ และโพสต์',
            'draft-post': 'ส่งดราฟต์และโพสต์',
          }[campaign.workflow] || 'ยังไม่ระบุ'}
        </dd>
        <dt>แสดงข้อมูลผู้ติดตามของนักรีวิว</dt>
        <dd>{campaign.demographics?.join(', ') || '-'}</dd>
      </dl>
    </aside>
  );
}
