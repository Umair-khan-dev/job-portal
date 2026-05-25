import express from "express";
import { protect } from "../middleware/auth.js";
import { uploadResume, uploadImage } from "../middleware/upload.js";
import {
  uploadResumeFile,
  uploadProfileImage,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/resume",
  protect,
  uploadResume.single("resume"),
  uploadResumeFile
);
router.post(
  "/profile-image",
  protect,
  uploadImage.single("profilePicture"),
  uploadProfileImage
);

export default router;
