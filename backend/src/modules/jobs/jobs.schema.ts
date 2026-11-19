import { z } from 'zod';

export const createJobSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  companyName: z.string().optional(),
  description: z.string().optional().default(''),
  location: z.string().optional().default('Remote'),
  type: z.string().optional().default('FULL_TIME'),
  workMode: z.string().optional().default('REMOTE'),
  salaryMin: z.coerce.number().optional(),
  salaryMax: z.coerce.number().optional(),
  experience: z.string().optional(),
  deadline: z.string().optional(),
  skills: z.array(z.string()).optional(),
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
