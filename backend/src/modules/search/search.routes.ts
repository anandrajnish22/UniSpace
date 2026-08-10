import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { globalSearch } from './search.controller';

const router = Router();

// Protect all search routes
router.use(requireAuth);

router.get('/', globalSearch);

export default router;
