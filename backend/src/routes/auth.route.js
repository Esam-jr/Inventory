import { Router } from "express";

import {
  getProfile,
  login,
  registerUsers,
} from "../controllers/auth.controller.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = Router();

router.post("/login", login);
router.post("/register", authenticateToken, authorize("ADMIN"), registerUsers);

router.get("/profile", authenticateToken, getProfile);
export default router;
