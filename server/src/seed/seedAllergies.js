import dotenv from "dotenv";
import Allergy from "../models/Allergy.js";
import { connectDb } from "../config/db.js";

dotenv.config();

const allergies = [
  {
    name: "Peanut",
    category: "food",
    aliases: ["peanuts", "groundnut", "arachis oil"],
    avoidIngredients: ["peanut butter", "peanut flour", "peanut oil"],
    riskyIngredients: ["mixed nuts", "satay", "nougat"],
    safeAlternatives: ["sunflower seed butter", "soy butter"],
    advice: "Avoid peanut-derived ingredients and check labels for shared processing warnings."
  },
  {
    name: "Tree Nut",
    category: "food",
    aliases: ["almond", "cashew", "walnut", "pistachio", "hazelnut"],
    avoidIngredients: ["almond flour", "cashew butter", "marzipan", "nut oil"],
    riskyIngredients: ["granola", "praline", "trail mix"],
    safeAlternatives: ["pumpkin seeds", "sunflower seeds"],
    advice: "Tree nuts often appear in desserts, cereals, sauces, and snack mixes."
  },
  {
    name: "Dairy",
    category: "food",
    aliases: ["milk", "lactose", "casein", "whey"],
    avoidIngredients: ["butter", "cheese", "cream", "yogurt", "ghee"],
    riskyIngredients: ["chocolate", "bread", "protein powder"],
    safeAlternatives: ["oat milk", "soy milk", "coconut yogurt"],
    advice: "Check for hidden milk proteins such as casein and whey."
  },
  {
    name: "Gluten",
    category: "food",
    aliases: ["wheat", "barley", "rye", "malt"],
    avoidIngredients: ["wheat flour", "semolina", "spelt", "bulgur"],
    riskyIngredients: ["soy sauce", "soups", "processed meats"],
    safeAlternatives: ["rice", "corn", "quinoa", "certified gluten-free oats"],
    advice: "Look for certified gluten-free labels when cross-contamination matters."
  },
  {
    name: "Egg",
    category: "food",
    aliases: ["eggs", "albumin", "ovalbumin"],
    avoidIngredients: ["mayonnaise", "meringue", "egg wash"],
    riskyIngredients: ["baked goods", "pasta", "dressings"],
    safeAlternatives: ["flax egg", "applesauce", "chia egg"],
    advice: "Egg can appear in baked goods, coatings, sauces, and some pastas."
  },
  {
    name: "Shellfish",
    category: "food",
    aliases: ["shrimp", "crab", "lobster", "prawn"],
    avoidIngredients: ["crustacean", "shellfish stock", "shrimp paste"],
    riskyIngredients: ["seafood sauce", "fish markets", "buffets"],
    safeAlternatives: ["chicken", "tofu", "beans"],
    advice: "Avoid seafood cross-contact, especially in shared fryers and buffets."
  },
  {
    name: "Pollen",
    category: "environmental",
    aliases: ["hay fever", "grass pollen", "tree pollen"],
    avoidIngredients: [],
    riskyIngredients: ["outdoor exposure", "fresh cut grass"],
    safeAlternatives: ["indoor filtered air", "closed windows"],
    advice: "On high pollen days, shower after going outside and keep windows closed."
  }
];

await connectDb();
await Allergy.deleteMany({});
await Allergy.insertMany(allergies);
console.log(`Seeded ${allergies.length} allergies`);
process.exit(0);
