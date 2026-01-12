import type {
  BaseEntity,
  Status,
  AuditableEntity,
} from "./base.master.types.ts";

export interface Color extends AuditableEntity {
  nama: string;
  kode_warna: string;
  status: Status;
}

export interface ColorCreateInput {
  nama: string;
  kode_warna: string;
  status: Status;
}

export interface ColorUpdateInput extends Partial<ColorCreateInput> {
  id: number;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface BulkColorUpdate {
  ids: number[];
  data: Partial<ColorUpdateInput>;
}

export interface ColorQueryParams {
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
