import { z } from 'zod';

export const createStudyResourceSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().optional(),
  subject: z.string().optional(),
  semester: z.string().optional(),
  course: z.string().optional(),
  university: z.string().optional(),
  fileUrl: z.string().optional().default('https://unispace.edu/notes/sample.pdf'),
  fileType: z.string().optional(),
  type: z.string().optional().default('NOTE'),
}).passthrough();

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
