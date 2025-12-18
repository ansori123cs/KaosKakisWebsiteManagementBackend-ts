import { getKaosKakiData } from "../../controllers/transaction/kaos_kaki.transaction.controller.ts";
import { Router } from "express";

const kaosKakiRouter = Router();

kaosKakiRouter.get("/", getKaosKakiData);

export default kaosKakiRouter;
