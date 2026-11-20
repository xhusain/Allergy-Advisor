export function splitList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toForm(allergy) {
  return {
    name: allergy.name || "",
    category: allergy.category || "food",
    aliases: allergy.aliases?.join(", ") || "",
    avoidIngredients: allergy.avoidIngredients?.join(", ") || "",
    riskyIngredients: allergy.riskyIngredients?.join(", ") || "",
    safeAlternatives: allergy.safeAlternatives?.join(", ") || "",
    advice: allergy.advice || ""
  };
}

export function toPayload(form) {
  return {
    name: form.name,
    category: form.category,
    aliases: splitList(form.aliases),
    avoidIngredients: splitList(form.avoidIngredients),
    riskyIngredients: splitList(form.riskyIngredients),
    safeAlternatives: splitList(form.safeAlternatives),
    advice: form.advice
  };
}
