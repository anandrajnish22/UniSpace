import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const createListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'STUDENT') {
      throw new AppError('Only students can post marketplace listings', 403, 'FORBIDDEN');
    }

    const listing = await prisma.listing.create({
      data: {
        ...data,
        sellerId: userId,
      }
    });

    res.status(201).json(successResponse('Listing created successfully', { listing }));
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, condition, search, minPrice, maxPrice, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.ListingWhereInput = { status: 'ACTIVE' };

    if (category && category !== '') where.category = category;
    if (condition && condition !== '') where.condition = condition;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: {
          seller: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
          images: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.listing.count({ where })
    ]);

    res.json(successResponse('Listings fetched successfully', {
      listings,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum)
      }
    }));
  } catch (error) {
    next(error);
  }
};

export const getListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        seller: { select: { id: true, name: true, profile: true } },
        images: true,
      }
    });

    if (!listing) {
      throw new AppError('Listing not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Listing fetched successfully', { listing }));
  } catch (error) {
    next(error);
  }
};

export const makeOffer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const buyerId = (req as any).user.userId;
    const listingId = req.params.listingId as string;
    const { amount, message } = req.body;

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });
    
    if (!listing || listing.status !== 'ACTIVE') {
      throw new AppError('Listing is no longer available', 400, 'BAD_REQUEST');
    }

    if (listing.sellerId === buyerId) {
      throw new AppError('You cannot make an offer on your own listing', 400, 'BAD_REQUEST');
    }

    const offer = await prisma.offer.create({
      data: {
        listingId,
        buyerId,
        amount,
        message
      }
    });

    res.status(201).json(successResponse('Offer sent successfully', { offer }));
  } catch (error) {
    next(error);
  }
};
