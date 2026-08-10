import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { successResponse } from '../../utils/response';

export const globalSearch = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim() === '') {
      return res.json(successResponse('Search results', {
        users: [],
        jobs: [],
        events: [],
        communities: [],
      }));
    }

    const searchTerm = q.trim();

    // Query across multiple domains concurrently
    const [users, jobs, events, communities] = await Promise.all([
      // Users
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { email: { contains: searchTerm } }
          ],
          isBanned: false,
        },
        select: {
          id: true,
          name: true,
          role: true,
          profile: { select: { avatar: true } }
        },
        take: 5,
      }),
      
      // Jobs
      prisma.job.findMany({
        where: {
          OR: [
            { title: { contains: searchTerm } },
            { company: { name: { contains: searchTerm } } }
          ],
          isActive: true,
        },
        select: {
          id: true,
          title: true,
          type: true,
          company: { select: { name: true, logo: true } }
        },
        take: 5,
      }),

      // Events
      prisma.event.findMany({
        where: {
          title: { contains: searchTerm },
          status: 'PUBLISHED',
        },
        select: {
          id: true,
          title: true,
          date: true,
          category: true,
        },
        take: 5,
      }),

      // Communities
      prisma.community.findMany({
        where: {
          name: { contains: searchTerm },
          isPrivate: false,
        },
        select: {
          id: true,
          name: true,
          avatarUrl: true,
        },
        take: 5,
      }),
    ]);

    res.json(successResponse('Search results', {
      users,
      jobs,
      events,
      communities,
    }));
  } catch (error) {
    next(error);
  }
};
