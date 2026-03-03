"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const arcjet_1 = __importDefault(require("../config/arcjet"));
const arcjetMiddleware = async (req, res, next) => {
    try {
        const decission = await arcjet_1.default.protect(req, { requested: 1 });
        if (decission.isDenied()) {
            if (decission.reason.isRateLimit())
                return res.status(429).json({ error: "Rate Limit Exceeded" });
            if (decission.reason.isBot())
                return res.status(403).json({ error: "Bot Detected" });
            return res.status(403).json({ error: "Access Denied" });
        }
        next();
    }
    catch (error) {
        console.log(`arcjet Middleware Error: ${error}`);
        next(error);
    }
};
exports.default = arcjetMiddleware;
//# sourceMappingURL=arcjet.middleware.js.map