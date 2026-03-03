"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignOut = exports.SignIn = exports.SignUp = void 0;
const database_1 = require("../../config/database");
const env_1 = require("../../config/env");
const schema_1 = require("../../models/schema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const drizzle_orm_1 = require("drizzle-orm");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_types_1 = require("../../types/middleware/error.types");
// Sign Up - Controller
const SignUp = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload ||
            !payload.name ||
            !payload.email ||
            !payload.password ||
            !payload.telephone_number) {
            throw new error_types_1.AppError("All fields are required", 400);
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.email)) {
            throw new error_types_1.AppError("Invalid email format", 400);
        }
        if (payload.password.length < 8) {
            throw new error_types_1.AppError("Password must be at least 8 characters", 400);
        }
        const phoneRegex = /^\+?[1-9]\d{1,14}$/; // More strict international phone regex
        if (!phoneRegex.test(payload.telephone_number)) {
            throw new error_types_1.AppError("Invalid phone number format", 400);
        }
        // Check existing email user
        const [existingUser] = await database_1.db
            .select({ email: schema_1.users.email })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, payload.email))
            .limit(1);
        if (existingUser) {
            throw new error_types_1.AppError("Email already registered", 409);
        }
        // Hash password
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(payload.password, salt);
        const [newUser] = await database_1.db
            .insert(schema_1.users)
            .values({
            namaUser: payload.name.trim(),
            email: payload.email.toLowerCase().trim(),
            password: hashedPassword,
            telephoneNumber: payload.telephone_number,
            role: "user",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        })
            .returning({
            id: schema_1.users.id,
            namaUser: schema_1.users.namaUser,
            email: schema_1.users.email,
            telephoneNumber: schema_1.users.telephoneNumber,
            role: schema_1.users.role,
        });
        const signOptions = {
            expiresIn: Number(env_1.JWT_EXPIRES_IN) || 24,
        };
        const token = jsonwebtoken_1.default.sign({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        }, env_1.JWT_SECRET, signOptions);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                token,
                user: {
                    name: newUser.namaUser,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.SignUp = SignUp;
// Sign In - Controller
const SignIn = async (req, res, next) => {
    try {
        const payload = req.body;
        if (!payload || !payload.email || !payload.password) {
            throw new error_types_1.AppError("Email and password are required", 400);
        }
        const [userLogged] = await database_1.db
            .select({
            id: schema_1.users.id,
            name: schema_1.users.namaUser,
            email: schema_1.users.email,
            password: schema_1.users.password,
            role: schema_1.users.role,
        })
            .from(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.email, payload.email))
            .limit(1);
        if (!userLogged) {
            throw new error_types_1.AppError("Invalid email or password", 400);
        }
        const isPasswordValid = await bcryptjs_1.default.compare(payload.password, userLogged.password);
        if (!isPasswordValid) {
            throw new error_types_1.AppError("Invalid email or password", 400);
        }
        const signOptions = {
            expiresIn: Number(env_1.JWT_EXPIRES_IN) || 900,
        };
        const token = jsonwebtoken_1.default.sign({
            id: userLogged.id,
            email: userLogged.email,
            role: userLogged.role,
        }, env_1.JWT_SECRET, signOptions);
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user: {
                    name: userLogged.name,
                    email: userLogged.email,
                    role: userLogged.role,
                },
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.SignIn = SignIn;
// Sign Out
const SignOut = async (req, res, next) => {
    try {
        res
            .status(200)
            .json({ success: true, message: "User signed out successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.SignOut = SignOut;
//# sourceMappingURL=auth.controller.js.map