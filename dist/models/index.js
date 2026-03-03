// Export semua dari schema
export * from "./schema.js";
// Export semua dari relations
export * from "./relations.js";
// Atau gabungkan dengan nama yang jelas
import * as schema from "./schema.js";
import * as relations from "./relations.js";
// Export sebagai object gabungan
export const dbSchema = {
    ...schema,
    ...relations,
};
