import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CaretRight, NotePencil, Storefront } from '@phosphor-icons/react';
import { getBriefById } from '../features/briefs/briefApi.js';
import { BrandMark } from '../components/shared/BrandMark.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { PostingCalendarList } from '../features/job-postings/PostingCalendarList.jsx';
export function BriefDetailPage({ onBack }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const brief = getBriefById(id);
  const briefName = brief?.name || '';
  return (
    <div className="app-shell">
      <Sidebar onList={onBack} />
      <main className="list-main lifecycle-detail">
        <div className="breadcrumbs">
          Projects <CaretRight /> Briefs <CaretRight /> <b>{id}</b>
        </div>
        <div className="detail-heading">
          <button className="back-inline" onClick={onBack}>
            <ArrowLeft /> กลับ
          </button>
        </div>
        <section className="project-summary">
          <div className="thumb-wrap brief-summary-avatar">
            <BrandMark project={brief || { tone: 'new' }} />
            <button
              className="edit-chip"
              aria-label="แก้ไขบรีฟ"
              onClick={() => navigate(`/briefs/${id}/edit`)}
            >
              <NotePencil size={15} /> แก้ไข
            </button>
          </div>
          <div>
            <div className="project-title-row">
              <h1>Brief: {id}</h1>
            </div>
            <p>
              <Storefront /> {briefName}
            </p>
            {brief?.brand && <p>{brief.brand}</p>}
          </div>
        </section>

        <PostingCalendarList briefId={id} />
      </main>
    </div>
  );
}
