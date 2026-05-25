import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import { calculateATSScore } from "../utils/atsScore.js";

export const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res
        .status(403)
        .json({ message: "Only job seekers can apply. Register as Candidate." });
    }

    const job = await Job.findById(req.params.jobId);
    if (!job || !job.isPublished) {
      return res.status(404).json({ message: "Job not available" });
    }

    const candidate = await User.findById(req.user._id);
    if (!candidate) {
      return res.status(401).json({ message: "User not found" });
    }

    const existing = await Application.findOne({
      job: job._id,
      candidate: candidate._id,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    const { fullName, email, phone } = req.body;
    const resume = req.body.resume || candidate.resume;
    const profilePicture =
      req.body.profilePicture || candidate.profilePicture;

    if (!resume) {
      return res.status(400).json({
        message: "Resume is required. Upload it on this page or in Profile.",
      });
    }

    const ats = calculateATSScore(candidate, job);

    const application = await Application.create({
      job: job._id,
      candidate: candidate._id,
      fullName: fullName || candidate.name,
      email: email || candidate.email,
      phone: phone || candidate.phone,
      resume,
      profilePicture,
      ...ats,
    });

    const populated = await Application.findById(application._id)
      .populate("job", "title location")
      .populate("candidate", "name email");

    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    res.status(500).json({ message: err.message });
  }
};

export const getMyApplications = async (req, res) => {
  try {
    if (req.user.role !== "candidate") {
      return res.status(403).json({
        message: "My Applications is for job seekers only.",
        applications: [],
      });
    }

    const apps = await Application.find({ candidate: req.user._id })
      .populate(
        "job",
        "title location employmentType experienceLevel requiredSkills"
      )
      .sort({ createdAt: -1 });

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllApplications = async (req, res) => {
  try {
    const filter = req.query.jobId ? { job: req.query.jobId } : {};
    const apps = await Application.find(filter)
      .populate("job", "title location requiredSkills")
      .populate("candidate", "name email skills experienceLevel")
      .sort({ atsScore: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "shortlisted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const app = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("job", "title")
      .populate("candidate", "name email");

    if (!app) return res.status(404).json({ message: "Application not found" });
    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    const [totalJobs, totalApplications, applications] = await Promise.all([
      Job.countDocuments(),
      Application.countDocuments(),
      Application.find()
        .populate("job", "title")
        .sort({ atsScore: -1 })
        .limit(10),
    ]);

    res.json({ totalJobs, totalApplications, topApplications: applications });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getATSResults = async (req, res) => {
  try {
    const apps = await Application.find()
      .populate("job", "title requiredSkills")
      .populate("candidate", "name email skills")
      .sort({ atsScore: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
