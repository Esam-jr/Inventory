import { Router } from "express";
import { getItems, createItem } from "../controllers/item.controller.js";

const router = Router();

router.get("/", getItems);

router.post("/", createItem);

export default router;
