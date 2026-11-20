
import {
  createUser,
  findUserByLogin,
  findUserByUsernameOrMobile,
} from '../repositories/auth.repository.js';
import {
  createRefreshTokenRecord,
  rotateRefreshTokenRecord,
  revokeRefreshTokenFamilyByHash
} from '../repositories/refresh-token.repository.js';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { AppError } from '../utils/app-error.js';
import { createHash, randomBytes, randomUUID } from 'crypto';

interface RegisterInput {
  username: string;
  mobile: string;
  password: string;
}

interface LoginInput {
  login: string;
  password: string;
}

const ACCESS_TOKEN_LIFETIME = '15m';
const REFRESH_TOKEN_DAYS = 7;

export async function registerUser(input: RegisterInput) {
  const username = input.username.trim();
  const mobile = input.mobile.trim();

  if (!username || !mobile || !input.password) {
    throw new Error('All fields are required');
  }

  if (!/^[6-9]\d{9}$/.test(mobile)) {
    throw new Error('Invalid mobile number');
  }

  if (input.password.length < 8) {
    throw new Error('Password must contain at least 8 characters');
  }

  const existingUser = await findUserByUsernameOrMobile(
    username,
    mobile
  );

  if (existingUser.length > 0) {
    throw new Error('Username or mobile already registered');
  }

  const hashedPassword = await bcrypt.hash(input.password, 10);

  await createUser({
    username,
    mobile,
    password: hashedPassword,
  });
}

export async function loginUser(input: LoginInput) {
  const login = input.login?.trim();
  const password = input.password;

  if (!login || !password) {
    throw new AppError('Username/mobile and password are required', 400);
  }

  const users = await findUserByLogin(login);

  if (users.length === 0) {
    throw new AppError('Invalid username/mobile or password', 401);
  }

  const user = users[0];

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError('Invalid username/mobile or password', 401);
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT_SECRET is not configured');
  }

  // Generate short-lived access token.
  const accessToken = generateAccessToken({
    id: user.id,
    username: user.username
  });


  const refreshToken = randomBytes(64).toString('hex');

  const tokenHash = hashRefreshToken(refreshToken);

  const familyId = randomUUID();



  await createRefreshTokenRecord({
    userId: user.id,
    familyId,
    tokenHash,
    expiresAt: getRefreshExpiry()
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      username: user.username,
      mobile: user.mobile
    }
  };

}

export async function refreshAccessToken(
  currentRefreshToken?: string
) {
  if (!currentRefreshToken) {
    throw new AppError('Refresh token is required', 401);
  }

  const currentTokenHash = hashRefreshToken(
    currentRefreshToken
  );

  const newRefreshToken = randomBytes(64).toString('hex');

  const newTokenHash = hashRefreshToken(newRefreshToken);

  const result = await rotateRefreshTokenRecord({
    currentTokenHash,
    newTokenHash,
    newExpiresAt: getRefreshExpiry()
  });

  if (result.status !== 'rotated') {
    throw new AppError(
      result.status === 'reuse'
        ? 'Refresh token reuse detected. Please login again.'
        : 'Session expired. Please login again.',
      401
    );
  }

  const accessToken = generateAccessToken({
    id: result.userId,
    username: result.username
  });

  return {
    accessToken,
    refreshToken: newRefreshToken
  };
}

export async function logoutUser(
  refreshToken?: string
) {
  if (!refreshToken) {
    return;
  }

  const tokenHash = hashRefreshToken(refreshToken);

  await revokeRefreshTokenFamilyByHash(tokenHash);
}



function hashRefreshToken(token: string): string {
  return createHash('sha256')
    .update(token)
    .digest('hex');
}


function getRefreshExpiry(): string {
  return new Date(
    Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .slice(0, 23)
    .replace('T', ' ');
}

function generateAccessToken(user: {
  id: number;
  username: string;
}): string {
  return jwt.sign(
    {
      userId: user.id,
      username: user.username
    },
    getJwtSecret(),
    {
      expiresIn: ACCESS_TOKEN_LIFETIME
    }
  );
}


function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }

  return secret;
}






