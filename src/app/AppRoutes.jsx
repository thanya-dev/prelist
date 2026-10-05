import { Routes, Route } from 'react-router-dom';
import { ProjectListPage } from '../pages/ProjectListPage.jsx';
import { BriefFormPage } from '../pages/BriefFormPage.jsx';
import { BriefListPage } from '../pages/BriefListPage.jsx';
import { BriefDetailPage } from '../pages/BriefDetailPage.jsx';
import { CampaignDetailPage } from '../pages/CampaignDetailPage.jsx';
import { ProjectDetailPage } from '../pages/ProjectDetailPage.jsx';
import { ProjectFormPage } from '../pages/ProjectFormPage.jsx';
import { JobPostingFormPage } from '../pages/JobPostingFormPage.jsx';
import { JobPostingDetailPage } from '../pages/JobPostingDetailPage.jsx';
export function AppRoutes({ projects, navigate, onOpenProject, onEditProject, onSaveProject }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProjectListPage
            projects={projects}
            onOpen={onOpenProject}
            onCreate={() => onEditProject()}
            onEdit={onEditProject}
          />
        }
      />
      <Route path="/briefs" element={<BriefListPage />} />
      <Route path="/briefs/create" element={<BriefFormPage key="create-brief" />} />
      <Route path="/briefs/:id/edit" element={<BriefFormPage key={window.location.pathname} />} />
      <Route
        path="/projects/create"
        element={
          <ProjectFormPage
            projects={projects}
            onBack={() => navigate('/')}
            onSave={(p) => onSaveProject(p, false)}
          />
        }
      />
      <Route
        path="/projects/:id"
        element={
          <ProjectDetailPage
            projects={projects}
            onBack={() => navigate('/')}
            onEdit={onEditProject}
          />
        }
      />
      <Route
        path="/projects/:id/edit"
        element={<ProjectFormPage projects={projects} onSave={(p) => onSaveProject(p, true)} />}
      />
      <Route
        path="/briefs/:id"
        element={
          <BriefDetailPage key={window.location.pathname} onBack={() => navigate('/briefs')} />
        }
      />
      <Route
        path="/campaigns/page-promotion-facebook"
        element={<CampaignDetailPage onBack={() => navigate('/projects/PRJ2026090022')} />}
      />
      <Route path="/job-postings/create" element={<JobPostingFormPage />} />
      <Route
        path="/job-postings/:id/edit"
        element={<JobPostingFormPage key={window.location.pathname} />}
      />
      <Route path="/job-postings/:id" element={<JobPostingDetailPage />} />
    </Routes>
  );
}
