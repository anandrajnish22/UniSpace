import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const event = await prisma.event.create({
      data: {
        ...data,
        organizerId: userId,
      }
    });

    res.status(201).json(successResponse('Event created successfully', { event }));
  } catch (error) {
    next(error);
  }
};

export const getEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, search, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.EventWhereInput = { status: 'PUBLISHED' };

    if (category && category !== '') where.category = category;
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { venue: { contains: search } }
      ];
    }

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        where,
        include: {
          _count: { select: { registrations: true } }
        },
        orderBy: { date: 'asc' },
        skip,
        take: limitNum
      }),
      prisma.event.count({ where })
    ]);

    res.json(successResponse('Events fetched successfully', {
      events,
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

export const getEventById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: { select: { id: true, name: true, profile: { select: { avatar: true } } } }
          }
        },
        _count: { select: { registrations: true } }
      }
    });

    if (!event) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Event fetched successfully', { event }));
  } catch (error) {
    next(error);
  }
};

export const rsvpEvent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const eventId = req.params.eventId as string;

    const event = await prisma.event.findUnique({ 
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } }
    });

    if (!event) {
      throw new AppError('Event not found', 404, 'NOT_FOUND');
    }

    if (event.capacity && event._count.registrations >= event.capacity) {
      throw new AppError('Event is at full capacity', 400, 'BAD_REQUEST');
    }

    const existingRsvp = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: { eventId, userId }
      }
    });

    if (existingRsvp) {
      // Cancel RSVP
      await prisma.eventRegistration.delete({
        where: {
          eventId_userId: { eventId, userId }
        }
      });
      return res.json(successResponse('RSVP cancelled successfully', { rsvpStatus: false }));
    }

    const rsvp = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId,
        qrCode: `QR-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        status: 'CONFIRMED'
      }
    });

    res.status(201).json(successResponse('RSVP successful', { rsvpStatus: true, rsvp }));
  } catch (error) {
    next(error);
  }
};
