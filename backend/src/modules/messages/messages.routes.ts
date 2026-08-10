import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import {
  getConversations,
  getMessages,
  sendMessage,
  createConversation,
} from './messages.controller';
import { createConversationSchema, sendMessageSchema } from './messages.schema';

const router = Router();

router.use(requireAuth);

router.get('/', getConversations);
router.post('/', validate(createConversationSchema), createConversation);
router.get('/:id/messages', getMessages);
router.post('/:id/messages', validate(sendMessageSchema), sendMessage);

export default router;
