// src/types/master/base.types.ts

// Base entity dengan timestamps
export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

// Base entity dengan audit trail
export interface AuditableEntity extends BaseEntity {
  createdBy?: number;
  updatedBy?: number;
  deletedBy?: number;
}

// Status enums umum
export enum Status {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
  DELETED = "deleted",
}

export enum RecordStatus {
  DRAFT = "draft",
  PENDING_REVIEW = "pending_review",
  APPROVED = "approved",
  REJECTED = "rejected",
  ARCHIVED = "archived",
}

// Soft delete interface
export interface SoftDeletable {
  isDeleted: boolean;
  deletedAt?: Date;
}

// Pagination params
export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
}

// Filter options
export interface FilterOptions {
  [key: string]: any;
}

// API Response untuk list data dengan pagination
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Bulk operation types
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors?: Array<{
    id: number | string;
    error: string;
  }>;
}
