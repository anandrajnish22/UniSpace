import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { updateProfileSchema, addSkillSchema } from './profile.schema';
import * as profileController from './profile.controller';

const router = Router();

// Public routes
router.get('/skills', profileController.getAvailableSkills);
router.get('/:userId', profileController.getPublicProfile);

// Protected routes
router.use(requireAuth);

router.get('/me/details', profileController.getMyProfile);
router.put('/me', validate(updateProfileSchema), profileController.updateProfile);

router.post('/skills', validate(addSkillSchema), profileController.addSkill);
router.delete('/skills/:skillId', profileController.removeSkill);

export default router;
