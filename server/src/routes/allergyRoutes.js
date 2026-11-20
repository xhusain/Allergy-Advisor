import express from "express";
import {
  createAllergy,
  deleteAllergy,
  listAllergies,
  updateAllergy
} from "../controllers/allergyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listAllergies);
router.post("/", protect, createAllergy);
router.put("/:id", protect, updateAllergy);
router.delete("/:id", protect, deleteAllergy);

export default router;
