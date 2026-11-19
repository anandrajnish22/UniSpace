import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { successResponse } from '../../utils/response';
import { AppError } from '../../utils/errors';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';

const prisma = new PrismaClient();

// Helper to set refresh token in cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new AppError('Email already in use', 400, 'BAD_REQUEST');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and associated profile/company within transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
        },
      });

      if (role === 'STUDENT') {
        await tx.profile.create({
          data: { userId: newUser.id },
        });
      } else if (role === 'COMPANY' && companyName) {
        await tx.company.create({
          data: { userId: newUser.id, name: companyName },
        });
      }

      return newUser;
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    
    setRefreshTokenCookie(res, refreshToken);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };

    res.status(201).json(successResponse('Registration successful', { user: userResponse, accessToken }));
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { profile: true, company: true }
    });
    
    if (!user) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401, 'UNAUTHORIZED');
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);
    
    setRefreshTokenCookie(res, refreshToken);

    let profileImage = null;
    if (user.role === 'STUDENT' && user.profile) {
      profileImage = user.profile.avatar;
    } else if (user.role === 'COMPANY' && user.company) {
      profileImage = user.company.logo;
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage
    };

    res.json(successResponse('Login successful', { user: userResponse, accessToken }));
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get refresh token from cookie
    const authHeader = req.headers.cookie;
    const refreshToken = authHeader?.split('; ').find(row => row.startsWith('refreshToken='))?.split('=')[1];

    if (!refreshToken) {
      throw new AppError('No refresh token provided', 401, 'UNAUTHORIZED');
    }

    const decoded = verifyRefreshToken(refreshToken);
    
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) {
      throw new AppError('User not found', 401, 'UNAUTHORIZED');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    const newRefreshToken = generateRefreshToken(user.id);

    setRefreshTokenCookie(res, newRefreshToken);

    res.json(successResponse('Token refreshed', { accessToken: newAccessToken }));
  } catch (error) {
    next(error);
  }
};

export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json(successResponse('Logged out successfully'));
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user.userId;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, company: true }
    });

    if (!user) {
      throw new AppError('User not found', 404, 'NOT_FOUND');
    }

    let profileImage = null;
    let university = null;

    if (user.role === 'STUDENT' && user.profile) {
      profileImage = user.profile.avatar;
      university = user.profile.university;
    } else if (user.role === 'COMPANY' && user.company) {
      profileImage = user.company.logo;
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage,
      university
    };

    res.json(successResponse('User fetched successfully', { user: userResponse }));
  } catch (error) {
    next(error);
  }
};
