import { z } from 'zod';

export const createConversationSchema = z.object({
  userId: z.string().uuid(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
});
