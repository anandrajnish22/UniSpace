import { Server as SocketIOServer, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AuthenticatedSocket extends Socket {
  user?: { id: string; role: string };
}

// Global user socket map: userId -> Set of socketIds
export const userSockets = new Map<string, Set<string>>();

export const setupSocketHandlers = (io: SocketIOServer) => {
  // Middleware to authenticate socket connection
  io.use((socket: AuthenticatedSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; role: string };
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    const userId = socket.user?.id;
    if (!userId) return socket.disconnect();

    console.log(`🔌 Client connected: ${socket.id} (User: ${userId})`);

    // Add to userSockets map
    if (!userSockets.has(userId)) {
      userSockets.set(userId, new Set());
    }
    userSockets.get(userId)?.add(socket.id);

    // Join a room for this specific user to easily broadcast to all their devices
    socket.join(`user:${userId}`);

    // Join rooms for specific conversations
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
      console.log(`User ${userId} joined conversation ${conversationId}`);
    });

    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(`conversation:${conversationId}`);
      console.log(`User ${userId} left conversation ${conversationId}`);
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_typing', { userId, conversationId });
    });

    socket.on('typing_stop', ({ conversationId }) => {
      socket.to(`conversation:${conversationId}`).emit('user_stopped_typing', { userId, conversationId });
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      const userDeviceSockets = userSockets.get(userId);
      if (userDeviceSockets) {
        userDeviceSockets.delete(socket.id);
        if (userDeviceSockets.size === 0) {
          userSockets.delete(userId);
        }
      }
    });
  });
};

// Helper function to emit to a specific user
export const emitToUser = (io: SocketIOServer, userId: string, event: string, data: any) => {
  io.to(`user:${userId}`).emit(event, data);
};
