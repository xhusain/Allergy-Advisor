import Allergy from "../models/Allergy.js";

export async function listAllergies(req, res, next) {
  try {
    const allergies = await Allergy.find().sort({ category: 1, name: 1 });
    res.json({ allergies });
  } catch (error) {
    next(error);
  }
}

export async function createAllergy(req, res, next) {
  try {
    const allergy = await Allergy.create(req.body);
    res.status(201).json({ allergy });
  } catch (error) {
    next(error);
  }
}

export async function updateAllergy(req, res, next) {
  try {
    const allergy = await Allergy.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!allergy) {
      res.status(404);
      throw new Error("Allergy not found");
    }

    res.json({ allergy });
  } catch (error) {
    next(error);
  }
}

export async function deleteAllergy(req, res, next) {
  try {
    const allergy = await Allergy.findByIdAndDelete(req.params.id);

    if (!allergy) {
      res.status(404);
      throw new Error("Allergy not found");
    }

    res.json({ message: "Allergy deleted" });
  } catch (error) {
    next(error);
  }
}
