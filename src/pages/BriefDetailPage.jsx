import { normalizeProducts } from '../features/briefs/productOptions.js';
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, CaretRight, Package, Megaphone, Plus } from '@phosphor-icons/react';
import { getJobPostings } from '../features/job-postings/jobPostingApi.js';
import { getBriefById } from '../features/briefs/briefApi.js';
import { BriefSummary } from '../features/briefs/BriefSummary.jsx';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { PostingCalendarList } from '../features/job-postings/PostingCalendarList.jsx';
export function BriefDetailPage({ onBack }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const brief = getBriefById(id);
  const products = normalizeProducts(brief?.products);
  const [activeTab, setActiveTab] = useState('postings');
  const postingCount = getJobPostings().filter(
    (posting) => posting.brief === (brief?.id || id),
  ).length;
  const handleTabKeyDown = (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextTab =
      event.key === 'Home'
        ? 'postings'
        : event.key === 'End'
          ? 'products'
          : activeTab === 'postings'
            ? 'products'
            : 'postings';
    setActiveTab(nextTab);
    document.getElementById(`brief-tab-${nextTab}`)?.focus();
  };
  return (
    <div className="app-shell">
      <Sidebar onList={onBack} />
      <main className="list-main lifecycle-detail brief-detail-page">
        <div className="breadcrumbs">
          <Link to="/briefs" className="hover:text-[#5135ff] hover:underline transition-colors">
            รายการ Brief
          </Link>{' '}
          <CaretRight /> <b>{id}</b>
        </div>
        <div className="detail-heading">
          <button className="back-inline" onClick={onBack}>
            <ArrowLeft /> กลับ
          </button>
        </div>
        <section className="project-summary brief-card">
          <BriefSummary brief={brief} onEdit={() => navigate(`/briefs/${brief?.id || id}/edit`)} />
        </section>

        <div
          className="detail-tabs brief-detail-tabs"
          role="tablist"
          aria-label="ข้อมูล Brief"
          onKeyDown={handleTabKeyDown}
        >
          {[
            ['postings', 'ประกาศหานักรีวิว', postingCount, Megaphone],
            ['products', 'Product Option', products.length, Package],
          ].map(([tab, label, count, Icon]) => (
            <button
              key={tab}
              id={`brief-tab-${tab}`}
              className={activeTab === tab ? 'active' : ''}
              type="button"
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`brief-panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              onClick={() => setActiveTab(tab)}
            >
              <Icon size={18} /> {label} ({count})
            </button>
          ))}
        </div>
        <div
          id="brief-panel-postings"
          role="tabpanel"
          aria-labelledby="brief-tab-postings"
          hidden={activeTab !== 'postings'}
        >
          <PostingCalendarList briefId={brief?.id || id} />
        </div>
        <section
          id="brief-panel-products"
          role="tabpanel"
          aria-labelledby="brief-tab-products"
          hidden={activeTab !== 'products'}
          className="detail-card brief-products-section"
          aria-label="Product option"
        >
          <h2 className="flex items-center gap-2">
            <Package size={20} /> Product option
          </h2>
          <p className="text-sm text-muted mt-2 mb-4">
            รายการสินค้าที่นักรีวิวจะใช้เพื่อทำการรีวิว (นักรีวิวสามารถเลือกได้หลังจากตอบรับแคมเปญ)
          </p>
          {products.length ? (
            <div className="grid gap-4">
              {products.map((product, index) => (
                <article
                  key={index}
                  className="brief-product-detail flex items-start gap-4 rounded-lg bg-soft p-4"
                >
                  {product.image && (
                    <img
                      className="h-20 w-20 shrink-0 rounded object-contain"
                      src={product.image}
                      alt={product.name}
                    />
                  )}
                  <div className="min-w-0">
                    <h3 className="m-0 text-base font-medium break-words">
                      {product.name || 'ยังไม่ระบุชื่อสินค้า'}
                    </h3>
                    <p className="m-0 mt-2 whitespace-pre-wrap break-words text-muted">
                      {product.description || 'ยังไม่ระบุรายละเอียด'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center gap-5 py-8">
              <Package size={40} className="text-muted" />
              <p className="m-0 text-muted">ยังไม่มีสินค้า</p>
              <button
                className="primary"
                onClick={() => navigate(`/briefs/${brief?.id || id}/edit`)}
              >
                <Plus size={18} /> เพิ่มสินค้า
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
