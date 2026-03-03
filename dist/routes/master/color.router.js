"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_1 = require("express");
const master_color_controller_1 = require("../../controllers/master/master.color.controller");
const colorRouter = (0, express_1.Router)();
colorRouter.get("/", auth_middleware_1.authorize, master_color_controller_1.getColorData);
colorRouter.post("/create", auth_middleware_1.authorize, master_color_controller_1.newColorData);
colorRouter.get("/:id", auth_middleware_1.authorize, master_color_controller_1.getColorDetails);
colorRouter.put("/update/:id", auth_middleware_1.authorize, master_color_controller_1.updateColorData);
colorRouter.post("/delete/:id", auth_middleware_1.authorize, master_color_controller_1.deleteColorData);
exports.default = colorRouter;
//# sourceMappingURL=color.router.js.map