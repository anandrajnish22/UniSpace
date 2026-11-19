import { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, useRouteError } from 'react-router-dom';

// ── Eagerly Loaded Core Entry Points ─────────────────────────────
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { NotificationsPage } from '@/pages/notifications/NotificationsPage';
import { MessagesPage } from '@/pages/messages/MessagesPage';
import { RoommatesPage } from '@/pages/roommates/RoommatesPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminRoute } from '@/components/layout/AdminRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

// ── Error Boundary with Auto-Reload on Stale Deployments ────────
export const RouteErrorBoundary = () => {
  const error: any = useRouteError();

  useEffect(() => {
    const isChunkError =
      error?.message?.includes('Failed to fetch dynamically imported module') ||
      error?.message?.includes('dynamically imported module') ||
      error?.name === 'ChunkLoadError';

    if (isChunkError) {
      console.warn('Chunk loading failed due to new deployment. Reloading...');
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white p-6 text-center">
      <div className="w-16 h-16 rounded-full bg-primary-500/20 border border-primary-500/30 flex items-center justify-center text-primary-400 mb-4 text-2xl font-bold">
        !
      </div>
      <h2 className="text-2xl font-bold font-display mb-2">New Update Available</h2>
      <p className="text-white/60 max-w-md mb-6 text-sm">
        A new version of UniSpace was deployed. Please refresh the page to continue.
      </p>
      <button
        onClick={() => {
          window.sessionStorage.removeItem('chunk_retry_refreshed');
          window.location.reload();
        }}
        className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-amber-500 hover:from-primary-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-glow transition-all"
      >
        Refresh Application
      </button>
    </div>
  );
};

// ── Lazy Loading Helper with Deployment Retry ────────────────────
const lazyWithRetry = (componentImport: () => Promise<any>) =>
  lazy(async () => {
    const pageHasBeenForceRefreshed =
      window.sessionStorage.getItem('chunk_retry_refreshed') === 'true';

    try {
      const component = await componentImport();
      window.sessionStorage.setItem('chunk_retry_refreshed', 'false');
      return component;
    } catch (error: any) {
      if (
        !pageHasBeenForceRefreshed &&
        (error?.message?.includes('Failed to fetch dynamically imported module') ||
          error?.message?.includes('dynamically imported module') ||
          error?.name === 'ChunkLoadError')
      ) {
        window.sessionStorage.setItem('chunk_retry_refreshed', 'true');
        window.location.reload();
        return new Promise(() => {}); // Wait for reload
      }
      throw error;
    }
  });

const Loadable = (Component: any) => (props: any) => (
  <Suspense
    fallback={
      <div className="flex h-screen w-full items-center justify-center bg-transparent backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
      </div>
    }
  >
    <Component {...props} />
  </Suspense>
);

// ── Lazy Loaded Secondary Pages ──────────────────────────────────
const ProfileSetupPage = Loadable(lazyWithRetry(() => import('@/pages/onboarding/ProfileSetupPage').then(m => ({ default: m.ProfileSetupPage }))));
const PublicProfilePage = Loadable(lazyWithRetry(() => import('@/pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage }))));
const JobsPage = Loadable(lazyWithRetry(() => import('@/pages/jobs/JobsPage').then(m => ({ default: m.JobsPage }))));
const JobDetailPage = Loadable(lazyWithRetry(() => import('@/pages/jobs/JobDetailPage').then(m => ({ default: m.JobDetailPage }))));
const MarketplacePage = Loadable(lazyWithRetry(() => import('@/pages/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage }))));
const ListingDetailPage = Loadable(lazyWithRetry(() => import('@/pages/marketplace/ListingDetailPage').then(m => ({ default: m.ListingDetailPage }))));
const EventsPage = Loadable(lazyWithRetry(() => import('@/pages/events/EventsPage').then(m => ({ default: m.EventsPage }))));
const EventDetailPage = Loadable(lazyWithRetry(() => import('@/pages/events/EventDetailPage').then(m => ({ default: m.EventDetailPage }))));
const CommunitiesPage = Loadable(lazyWithRetry(() => import('@/pages/communities/CommunitiesPage').then(m => ({ default: m.CommunitiesPage }))));
const CommunityDetailPage = Loadable(lazyWithRetry(() => import('@/pages/communities/CommunityDetailPage').then(m => ({ default: m.CommunityDetailPage }))));
const StudyPage = Loadable(lazyWithRetry(() => import('@/pages/study/StudyPage').then(m => ({ default: m.StudyPage }))));

// Admin Pages
const AdminDashboardPage = Loadable(lazyWithRetry(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage }))));
const AdminUsersPage = Loadable(lazyWithRetry(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage }))));
const AdminReportsPage = Loadable(lazyWithRetry(() => import('@/pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage }))));

/**
 * Application router configuration.
 */
export const router = createBrowserRouter([
  // ── Public Routes ─────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/login',
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
    errorElement: <RouteErrorBoundary />,
  },

  // ── Protected Routes ──────────────────────────────────
  {
    path: '/',
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'onboarding', element: <ProfileSetupPage /> },
      { path: 'profile/:id', element: <PublicProfilePage /> },
      { path: 'jobs', element: <JobsPage /> },
      { path: 'jobs/:id', element: <JobDetailPage /> },
      { path: 'marketplace', element: <MarketplacePage /> },
      { path: 'marketplace/:id', element: <ListingDetailPage /> },
      { path: 'events', element: <EventsPage /> },
      { path: 'events/:id', element: <EventDetailPage /> },
      { path: 'communities', element: <CommunitiesPage /> },
      { path: 'communities/:id', element: <CommunityDetailPage /> },
      { path: 'study', element: <StudyPage /> },
      { path: 'roommates', element: <RoommatesPage /> },
      { path: 'messages', element: <MessagesPage /> },
      { path: 'notifications', element: <NotificationsPage /> },
    ],
  },

  // ── Admin Routes ──────────────────────────────────────
  {
    path: '/admin',
    element: <AdminRoute><AdminLayout /></AdminRoute>,
    errorElement: <RouteErrorBoundary />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
    ],
  },
]);
