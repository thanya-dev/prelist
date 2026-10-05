import { ImageSquare } from '@phosphor-icons/react';
export function BrandMark({ project, large = false }) {
  if (project.image)
    return (
      <img
        className={`brand-image ${large ? 'large' : ''}`}
        src={project.image}
        alt={`${project.name || 'Project'} project`}
      />
    );
  if (project.tone === 'new')
    return (
      <div className={`brand-empty ${large ? 'large' : ''}`} aria-label="ยังไม่มี Cover Image">
        <ImageSquare />
      </div>
    );
  if (project.tone === 'mascot')
    return (
      <img
        className={`brand-image ${large ? 'large' : ''}`}
        src="/assets/gentleman-project.png"
        alt="Page Promotion project"
      />
    );
  return (
    <div className={`brand-tile ${project.tone} ${large ? 'large' : ''}`}>
      <span>{project.brand}</span>
    </div>
  );
}
