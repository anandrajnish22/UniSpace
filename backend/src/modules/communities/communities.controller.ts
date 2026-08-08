import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const community = await prisma.community.create({
      data: {
        ...data,
        members: {
          create: {
            userId,
            role: 'ADMIN'
          }
        }
      }
    });

    res.status(201).json(successResponse('Community created successfully', { community }));
  } catch (error) {
    next(error);
  }
};

export const getCommunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { search, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.CommunityWhereInput = {};

    if (search && search !== '') {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } }
      ];
    }

    const [communities, total] = await Promise.all([
      prisma.community.findMany({
        where,
        include: {
          _count: { select: { members: true, posts: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.community.count({ where })
    ]);

    res.json(successResponse('Communities fetched successfully', {
      communities,
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

export const getCommunityById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    const community = await prisma.community.findUnique({
      where: { id },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, profile: { select: { avatar: true } } } }
          }
        },
        posts: {
          include: {
            author: { select: { id: true, name: true, profile: { select: { avatar: true } } } },
            _count: { select: { comments: true, likes: true } }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: { select: { members: true, posts: true } }
      }
    });

    if (!community) {
      throw new AppError('Community not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Community fetched successfully', { community }));
  } catch (error) {
    next(error);
  }
};

export const toggleJoinCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const communityId = req.params.communityId as string;

    const community = await prisma.community.findUnique({ where: { id: communityId } });
    if (!community) {
      throw new AppError('Community not found', 404, 'NOT_FOUND');
    }

    const existingMember = await prisma.communityMember.findUnique({
      where: {
        communityId_userId: { communityId, userId }
      }
    });

    if (existingMember) {
      // Leave
      await prisma.communityMember.delete({
        where: {
          communityId_userId: { communityId, userId }
        }
      });
      return res.json(successResponse('Left community successfully', { isMember: false }));
    }

    // Join
    const member = await prisma.communityMember.create({
      data: {
        communityId,
        userId,
        role: 'MEMBER'
      }
    });

    res.status(201).json(successResponse('Joined community successfully', { isMember: true, member }));
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const communityId = req.params.communityId as string;
    const { title, content, type } = req.body;

    const post = await prisma.post.create({
      data: {
        communityId,
        userId,
        title,
        content,
        type: type || 'DISCUSSION'
      },
      include: {
        author: { select: { id: true, name: true, profile: { select: { avatar: true } } } }
      }
    });

    res.status(201).json(successResponse('Post created successfully', { post }));
  } catch (error) {
    next(error);
  }
};
