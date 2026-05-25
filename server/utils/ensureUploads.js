import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsRoot = path.join(__dirname, "..", "uploads");

const MINIMAL_PDF = `%PDF-1.4
1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj
2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj
3 0 obj<< /Type /Page /MediaBox [0 0 612 792] /Parent 2 0 R >>endobj
xref
0 4
0000000000 65535 f 
0000000009 00000 n 
0000000052 00000 n 
0000000101 00000 n 
trailer<< /Size 4 /Root 1 0 R >>
startxref
178
%%EOF`;

export function ensureUploadDirs() {
  ["resumes", "images"].forEach((dir) => {
    const full = path.join(uploadsRoot, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
  });

  const placeholder = path.join(uploadsRoot, "resumes", "test-resume.pdf");
  if (!fs.existsSync(placeholder)) {
    fs.writeFileSync(placeholder, MINIMAL_PDF, "utf8");
  }
}

export function resolveUploadPath(urlPath) {
  if (!urlPath || !urlPath.startsWith("/uploads/")) return null;
  const relative = urlPath.replace(/^\/uploads\//, "");
  const full = path.join(uploadsRoot, relative);
  if (!full.startsWith(uploadsRoot)) return null;
  return fs.existsSync(full) ? full : null;
}
