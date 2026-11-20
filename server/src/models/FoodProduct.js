import mongoose from "mongoose";

const foodProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    ingredients: {
      main: { type: String, default: "" },
      sweetener: { type: String, default: "" },
      fatOil: { type: String, default: "" },
      seasoning: { type: String, default: "" }
    },
    allergens: {
      type: [String],
      default: []
    },
    rawAllergens: {
      type: [String],
      default: []
    },
    prediction: {
      type: String,
      enum: ["Contains", "Does not contain", "Unknown"],
      default: "Unknown"
    },
    searchableText: {
      type: String,
      default: "",
      index: true
    }
  },
  { timestamps: true }
);

foodProductSchema.index({ name: "text", searchableText: "text" });

const FoodProduct = mongoose.model("FoodProduct", foodProductSchema);

export default FoodProduct;
