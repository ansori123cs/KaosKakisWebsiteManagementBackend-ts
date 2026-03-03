import type {
  BaseEntity,
  Status,
  AuditableEntity,
} from "./base.master.types.js";

export interface Size extends AuditableEntity {
  nama: string;
  kode_ukuran: string;
  status: Status;
}

export interface SizeCreateInput {
  nama: string;
  kode_ukuran: string;
  status: Status;
}

export interface SizeUpdateInput extends Partial<SizeCreateInput> {
  id: number;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface BulkSizeUpdate {
  ids: number[];
  data: Partial<SizeUpdateInput>;
}

export interface SizeQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: number;
  brandId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: Status;
  isFeatured?: boolean;
  isAvailable?: boolean;
  inStock?: boolean; // stock > 0
  lowStock?: boolean; // stock <= minimumStock
  sortBy?: "name" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  tags?: string[];
}
