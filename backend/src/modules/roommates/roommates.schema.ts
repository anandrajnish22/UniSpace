import { z } from 'zod';

export const createRoomListingSchema = z.object({
  title: z.string().optional(),
  type: z.string().optional().default('PG'),
  location: z.string().min(2, 'Location is required'),
  rentAmount: z.coerce.number().min(0, 'Rent amount must be non-negative'),
  depositAmount: z.coerce.number().min(0).optional(),
  availableFrom: z.string().optional(),
  description: z.string().optional(),
  genderPref: z.string().optional().default('ANY'),
  amenities: z.any().optional(),
  images: z.any().optional(),
}).passthrough();

export const getRoomListingsQuerySchema = z.object({
  type: z.string().optional().or(z.literal('')),
  genderPref: z.string().optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  maxRent: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
