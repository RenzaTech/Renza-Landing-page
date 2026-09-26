import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const createError = (message: string, statusCode: number): AppError => {
  const err: AppError = new Error(message);
  err.statusCode = statusCode;
  err.isOperational = true;
  return err;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle PostgreSQL-specific errors
  const pgError = err as unknown as { code?: string; constraint?: string; detail?: string };

  if (pgError.code === '23505') {
    // unique_violation
    statusCode = 409;
    message = 'A record with this information already exists.';
    if (pgError.constraint?.includes('email')) {
      message = 'An account with this email already exists.';
    }
  } else if (pgError.code === '23503') {
    // foreign_key_violation
    statusCode = 400;
    message = 'Referenced resource does not exist.';
  } else if (pgError.code === '22P02') {
    // invalid_text_representation
    statusCode = 400;
    message = 'Invalid input format. Please check your data types.';
  } else if (pgError.code === '23502') {
    // not_null_violation
    statusCode = 400;
    message = 'A required field is missing.';
  }

  const responseBody: Record<string, unknown> = {
    success: false,
    message,
  };

  if (!env.IS_PRODUCTION) {
    responseBody['stack'] = err.stack;
    if (pgError.code) responseBody['pgCode'] = pgError.code;
    if (pgError.detail) responseBody['detail'] = pgError.detail;
  }

  res.status(statusCode).json(responseBody);
};

export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route not found`,
  });
};
