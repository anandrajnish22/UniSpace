import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['STUDENT', 'COMPANY']).default('STUDENT'),
  // For Companies
  companyName: z.string().optional(),
}).refine((data) => {
  if (data.role === 'COMPANY' && !data.companyName) {
    return false;
  }
  return true;
}, {
  message: "Company name is required when role is COMPANY",
  path: ["companyName"]
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});
