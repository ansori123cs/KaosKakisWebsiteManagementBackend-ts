import type { Request, Response, NextFunction } from "express";
import aj from "../config/arcjet.ts";

const arcjetMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const decission = await aj.protect(req, { requested: 1 });

    if (decission.isDenied()) {
      if (decission.reason.isRateLimit())
        return res.status(429).json({ error: "Rate Limit Exceeded" });
      if (decission.reason.isBot())
        return res.status(403).json({ error: "Bot Detected" });

      return res.status(403).json({ error: "Access Denied" });
    }
    next();
  } catch (error) {
    console.log(`arcjet Middleware Error: ${error}`);
    next(error);
  }
};

export default arcjetMiddleware;
