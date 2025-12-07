import { db } from "@/config/database.ts";
import { JWT_EXPIRES_IN, JWT_SECRET } from "@/config/env.ts";
import { users } from "@/models/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface SignUpPayload {
  name: string;
  email: string;
  password: string;
  telephone_number: string;
}

class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message),
      (this.statusCode = statusCode),
      (this.name = this.constructor.name),
      Error.captureStackTrace(this, this.constructor);
  }
}

export const SignUp = async (
  req: Request<{}, {}, SignUpPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (
      !payload ||
      !payload.name ||
      !payload.email ||
      !payload.password ||
      !payload.telephone_number
    ) {
      throw new AppError("All Fields are Required ", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new AppError("Invalid email format", 400);
    }

    if (payload.password.length < 8) {
      throw new AppError("Password must be 8 character", 400);
    }

    const phoneRegex = /^[0-9+\-\s()]{10,}$/;
    if (!phoneRegex.test(payload.telephone_number)) {
      throw new AppError("Invalid phone number format", 400);
    }

    //check exiting email user
    const [exitingUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (exitingUser) {
      throw new AppError("Email Allready Registered", 409);
    }

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const newUser = await db.transaction(async (tx) => {
      const [insertedUser] = await tx
        .insert(users)
        .values({
          namaUser: payload.name.trim(),
          email: payload.email.toLocaleLowerCase().trim(),
          password: hashedPassword,
          telephoneNumber: payload.telephone_number,
          role: "user",
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({
          id: users.id,
          namaUser: users.namaUser,
          email: users.email,
          telephoneNumber: users.telephoneNumber,
          role: users.role,
        });
      return insertedUser;
    });

    if (!JWT_SECRET) {
      throw new Error("JWT_SECRET must be defined in environment variables");
    }
    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET,
      {
        expiresIn: JWT_EXPIRES_IN || "24h",
      }
    );

    res.status(201).json({
      success: true,
      message: "User Registered Success",
      data: {
        token,
        user: {
          id: newUser.id,
          name: newUser.namaUser,
          email: newUser.email,
          telephone_number: newUser.telephoneNumber,
          role: newUser.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};
