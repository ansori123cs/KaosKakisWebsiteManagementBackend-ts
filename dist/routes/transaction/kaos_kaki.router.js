"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const kaos_kaki_transaction_controller_1 = require("../../controllers/transaction/kaos_kaki.transaction.controller");
const express_1 = require("express");
const kaosKakiRouter = (0, express_1.Router)();
kaosKakiRouter.get("/", kaos_kaki_transaction_controller_1.getKaosKakiData);
kaosKakiRouter.get("/form/:select", kaos_kaki_transaction_controller_1.FormDataKaosKaki);
kaosKakiRouter.get("/:id", kaos_kaki_transaction_controller_1.getKaosKakiDetails);
kaosKakiRouter.post("/create", kaos_kaki_transaction_controller_1.newkaosKakiData);
kaosKakiRouter.put("/update/:id", kaos_kaki_transaction_controller_1.updatekaosKakiData);
kaosKakiRouter.delete("/delete/:id", kaos_kaki_transaction_controller_1.deletekaosKakiData);
exports.default = kaosKakiRouter;
//# sourceMappingURL=kaos_kaki.router.js.map