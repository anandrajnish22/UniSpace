import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors';
import { errorResponse } from '../utils/response';
import { env } from '../config/env';

/**
 * Global error handling middleware.
 * Catches all errors thrown in route handlers and sends
 * a consistent JSON error response.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log error in development
  if (env.isDev()) {
    console.error('❌ Error:', err);
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    const response = errorResponse(
      err.message,
      err.code,
      err instanceof ValidationError ? err.details : undefined
    );
    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaErr = err as unknown as { code: string; meta?: Record<string, unknown> };
    
    switch (prismaErr.code) {
      case 'P2002': // Unique constraint violation
        res.status(409).json(
          errorResponse('Resource already exists', 'DUPLICATE_ENTRY', prismaErr.meta)
        );
        return;
      case 'P2025': // Record not found
        res.status(404).json(
          errorResponse('Resource not found', 'NOT_FOUND')
        );
        return;
      default:
        res.status(400).json(
          errorResponse('Database operation failed', 'DATABASE_ERROR')
        );
        return;
    }
  }

  // Handle Zod validation errors
  if (err.constructor.name === 'ZodError') {
    const zodErr = err as unknown as { errors: Array<{ path: (string | number)[]; message: string }> };
    res.status(422).json(
      errorResponse('Validation failed', 'VALIDATION_ERROR', zodErr.errors)
    );
    return;
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(
      errorResponse('Invalid JSON in request body', 'INVALID_JSON')
    );
    return;
  }

  // Unknown errors — don't expose details in production
  res.status(500).json(
    errorResponse(
      env.isProd() ? 'An unexpected error occurred' : err.message,
      'INTERNAL_ERROR'
    )
  );
}
