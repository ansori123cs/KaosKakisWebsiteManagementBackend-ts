import { AuditableEntity, Status } from "../master/base.master.types";

export interface Order extends AuditableEntity {
  namaPemesan: string;
  catatan: string;
  noTelpPemesan: string;
  status: number;
  userId?: number;
}

export interface OrderDetail {
  id: number;
  amount: number;
  price: number;
  kodeKaosVariasi: number;
  isDeleted: boolean;
  deletedAt: Date;
}

export interface OrderCreateInput extends AuditableEntity {
  namaPemesan: string;
  catatan: string;
  noTelpPemesan: string;
  status: number;
  orderDetails: OrderDetail[];
  isDeleted: boolean;
  deletedAt: Date;
  userId?: number;
}

export interface OrderUpdateInput extends Partial<OrderCreateInput> {
  id: number;
}

export interface BulkKaosKakiUpdate {
  ids: number[];
  data: Partial<OrderUpdateInput>;
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
