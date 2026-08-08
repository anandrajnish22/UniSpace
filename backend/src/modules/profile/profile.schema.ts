import { z } from 'zod';

export const updateProfileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  university: z.string().optional(),
  department: z.string().optional(),
  graduationYear: z.number().min(2000).max(2100).optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  linkedinUrl: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  portfolioUrl: z.string().url('Invalid Portfolio URL').optional().or(z.literal('')),
  avatar: z.string().optional(), // base64 or URL for now
});

export const addSkillSchema = z.object({
  skillId: z.string().uuid(),
  proficiency: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']).default('INTERMEDIATE'),
});
