export async function updateAllergies(req, res, next) {
  try {
    const { allergies } = req.body;

    if (!Array.isArray(allergies)) {
      res.status(400);
      throw new Error("Allergies must be an array");
    }

    req.user.allergies = allergies.map((item) => ({
      allergy: item.allergyId,
      severity: item.severity || "moderate"
    }));

    await req.user.save();
    await req.user.populate("allergies.allergy");

    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
}
