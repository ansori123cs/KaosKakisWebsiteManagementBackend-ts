import { getMachineData } from "@/controllers/master/master.machine.controller.ts";
import { Router } from "express";
import type { Request, Response, NextFunction } from "express";

const materialRouter = Router();

materialRouter.get("/", getMachineData);

materialRouter.post(
  "/create",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({ success: true, message: "make new machine master" });
  }
);

materialRouter.get(
  "/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      success: true,
      message: `get specific machine master id = ${req.params}`,
    });
  }
);

materialRouter.put(
  "/update/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      success: true,
      message: `update machine master id = ${req.params}`,
    });
  }
);

materialRouter.post(
  "/delete/:id",
  (req: Request, res: Response, next: NextFunction) => {
    res.status(201).json({
      success: true,
      message: `delete machine master id = ${req.params}`,
    });
  }
);

export default materialRouter;
