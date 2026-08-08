import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { successResponse } from './utils/response';

// ── Create Express App ──────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// ── Socket.IO Setup ─────────────────────────────────────────────
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// ── Global Middleware ───────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ── Health Check ────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json(successResponse('UniSpace API is running', {
    status: 'healthy',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  }));
});

// ── API Routes (will be added in subsequent sprints) ────────────
import authRoutes from './modules/auth/auth.routes';
app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/jobs', jobRoutes);
// app.use('/api/listings', listingRoutes);
// app.use('/api/events', eventRoutes);
// app.use('/api/communities', communityRoutes);
// app.use('/api/resources', resourceRoutes);
// app.use('/api/rooms', roomRoutes);
// app.use('/api/conversations', conversationRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/reports', reportRoutes);
// app.use('/api/admin', adminRoutes);

// ── 404 Handler ─────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    error: { code: 'NOT_FOUND' },
  });
});

// ── Global Error Handler ────────────────────────────────────────
app.use(errorHandler);

// ── Socket.IO Events (will be expanded in Sprint 11) ────────────
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ── Start Server ────────────────────────────────────────────────
httpServer.listen(env.PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════════════╗
  ║                                                  ║
  ║   🚀 UniSpace API Server                        ║
  ║                                                  ║
  ║   Environment: ${env.NODE_ENV.padEnd(30)}  ║
  ║   Port:        ${String(env.PORT).padEnd(30)}  ║
  ║   URL:         ${env.API_URL.padEnd(30)}  ║
  ║                                                  ║
  ╚══════════════════════════════════════════════════╝
  `);
});

export { app, httpServer, io };
