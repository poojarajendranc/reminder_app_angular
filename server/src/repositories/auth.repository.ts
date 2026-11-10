import { pool } from '../config/database.js';

export interface CreateUserData {
  username: string;
  mobile: string;
  password: string;
}

export async function findUserByUsernameOrMobile(
  username: string,
  mobile: string
) {
  const [rows] = await pool.execute(
    `SELECT id, username, mobile, password
 FROM users
     WHERE username = ? OR mobile = ?
     LIMIT 1`,
    [username, mobile]
  );

  return rows as { id: number }[];
}

export async function createUser(user: CreateUserData) {
  const [result] = await pool.execute(
    `INSERT INTO users (username, mobile, password)
     VALUES (?, ?, ?)`,
    [user.username, user.mobile, user.password]
  );

  return result;
}

export async function findUserByLogin(login: string) {
  const [rows] = await pool.execute(
    `SELECT id, username, mobile, password
     FROM users
     WHERE username = ? OR mobile = ?
     LIMIT 1`,
    [login, login]
  );

  return rows as {
    id: number;
    username: string;
    mobile: string;
    password: string;
  }[];
}
