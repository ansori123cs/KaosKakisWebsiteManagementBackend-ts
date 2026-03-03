"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const isProd = process.env.NODE_ENV === "production";
const whitelist = isProd
    ? ["https://website-anda.com"]
    : ["http://localhost:5173", "http://127.0.0.1:5173", "http://127.0.0.1:5500"];
exports.corsOptions = {
    origin: function (origin, callback) {
        // Jika request tanpa origin (misalnya Postman atau curl)
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        else {
            return callback(new Error("CORS not allowed by server"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
};
//# sourceMappingURL=cors.js.map