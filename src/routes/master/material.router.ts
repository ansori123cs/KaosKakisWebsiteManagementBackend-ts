import { authorize } from "../../middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteMaterialData,
  getMaterialData,
  getMaterialDetails,
  newMaterialData,
  updateMaterialData,
} from "../../controllers/master/master.material.controller.ts";

const materialRouter = Router();

materialRouter.get("/", authorize, getMaterialData);

materialRouter.post("/create", authorize, newMaterialData);

materialRouter.get("/:id", authorize, getMaterialDetails);

materialRouter.put("/update/:id", authorize, updateMaterialData);

materialRouter.post("/delete/:id", authorize, deleteMaterialData);

export default materialRouter;
