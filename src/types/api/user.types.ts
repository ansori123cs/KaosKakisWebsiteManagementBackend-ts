// src/types/user/user.types.ts
export interface User {
  id: number;
  name: string;
  email: string;
  telephoneNumber?: string;
  role: "user" | "admin" | "moderator";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  telephoneNumber?: string;
  role: string;
  createdAt: Date;
}

export interface UpdateUserRequest {
  name?: string;
  telephoneNumber?: string;
  password?: string;
}

// Types untuk database operations
export type UserCreateInput = Omit<User, "id" | "createdAt" | "updatedAt">;
export type UserUpdateInput = Partial<UserCreateInput>;
