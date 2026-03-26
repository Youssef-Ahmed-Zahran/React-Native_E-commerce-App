import express from "express";
import { getPaypalConfig, servePaypalCheckout } from "../controllers/payment.controller.js";

const router = express.Router();

router.get("/config/paypal", getPaypalConfig);
router.get("/checkout/paypal", servePaypalCheckout);

export default router;
