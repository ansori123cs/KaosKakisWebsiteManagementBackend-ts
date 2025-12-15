import type {
  BaseEntity,
  Status,
  AuditableEntity,
} from "./base.master.types.ts";

export interface Machine extends AuditableEntity {
  nama: string;
  kode_mesin: string;
  status: Status;
}

export interface MachineCreateInput {
  nama: string;
  kode_mesin: string;
  status: Status;
}

export interface MachineUpdateInput extends Partial<MachineCreateInput> {
  id: number;
}

export interface BulkProductUpdate {
  ids: number[];
  data: Partial<MachineUpdateInput>;
}

export interface MachineQueryParams {
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
