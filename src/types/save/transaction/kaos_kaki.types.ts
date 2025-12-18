import { AuditableEntity, Status } from "../master/base.master.types.ts";
import { Machine } from "../master/machine.types.ts";
import { Material } from "../master/material.types.ts";

export interface KaosKaki extends AuditableEntity {
  nama: string;
  kode_kaos_kaki: string;
  jenis_bahan: Material;
  mesin: Machine[];
  foto: FotoKaosKaki[];
  keterangan: string;
  last_order: string;
  status: number;
}

export interface KaosKakiCreateInput {
  nama: string;
  kode_kaos_kaki: string;
  jenis_bahan: number;
  mesin: number[];
  foto: FotoKaosKaki[];
  keterangan: string;
  last_order: string;
  status: Status;
}

export interface KaosKakiUpdateInput extends Partial<KaosKakiCreateInput> {
  id: number;
}

export interface BulkKaosKakiUpdate {
  ids: number[];
  data: Partial<KaosKakiUpdateInput>;
}

export interface FotoKaosKaki {
  url: string;
  is_primary: boolean;
}

export interface KaosKakiQueryParams {
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
