import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import {
  createUser,
  findUserByLogin,
  findUserByUsernameOrMobile,
} from '../repositories/auth.repository.js';
import { AppError } from '../utils/app-error.js';

interface RegisterInput {
  username: string;
  mobile: string;
  password: string;
}

interface LoginInput {
  login: string;
  password: string;
}

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

  const token = jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    jwtSecret,
    {
      expiresIn: '1d',
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      mobile: user.mobile,
    },
  };
}