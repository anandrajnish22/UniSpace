import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().min(10, 'Description is too short'),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  category: z.enum(['BOOKS', 'ELECTRONICS', 'FURNITURE', 'CLOTHING', 'NOTES', 'OTHER']),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
  location: z.string().min(2, 'Location is required'),
  isNegotiable: z.boolean().default(false),
});

export const getListingsQuerySchema = z.object({
  category: z.enum(['BOOKS', 'ELECTRONICS', 'FURNITURE', 'CLOTHING', 'NOTES', 'OTHER']).optional().or(z.literal('')),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).optional().or(z.literal('')),
  search: z.string().optional().or(z.literal('')),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(50).default(12),
});

export const makeOfferSchema = z.object({
  amount: z.coerce.number().min(0, 'Amount cannot be negative'),
  message: z.string().max(500).optional(),
});
