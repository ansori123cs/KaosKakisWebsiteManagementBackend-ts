"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_1 = require("express");
const master_size_controller_1 = require("../../controllers/master/master.size.controller");
const sizeRouter = (0, express_1.Router)();
sizeRouter.get("/", auth_middleware_1.authorize, master_size_controller_1.getSizeData);
sizeRouter.post("/create", auth_middleware_1.authorize, master_size_controller_1.newSizeData);
sizeRouter.get("/:id", auth_middleware_1.authorize, master_size_controller_1.getSizeDetails);
sizeRouter.put("/update/:id", auth_middleware_1.authorize, master_size_controller_1.updateSizeData);
sizeRouter.post("/delete/:id", auth_middleware_1.authorize, master_size_controller_1.deleteSizeData);
exports.default = sizeRouter;
//# sourceMappingURL=size.router.js.map