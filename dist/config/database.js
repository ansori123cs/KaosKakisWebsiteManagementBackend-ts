import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { DB_URI } from "./env.js";
import * as schema from "../models/index.js";
if (!DB_URI) {
    throw new Error("DB_URI is not defined in environment variables");
}
const isProduction = process.env.NODE_ENV === "production";
const isDevelopment = process.env.NODE_ENV === "development";
const clientConfig = {
    max: 10,
    idle_timeout: 20,
    prepare: false,
    ssl: isProduction ? "require" : false,
    // ssl: isProduction ? { rejectUnauthorized: false } : false,
    debug: isDevelopment,
    types: {
        bigint: postgres.BigInt,
    },
};
export const client = postgres(DB_URI, clientConfig);
export const db = drizzle(client, {
    schema,
    logger: isDevelopment,
});
export const checkConnection = async () => {
    try {
        await client `SELECT 1`;
        console.log("Database connected");
        return true;
    }
    catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
};
if (isDevelopment) {
    checkConnection().catch(() => { });
}
const shutdown = async () => {
    console.log("Shutting down database connections...");
    await client.end();
    console.log("Database connections closed");
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
