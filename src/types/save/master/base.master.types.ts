export interface BaseEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
}

// Base entity dengan audit trail
export interface AuditableEntity extends BaseEntity {
  createdBy?: number;
  updatedBy?: number;
  isDeleted?: boolean;
  deletedAt?: Date;
}

// Status enums umum
const STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  PENDING: 2,
  DELETED: -1,
} as const;

export type Status = (typeof STATUS)[keyof typeof STATUS];

const RECORDSTATUS = {
  DRAFT: "draft",
  PENDING_REVIEW: "pending_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  ARCHIVED: "archived",
} as const;

export type RecordStatus = (typeof RECORDSTATUS)[keyof typeof RECORDSTATUS];

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
