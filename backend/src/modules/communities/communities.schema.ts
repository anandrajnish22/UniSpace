import { z } from 'zod';

export const createCommunitySchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  description: z.string().min(10, 'Description is too short'),
  isPrivate: z.boolean().default(false),
  bannerUrl: z.string().url().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
});

export const createPostSchema = z.object({
  title: z.string().optional(),
  content: z.string().min(1, 'Post content cannot be empty'),
  type: z.enum(['DISCUSSION', 'QUESTION', 'ANNOUNCEMENT', 'RESOURCE']).default('DISCUSSION'),
});
