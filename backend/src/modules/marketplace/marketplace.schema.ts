import { z } from 'zod';

export const createListingSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  description: z.string().optional().default(''),
  price: z.coerce.number().min(0, 'Price cannot be negative'),
  category: z.string().optional().default('OTHER'),
  condition: z.string().optional().default('GOOD'),
  location: z.string().optional().default('Campus'),
  isNegotiable: z.boolean().optional().default(false),
}).passthrough();

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
