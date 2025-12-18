// Export semua dari schema
export * from "./schema.ts";

// Export semua dari relations
export * from "./relations.ts";

// Atau gabungkan dengan nama yang jelas
import * as schema from "./schema.ts";
import * as relations from "./relations.ts";

// Export sebagai object gabungan
export const dbSchema = {
  ...schema,
  ...relations,
};

// Type untuk database
export type DatabaseSchema = typeof dbSchema;
