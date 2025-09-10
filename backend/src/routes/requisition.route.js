import express from "express";
import {
  createRequisition,
  getRequisitions,
  getRequisitionById,
} from "../controllers/requisitionController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", authorize("DEPARTMENT_HEAD"), createRequisition);

router.get("/", getRequisitions);

router.get("/:id", getRequisitionById);

export default router;
