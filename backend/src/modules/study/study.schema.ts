import { z } from 'zod';

export const createStudyResourceSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  subject: z.string().optional(),
  semester: z.string().optional(),
  course: z.string().optional(),
  university: z.string().optional(),
  fileUrl: z.string().url('File URL must be a valid link'),
  fileType: z.string().optional(),
  type: z.enum(['NOTE', 'PDF', 'PREVIOUS_PAPER', 'ROADMAP', 'TUTORIAL']).default('NOTE'),
});

export const createStudyGroupSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  description: z.string().optional(),
  subject: z.string().optional(),
  isPrivate: z.boolean().default(false),
});

export const getStudyResourcesQuerySchema = z.object({
  subject: z.string().optional().or(z.literal('')),
  type: z.enum(['NOTE', 'PDF', 'PREVIOUS_PAPER', 'ROADMAP', 'TUTORIAL']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
