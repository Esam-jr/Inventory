import express from "express";
import {
  createRequisition,
  getRequisitions,
  getRequisitionStats,
  getRequisitionById,
  updateRequisitionStatus,
  fulfillRequisition,
} from "../controllers/requisition.controller.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", authorize("DEPARTMENT_HEAD"), createRequisition);

router.get("/", getRequisitions);
router.get("/stats", getRequisitionStats);

router.get("/:id", getRequisitionById);

router.get("/:id", getRequisitionById);

router.patch(
  "/:id/status",
  authorize("PROCUREMENT_OFFICER"),
  updateRequisitionStatus
);

router.post("/:id/fulfill", authorize("STOREKEEPER"), fulfillRequisition);

export default router;
