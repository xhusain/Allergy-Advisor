function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ");
}

function containsTerm(text, term) {
  const escaped = term.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp(`\\b${escaped}\\b`, "i").test(text);
}

const commonFoodIngredients = {
  "french toast": ["egg", "milk", "bread", "wheat", "butter"],
  pancake: ["egg", "milk", "wheat flour", "butter"],
  pancakes: ["egg", "milk", "wheat flour", "butter"],
  waffle: ["egg", "milk", "wheat flour", "butter"],
  waffles: ["egg", "milk", "wheat flour", "butter"],
  omelette: ["egg", "milk", "cheese", "butter"],
  pizza: ["wheat flour", "cheese", "milk"],
  burger: ["wheat bun", "cheese", "sesame"],
  cake: ["egg", "milk", "wheat flour", "butter"],
  cookie: ["egg", "milk", "wheat flour", "butter"],
  cookies: ["egg", "milk", "wheat flour", "butter"],
  chocolate: ["milk"],
  "milk chocolate": ["milk", "dairy"],
  "dairy milk chocolate": ["milk", "dairy"]
};

function expandKnownFoods(inputText) {
  const normalizedInput = normalize(inputText);
  const recognized = [];
  const addedTerms = [];

  Object.entries(commonFoodIngredients).forEach(([food, ingredients]) => {
    if (containsTerm(normalizedInput, food)) {
      recognized.push(food);
      addedTerms.push(...ingredients);
    }
  });

  return {
    expandedText: `${inputText} ${addedTerms.join(" ")}`,
    recognized
  };
}

export function checkFoodSafety(inputText, userAllergies) {
  const { expandedText, recognized } = expandKnownFoods(inputText);
  const normalizedInput = normalize(expandedText);

  const matches = userAllergies
    .map(({ allergy, severity }) => {
      const avoidTerms = [
        allergy.name,
        ...allergy.aliases,
        ...allergy.avoidIngredients
      ].filter(Boolean);
      const riskyTerms = allergy.riskyIngredients.filter(Boolean);

      const avoidMatches = avoidTerms.filter((term) =>
        containsTerm(normalizedInput, term)
      );
      const riskyMatches = riskyTerms.filter((term) =>
        containsTerm(normalizedInput, term)
      );

      if (avoidMatches.length === 0 && riskyMatches.length === 0) {
        return null;
      }

      return {
        allergy: allergy.name,
        severity,
        avoidMatches,
        riskyMatches,
        advice: allergy.advice,
        safeAlternatives: allergy.safeAlternatives
      };
    })
    .filter(Boolean);

  const hasAvoid = matches.some((match) => match.avoidMatches.length > 0);
  const hasRisk = matches.some((match) => match.riskyMatches.length > 0);

  return {
    result: hasAvoid ? "avoid" : hasRisk ? "caution" : "safe",
    matches,
    recognizedFoods: recognized,
    summary:
      hasAvoid
        ? "Avoid this item. It contains ingredients linked to your allergy profile."
        : hasRisk
          ? "Use caution. This item may contain ingredients that need label checking."
          : "No direct allergy matches were found in your saved profile."
  };
}
