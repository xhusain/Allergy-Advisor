import mongoose from "mongoose";

const allergySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    category: {
      type: String,
      enum: ["food", "environmental", "medicine"],
      default: "food"
    },
    aliases: [String],
    avoidIngredients: [String],
    riskyIngredients: [String],
    safeAlternatives: [String],
    advice: {
      type: String,
      default: ""
    }
  },
  { timestamps: true }
);

const Allergy = mongoose.model("Allergy", allergySchema);

export default Allergy;
