import { authorize } from "../../middlewares/auth.middleware.js";
import { SignIn, SignOut, SignUp, } from "../../controllers/auth/auth.controller.js";
import { Router } from "express";
const authRouter = Router();
authRouter.post("/sign-up", SignUp);
authRouter.post("/Sign-in", SignIn);
authRouter.post("/sign-out", authorize, SignOut);
export default authRouter;
