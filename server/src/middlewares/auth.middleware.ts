import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/app-error.js';

interface AuthPayload {
  userId: number;
  username: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication token is required', 401);
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new AppError('Invalid authentication token', 401);
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'string' || !decoded.userId) {
      throw new AppError('Invalid authentication token', 401);
    }

    req.user = {
      userId: decoded.userId,
      username: decoded.username,
    };

    next();
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new AppError('Invalid or expired authentication token', 401)
    );
  }
};
