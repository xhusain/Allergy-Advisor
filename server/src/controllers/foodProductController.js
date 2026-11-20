import FoodProduct from "../models/FoodProduct.js";

export async function searchFoodProducts(req, res, next) {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      const products = await FoodProduct.find().sort({ name: 1 }).limit(30);
      res.json({ products });
      return;
    }

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const products = await FoodProduct.find({
      $or: [
        { name: new RegExp(escaped, "i") },
        { searchableText: new RegExp(escaped, "i") }
      ]
    })
      .sort({ name: 1 })
      .limit(20);

    res.json({ products });
  } catch (error) {
    next(error);
  }
}
