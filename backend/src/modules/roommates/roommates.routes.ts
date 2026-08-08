import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createRoomListingSchema, getRoomListingsQuerySchema } from './roommates.schema';
import * as roommatesController from './roommates.controller';

const router = Router();

// Public routes
router.get('/', validate(getRoomListingsQuerySchema, 'query'), roommatesController.getRoomListings);
router.get('/:id', roommatesController.getRoomListingById);

// Protected routes
router.use(requireAuth);

router.post('/', validate(createRoomListingSchema), roommatesController.createRoomListing);

export default router;
