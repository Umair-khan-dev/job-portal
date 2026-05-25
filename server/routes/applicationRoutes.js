import express from "express";
import {
  applyToJob,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
  getDashboardStats,
  getATSResults,
} from "../controllers/applicationController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

// Specific routes first (order matters)
router.get("/my", protect, getMyApplications);
router.get("/ats", protect, adminOnly, getATSResults);
router.get("/dashboard/stats", protect, adminOnly, getDashboardStats);
router.post("/apply/:jobId", protect, applyToJob);
router.patch("/:id/status", protect, adminOnly, updateApplicationStatus);
router.get("/", protect, adminOnly, getAllApplications);

export default router;
