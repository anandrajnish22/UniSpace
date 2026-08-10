import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { successResponse } from '../../utils/response';
import { AuthRequest } from '../../middleware/auth';
import { AppError } from '../../utils/errors';
import { emitToUser } from '../../socket';
import { io } from '../../server';

const prisma = new PrismaClient();

export const getConversations = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId; // Note: req.user contains userId based on Auth payload

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: { userId },
        },
      },
      include: {
        members: {
          include: {
            user: {
              select: { id: true, name: true, profile: { select: { avatar: true } } },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const formattedConversations = conversations.map((conv: any) => {
      const otherMember = conv.members.find((m: any) => m.userId !== userId);
      return {
        id: conv.id,
        type: conv.type,
        otherUser: otherMember?.user,
        lastMessage: conv.messages[0],
        unreadCount: 0, // Simplified for now
        updatedAt: conv.updatedAt,
      };
    });

    res.json(successResponse('Conversations retrieved successfully', formattedConversations));
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    // Verify membership
    const member = await prisma.conversationMember.findUnique({
      where: {
        conversationId_userId: {
          conversationId: id,
          userId,
        },
      },
    });

    if (!member) {
      throw new AppError('Not a member of this conversation', 'FORBIDDEN', 403);
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      orderBy: { createdAt: 'asc' },
    });

    res.json(successResponse('Messages retrieved successfully', messages));
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const senderId = req.user!.userId;

    // Verify membership
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!conversation) {
      throw new AppError('Conversation not found', 'NOT_FOUND', 404);
    }

    if (!conversation.members.some((m: any) => m.userId === senderId)) {
      throw new AppError('Not a member of this conversation', 'FORBIDDEN', 403);
    }

    const message = await prisma.message.create({
      data: {
        content,
        conversationId: id,
        senderId,
      },
      include: {
        sender: {
          select: { id: true, name: true, profile: { select: { avatar: true } } },
        },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    // Emit to other members
    const otherMembers = conversation.members.filter((m: any) => m.userId !== senderId);
    otherMembers.forEach((member: any) => {
      emitToUser(io, member.userId, 'new_message', message);
    });

    res.status(201).json(successResponse('Message sent successfully', message));
  } catch (error) {
    next(error);
  }
};

export const createConversation = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { userId: otherUserId } = req.body;
    const currentUserId = req.user!.userId;

    if (otherUserId === currentUserId) {
      throw new AppError('Cannot create a conversation with yourself', 'BAD_REQUEST', 400);
    }

    // Check if conversation already exists
    const existingConv = await prisma.conversation.findFirst({
      where: {
        type: 'DIRECT',
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: otherUserId } } },
        ],
      },
    });

    if (existingConv) {
      return res.json(successResponse('Conversation already exists', existingConv));
    }

    const newConversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT',
        members: {
          create: [
            { userId: currentUserId },
            { userId: otherUserId },
          ],
        },
      },
    });

    res.status(201).json(successResponse('Conversation created successfully', newConversation));
  } catch (error) {
    next(error);
  }
};
