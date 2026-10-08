import { toggleArrayValue } from '../../utils/array.js';
import { useState } from 'react';
import { getJobPostings } from '../job-postings/jobPostingApi.js';
import { getBriefById } from '../briefs/briefApi.js';
import {
  getAnnouncementReviewers,
  importAnnouncementReviewers,
  getCampaignAnnouncementReviewers,
} from './campaignAnnouncementImport.js';
import { Field } from '../../components/ui/Field.jsx';

export function AnnouncementReviewerImport({ campaign, project, onImport }) {
  const [announcementId, setAnnouncementId] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const [notice, setNotice] = useState('');
  const briefIds = (project?.briefNumbers || [project?.briefNumber])
    .filter(Boolean)
    .map((id) => getBriefById(id)?.id || id);
  const postings = getJobPostings().filter(
    (posting) =>
      briefIds.includes(posting.brief) ||
      campaign.sourcePostings?.some((source) => source.id === posting.id),
  );
  const posting = postings.find((entry) => entry.id === announcementId);
  const existing = getCampaignAnnouncementReviewers(campaign.id);
  const candidates = posting
    ? getAnnouncementReviewers(posting).filter(
        (reviewer) =>
          !existing.some(
            (entry) =>
              entry.platform.toLowerCase() === reviewer.platform.toLowerCase() &&
              entry.name.toLowerCase() === reviewer.name.toLowerCase(),
          ),
      )
    : [];
  return (
    <section className="form-card mb-6">
      <h3>นำเข้ารายชื่อจากประกาศ</h3>
      <Field label="Announcement ID">
        <select
          value={announcementId}
          onChange={(event) => {
            setAnnouncementId(event.target.value);
            setSelectedIds([]);
            setNotice('');
          }}
        >
          <option value="">เลือก Announcement ID</option>
          {postings.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.id} — {entry.name}
            </option>
          ))}
        </select>
      </Field>
      {!postings.length && (
        <p className="text-sm text-muted">ยังไม่มีประกาศที่เชื่อมกับ Brief ของโปรเจกต์นี้</p>
      )}
      {posting && (
        <>
          <p className="my-4 text-sm">
            พร้อมนำเข้า {candidates.length} คน · ไม่รวมคนที่ถูก Reject หรือมีในแคมเปญแล้ว
          </p>
          {candidates.length > 0 && (
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={selectedIds.length === candidates.length}
                onChange={(event) =>
                  setSelectedIds(event.target.checked ? candidates.map((entry) => entry.id) : [])
                }
              />
              เลือกทั้งหมด
            </label>
          )}
          <div className="max-h-60 overflow-y-auto">
            {candidates.map((reviewer) => (
              <label key={reviewer.id} className="flex items-center gap-3 border-b py-3">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(reviewer.id)}
                  onChange={() =>
                    setSelectedIds((current) => toggleArrayValue(current, reviewer.id))
                  }
                />
                {reviewer.name} · {reviewer.platform}
              </label>
            ))}
          </div>
          <button
            className="primary mt-4"
            disabled={!selectedIds.length}
            onClick={() => {
              const result = importAnnouncementReviewers(
                campaign.id,
                candidates.filter((entry) => selectedIds.includes(entry.id)),
              );
              onImport(result.reviewers);
              setSelectedIds([]);
              setNotice(`นำเข้า ${result.added} คนแล้ว`);
            }}
          >
            นำเข้าที่เลือก ({selectedIds.length})
          </button>
        </>
      )}
      <p role="status" className="mt-3 text-sm">
        {notice}
      </p>
    </section>
  );
}
