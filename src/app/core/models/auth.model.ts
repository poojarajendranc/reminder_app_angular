export interface RegisterRequest {
  username: string;
  mobile: string;
  password: string;
}

export interface LoginRequest {
  login: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  mobile: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface ApiResponse<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data: T;
}
