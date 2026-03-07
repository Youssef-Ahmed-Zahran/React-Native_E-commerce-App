import { Router } from "express";
import {
  verifyToken,
  verifyTokenAndAuthorization,
} from "../../../middlewares/verifyToken.middleware.js";
import {
  createReview,
  getProductReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} from "../controllers/review.controller.js";

const router = Router();

// Public
router.get("/product/:productId", getProductReviews);

// Protected
router.use(verifyToken);

router.get("/my-reviews", getMyReviews);
router.post("/", createReview);
router.patch("/:id", updateReview);
router.delete("/:id", verifyTokenAndAuthorization, deleteReview);

export default router;
