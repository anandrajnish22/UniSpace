import { z } from 'zod';

export const createEventSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  venue: z.string().min(2, 'Venue is required'),
  category: z.enum(['HACKATHON', 'WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'COMPETITION', 'MEETUP']),
  date: z.string().datetime(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  capacity: z.coerce.number().min(1).optional(),
  ticketPrice: z.coerce.number().min(0).default(0),
  bannerUrl: z.string().url().optional().or(z.literal('')),
});

export const getEventsQuerySchema = z.object({
  category: z.enum(['HACKATHON', 'WORKSHOP', 'SEMINAR', 'CULTURAL', 'SPORTS', 'COMPETITION', 'MEETUP']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(10),
});
