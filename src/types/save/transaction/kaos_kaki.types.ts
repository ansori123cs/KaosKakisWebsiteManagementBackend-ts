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
  userId?: number;
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
  userId?: number;
}

export interface FotoKaosKaki {
  url: string;
  is_primary: boolean;
}
export interface KaosKakiUpdateInput1 extends Partial<KaosKakiUpdateInput> {
  id: number;
}

export interface BulkKaosKakiUpdate {
  ids: number[];
  data: Partial<KaosKakiUpdateInput>;
}

export interface KaosKakiUpdateInput {
  id: number;
  nama?: string;
  keterangan?: string;
  jenis_bahan?: number;
  kode_kaos_kaki?: string;
  last_order?: string;
  status?: number;
  mesin?: Array<{
    id_mesin: number;
    isDeleted?: boolean;
  }>;
  foto?: Array<{
    url: string;
    isPrimary?: boolean;
    isDeleted?: boolean;
  }>;
  userId?: number;
}

export interface KaosKakiExistingData {
  id: number;
  nama: string;
  keterangan: string;
  jenisBahanId: number;
  kodeKaosKaki: string;
  lastOrderDate: string;
  status: string;
  jenisBahan?: {
    id: number;
    nama: string;
  };
  kaosKakiDetailFotos?: Array<{
    id: number;
    isPrimary: boolean;
    url: string;
  }>;
  kaosKakiDetailMesins?: Array<{
    id: number;
    jenisMesin: {
      id: number;
      nama: string;
    };
  }>;
  userId?: number;
}

export interface KaosKakiDeleteInput {
  id: number;
  userId?: number;
}

export interface UpdateKaosKakiData {
  updatedAt: string;
  nama?: string;
  keterangan?: string;
  jenisBahanId?: string;
  kodeKaosKaki?: string;
  lastOrderDate?: Date;
  status?: string;
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
