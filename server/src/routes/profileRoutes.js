import express from "express";
import { updateAllergies } from "../controllers/profileController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/allergies", protect, updateAllergies);

export default router;
