import { useMemo, useState } from 'react';
import {
  CaretDown,
  CaretRight,
  ListMagnifyingGlass,
  MagnifyingGlass,
  Plus,
  User,
} from '@phosphor-icons/react';
import { Sidebar } from '../components/layout/Sidebar.jsx';
import { ProjectCard } from '../features/projects/ProjectCard.jsx';
export function ProjectListPage({ projects, onOpen, onCreate, onEdit }) {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [createdByFilter, setCreatedByFilter] = useState('All');
  const statuses = ['All', 'Draft', 'On Going', 'Complete'];
  const creators = useMemo(
    () => [...new Set(projects.map((item) => item.owner))].sort(),
    [projects],
  );
  const counts = useMemo(
    () =>
      Object.fromEntries(
        statuses.map((status) => [
          status,
          status === 'All'
            ? projects.length
            : projects.filter((item) => item.status === status).length,
        ]),
      ),
    [projects],
  );
  const filtered = useMemo(
    () =>
      projects.filter(
        (item) =>
          (statusFilter === 'All' || item.status === statusFilter) &&
          (createdByFilter === 'All' || item.owner === createdByFilter) &&
          `${item.name} ${item.id} ${item.quote} ${item.brand}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [projects, query, statusFilter, createdByFilter],
  );
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="list-main">
        <header className="list-header">
          <div className="breadcrumbs">
            Management <CaretRight /> <b>Projects</b>
          </div>
          <div className="page-actions gap-6 mt-6 mb-8 max-[760px]:gap-3">
            <h1>โปรเจกต์</h1>
            <label className="search">
              <MagnifyingGlass size={20} />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="ค้นหาด้วยชื่อ, Project ID, Brand หรือเลขที่ใบเสนอราคา"
              />
            </label>
            <button className="primary" onClick={onCreate}>
              <Plus size={18} weight="bold" /> สร้างโปรเจกต์ใหม่
            </button>
          </div>
          <div className="list-filter-row gap-4">
            <div className="status-filters" aria-label="กรองตามสถานะ">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={statusFilter === status ? 'active' : ''}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'All' ? 'ทั้งหมด' : status}
                  <span>{counts[status]}</span>
                </button>
              ))}
            </div>
            <label className="created-by-filter">
              <span>Created by</span>
              <div>
                <User />
                <select
                  value={createdByFilter}
                  onChange={(event) => setCreatedByFilter(event.target.value)}
                >
                  <option value="All">ผู้สร้างทั้งหมด</option>
                  {creators.map((creator) => (
                    <option key={creator} value={creator}>
                      {creator}
                    </option>
                  ))}
                </select>
                <CaretDown />
              </div>
            </label>
          </div>
        </header>
        <section className="project-list grid gap-5">
          {filtered.length ? (
            filtered.map((project) => (
              <ProjectCard key={project.id} project={project} onOpen={onOpen} onEdit={onEdit} />
            ))
          ) : (
            <div className="empty-state">
              <ListMagnifyingGlass size={48} />
              <h3>ไม่พบโปรเจกต์</h3>
              <p>ลองเปลี่ยนคำค้นหาหรือเลือกสถานะอื่น</p>
            </div>
          )}
        </section>
        <div className="pagination">
          <button disabled>‹</button>
          <button className="selected">1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <span>…</span>
          <button>118</button>
          <button>›</button>
        </div>
      </main>
      <button className="floating">
        <CaretDown weight="bold" />
      </button>
    </div>
  );
}
