import { Router } from "express";
import { verifyToken } from "../../../middlewares/verifyToken.middleware.js";
import {
  createOrder,
  getUserOrders,
  getSingleOrder,
  cancelOrder,
} from "../controllers/order.controller.js";

const router = Router();

router.use(verifyToken);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:id", getSingleOrder);
router.patch("/:id/cancel", cancelOrder);

export default router;
