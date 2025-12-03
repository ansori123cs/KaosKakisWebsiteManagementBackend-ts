import { defineConfig } from "drizzle-kit";
import { DB_URI } from "./config/env.ts";

export default defineConfig({
  out: "./src/models/",
  dialect: "postgresql",
  schema: "./src/schema.ts",
  dbCredentials: {
    url: DB_URI!,
  },
  extensionsFilters: ["postgis"],
  schemaFilter: ["public"],
  tablesFilter: ["*"],
});
