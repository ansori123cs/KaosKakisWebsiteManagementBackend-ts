import {
  getKaosKakiDetails,
  getKaosKakiData,
  newkaosKakiData,
  FormDataKaosKaki,
  updatekaosKakiData,
} from "../../controllers/transaction/kaos_kaki.transaction.controller.ts";
import { Router } from "express";

const kaosKakiRouter = Router();

kaosKakiRouter.get("/", getKaosKakiData);
kaosKakiRouter.get("/form", FormDataKaosKaki);
kaosKakiRouter.get("/:id", getKaosKakiDetails);
kaosKakiRouter.post("/create", newkaosKakiData);
kaosKakiRouter.post("/update/:id", updatekaosKakiData);
kaosKakiRouter.post("/delete/:id", newkaosKakiData);

export default kaosKakiRouter;
