import { useState } from 'react';
import { SEED_PROJECTS } from './projectSeeds.js';
export function useProjects() {
  const [projects, setProjects] = useState(SEED_PROJECTS);
  function saveProject(project, isEditing) {
    setProjects((currentProjects) =>
      isEditing
        ? currentProjects.map((existingProject) =>
            existingProject.id === project.id ? project : existingProject,
          )
        : [project, ...currentProjects],
    );
  }
  return {
    projects,
    saveProject,
  };
}
