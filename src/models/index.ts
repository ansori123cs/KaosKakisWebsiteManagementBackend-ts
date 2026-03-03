// Export semua dari schema
export * from "./schema";

// Export semua dari relations
export * from "./relations";

// Atau gabungkan dengan nama yang jelas
import * as schema from "./schema";
import * as relations from "./relations";

// Export sebagai object gabungan
export const dbSchema = {
  ...schema,
  ...relations,
};

// Type untuk database
export type DatabaseSchema = typeof dbSchema;
