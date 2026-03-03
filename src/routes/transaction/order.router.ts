import {
  deleteOrderData,
  FormDataOrderDetailKaosKaki,
  FormDataOrderKaosKaki,
  getOrderData,
  getOrderDetails,
  newOrderData,
  updateOrderData,
} from "../../controllers/transaction/order.transaction.controller.js";
import { Router } from "express";

const orderRouter = Router();

orderRouter.get("/", getOrderData);
orderRouter.get("/form/:id", FormDataOrderKaosKaki);
orderRouter.get("/form/detail/:id", FormDataOrderDetailKaosKaki);
orderRouter.get("/:id", getOrderDetails);
orderRouter.post("/create", newOrderData);
orderRouter.put("/update/:id", updateOrderData);
orderRouter.delete("/delete/:id", deleteOrderData);

export default orderRouter;
