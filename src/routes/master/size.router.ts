import { authorize } from "../../middlewares/auth.middleware.ts";
import { Router } from "express";
import {
  deleteSizeData,
  getSizeData,
  getSizeDetails,
  newSizeData,
  updateSizeData,
} from "../../controllers/master/master.size.controller.ts";

const sizeRouter = Router();

sizeRouter.get("/", authorize, getSizeData);

sizeRouter.post("/create", authorize, newSizeData);

sizeRouter.get("/:id", authorize, getSizeDetails);

sizeRouter.put("/update/:id", authorize, updateSizeData);

sizeRouter.post("/delete/:id", authorize, deleteSizeData);

export default sizeRouter;
