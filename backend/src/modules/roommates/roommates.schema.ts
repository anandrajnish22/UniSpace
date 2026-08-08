import { z } from 'zod';

export const createRoomListingSchema = z.object({
  type: z.enum(['ROOMMATE', 'PG', 'FLAT', 'HOSTEL', 'BED']).default('PG'),
  location: z.string().min(2, 'Location is required'),
  rentAmount: z.coerce.number().min(0, 'Rent amount must be non-negative'),
  depositAmount: z.coerce.number().min(0).optional(),
  availableFrom: z.string().datetime(),
  description: z.string().min(10, 'Description is too short'),
  genderPref: z.enum(['ANY', 'MALE', 'FEMALE']).default('ANY'),
  amenities: z.string().optional(),
});

export const getRoomListingsQuerySchema = z.object({
  type: z.enum(['ROOMMATE', 'PG', 'FLAT', 'HOSTEL', 'BED']).optional().or(z.literal('')),
  genderPref: z.enum(['ANY', 'MALE', 'FEMALE']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  maxRent: z.coerce.number().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});
