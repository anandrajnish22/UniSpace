import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createListingSchema, getListingsQuerySchema, makeOfferSchema } from './marketplace.schema';
import * as marketplaceController from './marketplace.controller';

const router = Router();

// Public routes (anyone can view listings)
router.get('/', validate(getListingsQuerySchema, 'query'), marketplaceController.getListings);
router.get('/:id', marketplaceController.getListingById);

// Protected routes
router.use(requireAuth);

router.post('/', validate(createListingSchema), marketplaceController.createListing);
router.post('/:listingId/offers', validate(makeOfferSchema), marketplaceController.makeOffer);

export default router;
