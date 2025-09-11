import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get("/stats", getDashboardStats);

export default router;
