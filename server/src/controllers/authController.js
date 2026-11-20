import User from "../models/User.js";
import { createToken } from "../utils/token.js";

function sanitizeUser(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    allergies: user.allergies
  };
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error("Name, email, and password are required");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409);
      throw new Error("Email is already registered");
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({ name, email, passwordHash });

    res.status(201).json({
      user: sanitizeUser(user),
      token: createToken(user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate("allergies.allergy");

    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    res.json({
      user: sanitizeUser(user),
      token: createToken(user._id)
    });
  } catch (error) {
    next(error);
  }
}

export async function me(req, res) {
  await req.user.populate("allergies.allergy");
  res.json({ user: sanitizeUser(req.user) });
}
