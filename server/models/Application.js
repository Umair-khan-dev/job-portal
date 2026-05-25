import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    resume: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected"],
      default: "pending",
    },
    atsScore: { type: Number, default: 0 },
    skillsMatch: { type: Number, default: 0 },
    experienceMatch: { type: Number, default: 0 },
    keywordMatch: { type: Number, default: 0 },
    missingSkills: [{ type: String }],
  },
  { timestamps: true }
);

applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

export default mongoose.model("Application", applicationSchema);
