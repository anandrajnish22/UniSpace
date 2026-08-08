import { createBrowserRouter } from 'react-router-dom';
import { LandingPage } from '@/pages/LandingPage';

import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';

import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardPage } from '@/pages/DashboardPage';
import { ProfileSetupPage } from '@/pages/onboarding/ProfileSetupPage';
import { PublicProfilePage } from '@/pages/profile/PublicProfilePage';

/**
 * Application router configuration.
 * Routes are added incrementally as each sprint is completed.
 */
export const router = createBrowserRouter([
  // ── Public Routes ─────────────────────────────────────
  {
    path: '/',
    element: <LandingPage />,
  },

  // Sprint 3: Auth routes
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },

  // Protected Routes
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'onboarding', element: <ProfileSetupPage /> },
      { path: 'profile/:id', element: <PublicProfilePage /> },
      // { path: 'jobs', element: <JobsPage /> },
      // { path: 'marketplace', element: <MarketplacePage /> },
      // { path: 'events', element: <EventsPage /> },
      // { path: 'communities', element: <CommunitiesPage /> },
      // { path: 'study', element: <StudyPage /> },
      // { path: 'roommates', element: <RoommatesPage /> },
      // { path: 'messages', element: <MessagesPage /> },
      // { path: 'notifications', element: <NotificationsPage /> },
      // { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Admin routes
  // {
  //   path: '/admin',
  //   element: <AdminRoute><AdminLayout /></AdminRoute>,
  //   children: [...],
  // },
]);
