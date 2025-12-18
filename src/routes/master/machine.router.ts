import { authorize } from "../../middlewares/auth.middleware.ts";
import {
  deleteMachineData,
  getMachineData,
  getMachineDetails,
  newMachineData,
  updateMachineData,
} from "../../controllers/master/master.machine.controller.ts";
import { Router } from "express";

const machineRouter = Router();

machineRouter.get("/", authorize, getMachineData);

machineRouter.post("/create", authorize, newMachineData);

machineRouter.get("/:id", authorize, getMachineDetails);

machineRouter.put("/update/:id", authorize, updateMachineData);

machineRouter.post("/delete/:id", authorize, deleteMachineData);

export default machineRouter;
