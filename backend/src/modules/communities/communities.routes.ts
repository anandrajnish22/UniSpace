import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createCommunitySchema, createPostSchema } from './communities.schema';
import * as communitiesController from './communities.controller';

const router = Router();

// Public routes
router.get('/', communitiesController.getCommunities);
router.get('/:id', communitiesController.getCommunityById);

// Protected routes
router.use(requireAuth);

router.post('/', validate(createCommunitySchema), communitiesController.createCommunity);
router.post('/:communityId/join', communitiesController.toggleJoinCommunity);
router.post('/:communityId/posts', validate(createPostSchema), communitiesController.createPost);

export default router;
