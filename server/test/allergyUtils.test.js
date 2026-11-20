import test from "node:test";
import assert from "node:assert/strict";
import { splitAndNormalizeAllergens } from "../src/utils/allergenNormalize.js";
import { checkFoodProductSafety } from "../src/utils/checkFoodProductSafety.js";
import { checkFoodSafety } from "../src/utils/checkFoodSafety.js";

const profile = [
  {
    allergy: {
      name: "Dairy",
      aliases: ["milk"],
      avoidIngredients: ["butter"],
      riskyIngredients: ["whey"],
      advice: "Check the label.",
      safeAlternatives: ["oat milk"]
    },
    severity: "severe"
  }
];

test("normalizes and deduplicates common allergen names", () => {
  assert.deepEqual(splitAndNormalizeAllergens("milk, dairy; milk"), ["Dairy"]);
});

test("marks known food ingredients as avoid when an avoid term matches", () => {
  const result = checkFoodSafety("pancake", profile);

  assert.equal(result.result, "avoid");
  assert.deepEqual(result.recognizedFoods, ["pancake"]);
  assert.ok(result.matches[0].avoidMatches.includes("butter"));
});

test("marks risky ingredients as caution when no avoid term matches", () => {
  const result = checkFoodSafety("whey protein", profile);

  assert.equal(result.result, "caution");
  assert.deepEqual(result.matches[0].riskyMatches, ["whey"]);
});

test("uses dataset allergen matches for food products", () => {
  const result = checkFoodProductSafety(
    {
      name: "Milk Chocolate",
      allergens: ["Dairy"],
      ingredients: ["cocoa", "milk"],
      prediction: "contains dairy"
    },
    profile
  );

  assert.equal(result.result, "avoid");
  assert.equal(result.datasetMatch.name, "Milk Chocolate");
  assert.equal(result.matches[0].severity, "severe");
});
