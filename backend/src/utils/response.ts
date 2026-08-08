/**
 * Standardized API response format for UniSpace.
 * All API responses should use these helpers for consistency.
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: {
    code: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

/**
 * Create a success response
 */
export function successResponse<T>(
  message: string,
  data?: T,
  meta?: ApiResponse['meta']
): ApiResponse<T> {
  return {
    success: true,
    message,
    ...(data !== undefined && { data }),
    ...(meta && { meta }),
  };
}

/**
 * Create an error response
 */
export function errorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  details?: unknown
): ApiResponse {
  return {
    success: false,
    message,
    error: {
      code,
      ...(details !== undefined && { details }),
    },
  };
}

/**
 * Create a paginated success response
 */
export function paginatedResponse<T>(
  message: string,
  data: T[],
  page: number,
  limit: number,
  total: number
): ApiResponse<T[]> {
  return {
    success: true,
    message,
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
