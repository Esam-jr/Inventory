import { Router } from "express";
import {
  getItems,
  createItem,
  updateItem,
} from "../controllers/item.controller.js";
import { authorize } from "../middleware/auth.js";
const router = Router();

router.get(
  "/",
  authorize(
    "DEPARTMENT_HEAD",
    "PROCUREMENT_OFFICER",
    "STOREKEEPER",
    "ADMIN",
    "AUDITOR"
  ),
  getItems
);

router.post("/", authorize("ADMIN", "STOREKEEPER"), createItem);
router.put("/:id", authorize("ADMIN", "STOREKEEPER"), updateItem);

export default router;
