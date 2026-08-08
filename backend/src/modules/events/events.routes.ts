import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { requireAuth } from '../../middleware/auth';
import { createEventSchema, getEventsQuerySchema } from './events.schema';
import * as eventsController from './events.controller';

const router = Router();

// Public routes (anyone can view events)
router.get('/', validate(getEventsQuerySchema, 'query'), eventsController.getEvents);
router.get('/:id', eventsController.getEventById);

// Protected routes
router.use(requireAuth);

router.post('/', validate(createEventSchema), eventsController.createEvent);
router.post('/:eventId/rsvp', eventsController.rsvpEvent);

export default router;
