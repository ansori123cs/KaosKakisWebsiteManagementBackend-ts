import {
  getOrderData,
  newOrderData,
} from "../../controllers/transaction/order.transaction.controller.ts";
import { Router } from "express";

const orderRouter = Router();

orderRouter.get("/", getOrderData);
orderRouter.post("/create", newOrderData);

export default orderRouter;
