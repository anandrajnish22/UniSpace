import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../config/db';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth';

export const getRecommendations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    // 1. Fetch user's profile and skills to base recommendations on
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: { select: { skillId: true } },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userSkillIds = user.skills.map((s: any) => s.skillId);
    const university = user.profile?.university;
    const course = user.profile?.course;

    // 2. Recommend Jobs based on overlapping skills
    // We fetch recent jobs and calculate overlap score (simplified logic for now)
    const recentJobs = await prisma.job.findMany({
      where: { isActive: true },
      include: {
        skills: true,
        company: { select: { name: true, logo: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const recommendedJobs = recentJobs
      .map((job: any) => {
        const jobSkillIds = job.skills.map((s: any) => s.skillId);
        const matchCount = jobSkillIds.filter((id: string) => userSkillIds.includes(id)).length;
        return { ...job, matchScore: matchCount };
      })
      .sort((a: any, b: any) => b.matchScore - a.matchScore) // Highest match first
      .slice(0, 3) // Top 3
      .map(({ skills, matchScore, ...job }: any) => job);

    // 3. Recommend Connections (Users from same university/course)
    let recommendedUsers = await prisma.user.findMany({
      where: {
        id: { not: userId },
        isBanned: false,
        profile: {
          OR: [
            { university: university || 'UNKNOWN_UNIVERSITY_NO_MATCH' },
            { course: course || 'UNKNOWN_COURSE_NO_MATCH' },
          ],
        },
      },
      select: {
        id: true,
        name: true,
        role: true,
        profile: { select: { avatar: true, university: true, course: true } },
      },
      take: 3,
    });

    // Fallback if no university match: just get latest active users
    if (recommendedUsers.length === 0) {
      recommendedUsers = await prisma.user.findMany({
        where: { id: { not: userId }, isBanned: false },
        select: {
          id: true,
          name: true,
          role: true,
          profile: { select: { avatar: true, university: true, course: true } },
        },
        orderBy: { lastLoginAt: 'desc' },
        take: 3,
      });
    }

    // 4. Recommend Events (Upcoming events)
    const upcomingEvents = await prisma.event.findMany({
      where: {
        status: 'PUBLISHED',
        date: { gte: new Date() },
      },
      select: {
        id: true,
        title: true,
        date: true,
        category: true,
        bannerUrl: true,
      },
      orderBy: { date: 'asc' },
      take: 3,
    });

    res.json(successResponse('Recommendations fetched successfully', {
      jobs: recommendedJobs,
      connections: recommendedUsers,
      events: upcomingEvents,
    }));
  } catch (error) {
    next(error);
  }
};
