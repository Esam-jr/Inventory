import express from "express";
import {
  createDepartment,
  getDepartments,
  deleteDepartment,
} from "../controllers/department.controller.js";
import { authorize } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authorize("ADMIN"), createDepartment);
router.get("/", authorize("ADMIN"), getDepartments);
router.delete("/:id", authorize("ADMIN"), deleteDepartment);

export default router;
