import { authorize } from "../../middlewares/auth.middleware";
import { Router } from "express";
import {
  deleteColorData,
  getColorData,
  getColorDetails,
  newColorData,
  updateColorData,
} from "../../controllers/master/master.color.controller";

const colorRouter = Router();

colorRouter.get("/", authorize, getColorData);

colorRouter.post("/create", authorize, newColorData);

colorRouter.get("/:id", authorize, getColorDetails);

colorRouter.put("/update/:id", authorize, updateColorData);

colorRouter.post("/delete/:id", authorize, deleteColorData);

export default colorRouter;
