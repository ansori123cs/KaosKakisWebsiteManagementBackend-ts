import { authorize } from "../../middlewares/auth.middleware.ts";
import { getMachineData } from "../../controllers/master/master.machine.controller.ts";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const machineRouter = Router();

machineRouter.get("/", authorize, getMachineData);

machineRouter.post(
  "/create",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ success: true, message: "make new machine master" });
  }
);

machineRouter.get("/:id", (req: Request, res: Response, next: NextFunction) => {
  res.status(201).json({
    success: true,
    message: `get specific machine master id = ${req.params}`,
  });
});

machineRouter.put(
  "/update/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      success: true,
      message: `update machine master id = ${req.params}`,
    });
  }
);

machineRouter.post(
  "/delete/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      success: true,
      message: `delete machine master id = ${req.params}`,
    });
  }
);

export default machineRouter;
