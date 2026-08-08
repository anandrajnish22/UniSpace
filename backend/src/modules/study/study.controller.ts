import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

// --- Study Resources ---
export const createResource = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const resource = await prisma.studyResource.create({
      data: {
        ...data,
        uploaderId: userId,
      }
    });

    res.status(201).json(successResponse('Study resource uploaded successfully', { resource }));
  } catch (error) {
    next(error);
  }
};

export const getResources = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { subject, type, search, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 12;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.StudyResourceWhereInput = {};

    if (subject && subject !== '') where.subject = { contains: subject };
    if (type && type !== '') where.type = type;
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { subject: { contains: search } },
        { course: { contains: search } }
      ];
    }

    const [resources, total] = await Promise.all([
      prisma.studyResource.findMany({
        where,
        include: {
          uploader: { select: { id: true, name: true, profile: { select: { avatar: true } } } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.studyResource.count({ where })
    ]);

    res.json(successResponse('Resources fetched successfully', {
      resources,
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

export const incrementDownloads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    
    const resource = await prisma.studyResource.update({
      where: { id },
      data: { downloads: { increment: 1 } }
    });

    res.json(successResponse('Resource download count updated', { downloads: resource.downloads }));
  } catch (error) {
    next(error);
  }
};

// --- Study Groups ---
export const createGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const data = req.body;

    const group = await prisma.studyGroup.create({
      data: {
        ...data,
        members: {
          create: {
            userId,
            role: 'LEADER'
          }
        }
      }
    });

    res.status(201).json(successResponse('Study group created successfully', { group }));
  } catch (error) {
    next(error);
  }
};

export const getGroups = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const groups = await prisma.studyGroup.findMany({
      include: {
        _count: { select: { members: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(successResponse('Study groups fetched successfully', { groups }));
  } catch (error) {
    next(error);
  }
};

export const toggleJoinGroup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const studyGroupId = req.params.groupId as string;

    const existing = await prisma.studyGroupMember.findUnique({
      where: {
        studyGroupId_userId: { studyGroupId, userId }
      }
    });

    if (existing) {
      await prisma.studyGroupMember.delete({
        where: {
          studyGroupId_userId: { studyGroupId, userId }
        }
      });
      return res.json(successResponse('Left study group', { isMember: false }));
    }

    const member = await prisma.studyGroupMember.create({
      data: {
        studyGroupId,
        userId,
        role: 'MEMBER'
      }
    });

    res.status(201).json(successResponse('Joined study group', { isMember: true, member }));
  } catch (error) {
    next(error);
  }
};
