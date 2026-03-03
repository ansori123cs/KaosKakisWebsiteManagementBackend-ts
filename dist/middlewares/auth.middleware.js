"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = exports.authorize = void 0;
const database_1 = require("../config/database");
const env_1 = require("../config/env");
const schema_1 = require("../models/schema");
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorize = async (req, res, next) => {
    try {
        let token;
        //take token from requsest headers
        if (req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        //tambahkan jika ingin mengubah token ke cookies\
        if (!token && req.cookies?.token) {
            token = req.cookies.token;
        }
        if (!token)
            return res
                .status(401)
                .json({ succeess: false, message: "Unauthorized : token not found" });
        //verify token then take data login user
        const decoded = jsonwebtoken_1.default.verify(token, env_1.JWT_SECRET);
        const [user] = await database_1.db
            .select({
            id: schema_1.users.id,
            namaUser: schema_1.users.namaUser,
            email: schema_1.users.email,
            role: schema_1.users.role,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, decoded.id))
            .limit(1);
        if (!user)
            return res.status(401).json({
                success: false,
                message: "Unauthorized : user not registered",
            });
        req.user = user;
        next();
    }
    catch (error) {
        if (env_1.NODE_ENV === "development") {
            console.log("authorize middleware error ", error);
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res
                .status(401)
                .json({ succeess: false, message: "Unauthorize : Token Invalid" });
        }
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};
exports.authorize = authorize;
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res
                .status(401)
                .json({ success: false, message: "Unauthorize ; User not Registered" });
        }
        if (!roles.includes(req.user.role)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorize : insufficient permissions",
            });
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
//# sourceMappingURL=auth.middleware.js.map