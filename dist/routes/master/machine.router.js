"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const master_machine_controller_1 = require("../../controllers/master/master.machine.controller");
const express_1 = require("express");
const machineRouter = (0, express_1.Router)();
machineRouter.get("/", auth_middleware_1.authorize, master_machine_controller_1.getMachineData);
machineRouter.post("/create", auth_middleware_1.authorize, master_machine_controller_1.newMachineData);
machineRouter.get("/:id", auth_middleware_1.authorize, master_machine_controller_1.getMachineDetails);
machineRouter.put("/update/:id", auth_middleware_1.authorize, master_machine_controller_1.updateMachineData);
machineRouter.post("/delete/:id", auth_middleware_1.authorize, master_machine_controller_1.deleteMachineData);
exports.default = machineRouter;
//# sourceMappingURL=machine.router.js.map