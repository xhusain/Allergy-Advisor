import express from "express";
import { checkFood, listHistory } from "../controllers/checkerController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, checkFood);
router.get("/history", protect, listHistory);

export default router;
