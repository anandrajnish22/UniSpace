import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import {
  getAnalytics,
  getUsers,
  updateUserStatus,
  getReports,
  updateReportStatus,
} from './admin.controller';

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireRole(['ADMIN']));

// Analytics
router.get('/analytics', getAnalytics);

// Users
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);

// Reports
router.get('/reports', getReports);
router.put('/reports/:id/status', updateReportStatus);

export default router;
