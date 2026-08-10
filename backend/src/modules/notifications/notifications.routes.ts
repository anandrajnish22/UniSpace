import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from './notifications.controller';

const router = Router();

router.use(requireAuth);

router.get('/', getNotifications);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);

export default router;
