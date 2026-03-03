"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const stock_transaction_controller_1 = require("../../controllers/transaction/stock.transaction.controller");
const express_1 = require("express");
const stockRouter = (0, express_1.Router)();
stockRouter.get("/", stock_transaction_controller_1.getStockData);
stockRouter.get("/form/:id", stock_transaction_controller_1.FormDataStokKaosKaki);
stockRouter.get("/:id", stock_transaction_controller_1.getStockDetails);
stockRouter.post("/create", stock_transaction_controller_1.newStockData);
stockRouter.put("/update/:id", stock_transaction_controller_1.updateStockData);
stockRouter.delete("/delete/:id", stock_transaction_controller_1.deleteStockData);
exports.default = stockRouter;
//# sourceMappingURL=stock.routes.js.map