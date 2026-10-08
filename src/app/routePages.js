const ROUTE_LOADERS = {
  projects: () => import('../pages/ProjectListPage.jsx'),
  briefs: () => import('../pages/BriefListPage.jsx'),
  briefDetail: () => import('../pages/BriefDetailPage.jsx'),
  jobPosting: () => import('../pages/JobPostingDetailPage.jsx'),
};

// Load on intent; the browser reuses the module when React opens the route.
export function preloadRoute(page) {
  ROUTE_LOADERS[page]?.().catch(() => {
    // Navigation can retry normally if an optional preload fails.
  });
}
