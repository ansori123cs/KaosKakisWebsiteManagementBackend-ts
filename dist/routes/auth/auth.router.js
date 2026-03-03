"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const auth_controller_1 = require("../../controllers/auth/auth.controller");
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post("/sign-up", auth_controller_1.SignUp);
authRouter.post("/Sign-in", auth_controller_1.SignIn);
authRouter.post("/sign-out", auth_middleware_1.authorize, auth_controller_1.SignOut);
exports.default = authRouter;
//# sourceMappingURL=auth.router.js.map