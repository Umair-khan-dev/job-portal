import express from "express";
import {
  getJobs,
  getAllJobsAdmin,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", getJobs);
router.get("/admin/all", protect, adminOnly, getAllJobsAdmin);
router.get("/:id", getJobById);
router.post("/", protect, adminOnly, createJob);
router.put("/:id", protect, adminOnly, updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

export default router;
