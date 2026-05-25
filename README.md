# Job Portal System (MERN Stack)

ATS-enabled job portal per the project requirements document.

## Features

- **Authentication**: JWT, bcrypt, roles (admin / candidate)
- **Job management**: Create, edit, delete, publish/unpublish jobs
- **Applications**: One-click apply with profile + resume
- **ATS scoring**: Skills (50%), experience (30%), keywords (20%)
- **Admin dashboard**: Stats, applications, shortlist/reject, ATS rankings
- **File uploads**: Resume (PDF/DOCX), profile image (JPG/PNG)
- **Job search**: Keyword, location, type, experience, salary, skills

## Setup

### 1. MongoDB

Install and run MongoDB locally, or use MongoDB Atlas and set `MONGODB_URI`.

### 2. Backend

```bash
cd server
cp .env.example .env
npm install
npm run dev
```

Server runs at `http://localhost:5000`

### 3. Frontend

```bash
cd client
cp .env.example .env
npm install
npm run dev
```

Client runs at `http://localhost:5173`

## Usage

1. **Register** as **Administrator** to post jobs, or **Job Seeker** to apply.
2. **Candidates**: Complete profile, upload resume & skills, browse jobs, apply.
3. **Admins**: Create jobs from Admin → Create Job, review applications and ATS scores.

## API Overview

| Endpoint | Description |
|----------|-------------|
| `POST /api/auth/register` | Register |
| `POST /api/auth/login` | Login |
| `GET /api/jobs` | Public job listings + filters |
| `POST /api/jobs` | Create job (admin) |
| `POST /api/applications/apply/:jobId` | Apply (candidate) |
| `GET /api/applications/ats` | ATS rankings (admin) |
