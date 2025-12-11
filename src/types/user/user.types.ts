export interface User {
  id: number;
  namaUser: string;
  email: string;
  telephoneNumber?: string;
  role: "user" | "admin" | "moderator" | string;
  //   isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
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
