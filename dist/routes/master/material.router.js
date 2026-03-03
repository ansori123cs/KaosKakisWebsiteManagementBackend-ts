"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const express_1 = require("express");
const master_material_controller_1 = require("../../controllers/master/master.material.controller");
const materialRouter = (0, express_1.Router)();
materialRouter.get("/", auth_middleware_1.authorize, master_material_controller_1.getMaterialData);
materialRouter.post("/create", auth_middleware_1.authorize, master_material_controller_1.newMaterialData);
materialRouter.get("/:id", auth_middleware_1.authorize, master_material_controller_1.getMaterialDetails);
materialRouter.put("/update/:id", auth_middleware_1.authorize, master_material_controller_1.updateMaterialData);
materialRouter.post("/delete/:id", auth_middleware_1.authorize, master_material_controller_1.deleteMaterialData);
exports.default = materialRouter;
//# sourceMappingURL=material.router.js.map