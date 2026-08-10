import { z } from 'zod';

export const createConversationSchema = z.object({
  body: z.object({
    userId: z.string().uuid(),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message cannot be empty'),
  }),
});
