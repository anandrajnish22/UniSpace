import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { getRecommendations } from './recommendations.controller';

const router = Router();

// Protect all recommendation routes
router.use(requireAuth);

router.get('/', getRecommendations);

export default router;
