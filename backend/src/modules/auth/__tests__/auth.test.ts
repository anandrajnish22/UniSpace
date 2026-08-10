import request from 'supertest';
import express from 'express';
import { prisma } from '../../../config/db';
import authRoutes from '../auth.routes';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock Prisma
jest.mock('../../../config/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    profile: {
      create: jest.fn(),
    },
  },
}));

// Setup Express app for testing
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Error handler to prevent console noise during testing
app.use((err: any, req: any, res: any, next: any) => {
  res.status(err.statusCode || 500).json({ error: err.message });
});

describe('Auth Module API', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      // Setup mocks
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null); // Email not taken
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        role: 'STUDENT',
      });
      (prisma.profile.create as jest.Mock).mockResolvedValue({});
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123!',
          role: 'STUDENT',
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Test User');
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail if email is already taken', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({ id: 'existing-id' }); // Email taken
      
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Existing User',
          email: 'test@example.com',
          password: 'Password123!',
          role: 'STUDENT',
        });

      expect(res.status).toBe(400); // Bad Request / CustomError
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully with correct credentials', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        isSuspended: false,
        isBanned: false,
      });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('accessToken');
    });

    it('should fail with incorrect password', async () => {
      const hashedPassword = await bcrypt.hash('Password123!', 10);
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: 'test-user-id',
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'STUDENT',
        isSuspended: false,
        isBanned: false,
      });
      
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(res.status).toBe(401); // UNAUTHORIZED
    });
  });
});
