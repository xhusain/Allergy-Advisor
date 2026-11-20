function allergyNamesForProfile(userAllergies) {
  return userAllergies.map(({ allergy }) => allergy.name);
}

function namesOverlap(left, right) {
  const normalizedRight = new Set(right.map((item) => item.toLowerCase()));
  return left.filter((item) => normalizedRight.has(item.toLowerCase()));
}

export function checkFoodProductSafety(foodProduct, userAllergies) {
  const profileAllergies = allergyNamesForProfile(userAllergies);
  const matchedAllergens = namesOverlap(foodProduct.allergens, profileAllergies);

  if (matchedAllergens.length === 0) {
    return null;
  }

  const matches = userAllergies
    .filter(({ allergy }) =>
      matchedAllergens.some((name) => name.toLowerCase() === allergy.name.toLowerCase())
    )
    .map(({ allergy, severity }) => ({
      allergy: allergy.name,
      severity,
      avoidMatches: matchedAllergens.filter(
        (name) => name.toLowerCase() === allergy.name.toLowerCase()
      ),
      riskyMatches: [],
      advice: allergy.advice,
      safeAlternatives: allergy.safeAlternatives
    }));

  return {
    result: "avoid",
    matches,
    summary: `${foodProduct.name} is listed in the dataset with allergens that match your profile.`,
    datasetMatch: {
      name: foodProduct.name,
      allergens: foodProduct.allergens,
      ingredients: foodProduct.ingredients,
      prediction: foodProduct.prediction
    }
  };
}
