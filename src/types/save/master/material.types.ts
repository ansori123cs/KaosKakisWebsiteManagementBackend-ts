import type {
  BaseEntity,
  Status,
  AuditableEntity,
} from "./base.master.types";

export interface Material extends AuditableEntity {
  nama: string;
  kode_bahan: string;
  // status: Status;
  status: number;
}

export interface MaterialCreateInput {
  nama: string;
  kode_bahan: string;
  status: Status;
}

export interface MaterialUpdateInput extends Partial<MaterialCreateInput> {
  id: number;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface BulkMaterialUpdate {
  ids: number[];
  data: Partial<MaterialUpdateInput>;
}

export interface MaterialQueryParams {
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
