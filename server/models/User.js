import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    role: {
      type: String,
      enum: ["admin", "candidate"],
      default: "candidate",
    },
    phone: { type: String, default: "" },
    skills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead", ""],
      default: "",
    },
    resume: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
