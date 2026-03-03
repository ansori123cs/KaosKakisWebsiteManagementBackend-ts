"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyRefreshToken = void 0;
const env_1 = require("../config/env");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const VerifyRefreshToken = async (refreshToken, email) => {
    try {
        const decodeToken = await jsonwebtoken_1.default.verify(refreshToken, env_1.JWT_SECRET);
        return decodeToken === email;
    }
    catch (error) {
        return false;
    }
};
exports.VerifyRefreshToken = VerifyRefreshToken;
//# sourceMappingURL=auth.utils.js.map