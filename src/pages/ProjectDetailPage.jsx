import { useParams } from 'react-router-dom';
import { ProjectDetails } from '../features/projects/ProjectDetails.jsx';
export function ProjectDetailPage({ projects, onBack, onEdit }) {
  const { id } = useParams();
  const project = projects.find((p) => p.id === id);
  if (!project)
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        Project not found <br />
        <br />
        <button onClick={onBack}>Go Back</button>
      </div>
    );
  return <ProjectDetails project={project} onBack={onBack} onEdit={onEdit} />;
}
