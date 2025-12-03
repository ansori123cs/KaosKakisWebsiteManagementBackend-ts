import { DB_URI } from "@/config/env.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

function createPostgresClient() {
  if (!DB_URI) {
    throw new Error("❌ DB_URI is missing. Check your environment variables.");
  }

  return postgres(DB_URI, {
    idle_timeout: 10,
    connect_timeout: 10,
  });
}

async function main() {
  const client = createPostgresClient();
  const db = drizzle(client);
}

main();
