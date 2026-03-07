import { Router } from "express";
import express from "express";
import {
  createPaymentIntent,
  handleWebhook,
} from "../controllers/payment.controller.js";
import { verifyToken } from "../../../middlewares/verifyToken.middleware.js";

const router = Router();

// Webhook must use raw body — before any json middleware
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  handleWebhook
);

// Protected routes
router.post("/create-payment-intent", verifyToken, createPaymentIntent);

export default router;
