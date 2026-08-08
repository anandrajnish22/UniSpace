import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Prisma } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const createJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { skills, ...jobData } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { company: true }
    });

    if (!user || user.role !== 'COMPANY' || !user.company) {
      throw new AppError('Only companies can post jobs', 403, 'FORBIDDEN');
    }

    const job = await prisma.job.create({
      data: {
        ...jobData,
        companyId: user.company.id,
        skills: skills ? {
          create: skills.map((skillId: string) => ({ skillId }))
        } : undefined
      },
      include: {
        skills: { include: { skill: true } }
      }
    });

    res.status(201).json(successResponse('Job posted successfully', { job }));
  } catch (error) {
    next(error);
  }
};

export const getJobs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { type, workMode, search, page, limit } = req.query as any;
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;

    const where: Prisma.JobWhereInput = { isActive: true };

    if (type && type !== '') where.type = type;
    if (workMode && workMode !== '') where.workMode = workMode;
    if (search && search !== '') {
      where.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { company: { name: { contains: search } } }
      ];
    }

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: true,
          skills: { include: { skill: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum
      }),
      prisma.job.count({ where })
    ]);

    res.json(successResponse('Jobs fetched successfully', {
      jobs,
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

export const getJobById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        skills: { include: { skill: true } }
      }
    });

    if (!job) {
      throw new AppError('Job not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Job fetched successfully', { job }));
  } catch (error) {
    next(error);
  }
};

export const applyForJob = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const jobId = req.params.jobId as string;
    const { coverLetter } = req.body;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.role !== 'STUDENT') {
      throw new AppError('Only students can apply for jobs', 403, 'FORBIDDEN');
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job || !job.isActive) {
      throw new AppError('Job is no longer available', 400, 'BAD_REQUEST');
    }

    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobId_userId: { jobId, userId }
      }
    });

    if (existingApplication) {
      throw new AppError('You have already applied for this job', 400, 'BAD_REQUEST');
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId,
        coverLetter,
        resumeUrl: '' // mocked for now
      }
    });

    res.status(201).json(successResponse('Application submitted successfully', { application }));
  } catch (error) {
    next(error);
  }
};
