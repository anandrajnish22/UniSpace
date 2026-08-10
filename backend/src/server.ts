import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { successResponse } from './utils/response';

// ── Create Express App ──────────────────────────────────────────
const app = express();
const httpServer = createServer(app);

// ── Security Middleware ─────────────────────────────────────────
app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

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
app.use(compression());
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
import profileRoutes from './modules/profile/profile.routes';
import jobRoutes from './modules/jobs/jobs.routes';
import marketplaceRoutes from './modules/marketplace/marketplace.routes';
import eventRoutes from './modules/events/events.routes';
import communityRoutes from './modules/communities/communities.routes';
import studyRoutes from './modules/study/study.routes';
import roommateRoutes from './modules/roommates/roommates.routes';

import conversationRoutes from './modules/messages/messages.routes';
import notificationRoutes from './modules/notifications/notifications.routes';
import adminRoutes from './modules/admin/admin.routes';
import searchRoutes from './modules/search/search.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';

app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/listings', marketplaceRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/study', studyRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/notifications', notificationRoutes);
// app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/recommendations', recommendationRoutes);

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

import { setupSocketHandlers } from './socket';

// ── Socket.IO Events (will be expanded in Sprint 11) ────────────
setupSocketHandlers(io);

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
