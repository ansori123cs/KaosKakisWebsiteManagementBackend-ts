import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DB_URI } from "./env.ts";

if (!DB_URI) {
  throw new Error(
    "Database env is missing. Please check your environment variables."
  );
}

export const client = postgres(DB_URI!, {
  prepare: false,
  idle_timeout: 20,
});

export const db = drizzle({ client });
