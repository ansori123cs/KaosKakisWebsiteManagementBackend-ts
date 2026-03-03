import { db } from "../config/database.js";
import { JWT_SECRET, NODE_ENV } from "../config/env.js";
import { users } from "../models/schema.js";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
export const authorize = async (req, res, next) => {
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
        const decoded = jwt.verify(token, JWT_SECRET);
        const [user] = await db
            .select({
            id: users.id,
            namaUser: users.namaUser,
            email: users.email,
            role: users.role,
        })
            .from(users)
            .where(eq(users.id, decoded.id))
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
        if (NODE_ENV === "development") {
            console.log("authorize middleware error ", error);
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res
                .status(401)
                .json({ succeess: false, message: "Unauthorize : Token Invalid" });
        }
        return res
            .status(500)
            .json({ success: false, message: "Internal Server Error" });
    }
};
export const authorizeRole = (...roles) => {
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
