"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_transaction_controller_1 = require("../../controllers/transaction/order.transaction.controller");
const express_1 = require("express");
const orderRouter = (0, express_1.Router)();
orderRouter.get("/", order_transaction_controller_1.getOrderData);
orderRouter.get("/form/:id", order_transaction_controller_1.FormDataOrderKaosKaki);
orderRouter.get("/form/detail/:id", order_transaction_controller_1.FormDataOrderDetailKaosKaki);
orderRouter.get("/:id", order_transaction_controller_1.getOrderDetails);
orderRouter.post("/create", order_transaction_controller_1.newOrderData);
orderRouter.put("/update/:id", order_transaction_controller_1.updateOrderData);
orderRouter.delete("/delete/:id", order_transaction_controller_1.deleteOrderData);
exports.default = orderRouter;
//# sourceMappingURL=order.router.js.map