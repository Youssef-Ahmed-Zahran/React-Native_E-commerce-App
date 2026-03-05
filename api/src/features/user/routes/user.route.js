import { Router } from "express";
import {
  addAddress,
  deleteAddress,
  getAddresses,
  updateAddress,
  updateUser,
  updatePassword,
} from "../controllers/user.controller.js";
import { verifyToken } from "../../../middlewares/verifyToken.middleware.js";

const router = Router();

router.use(verifyToken);

// address routes
router.post("/addresses", addAddress);
router.get("/addresses", getAddresses);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);

// User
router.put("/:id", updateUser);
router.patch("/:id/password", updatePassword);

export default router;
