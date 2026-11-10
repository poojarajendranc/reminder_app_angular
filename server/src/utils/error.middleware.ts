import type {
  Request,
  Response,
  NextFunction,
} from 'express';

import { AppError } from '../utils/app-error.js';

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  const statusCode =
    err instanceof AppError ? err.statusCode : 500;

  const message =
    err instanceof AppError
      ? err.message
      : 'Internal server error';

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    data: null,
  });
}
