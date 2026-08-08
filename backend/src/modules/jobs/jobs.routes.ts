import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createJobSchema, getJobsQuerySchema, applyJobSchema } from './jobs.schema';
import * as jobsController from './jobs.controller';

const router = Router();

// Public routes (anyone can view jobs)
router.get('/', validate(getJobsQuerySchema, 'query'), jobsController.getJobs);
router.get('/:id', jobsController.getJobById);

// Protected routes
router.use(requireAuth);

// Company routes
router.post('/', validate(createJobSchema), jobsController.createJob);

// Student routes
router.post('/:jobId/apply', validate(applyJobSchema), jobsController.applyForJob);

export default router;
