import { authorize } from "../../middlewares/auth.middleware.ts";
import {
  deleteMachineData,
  getMachineData,
  getMachineDetails,
  newMachineData,
  updateMachineData,
} from "../../controllers/master/master.machine.controller.ts";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const machineRouter = Router();

machineRouter.get("/", authorize, getMachineData);

machineRouter.post("/create", authorize, newMachineData);

machineRouter.get("/:id", authorize, getMachineDetails);

machineRouter.put("/update/:id", authorize, updateMachineData);

machineRouter.post("/delete/:id", deleteMachineData);

export default machineRouter;
