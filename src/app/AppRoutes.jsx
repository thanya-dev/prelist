import { lazy, Suspense } from 'react';
import { Navigate, Routes, Route, useParams, useSearchParams } from 'react-router-dom';
const ProjectListPage = lazy(() =>
  import('../pages/ProjectListPage.jsx').then((module) => ({ default: module.ProjectListPage })),
);
const BriefListPage = lazy(() =>
  import('../pages/BriefListPage.jsx').then((module) => ({ default: module.BriefListPage })),
);
const BriefDetailPage = lazy(() =>
  import('../pages/BriefDetailPage.jsx').then((module) => ({ default: module.BriefDetailPage })),
);
const CampaignFormPage = lazy(() =>
  import('../pages/CampaignFormPage.jsx').then((module) => ({ default: module.CampaignFormPage })),
);
const CampaignDetailPage = lazy(() =>
  import('../pages/CampaignDetailPage.jsx').then((module) => ({
    default: module.CampaignDetailPage,
  })),
);
const ProjectDetailPage = lazy(() =>
  import('../pages/ProjectDetailPage.jsx').then((module) => ({
    default: module.ProjectDetailPage,
  })),
);
const JobPostingDetailPage = lazy(() =>
  import('../pages/JobPostingDetailPage.jsx').then((module) => ({
    default: module.JobPostingDetailPage,
  })),
);
export function AppRoutes({ projects, navigate, onOpenProject, onEditProject }) {
  return (
    <Suspense
      fallback={
        <div role="status" className="p-6">
          กำลังโหลด…
        </div>
      }
    >
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
    </Suspense>
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
