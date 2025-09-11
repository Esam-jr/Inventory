import express from "express";
import {
  generateInventoryReport,
  generateTransactionReport,
  generateRequisitionReport,
  generateAuditReport,
} from "../controllers/report.controller.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.get(
  "/inventory",
  authorize("STOREKEEPER", "ADMIN", "AUDITOR"),
  generateInventoryReport
);

router.get(
  "/transactions",
  authorize("STOREKEEPER", "ADMIN", "AUDITOR"),
  generateTransactionReport
);

router.get(
  "/requisitions",
  authorize("PROCUREMENT_OFFICER", "ADMIN", "AUDITOR"),
  generateRequisitionReport
);

router.get("/audit", authorize("ADMIN", "AUDITOR"), generateAuditReport);

export default router;
