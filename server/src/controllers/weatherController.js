import { getOpenWeatherAdvice } from "../services/openWeatherService.js";

export async function getWeatherAdvice(req, res, next) {
  try {
    const city = req.query.city || "Lahore";
    const result = await getOpenWeatherAdvice(city);
    res.json(result);
  } catch (error) {
    next(error);
  }
}
