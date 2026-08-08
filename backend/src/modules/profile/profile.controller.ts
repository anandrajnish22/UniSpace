import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';

const prisma = new PrismaClient();

export const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        company: true,
        skills: {
          include: { skill: true }
        }
      }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Profile fetched successfully', { user }));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const updateData = req.body;

    // Check if user is a student
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (!user || user.role !== 'STUDENT') {
      throw new AppError('Only students can update this profile', 403, 'FORBIDDEN');
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: updateData,
    });

    res.json(successResponse('Profile updated successfully', { profile: updatedProfile }));
  } catch (error) {
    next(error);
  }
};

export const getPublicProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        role: true,
        profile: true,
        company: true,
        skills: {
          include: { skill: true }
        },
        projects: true,
        certifications: true
      }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    res.json(successResponse('Public profile fetched', { user }));
  } catch (error) {
    next(error);
  }
};

export const getAvailableSkills = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { name: 'asc' }
    });
    res.json(successResponse('Skills fetched', { skills }));
  } catch (error) {
    next(error);
  }
};

export const addSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const { skillId, proficiency } = req.body;

    const existingUserSkill = await prisma.userSkill.findUnique({
      where: {
        userId_skillId: { userId, skillId }
      }
    });

    if (existingUserSkill) {
      const updated = await prisma.userSkill.update({
        where: { userId_skillId: { userId, skillId } },
        data: { proficiency }
      });
      return res.json(successResponse('Skill updated', { userSkill: updated }));
    }

    const newSkill = await prisma.userSkill.create({
      data: { userId, skillId, proficiency }
    });

    res.json(successResponse('Skill added', { userSkill: newSkill }));
  } catch (error) {
    next(error);
  }
};

export const removeSkill = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const skillId = req.params.skillId as string;

    await prisma.userSkill.delete({
      where: {
        userId_skillId: { userId, skillId }
      }
    });

    res.json(successResponse('Skill removed successfully'));
  } catch (error) {
    next(error);
  }
};
