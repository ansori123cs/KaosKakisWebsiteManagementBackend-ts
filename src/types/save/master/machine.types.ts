// src/types/master/product.types.ts
import { BaseEntity, Status, AuditableEntity } from "./base.master.types.ts";

export interface Product extends AuditableEntity {
  name: string;
  code: string;
  sku: string;
  description?: string;
  shortDescription?: string;

  // Pricing
  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  taxRate: number;

  // Inventory
  stockQuantity: number;
  minimumStock: number;
  maximumStock?: number;
  weight?: number;
  dimensions?: string; // "10x20x30 cm"

  // Categorization
  categoryId: number;
  brandId?: number;
  unitId?: number;

  // Status & flags
  status: Status;
  isFeatured: boolean;
  isAvailable: boolean;
  allowBackorder: boolean;

  // Additional info
  barcode?: string;
  manufacturer?: string;
  warrantyPeriod?: number; // dalam bulan
  expiryDate?: Date;

  // Media
  imageUrl?: string;
  gallery?: string[]; // JSON array of image URLs

  // Metadata
  tags?: string[];
  attributes?: Record<string, any>;
  specifications?: Record<string, string>;

  //   // Relations (optional, untuk query dengan join)
  //   category?: Category;
  //   brand?: Brand;
  //   unit?: Unit;
  //   inventory?: InventoryItem[];
}

export interface ProductCreateInput {
  name: string;
  code: string;
  sku: string;
  description?: string;
  shortDescription?: string;

  costPrice: number;
  sellingPrice: number;
  discountPrice?: number;
  taxRate?: number;

  stockQuantity?: number;
  minimumStock?: number;
  maximumStock?: number;
  weight?: number;
  dimensions?: string;

  categoryId: number;
  brandId?: number;
  unitId?: number;

  status?: Status;
  isFeatured?: boolean;
  isAvailable?: boolean;
  allowBackorder?: boolean;

  barcode?: string;
  manufacturer?: string;
  warrantyPeriod?: number;
  expiryDate?: Date;

  imageUrl?: string;
  gallery?: string[];

  tags?: string[];
  attributes?: Record<string, any>;
  specifications?: Record<string, string>;

  createdBy?: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {
  id: number;
}

export interface ProductQueryParams {
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
  sortBy?: "name" | "price" | "stock" | "createdAt" | "updatedAt";
  sortOrder?: "asc" | "desc";
  tags?: string[];
}

export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  name: string;
  attributes: Record<string, string>; // { color: 'red', size: 'XL' }
  price: number;
  stock: number;
  imageUrl?: string;
  status: Status;
}

export interface BulkProductUpdate {
  ids: number[];
  data: Partial<ProductUpdateInput>;
}

export interface ProductImportRow {
  name: string;
  code: string;
  sku: string;
  description?: string;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  categoryName: string;
  brandName?: string;
  barcode?: string;
}

export interface ProductExportParams extends ProductQueryParams {
  format?: "csv" | "excel" | "pdf";
  columns?: string[];
}
