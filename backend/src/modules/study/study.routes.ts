import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createStudyResourceSchema, createStudyGroupSchema, getStudyResourcesQuerySchema } from './study.schema';
import * as studyController from './study.controller';

const router = Router();

// Public routes
router.get('/resources', validate(getStudyResourcesQuerySchema, 'query'), studyController.getResources);
router.get('/groups', studyController.getGroups);

// Protected routes
router.use(requireAuth);

router.post('/resources', validate(createStudyResourceSchema), studyController.createResource);
router.post('/resources/:id/download', studyController.incrementDownloads);

router.post('/groups', validate(createStudyGroupSchema), studyController.createGroup);
router.post('/groups/:groupId/join', studyController.toggleJoinGroup);

export default router;
