import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import xlsx from "xlsx";
import { connectDb } from "../config/db.js";
import FoodProduct from "../models/FoodProduct.js";
import { splitAndNormalizeAllergens } from "../utils/allergenNormalize.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const datasetPath = process.argv[2] || path.resolve(__dirname, "../../../dataset.xlsx");

function clean(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function buildSearchableText(row, allergens) {
  return [
    row.name,
    row.ingredients.main,
    row.ingredients.sweetener,
    row.ingredients.fatOil,
    row.ingredients.seasoning,
    ...allergens
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function normalizePrediction(value) {
  const prediction = clean(value);
  if (prediction === "Contains" || prediction === "Does not contain") {
    return prediction;
  }
  return "Unknown";
}

await connectDb();

const workbook = xlsx.readFile(datasetPath);
const sheetName = workbook.SheetNames[0];
const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
  defval: ""
});

const seen = new Set();
const products = [];

rows.forEach((sourceRow) => {
  const name = clean(sourceRow["Food Product"]);
  if (!name) return;

  const row = {
    name,
    ingredients: {
      main: clean(sourceRow["Main Ingredient"]),
      sweetener: clean(sourceRow["Sweetener"]),
      fatOil: clean(sourceRow["Fat/Oil"]),
      seasoning: clean(sourceRow["Seasoning"])
    },
    rawAllergens: String(sourceRow["Allergens"] || "")
      .split(/[,;]/)
      .map((item) => clean(item))
      .filter(Boolean),
    allergens: splitAndNormalizeAllergens(sourceRow["Allergens"]),
    prediction: normalizePrediction(sourceRow["Prediction"])
  };

  row.searchableText = buildSearchableText(row, row.allergens);

  const dedupeKey = JSON.stringify({
    name: row.name.toLowerCase(),
    ingredients: row.ingredients,
    allergens: row.allergens,
    prediction: row.prediction
  });

  if (seen.has(dedupeKey)) return;
  seen.add(dedupeKey);
  products.push(row);
});

await FoodProduct.deleteMany({});
await FoodProduct.insertMany(products);

console.log(`Imported ${products.length} food products from ${path.basename(datasetPath)}`);
process.exit(0);
