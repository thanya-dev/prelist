import { Navigate, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
import { ProjectListPage } from '../pages/ProjectListPage.jsx';
import { BriefListPage } from '../pages/BriefListPage.jsx';
import { BriefDetailPage } from '../pages/BriefDetailPage.jsx';
import { CampaignFormPage } from '../pages/CampaignFormPage.jsx';
import { CampaignDetailPage } from '../pages/CampaignDetailPage.jsx';
import { ProjectDetailPage } from '../pages/ProjectDetailPage.jsx';
import { JobPostingDetailPage } from '../pages/JobPostingDetailPage.jsx';
export function AppRoutes({ projects, navigate, onOpenProject, onEditProject }) {
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
      <Route path="/briefs/create" element={<Navigate to="/briefs?create=1" replace />} />
      <Route path="/briefs/:id/edit" element={<LegacyBriefEditRoute />} />
      <Route path="/projects/create" element={<Navigate to="/" replace />} />
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
      <Route path="/projects/:id/edit" element={<Navigate to="/" replace />} />
      <Route
        path="/briefs/:id"
        element={
          <BriefDetailPage key={window.location.pathname} onBack={() => navigate('/briefs')} />
        }
      />
      <Route path="/campaigns/:id" element={<CampaignDetailPage />} />
      <Route path="/campaigns/create" element={<CampaignFormPage key="create-campaign" />} />
      <Route
        path="/campaigns/:id/edit"
        element={<CampaignFormPage key={window.location.pathname} />}
      />
      <Route path="/job-postings/create" element={<LegacyPostingCreateRoute />} />
      <Route path="/job-postings/:id/edit" element={<LegacyPostingEditRoute />} />
      <Route path="/job-postings/:id" element={<JobPostingDetailPage />} />
    </Routes>
  );
}

function LegacyBriefEditRoute() {
  const { id } = useParams();
  return <Navigate to={`/briefs/${id}?edit=1`} replace />;
}

function LegacyPostingEditRoute() {
  const { id } = useParams();
  return <Navigate to={`/job-postings/${id}?edit=1`} replace />;
}
function LegacyPostingCreateRoute() {
  const [params] = useSearchParams();
  const briefId = params.get('briefId');
  const next = new URLSearchParams(params);
  next.set('createPosting', '1');
  return <Navigate to={`${briefId ? `/briefs/${briefId}` : '/briefs'}?${next}`} replace />;
}
