import express from "express";
import { searchFoodProducts } from "../controllers/foodProductController.js";

const router = express.Router();

router.get("/", searchFoodProducts);

export default router;
