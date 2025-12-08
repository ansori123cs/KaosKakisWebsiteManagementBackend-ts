import { SignUp } from "../controllers/auth/auth.controller.ts";
import { Router } from "express";

const authRouter = Router();

authRouter.post("/sign-up", SignUp);

export default authRouter;
