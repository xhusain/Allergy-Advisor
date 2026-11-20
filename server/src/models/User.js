import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userAllergySchema = new mongoose.Schema(
  {
    allergy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Allergy",
      required: true
    },
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe"],
      default: "moderate"
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    allergies: [userAllergySchema]
  },
  { timestamps: true }
);

userSchema.methods.matchPassword = function matchPassword(password) {
  return bcrypt.compare(password, this.passwordHash);
};

userSchema.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 12);
};

const User = mongoose.model("User", userSchema);

export default User;
