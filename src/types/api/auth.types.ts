// src/types/api/auth.types.ts
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  telephone_number: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
  email?: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  role: string;
  type?: "access" | "refresh";
  iat?: number;
  exp?: number;
}
