import { Router } from "express";
import { verifyToken } from "../../../middlewares/verifyToken.middleware.js";
import { getAllProducts } from "../../admin/controllers/admin.controller.js";
import { getProductById } from "../controllers/product.controller.js";

const router = Router();

router.get("/", verifyToken, getAllProducts);
router.get("/:id", verifyToken, getProductById);

export default router;
