import type { Request, Response, NextFunction } from 'express';

import { loginUser, registerUser } from '../services/auth.service.js';
import { errorResponse, successResponse } from '../utils/response.js';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Req body :",req.body)
    if (!req.body) {
      return errorResponse(res, 'Request body is required', 400);
    }


    await registerUser(req.body);

    return successResponse(
      res,
      'Registration successful. Please login.',
      null,
      201
    );
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    if (!req.body) {
      return errorResponse(res, 'Request body is required', 400);
    }

    const result = await loginUser(req.body);

    return successResponse(
      res,
      'Login successful',
      result
    );
  } catch (error) {
    next(error);
  }
}

