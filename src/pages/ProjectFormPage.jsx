import { useNavigate, useParams } from 'react-router-dom';
import { ProjectForm } from '../features/projects/ProjectForm.jsx';
export function ProjectFormPage({ projects, onBack, onSave }) {
  const { id } = useParams();
  const project = id ? projects.find((p) => p.id === id) : null;
  const navigate = useNavigate();
  return (
    <ProjectForm
      project={project}
      onBack={onBack || (() => navigate(id ? `/projects/${id}` : '/'))}
      onSave={onSave}
    />
  );
}
