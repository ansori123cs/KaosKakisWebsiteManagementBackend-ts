import {
  getKaosKakiDetails,
  getKaosKakiData,
  newkaosKakiData,
  FormDataKaosKaki,
} from "../../controllers/transaction/kaos_kaki.transaction.controller.ts";
import { Router } from "express";

const kaosKakiRouter = Router();

kaosKakiRouter.get("/", getKaosKakiData);
kaosKakiRouter.get("/form", FormDataKaosKaki);
kaosKakiRouter.get("/:id", getKaosKakiDetails);
kaosKakiRouter.post("/create", newkaosKakiData);

export default kaosKakiRouter;
