import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  companyName: z.string().optional(),
  description: z.string().min(10, 'Description is too short'),
  location: z.string().min(2, 'Location is required'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']),
  workMode: z.enum(['REMOTE', 'ONSITE', 'HYBRID']),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  experience: z.string().optional(),
  deadline: z.string().datetime().optional(), // ISO string
  skills: z.array(z.string().uuid()).optional(),
}).passthrough();

export const getJobsQuerySchema = z.object({
  type: z.enum(['FULL_TIME', 'PART_TIME', 'INTERNSHIP', 'CONTRACT']).optional().or(z.literal('')),
  workMode: z.enum(['REMOTE', 'ONSITE', 'HYBRID']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});

export const applyJobSchema = z.object({
  coverLetter: z.string().max(2000).optional(),
});
