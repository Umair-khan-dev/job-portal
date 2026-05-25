import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsRoot = path.join(__dirname, "..", "uploads");

["resumes", "images"].forEach((dir) => {
  const full = path.join(uploadsRoot, dir);
  if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const storage = (folder, allowed) =>
  multer.diskStorage({
    destination: (_req, _file, cb) => {
      cb(null, path.join(uploadsRoot, folder));
    },
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
    },
  });

const fileFilter =
  (allowed) =>
  (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error(`Allowed formats: ${allowed.join(", ")}`));
  };

export const uploadResume = multer({
  storage: storage("resumes", [".pdf", ".docx"]),
  fileFilter: fileFilter([".pdf", ".docx"]),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadImage = multer({
  storage: storage("images", [".jpg", ".jpeg", ".png"]),
  fileFilter: fileFilter([".jpg", ".jpeg", ".png"]),
  limits: { fileSize: 2 * 1024 * 1024 },
});
