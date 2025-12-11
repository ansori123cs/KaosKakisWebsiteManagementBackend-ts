// src/types/database/schema.types.ts
import { users } from "../../models/schema.ts";

// Infer types dari Drizzle schema
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

// Custom types dengan selection
export type UserSafe = Pick<
  User,
  "id" | "namaUser" | "email" | "role" | "createdAt"
>;
export type UserWithTokens = User & {
  accessToken?: string;
  refreshToken?: string;
};

// Query result types
export interface QueryResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
