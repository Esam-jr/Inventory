import express from "express";
import {
  createServiceRequest,
  getServiceRequests,
  getServiceRequestById,
  updateServiceRequestStatus,
  getServiceRequestStats,
} from "../controllers/serviceRequestController.js";
import { authenticateToken, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateToken);

router.post("/", authorize("DEPARTMENT_HEAD"), createServiceRequest);

router.get("/stats", getServiceRequestStats);

router.get("/", getServiceRequests);

router.get("/:id", getServiceRequestById);

router.patch(
  "/:id/status",
  authorize("PROCUREMENT_OFFICER"),
  updateServiceRequestStatus
);

export default router;
