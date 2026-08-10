import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

// ── 1. Analytics ────────────────────────────────────────────────
export const getAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await prisma.user.count();
    const activeJobs = await prisma.job.count({ where: { isActive: true } });
    const totalListings = await prisma.listing.count({ where: { status: 'ACTIVE' } });
    const activeReports = await prisma.report.count({ where: { status: 'PENDING' } });

    res.json(successResponse('Analytics retrieved', {
      totalUsers,
      activeJobs,
      totalListings,
      activeReports,
    }));
  } catch (error) {
    next(error);
  }
};

// ── 2. Users Management ─────────────────────────────────────────
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isSuspended: true,
        isBanned: true,
        createdAt: true,
        profile: { select: { university: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 100, // simplify pagination for now
    });

    res.json(successResponse('Users retrieved', users));
  } catch (error) {
    next(error);
  }
};

export const updateUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { action } = req.body; // 'SUSPEND', 'UNSUSPEND', 'BAN', 'UNBAN'

    let updateData = {};
    if (action === 'SUSPEND') updateData = { isSuspended: true };
    else if (action === 'UNSUSPEND') updateData = { isSuspended: false };
    else if (action === 'BAN') updateData = { isBanned: true };
    else if (action === 'UNBAN') updateData = { isBanned: false };
    else throw new AppError('Invalid action', 'BAD_REQUEST', 400);

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, name: true, isSuspended: true, isBanned: true },
    });

    res.json(successResponse(`User ${action.toLowerCase()}ed successfully`, user));
  } catch (error) {
    next(error);
  }
};

// ── 3. Reports Moderation ───────────────────────────────────────
export const getReports = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reports = await prisma.report.findMany({
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        reportedUser: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json(successResponse('Reports retrieved', reports));
  } catch (error) {
    next(error);
  }
};

export const updateReportStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body; // 'REVIEWED', 'RESOLVED', 'DISMISSED'

    const report = await prisma.report.update({
      where: { id },
      data: { status },
    });

    res.json(successResponse('Report status updated', report));
  } catch (error) {
    next(error);
  }
};
