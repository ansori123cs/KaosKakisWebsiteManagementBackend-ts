"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkConnection = exports.db = exports.client = void 0;
const postgres_js_1 = require("drizzle-orm/postgres-js");
const postgres_1 = __importDefault(require("postgres"));
const env_1 = require("./env");
const schema = __importStar(require("../models/index"));
if (!env_1.DB_URI) {
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
        bigint: postgres_1.default.BigInt,
    },
};
exports.client = (0, postgres_1.default)(env_1.DB_URI, clientConfig);
exports.db = (0, postgres_js_1.drizzle)(exports.client, {
    schema,
    logger: isDevelopment,
});
const checkConnection = async () => {
    try {
        await (0, exports.client) `SELECT 1`;
        console.log("Database connected");
        return true;
    }
    catch (error) {
        console.error("Database connection failed:", error);
        return false;
    }
};
exports.checkConnection = checkConnection;
if (isDevelopment) {
    (0, exports.checkConnection)().catch(() => { });
}
const shutdown = async () => {
    console.log("Shutting down database connections...");
    await exports.client.end();
    console.log("Database connections closed");
};
process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
//# sourceMappingURL=database.js.map