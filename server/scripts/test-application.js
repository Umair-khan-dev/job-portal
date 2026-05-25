/**
 * API test: register users, create job, submit application, verify received.
 * Run: node scripts/test-application.js
 * Requires MongoDB running and server NOT required (connects to DB directly + HTTP if server up).
 */

import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { ensureUploadDirs } from "../utils/ensureUploads.js";

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), "..", ".env") });
ensureUploadDirs();

const BASE = process.env.API_URL || "http://localhost:5000/api";
const ts = Date.now();

async function request(method, url, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}${url}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `${method} ${url} → ${res.status}`);
  }
  return data;
}

async function run() {
  console.log("Job Portal API test\n");

  try {
    await fetch(`${BASE.replace("/api", "")}/api/health`);
  } catch {
    console.error("Server not running. Start: cd server && npm run dev");
    process.exit(1);
  }

  const admin = await request("POST", "/auth/register", {
    name: "Test Admin",
    email: `admin${ts}@test.com`,
    password: "test123",
    role: "admin",
  });
  console.log("✓ Admin registered");

  const candidate = await request("POST", "/auth/register", {
    name: "Test Candidate",
    email: `candidate${ts}@test.com`,
    password: "test123",
    role: "candidate",
  });
  console.log("✓ Candidate registered");

  await request(
    "PUT",
    "/auth/profile",
    {
      phone: "03001234567",
      skills: "javascript, react, web developer",
      experienceLevel: "senior",
      resume: "/uploads/resumes/test-resume.pdf",
    },
    candidate.token
  );
  console.log("✓ Candidate profile updated with resume");

  const job = await request(
    "POST",
    "/jobs",
    {
      title: "Web Developer",
      description: "Build web apps with React and Node",
      requiredSkills: "javascript, react, web developer",
      experienceLevel: "senior",
      salaryMin: 30000,
      salaryMax: 50000,
      location: "Islamabad",
      employmentType: "Remote",
      isPublished: true,
    },
    admin.token
  );
  console.log("✓ Job created:", job.title);

  const application = await request(
    "POST",
    `/applications/apply/${job._id}`,
    {
      fullName: candidate.name,
      email: candidate.email,
      phone: "03001234567",
      resume: "/uploads/resumes/test-resume.pdf",
    },
    candidate.token
  );
  console.log("✓ Application sent, ATS score:", application.atsScore);

  const myApps = await request("GET", "/applications/my", null, candidate.token);
  if (!Array.isArray(myApps) || myApps.length === 0) {
    throw new Error("My applications empty after apply");
  }
  console.log("✓ Candidate sees", myApps.length, "application(s)");

  const received = await request("GET", "/applications", null, admin.token);
  if (!Array.isArray(received) || received.length === 0) {
    throw new Error("Admin received applications empty");
  }
  console.log("✓ Admin received", received.length, "application(s)");

  const jobsRes = await request("GET", "/jobs?keyword=web");
  const jobCount = Array.isArray(jobsRes) ? jobsRes.length : jobsRes.jobs?.length ?? 0;
  console.log("✓ Job search found", jobCount, "job(s)");

  console.log("\nAll tests passed.");
}

run().catch((err) => {
  console.error("\nTest failed:", err.message);
  process.exit(1);
});
