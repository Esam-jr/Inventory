import { Router } from "express";
import {
  getItems,
  createItem,
  updateItem,
} from "../controllers/item.controller.js";
import { authorize } from "../middleware/auth.js";
const router = Router();

router.get("/", getItems);

router.post("/", authorize("ADMIN", "STOREKEEPER"), createItem);
router.put("/:id", authorize("ADMIN", "STOREKEEPER"), updateItem);

export default router;
