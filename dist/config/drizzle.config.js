"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const drizzle_kit_1 = require("drizzle-kit");
const env_1 = require("./env");
exports.default = (0, drizzle_kit_1.defineConfig)({
    out: "./src/models/",
    dialect: "postgresql",
    schema: "./src/schema.ts",
    dbCredentials: {
        url: env_1.DB_URI,
    },
    extensionsFilters: ["postgis"],
    schemaFilter: ["public"],
    tablesFilter: ["*"],
});
//# sourceMappingURL=drizzle.config.js.map