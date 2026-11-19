import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().optional().default(''),
  venue: z.string().optional().default('Campus'),
  category: z.string().optional().default('WORKSHOP'),
  date: z.string().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  capacity: z.coerce.number().optional().default(100),
  ticketPrice: z.coerce.number().min(0).optional().default(0),
  bannerUrl: z.string().optional().or(z.literal('')),
}).passthrough();

export const getEventsQuerySchema = z.object({
  category: z.enum(['HACKATHON', 'WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'COMPETITION', 'MEETUP']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
