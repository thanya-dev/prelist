import { PlatformLogo } from '../../components/shared/PlatformLogo.jsx';
import { CaretRight, NotePencil, User, UsersThree } from '@phosphor-icons/react';
import { BrandMark } from '../../components/shared/BrandMark.jsx';
export function ProjectCard({ project, onOpen, onEdit }) {
  const isLight = project.status === 'Draft';
  return (
    <article
      className="project-card gap-6 pt-5 pr-8 pb-5 pl-5 max-[760px]:gap-4 max-[760px]:p-3"
      onClick={() => onOpen(project)}
      tabIndex={0}
      onKeyDown={(event) => event.key === 'Enter' && onOpen(project)}
    >
      <div className="thumb-wrap">
        <BrandMark project={project} />
        <button
          className="edit-chip"
          onClick={(event) => {
            event.stopPropagation();
            onEdit(project);
          }}
        >
          <NotePencil size={15} /> แก้ไข
        </button>
      </div>
      <div className="project-info">
        <div className="project-title-row">
          <h3>{project.name}</h3>
          {!isLight && <span className="id-pill">{project.id}</span>}
        </div>
        <div className="owner">
          <User size={16} /> {project.owner}
        </div>
        {isLight ? (
          <>
            <small>ยังไม่ใช่ Project ที่เริ่มดำเนินงาน</small>
            <div className="prelist-meta">
              <span>{project.brand}</span>
              {project.target && (
                <span>
                  <UsersThree /> {project.target} Influencers
                </span>
              )}
              {project.platforms?.map((platform) => (
                <span key={platform} className="inline-flex items-center gap-2">
                  <PlatformLogo platform={platform} />
                  {platform}
                </span>
              ))}
            </div>
          </>
        ) : (
          <>
            <small>{project.status === 'Complete' ? 'โปรเจกต์เสร็จสิ้น' : '1 ใบเสนอราคา'}</small>
            <div>
              <span className="quote-pill">{project.quote}</span>
              <span className="main-pill">Main</span>
            </div>
          </>
        )}
      </div>
      <span
        className={`lifecycle-status ${project.status.toLowerCase().replaceAll(' ', '-')}`}
        style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
        }}
      >
        {project.status}
      </span>
      <CaretRight className="card-arrow" size={20} />
    </article>
  );
}
