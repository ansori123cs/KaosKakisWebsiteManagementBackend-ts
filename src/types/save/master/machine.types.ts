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
  status?: Status;
}

export interface MachineUpdateInput extends Partial<MachineCreateInput> {
  id: number;
}

export interface BulkMachineUpdate {
  ids: number[];
  data: Partial<MachineUpdateInput>;
}

export interface MachineQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: Status;
  sortBy?: "nama" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
}
