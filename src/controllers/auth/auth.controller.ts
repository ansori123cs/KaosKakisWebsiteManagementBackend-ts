import { db } from "../../config/database.ts";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../../config/env.ts";
import { users } from "../../models/schema.ts";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { AppError } from "../../types/middleware/error.types.ts";
import type { SignInPayload, SignUpPayload } from "../../types/global.d.ts";

// Sign Up - Controller
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
      throw new AppError("All fields are required", 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(payload.email)) {
      throw new AppError("Invalid email format", 400);
    }

    if (payload.password.length < 8) {
      throw new AppError("Password must be at least 8 characters", 400);
    }

    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // More strict international phone regex
    if (!phoneRegex.test(payload.telephone_number)) {
      throw new AppError("Invalid phone number format", 400);
    }

    // Check existing email user
    const [existingUser] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (existingUser) {
      throw new AppError("Email already registered", 409);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const [newUser] = await db
      .insert(users)
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
        id: users.id,
        namaUser: users.namaUser,
        email: users.email,
        telephoneNumber: users.telephoneNumber,
        role: users.role,
      });

    const signOptions: SignOptions = {
      expiresIn: (Number(JWT_EXPIRES_IN) as number) || 24,
    };

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      JWT_SECRET!,
      signOptions
    );

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
  } catch (error) {
    next(error);
  }
};

// Sign In - Controller
export const SignIn = async (
  req: Request<{}, {}, SignInPayload>,
  res: Response,
  next: NextFunction
) => {
  try {
    const payload = req.body;

    if (!payload || !payload.email || !payload.password) {
      throw new AppError("Email and password are required", 400);
    }

    const [userLogged] = await db
      .select({
        id: users.id,
        name: users.namaUser,
        email: users.email,
        password: users.password,
        role: users.role,
      })
      .from(users)
      .where(eq(users.email, payload.email))
      .limit(1);

    if (!userLogged) {
      throw new AppError("Invalid email or password", 400);
    }

    const isPasswordValid = await bcrypt.compare(
      payload.password,
      userLogged.password!
    );

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 400);
    }

    const signOptions: SignOptions = {
      expiresIn: (Number(JWT_EXPIRES_IN) as number) || 900,
    };

    const token = jwt.sign(
      {
        id: userLogged.id,
        email: userLogged.email,
        role: userLogged.role,
      },
      JWT_SECRET!,
      signOptions
    );

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
  } catch (error) {
    next(error);
  }
};

// Sign Out
export const SignOut = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res
      .status(200)
      .json({ success: true, message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};
