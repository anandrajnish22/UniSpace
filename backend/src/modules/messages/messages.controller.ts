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
    const id = req.params.id as string;
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
      throw new AppError('Not a member of this conversation', 403, 'FORBIDDEN');
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: id },
      include: {
        sender: {
          select: { id: true, name: true, profile: { select: { avatar: true } } },
        },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json(successResponse('Messages retrieved successfully', messages));
  } catch (error) {
    next(error);
  }
};

export const sendMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { content } = req.body;
    const senderId = req.user!.userId;

    // Verify membership
    const conversation = await prisma.conversation.findUnique({
      where: { id },
      include: { members: true },
    }) as any;

    if (!conversation) {
      throw new AppError('Conversation not found', 404, 'NOT_FOUND');
    }

    if (!conversation.members.some((m: any) => m.userId === senderId)) {
      throw new AppError('Not a member of this conversation', 403, 'FORBIDDEN');
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

    // Smart interactive demo auto-reply for showcase
    const otherMember = otherMembers[0];
    if (otherMember) {
      setTimeout(async () => {
        try {
          const peer = await prisma.user.findUnique({
            where: { id: otherMember.userId },
            include: { profile: true }
          });
          
          if (peer && (peer.email.includes('priya') || peer.email.includes('amit'))) {
            let replyText = "Got it! Thanks for confirming. See you soon! 👍";
            const lower = (content || '').toLowerCase();
            if (lower.includes('hi') || lower.includes('hello') || lower.includes('hey')) {
              replyText = "Hey! How is your semester preparation going?";
            } else if (lower.includes('price') || lower.includes('offer') || lower.includes('deal') || lower.includes('discount')) {
              replyText = "That deal works for me. Really appreciate it!";
            } else if (lower.includes('time') || lower.includes('where') || lower.includes('meet') || lower.includes('library')) {
              replyText = "Sure! I'll be at the central library around that time.";
            } else if (lower.includes('room') || lower.includes('flat') || lower.includes('rent')) {
              replyText = "Sounds great! I'll come over to inspect the room as discussed.";
            } else if (lower.includes('okay') || lower.includes('ok') || lower.includes('sure') || lower.includes('yes')) {
              replyText = "Awesome! See you then. Have a great day! ✨";
            }

            const autoMsg = await prisma.message.create({
              data: {
                content: replyText,
                conversationId: id,
                senderId: peer.id,
              },
              include: {
                sender: {
                  select: { id: true, name: true, profile: { select: { avatar: true } } },
                },
              },
            });

            await prisma.conversation.update({
              where: { id },
              data: { updatedAt: new Date() },
            });

            emitToUser(io, senderId, 'new_message', autoMsg);
          }
        } catch (e) {
          console.error('Demo auto-reply error:', e);
        }
      }, 1500);
    }

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
      throw new AppError('Cannot create a conversation with yourself', 400, 'BAD_REQUEST');
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
