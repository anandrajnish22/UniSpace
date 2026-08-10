import { Suspense, lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// ── Eagerly Loaded Entry Points ─────────────────────────────────
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { AdminRoute } from '@/components/layout/AdminRoute';
import { AdminLayout } from '@/components/layout/AdminLayout';

// ── Lazy Loading Helper ─────────────────────────────────────────
const Loadable = (Component: any) => (props: any) => (
  <Suspense fallback={<div className="flex h-screen w-full items-center justify-center bg-gray-50/50 backdrop-blur-sm"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
    <Component {...props} />
  </Suspense>
);

// ── Lazy Loaded Pages ───────────────────────────────────────────
const DashboardPage = Loadable(lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage }))));
const ProfileSetupPage = Loadable(lazy(() => import('@/pages/onboarding/ProfileSetupPage').then(m => ({ default: m.ProfileSetupPage }))));
const PublicProfilePage = Loadable(lazy(() => import('@/pages/profile/PublicProfilePage').then(m => ({ default: m.PublicProfilePage }))));
const JobsPage = Loadable(lazy(() => import('@/pages/jobs/JobsPage').then(m => ({ default: m.JobsPage }))));
const JobDetailPage = Loadable(lazy(() => import('@/pages/jobs/JobDetailPage').then(m => ({ default: m.JobDetailPage }))));
const MarketplacePage = Loadable(lazy(() => import('@/pages/marketplace/MarketplacePage').then(m => ({ default: m.MarketplacePage }))));
const ListingDetailPage = Loadable(lazy(() => import('@/pages/marketplace/ListingDetailPage').then(m => ({ default: m.ListingDetailPage }))));
const EventsPage = Loadable(lazy(() => import('@/pages/events/EventsPage').then(m => ({ default: m.EventsPage }))));
const EventDetailPage = Loadable(lazy(() => import('@/pages/events/EventDetailPage').then(m => ({ default: m.EventDetailPage }))));
const CommunitiesPage = Loadable(lazy(() => import('@/pages/communities/CommunitiesPage').then(m => ({ default: m.CommunitiesPage }))));
const CommunityDetailPage = Loadable(lazy(() => import('@/pages/communities/CommunityDetailPage').then(m => ({ default: m.CommunityDetailPage }))));
const StudyPage = Loadable(lazy(() => import('@/pages/study/StudyPage').then(m => ({ default: m.StudyPage }))));
const RoommatesPage = Loadable(lazy(() => import('@/pages/roommates/RoommatesPage').then(m => ({ default: m.RoommatesPage }))));
const MessagesPage = Loadable(lazy(() => import('@/pages/messages/MessagesPage').then(m => ({ default: m.MessagesPage }))));
const NotificationsPage = Loadable(lazy(() => import('@/pages/notifications/NotificationsPage').then(m => ({ default: m.NotificationsPage }))));

// Admin Pages
const AdminDashboardPage = Loadable(lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage }))));
const AdminUsersPage = Loadable(lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage }))));
const AdminReportsPage = Loadable(lazy(() => import('@/pages/admin/AdminReportsPage').then(m => ({ default: m.AdminReportsPage }))));


/**
 * Application router configuration.
 * Using lazy loading for optimized chunking and performance.
 */
export const router = createBrowserRouter([
  // ── Public Routes ─────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // ── Protected Routes ──────────────────────────────────
  {
    path: '/',
    element: <ProtectedRoute />,
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
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'reports', element: <AdminReportsPage /> },
    ],
  },
]);
