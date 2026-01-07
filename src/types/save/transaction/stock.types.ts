import { AuditableEntity, Status } from "../master/base.master.types.ts";

export interface Stock extends AuditableEntity {
  kodeVariasi: number;
  stockAmmount: number;
}

export interface StockCreateInput extends AuditableEntity {
  kodeVariasi: number;
  stockAmmount: number;
  isDeleted: boolean;
  deletedAt: Date;
  userId?: number;
}

export interface StockUpdateInput extends Partial<StockCreateInput> {
  id: number;
}

export interface BulkUpdateStock {
  ids: number[];
  data: Partial<StockUpdateInput>;
}

export interface OrderDeleteInput {
  id: number;
  userId?: number;
}

export interface OrderQueryParams {
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
