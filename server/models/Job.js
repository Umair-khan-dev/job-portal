import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    requiredSkills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ["entry", "junior", "mid", "senior", "lead"],
      default: "mid",
    },
    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    location: { type: String, required: true },
    employmentType: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "On-site",
    },
    isPublished: { type: Boolean, default: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
