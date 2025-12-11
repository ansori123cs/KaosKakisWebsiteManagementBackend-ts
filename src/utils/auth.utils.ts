import { JWT_SECRET } from "@/config/env.ts";
import jwt from "jsonwebtoken";

export const VerifyRefreshToken = async (
  refreshToken: string,
  email: string
) => {
  try {
    const decodeToken = await jwt.verify(refreshToken, JWT_SECRET!);
    return decodeToken === email;
  } catch (error) {
    return false;
  }
};
