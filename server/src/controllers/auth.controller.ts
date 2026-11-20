import type { Request, Response, NextFunction } from 'express';

import { loginUser, logoutUser, refreshAccessToken, registerUser } from '../services/auth.service.js';
import { errorResponse, successResponse } from '../utils/response.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000
};

const CLEAR_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth'
};


export async function register(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    console.log("Req body :", req.body)
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
      return errorResponse(
        res,
        'Request body is required',
        400
      );
    }

    const result = await loginUser(req.body);

    // Store refresh token in an HTTP-only cookie.
    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    // Never send the refresh token in the JSON response.
    return successResponse(
      res,
      'Login successful',
      {
        token: result.accessToken,
        user: result.user
      }
    );

  } catch (error) {
    next(error);
  }
}

export async function refresh(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const currentRefreshToken =
      req.cookies?.[REFRESH_COOKIE_NAME];

    const result = await refreshAccessToken(
      currentRefreshToken
    );

    // Replace the old cookie with the rotated refresh token.
    res.cookie(
      REFRESH_COOKIE_NAME,
      result.refreshToken,
      REFRESH_COOKIE_OPTIONS
    );

    return successResponse(
      res,
      'Session refreshed successfully',
      {
        token: result.accessToken
      }
    );

  } catch (error) {
    // Remove stale or invalid refresh cookie.
    res.clearCookie(
      REFRESH_COOKIE_NAME,
      CLEAR_COOKIE_OPTIONS
    );

    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken =
      req.cookies?.[REFRESH_COOKIE_NAME];

    await logoutUser(refreshToken);

    res.clearCookie(
      REFRESH_COOKIE_NAME,
      CLEAR_COOKIE_OPTIONS
    );

    return successResponse(
      res,
      'Logged out successfully',
      null
    );

  } catch (error) {
    next(error);
  }
}



