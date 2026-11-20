import FoodCheck from "../models/FoodCheck.js";
import FoodProduct from "../models/FoodProduct.js";
import { checkFoodProductSafety } from "../utils/checkFoodProductSafety.js";
import { checkFoodSafety } from "../utils/checkFoodSafety.js";

export async function checkFood(req, res, next) {
  try {
    const { inputText } = req.body;

    if (!inputText?.trim()) {
      res.status(400);
      throw new Error("Food or ingredient text is required");
    }

    await req.user.populate("allergies.allergy");

    if (req.user.allergies.length === 0) {
      const saved = await FoodCheck.create({
        user: req.user._id,
        inputText,
        result: "caution",
        matches: []
      });

      res.json({
        check: saved,
        result: "caution",
        summary: "No allergies are saved in your profile yet. Add and save allergies before trusting this check.",
        matches: []
      });
      return;
    }

    const escaped = inputText.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const foodProduct = await FoodProduct.findOne({
      name: new RegExp(`^${escaped}$`, "i")
    });

    if (foodProduct) {
      const datasetChecked = checkFoodProductSafety(foodProduct, req.user.allergies);

      if (datasetChecked) {
        const saved = await FoodCheck.create({
          user: req.user._id,
          inputText,
          result: datasetChecked.result,
          matches: datasetChecked.matches
        });

        res.json({
          check: saved,
          ...datasetChecked
        });
        return;
      }
    }

    const checked = checkFoodSafety(inputText, req.user.allergies);

    const saved = await FoodCheck.create({
      user: req.user._id,
      inputText,
      result: checked.result,
      matches: checked.matches
    });

    res.json({
      check: saved,
      result: checked.result,
      summary: checked.summary,
      matches: checked.matches,
      recognizedFoods: checked.recognizedFoods,
      datasetMatch: foodProduct
        ? {
            name: foodProduct.name,
            allergens: foodProduct.allergens,
            ingredients: foodProduct.ingredients,
            prediction: foodProduct.prediction
          }
        : null
    });
  } catch (error) {
    next(error);
  }
}

export async function listHistory(req, res, next) {
  try {
    const checks = await FoodCheck.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({ checks });
  } catch (error) {
    next(error);
  }
}
