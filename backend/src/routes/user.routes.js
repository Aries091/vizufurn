import { Router } from "express";
import {loginUser,
  registerUser,
  logoutUser,
  refreshAccessToken
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/register", registerUser);

// The login route is missing from exports, so we'll comment it out for now
router.post("/login", loginUser);

// Protected routes
router.post("/logout", verifyJWT(), logoutUser);
router.post("/refresh-token", refreshAccessToken);

// Seller-specific route (example)
router.get("/seller-dashboard", verifyJWT(["seller"]), (req, res) => {
  res.json({ message: "Seller Dashboard" });
});

// Customer-specific route (example)
router.get("/customer-dashboard", verifyJWT(["customer"]), (req, res) => {
  res.json({ message: "Customer Dashboard" });
});

export default router;