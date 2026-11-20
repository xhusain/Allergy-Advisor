const allergenMap = {
  almond: "Tree Nut",
  almonds: "Tree Nut",
  "pine nuts": "Tree Nut",
  nuts: "Tree Nut",
  peanut: "Peanut",
  peanuts: "Peanut",
  dairy: "Dairy",
  milk: "Dairy",
  ghee: "Dairy",
  wheat: "Gluten",
  flour: "Gluten",
  egg: "Egg",
  eggs: "Egg",
  soybeans: "Soy",
  soy: "Soy",
  fish: "Fish",
  anchovies: "Fish",
  shellfish: "Shellfish",
  celery: "Celery",
  mustard: "Mustard",
  coconut: "Coconut",
  oats: "Oats",
  rice: "Rice",
  alcohol: "Alcohol",
  strawberries: "Strawberry",
  pork: "Pork",
  chicken: "Chicken",
  cocoa: "Cocoa"
};

export function normalizeAllergenName(value) {
  const key = String(value || "").trim().toLowerCase();
  return allergenMap[key] || String(value || "").trim();
}

export function splitAndNormalizeAllergens(value) {
  if (!value) return [];

  return [
    ...new Set(
      String(value)
        .split(/[,;]/)
        .map((item) => normalizeAllergenName(item))
        .filter(Boolean)
    )
  ];
}
