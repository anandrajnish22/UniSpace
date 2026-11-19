import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const createRoomListing = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const {
      title,
      description,
      location,
      rentAmount,
      depositAmount,
      availableFrom,
      type,
      genderPref,
      amenities,
      images
    } = req.body;

    // Normalize type
    let normalizedType = (type || 'PG').toUpperCase();
    if (normalizedType.includes('ROOM')) normalizedType = 'ROOMMATE';
    else if (normalizedType.includes('FLAT') || normalizedType.includes('APARTMENT')) normalizedType = 'FLAT';
    else if (normalizedType.includes('HOSTEL')) normalizedType = 'HOSTEL';
    else if (normalizedType.includes('PG')) normalizedType = 'PG';
    else if (normalizedType.includes('BED')) normalizedType = 'BED';
    else normalizedType = 'PG';

    // Normalize genderPref
    let normalizedGender = (genderPref || 'ANY').toUpperCase();
    if (normalizedGender.includes('MALE') && !normalizedGender.includes('FEMALE')) normalizedGender = 'MALE';
    else if (normalizedGender.includes('FEMALE')) normalizedGender = 'FEMALE';
    else normalizedGender = 'ANY';

    // Combine title and description gracefully
    let finalDescription = '';
    if (title && description && !description.toLowerCase().includes(title.toLowerCase())) {
      finalDescription = `${title}\n\n${description}`.trim();
    } else {
      finalDescription = description || title || 'Room listing';
    }

    let parsedDate = new Date();
    if (availableFrom) {
      const d = new Date(availableFrom);
      if (!isNaN(d.getTime())) {
        parsedDate = d;
      }
    }

    const listing = await prisma.roomListing.create({
      data: {
        type: normalizedType,
        location: location || 'Campus Area',
        rentAmount: Number(rentAmount) || 0,
        depositAmount: depositAmount ? Number(depositAmount) : undefined,
        availableFrom: parsedDate,
        description: finalDescription,
        genderPref: normalizedGender,
        amenities: typeof amenities === 'string' ? amenities : (amenities ? JSON.stringify(amenities) : undefined),
        images: typeof images === 'string' ? images : (images ? JSON.stringify(images) : undefined),
        listerId: userId,
        status: 'AVAILABLE',
      }
    });

    res.status(201).json(successResponse('Room listing created successfully', { listing }));
  } catch (error) {
    next(error);
  }
};

export const getRoomListings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, genderPref, search, maxRent, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.RoomListingWhereInput = { status: 'AVAILABLE' };

    if (type && type !== '') where.type = type;
    if (genderPref && genderPref !== '') where.genderPref = genderPref;
    if (maxRent !== undefined && maxRent !== '') where.rentAmount = { lte: parseFloat(maxRent) };
    
    if (search && search !== '') {
      where.OR = [
        { location: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [listings, total] = await Promise.all([
      prisma.roomListing.findMany({
        where,
        include: {
          lister: { select: { id: true, name: true, profile: { select: { avatar: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.roomListing.count({ where })
    ]);

    res.json(successResponse('Room listings fetched successfully', {
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

export const getRoomListingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    const listing = await prisma.roomListing.findUnique({
      where: { id },
      include: {
        lister: { select: { id: true, name: true, profile: true } }
      }
    });

    if (!listing) {
      throw new AppError('Room listing not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Room listing fetched successfully', { listing }));
  } catch (error) {
    next(error);
  }
};
