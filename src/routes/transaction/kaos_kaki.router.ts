import {
  getKaosKakiDetails,
  getKaosKakiData,
  newkaosKakiData,
  FormDataKaosKaki,
  updatekaosKakiData,
  deletekaosKakiData,
} from "../../controllers/transaction/kaos_kaki.transaction.controller.ts";
import { Router } from "express";

const kaosKakiRouter = Router();

kaosKakiRouter.get("/", getKaosKakiData);
kaosKakiRouter.get("/form/:id", FormDataKaosKaki);
kaosKakiRouter.get("/:id", getKaosKakiDetails);
kaosKakiRouter.post("/create", newkaosKakiData);
kaosKakiRouter.put("/update/:id", updatekaosKakiData);
kaosKakiRouter.delete("/delete/:id", deletekaosKakiData);

export default kaosKakiRouter;
