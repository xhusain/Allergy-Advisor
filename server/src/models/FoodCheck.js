import mongoose from "mongoose";

const foodCheckSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    inputText: {
      type: String,
      required: true
    },
    result: {
      type: String,
      enum: ["safe", "caution", "avoid"],
      required: true
    },
    matches: [
      {
        allergy: String,
        severity: String,
        avoidMatches: [String],
        riskyMatches: [String],
        advice: String,
        safeAlternatives: [String]
      }
    ]
  },
  { timestamps: true }
);

const FoodCheck = mongoose.model("FoodCheck", foodCheckSchema);

export default FoodCheck;
