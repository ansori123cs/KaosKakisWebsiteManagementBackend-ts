// src/types/utils/generic.types.ts
// Generic types untuk reuse
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredBy<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

// Type untuk Object.keys dengan type safety
export type Keys<T> = Array<keyof T>;
export type ValueOf<T> = T[keyof T];

// Promise wrapper types
export type AsyncResult<T, E = Error> = Promise<{
  data?: T;
  error?: E;
  success: boolean;
}>;

// Pagination types
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Filter types
export interface FilterOptions {
  [key: string]: any;
}
