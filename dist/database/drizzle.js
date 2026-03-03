"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("../config/env");
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
function createPostgresClient() {
    if (!env_1.DB_URI) {
        throw new Error("❌ DB_URI is missing. Check your environment variables.");
    }
    return (0, postgres_1.default)(env_1.DB_URI, {
        idle_timeout: 10,
        connect_timeout: 10,
    });
}
async function main() {
    const client = createPostgresClient();
    const db = (0, postgres_js_1.drizzle)(client);
}
main();
//# sourceMappingURL=drizzle.js.map